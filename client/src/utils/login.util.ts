import { User } from "./user";

export async function loginUser(
  email: string,
  password: string,
  setUser: (user: User) => void
) {
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
      setUser(data.data);
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
