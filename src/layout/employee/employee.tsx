import { Outlet } from "react-router-dom";
import EmployeeSidebar from "@/components/employee/sidebar";
import EmployeeHeader from "@/components/employee/header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const Employeelayout = () => {
  const { getToken } = useAuth();
  const [showSession, setShowSession] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/employee/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { department } = response.data;

        if (department?.toLowerCase() === "psychologist") {
          setShowSession(true);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchMe();
  }, [getToken]);

  return (
    <div className="flex">
      <EmployeeSidebar showSession={showSession} />
      <div className="flex flex-col flex-1 min-w-0">
        <EmployeeHeader />
        <div className="flex-1 p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Employeelayout;
