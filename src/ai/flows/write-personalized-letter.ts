'use server';

/**
 * @fileOverview AI agent for generating personalized letters with specified tone and purpose.
 *
 * - writePersonalizedLetter - Function to generate a personalized letter.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WritePersonalizedLetterInputSchema = z.object({
  tone: z
    .string()
    .describe("The desired tone of the letter (e.g., formal, informal, friendly)."),
  purpose: z
    .string()
    .describe("The purpose of the letter (e.g., thank you, invitation, complaint)."),
  recipientName: z.string().describe("The name of the recipient."),
  letterBody: z.string().describe("The main content of the letter."),
});
export type WritePersonalizedLetterInput = z.infer<
  typeof WritePersonalizedLetterInputSchema
>;

const WritePersonalizedLetterOutputSchema = z.object({
  personalizedLetter: z
    .string()
    .describe("The AI-generated personalized letter."),
});
type WritePersonalizedLetterOutput = z.infer<
  typeof WritePersonalizedLetterOutputSchema
>;

export async function writePersonalizedLetter(
  input: WritePersonalizedLetterInput
): Promise<WritePersonalizedLetterOutput> {
  return writePersonalizedLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writePersonalizedLetterPrompt',
  input: {schema: WritePersonalizedLetterInputSchema},
  output: {schema: WritePersonalizedLetterOutputSchema},
  prompt: `You are an AI skilled in crafting personalized letters.

  Based on the user's input, create a letter that is tailored to the recipient,
  purpose, and tone. Ensure that the letter sounds natural and avoids typical AI-sounding phrases.

  Recipient Name: {{{recipientName}}}
  Purpose: {{{purpose}}}
  Tone: {{{tone}}}
  Letter Body: {{{letterBody}}}

  Generate a JSON object containing the complete, personalized letter in a field called 'personalizedLetter'.
  `,
});

const writePersonalizedLetterFlow = ai.defineFlow(
  {
    name: 'writePersonalizedLetterFlow',
    inputSchema: WritePersonalizedLetterInputSchema,
    outputSchema: WritePersonalizedLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
