'use server';

/**
 * @fileOverview This file defines the AI price suggestion flow for the ValuScan app.
 *
 * It takes an item description and photos as input and returns an AI-generated price suggestion.
 *
 * @exports {
 *   getPriceSuggestion,
 *   AiPriceSuggestionInput,
 *   AiPriceSuggestionOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPriceSuggestionInputSchema = z.object({
  description: z.string().describe('The description of the item.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiPriceSuggestionInput = z.infer<typeof AiPriceSuggestionInputSchema>;

const AiPriceSuggestionOutputSchema = z.object({
  itemName: z.string().describe('The name of the item identified in the photo.'),
  minPrice: z.number().describe('The realistic minimum selling price for a quick sale.'),
  maxPrice: z.number().describe('The realistic maximum selling price for fair market value.'),
  justification: z
    .string()
    .describe('A brief justification for the price range or a disclaimer if the item is not resellable.'),
  price_type: z.enum(["Resale Value", "Retail Value"]).describe("Indicates if the price is for resale or retail.")
});
export type AiPriceSuggestionOutput = z.infer<typeof AiPriceSuggestionOutputSchema>;


export async function getPriceSuggestion(
  input: AiPriceSuggestionInput
): Promise<AiPriceSuggestionOutput> {
  return aiPriceSuggestionFlow(input);
}

const aiPriceSuggestionPrompt = ai.definePrompt({
  name: 'aiPriceSuggestionPrompt',
  input: {schema: AiPriceSuggestionInputSchema},
  output: {schema: AiPriceSuggestionOutputSchema},
  prompt: `You are an expert, data-driven AI pricing engine for secondhand goods. Your goal is to provide a realistic, "no-fluff" selling price range based on simulated sales data, AND to identify items that have NO resale value due to safety or hygiene reasons.

First, identify the item in the provided photo and description.

Then, use the following simulated database to determine the price range. The data represents (Average Selling Price, 90th Percentile Max Price, is_high_risk_flag).

AI_PRICE_DATA = {
    "Vintage iPod Classic (5th Gen)": (95.00, 150.00, false),
    "Used PlayStation 4 (Standard)": (180.00, 250.00, false),
    "KitchenAid Stand Mixer (Used)": (150.00, 220.00, false),
    "Unopened Lego Set (Specific #)": (50.00, 65.00, false),
    "Old T-Shirt (Generic)": (3.00, 8.00, false),
    "Open Mattress Pad (Used)": (0, 150.00, true),
    "Opened Vitamin Supplements": (0, 45.00, true),
    "Used Bike Helmet": (0, 100.00, true)
}

**REAL HUMAN LOGIC CHECK:**
If the identified item is marked as 'is_high_risk: true' and the description implies it is used/opened:
1. Set 'min_price' and 'max_price' to the retail value (the second price in the tuple).
2. Set 'price_type' to "Retail Value".
3. Formulate a 'justification' that starts with "***NO RESALE VALUE.***" and clearly explains that hygiene, safety, or consumable regulations prevent resale. State that the price shown is the estimated RETAIL value for reference only.

**Standard Resale Scenario:**
If the identified item is NOT high-risk:
1.  Calculate the 'min_price' as 75% of the Average Selling Price (the first price in the tuple).
2.  Use the 90th Percentile price as the 'max_price'.
3.  Set 'price_type' to "Resale Value".
4.  Formulate a 'justification' sentence explaining the price is based on completed sales of similar items.
5.  If the item is not in the database, use your general knowledge to estimate a realistic min and max price and create a justification.

Respond with the identified item name, min/max prices, the justification, and the price_type.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const aiPriceSuggestionFlow = ai.defineFlow(
  {
    name: 'aiPriceSuggestionFlow',
    inputSchema: AiPriceSuggestionInputSchema,
    outputSchema: AiPriceSuggestionOutputSchema,
  },
  async input => {
    const {output} = await aiPriceSuggestionPrompt(input);
    return output!;
  }
);
