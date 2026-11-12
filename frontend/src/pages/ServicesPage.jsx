import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { services } from "../store/slices/servicesSlice";
import { showMessage } from "../store/slices/uiSlice";
import useListQuery from "../hooks/useListQuery";
import PageHeader from "../components/PageHeader";
import ListToolbar from "../components/ListToolbar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { money } from "../utils/helpers";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const { items, total, page, totalPages, loading, error } = useSelector((s) => s.services);
  const { query, update, setPage, reload } = useListQuery(services.fetchList, { sortBy: "name", order: "ASC" });

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete the service "${s.name}"?`)) return;
    try {
      await dispatch(services.remove(s.id)).unwrap();
      dispatch(showMessage({ type: "success", text: "Service deleted" }));
      reload();
    } catch (msg) {
      dispatch(showMessage({ type: "danger", text: msg }));
    }
  };

  return (
    <>
      <PageHeader title="Laundry Services" actionLabel="+ Add Service" actionTo="/services/new" />
      <ListToolbar
        query={query}
        update={update}
        placeholder="Search services..."
        sortOptions={[{ value: "name", label: "name" }, { value: "amount", label: "price" }]}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-wrap">
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>#</th><th>Service</th><th>Price per item</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {items.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No services found</td></tr>}
                {items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{money(s.price)}</td>
                    <td className="text-end text-nowrap">
                      <Link to={`/services/${s.id}/edit`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s)}>Delete</button>
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
