
'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying the value of an item using AI.
 *
 * The flow takes an image of an item, its condition, the source context, and an optional asking price.
 * It returns its estimated "min" and "max" resale value, and if an asking price is provided,
 * it also calculates the potential profit opportunity. It now also includes an authenticity check.
 *
 * @exported verifyItemValue - An async function that initiates the item value verification flow.
 * @exported VerifyItemValueInput - The input type for the verifyItemValue function.
 * @exported VerifyItemValueOutput - The output type for the verifyItemValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { scoutFakes } from './scout-fakes';

const VerifyItemValueInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the item to be valued, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  itemName: z.string().optional().describe("The name/description of the item if no photo is provided."),
    condition: z.enum([
        "New (Sealed)",
        "Excellent (Like New)",
        "Good (Used, Working)",
        "Fair (Scratches/Minor Issue)",
    ]).describe("The item's physical condition."),
    source: z.enum([
        "Personal Garage/Storage",
        "Yard Sale/Flea Market (Buying)",
        "Retail Store (Walmart/Target)",
        "Online Marketplace (eBay/Poshmark)",
    ]).describe("The context of the valuation (e.g., where the user is)."),
    askingPrice: z.number().optional().describe("The price the user is seeing for the item.")
});
export type VerifyItemValueInput = z.infer<typeof VerifyItemValueInputSchema>;

const ProfitAnalysisSchema = z.object({
    estimatedNetResale: z.number().describe("The estimated resale value after a 15% marketplace fee."),
    potentialGrossProfit: z.number().describe("The potential gross profit if sold at max resale value."),
    potentialRoiPercent: z.number().describe("The potential return on investment percentage."),
    verdict: z.string().describe("A short verdict on whether it's a good deal.")
});

const AuthenticitySchema = z.object({
    verdict: z.enum(["AUTHENTIC", "POSSIBLE_FAKE", "NOT_APPLICABLE", "LOW_RISK"]),
    confidenceScore: z.number(),
    reasons: z.array(z.string()),
});

const VerifyItemValueOutputSchema = z.object({
  itemName: z.string().describe("The name of the item identified in the photo."),
  minResaleValue: z
    .number()
    .describe(
      'The calculated minimum resale value for a quick sale.'
    ),
  maxResaleValue: z
    .number()
    .describe(
      'The calculated maximum resale value for a fair market price.'
    ),
  justification: z
    .string()
    .describe(
      'A brief justification for the estimated market value, or a disclaimer if not resellable.'
    ),
  profitAnalysis: ProfitAnalysisSchema.optional().describe("An analysis of the profit opportunity if an asking price is provided."),
  authenticity: AuthenticitySchema.describe("The result of the authenticity check."),
});
export type VerifyItemValueOutput = z.infer<typeof VerifyItemValueOutputSchema>;


const CORE_MARKET_DATA: Record<string, { avg_resale: number; is_high_risk: boolean; retail?: number }> = {
    "Gaming Laptop (Mid-Tier)": { avg_resale: 650.00, is_high_risk: false },
    "KitchenAid Stand Mixer (Used)": { avg_resale: 150.00, is_high_risk: false },
    "Vintage Vinyl Record (Specific Title)": { avg_resale: 15.00, is_high_risk: false },
    "Unopened Lego Set (Current)": { avg_resale: 80.00, is_high_risk: false },
    "Proenza Schouler PS1 Tiny Bag": { avg_resale: 450.00, is_high_risk: false },
    "iPhone 14 Plus (Used)": { avg_resale: 341.00, is_high_risk: false },
    "iPhone 13 pro max": { avg_resale: 300.00, is_high_risk: false },
    "Hermes Birkin Bag": { avg_resale: 9000.00, is_high_risk: false },
    "Rolex Submariner Watch": { avg_resale: 12000.00, is_high_risk: false },
    "Used Bike Helmet": { avg_resale: 0, is_high_risk: true, retail: 100.00 },
    "Opened Vitamin Supplements": { avg_resale: 0, is_high_risk: true, retail: 45.00 }
};

const CONDITION_MULTIPLIERS: Record<string, number> = {
    "New (Sealed)": 1.25,
    "Excellent (Like New)": 1.05,
    "Good (Used, Working)": 0.90,
    "Fair (Scratches/Minor Issue)": 0.70,
};

const SOURCE_MULTIPLIERS: Record<string, number> = {
    "Personal Garage/Storage": 0.95,
    "Yard Sale/Flea Market (Buying)": 0.65,
    "Retail Store (Walmart/Target)": 1.20,
    "Online Marketplace (eBay/Poshmark)": 1.00,
};


export async function verifyItemValue(
  input: VerifyItemValueInput
): Promise<VerifyItemValueOutput> {
  return verifyItemValueFlow(input);
}


