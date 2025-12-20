'use server';

/**
 * @fileOverview Flow for generating customized business ideas based on user interests.
 *
 * - generateBusinessIdea - A function that generates business ideas.
 * - GenerateBusinessIdeaInput - The input type for the generateBusinessIdea function.
 * - GenerateBusinessIdeaOutput - The return type for the generateBusinessIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessIdeaInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the user\'s interests, hobbies, and skills.'),
});
export type GenerateBusinessIdeaInput = z.infer<typeof GenerateBusinessIdeaInputSchema>;

const IdeaSchema = z.object({
    title: z.string().describe('The concise and catchy title of the business idea.'),
    description: z.string().describe('A one-paragraph description of the business idea, explaining what it is and who the target customer is.'),
    firstSteps: z.array(z.string()).describe('A list of 3-5 actionable first steps someone could take to start this business.'),
});

const GenerateBusinessIdeaOutputSchema = z.object({
  ideas: z.array(IdeaSchema).describe('An array of 3 distinct and logical business ideas.'),
});
export type GenerateBusinessIdeaOutput = z.infer<typeof GenerateBusinessIdeaOutputSchema>;

export async function generateBusinessIdea(
  input: GenerateBusinessIdeaInput
): Promise<GenerateBusinessIdeaOutput> {
  return generateBusinessIdeaFlow(input);
}

const generateBusinessIdeaPrompt = ai.definePrompt({
  name: 'generateBusinessIdeaPrompt',
  input: {schema: GenerateBusinessIdeaInputSchema},
  output: {schema: GenerateBusinessIdeaOutputSchema},
  prompt: `You are an expert business consultant who specializes in helping people turn their passions into viable businesses.
  
  A user has provided their interests. Your task is to generate 3 unique, practical, and logical business ideas that are DIRECTLY related to what the user has specified.

  IMPORTANT: The ideas must be realistic and directly connected to the user's interests. For example, if the user says they love animals, you MUST suggest animal-related businesses (like a dog walking service or pet grooming) and you MUST NOT suggest unrelated businesses (like a home baking business or a tech startup).

  User Interests: {{{interests}}}

  For each idea, provide a clear title, a description of the business, and a few actionable first steps.
  `,
});

const generateBusinessIdeaFlow = ai.defineFlow(
  {
    name: 'generateBusinessIdeaFlow',
    inputSchema: GenerateBusinessIdeaInputSchema,
    outputSchema: GenerateBusinessIdeaOutputSchema,
  },
  async input => {
    const {output} = await generateBusinessIdeaPrompt(input);
    return output!;
  }
);
