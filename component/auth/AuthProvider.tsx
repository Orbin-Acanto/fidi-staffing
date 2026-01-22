"use client";

import { UserMe } from "@/type";
import React, { createContext, useContext, useMemo } from "react";

const AuthContext = createContext<{ me: UserMe | null }>({ me: null });

export function AuthProvider({
  me,
  children,
}: {
  me: UserMe | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ me }), [me]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMe() {
  return useContext(AuthContext).me;
}
