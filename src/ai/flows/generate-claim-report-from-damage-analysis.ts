'use server';
/**
 * @fileOverview Generates a preliminary claim report based on crop damage analysis.
 *
 * - generateClaimReport - A function that generates the claim report.
 * - GenerateClaimReportInput - The input type for the generateClaimReport function.
 * - GenerateClaimReportOutput - The return type for the generateClaimReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClaimReportInputSchema = z.object({
  damageDetails: z
    .string()
    .describe('Detailed analysis of the crop damage, including affected area and type of damage.'),
  estimatedLoss: z.string().describe('An estimate of the financial loss due to the damage.'),
});
export type GenerateClaimReportInput = z.infer<typeof GenerateClaimReportInputSchema>;

const GenerateClaimReportOutputSchema = z.object({
  reportSummary: z.string().describe('A summary of the claim report including damage details and estimated loss.'),
});
export type GenerateClaimReportOutput = z.infer<typeof GenerateClaimReportOutputSchema>;

export async function generateClaimReport(input: GenerateClaimReportInput): Promise<GenerateClaimReportOutput> {
  return generateClaimReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClaimReportPrompt',
  input: {schema: GenerateClaimReportInputSchema},
  output: {schema: GenerateClaimReportOutputSchema},
  prompt: `You are an AI assistant that helps farmers generate claim reports for crop damage.

  Based on the following damage details and estimated loss, generate a concise claim report summary.

  Damage Details: {{{damageDetails}}}
  Estimated Loss: {{{estimatedLoss}}}

  Report Summary:`,
});

const generateClaimReportFlow = ai.defineFlow(
  {
    name: 'generateClaimReportFlow',
    inputSchema: GenerateClaimReportInputSchema,
    outputSchema: GenerateClaimReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
