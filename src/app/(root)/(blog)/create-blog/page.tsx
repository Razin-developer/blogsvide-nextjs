"use client";

import React, { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button" // adjust path if needed
import { X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addBlog } from "@/actions/blog";
import { toast } from "react-toastify";
import useBlogStore from "@/store/useBlogStore";

export default function CreateBlogPage() {
  const imgRef = React.useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const { status } = useSession();
  const router = useRouter();
  const { setBlogs } = useBlogStore();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login"); // Redirect logged-in users
    }
  }, [status, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result.toString())
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault()
      if (!title || !shortDescription || !description || !image) return
      const res = await addBlog({ title, shortDescription, description, image })

      if (res.ok) {
        toast.success("Blog Added Successfully");
        setBlogs()
        setTitle("")
        setShortDescription("")
        setDescription("")
        setImage("")
        router.push("/blogs")
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create New Blog</h1>
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
            required
            hidden
            ref={imgRef}
          />
          {image ? (
            <div className="relative">
              <Image
                src={image}
                alt="Preview"
                className="mt-2 h-auto rounded-md border w-full"
                height={100}
                width={250}
              />
              <button type="button" onClick={() => setImage("")} className="text-red-500 absolute top-4 right-2 bg-gray-800 rounded-full p-2"><X /></button>
            </div>
          ) : (
            <button type="button" onClick={() => imgRef.current?.click()} className="btn btn-sm w-full h-60 bg-gray-300 flex-col items-center justify-center rounded-md border-dashed border-2 border-gray-400/50 hover:bg-gray-200 transition-all">
              <span className=" text-2xl font-semibold">Upload Image</span><br />
              <span>(Click me to upload image)</span>
            </button>
          )}
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Blog"}
        </Button>
      </form>
    </div>
  )
}
