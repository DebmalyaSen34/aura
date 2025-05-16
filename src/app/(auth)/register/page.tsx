"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthSocialButtons } from "@/components/features/auth/auth-social-buttons";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
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

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
        } else if (response.status === 400) {
          // Handle validation errors from backend
          if (data.errors) {
            const newErrors = { ...errors };
            Object.keys(data.errors).forEach((key) => {
              if (key in newErrors) {
                newErrors[key as keyof typeof errors] = data.errors[key];
              }
            });
            setErrors(newErrors);
          }
        } else {
          throw new Error(data.message || "Registration failed");
        }
        return;
      }

      // Registration successful
      // Store the token if your backend returns one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to home page or dashboard
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors((prev) => ({
        ...prev,
        email: "An error occurred during registration",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const passwordHasMinLength = formData.password.length >= 8;
  const passwordHasLetter = /[A-Za-z]/.test(formData.password);
  const passwordHasNumber = /\d/.test(formData.password);
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

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
            <h2 className="text-xl font-semibold mt-4 mb-1">
              Create your account
            </h2>
            <p className="text-gray-400">Join the Aura.io community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              {/* Password strength indicators */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordHasMinLength ? "bg-green-500" : "bg-gray-700"
                      }`}
                    >
                      {passwordHasMinLength && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span
                      className={
                        passwordHasMinLength
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordHasLetter ? "bg-green-500" : "bg-gray-700"
                      }`}
                    >
                      {passwordHasLetter && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span
                      className={
                        passwordHasLetter ? "text-green-500" : "text-gray-400"
                      }
                    >
                      Contains letters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordHasNumber ? "bg-green-500" : "bg-gray-700"
                      }`}
                    >
                      {passwordHasNumber && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span
                      className={
                        passwordHasNumber ? "text-green-500" : "text-gray-400"
                      }
                    >
                      Contains numbers
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordHasSpecial ? "bg-green-500" : "bg-gray-700"
                      }`}
                    >
                      {passwordHasSpecial && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span
                      className={
                        passwordHasSpecial ? "text-green-500" : "text-gray-400"
                      }
                    >
                      Contains special characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
