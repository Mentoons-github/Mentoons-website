import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state) => {
      state.userLoggedIn = true;
    },
  },
});

export const { userLoggedIn } = userSlice.actions;

export default userSlice.reducer;
