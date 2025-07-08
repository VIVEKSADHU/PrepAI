'use server';

/**
 * @fileOverview An AI agent that generates a personalized preparation roadmap for college students.
 *
 * - generatePrepRoadmap - A function that generates the roadmap.
 * - GeneratePrepRoadmapInput - The input type for the generatePrepRoadmap function.
 * - GeneratePrepRoadmapOutput - The return type for the generatePrepRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrepRoadmapInputSchema = z.object({
  cgpa: z.number().describe('The CGPA of the student.'),
  branch: z.string().describe('The branch of the student (e.g., Computer Science).'),
  college: z.string().describe('The college of the student.'),
  targetCompany: z.string().describe('The target company for placement.'),
});

export type GeneratePrepRoadmapInput = z.infer<typeof GeneratePrepRoadmapInputSchema>;

const GeneratePrepRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('A personalized 30-day roadmap for interview preparation.'),
  frequentlyAskedQuestions: z.string().describe('A list of the most frequently asked interview questions.'),
  coreConcepts: z.string().describe('A list of core concepts to study for the interview.'),
});

export type GeneratePrepRoadmapOutput = z.infer<typeof GeneratePrepRoadmapOutputSchema>;

export async function generatePrepRoadmap(input: GeneratePrepRoadmapInput): Promise<GeneratePrepRoadmapOutput> {
  return generatePrepRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePrepRoadmapPrompt',
  input: {schema: GeneratePrepRoadmapInputSchema},
  output: {schema: GeneratePrepRoadmapOutputSchema},
  prompt: `You are an AI mentor specializing in helping Tier-3 college students prepare for placements.

  Based on the student's CGPA, branch, college, and target company, generate a personalized 30-day roadmap, a list of the most frequently asked interview questions, and suggest core concepts to study.

  Student Details:
  CGPA: {{{cgpa}}}
  Branch: {{{branch}}}
  College: {{{college}}}
  Target Company: {{{targetCompany}}}

  Output:
  Roadmap: A detailed 30-day roadmap with specific topics and tasks for each day.
  Frequently Asked Questions: A list of the most common interview questions for the target company and the student's branch.
  Core Concepts: A list of the most important concepts the student should study to succeed in the interview.
  `,
});

const generatePrepRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePrepRoadmapFlow',
    inputSchema: GeneratePrepRoadmapInputSchema,
    outputSchema: GeneratePrepRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
