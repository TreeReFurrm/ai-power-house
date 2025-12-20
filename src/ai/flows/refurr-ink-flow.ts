'use server';
/**
 * @fileOverview AI agent for rephrasing, enhancing, and continuing text.
 *
 * - refurrInk - A function that handles various text manipulations.
 * - RefurrInkInput - The input type for the refurrInk function.
 * - RefurrInkOutput - The return type for the refurrInk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const RefurrInkInputSchema = z.object({
  content: z.string().describe('The current text content.'),
  instruction: z
    .string()
    .describe(
      'The user\'s instruction for what to do with the content.'
    ),
});
export type RefurrInkInput = z.infer<typeof RefurrInkInputSchema>;

export const RefurrInkOutputSchema = z.object({
  updatedContent: z.string().describe('The updated text content.'),
});
export type RefurrInkOutput = z.infer<typeof RefurrInkOutputSchema>;

export async function refurrInk(
  input: RefurrInkInput
): Promise<RefurrInkOutput> {
  return refurrInkFlow(input);
}

const refurrInkPrompt = ai.definePrompt({
  name: 'refurrInkPrompt',
  input: {schema: RefurrInkInputSchema},
  output: {schema: RefurrInkOutputSchema},
  system: `You are ReFURRMed Ink, a sophisticated AI writing assistant. You write in a clean, modern, and engaging tone.
You will be given the current document content and an instruction from the user.
Your task is to update the document content based on the user instruction.
Return ONLY the full, updated document text in the 'updatedContent' field. Do not include conversational filler like "Here is the updated text" or similar chatter.`,
  prompt: `Current Document Content:
\'\'\'
{{{content}}}
\'\'\'

User Instruction: {{{instruction}}}
`,
});

const refurrInkFlow = ai.defineFlow(
  {
    name: 'refurrInkFlow',
    inputSchema: RefurrInkInputSchema,
    outputSchema: RefurrInkOutputSchema,
  },
  async input => {
    const {output} = await refurrInkPrompt(input);
    return output!;
  }
);
