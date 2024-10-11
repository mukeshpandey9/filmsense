import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./homeSlice";
import gptReducer from "./gptSlice";
export const store = configureStore({
  reducer: {
    home: homeSlice,
    gpt: gptReducer,
  },
});
