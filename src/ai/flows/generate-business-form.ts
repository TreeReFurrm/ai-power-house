'use server';

/**
 * @fileOverview Flow for generating customized business forms based on user descriptions.
 *
 * - generateBusinessForm - A function that generates a business form.
 * - GenerateBusinessFormInput - The input type for the generateBusinessForm function.
 * - GenerateBusinessFormOutput - The return type for the generateBusinessForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessFormInputSchema = z.object({
  formDescription: z
    .string()
    .describe(
      'Detailed description of the desired business form, including its purpose, required fields, and any specific formatting preferences.'
    ),
  businessInformation: z
    .string()
    .optional()
    .describe(
      'Optional information about the business, such as name, address, and contact details, to be pre-filled in the form.'
    ),
  recipientInformation: z
    .string()
    .optional()
    .describe(
      'Optional information about who the form is going to, such as their name and address.'
    ),
});
export type GenerateBusinessFormInput = z.infer<typeof GenerateBusinessFormInputSchema>;

const GenerateBusinessFormOutputSchema = z.object({
  formContent: z.string().describe('The generated business form content.'),
});
export type GenerateBusinessFormOutput = z.infer<typeof GenerateBusinessFormOutputSchema>;

export async function generateBusinessForm(
  input: GenerateBusinessFormInput
): Promise<GenerateBusinessFormOutput> {
  return generateBusinessFormFlow(input);
}

const generateBusinessFormPrompt = ai.definePrompt({
  name: 'generateBusinessFormPrompt',
  input: {schema: GenerateBusinessFormInputSchema},
  output: {schema: GenerateBusinessFormOutputSchema},
  prompt: `You are an AI assistant specialized in generating business forms.

  Based on the provided description and business information, create a professional and well-formatted business form.

  Description: {{{formDescription}}}
  Business Information: {{{businessInformation}}}
  Recipient Information: {{{recipientInformation}}}

  Ensure the generated form is clear, concise, and suitable for its intended purpose.
  The form should be in a plain text format with proper sections and spacing.
  If the description is vague, use your best judgement to come up with a reasonable result.
  Use a markdown format. Don't use HTML.
  `,
});

const generateBusinessFormFlow = ai.defineFlow(
  {
    name: 'generateBusinessFormFlow',
    inputSchema: GenerateBusinessFormInputSchema,
    outputSchema: GenerateBusinessFormOutputSchema,
  },
  async input => {
    const {output} = await generateBusinessFormPrompt(input);
    return output!;
  }
);
