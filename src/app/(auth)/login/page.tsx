"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Call API to log in
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      // Remove any trailing slashes from the backend URL
      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      const response = await fetch(`${cleanBackendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        setIsLoading(false);

        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email or password",
          }));
        } else if (response.status === 500) {
          setErrors((prev) => ({
            ...prev,
            email: "Server error. Please try again later.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "An unexpected error occurred. Please try again.",
          }));
        }
        return;
      }

      const data = await response.json();

      if (!data.access_token) {
        setIsLoading(false);
        setErrors((prev) => ({
          ...prev,
          email: "Invalid response from server",
        }));
        return;
      }

      // Set secure cookie with proper attributes
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;

      return router.push("/home");
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setErrors((prev) => ({
          ...prev,
          email:
            "Cannot connect to the server. Please check your internet connection.",
        }));
      } else if (
        error instanceof Error &&
        error.message === "Backend URL is not configured"
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Server configuration error. Please contact support.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "An unexpected error occurred. Please try again.",
        }));
      }
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Link>
        </div>

        <div className="bg-[#15151F] rounded-xl border border-gray-800 p-8 shadow-xl shadow-purple-900/5">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Aura.io
            </h1>
            <h2 className="text-xl font-semibold mt-4 mb-1">Welcome back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
