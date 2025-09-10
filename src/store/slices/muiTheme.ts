import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MuiTheme {
  mode: "dark" | "light" ;
}

const initialState: MuiTheme = {
  mode: "dark",
};

export const muiThemeSlice = createSlice({
  name: "muiTheme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<MuiTheme>) => {
      state.mode = action.payload.mode;
    },
  },
});

export const { setTheme } = muiThemeSlice.actions;
export default muiThemeSlice.reducer;
