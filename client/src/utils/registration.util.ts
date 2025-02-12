export async function registerUser(
  email: string,
  password: string,
  address: string | undefined,
  title: string,
  street_address: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  phone: string
) {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        address,
        title,
        street_address,
        city,
        state,
        zip,
        country,
        phone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Registration response:", data);

    if (data.status === "success") {
      return {
        status: true,
        user: data.data,
      };
    } else {
      return {
        status: false,
        error:
          typeof data.message === "string"
            ? data.message
            : "Unable to register user",
      };
    }
  } catch (error) {
    console.error("Failed to register web user:", error);
    return { status: false, error: "An error occurred" };
  }
}
