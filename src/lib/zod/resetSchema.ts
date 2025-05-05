import { z } from "zod";

export const resetSchema = z.object({
  email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
  confirm: z.string({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
});