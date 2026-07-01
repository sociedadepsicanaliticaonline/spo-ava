"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  items: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  keyExtractor: (item: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
  toolbar?: React.ReactNode;
  rowClassName?: (item: T) => string | undefined;
}

export function DataTable<T>({ items, columns, searchPlaceholder, searchFilter, keyExtractor, emptyTitle, emptyDescription, emptyAction, initialSort, toolbar, rowClassName }: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(initialSort ?? null);

  const filtered = React.useMemo(() => {
    if (!query || !searchFilter) return items;
    return items.filter((it) => searchFilter(it, query.trim().toLowerCase()));
  }, [items, query, searchFilter]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort, columns]);

  const onSort = (key: string) => {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  return (
    <div className="space-y-3">
      {(searchPlaceholder || toolbar) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {searchPlaceholder && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
              <Input placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
            </div>
          )}
          {toolbar}
        </div>
      )}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-text-light">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={cn(
                      "px-5 py-3 body-sm font-medium text-left",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center"
                    )}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(c.key)}
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {c.header}
                        {sort?.key !== c.key && <ChevronsUpDown className="h-3 w-3 opacity-60" />}
                        {sort?.key === c.key && sort.dir === "asc" && <ChevronUp className="h-3 w-3" />}
                        {sort?.key === c.key && sort.dir === "desc" && <ChevronDown className="h-3 w-3" />}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-12 text-center">
                    <p className="heading-sm text-text mb-1">{emptyTitle ?? "Nenhum item"}</p>
                    {emptyDescription && <p className="body-sm text-text-light mb-4">{emptyDescription}</p>}
                    {emptyAction}
                  </td>
                </tr>
              ) : (
                sorted.map((item) => (
                  <tr key={keyExtractor(item)} className={cn("hover:bg-surface/50", rowClassName?.(item))}>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-5 py-3 body-sm text-text",
                          c.align === "right" && "text-right",
                          c.align === "center" && "text-center",
                          c.className
                        )}
                      >
                        {c.cell(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {sorted.length > 0 && (
        <p className="caption text-text-light text-right">
          {sorted.length} {sorted.length === 1 ? "item" : "itens"}
        </p>
      )}
    </div>
  );
}
