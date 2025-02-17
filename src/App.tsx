import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner";
import Router from "./Routes";
import ScrollToTop from "./components/comics/ScrollToTop";
import { getCart } from "./redux/cartSlice";
import { AppDispatch } from "./redux/store";

// const AgeCategory = {
//   CHILD: "6-12",
//   TEEN: "13-16",
//   YOUNG_ADULT: "17-19",
//   ADULT: "20+",
//   PARENTS: "parents",
// };
// const ProductType = {
//   COMIC: "comic",
//   AUDIO_COMIC: "audio_comic",
//   PODCAST: "podcast",
//   WORKSHOP: "workshop",
//   ASSESSMENT: "assessment",
//   //Any other product type
// };
const App = () => {
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();
      if (token && userId) {
        const response = await dispatch(getCart({ token, userId }));
        console.log("Response Data", response);
      }
    };

    // const createProduct = async () => {
    //   try {
    //     const response = await axios.post(
    //       " http://localhost:4000/api/v1/products",
    //       {
    //         title: "Comic History Quiz-2",
    //         description: "Test your knowledge of comic history",
    //         price: 4.99,
    //         ageCategory: AgeCategory.TEEN,
    //         type: ProductType.ASSESSMENT,
    //         tags: ["quiz", "education", "comics"],
    //         details: {
    //           questions: [
    //             {
    //               questionText: "Who created Spider-Man?",
    //               options: [
    //                 "Stan Lee",
    //                 "Bob Kane",
    //                 "Jack Kirby",
    //                 "Steve Ditko",
    //               ],
    //               correctAnswer: "Stan Lee",
    //             },
    //             {
    //               questionText: "In which year was Marvel Comics founded?",
    //               options: ["1939", "1945", "1961", "1970"],
    //               correctAnswer: "1939",
    //             },
    //           ],
    //           passingScore: 70,
    //           duration: 30, // minutes
    //           difficulty: "medium",
    //         },
    //       }
    //     );
    //     console.log("Product created:", response.data);
    //   } catch (error) {
    //     console.error("Error creating product:", error);
    //   }
    // };
    fetchCart();
    // createProduct();
  }, [dispatch, getToken, userId]);
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" closeButton />
      <Router />
    </>
  );
};

export default App;
