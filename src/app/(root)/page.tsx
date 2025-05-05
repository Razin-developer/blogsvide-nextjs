"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/Card";
import Link from "next/link";
import useBlogStore from "@/store/useBlogStore";

const num: number = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // generate a number between 5 - 15


export default function HomePage() {
  const { blogs } = useBlogStore(); // Assuming you have a store to manage blogs

  const featuredBlogs = blogs.slice(num, num + 4);
  const forYouBlogs = blogs.slice(num - 5, num - 1);

  return (
    <div className="px-6 py-12 space-y-16 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen mt-10">
      {/* Featured Section */}
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-8"
        >
          Featured Blogs -
          <Link href="/blogs" className="text-primary font-semibold hover:underline pl-4">See All</Link>
        </motion.h1>
        <div className="flex justify-center flex-wrap gap-6 mt-6">
          {featuredBlogs.map((blog) => (
            <BlogCard key={blog._id.toString()} _id={blog._id.toString()} title={blog.title} shortDescription={blog.shortDescription} image={blog.image} user={typeof blog.user === "string" ? blog.user.toString() : blog.user._id?.toString() as string} />
          ))}
        </div>
      </section>

      {/* For You Section */}
      <section className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold text-gray-800 mb-8"
        >
          For You -
          <Link href="/blogs" className="text-primary font-semibold hover:underline pl-4">See All</Link>
        </motion.h2>
        <div className="flex justify-center flex-wrap gap-6 mt-6">
          {forYouBlogs.map((blog) => (
            <BlogCard key={blog._id.toString()} _id={blog._id.toString()} title={blog.title} shortDescription={blog.shortDescription} image={blog.image} user={typeof blog.user === "string" ? blog.user.toString() : blog.user._id?.toString() as string} />
          ))}
        </div>
      </section>

      {/* Create CTA */}
      <section className="text-center py-12">
        <motion.div
          whileInView={{ scale: [0.8, 1] }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 inline-block"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Share Your Thoughts?
          </h2>
          <p className="text-gray-600 mb-6">Start your blogging journey today and make your voice heard.</p>
          <Link href="/create-blog"><Button size="lg">Create Your Own Blog</Button></Link>
        </motion.div>
      </section>

      {/* Top 20 Blogs */}
      <section className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-gray-800 mb-8"
        >
          Top 20 Blogs -
          <Link href="/blogs" className="text-primary font-semibold hover:underline pl-4">See All</Link>
        </motion.h2>
        <div className="flex justify-center flex-wrap gap-6 mt-6">
          {[...blogs.slice(0, 20), ...blogs.slice(num + 4)].map((blog) => (
            <BlogCard key={blog._id.toString()} _id={blog._id.toString()} title={blog.title} shortDescription={blog.shortDescription} image={blog.image} user={typeof blog.user === "string" ? blog.user.toString() : blog.user._id?.toString() as string} />
          ))}
        </div>
      </section>
    </div>
  );
}
