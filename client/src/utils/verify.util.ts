export type CredentialRequest = {
  issuerId: number;
  tokenId: string;
};

export async function getIssuersWithCredentialTypes() {
  try {
    const response = await fetch("http://localhost:3000/issuances/issuers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Issuer response:", data);

    if (data.status === "success") {
      return { status: true, issuers: data.data };
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

export async function verifyCredentials(
  email: string,
  credential_types: number[]
) {
  try {
    const response = await fetch("http://localhost:3000/issuances/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, credential_types }),
    });

    const data = await response.json();
    console.log("Verify response:", data);

    if (data.status === "success") {
      return { status: true, valid: data.data.valid };
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
