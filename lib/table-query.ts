export interface TableSort {
  dir: "asc" | "desc";
  key: string;
}

/**
 * A table's current query. `sort` is single-column; `filters` maps a column
 * key to its value, so several columns can filter at once. A multi-select
 * filter's value is a comma-joined list of option values.
 */
export interface TableQuery {
  filters: Record<string, string>;
  sort?: TableSort;
}

/** `?sort=field:dir`, the shape the platform's list dialect already parses. */
export const SORT_PARAM = "sort";

/**
 * The query a URL carries, for a page that renders on the server and reads its
 * table state from `searchParams`. Only `keys` (the column keys the table owns)
 * are read as filters, so a page's unrelated params stay its own.
 */
export function readTableQuery(
  params: URLSearchParams,
  keys: Iterable<string>
): TableQuery {
  const filters: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      filters[key] = value;
    }
  }
  const sort = readSort(params.get(SORT_PARAM));
  return sort ? { filters, sort } : { filters };
}

/**
 * A copy of `params` carrying `query`: the owned keys and the sort rewritten,
 * everything else untouched. A filtered view is then a URL somebody can send.
 */
export function writeTableQuery(
  params: URLSearchParams,
  query: TableQuery,
  keys: Iterable<string>
): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of keys) {
    next.delete(key);
  }
  for (const [key, value] of Object.entries(query.filters)) {
    if (value) {
      next.set(key, value);
    }
  }
  if (query.sort) {
    next.set(SORT_PARAM, `${query.sort.key}:${query.sort.dir}`);
  } else {
    next.delete(SORT_PARAM);
  }
  return next;
}

function readSort(value: string | null): TableSort | undefined {
  const [key, dir] = (value ?? "").split(":");
  if (!key || (dir !== "asc" && dir !== "desc")) {
    return;
  }
  return { dir, key };
}
