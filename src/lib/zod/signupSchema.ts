import { z } from "zod"

const signUpSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
})

export default signUpSchema