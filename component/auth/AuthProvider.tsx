"use client";

import React, { createContext, useContext, useMemo } from "react";

type Me = any;

const AuthContext = createContext<{ me: Me | null }>({ me: null });

export function AuthProvider({
  me,
  children,
}: {
  me: Me | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ me }), [me]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMe() {
  return useContext(AuthContext).me;
}
