import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import Wordbreak from "./Wordbreak";
import { addToWishlistReducer, AudioComic } from "@/redux/comicSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export interface currentComicProps {
  currData: AudioComic | undefined;
  setHasPurchased: Function;
}
const PurchaseDialog: React.FC<currentComicProps> = ({
  currData,
  setHasPurchased,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef<any>();
  useEffect(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, []);

  console.log(currData);

  return (
    <AlertDialog>
      <AlertDialogTrigger ref={ref} asChild>
        <Button variant="outline" className="invisible" ref={ref}></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-center">
            Continue watching <Wordbreak />{" "}
            <span className="text-primary">{currData?.name}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-start justify-between gap-4">
              <div className="w-[30%]">
                <img
                  className="w-[15rem] rounded-lg"
                  src={currData?.thumbnail}
                  alt={currData?.name}
                />
              </div>
              <div className="w-[70%] text-center space-y-3">
                <div className="text-start">{currData?.desc}</div>
                <div>
                  <div className="font-semibold text-black text-xl">
                    Buy Comic
                  </div>
                  <div className="text-sm font-thin">Rs. 10</div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              navigate("/mentoons-comics/comics-list");
              dispatch(addToWishlistReducer(currData?.thumbnail));
            }}
          >
            Bookmark
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => setHasPurchased(true)}
            className="text-white"
          >
            Purchase
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseDialog;
