import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Celebration, ApiErrorResponse } from "@/types";

export const useCelebrations = () => {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCelebrations = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get<Celebration[] | ApiErrorResponse>(
          `${import.meta.env.VITE_PROD_URL}/employee/birthday`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(response.data)) {
          setCelebrations(response.data);
        } else {
          setError((response.data as ApiErrorResponse).message || "No data");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load celebrations.");
      } finally {
        setLoading(false);
      }
    };
    fetchCelebrations();
  }, [getToken]);

  return { celebrations, loading, error };
};
