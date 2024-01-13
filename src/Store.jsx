import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/UserSlice";

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: {
    user: userSlice,
  },
});
