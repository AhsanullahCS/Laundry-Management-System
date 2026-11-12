# Redux State Structure

Store: `frontend/src/store/index.js` (Redux Toolkit `configureStore`)

```js
{
  auth:      { token, admin, loading, error },
  ui:        { message },                       // { type: "success"|"danger", text }
  dashboard: { stats, loading, error },
  customers: { items, total, page, totalPages, current, loading, saving, error },
  services:  { items, total, page, totalPages, current, loading, saving, error },
  orders:    { items, total, page, totalPages, current, loading, saving, error },
  payments:  { items, total, page, totalPages, loading, saving, error }
}
```

| Slice | File | Async thunks |
|---|---|---|
| auth | slices/authSlice.js | `login`; action `logout` |
| ui | slices/uiSlice.js | actions `showMessage`, `clearMessage` |
| dashboard | slices/dashboardSlice.js | `fetchDashboard` |
| customers, services, orders | slices/createCrudSlice.js (factory) | `fetchList`, `fetchOne`, `save` (create/update), `remove` |
| orders (extra) | slices/ordersSlice.js | `updateOrderStatus` |
| payments | slices/paymentsSlice.js | `fetchPayments`, `recordPayment` |

- `items` = current page of records, `current` = record being edited, `loading` = fetching, `saving` = submitting a form.
- The token is also kept in `localStorage` so the admin stays logged in after a refresh.
- `ProtectedRoute` reads `auth.token`; Axios attaches it to every request.
