import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";

interface UserInfo {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserInfo = {
  data: null,
  loading: false,
  error: null,
};

export const userInfo = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
      state.data = state.data;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = null;
    },
  },
});

export const checkToken = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchUsersStart());
    const res = await fetch("/api/auth/cookie");
    const data = await res.json();
    if (data.success) {
      dispatch(fetchUsersSuccess(data.data));
    } else {
      dispatch(fetchUsersFailure(data.message));
    }
  } catch (err: any) {
    dispatch(fetchUsersFailure(err.message));
  }
};

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } =
  userInfo.actions;
export default userInfo.reducer;
