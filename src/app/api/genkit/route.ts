
import { nextHandler } from '@genkit-ai/next';
import {scanItemFlow} from '@/ai/flows/scan-item'
import {initiateConsignmentFlow} from '@/ai/flows/initiate-consignment-flow'
import {requestSecondaryServiceFlow} from '@/ai/flows/request-secondary-service'
import {scoutFakesFlow} from '@/ai/flows/scout-fakes'
import {selectAmbassadorFlow} from '@/ai/flows/select-ambassador'
import {verifyItemValueFlow} from '@/ai/flows/verify-item-value'

export const POST = nextHandler();
