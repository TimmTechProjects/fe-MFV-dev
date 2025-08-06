import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    resetAuth: (state) => {
      state.user = initialState.user;
      state.isLoggedIn = initialState.isLoggedIn;
    },
  },
});

export const { setUser, setIsLoggedIn, resetAuth } = authSlice.actions;
export default authSlice.reducer;
