"use server"

import { z } from "zod"
import { experienceSchema } from "./schema"

export async function submitExperienceAction(
  data: z.infer<typeof experienceSchema>
) {
  const validatedFields = experienceSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, message: "Invalid data provided." }
  }

  // Here you would typically save to a database like Firestore
  console.log("Submitting experience:", validatedFields.data)

  // We'll mock a successful submission for this example.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Your experience has been submitted successfully!",
  }
}
