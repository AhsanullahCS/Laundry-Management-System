import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { errMsg } from "../../utils/helpers";

/**
 * Builds a Redux slice + thunks for a standard REST resource
 * (customers, services, orders). One function, no copy/paste.
 */
export default function createCrudSlice(name, url) {
  const fetchList = createAsyncThunk(`${name}/fetchList`, async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(url, { params });
      return data; // { data, total, page, totalPages }
    } catch (e) { return rejectWithValue(errMsg(e)); }
  });

  const fetchOne = createAsyncThunk(`${name}/fetchOne`, async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${url}/${id}`);
      return data;
    } catch (e) { return rejectWithValue(errMsg(e)); }
  });

  // id present -> update (PUT), otherwise create (POST)
  const save = createAsyncThunk(`${name}/save`, async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data } = id ? await api.put(`${url}/${id}`, values) : await api.post(url, values);
      return data;
    } catch (e) { return rejectWithValue(errMsg(e)); }
  });

  const remove = createAsyncThunk(`${name}/remove`, async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${url}/${id}`);
      return id;
    } catch (e) { return rejectWithValue(errMsg(e)); }
  });

  const slice = createSlice({
    name,
    initialState: { items: [], total: 0, page: 1, totalPages: 1, current: null, loading: false, saving: false, error: null },
    reducers: { clearCurrent: (s) => { s.current = null; s.error = null; } },
    extraReducers: (b) => {
      b.addCase(fetchList.pending, (s) => { s.loading = true; s.error = null; })
        .addCase(fetchList.fulfilled, (s, a) => {
          s.loading = false;
          s.items = a.payload.data;
          s.total = a.payload.total;
          s.page = a.payload.page;
          s.totalPages = a.payload.totalPages;
        })
        .addCase(fetchList.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
        .addCase(fetchOne.pending, (s) => { s.loading = true; s.current = null; s.error = null; })
        .addCase(fetchOne.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
        .addCase(fetchOne.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
        .addCase(save.pending, (s) => { s.saving = true; })
        .addCase(save.fulfilled, (s) => { s.saving = false; })
        .addCase(save.rejected, (s) => { s.saving = false; });
    },
  });

  return { reducer: slice.reducer, clearCurrent: slice.actions.clearCurrent, fetchList, fetchOne, save, remove };
}
