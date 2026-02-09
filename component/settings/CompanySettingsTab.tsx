"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/apiFetch";
import { Company, UserMe } from "@/type";
import CompanyCard from "../company/CompanyCard";
import CompanyModal from "../company/CompanyModal";

interface CompaniesResponse {
  count: number;
  companies: Company[];
}

type Props = {
  me: UserMe;
};

export default function CompanySettingsTab({ me }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = me.tenant_role === "owner";
  const isAdmin = me.tenant_role === "admin";
  const canCreate = isOwner || isAdmin;
  const canUpdate = isOwner || isAdmin;
  const canDelete = isOwner;

  const denyAction = (action: string) => {
    const message =
      me.tenant_role === "moderator" || me.tenant_role === "staff"
        ? `View only. Only Owners and Admins can ${action} companies.`
        : `Only Owners can ${action} companies.`;
    toast.error(message, { toastId: `company-${action}-denied` });
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<CompaniesResponse>(
        "/api/companies/list-company",
        {
          method: "GET",
        },
      );
      setCompanies(data.companies);
    } catch (error) {
      toast.error("Failed to load companies", {
        toastId: "load-companies-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (formData: Partial<Company>) => {
    if (!canCreate) {
      denyAction("create");
      return;
    }

    setIsSaving(true);
    try {
      await apiFetch("/api/companies/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success("Company created successfully", {
        toastId: "create-company-success",
      });
      setShowCreateModal(false);
      loadCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to create company", {
        toastId: "create-company-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCompany = async (
    companyId: string,
    formData: Partial<Company>,
  ) => {
    if (!canUpdate) {
      denyAction("update");
      return;
    }

    setIsSaving(true);
    try {
      await apiFetch(`/api/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success("Company updated successfully", {
        toastId: "update-company-success",
      });
      setShowEditModal(false);
      setSelectedCompany(null);
      loadCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to update company", {
        toastId: "update-company-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCompany = async (company: Company) => {
    if (!canDelete) {
      denyAction("delete");
      return;
    }

    if (company.is_tenant) {
      toast.error("Primary company cannot be deleted", {
        toastId: "delete-primary-company",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/api/companies/${company.id}/delete`, {
        method: "DELETE",
      });
      toast.success("Company deleted successfully", {
        toastId: "delete-company-success",
      });
      loadCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete company", {
        toastId: "delete-company-error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-primary font-semibold text-gray-900">
              Companies
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage companies within your organization
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Create Company
            </button>
          )}
        </div>

        <div className="p-5">
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No companies found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                  onEdit={() => {
                    setSelectedCompany(company);
                    setShowEditModal(true);
                  }}
                  onDelete={() => handleDeleteCompany(company)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CompanyModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCompany}
          isSaving={isSaving}
        />
      )}

      {showEditModal && selectedCompany && (
        <CompanyModal
          mode="edit"
          company={selectedCompany}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCompany(null);
          }}
          onSave={(data) => handleUpdateCompany(selectedCompany.id, data)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
