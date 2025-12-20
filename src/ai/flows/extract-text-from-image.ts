'use server';

/**
 * @fileOverview Extracts text from an image using OCR.
 *
 * - extractTextFromImage - A function that performs OCR on an image.
 * - ExtractTextFromImageInput - The input type for the function.
 * - ExtractTextFromImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ExtractTextFromImageInputSchema = z.object({
  imageDataUri: z.string().describe(
    "A photo of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type ExtractTextFromImageInput = z.infer<typeof ExtractTextFromImageInputSchema>;

export const ExtractTextFromImageOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image.'),
});
export type ExtractTextFromImageOutput = z.infer<typeof ExtractTextFromImageOutputSchema>;

export async function extractTextFromImage(input: ExtractTextFromImageInput): Promise<ExtractTextFromImageOutput> {
  return extractTextFromImageFlow(input);
}

const extractTextPrompt = ai.definePrompt({
    name: 'extractTextPrompt',
    input: { schema: ExtractTextFromImageInputSchema },
    output: { schema: ExtractTextFromImageOutputSchema },
    prompt: `You are an Optical Character Recognition (OCR) tool. Your task is to extract all text from the provided image accurately.
    
    Image: {{media url=imageDataUri}}
    
    Return only the extracted text.`,
});


const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextFromImageInputSchema,
    outputSchema: ExtractTextFromImageOutputSchema,
  },
  async (input) => {
    const { output } = await extractTextPrompt(input);
    return output!;
  }
);
