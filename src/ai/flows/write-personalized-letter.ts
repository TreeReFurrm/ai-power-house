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

const WritePersonalizedLetterOutputSchema = z.object({
  personalizedLetter: z
    .string()
    .describe("The AI-generated personalized letter."),
});

export async function writePersonalizedLetter(
  input: z.infer<typeof WritePersonalizedLetterInputSchema>
): Promise<z.infer<typeof WritePersonalizedLetterOutputSchema>> {
  return writePersonalizedLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writePersonalizedLetterPrompt',
  input: {schema: WritePersonalizedLetterInputSchema},
  output: {schema: WritePersonalizedLetterOutputSchema},
  prompt: `You are a human letter writer. Write a letter that sounds like a real person wrote it.

  Use the inputs below. Preserve all facts and details from the notes; do not invent new ones.
  Aim for a natural, warm voice that matches the requested tone.

  Style rules:
  - Vary sentence length and keep phrasing simple and direct.
  - Avoid cliches and filler (e.g., "I hope this message finds you well", "truly", "incredibly", "honored").
  - Use contractions in informal/friendly tones; avoid them in formal tone.
  - Do not repeat the recipient's name more than once.
  - No bullet points or headings.

  Length: If the notes are brief, keep it to 4-7 sentences. If detailed, expand but stay under ~180 words.

  Recipient Name: {{{recipientName}}}
  Purpose: {{{purpose}}}
  Tone: {{{tone}}}
  Notes: {{{letterBody}}}

  Return a JSON object with a single field "personalizedLetter" containing the complete letter, including a simple sign-off.
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
