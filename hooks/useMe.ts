"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/apiFetch";
import { UserMe } from "@/type";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

async function fetchMe(): Promise<UserMe> {
  return apiFetch("/api/auth/me/");
}

export function useMe() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<UserMe>(
    "/api/auth/me/",
    fetchMe,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => {
        if (err?.status === 401) {
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
      },
    },
  );

  useEffect(() => {
    if (error && error?.status === 401) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [error, router]);

  return {
    data,
    isLoading,
    error,
    mutate,
    isAuthenticated: !error && !!data,
  };
}
