export async function generateApiKey() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return null;
    }
    const response = await fetch("http://localhost:3000/api/generate-apikey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.status === "success") {
      return data.apiKey;
    } else {
      console.error("Failed to generate API key:", data.error);
      return null;
    }
  }
  catch (error) {
    console.error("Failed to generate API key:", error);
    return null;
  }
}