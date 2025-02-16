export function parseApiError(data: any) {
  if (Array.isArray(data.error) || typeof data.error === "string") {
    return data.error;
  }

  return data.error.message;
}
