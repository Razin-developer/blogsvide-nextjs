import connectDB from "@/db/connectDB"
import { Blog } from "@/db/models/blog.model";

export const GET = async () => {
  await connectDB();

  const blogs = await Blog.find({}).populate("user comments.user", "name profileImage");

  return new Response(JSON.stringify({ ok: true, blogs }), { status: 200 });
}