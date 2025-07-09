
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
  reasoning: z.string().describe("The AI's reasoning for the provided timeline and steps, explaining why this path was chosen based on the user's profile and real data."),
  estimatedTimeline: z.string().describe("The total estimated time to prepare for the role, e.g., '3 months', '1 year'."),
  successProbability: z.string().describe("An honest assessment of the success probability, what it depends on, and how to improve it."),
  keyMilestones: z.array(
    z.object({
      milestone: z.string().describe("A key milestone in the roadmap, e.g., 'Build 2-3 Core Projects' or 'Secure an Internship'."),
      targetDate: z.string().describe("A target date or timeframe for the milestone, e.g., 'Month 1-2' or 'Q3 2024'."),
    })
  ).describe("A list of high-level, key milestones with their target dates."),
  roadmapBreakdown: z.array(
    z.object({
      period: z.string().describe("The time period for this section of the roadmap, e.g., 'Months 1-3'."),
      title: z.string().describe("A descriptive title for the tasks in this period, e.g., 'Skill Foundation'"),
      tasks: z.array(z.string()).describe("A list of specific tasks, skills to learn, or topics for this period."),
    })
  ).describe("A detailed, period-by-period breakdown of the preparation plan."),
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
  prompt: `You are a career roadmap planner AI.

Generate a **realistic, personalized roadmap** to help the student achieve their goal of getting into: {{{targetCompany}}}
Role: {{{role}}}
College: {{{college}}}
CGPA: {{{cgpa}}}
Branch: {{{branch}}}

📚 You also have access to **real experiences** of students with similar profiles who applied to or got selected at {{{targetCompany}}}:
{{{summarizedExperienceData}}}

🧠 Instructions:
1. DO NOT assume everyone can crack {{{targetCompany}}} in 30 days. Use real experiences to judge feasibility.
2. Based on the user's background, generate a roadmap that could take **15 days**, **3 months**, or even **1 year** — whatever is honest and achievable.
3. If the gap is big (e.g., student from Tier 3 college, 6.5 CGPA, no projects), break the roadmap into **milestones** (e.g., internship → project → switch).
4. Explain your reasoning — why this timeline and these steps.
5. Include skill-building, networking, project suggestions, and realistic prep timelines (not just DSA).

🎯 Your output MUST conform to the JSON schema, including all fields.
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
            return `Student from ${exp.college} (CGPA: ${exp.cgpa}, Branch: ${exp.branch}) applied for ${exp.role}.\nExperience:\n- Round 1: ${exp.round1 || 'N/A'}\n- Round 2: ${exp.round2 || 'N/A'}\n- Round 3: ${exp.round3 || 'N/A'}`;
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
