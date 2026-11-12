import { createSlice } from "@reduxjs/toolkit";

// Holds the success / error message shown at the top of the screen
const uiSlice = createSlice({
  name: "ui",
  initialState: { message: null }, // { type: "success" | "danger", text: "..." }
  reducers: {
    showMessage: (state, action) => { state.message = action.payload; },
    clearMessage: (state) => { state.message = null; },
  },
});

export const { showMessage, clearMessage } = uiSlice.actions;
export default uiSlice.reducer;
