const API_URL = "http://localhost:8000";

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      // ignore JSON parse errors, use default message
    }
    throw new Error(detail);
  }
}
