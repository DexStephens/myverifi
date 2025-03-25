import { useState, useEffect, useCallback, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [shouldPoll, setShouldPoll] = useState(false);

  // Use refs to track the latest state without causing re-renders
  const latestCredentials = useRef(pendingCredentials);
  latestCredentials.current = pendingCredentials;

  const checkQueueStatus = useCallback(async () => {
    if (!user?.email) return;

    try {
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
        // Only update if there's actually a change
        const newCredentials = data.data.pendingCredTypes;
        if (
          JSON.stringify(latestCredentials.current) !==
          JSON.stringify(newCredentials)
        ) {
          setPendingCredentials(newCredentials);

          if (newCredentials.length > 0) {
            setShouldPoll(true);
          } else {
            setShouldPoll(false);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [user?.email]);

  const startPolling = useCallback(() => {
    setShouldPoll(true);
  }, []);

  useEffect(() => {
    if (user?.email) {
      checkQueueStatus();
    }
  }, [user?.email, checkQueueStatus]);

  // Initial load with loading state
  useEffect(() => {
    if (!shouldPoll || !user?.email) return;

    const intervalId = setInterval(checkQueueStatus, 10000);
    return () => clearInterval(intervalId);
  }, [shouldPoll, user?.email, checkQueueStatus]);

  return {
    pendingCredentials,
    error,
    startPolling,
  };
};
