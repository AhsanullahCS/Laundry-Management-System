import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../store/slices/uiSlice";

// Success / error popup that hides itself after 3.5 seconds
export default function FlashMessage() {
  const dispatch = useDispatch();
  const message = useSelector((s) => s.ui.message);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => dispatch(clearMessage()), 3500);
    return () => clearTimeout(t);
  }, [message, dispatch]);

  if (!message) return null;
  return (
    <div className={`alert alert-${message.type} alert-dismissible flash shadow`} role="alert">
      {message.text}
      <button type="button" className="btn-close" onClick={() => dispatch(clearMessage())} />
    </div>
  );
}
