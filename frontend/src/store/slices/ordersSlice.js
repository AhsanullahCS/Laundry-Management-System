import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { errMsg } from "../../utils/helpers";
import createCrudSlice from "./createCrudSlice";

export const orders = createCrudSlice("orders", "/orders");

// Quickly change just the status from the orders table
export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  } catch (e) { return rejectWithValue(errMsg(e)); }
});

export default orders.reducer;
