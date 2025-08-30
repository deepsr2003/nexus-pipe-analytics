export const fetchHistoricalData = async () => {
  try {
    // Vite's proxy will forward this request to http://localhost:8080/api/historical-events
    const response = await fetch('/api/historical-events'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    return []; // Return an empty array on error to prevent crashes
  }
};
