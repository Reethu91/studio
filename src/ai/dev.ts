import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-uploaded-image-for-crop-damage.ts';
import '@/ai/flows/generate-claim-report-from-damage-analysis.ts';