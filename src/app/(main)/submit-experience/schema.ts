import * as z from "zod"

export const experienceSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  college: z.string().min(2, {
    message: "College name is required.",
  }),
  cgpa: z.coerce.number().min(0, {message: "CGPA must be positive."}).max(10, {
    message: "CGPA cannot be more than 10.",
  }),
  branch: z.string().min(2, {
    message: "Branch is required.",
  }),
  company: z.string().min(2, {
    message: "Company name is required.",
  }),
  role: z.string().min(2, {
    message: "Role is required.",
  }),
  year: z.coerce.number().min(2000, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  round1: z.string().optional().describe("Online Assessment or Round 1"),
  round2: z.string().optional().describe("Technical Round(s) or Round 2"),
  round3: z.string().optional().describe("HR/Managerial Round or Round 3"),
})
