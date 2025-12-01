'use server';

/**
 * @fileOverview Defines a Genkit flow for selecting an Ambassador based on item details and user action.
 *
 * - selectAmbassador - A function that uses AI to recommend Ambassadors.
 * - AmbassadorFlowInput - The input type for the selectAmbassador function.
 * - AmbassadorListOutput - The return type from the flow, containing a list of ambassadors.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  AmbassadorListSchema,
  type AmbassadorListOutput,
} from '@/ai/schemas/ambassador-schema';
import { ListingDetailsSchema } from '@/ai/schemas/listing-details';

// The input combines listing details with the user's chosen action.
export const AmbassadorFlowInputSchema = ListingDetailsSchema.extend({
  action: z
    .enum(['SELL', 'DONATE'])
    .describe('The user’s chosen action: SELL (Consignment) or DONATE.'),
});
export type AmbassadorFlowInput = z.infer<typeof AmbassadorFlowInputSchema>;


/**
 * In a real app, this would query a database/CRM to find ambassadors
 * based on location and specialty.
 */
async function getRawAmbassadorData(area: string, itemType: string) {
  console.log(`Querying ambassadors for area: ${area} and item: ${itemType}`);
  // Mock list of potential ambassadors
  return [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcde0',
      name: 'Maria Rodriguez',
      area: 'Austin, TX',
      specialty: 'Mid-Century Furniture',
      rating: 4.9,
      expectedPickupTime: '2 days',
    },
    {
      id: 'f1g2h3i4-j5k6-7890-1234-567890abcde1',
      name: 'David Chen',
      area: 'Central Texas',
      specialty: 'Electronics and Gadgets',
      rating: 4.5,
      expectedPickupTime: '4 days',
    },
    {
      id: 'k1l2m3n4-o5p6-7890-1234-567890abcde2',
      name: 'Sarah O’Connell',
      area: 'Round Rock',
      specialty: 'High-Value Clothing & Bags',
      rating: 5.0,
      expectedPickupTime: '1-2 weeks',
    },
  ];
}


export async function selectAmbassador(
  input: AmbassadorFlowInput
): Promise<AmbassadorListOutput> {
  return selectAmbassadorFlow(input);
}


const selectAmbassadorPrompt = ai.definePrompt({
    name: 'selectAmbassadorPrompt',
    input: { schema: AmbassadorFlowInputSchema },
    output: { schema: AmbassadorListSchema },
    prompt: `
      The user has decided to proceed with a {{action}} action for the following item:
      Title: {{title}}
      Description: {{description}}
      Price: {{price}}

      Here is a list of raw Ambassador candidates and their profiles:
      {{{rawAmbassadors}}}

      Select up to 3 of the best Ambassadors from the raw list based on their specialty and service area. 
      For the expectedPickupTime, refine the rough estimate based on the chosen action: 
      - If 'SELL', prioritize the higher rated and relevant specialty.
      - If 'DONATE', prioritize the fastest pickup time.

      Strictly return the final, filtered, and refined list in the requested JSON schema.
    `,
});


const selectAmbassadorFlow = ai.defineFlow(
  {
    name: 'selectAmbassadorFlow',
    inputSchema: AmbassadorFlowInputSchema,
    outputSchema: AmbassadorListSchema,
  },
  async (input) => {
    // 1. Get mock data based on item details (item name/category from the title)
    // We'll use a simplified area/item type for the mock data function
    const itemType = input.title.split(' ')[0] || 'general';
    const area = 'Austin, TX'; // Assuming we have user location data elsewhere

    const rawAmbassadors = await getRawAmbassadorData(area, itemType);

    // 2. Use the LLM to process and format the raw data into the required structured output.
    const {output} = await selectAmbassadorPrompt({
        ...input,
        rawAmbassadors: JSON.stringify(rawAmbassadors, null, 2),
    });

    // The response.output is a type-safe object thanks to structured output
    return output!;
  }
);
