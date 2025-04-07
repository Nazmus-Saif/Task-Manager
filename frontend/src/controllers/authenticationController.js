import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosRequests.js";

export const authenticationController = create((set, get) => ({
  authorizedUser: null,
  isSigningUp: false,
  isVerifyingEmail: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuthentication: true,
  isSendingForgotPasswordEmail: false,
  isPasswordReset: false,
  isTaskAdded: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check-auth-user");
      set({ authorizedUser: res.data });
    } catch (error) {
      set({ authorizedUser: null });
    } finally {
      set({ isCheckingAuthentication: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/add-user/", data);
      if (res.data) {
        set({ authorizedUser: res.data });
        toast.success("User created successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (verificationToken) => {
    set({ isVerifyingEmail: true });
    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        verificationToken,
      });
      if (res.data) {
        set({ authorizedUser: res.data });
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  signIn: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/sign-in/", data);
      if (res.data) {
        set({ authorizedUser: res.data });
        toast.success("Signed in successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningIn: false });
    }
  },

  signOut: async () => {
    try {
      await axiosInstance.post("/sign-out/");
      set({ authorizedUser: null });
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      if (res.data) {
        set({ authorizedUser: res.data });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Image update error!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingForgotPasswordEmail: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      if (res.data) {
        set({ message: res.data.message });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingForgotPasswordEmail: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isPasswordReset: true });
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      if (res.data) {
        set({ message: res.data.message });
        toast.success(res.data.message + " redirecting to login page");
      }
    } catch (error) {
      toast.error(error.response.data.message + " redirecting to login page");
    } finally {
      set({ isPasswordReset: false });
    }
  },

  addTask: async (data) => {
    set({ isTaskAdded: true });
    try {
      const res = await axiosInstance.post("/add-task/", data);
      if (res.data) {
        set({ message: res.data.message });
        toast.success("Task added successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isTaskAdded: false });
    }
  },
}));
