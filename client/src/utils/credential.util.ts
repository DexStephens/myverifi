import { parseApiError } from "./api.util";

export async function createCredentialType(
  email: string,
  title: string,
  cid: string
) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/issuances/credential_types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email, title, cid }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
        message: parseApiError(data),
      };
    }
  } catch (error) {
    return {
      status: false,
      message:
        "Failed to create credential type for email: " +
        email +
        ", error: " +
        error,
    };
  }
}

export async function issueCredentialType(
  emails: string[],
  credential_id: number
) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/issuances/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ emails, credential_id }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      return {
        status: true,
        issued: data.data.issued,
      };
    } else {
      return {
        status: false,
        message: parseApiError(data),
      };
    }
  } catch (error) {
    return {
      status: false,
      message:
        "Failed to issue credential types for emails: " +
        emails +
        ", error: " +
        error,
    };
  }
}
