import { apiFetch } from "@/lib/apiFetch";
import { ApiResponse } from "@/type";

import { mockSendForgotPIN } from "@/data/mockData";

const DEMO_MODE = false;

const API_BASE = "/api/checkin";

export const sendForgotPIN = async (
  phone: string,
): Promise<ApiResponse<{ sent: boolean; maskedPhone: string }>> => {
  if (DEMO_MODE) {
    return mockSendForgotPIN(phone);
  }
  return apiFetch(`${API_BASE}/staff/forgot-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
};
