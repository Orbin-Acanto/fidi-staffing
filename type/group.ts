export type BackendGroup = {
  id: string;
  company: string;
  company_name: string;
  name: string;
  description: string | null;
  color: string | null;
  is_active: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
};

export type ListGroupsResponse = {
  groups: BackendGroup[];
  total: number;
};

export type UiGroupMember = {
  id: string;
  fullName: string;
  primaryRole?: { id: string; name: string } | null;
};

export type UiGroup = {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  memberCount: number;
  members?: UiGroupMember[];
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  companyName?: string;
};
