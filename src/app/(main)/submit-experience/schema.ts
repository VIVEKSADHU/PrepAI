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
  targetCompany: z.string().min(2, {
    message: "Target company is required.",
  }),
  onlineRound: z.string().optional(),
  techRound: z.string().optional(),
  hrRound: z.string().optional(),
})
