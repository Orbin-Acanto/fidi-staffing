import type {
  AdminProfile,
  NotificationPreferences,
  TwoFactorAuth,
  UserMe,
} from "@/type";

const defaultNotificationPreferences: NotificationPreferences = {
  emailNewStaff: true,
  emailEventReminders: true,
  emailWeeklyReport: true,
  smsNotifications: false,
  smsUrgentAlerts: true,
  voiceCallNotifications: false,
  inAppNotifications: true,
  inAppSound: true,
};

const defaultTwoFactorAuth: TwoFactorAuth = {
  enabled: false,
  method: null,
};

export function userMeToAdminProfile(me: UserMe): AdminProfile {
  const name = `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim();

  const role: AdminProfile["role"] = me.tenant_role
    ? me.tenant_role
    : me.is_staff
      ? "Staff"
      : "User";

  return {
    id: me.id,
    name,
    email: me.email,
    phone: me.phone ?? "",
    avatar: me.avatar ?? null,
    role,
    company: me.current_company?.name ?? "",
    joinedAt: me.created_at,

    notificationPreferences: defaultNotificationPreferences,
    twoFactorAuth: defaultTwoFactorAuth,
    lastPasswordChange: undefined,
  };
}
