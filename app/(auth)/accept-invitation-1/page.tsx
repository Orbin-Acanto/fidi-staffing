"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { toast } from "react-toastify";

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
};

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams],
  );

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password_confirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const passwordMismatch =
    !!form.password &&
    !!form.password_confirm &&
    form.password !== form.password_confirm;

  function validateForm(): string | null {
    if (!token) return "Invitation token is missing or invalid.";
    if (!form.first_name.trim()) return "First name is required.";
    if (!form.last_name.trim()) return "Last name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters long.";
    if (passwordMismatch) return "Passwords do not match.";
    return null;
  }

  const tokenToastShownRef = useRef(false);
  useEffect(() => {
    if (!token && !tokenToastShownRef.current) {
      tokenToastShownRef.current = true;
      toast.error(
        "Invitation token is missing or invalid. Please use the link from your invitation email.",
        { toastId: "missing-token" },
      );
      router.push("/login");
    }
  }, [token]);

  const canSubmit =
    !!token &&
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.phone.trim() &&
    form.password.length >= 8 &&
    !passwordMismatch;

  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error, { toastId: error });
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch("/api/auth/accept-invitation-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          password: form.password,
          password_confirm: form.password_confirm,
        }),
      });

      toastSuccess("Account created successfully!");
      router.push("/admin/dashboard");
    } catch (err) {
      toastError(err, "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whitesmoke px-4">
      <div className="w-full max-w-2xl">
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
          <div className="text-center mb-6">
            <h1 className="text-3xl font-primary text-dark-black mb-2">
              Create Admin Account
            </h1>
            <p className="text-gray-600 font-secondary text-sm">
              You were invited to set up your company workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  value={form.first_name}
                  onChange={onChange("first_name")}
                  placeholder="Your First Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-primary/90"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  value={form.last_name}
                  onChange={onChange("last_name")}
                  placeholder="Your Last Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-primary/90"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="Your Phone Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-primary/90"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={onChange("password")}
                required
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-primary/90"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.password_confirm}
                onChange={onChange("password_confirm")}
                required
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-0 focus:border-primary/90 ${
                  passwordMismatch ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-primary text-white font-secondary font-semibold rounded-lg cursor-pointer`}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