const identifyItemPrompt = ai.definePrompt({
    name: 'identifyItemPrompt',
    input: { schema: z.object({
        photoDataUri: z.string().optional(),
        itemName: z.string().optional(),
        marketDataKeys: z.array(z.string()),
    })},
    output: { schema: z.object({
        identifiedItemName: z.string().describe('The name of the item that is the best match from the provided market data keys.')
    })},
    prompt: `You are an expert at identifying items from images or text descriptions. Based on the user's input, identify the single best matching item from the following list of known items.

Known Items:
{{#each marketDataKeys}}- {{{this}}}
{{/each}}

User Input:
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}
{{#if itemName}}
Item Name: {{{itemName}}}
{{/if}}

Respond with the identified item name in the requested JSON format.
`,
});


const justifyValuePrompt = ai.definePrompt({
    name: 'justifyValuePrompt',
    input: { schema: z.any() },
    output: { schema: z.object({ justification: z.string() }) },
    prompt: `You are a pricing analyst. Given the following data, write a brief, human-like justification for the final price. If the price is based on retail, state that clearly.

Data: {{{jsonString}}}

Example justification: "Based on a market average of $150.00 for this item, we've adjusted for its 'Good' condition. The price range reflects what you could realistically get in today's market."
Example justification for retail: "***NO RESALE VALUE.*** Due to hygiene/safety rules, this item cannot be resold. The price shown is the estimated original retail value."

Provide only the justification string in the requested JSON format.`
});



const verifyItemValueFlow = ai.defineFlow(
  {
    name: 'verifyItemValueFlow',
    inputSchema: VerifyItemValueInputSchema,
    outputSchema: VerifyItemValueOutputSchema,
  },
  async (input) => {
    // 1. Use AI to identify the item from the image/text against our market data keys.
    const identificationResponse = await identifyItemPrompt({
        photoDataUri: input.photoDataUri,
        itemName: input.itemName,
        marketDataKeys: Object.keys(CORE_MARKET_DATA),
    });

    const identifiedItemName = identificationResponse.output!.identifiedItemName;
    const itemMarketData = CORE_MARKET_DATA[identifiedItemName];

    if (!itemMarketData) {
        throw new Error(`Could not find market data for identified item: ${identifiedItemName}`);
    }

    let minResaleValue: number;
    let maxResaleValue: number;
    let isRetailFallback = false;

    // 2. Perform calculations directly in code
    if (itemMarketData.is_high_risk && input.condition !== 'New (Sealed)') {
        minResaleValue = itemMarketData.retail || 0;
        maxResaleValue = itemMarketData.retail || 0;
        isRetailFallback = true;
    } else {
        const conditionMultiplier = CONDITION_MULTIPLIERS[input.condition] || 1.0;
        const sourceMultiplier = SOURCE_MULTIPLIERS[input.source] || 1.0;
        
        const baseRsp = itemMarketData.avg_resale * conditionMultiplier;
        
        minResaleValue = baseRsp * 0.85;
        maxResaleValue = baseRsp * 1.15 * sourceMultiplier;
        
        if (minResaleValue > maxResaleValue) {
            minResaleValue = maxResaleValue * 0.9;
        }
    }
    
    // 3. Perform profit analysis if asking price is provided
    let profitAnalysis: z.infer<typeof ProfitAnalysisSchema> | undefined = undefined;
    if (input.askingPrice !== undefined && input.askingPrice > 0) {
        if (isRetailFallback) {
             profitAnalysis = {
                estimatedNetResale: 0,
                potentialGrossProfit: -input.askingPrice,
                potentialRoiPercent: -100,
                verdict: "DO NOT BUY. This item is not resellable."
            };
        } else {
            const estimatedNetResale = maxResaleValue * (1 - 0.15); // Assume 15% fee
            const potentialGrossProfit = estimatedNetResale - input.askingPrice;
            const potentialRoiPercent = (potentialGrossProfit / input.askingPrice) * 100;
            
            let verdict = "NO DEAL. Asking price is too high.";
            if (potentialRoiPercent > 50) {
                verdict = "BUY NOW! Major Profit Opportunity.";
            } else if (potentialRoiPercent > 0) {
                verdict = "Good Deal, worth the flip.";
            } else if (potentialGrossProfit >= -10) {
                verdict = "Break-even risk. Only buy if condition is perfect.";
            }

            profitAnalysis = {
                estimatedNetResale,
                potentialGrossProfit,
                potentialRoiPercent,
                verdict
            };
        }
    }
    
    // 4. Run Fake Scouter in parallel
    const authenticityResult = await scoutFakes({
        itemName: identifiedItemName,
        checkLocation: input.source.includes("Market") ? "Auction Photo" : "In-Hand Scan"
    });

    // 5. Generate final justification with AI
    const justificationResponse = await justifyValuePrompt({
        jsonString: JSON.stringify({
            identifiedItemName,
            condition: input.condition,
            source: input.source,
            minResaleValue: minResaleValue,
            maxResaleValue: maxResaleValue,
            isRetailFallback,
        })
    });
    
    return {
        itemName: identifiedItemName,
        minResaleValue: parseFloat(minResaleValue.toFixed(2)),
        maxResaleValue: parseFloat(maxResaleValue.toFixed(2)),
        justification: justificationResponse.output!.justification,
        profitAnalysis: profitAnalysis,
        authenticity: authenticityResult,
    };
  }
);
