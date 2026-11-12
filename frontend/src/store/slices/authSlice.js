import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { errMsg } from "../../utils/helpers";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));
    return data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    admin: JSON.parse(localStorage.getItem("admin") || "null"),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.admin = null;
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.admin = a.payload.admin; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
