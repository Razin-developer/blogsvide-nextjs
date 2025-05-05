import { axiosInstance } from "@/lib/axios/axios";
import { IBlog } from "@/types/blog";
import { create } from "zustand";

interface BlogStore {
  blogs: IBlog[];
  setBlogs: () => void;
}

const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],

  setBlogs: async () => {
    try {
      const res = await axiosInstance.get("/blog/get");
      set({ blogs: res.data.blogs });
    } catch (error) {
      console.error("Error while fetching blogs:", error);
    }
  },
}));

export default useBlogStore;
