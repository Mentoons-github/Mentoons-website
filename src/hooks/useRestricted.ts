import { useEffect, useState } from "react";

interface DayEntry {
  date: string;
  time: number;
}

interface AccessData {
  days: DayEntry[];
}

interface UpdateDataReturn {
  accessData: AccessData;
  totalTime: number;
  todayEntry: DayEntry;
  threeDaysAgoStr: string;
  currentToday: string;
}

export const useDailyAccess = (): boolean => {
  const [isRestricted, setIsRestricted] = useState<boolean>(false);

  const updateData = (): UpdateDataReturn => {
    const now = new Date();
    const currentToday = now.toISOString().split("T")[0];
    const tempDate = new Date(now);
    tempDate.setDate(tempDate.getDate() - 3);
    const threeDaysAgoStr = tempDate.toISOString().split("T")[0];

    let accessData: AccessData = { days: [] }; // Default value
    const storedData = localStorage.getItem("accessData");

    // Safely parse localStorage data
    try {
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure parsedData has a days array
        if (parsedData && Array.isArray(parsedData.days)) {
          accessData = parsedData as AccessData;
        } else {
          console.warn(
            "Invalid accessData structure in localStorage, resetting to default."
          );
        }
      }
    } catch (error) {
      console.error("Failed to parse accessData from localStorage:", error);
      // Use default value if parsing fails
    }

    // Filter days to keep only those from the last 3 days
    accessData.days = Array.isArray(accessData.days)
      ? accessData.days.filter((day: DayEntry) => day.date >= threeDaysAgoStr)
      : [];

    let todayEntry = accessData.days.find(
      (d: DayEntry) => d.date === currentToday
    );
    if (!todayEntry) {
      todayEntry = { date: currentToday, time: 0 };
      accessData.days.push(todayEntry);
    }

    const totalTime = accessData.days.reduce(
      (sum: number, d: DayEntry) => sum + d.time,
      0
    );

    // Save updated data to localStorage
    try {
      localStorage.setItem("accessData", JSON.stringify(accessData));
    } catch (error) {
      console.error("Failed to save accessData to localStorage:", error);
    }

    return { accessData, totalTime, todayEntry, threeDaysAgoStr, currentToday };
  };

  useEffect(() => {
    const { totalTime } = updateData();

    if (totalTime >= 90) {
      setIsRestricted(true);
      return;
    }

    const intervalId = setInterval(() => {
      const { accessData, totalTime, todayEntry, currentToday } = updateData();

      if (totalTime >= 90) {
        setIsRestricted(true);
        clearInterval(intervalId);
        return;
      }

      todayEntry.time += 1;
      try {
        localStorage.setItem("accessData", JSON.stringify(accessData));
        console.log("Updated time for", currentToday, "total:", totalTime + 1);
      } catch (error) {
        console.error("Failed to update localStorage:", error);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return isRestricted;
};
