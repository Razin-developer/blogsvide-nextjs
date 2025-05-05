"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { CreativeCommons, Frame, LogOut, Menu, Search, User as UserIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IUser } from "@/types/user";
import { useSearchStore } from "../store/useSearchStore";
import { signOut } from "next-auth/react";
import useBlogStore from "@/store/useBlogStore";


const Navbar = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { authUser, checkAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { setBlogs } = useBlogStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    linkRef.current?.click();
  };

  useEffect(() => {
    checkAuth()
    setBlogs();
  }, [checkAuth, setBlogs]);

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Frame className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-primary">Blogs Vibe</h1>
        </Link>
        <Link href="/blogs" className="hidden" ref={linkRef} />

        <form onSubmit={handleSubmit} className="hidden lg:flex items-center gap-6">
          <nav>
            <ul className="hidden lg:flex items-center gap-6">
              <li className="hover:opacity-80 transition-all flex items-center justify-center gap-3 bg-gray-400/10 rounded-full p-2 pr-6 border border-gray-400/20 w-[450px]">
                <button type="submit" onClick={handleSubmit} >
                  <Search className="size-6 w-20 border-r border-gray-400/20 font-semibold" />
                </button>
                <input type="text" placeholder="Search" onChange={handleSearchChange} value={searchQuery} className="input bg-transparent input-sm w-full max-w-xs placeholder:text-gray-600 text-[20px] font-semibold" />
              </li>
            </ul>
          </nav>
        </form>

        {/* User Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {authUser ? (
            <>
              <Link href="/create-blog" className="btn btn-sm gap-2">
                <CreativeCommons className="size-5" />
                <span>Create Blog</span>
              </Link>
              <Link href="/profile" className="btn btn-sm gap-2">
                <UserIcon className="size-5" />
                <span>Profile</span>
              </Link>
              <button
                className="btn btn-sm gap-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-sm gap-2">
                <UserIcon className="size-5" />
                <span>Login</span>
              </Link>
              <Link href="/signup" className="btn btn-sm gap-2">
                <UserIcon className="size-5" />
                <span>Signup</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button with Animation */}
        <motion.button
          className="lg:hidden flex items-center p-2 border rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <MenuComponent authUser={authUser} setIsOpen={setIsOpen} isOpen={isOpen} />}
      </AnimatePresence>
    </header>
  );
};

const MenuComponent = ({ authUser, setIsOpen, isOpen }: { authUser: IUser | null; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; isOpen: boolean }) => {
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -200, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key="menu"
      className="lg:hidden fixed top-16 left-0 w-full bg-gray-200 backdrop-blur-md shadow-lg border-t border-base-300"
    >
      <nav className="flex flex-col items-center gap-4 py-6">
        {authUser ? (
          <>
            <Link onClick={() => setIsOpen(!isOpen)} href="/blogs" className="btn btn-sm w-3/4 bg-base-100/95">Search Blog</Link>
            <Link onClick={() => setIsOpen(!isOpen)} href="/create-blog" className="btn btn-sm w-3/4 bg-base-100/95">Create Blog</Link>
            <Link onClick={() => setIsOpen(!isOpen)} href="/profile" className="btn btn-sm w-3/4 bg-base-100/95">Profile</Link>
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="btn btn-sm w-3/4 bg-base-100/95"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link onClick={() => setIsOpen(!isOpen)} href="/blogs" className="btn btn-sm w-3/4 bg-base-100/95">Search Blog</Link>
            <Link onClick={() => setIsOpen(!isOpen)} href="/login" className="btn btn-sm w-3/4 bg-base-100/95">Login</Link>
            <Link onClick={() => setIsOpen(!isOpen)} href="/signup" className="btn btn-sm w-3/4 bg-base-100/95">Signup</Link>
          </>
        )}
      </nav>
    </motion.div>
  );
};

export default Navbar;
