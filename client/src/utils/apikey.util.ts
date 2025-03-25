export async function generateApiKey() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return null;
    }
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/generate-apikey`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      return data.apiKey;
    } else {
      console.error("Failed to generate API key:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to generate API key:", error);
    return null;
  }
}

export async function revokeApiKey() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return null;
    }
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/revoke-apikey`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      return true;
    } else {
      console.error("Failed to revoke API key:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    return false;
  }
}
