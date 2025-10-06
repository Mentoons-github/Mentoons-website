import { configureStore } from "@reduxjs/toolkit";
// import cardProductReducer from "./cardProductSlice";
import userStatusReducer from "./adda/statusSlice";
import notificationReducer from "./adda/notificationSlice";
import careerReducer from "./careerSlice";
import cartReducer from "./cartSlice";
import comicsReducer from "./comicSlice";
import fileUploadReducer from "./fileUploadSlice";
import authReducer from "./loginSlice";
import podcastReducer from "./Podcastslice";
import productsReducer from "./productSlice";
import rewardsReducer from "./rewardSlice";
import sessionReducer from "./sessionSlice";
import userReducer from "./userSlice";
import workshopReducer from "./workshopSlice";
import conversationReducer from "./adda/conversationSlice";
import adminWorkshopReducer from "./admin/workshop";
import EmployeeReducer from "./admin/employee/employeeSlice";
import friendRequestReducer from "./adda/friendRequest";
import careerAdminReducer from "./admin/job/jobSlice";
import sessionCallAdmin from "./admin/sessionCall/sessionCall";
import groupReducer from "./adda/groupSlice";

export const store = configureStore<{
  comics: ReturnType<typeof comicsReducer>;
  user: ReturnType<typeof userReducer>;
  workshop: ReturnType<typeof workshopReducer>;
  auth: ReturnType<typeof authReducer>;
  career: ReturnType<typeof careerReducer>;
  fileUpload: ReturnType<typeof fileUploadReducer>;
  podcast: ReturnType<typeof podcastReducer>;
  // cardProduct: ReturnType<typeof cardProductReducer>;
  cart: ReturnType<typeof cartReducer>;
  products: ReturnType<typeof productsReducer>;
  userStatus: ReturnType<typeof userStatusReducer>;
  session: ReturnType<typeof sessionReducer>;
  rewards: ReturnType<typeof rewardsReducer>;
  notification: ReturnType<typeof notificationReducer>;
  conversation: ReturnType<typeof conversationReducer>;
  adminWorkshop: ReturnType<typeof adminWorkshopReducer>;
  employee: ReturnType<typeof EmployeeReducer>;
  friendRequests: ReturnType<typeof friendRequestReducer>;
  careerAdmin: ReturnType<typeof careerAdminReducer>;
  sessionCallAdmin: ReturnType<typeof sessionCallAdmin>;
  groups: ReturnType<typeof groupReducer>;
}>({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    workshop: workshopReducer,
    auth: authReducer,
    career: careerReducer,
    fileUpload: fileUploadReducer,
    podcast: podcastReducer,
    // cardProduct: cardProductReducer,
    cart: cartReducer,
    products: productsReducer,
    userStatus: userStatusReducer,
    session: sessionReducer,
    rewards: rewardsReducer,
    notification: notificationReducer,
    conversation: conversationReducer,
    adminWorkshop: adminWorkshopReducer,
    employee: EmployeeReducer,
    friendRequests: friendRequestReducer,
    careerAdmin: careerAdminReducer,
    sessionCallAdmin: sessionCallAdmin,
    groups: groupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
