import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comicSlice";
import userReducer from "./userSlice";
import workshopReducer from "./workshopSlice";
import authReducer from "./loginSlice";
import careerReducer from "./careerSlice";
import fileUploadReducer from "./fileUploadSlice";
export const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    workshop: workshopReducer,
    auth: authReducer,
    career: careerReducer,
    fileUpload: fileUploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;