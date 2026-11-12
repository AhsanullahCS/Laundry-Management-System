import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { errMsg } from "../../utils/helpers";

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/dashboard");
    return data;
  } catch (e) { return rejectWithValue(errMsg(e)); }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { stats: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload; })
      .addCase(fetchDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default dashboardSlice.reducer;
