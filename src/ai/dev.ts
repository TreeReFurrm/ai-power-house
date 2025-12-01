import { config } from 'dotenv';
config();

import '@/ai/flows/generate-listing-details.ts';
import '@/ai/flows/ai-price-suggestions.ts';
import '@/ai/flows/verify-item-value.ts';
import '@/ai/flows/select-ambassador.ts';
import '@/ai/flows/initiate-consignment-flow.ts';
import '@/ai/flows/request-secondary-service.ts';

    