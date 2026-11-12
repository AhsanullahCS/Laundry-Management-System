import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { errMsg } from "../../utils/helpers";

export const fetchPayments = createAsyncThunk("payments/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/payments", { params });
    return data;
  } catch (e) { return rejectWithValue(errMsg(e)); }
});

// Record a cash payment -> marks the bill as Paid
export const recordPayment = createAsyncThunk("payments/pay", async ({ id, amount }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/payments/${id}/pay`, { amount });
    return data;
  } catch (e) { return rejectWithValue(errMsg(e)); }
});

const paymentsSlice = createSlice({
  name: "payments",
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPayments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPayments.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.totalPages = a.payload.totalPages;
      })
      .addCase(fetchPayments.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(recordPayment.pending, (s) => { s.saving = true; })
      .addCase(recordPayment.fulfilled, (s) => { s.saving = false; })
      .addCase(recordPayment.rejected, (s) => { s.saving = false; });
  },
});

export default paymentsSlice.reducer;
