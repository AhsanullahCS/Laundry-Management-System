import { Link } from "react-router-dom";

export default function PageHeader({ title, actionLabel, actionTo }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="mb-0">{title}</h3>
      {actionTo && <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>}
    </div>
  );
}
