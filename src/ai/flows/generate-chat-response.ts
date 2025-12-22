
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConversationTurnSchema = z.object({
  speaker: z.enum(['user', 'bot']),
  text: z.string(),
});

const GenerateChatResponseInputSchema = z.object({
  history: z.array(ConversationTurnSchema).describe("The history of the conversation so far."),
  question: z.string().describe("The user's most recent question."),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

export async function generateChatResponse(input: GenerateChatResponseInput): Promise<string> {
  const { output } = await chatResponsePrompt({ ...input });
  if (!output) {
      throw new Error("The AI did not return a response.");
  }
  return output;
}

const chatResponsePrompt = ai.definePrompt({
  name: 'chatResponsePrompt',
  input: { schema: GenerateChatResponseInputSchema },
  output: { schema: z.string() },
  system: `You are ReFURRM Assist, a friendly and helpful AI chatbot for the ReFURRM SmartScan app.
Your goal is to answer user questions clearly and concisely.
You are an expert on all aspects of the app.

KEY APP FEATURES:
- SmartScan / Pricing Tool: An AI tool to appraise an item's value from a photo. It provides a resale price range, identifies the item, and suggests a listing title/description.
- UPC Deal Checker: A tool to check if an item is a good deal to buy for resale by looking up its UPC code.
- Ambassador Services: Certified professionals who can be hired for clean-outs, organization, or item pickups. Users request them through the app.
- L.E.A.N. Foundation: The ethical heart of the app. It's a fund to help people at risk of losing their storage units to auction. It's funded by donations and a portion of sales.
- Marketplace: Where users can buy and sell items. Items with a "Sentimental Hold" are under investigation to find their original owner.

YOUR PERSONALITY:
- Be helpful, clear, and encouraging.
- Keep answers brief. Two or three sentences is usually enough.
- If you don't know an answer, say so and suggest they contact support at lean@refurrm.org.
- Do not make up features that don't exist.

CONVERSATION HISTORY:
{{#each history}}
- {{speaker}}: {{text}}
{{/each}}

USER'S CURRENT QUESTION:
- user: {{question}}

Your response should be just the text you want to say to the user.`,

  config: {
    model: 'googleai/gemini-2.5-flash',
    temperature: 0.5,
  }
});

ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    return generateChatResponse(input);
  }
);
