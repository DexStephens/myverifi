import { User } from "./user.util";

export async function loginUser(
  email: string,
  password: string,
  setUser: (user: User) => void
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Server response:", data);

    if (data.status === "success") {
      setUser(data.data);
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
