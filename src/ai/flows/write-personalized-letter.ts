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
  style: z
    .enum(['casual', 'warm', 'professional', 'heartfelt'])
    .optional()
    .describe('The writing style to guide phrasing and cadence.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .optional()
    .describe('The preferred length of the letter.'),
  purpose: z
    .string()
    .describe("The purpose of the letter (e.g., thank you, invitation, complaint)."),
  recipientName: z.string().describe("The name of the recipient."),
  senderName: z
    .string()
    .optional()
    .describe('The name to use in the sign-off, if provided.'),
  relationship: z
    .string()
    .optional()
    .describe('The sender’s relationship to the recipient (e.g., friend, coworker).'),
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
  prompt: `You are a human letter writer. Think like a real person in this situation, then write the letter.
  Do not include your reasoning.

  Use the inputs below. Preserve all facts and details from the notes; do not invent new ones.
  Match the requested tone and style. If tone and style conflict, prioritize tone.

  Style rules:
  - Vary sentence length and keep phrasing simple and direct.
  - Avoid cliches and filler (e.g., "I hope this message finds you well", "truly", "incredibly", "honored").
  - Use contractions when tone/style is casual or warm; avoid them when tone/style is formal or professional.
  - Do not repeat the recipient's name more than once.
  - Avoid heavy exclamation; use at most one.
  - No bullet points or headings.

  Length rules:
  - short: 3-5 sentences
  - medium: 5-8 sentences
  - long: 8-12 sentences (cap ~200 words)
  - If no length is provided, choose the shortest length that fits the notes.

  Recipient Name: {{{recipientName}}}
  Purpose: {{{purpose}}}
  Tone: {{{tone}}}
  Style: {{{style}}}
  Relationship: {{{relationship}}}
  Sender Name: {{{senderName}}}
  Length Preference: {{{length}}}
  Notes: {{{letterBody}}}

  Return ONLY a JSON object with a single field "personalizedLetter" containing the complete letter,
  including a simple sign-off that matches the tone (use sender name if provided).
  `,
  config: {
    temperature: 0.7,
  },
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
