interface ClockAuth {
  token: string;
  adminName: string;
  tenantName: string;
  adminId: string;
}

const CLOCK_AUTH_KEY = "clock_portal_auth";

export const clockAuth = {
  save(auth: ClockAuth): void {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(CLOCK_AUTH_KEY, JSON.stringify(auth));
      } catch (error) {
        console.error("Failed to save clock auth:", error);
      }
    }
  },

  get(): ClockAuth | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem(CLOCK_AUTH_KEY);
      if (!stored) return null;

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to get clock auth:", error);
      return null;
    }
  },

  getHeaders(): Record<string, string> | null {
    const auth = this.get();
    if (!auth) return null;

    return {
      "X-Clock-Token": auth.token,
      "X-Admin-Name": auth.adminName,
      "X-Tenant-Name": auth.tenantName,
    };
  },

  clear(): void {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(CLOCK_AUTH_KEY);
      } catch (error) {
        console.error("Failed to clear clock auth:", error);
      }
    }
  },

  isAuthenticated(): boolean {
    return this.get() !== null;
  },

  getAdminId(): string | null {
    const auth = this.get();
    return auth ? auth.adminId : null;
  },

  getAdminName(): string | null {
    const auth = this.get();
    return auth ? auth.adminName : null;
  },
};
