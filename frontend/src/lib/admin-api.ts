export type InquiryStatus = "new" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  name: string;
  business: string | null;
  contact: string;
  problem: string;
  status: InquiryStatus;
  created_at: string;
};

export type InquiryListResponse = {
  items: Inquiry[];
  total: number;
};

export type StatusFilter = InquiryStatus | "all";

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

/** Thrown for any non-2xx response, carrying the HTTP status so callers can
 * tell "wrong key" (401) apart from "not configured on this deployment" (503). */
export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export async function fetchInquiries(
  adminKey: string,
  statusFilter: StatusFilter = "all",
): Promise<InquiryListResponse> {
  const params = new URLSearchParams({ limit: "100" });
  if (statusFilter !== "all") {
    params.set("status_filter", statusFilter);
  }

  const response = await fetch(`${apiUrl}/api/v1/inquiries?${params.toString()}`, {
    headers: { "X-Admin-Key": adminKey },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      response.status === 503
        ? "Admin access isn't configured on this deployment yet (set ADMIN_API_KEY)."
        : (data?.detail ?? "Request failed.");
    throw new AdminApiError(message, response.status);
  }

  return response.json() as Promise<InquiryListResponse>;
}
