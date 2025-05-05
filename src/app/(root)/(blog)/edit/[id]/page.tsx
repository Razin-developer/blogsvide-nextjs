"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button"; // adjust path if needed
import useBlogStore from "@/store/useBlogStore"; // adjust path if needed
import { useAuthStore } from "@/store/useAuthStore";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { updateBlog } from "@/actions/blog";
import { toast } from "react-toastify";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { blogs, setBlogs } = useBlogStore(); // Assuming you have a store to manage blogs
  const { authUser } = useAuthStore(); // Assuming you have a store to manage authentication
  const imgRef = React.useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [id, setId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blog, setBlog] = useState<any>(null); // Blog state to handle the current blog data
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const { status } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Resolving the id and fetching blog
    const getBlogId = async () => {
      const { id } = await params;
      setId(id);
      const foundBlog = blogs.find((b) => b._id.toString() === id);
      setBlog(foundBlog);
    };

    getBlogId();
  }, [params, blogs]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login"); // Redirect logged-in users
    }
  }, [status, router]);

  useEffect(() => {
    if (blog) {
      setTitle(blog?.title || "");
      setShortDescription(blog?.shortDescription || "");
      setDescription(blog?.description || "");
      setImage(blog?.image || "");
    }
  }, [blog]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      if (blog) {
        const res = await updateBlog({
          blogId: blog._id.toString(),
          title,
          shortDescription,
          description,
          image,
        });

        if (res.ok) {
          setBlogs();
          setTitle("");
          setShortDescription("");
          setDescription("");
          setImage("");

          toast.success("Blog Updated Successfully");

          router.push("/blogs");
        } else {
          console.error(res.error);
          toast.error(res.error);
        }
      }
    });
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  if (blog?.user._id.toString() !== authUser?._id.toString()) {
    return <div className="flex items-center justify-center p-10 text-center min-h-screen text-red-500">You are not authorized to edit this blog</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter blog title"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Short Description</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter a short description"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={5}
            placeholder="Write the full blog content here"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            hidden
            ref={imgRef}
          />
          <div className="flex items-center gap-2">
            {image ? (
              <div className="relative">
                <Image
                  src={image}
                  alt="Preview"
                  className="mt-2 h-auto rounded-md border w-full"
                  width={500}
                  height={500}
                />
                <button type="button" onClick={() => setImage("")} className="text-red-500 absolute top-4 right-2 bg-gray-800 rounded-full p-2">
                  <X />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => imgRef.current?.click()} className="btn btn-sm w-full h-60 bg-gray-300 flex-col items-center justify-center rounded-md border-dashed border-2 border-gray-400/50 hover:bg-gray-200 transition-all">
                <span className=" text-2xl font-semibold">Upload Image</span><br />
                <span>(Click me to upload image)</span>
              </button>
            )}
          </div>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </div>
  );
}
