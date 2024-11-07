import { configureStore } from "@reduxjs/toolkit";
import careerReducer from "./careerSlice";
import comicsReducer from "./comicSlice";
import fileUploadReducer from "./fileUploadSlice";
import authReducer from "./loginSlice";
import podcastReducer from "./Podcastslice";
import userReducer from "./userSlice";
import workshopReducer from "./workshopSlice";
export const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    workshop: workshopReducer,
    auth: authReducer,
    career: careerReducer,
    fileUpload: fileUploadReducer,
    podcast: podcastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
