"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface Company {
  id: string;
  name: string;
  slug: string;
}

interface CompanyContextValue {
  currentCompanyId: string;
  companies: Company[];
  isLoadingCompanies: boolean;
  isSwitching: boolean;
  switchCompany: (companyId: string) => Promise<void>;
  setCompanies: (companies: Company[]) => void;
  setCurrentCompanyId: (id: string) => void;
  companyVersion: number;
  setIsLoadingCompanies: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({
  children,
  initialCompanyId = "",
  initialCompanies = [],
}: {
  children: React.ReactNode;
  initialCompanyId?: string;
  initialCompanies?: Company[];
}) {
  const [currentCompanyId, setCurrentCompanyId] = useState(initialCompanyId);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(
    initialCompanies.length === 0,
  );
  const [isSwitching, setIsSwitching] = useState(false);
  const [companyVersion, setCompanyVersion] = useState(0);

  const switchCompany = useCallback(
    async (companyId: string) => {
      if (isSwitching || companyId === currentCompanyId) return;

      setIsSwitching(true);
      try {
        const response = await apiFetch("/api/companies/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: companyId }),
        });

        setCurrentCompanyId(companyId);
        setCompanyVersion((v) => v + 1);
        toastSuccess(response.message || "Company switched successfully!");
      } catch (err) {
        toastError(err, "Failed to switch company. Please try again.");
      } finally {
        setIsSwitching(false);
      }
    },
    [isSwitching, currentCompanyId],
  );

  const value = useMemo<CompanyContextValue>(
    () => ({
      currentCompanyId,
      companies,
      isLoadingCompanies,
      isSwitching,
      switchCompany,
      setCompanies,
      setCurrentCompanyId,
      setIsLoadingCompanies: setIsLoadingCompanies,
      companyVersion,
    }),
    [
      currentCompanyId,
      companies,
      isLoadingCompanies,
      isSwitching,
      switchCompany,
      companyVersion,
    ],
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany must be used within a <CompanyProvider>");
  }
  return ctx;
}
