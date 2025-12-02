
import { config } from 'dotenv';
config();

import '@/ai/flows/scan-item.ts';
import '@/ai/flows/verify-item-value.ts';
import '@/ai/flows/select-ambassador.ts';
import '@/ai/flows/initiate-consignment-flow.ts';
import '@/ai/flows/request-secondary-service.ts';
import '@/ai/flows/scout-fakes.ts';
import '@/ai/flows/upc-deal-checker.ts';
import '@/ai/flows/appraise-lot-flow.ts';
