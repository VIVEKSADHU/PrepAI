"use server"

import { z } from "zod"
import { experienceSchema } from "./schema"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  runTransaction,
  doc,
} from "firebase/firestore"
import { summarizePreparationTips } from "@/ai/flows/summarize-preparation-tips"

type ActionResponse = {
  success: boolean
  message: string
}

async function updateCompanyData(companyName: string) {
  const companyRef = doc(db, "companies", companyName)

  // Fetch all experiences for the company to calculate stats
  const allExperiencesQuery = query(
    collection(db, "experiences"),
    where("company", "==", companyName),
    orderBy("createdAt", "desc")
  )
  const allExperiencesSnapshot = await getDocs(allExperiencesQuery)
  const experiences = allExperiencesSnapshot.docs.map(doc => doc.data())
  
  const numExperiences = experiences.length
  const totalCgpa = experiences.reduce((sum, exp) => sum + (exp.cgpa || 0), 0)
  const avgCgpa = numExperiences > 0 ? totalCgpa / numExperiences : 0

  // Get text from last 10 experiences for AI summary
  const experienceTexts = experiences
    .slice(0, 10)
    .map(data => {
      return `Round 1: ${data.round1}\nRound 2: ${data.round2}\nRound 3: ${data.round3}`.trim()
    })
    .filter(text => text.length > 10)

  let summary = "More experiences needed to generate a summary."
  if (experienceTexts.length > 0) {
    try {
      const result = await summarizePreparationTips({
        companyName: companyName,
        studentExperiences: experienceTexts,
      })
      summary = result.summary
    } catch (e) {
      console.error("AI summary generation failed:", e);
      summary = "Could not generate AI summary at this time."
    }
  }

  // Use a transaction to safely update the company document
  await runTransaction(db, async (transaction) => {
    const companyDoc = await transaction.get(companyRef)
    const dataToSet = {
        name: companyName,
        logoURL: `https://placehold.co/96x96.png`, // Default placeholder
        numExperiences: numExperiences,
        avgCgpa: avgCgpa,
        aiSummary: summary,
    }

    if (companyDoc.exists()) {
      transaction.update(companyRef, dataToSet)
    } else {
      transaction.set(companyRef, dataToSet)
    }
  })
}


export async function submitExperienceAction(
  data: z.infer<typeof experienceSchema>,
  uid: string,
  email: string
): Promise<ActionResponse> {
  const validatedFields = experienceSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, message: "Invalid data provided." }
  }

  const { company, ...experienceData } = validatedFields.data

  try {
    // 1. Save the new experience
    await addDoc(collection(db, "experiences"), {
      ...experienceData,
      company,
      uid,
      email,
      createdAt: serverTimestamp(),
    })
    
    // 2. Update company aggregate data and AI summary
    await updateCompanyData(company)

    return {
      success: true,
      message: "Your experience has been submitted successfully!",
    }
  } catch (error) {
    console.error("Error submitting experience: ", error)
    return { success: false, message: "An unexpected error occurred while submitting." }
  }
}
