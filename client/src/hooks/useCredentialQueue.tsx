import { useState, useEffect } from "react";
import { User } from "../utils/user.util";

interface PendingCredentialType {
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

export const useCredentialQueue = (user: User | null) => {
  const [pendingCredentials, setPendingCredentials] = useState<
    PendingCredentialType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkQueueStatus = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        setError(null);
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "http://localhost:3000/issuances/credential-queue",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: user.email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch pending credential types"
          );
        }

        const data = await response.json();

        if (
          data.status === "success" &&
          Array.isArray(data.data.pendingCredTypes)
        ) {
          setPendingCredentials(data.data.pendingCredTypes);
        } else {
          console.warn("Unexpected response format:", data);
          setPendingCredentials([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setPendingCredentials([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkQueueStatus();

    // eslint-disable-next-line prefer-const
    intervalId = setInterval(checkQueueStatus, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return {
    pendingCredentials,
    isLoading,
    error,
  };
};
