

import { API_BASE_URL } from "@/config/apiconfig";

export async function postForm(
  path: string,
  data: unknown
): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

