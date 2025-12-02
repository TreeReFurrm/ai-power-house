
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AppraiseLotInputSchema = z.object({
  photoDataUris: z
    .array(z.string())
    .describe(
      "An array of photos of the storage unit or lot, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AppraiseLotInput = z.infer<typeof AppraiseLotInputSchema>;

const IdentifiedItemSchema = z.object({
  itemName: z.string().describe('The name of the identified item.'),
  estimatedValue: z.number().describe('The estimated resale value of this single item.'),
  confidence: z.string().describe("A brief note on the confidence of this item's valuation (e.g., 'High, clearly visible' or 'Low, inferred from box label')."),
});

const AppraiseLotOutputSchema = z.object({
  estimatedLotValueMin: z.number().describe('The low-end estimated resale value for the entire lot.'),
  estimatedLotValueMax: z.number().describe('The high-end estimated resale value for the entire lot.'),
  identifiedItems: z.array(IdentifiedItemSchema).describe('A list of discernible items and their estimated values.'),
  appraisalSummary: z.string().describe("The AI's overall reasoning, including what it could and couldn't see, and any major assumptions made."),
  potentialHiddenGems: z.array(z.string()).describe("A list of potential high-value items that might be hidden or obscured, based on context clues."),
});
export type AppraiseLotOutput = z.infer<typeof AppraiseLotOutputSchema>;


export async function appraiseLot(input: AppraiseLotInput): Promise<AppraiseLotOutput> {
  return appraiseLotFlow(input);
}


const appraiseLotPrompt = ai.definePrompt({
  name: 'appraiseLotPrompt',
  input: { schema: AppraiseLotInputSchema },
  output: { schema: AppraiseLotOutputSchema },
  prompt: `You are an expert appraiser specializing in storage unit auctions and estate cleanouts. You are analyzing photos of a lot to estimate its total resale value.

**Your Task:**
1.  **Analyze the Photos:** Scrutinize all provided images to identify as many items as possible.
2.  **Estimate Individual Values:** Assign a realistic, second-hand market resale value for each item you can identify.
3.  **Use Human-Like Reasoning (CRITICAL):**
    *   **Acknowledge Uncertainty:** If you cannot see inside a box or container, state that clearly in your summary.
    *   **Make Inferences:** If a box is labeled (e.g., "Vintage Records," "DC Comics 1989"), infer its potential contents and value range. State your inference clearly (e.g., "A box labeled 'DC Comics 1989' could contain valuable comics, but could also be empty. Value is estimated assuming a modest collection.").
    *   **Identify Potential Gems:** Look for clues that suggest hidden value. Is that a brand name on a dusty box? A piece of furniture from a specific era? List these as 'potential hidden gems'.
4.  **Aggregate and Summarize:**
    *   Calculate the total minimum and maximum estimated value for the entire lot. The range should be wide enough to account for your uncertainty.
    *   Create a list of the most significant items you identified.
    *   Write a final \`appraisalSummary\` that explains your overall assessment, what you couldn't see, and the key drivers of the lot's value.

**Example Reasoning:**
"The lot contains a visible mid-century modern dresser, which is the main value driver. There are several sealed totes I cannot see inside, so their value is not included. However, a box labeled 'Video Games' is estimated to contain a small collection of older games, adding to the low-end value. The main risk is the condition of items in the sealed boxes."

**Photos of the lot:**
{{#each photoDataUris}}
- Image {{@index}}: {{media url=this}}
{{/each}}

Please provide your full analysis in the requested JSON format.`,
});


const appraiseLotFlow = ai.defineFlow(
  {
    name: 'appraiseLotFlow',
    inputSchema: AppraiseLotInputSchema,
    outputSchema: AppraiseLotOutputSchema,
  },
  async (input) => {
    const {output} = await appraiseLotPrompt(input);
    if (!output) {
      throw new Error('Failed to get a structured response from the AI.');
    }
    return output;
  }
);
