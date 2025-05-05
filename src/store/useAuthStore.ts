import { create } from "zustand";
import { axiosInstance } from "../lib/axios/axios";
import { IUser } from "@/types/user";
import { toast } from "react-toastify";

// ✅ Define State Type
interface AuthState {
  authUser: IUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isCheckingForgot: boolean;
  forgotCode: number | null;
  forgotEmail: string;
  isVerifyingForgot: boolean;
  isResettingPassword: boolean;

  setAuthUser: (user: IUser | null) => void;
  checkAuth: () => Promise<{ ok: true } | { ok: false } | undefined>;
  setForgotEmail: (email: string) => Promise<void>;
  reset: (data: { email: string; password: string; confirm: string }) => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<void>;
}

// ✅ Zustand Store with Types
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isCheckingForgot: false,
  forgotCode: null,
  forgotEmail: '',
  isVerifyingForgot: false,
  isResettingPassword: false,

  setAuthUser: (user) => {
    set({ authUser: user });
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data.ok) {
        set({ authUser: res.data.user });
        return {
          ok: true
        }
      } else {
        set({ authUser: null });
        toast.error(res.data.error);
        return {
          ok: false
        }
      }
    } catch (error: unknown) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  setForgotEmail: async (email) => {
    set({ forgotEmail: email });
  },

  reset: async (data) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post<{ user: IUser }>("/auth/reset", data);
      set({ authUser: res.data.user });
      toast.success("Password changed successfully");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).response?.data?.message || "Reset password failed");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  updateProfile: async (data: Partial<IUser>) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put<{ user: IUser }>("/auth/update-profile", { image: data.profileImage });
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
