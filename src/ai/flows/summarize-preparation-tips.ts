// Summarize preparation tips based on student experiences for a specific company.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePreparationTipsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to summarize preparation tips for.'),
  studentExperiences: z.array(z.string()).describe('A list of student experiences at the company.'),
});

export type SummarizePreparationTipsInput = z.infer<typeof SummarizePreparationTipsInputSchema>;

const SummarizePreparationTipsOutputSchema = z.object({
  summary: z.string().describe('A summary of preparation tips for the company.'),
});

export type SummarizePreparationTipsOutput = z.infer<typeof SummarizePreparationTipsOutputSchema>;

export async function summarizePreparationTips(
  input: SummarizePreparationTipsInput
): Promise<SummarizePreparationTipsOutput> {
  return summarizePreparationTipsFlow(input);
}

const summarizePreparationTipsPrompt = ai.definePrompt({
  name: 'summarizePreparationTipsPrompt',
  input: {
    schema: SummarizePreparationTipsInputSchema,
  },
  output: {
    schema: SummarizePreparationTipsOutputSchema,
  },
  prompt: `You are an AI assistant helping students prepare for interviews.
  Based on the student experiences below, generate a summary of preparation tips for the company {{companyName}}.

  Student Experiences:
  {{#each studentExperiences}}
  - {{{this}}}
  {{/each}}

  Summary:`,
});

const summarizePreparationTipsFlow = ai.defineFlow(
  {
    name: 'summarizePreparationTipsFlow',
    inputSchema: SummarizePreparationTipsInputSchema,
    outputSchema: SummarizePreparationTipsOutputSchema,
  },
  async input => {
    const {output} = await summarizePreparationTipsPrompt(input);
    return output!;
  }
);
