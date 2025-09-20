'use server';
/**
 * @fileOverview Analyzes an uploaded image for crop damage using AI.
 *
 * - analyzeUploadedImage - A function that handles the image analysis process.
 * - AnalyzeUploadedImageInput - The input type for the analyzeUploadedImage function.
 * - AnalyzeUploadedImageOutput - The return type for the analyzeUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the damaged crops, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeUploadedImageInput = z.infer<typeof AnalyzeUploadedImageInputSchema>;

const AnalyzeUploadedImageOutputSchema = z.object({
  damageType: z.string().describe('The type of damage identified in the image.'),
  damageExtent: z.string().describe('The extent of the damage (e.g., minor, moderate, severe).'),
  additionalNotes: z.string().describe('Any additional notes or observations about the damage.'),
});
export type AnalyzeUploadedImageOutput = z.infer<typeof AnalyzeUploadedImageOutputSchema>;

export async function analyzeUploadedImage(input: AnalyzeUploadedImageInput): Promise<AnalyzeUploadedImageOutput> {
  return analyzeUploadedImageFlow(input);
}

const analyzeUploadedImagePrompt = ai.definePrompt({
  name: 'analyzeUploadedImagePrompt',
  input: {schema: AnalyzeUploadedImageInputSchema},
  output: {schema: AnalyzeUploadedImageOutputSchema},
  prompt: `You are an expert in identifying crop damage from images. Analyze the uploaded image to identify the type and extent of the damage.

  Photo: {{media url=photoDataUri}}

  Based on the image, determine the damage type, the extent of the damage (minor, moderate, or severe), and any additional relevant notes.`,
});

const analyzeUploadedImageFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedImageFlow',
    inputSchema: AnalyzeUploadedImageInputSchema,
    outputSchema: AnalyzeUploadedImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeUploadedImagePrompt(input);
    return output!;
  }
);
