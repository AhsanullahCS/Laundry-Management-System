import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useDebounce from "./useDebounce";

// Keeps search / filter / sort / page state for a table and loads data when it changes.
export default function useListQuery(fetchAction, initial = {}) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState({
    search: "", status: "", sortBy: "date", order: "DESC", page: 1, limit: 10, ...initial,
  });
  const debouncedSearch = useDebounce(query.search);
  const key = JSON.stringify({ ...query, search: debouncedSearch });

  const reload = useCallback(() => dispatch(fetchAction(JSON.parse(key))), [dispatch, fetchAction, key]);
  useEffect(() => { reload(); }, [reload]);

  // changing search/filter/sort always goes back to page 1
  const update = (changes) => setQuery((q) => ({ ...q, page: 1, ...changes }));
  const setPage = (page) => setQuery((q) => ({ ...q, page }));
  return { query, update, setPage, reload };
}
