'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a complete, optimized listing package.
 * It orchestrates calls to pricing and authenticity flows to create a rich data package.
 *
 * - generateListingDetails - A function that uses AI to generate an optimized listing package for an item.
 * - GenerateListingDetailsInput - The input type for the generateListingDetails function.
 * - GenerateListingDetailsOutput - The return type for the generateListingDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getPriceSuggestion, AiPriceSuggestionOutput } from './ai-price-suggestions';
import { scoutFakes, ScoutFakesOutput } from './scout-fakes';

const GenerateListingDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalDetails: z.string().optional().describe('Any additional details about the item.'),
});
export type GenerateListingDetailsInput = z.infer<typeof GenerateListingDetailsInputSchema>;

const GenerateListingDetailsOutputSchema = z.object({
  title: z.string().describe('The generated SEO-optimized title for the listing.'),
  description: z.string().describe('The generated detailed description for the listing, including authenticity notes.'),
  tags: z.array(z.string()).describe('An array of relevant search tags for the listing.'),
  suggestedPrice: z.number().describe('The AI-suggested listing price.'),
  minPrice: z.number().describe('The floor price for the item.'),
  maxPrice: z.number().describe('The ceiling price for the item.'),
});
export type GenerateListingDetailsOutput = z.infer<typeof GenerateListingDetailsOutputSchema>;


export async function generateListingDetails(
  input: GenerateListingDetailsInput
): Promise<GenerateListingDetailsOutput> {
  return generateListingDetailsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateListingDetailsPrompt',
  input: {schema: z.object({
    priceSuggestion: AiPriceSuggestionOutput.json(),
    authenticityCheck: ScoutFakesOutput.json(),
    additionalDetails: z.string().optional(),
  })},
  output: {schema: GenerateListingDetailsOutputSchema},
  prompt: `You are an expert e-commerce assistant. Your task is to generate a complete, optimized listing package for an item to be sold on a platform like eBay or Poshmark.

Use the provided AI-generated data to create an SEO-optimized title, a compelling description, and relevant tags.

**AI Pricing Data:**
- Item Name: {{{priceSuggestion.itemName}}}
- Suggested Price Range: \${{{priceSuggestion.minPrice}}} - \${{{priceSuggestion.maxPrice}}}
- Justification: {{{priceSuggestion.justification}}}

**AI Authenticity Check:**
- Verdict: {{{authenticityCheck.verdict}}}
- Confidence: {{{authenticityCheck.confidenceScore}}}%
- Reasons: {{{authenticityCheck.reasons}}}

**User's Additional Details:**
{{{additionalDetails}}}

**Instructions:**
1.  **Title:** Create a concise, SEO-friendly title. Include the item name, brand (if known), and key features. If the item is authentic, start the title with "AUTHENTIC".
2.  **Description:** Write a compelling paragraph.
    - Start by describing the item.
    - Incorporate the AI's pricing justification naturally.
    - **Crucially, include the results of the authenticity check.** Mention the verdict and confidence score to build trust.
3.  **Tags:** Provide a list of 5-7 relevant keywords for discoverability.
4.  **Suggested Price**: Use the 'maxPrice' from the AI pricing data as the suggested listing price. Also return the min and max price.

Respond only with the structured JSON output.`,
});

const generateListingDetailsFlow = ai.defineFlow(
  {
    name: 'generateListingDetailsFlow',
    inputSchema: GenerateListingDetailsInputSchema,
    outputSchema: GenerateListingDetailsOutputSchema,
  },
  async (input) => {
    // 1. Get Price Suggestion
    const priceSuggestion = await getPriceSuggestion({
        photoDataUri: input.photoDataUri,
        description: input.additionalDetails || "No additional details provided.",
    });

    // 2. Run Authenticity Check
    const authenticityCheck = await scoutFakes({
        itemName: priceSuggestion.itemName,
        checkLocation: "In-Hand Scan"
    });

    // 3. Generate the final package
    const {output} = await prompt({
        priceSuggestion,
        authenticityCheck,
        additionalDetails: input.additionalDetails,
    });
    
    if (!output) {
        throw new Error("Failed to generate listing details package.");
    }

    return output;
  }
);
