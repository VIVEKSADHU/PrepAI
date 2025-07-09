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
import { db } from '@/lib/firebase.client';
import { collection, query, where, getDocs, limit } from "firebase/firestore";

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


const PromptWithContextSchema = GeneratePrepRoadmapInputSchema.extend({
    summarizedExperienceData: z.string().describe('A summary of real experiences from students of the same or similar college and CGPA applying for the same role.')
});

const prompt = ai.definePrompt({
  name: 'generatePrepRoadmapPrompt',
  input: {schema: PromptWithContextSchema},
  output: {schema: GeneratePrepRoadmapOutputSchema},
  prompt: `You are a career guidance assistant. Based on the candidate’s inputs and past experience data, generate a realistic and relevant 30-day preparation roadmap.

Also generate a list of frequently asked questions and core concepts based on the provided information. The entire output must be in a structured JSON format according to the output schema.

🧑 Candidate Details:
- Target Role: {{{role}}}
- College: {{{college}}}
- CGPA: {{{cgpa}}}
- Background: {{{branch}}}

📊 Firestore Experience Summary:
Here are real experiences from students of the same or similar college and CGPA applying for {{{role}}}:
{{{summarizedExperienceData}}}

🧭 Rules:
1. ONLY generate a roadmap that is realistically achievable for the selected role.
2. If the target role is non-technical (e.g., Doctor), DO NOT include technical topics like DSA or Leetcode.
3. Prioritize tasks that match real-world expectations and the student's actual background.
4. The roadmap must be personalized — e.g., lower CGPA should focus more on building practical experience, while higher CGPA can target elite companies.

🎯 Output Format:
Your output MUST conform to the JSON schema. Generate a day-wise roadmap for 30 days with clear action steps, a list of frequently asked questions with answers, and a list of core concepts to study.
  `,
});

const generatePrepRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePrepRoadmapFlow',
    inputSchema: GeneratePrepRoadmapInputSchema,
    outputSchema: GeneratePrepRoadmapOutputSchema,
  },
  async input => {
    // 1. Fetch relevant experiences from Firestore to provide context to the AI
    const experiencesRef = collection(db, "experiences");
    const q = query(
        experiencesRef,
        where("company", "==", input.targetCompany),
        limit(10) // Limit to 10 recent experiences to avoid a huge prompt
    );
    const querySnapshot = await getDocs(q);
    const experiences = querySnapshot.docs.map(doc => doc.data());

    let summarizedExperienceData = "No past experiences found for this company. Your generated plan should be based on general knowledge for this role.";
    if (experiences.length > 0) {
        summarizedExperienceData = experiences.map(exp => {
            return `Student from ${exp.college} (CGPA: ${exp.cgpa}) applied for ${exp.role}.\nExperience:\n- Round 1: ${exp.round1 || 'N/A'}\n- Round 2: ${exp.round2 || 'N/A'}\n- Round 3: ${exp.round3 || 'N/A'}`;
        }).join('\n\n---\n\n');
    }

    // 2. Call the prompt with user input + fetched data
    const {output} = await prompt({
        ...input,
        summarizedExperienceData,
    });
    
    return output!;
  }
);
