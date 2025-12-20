import { config } from 'dotenv';
config();

import '@/ai/flows/generate-relevant-multimedia.ts';
import '@/ai/flows/generate-course-outline.ts';
import '@/ai/flows/edit-course-content.ts';
import '@/ai/flows/write-personalized-letter.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/generate-business-form.ts';