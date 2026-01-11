import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { config } from 'dotenv';

config();

const defaultModel = 'googleai/gemini-flash-latest';

export const ai = genkit({
  plugins: [googleAI()],
  model: process.env.GENKIT_MODEL ?? defaultModel,
});
