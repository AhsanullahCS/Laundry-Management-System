export default function Pagination({ page, totalPages, total, onChange }) {
  if (!total) return null;
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center p-3 gap-2">
      <small className="text-muted">Total records: {total}</small>
      <div className="btn-group">
        <button className="btn btn-outline-primary btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button className="btn btn-primary btn-sm" disabled>
          Page {page} of {totalPages}
        </button>
        <button className="btn btn-outline-primary btn-sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
