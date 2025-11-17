"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Add your login logic here
    try {
      console.log("Login attempt:", { username, password });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whitesmoke px-4">
      <div className="w-full max-w-md">
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
        <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-primary text-dark-black mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-secondary text-sm">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-secondary font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         text-dark-black font-secondary placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         text-dark-black font-secondary placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-dark-black font-secondary font-semibold
                       rounded-lg transition-all duration-200
                       hover:bg-[#e0c580] hover:shadow-lg hover:shadow-primary/20
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
                       focus:ring-offset-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
