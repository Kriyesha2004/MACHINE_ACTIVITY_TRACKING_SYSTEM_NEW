import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  searchableColumns?: (keyof T)[];
}

type SortDirection = 'asc' | 'desc' | null;

export const DataTable = React.forwardRef<any, DataTableProps<any>>(
  (
    {
      columns,
      data,
      rowKey,
      onRowClick,
      pageSize = 10,
      searchableColumns = [],
    },
    _ref
  ) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
      if (!searchTerm || searchableColumns.length === 0) return data;
      return data.filter((row) =>
        searchableColumns.some((col) =>
          String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [data, searchTerm, searchableColumns]);

    const sortedData = useMemo(() => {
      if (!sortKey || !sortDirection) return filteredData;
      return [...filteredData].sort((a, b) => {
        const aVal = a[sortKey as keyof typeof a];
        const bVal = b[sortKey as keyof typeof b];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortKey, sortDirection]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = useMemo(() => {
      const startIdx = (currentPage - 1) * pageSize;
      return sortedData.slice(startIdx, startIdx + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const handleSort = (key: string) => {
      if (sortKey === key) {
        if (sortDirection === 'asc') {
          setSortDirection('desc');
        } else if (sortDirection === 'desc') {
          setSortDirection(null);
          setSortKey(null);
        }
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
      setCurrentPage(1);
    };

    return (
      <div className="w-full space-y-4">
        {searchableColumns.length > 0 && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
          />
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-700/50 border-b border-slate-600">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`px-4 py-3 text-left font-semibold text-white ${col.width ? `w-${col.width}` : ''
                      } ${col.sortable ? 'cursor-pointer hover:bg-slate-700' : ''}`}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && (
                        <>
                          {sortKey === String(col.key) && sortDirection === 'asc' && (
                            <ChevronUp className="w-4 h-4 text-cyan-400" />
                          )}
                          {sortKey === String(col.key) && sortDirection === 'desc' && (
                            <ChevronDown className="w-4 h-4 text-cyan-400" />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={String(row[rowKey])}
                    className={`border-b border-slate-700 hover:bg-slate-700/30 ${onRowClick ? 'cursor-pointer' : ''
                      }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-slate-300">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({sortedData.length} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
