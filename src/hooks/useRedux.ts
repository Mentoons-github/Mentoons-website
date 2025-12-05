import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

// Typed dispatch (fix for async thunk actions)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
