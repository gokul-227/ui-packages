"use client";

import { Spinner } from "@aec-craft/ui/components/custom/spinner";
import { Button } from "@aec-craft/ui/components/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@aec-craft/ui/components/primitives/command";
import { Input } from "@aec-craft/ui/components/primitives/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@aec-craft/ui/components/primitives/popover";
import { Skeleton } from "@aec-craft/ui/components/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aec-craft/ui/components/primitives/table";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  FunnelIcon,
} from "@aec-craft/ui/icons";
import type { TableQuery } from "@aec-craft/ui/lib/table-query";
import { cn } from "@aec-craft/ui/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type { TableQuery, TableSort } from "@aec-craft/ui/lib/table-query";

/** Cycled across columns so loading rows read as text of varying length rather
 *  than a uniform grid of bars. */
const SKELETON_WIDTHS = ["w-32", "w-20", "w-24"] as const;

/** A per-column filter control, surfaced in the column header. A `select`
 *  filter is a multi-select (set `searchable` to add a search box, e.g. for a
 *  long list of people); a `search` filter is a free-text box. */
export type DataTableFilter =
  | {
      type: "select";
      options: readonly { value: string; label: string }[];
      placeholder?: string;
      searchable?: boolean;
    }
  | {
      type: "search";
      placeholder?: string;
      /** Debounce before a keystroke reaches the query, so each one doesn't
       *  fire its own request. Default 300ms. */
      debounceMs?: number;
      /** Minimum trimmed length before the search applies; below it the filter
       *  reads as empty (cleared). Default 1 — search from the first character.
       *  Raising it skips the broad single-character query. */
      minChars?: number;
    };

export interface DataTableColumn {
  className?: string;
  /** Surface a filter menu in this column's header. */
  filter?: DataTableFilter;
  /** Field id used as the sort/filter key (must match the server field). */
  key?: string;
  label: ReactNode;
  /** Enable click-to-sort on this header (sorts by `key`). */
  sortable?: boolean;
}

/**
 * Page-at-a-time pagination for a list that hands back an opaque next-page
 * token and no total: the caller keeps the trail of tokens (typically in the
 * URL) and this renders First / Previous / Next over it.
 */
export interface DataTablePager {
  hasNext: boolean;
  isPending?: boolean;
  onFirst: () => void;
  onNext: () => void;
  onPrevious: () => void;
  /** 1-based. */
  page: number;
}

export interface DataTableProps {
  /** `<TableRow>` elements. */
  children?: ReactNode;
  className?: string;
  columns: readonly DataTableColumn[];
  /** Optional description under the title. */
  description?: ReactNode;
  /** Rendered (full width) when there are no rows. */
  empty?: ReactNode;
  hasMore?: boolean;
  /** Override auto-detection of an empty children array. */
  isEmpty?: boolean;
  /** Initial load: renders skeleton rows in place of the body, keeping the
   *  toolbar and column headers mounted so the frame does not jump. Suppresses
   *  the empty state, which would otherwise flash before the rows arrive. */
  isLoading?: boolean;
  isLoadingMore?: boolean;
  /** Cursor-style pagination: shown as a "Load more" footer. */
  onLoadMore?: () => void;
  /** Called with the next query; the consumer holds it, in state or in the
   *  URL (see `readTableQuery` / `writeTableQuery` in `lib/table-query`). */
  onQueryChange?: (query: TableQuery) => void;
  /** Page-at-a-time pagination: shown as a pager footer, instead of `onLoadMore`. */
  pager?: DataTablePager;
  /** Controlled query state — enables sort headers + per-column filter menus. */
  query?: TableQuery;
  /** Skeleton row count while `isLoading`. Match the page size you expect. */
  skeletonRows?: number;
  /** Optional title strip above the table. */
  title?: ReactNode;
  /** Extra chrome above the table (action buttons, etc.). Filters live in the
   *  column headers, not here. */
  toolbar?: ReactNode;
}

/**
 * Free-text column filter. Owns its input state so typing stays smooth and is
 * never round-tripped through a server refetch (which would drop focus / close
 * the menu). It commits a debounced, min-length value up to the query; below
 * `minChars` the committed value is empty, so the filter clears. External
 * changes to `value` (e.g. a filter reset) overwrite the local text.
 */
