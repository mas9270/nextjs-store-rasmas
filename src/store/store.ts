import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import logger from "redux-logger";

import userInfoSlice from "./slices/userInfo";
import muiThemeSlice from "./slices/muiTheme";
import appLoadingSlice from "./slices/appLoading";

export const makeStore = () => {
  return configureStore({
    reducer: {
      userInfo: userInfoSlice,
      muiTheme: muiThemeSlice,
      appLoading: appLoadingSlice,
    },
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV === "development"
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
