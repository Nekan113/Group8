export async function httpRequest(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  };
}

export const http = {
  get: (url, options = {}) => httpRequest(url, { ...options, method: "GET" }),
  post: (url, body, options = {}) => httpRequest(url, { ...options, method: "POST", body }),
  put: (url, body, options = {}) => httpRequest(url, { ...options, method: "PUT", body }),
  patch: (url, body, options = {}) => httpRequest(url, { ...options, method: "PATCH", body }),
  delete: (url, options = {}) => httpRequest(url, { ...options, method: "DELETE" }),
};