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

    const storedData = localStorage.getItem("accessData");
    const accessData: AccessData = JSON.parse(storedData || '{"days":[]}');
    accessData.days = accessData.days.filter(
      (day: DayEntry) => day.date >= threeDaysAgoStr
    );

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
    localStorage.setItem("accessData", JSON.stringify(accessData));

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
      localStorage.setItem("accessData", JSON.stringify(accessData));
      console.log("Updated time for", currentToday, "total:", totalTime + 1);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return isRestricted;
};
