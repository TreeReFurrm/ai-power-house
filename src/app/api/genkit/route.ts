import { appRoute } from '@genkit-ai/next'; // Change this line
import '@/ai/flows/scan-item';
import '@/ai/flows/initiate-consignment-flow';
import '@/ai/flows/request-secondary-service';
import '@/ai/flows/scout-fakes';
import '@/ai/flows/select-ambassador';
import '@/ai/flows/verify-item-value';
import '@/ai/flows/upc-deal-checker';
import '@/ai/flows/appraise-lot-flow';
import '@/ai/flows/generate-chat-response';

export const POST = appRoute(); // Change this line