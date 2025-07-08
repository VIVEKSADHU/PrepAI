"use server"

import {
  generatePrepRoadmap,
  type GeneratePrepRoadmapOutput,
} from "@/ai/flows/generate-prep-roadmap"
import { z } from "zod"

const roadmapSchema = z.object({
  cgpa: z.coerce
    .number({ invalid_type_error: "CGPA must be a number." })
    .min(0, "CGPA must be positive.")
    .max(10, "CGPA cannot be more than 10."),
  branch: z.string().min(1, "Branch is required."),
  college: z.string().min(1, "College is required."),
  targetCompany: z.string().min(1, "Target company is required."),
  role: z.string().min(1, "Role is required."),
})

export type FormState = {
  message: string
  data?: GeneratePrepRoadmapOutput
  issues?: string[]
  fieldErrors?: {
    cgpa?: string[]
    branch?: string[]
    college?: string[]
    targetCompany?: string[]
    role?: string[]
  }
}

export async function getPrepRoadmap(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = roadmapSchema.safeParse({
    cgpa: formData.get("cgpa"),
    branch: formData.get("branch"),
    college: formData.get("college"),
    targetCompany: formData.get("targetCompany"),
    role: formData.get("role"),
  })

  if (!validatedFields.success) {
    const { formErrors } = validatedFields.error
    return {
      message: "Please check your input.",
      issues: formErrors.formErrors,
      fieldErrors: formErrors.fieldErrors,
    }
  }

  try {
    const result = await generatePrepRoadmap(validatedFields.data)
    return { message: "success", data: result }
  } catch (e) {
    return {
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
