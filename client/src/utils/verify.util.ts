export async function getIssuersWithCredentialTypes() {
  try {
    const response = await fetch("http://localhost:3000/issuance/issuers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Issuer response:", data);

    if (data.status === "success") {
      return { status: true, user: data.data };
    } else {
      return {
        status: false,
        error:
          typeof data.error === "string" ? data.error : "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Failed to login web user:", error);
    return { status: false, error: "An error occurred" };
  }
}
