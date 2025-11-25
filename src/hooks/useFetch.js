import { useState, useEffect } from "react";

/**
 * A custom hook for fetching data from an API endpoint.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {object} [options] - Optional fetch options (e.g., method, headers, body).
 * @returns {{data: any, loading: boolean, error: Error|null}}
 */
export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController to prevent memory leaks on unmounted components
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to abort the fetch if the component unmounts
    return () => {
      controller.abort();
    };
  }, [url]); // Re-run the effect if the URL changes

  return { data, loading, error };
}
