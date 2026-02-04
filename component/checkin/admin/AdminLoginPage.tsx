"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { toastError, toastSuccess } from "@/lib/toast";

import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { adminLogin } from "@/services/api";
import { cn } from "@/lib/utils";
import PhoneNumberInput, {
  isValidPhoneNumber,
} from "@/component/shared/PhoneNumberInput";

interface AdminLoginPageProps {
  onLoginSuccess: (adminId: string, adminName: string) => void;
}

export default function AdminLoginPage({
  onLoginSuccess,
}: AdminLoginPageProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): string | null {
    if (!phone) return "Phone number is required.";
    if (!isValidPhoneNumber(phone))
      return "Please enter a valid 10-digit phone number.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error, { toastId: error });
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminLogin(phone, password);

      if (response.success && response.data) {
        toastSuccess("Signed in successfully!");
        onLoginSuccess(response.data.admin.id, response.data.admin.name);
      } else {
        toastError(response.error, "Invalid phone number or password.");
      }
    } catch (err) {
      toastError(
        err,
        "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whitesmoke px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-primary text-dark-black mb-2">
              Event Check-In
            </h1>
            <p className="text-gray-600 font-secondary text-sm">
              Admin login to start check-in session
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <PhoneNumberInput
              label="Phone Number"
              value={phone}
              onChange={(value) => setPhone(value)}
              autoFocus
            />

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-secondary font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(
                  "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg",
                  "text-dark-black font-secondary placeholder-gray-400",
                  "focus:outline-none focus:ring-0 focus:border-primary/90",
                  "transition-all duration-200",
                )}
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 bg-primary text-white font-secondary font-semibold",
                "rounded-lg transition-all duration-200",
                "hover:bg-[#e0c580] hover:shadow-lg hover:shadow-primary/20",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "focus:ring-offset-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transform hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" light />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 font-secondary">
              Contact your administrator if you need access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
