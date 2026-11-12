import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customers } from "../store/slices/customersSlice";
import { showMessage } from "../store/slices/uiSlice";
import useListQuery from "../hooks/useListQuery";
import PageHeader from "../components/PageHeader";
import ListToolbar from "../components/ListToolbar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

export default function CustomersPage() {
  const dispatch = useDispatch();
  const { items, total, page, totalPages, loading, error } = useSelector((s) => s.customers);
  const { query, update, setPage, reload } = useListQuery(customers.fetchList);

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete ${c.name}? All of this customer's orders and payments will also be deleted.`)) return;
    try {
      await dispatch(customers.remove(c.id)).unwrap();
      dispatch(showMessage({ type: "success", text: "Customer deleted" }));
      reload();
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  return (
    <>
      <PageHeader title="Customers" actionLabel="+ Add Customer" actionTo="/customers/new" />
      <ListToolbar
        query={query}
        update={update}
        placeholder="Search by name or phone..."
        sortOptions={[{ value: "date", label: "date added" }, { value: "name", label: "name" }]}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-wrap">
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>#</th><th>Name</th><th>Phone</th><th>Address</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {items.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No customers found</td></tr>}
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.address || "-"}</td>
                    <td className="text-end text-nowrap">
                      <Link to={`/customers/${c.id}/edit`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>
    </>
  );
}
