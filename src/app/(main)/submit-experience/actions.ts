
"use server"

import { z } from "zod"
import { experienceSchema } from "./schema"
import { db } from "@/lib/firebase.client"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
  orderBy,
} from "firebase/firestore"
import { summarizePreparationTips } from "@/ai/flows/summarize-preparation-tips"
import { slugify } from "@/lib/utils"

type ActionResponse = {
  success: boolean
  message: string
}

async function updateCompanyData(companyName: string) {
  const companyRef = doc(db, "companies", companyName)

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

  await runTransaction(db, async (transaction) => {
    const companyDoc = await transaction.get(companyRef)
    const existingData = companyDoc.exists() ? companyDoc.data() : {};

    const dataToSet = {
        name: companyName,
        logoURL: existingData.logoURL || `https://avatar.vercel.sh/${slugify(companyName)}.png?size=96`,
        numExperiences: numExperiences,
        avgCgpa: avgCgpa,
        aiSummary: summary,
        aiHint: existingData.aiHint || "company building",
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
    await addDoc(collection(db, "experiences"), {
      ...experienceData,
      company,
      uid,
      email,
      createdAt: serverTimestamp(),
    })
    
    await updateCompanyData(company)

    return {
      success: true,
      message: "Your experience has been submitted successfully!",
    }
  } catch (error: any) {
    console.error("Error submitting experience: ", error)
    
    let detailedMessage = "An unexpected error occurred. Please try again later.";

    if (error.code) {
        switch (error.code) {
            case 'permission-denied':
            case 'unauthenticated':
                detailedMessage = `Permission Denied. Please ensure your Firestore security rules are deployed correctly. (Error code: ${error.code})`;
                break;
            case 'invalid-argument':
                detailedMessage = "Invalid data was sent. Please check the form and try again.";
                break;
            default:
                detailedMessage = `An unexpected error occurred: ${error.message} (Code: ${error.code}).`;
        }
    } else if (error instanceof Error) {
        detailedMessage = `An unexpected error occurred: ${error.message}.`;
    }

    return { success: false, message: detailedMessage }
  }
}
