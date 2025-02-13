import { AudioComic, Comic } from "@/redux/comicSlice";
import React from "react";
import { motion } from "framer-motion";
// export interface HoverCardComicProps {
//   item: Comic;
//   index: number;
//   setShowButton: Function;
//   showButton: ShowButtonInterface;
// }

// const HoverCardComic: React.FC<HoverCardComicProps> = React.memo(
//   ({ item, index, showButton, setShowButton }) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const handleMouseEnter = useCallback(() => {
//       setShowButton({ index, show: true });
//       dispatch(updateCurrentHoverComicReducer(item));
//     }, [index, item, setShowButton, dispatch]);

//     const handleMouseLeave = useCallback(() => {
//       setShowButton({ index: null, show: false });
//       dispatch(updateCurrentHoverComicReducer(null));
//     }, [setShowButton, dispatch]);

//     return (
//       <HoverCard>
//         <HoverCardTrigger>Open</HoverCardTrigger>
//         <HoverCardContent className="w-11rem">
//           <div className="px-2 py-2">
//             <img
//               className="w-full h-[80%]"
//               src={item?.thumbnail}
//               alt="comic thumbnail"
//             />
//             <div className="cursor-pointer hover:text-primary text-sm font-semibold text-center underline">
//               {item?.name}
//             </div>
//           </div>
//         </HoverCardContent>
//       </HoverCard>
//     );
//   }
// );

const ComicCard: React.FC<{ item: AudioComic | Comic | null }> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed left-[52%] z-[9999] top-[50%] translate-y-[-50%] bg-white shadow px-4 py-3 w-[20rem] space-y-3 rounded-lg"
    >
      <img className="rounded-lg" src={item?.thumbnail} alt="comic card" />
      <div className="text-center font-semibold text-xl text-primary ">
        {item?.name}
      </div>
    </motion.div>
  );
};

export default ComicCard;
