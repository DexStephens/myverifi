import { User } from "./user.util";

export async function registerUser(
  email: string,
  password: string,
  title: string | undefined,
  setUser: (user: User) => void
) {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name: title === "" ? undefined : title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Registration response:", data);

    if (data.status === "success") {
      setUser(data.data);
      return {
        status: true,
        user: data.data,
      };
    } else {
      return {
        status: false,
        error:
          typeof data.error === "string"
            ? data.error
            : "Unable to register user",
      };
    }
  } catch (error) {
    console.error("Failed to register web user:", error);
    return { status: false, error: "An error occurred" };
  }
}
