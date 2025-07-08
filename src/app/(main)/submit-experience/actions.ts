"use server"

import { z } from "zod"

export const experienceSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  college: z.string().min(2, { message: "College name is required." }),
  cgpa: z.coerce.number().min(0).max(10),
  branch: z.string().min(2, { message: "Branch is required." }),
  targetCompany: z.string().min(2, { message: "Target company is required." }),
  onlineRound: z.string().optional(),
  techRound: z.string().optional(),
  hrRound: z.string().optional(),
})

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
