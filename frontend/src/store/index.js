import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import dashboardReducer from "./slices/dashboardSlice";
import customersReducer from "./slices/customersSlice";
import servicesReducer from "./slices/servicesSlice";
import ordersReducer from "./slices/ordersSlice";
import paymentsReducer from "./slices/paymentsSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    customers: customersReducer,
    services: servicesReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
  },
});
