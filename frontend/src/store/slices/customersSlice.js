import createCrudSlice from "./createCrudSlice";
export const customers = createCrudSlice("customers", "/customers");
export default customers.reducer;
