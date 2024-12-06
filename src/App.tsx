// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// import { useEffect } from "react";
// import { useEffect } from "react";
import { Toaster } from "sonner";
import Router from "./Routes";
import ScrollToTop from "./components/comics/ScrollToTop";

const App = () => {
  // const { getToken } = useAuth();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Ensure token is defined and valid
  //       const token = await getToken();
  //       const response = await axios.post(
  //         "http://localhost:4000/api/v1/cardproduct",
  //         {
  //           cardTitle: "S years",
  //           cardCategory: "Silent Stories",
  //           age: [20],
  //           ageFilter: "20+",
  //           cardSummary:
  //             "Explore the world of silent narratives with our unique collection of conversation starter cards. These cards are crafted to enhance children's social skills and boost their confidence in expressing themselves through non-verbal communication.",
  //           rating: "4.4",
  //           paperEditionPrice: "199",
  //           printablePrice: "99",
  //           cardImages: [
  //             {
  //               id: "1",
  //               imageSrc: "https://via.placeholder.com/150",
  //             },
  //             {
  //               id: "2",
  //               imageSrc: "https://via.placeholder.com/150",
  //             },
  //             {
  //               id: "3",
  //               imageSrc: "https://via.placeholder.com/150",
  //             },
  //             {
  //               id: "4",
  //               imageSrc: "https://via.placeholder.com/150",
  //             },
  //           ],
  //           cardVideos: [
  //             {
  //               id: "1",
  //               videoSrc: "https://via.placeholder.com/150",
  //             },
  //             {
  //               id: "2",
  //               videoSrc: "https://via.placeholder.com/150",
  //             },
  //           ],
  //           cardDescriptions: [
  //             {
  //               label: "Features",
  //               descriptionList: [
  //                 {
  //                   description:
  //                     "These cards are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "These cards are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },

  //                 {
  //                   description:
  //                     "These cards are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //               ],
  //             },
  //             {
  //               label: "Advantages",
  //               descriptionList: [
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //               ],
  //             },
  //             {
  //               label: "Benefits",
  //               descriptionList: [
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //                 {
  //                   description:
  //                     "This set includes 50 cards with conversation starters that are designed to help children develop their social skills and build confidence in their communication abilities.",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data); // Handle the response data
  //     } catch (error) {
  //       console.error("Error fetching data:", error); // Handle errors
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" closeButton />
      <Router />
    </>
  );
};

export default App;
