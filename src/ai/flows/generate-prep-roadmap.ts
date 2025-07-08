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
  role: z.string().describe('The target role for placement (e.g., Software Engineer).'),
});

export type GeneratePrepRoadmapInput = z.infer<typeof GeneratePrepRoadmapInputSchema>;

const GeneratePrepRoadmapOutputSchema = z.object({
  roadmap: z
    .array(
      z.object({
        day: z.number().describe('The day number in the roadmap (e.g., 1, 2, 3).'),
        title: z.string().describe('The main focus for the day.'),
        tasks: z.array(z.string()).describe('A list of specific tasks or topics for the day.'),
      })
    )
    .describe('A personalized 30-day roadmap for interview preparation, broken down day-by-day.'),
  frequentlyAskedQuestions: z
    .array(
      z.object({
        question: z.string().describe('The interview question.'),
        answer: z.string().describe('A concise answer or approach to the question.'),
      })
    )
    .describe('A list of the most frequently asked interview questions with answers.'),
  coreConcepts: z
    .array(
      z.object({
        concept: z.string().describe('The name of the core concept.'),
        description: z.string().describe('A brief explanation of the concept and its importance.'),
      })
    )
    .describe('A list of core concepts to study for the interview.'),
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

  Based on the student's CGPA, branch, college, target company, and target role, generate a personalized 30-day roadmap, a list of the most frequently asked interview questions with answers, and suggest core concepts to study.

  The output must be in a structured JSON format according to the output schema.

  Student Details:
  CGPA: {{{cgpa}}}
  Branch: {{{branch}}}
  College: {{{college}}}
  Target Company: {{{targetCompany}}}
  Target Role: {{{role}}}

  Generate a detailed 30-day roadmap with specific topics and tasks for each day.
  Generate a list of the most common interview questions for the target company and the student's branch, along with concise answers.
  Generate a list of the most important concepts the student should study, with brief descriptions of why they are important.
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
