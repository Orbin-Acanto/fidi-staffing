"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/apiFetch";
import { UserMe } from "@/type";

async function fetchMe(): Promise<UserMe> {
  return apiFetch("/api/auth/me/");
}

export function useMe() {
  const { data, error, isLoading, mutate } = useSWR<UserMe>(
    "/api/auth/me/",
    fetchMe,
  );

  return {
    data,
    isLoading,
    error,
    mutate,
    isAuthenticated: !error && !!data,
  };
}
