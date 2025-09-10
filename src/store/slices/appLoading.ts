import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppLoading {
  loading: boolean;
}

const initialState: AppLoading = {
  loading: false,
};

export const appLoadingSlice = createSlice({
  name: "apploading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<AppLoading>) => {
      state.loading = action.payload.loading;
    },
  },
});

export const { setLoading } = appLoadingSlice.actions;
export default appLoadingSlice.reducer;
