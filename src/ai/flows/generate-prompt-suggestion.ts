'use server';

/**
 * @fileOverview An AI agent that helps users craft better prompts for other AI models.
 *
 * - generatePromptSuggestion - A function that takes a user's goal and suggests an improved prompt.
 * - GeneratePromptSuggestionInput - The input type for the function.
 * - GeneratePromptSuggestionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GeneratePromptSuggestionInputSchema = z.object({
  goal: z.string().describe('The user\'s simple goal or what they want the AI to do.'),
});
export type GeneratePromptSuggestionInput = z.infer<typeof GeneratePromptSuggestionInputSchema>;

export const GeneratePromptSuggestionOutputSchema = z.object({
  suggestedPrompt: z.string().describe('The improved, detailed, and optimized prompt for the user to copy.'),
});
export type GeneratePromptSuggestionOutput = z.infer<typeof GeneratePromptSuggestionOutputSchema>;


export async function generatePromptSuggestion(input: GeneratePromptSuggestionInput): Promise<GeneratePromptSuggestionOutput> {
  return generatePromptSuggestionFlow(input);
}


const suggestionPrompt = ai.definePrompt({
    name: 'generatePromptSuggestionPrompt',
    input: { schema: GeneratePromptSuggestionInputSchema },
    output: { schema: GeneratePromptSuggestionOutputSchema },
    prompt: `You are an AI expert specializing in "Prompt Engineering." Your task is to help a user craft a better prompt.

The user will provide a simple goal. You must rewrite it into a clear, detailed, and effective prompt that they can use with another AI model.

The new prompt should:
- Clearly define the AI's role and persona (e.g., "You are an expert editor...").
- Provide specific, actionable instructions.
- State any important constraints or negative constraints (e.g., "Do not change the author's voice...").
- Give context where necessary.

User's Goal: "{{{goal}}}"

Now, generate the suggested prompt. Return only the prompt itself.`,
});


const generatePromptSuggestionFlow = ai.defineFlow(
  {
    name: 'generatePromptSuggestionFlow',
    inputSchema: GeneratePromptSuggestionInputSchema,
    outputSchema: GeneratePromptSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await suggestionPrompt(input);
    return output!;
  }
);
