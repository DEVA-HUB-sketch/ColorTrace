import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from '@tanstack/react-table';
import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import { getDemoRecordsForTable } from '@/state/demoData';
import type { TestRecord } from '@/types/testRecord';
import { getResultClasses } from '@/utils/recordUtils';

const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 3,
};

export default function TestRecordsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [integrityFilter, setIntegrityFilter] = useState('all');
  const [blockchainFilter, setBlockchainFilter] = useState('all');
  const [syncFilter, setSyncFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortState, setSortState] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const filteredRecords = useMemo(
    () =>
      getDemoRecordsForTable({
        search,
        result: resultFilter,
        integrity: integrityFilter,
        blockchain: blockchainFilter,
        sync: syncFilter,
        dateFrom,
        dateTo,
      }),
    [search, resultFilter, integrityFilter, blockchainFilter, syncFilter, dateFrom, dateTo]
  );

  const columns = useMemo<ColumnDef<TestRecord>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Record ID',
      },
      {
        accessorKey: 'result',
        header: 'Result',
        cell: ({ row }) => (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getResultClasses(row.original.result)}`}>
            {row.original.result}
          </span>
        ),
      },
      {
        accessorKey: 'configuration',
        header: 'Configuration',
      },
      {
        accessorKey: 'timestamp',
        header: 'Date/Time',
      },
      {
        accessorKey: 'operator',
        header: 'Operator',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'integrityStatus',
        header: 'Integrity',
        cell: ({ row }) => <IntegrityStatusBadge status={row.original.integrityStatus} type="integrity" />,
      },
      {
        accessorKey: 'blockchainStatus',
        header: 'Blockchain',
        cell: ({ row }) => <IntegrityStatusBadge status={row.original.blockchainStatus} type="blockchain" />,
      },
      {
        accessorKey: 'syncStatus',
        header: 'Sync',
        cell: ({ row }) => <IntegrityStatusBadge status={row.original.syncStatus} type="sync" />,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <button
            className="rounded-xl bg-primaryBlue px-3 py-1.5 text-xs font-semibold text-white"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/test-records/${row.original.id}`);
            }}
          >
            View
          </button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: filteredRecords,
    columns,
    state: {
      sorting: sortState,
      pagination,
    },
    onSortingChange: setSortState,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: defaultPagination,
    },
  });

  const totalRecords = filteredRecords.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount() || 1;

  const clearFilters = () => {
    setSearch('');
    setResultFilter('all');
    setIntegrityFilter('all');
    setBlockchainFilter('all');
    setSyncFilter('all');
    setDateFrom('');
    setDateTo('');
    setPagination(defaultPagination);
  };

  const handleRowClick = (recordId: string) => {
    setSelectedRecordId(recordId);
    navigate(`/test-records/${recordId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Records</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Test Records</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20"
            placeholder="Search by record ID, operator, or location"
          />

          <select value={resultFilter} onChange={(event) => setResultFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20">
            <option value="all">All results</option>
            <option value="POSITIVE">POSITIVE</option>
            <option value="NEGATIVE">NEGATIVE</option>
            <option value="INCONCLUSIVE">INCONCLUSIVE</option>
          </select>

          <select value={integrityFilter} onChange={(event) => setIntegrityFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20">
            <option value="all">All integrity</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="UNAVAILABLE">UNAVAILABLE</option>
          </select>

          <select value={blockchainFilter} onChange={(event) => setBlockchainFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20">
            <option value="all">All blockchain</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="UNAVAILABLE">UNAVAILABLE</option>
          </select>

          <select value={syncFilter} onChange={(event) => setSyncFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20">
            <option value="all">All sync</option>
            <option value="SYNCED">SYNCED</option>
            <option value="PENDING">PENDING</option>
            <option value="SYNCING">SYNCING</option>
            <option value="RETRY">RETRY</option>
            <option value="FAILED">FAILED</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>

          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20" />
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20" />

          <button onClick={clearFilters} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-primaryText">
            Clear
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-secondaryText">
          <span>Showing {totalRecords} records</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-secondaryText">
            No records match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-offWhite text-secondaryText">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3">
                        {header.isPlaceholder ? null : (
                          <button
                            className="flex items-center gap-1 font-medium text-secondaryText"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' && ' ↑'}
                            {header.column.getIsSorted() === 'desc' && ' ↓'}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.original.id)}
                    className={`cursor-pointer transition hover:bg-slate-50 ${selectedRecordId === row.original.id ? 'bg-slate-50' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-primaryText disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>

          <span className="text-sm text-secondaryText">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-primaryText disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
