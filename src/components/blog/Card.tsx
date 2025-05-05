import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { deleteBlog } from "@/actions/blog";
import { useTransition } from "react";
import { toast } from "react-toastify";
import useBlogStore from "@/store/useBlogStore";

export const BlogCard = ({ image, title, shortDescription, user: userId, _id: blogId }: { image: string, title: string, shortDescription: string, user: string, _id: string }) => {
  const { authUser } = useAuthStore();
  const { setBlogs } = useBlogStore(); // Assuming you have a store to manage blogsre();
  const [pending, startTransition] = useTransition()

  const handleDeleteBlog = async () => {
    startTransition(async () => {
      const confirmation = window.confirm("Are you sure you want to delete this blog? This action cannot be undone.");
      if (confirmation) {
        const res = await deleteBlog(blogId);

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

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-2xl shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full sm:w-[300px]"
    >
      <Image src={image} alt={title} className="h-48 w-full object-cover" width={300} height={200} />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{shortDescription}</p>
        <div className="space-y-3">
          <Link href={`/blog/${blogId}`}><Button className="mb-3" variant="default">Read More</Button></Link><br />
          {authUser?._id.toString() === userId.toString() ? <Link href={`/edit/${blogId}`}><Button className="bg-blue-500 hover:bg-blue-400" variant="default">Edit Blog</Button></Link> : null}<br />
          {authUser?._id.toString() === userId.toString() ? <form action={handleDeleteBlog}><Button variant="default" className="bg-red-500 hover:bg-red-400 mt-3">
            {pending ? "Deleting..." : "Delete Blog"}
          </Button></form> : null}
        </div>
      </div>
    </motion.div >
  )
};