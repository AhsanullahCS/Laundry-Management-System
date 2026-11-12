import createCrudSlice from "./createCrudSlice";
export const services = createCrudSlice("services", "/services");
export default services.reducer;
