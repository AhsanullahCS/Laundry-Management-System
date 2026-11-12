// Search box + optional status filter + sort controls used by every table page
export default function ListToolbar({ query, update, placeholder, statusOptions, sortOptions }) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-4">
        <input
          className="form-control"
          placeholder={placeholder}
          value={query.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      {statusOptions && (
        <div className="col-6 col-md-3">
          <select className="form-select" value={query.status} onChange={(e) => update({ status: e.target.value })}>
            <option value="">All statuses</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      <div className="col-6 col-md-3">
        <select className="form-select" value={query.sortBy} onChange={(e) => update({ sortBy: e.target.value })}>
          {sortOptions.map((o) => <option key={o.value} value={o.value}>Sort by {o.label}</option>)}
        </select>
      </div>
      <div className="col-6 col-md-2">
        <select className="form-select" value={query.order} onChange={(e) => update({ order: e.target.value })}>
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>
    </div>
  );
}
