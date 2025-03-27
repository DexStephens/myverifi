export type CredentialRequest = {
  issuerId: number;
  tokenId: string;
};

export async function getIssuersWithCredentialTypes() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/issuances/issuers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/issuances/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, credential_types }),
      }
    );

    const data:
      | {
          status: string;
          data: {
            result: { valid: boolean; credential_type_id: number }[];
          };
        }
      | { status: string; error: string[] | string } = await response.json();

    if (
      data.status === "success" &&
      "data" in data &&
      typeof data.data === "object" &&
      "result" in data.data
    ) {
      return { status: true, valid: data.data.result };
    } else {
      return {
        status: false,
        error:
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Failed to login web user:", error);
    return { status: false, error: "An error occurred" };
  }
}
