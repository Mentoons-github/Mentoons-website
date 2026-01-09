// import WorkshopBanner from "@/components/Workshop/banner/banner";
// import axios from "axios";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useAuth } from "@clerk/clerk-react";
// import { Workshop } from "@/types/workshopsV2/workshopsV2";
// import AboutWorkshopV2 from "@/components/Workshop/v2/aboutworkshop";
// import WorkshopPlan from "@/components/Workshop/plans/workshopPlan";

// const WorkshopV2 = () => {
//   const { getToken } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [workshops, setWorkshops] = useState<Workshop[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchWorkshops = useCallback(async () => {
//     try {
//       const token = await getToken();
//       if (!token) throw new Error("No auth token");

//       const { data } = await axios.get(
//         `${import.meta.env.VITE_PROD_URL}/workshop/v2/workshopv2`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log(data.data);

//       setWorkshops(data.data ?? []);
//     } catch (err) {
//       console.error("Failed to load workshops:", err);
//       toast.error("Could not load workshops");
//       setError("Failed to load workshops");
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken]);

//   useEffect(() => {
//     fetchWorkshops();
//   }, [fetchWorkshops]);

//   if (loading) {
//     return (
//       <div>
//         <WorkshopBanner />
//         <div className="p-8 text-center">Loading workshops...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <WorkshopBanner />
//         <div className="p-8 text-center text-red-600">{error}</div>
//       </div>
//     );
//   }

//   if (workshops.length === 0) {
//     return (
//       <div>
//         <WorkshopBanner />
//         <div className="p-8 text-center">No workshops available</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <WorkshopBanner />
//       <AboutWorkshopV2 workshops={workshops[0].plans} />
//       <WorkshopPlan plans={workshops[0].plans} />
//     </div>
//   );
// };

// export default WorkshopV2;