function SearchFilter({
  value,
  placeholder,
  debounceMs,
  minChars,
  onCommit,
}: {
  value: string;
  placeholder?: string;
  debounceMs: number;
  minChars: number;
  onCommit: (value: string) => void;
}) {
  const [raw, setRaw] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Adopt external changes to the committed value (e.g. a filter reset) during
  // render, but leave an in-flight local edit (trailing space, etc.) alone.
  if (value !== lastValue) {
    setLastValue(value);
    if (raw.trim() !== value) {
      setRaw(value);
    }
  }

  // Keep the latest committer without retriggering the debounce effect.
  const commit = useRef(onCommit);
  useEffect(() => {
    commit.current = onCommit;
  });

  // Debounce local edits up to the query; sub-threshold text reads as empty.
  useEffect(() => {
    const next = raw.trim().length >= minChars ? raw.trim() : "";
    if (next === value) {
      return;
    }
    const id = setTimeout(() => commit.current(next), debounceMs);
    return () => clearTimeout(id);
  }, [raw, value, minChars, debounceMs]);

  return (
    <Input
      autoFocus
      className="h-8"
      onChange={(e) => setRaw(e.target.value)}
      placeholder={placeholder ?? "Search…"}
      value={raw}
    />
  );
}

function FilterMenu({
  column,
  query,
  onQueryChange,
}: {
  column: DataTableColumn;
  query: TableQuery;
  onQueryChange: (q: TableQuery) => void;
}) {
  const key = column.key!;
  const filter = column.filter!;
  const raw = query.filters[key] ?? "";
  const active = raw.length > 0;
  const set = (value: string) =>
    onQueryChange({ ...query, filters: { ...query.filters, [key]: value } });

  const trigger = (
    <PopoverTrigger
      render={
        <button
          aria-label="Filter"
          className={cn(
            "inline-flex size-5 items-center justify-center rounded transition-colors",
            active
              ? "text-muted-foreground"
              : "text-muted-foreground/40 hover:text-muted-foreground"
          )}
          type="button"
        />
      }
    >
      <FunnelIcon className="size-3.5" weight={active ? "fill" : "regular"} />
    </PopoverTrigger>
  );

  if (filter.type === "search") {
    return (
      <Popover>
        {trigger}
        <PopoverContent align="start" className="w-56 p-2">
          <SearchFilter
            debounceMs={filter.debounceMs ?? 300}
            minChars={filter.minChars ?? 1}
            onCommit={set}
            placeholder={filter.placeholder}
            value={raw}
          />
        </PopoverContent>
      </Popover>
    );
  }

  const selected = raw ? raw.split(",") : [];
  const toggle = (value: string) =>
    set(
      (selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value]
      ).join(",")
    );

  return (
    <Popover>
      {trigger}
      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          {filter.searchable ? (
            <CommandInput placeholder={filter.placeholder ?? "Search…"} />
          ) : null}
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {filter.options.map((o) => (
                <CommandItem
                  data-checked={selected.includes(o.value) ? "true" : undefined}
                  key={o.value}
                  onSelect={() => toggle(o.value)}
                  value={o.label}
                >
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {active ? (
            <>
              <CommandSeparator />
              <button
                className="flex w-full items-center rounded-2xl px-3 py-2 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => set("")}
                type="button"
              >
                Clear filter
              </button>
            </>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function HeaderCell({
  column,
  query,
  onQueryChange,
}: {
  column: DataTableColumn;
  query?: TableQuery;
  onQueryChange?: (q: TableQuery) => void;
}) {
  const canSort = !!(column.sortable && column.key && query && onQueryChange);
  const active =
    canSort && query!.sort?.key === column.key ? query!.sort : undefined;
  const toggleSort = () =>
    onQueryChange!({
      ...query!,
      sort: { key: column.key!, dir: active?.dir === "desc" ? "asc" : "desc" },
    });
  const alignEnd = column.className?.includes("text-right");

  return (
    <div className={cn("flex items-center gap-1", alignEnd && "justify-end")}>
      {canSort ? (
        <button
          className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
          onClick={toggleSort}
          type="button"
        >
          {column.label}
          {active ? (
            active.dir === "desc" ? (
              <CaretDownIcon className="size-3" />
            ) : (
              <CaretUpIcon className="size-3" />
            )
          ) : (
            <CaretUpDownIcon className="size-3 opacity-40" />
          )}
        </button>
      ) : (
        <span>{column.label}</span>
      )}
      {column.filter && column.key && query && onQueryChange ? (
        <FilterMenu
          column={column}
          onQueryChange={onQueryChange}
          query={query}
        />
      ) : null}
    </div>
  );
}

/**
 * Bordered list chrome. Stateless rows, but optionally **query-aware**: pass a
 * controlled `query` + `onQueryChange` and column `sortable`/`filter` config to
 * get click-to-sort headers and per-column filter menus, so consumers can query
 * the server per column instead of loading everything. A list that appends
 * pages paginates via `onLoadMore`/`hasMore`; one that replaces them, via
 * `pager`.
 */
export function DataTable({
  columns,
  title,
  description,
  toolbar,
  query,
  onQueryChange,
  onLoadMore,
  hasMore,
  isLoadingMore,
  pager,
  empty = "No results.",
  isEmpty,
  isLoading,
  skeletonRows = 5,
  children,
  className,
}: DataTableProps) {
  const detectedEmpty =
    children == null ||
    children === false ||
    (Array.isArray(children) && children.length === 0);
  const showEmpty = !isLoading && (isEmpty ?? detectedEmpty);
  const hasHeader = title != null || description != null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-foreground/10",
        className
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-1 px-4 pt-4 pb-3">
          {title != null && <div className="font-medium text-sm">{title}</div>}
          {description != null && (
            <div className="text-muted-foreground text-xs">{description}</div>
          )}
        </div>
      ) : null}
      {toolbar ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 px-3 py-2.5",
            hasHeader && "border-foreground/10 border-t"
          )}
        >
          {toolbar}
        </div>
      ) : null}
      <div
        aria-busy={isLoading || undefined}
        className={cn(
          hasHeader || toolbar ? "border-foreground/10 border-t" : ""
        )}
      >
        <Table
          className={cn(
            // Row hover sits one step below the ghost button's, so an action
            // button in a hovered row reads darker than the row, not level.
            "[&_tbody_tr:last-child]:border-b-0 [&_tbody_tr]:border-foreground/6 [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-foreground/[0.025]",
            "[&_tbody_td]:px-4 [&_tbody_td]:py-2.5 [&_tbody_td]:align-middle"
          )}
        >
          <TableHeader>
            <TableRow className="border-foreground/10 border-b bg-foreground/[0.03] hover:bg-foreground/[0.03]">
              {columns.map((c, i) => (
                <TableHead
                  className={cn(
                    "h-auto px-4 py-2 font-medium text-[11px] text-muted-foreground",
                    c.className
                  )}
                  key={i}
                >
                  <HeaderCell
                    column={c}
                    onQueryChange={onQueryChange}
                    query={query}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }, (_, row) => (
                <TableRow className="hover:bg-transparent" key={row}>
                  {columns.map((c, i) => (
                    <TableCell className={c.className} key={i}>
                      <Skeleton className={cn("h-4", SKELETON_WIDTHS[i % 3])} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : showEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  className="px-4 py-10 text-center text-muted-foreground text-sm"
                  colSpan={columns.length}
                >
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </div>
      {pager ? (
        <div className="flex items-center justify-between gap-2 border-foreground/10 border-t px-4 py-2">
          <span className="text-muted-foreground text-xs">
            Page {pager.page}
          </span>
          <div className="flex items-center gap-1">
            <Button
              disabled={pager.isPending || pager.page === 1}
              onClick={pager.onFirst}
              size="sm"
              variant="ghost"
            >
              First
            </Button>
            <Button
              disabled={pager.isPending || pager.page === 1}
              onClick={pager.onPrevious}
              size="sm"
              variant="ghost"
            >
              Previous
            </Button>
            <Button
              disabled={pager.isPending || !pager.hasNext}
              onClick={pager.onNext}
              size="sm"
              variant="ghost"
            >
              Next
            </Button>
          </div>
        </div>
      ) : hasMore && onLoadMore ? (
        <div className="flex justify-center border-foreground/10 border-t p-2">
          <Button
            className="text-muted-foreground"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            size="sm"
            variant="ghost"
          >
            {isLoadingMore ? <Spinner className="size-4" /> : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
