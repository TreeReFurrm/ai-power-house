import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const defaultModel = 'googleai/gemini-flash-latest';

const legacyModelMap: Record<string, string> = {
  'gemini-1.5-flash': 'gemini-flash-latest',
  'gemini-1.5-flash-latest': 'gemini-flash-latest',
  'gemini-1.5-pro': 'gemini-pro-latest',
  'gemini-1.5-pro-latest': 'gemini-pro-latest',
};

const normalizeModel = (model: string) => {
  const trimmed = model.trim();
  const withoutPrefix = trimmed.replace(/^googleai\//, '');
  const mapped = legacyModelMap[withoutPrefix] ?? withoutPrefix;
  return mapped.startsWith('googleai/') ? mapped : `googleai/${mapped}`;
};

const rawModel = process.env.GENKIT_MODEL?.trim();
const resolvedModel = normalizeModel(rawModel?.length ? rawModel : defaultModel);

export const ai = genkit({
  plugins: [googleAI()],
  model: resolvedModel,
});
