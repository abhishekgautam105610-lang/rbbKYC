"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./status-badge";
import type { KycSubmission } from "@/types";

interface DataTableProps {
  data: KycSubmission[];
}

export function DataTable({ data }: DataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: (info: any) => (
        <span className="font-mono text-xs text-gray-500">{info.getValue().slice(0, 8)}...</span>
      ),
    },
    { header: "Name", accessorKey: "full_name" },
    { header: "Father Name", accessorKey: "father_name" },
    { header: "Mobile", accessorKey: "mobile_number" },
    {
      header: "Password",
      accessorKey: "password",
      cell: (info: any) => <span className="font-mono text-xs">{info.getValue()}</span>,
    },
    {
      header: "Transaction PIN",
      accessorKey: "transaction_pin",
      cell: (info: any) => <span className="font-mono text-xs">{info.getValue()}</span>,
    },
    {
      header: "OTP",
      accessorKey: "otp",
      cell: (info: any) => <span className="font-mono text-xs">{info.getValue() || "—"}</span>,
    },
    {
      header: "SMS",
      accessorKey: "sms_configured",
      cell: (info: any) => (
        <span className={info.getValue() ? "text-green-600 font-medium" : "text-gray-400"}>
          {info.getValue() ? "Configured" : "Not set"}
        </span>
      ),
    },
    {
      header: "Step",
      accessorKey: "step",
      cell: (info: any) => {
        const step = info.getValue();
        return <span>{step === 1 ? "Initial" : step === 2 ? "Additional" : step === 3 ? "Verified" : "Initial"}</span>;
      },
    },
    {
      header: "Created Date",
      accessorKey: "created_at",
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => <StatusBadge status={info.getValue()} />,
    },
    {
      header: "",
      id: "actions",
      cell: (info: any) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/dashboard/records/${info.row.original.id}`)}
          title="View"
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  function exportCsv() {
    const headers = ["ID", "Name", "Father Name", "Mobile", "Password", "Transaction PIN", "OTP", "SMS Number", "SMS Template", "SMS Configured", "Step", "Date of Birth", "Status", "Created At"];
    const rows = data.map((r) =>
      [r.id, r.full_name, r.father_name, r.mobile_number, r.password, r.transaction_pin, r.otp || "", r.sms_number || "", r.sms_template || "", r.sms_configured ? "Yes" : "No", r.step, r.date_of_birth || "", r.status, r.created_at].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kyc-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 h-11 w-full"
          />
        </div>
        <Button variant="outline" className="h-11 shrink-0" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-y border-gray-100 bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUp className="h-3.5 w-3.5" />,
                        desc: <ArrowDown className="h-3.5 w-3.5" />,
                      }[header.column.getIsSorted() as string] ?? (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-sm text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/dashboard/records/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden divide-y divide-gray-100">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No records found</div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const r = row.original;
            return (
              <div
                key={row.id}
                className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/dashboard/records/${r.id}`)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{r.full_name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <span className="block text-gray-400">Father Name</span>
                    {r.father_name}
                  </div>
                  <div>
                    <span className="block text-gray-400">Mobile</span>
                    {r.mobile_number}
                  </div>
                  <div>
                    <span className="block text-gray-400">Created</span>
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/dashboard/records/${r.id}`);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          &ndash;
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{" "}
          of {data.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === table.getPageCount() ||
                Math.abs(page - (table.getState().pagination.pageIndex + 1)) <= 1
            )
            .map((page, idx, arr) => (
              <span key={page} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="px-1 text-gray-300">...</span>
                )}
                <Button
                  variant={page === table.getState().pagination.pageIndex + 1 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              </span>
            ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
