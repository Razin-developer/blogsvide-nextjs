"use client";

import { FormEvent, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useBlogStore from "@/store/useBlogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { redirect } from "next/navigation";
import Link from "next/link";
import { addComment, deleteBlog } from "@/actions/blog";
import { toast } from "react-toastify";
import { IUser } from "@/types/user";
import Image from "next/image";

export default function BlogPage({ params: { id } }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const { blogs, setBlogs } = useBlogStore(); // Assuming you have a store to manage blogs
  const { authUser } = useAuthStore(); // Assuming you have a store to manage authentication
  const [pending, startTransition] = useTransition();
  const blog = blogs.find((b) => b._id.toString() === id?.toString());

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();
      if (!newComment) return;
      const res = await addComment(blog?._id.toString() as string, newComment);
      if (res.ok) {
        toast.success("Comment added Successfully");
        setBlogs();
        setNewComment("");
      } else {
        toast.error(res.error);
      }
    })
  };

  if (!blog) return <div className="flex items-center justify-center p-10 text-center min-h-screen text-red-500">Blog not found</div>;

  const handleDeleteBlog = async () => {
    startTransition(async () => {
      const confirmation = window.confirm("Are you sure you want to delete this blog? This action cannot be undone.");
      if (confirmation) {

        const res = await deleteBlog(blog._id.toString());

        if (res.ok) {
          toast.success("Blog deleted Successfully")
          setBlogs()
          redirect("/blogs");
        } else {
          toast.error(res.error)
        }

      }
    })
  };

  console.log("blog", blog);


  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12 bg-white shadow-md rounded-xl mt-12 mb-10">
      {/* Blog Image */}
      <motion.img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Blog Details */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-500">
          Created At: {new Date(blog.createdAt).toLocaleDateString()} | Updated At: {new Date(blog.updatedAt).toLocaleDateString()}
        </p>
        <p className="text-lg mt-4 text-gray-700 font-medium italic">{blog.shortDescription}</p>
        <hr className="my-6 border-gray-300" />
        <p className="text-base text-gray-800 leading-7 whitespace-pre-line">{blog.description}</p>
      </div>

      {/* Comments Section */}
      <section className="pt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="space-y-4 mb-6">
          <Textarea
            placeholder="Add a public comment..."
            className="w-full border rounded-lg resize-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit">Comment</Button>
          </div>
        </form>

        {/* List Comments */}
        <div className="space-y-6">
          {blog.comments.length > 0 ? (
            blog.comments.map((comment) => (
              <div
                key={comment._id.toString()}
                className="flex items-start gap-4 border-b pb-4"
              >
                {/* User Image */}
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={(comment.user as IUser).profileImage || "/default-avatar.png"}
                    alt={(comment.user as IUser).name || "User"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {(comment.user as IUser)?.name || "Anonymous"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-800">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>

        {authUser?._id?.toString() === (blog.user as Partial<IUser>)._id?.toString() &&

          <div className="space-x-4 mt-6 flex justify-end">
            <Link href={`/edit/${blog._id}`}><Button className="bg-blue-500 hover:bg-blue-400" variant="default">Edit Blog</Button></Link>
            <Button onClick={handleDeleteBlog} variant="default" className="bg-red-500 hover:bg-red-400">
              {pending ? "Deleting..." : "Delete Blog"}
            </Button>
          </div>
        }
      </section>
    </div>
  );
}
