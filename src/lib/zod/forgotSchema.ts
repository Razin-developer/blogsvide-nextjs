import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
});