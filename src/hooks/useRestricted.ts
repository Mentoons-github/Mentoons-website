import { useEffect, useState } from "react";

export const useDailyAccess = () => {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    let accessData = JSON.parse(localStorage.getItem("accessData") || "null");

    if (!accessData || accessData.startDate !== today) {
      accessData = { startDate: today, timeSpentToday: 0 };
      localStorage.setItem("accessData", JSON.stringify(accessData));
      console.log("Initialized access data:", accessData);
    }

    if (accessData.timeSpentToday >= 30) {
      setIsRestricted(true);
      return; 
    }

    const intervalId = setInterval(() => {
      let currentData = JSON.parse(localStorage.getItem("accessData") || "null");
      console.log("Current time spent:", currentData?.timeSpentToday);

      if (currentData?.timeSpentToday >= 30) {
        setIsRestricted(true);
        clearInterval(intervalId);
      } else {
        const updatedTime = (currentData?.timeSpentToday || 0) + 1;
        const updatedData = {
          startDate: today,
          timeSpentToday: updatedTime
        };
        localStorage.setItem("accessData", JSON.stringify(updatedData));
        console.log("Updated time:", updatedTime);
      }
    }, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  return isRestricted;
};
