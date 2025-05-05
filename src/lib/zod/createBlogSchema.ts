import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string({ message: "Title is required" }),
  shortDescription: z.string({ message: "Short description is required" }),
  description: z.string({ message: "Description is required" }),
  image: z.string({ message: "Image is required" }),
})