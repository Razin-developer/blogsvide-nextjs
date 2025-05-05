"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/Card";
import { useSearchStore } from "@/store/useSearchStore";
import { useEffect, useRef } from "react";
import useBlogStore from "@/store/useBlogStore";
import { Search } from "lucide-react";
import Link from "next/link";

const AllBlogsPage = () => {
  const { searchQuery, setSearchQuery, commentFilter, error, searchResults, isSearching, timeFilter, setCommentFilter, setError, setSearchResults, setIsSearching, setTimeFilter, clearSearch } = useSearchStore();
  const { blogs } = useBlogStore();
  const linkRef = useRef<HTMLAnchorElement>(null);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    linkRef.current?.click();
  };

  useEffect(() => {
    setError(null)
    setIsSearching(true)
    if (!searchQuery && timeFilter === "All" || timeFilter === "All-Date" && commentFilter === "All") {
      setSearchResults(blogs);
      setIsSearching(false);
      setError(null);
      return;
    }

    const now = new Date();

    const filtered = blogs.filter((blog) => {
      const matchesQuery =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase());

      const createdAt = new Date(blog.createdAt);
      const timeMatch = (() => {
        switch (timeFilter) {
          case "Today":
            return createdAt.toDateString() === now.toDateString();
          case "Last Week":
            return now.getTime() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
          case "Last Month":
            return now.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
          case "Last Year":
            return now.getTime() - createdAt.getTime() <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      })();

      const commentCount = blog.comments?.length || 0;
      const commentMatch = (() => {
        switch (commentFilter) {
          case "50+":
            return commentCount >= 50;
          case "25+":
            return commentCount >= 25;
          case "10+":
            return commentCount >= 10;
          default:
            return true;
        }
      })();

      return matchesQuery && timeMatch && commentMatch;
    });

    if (filtered.length === 0) {
      setError("No results found")
    }

    setSearchResults(filtered);
    setIsSearching(false)

  }, [searchQuery, timeFilter, commentFilter, blogs, setSearchResults, setIsSearching, setError]);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-10">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md p-6 border-r border-gray-200 fixed h-screen top-0 left-0 z-20 pt-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Date</h2>
        <ul className="space-y-3 text-gray-700">
          {["All-Date", "Today", "Last Week", "Last Month", "Last Year"].map((date) => (
            <li key={date} className="hover:text-purple-600 cursor-pointer transition">
              <input type="radio" name="date" id={date} className="mr-2" checked={date === "All-Date" ? timeFilter === "All" : date === timeFilter} onChange={() => setTimeFilter(date === "All-Date" ? "All" : date)} />
              <label htmlFor={date}>{date === "All-Date" ? "All" : date}</label>
            </li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800">Comments</h2>
        <ul className="space-y-2 text-gray-700">
          {["All", "50+", "25+", "10+"].map((comments) => (
            <li key={comments} className="hover:text-purple-600 cursor-pointer transition">
              <input type="radio" name="comments" id={comments} className="mr-2" checked={comments === commentFilter} onChange={() => setCommentFilter(comments)} />
              <label htmlFor={comments}>{comments}</label>
            </li>
          ))}
        </ul>
        <ul>
          <li>
            <button onClick={clearSearch} className="btn btn-sm w-full text-center mt-6">Clear</button>
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 lg:ml-64 px-6 py-12">
        <Link href="/blogs" className="hidden" ref={linkRef} />
        <div className="lg:hidden flex justify-center mb-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-6">
            <nav>
              <ul className="flex items-center gap-6">
                <li className="hover:opacity-80 transition-all flex items-center justify-center gap-3 bg-gray-400/10 rounded-full p-2 pr-6 border border-gray-400/20 w-[450px]">
                  <button type="submit" onClick={handleSubmit} >
                    <Search className="size-6 w-20 border-r border-gray-400/20 font-semibold" />
                  </button>
                  <input type="text" placeholder="Search" onChange={handleSearchChange} value={searchQuery} className="input bg-transparent input-sm w-full max-w-xs placeholder:text-gray-600 text-[20px] font-semibold" />
                </li>
              </ul>
            </nav>
          </form>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-10 text-center"
        >
          Search Results for <span className="text-primary">{searchQuery}</span>
        </motion.h2>
        <div className="flex justify-center flex-wrap gap-6">
          {isSearching && <p className="text-gray-500">Searching...</p>}
          {error ? <p className="text-red-500">{error}</p> :
            searchResults.length > 0 ? (
              searchResults.map((blog) => (
                <BlogCard key={blog._id.toString()} _id={blog._id.toString()} title={blog.title} shortDescription={blog.shortDescription} image={blog.image} user={typeof blog.user === "string" ? blog.user : blog.user._id.toString()} />
              ))
            ) : (
              <p className="text-gray-500"></p>
            )}
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-10 text-center my-6"
        >
          All Blogs
        </motion.h2>
        <div className="flex justify-center flex-wrap gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id.toString()} _id={blog._id.toString()} title={blog.title} shortDescription={blog.shortDescription} image={blog.image} user={typeof blog.user === "string" ? blog.user.toString() : blog.user._id.toString()} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllBlogsPage;
