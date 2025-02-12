export async function loginWebUser(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (data.status === "success") {
      return { status: true, user: data.data };
    } else {
      return {
        status: false,
        error:
          typeof data.message === "string"
            ? data.message
            : "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Failed to login web user:", error);
    return { status: false, error: "An error occurred" };
  }
}
