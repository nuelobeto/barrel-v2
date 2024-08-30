import {SearchAndFilter} from '@/components/common/search-and-filter';
import {FilterType, ViewType} from '@/types';
import {useState} from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {DownArrowIcon, Trash, VerticalEllipseIcon} from '@/components/ui/icons';
import {useNavigate, useParams} from 'react-router-dom';
import {ROUTES} from '@/router/routes';
import {IPayslip} from '@/types/members';
import {ViewSwitch} from '@/components/common/view-switch';

const payslipData: IPayslip[] = [
  {
    id: 'b2a8e7b4-7a3c-4a9a-bb79-7b9c5a1c7e4d',
    month: 'January',
    date: '2024-01-15',
  },
  {
    id: '9a7e9d2a-7889-4b54-90f3-8c71a92b8e5e',
    month: 'February',
    date: '2024-02-15',
  },
  {
    id: 'dd6e73d3-3888-4b84-8e67-7d64e7b9f5f6',
    month: 'March',
    date: '2024-03-15',
  },
  {
    id: 'b2e5a8b9-1c75-4d09-8911-c1b1d56b847b',
    month: 'April',
    date: '2024-04-15',
  },
  {
    id: 'd9b7a4c8-6d02-4d26-9394-1c6d4a1e2e58',
    month: 'May',
    date: '2024-05-15',
  },
  {
    id: 'e8a6f97b-3c5e-4d6a-8a3a-1a9b3c45d5d7',
    month: 'June',
    date: '2024-06-15',
  },
  {
    id: 'f3c1e2d4-1b88-4f2a-8a7a-d2a8f9d4d3e5',
    month: 'July',
    date: '2024-07-15',
  },
  {
    id: '6d45f8b9-2b3d-4c8a-8c56-3a7e9b5c6d3f',
    month: 'August',
    date: '2024-08-15',
  },
  {
    id: '4e8d3b56-5f78-4c9a-9c3d-2a9b4c8f6d7e',
    month: 'September',
    date: '2024-09-15',
  },
  {
    id: 'b7d5c3e8-9d1e-4b9a-8a9f-2b6e4c5d7e8f',
    month: 'October',
    date: '2024-10-15',
  },
];

export const EmployeePayslip = () => {
  const [view, setView] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<string[]>([]);
  const statusOptions = ['Active', 'Deactivated', 'Pending'];
  const filters: FilterType[] = [
    {
      label: 'Status',
      critria: status,
      setCriteria: setStatus,
      filterOptions: statusOptions,
    },
  ];

  const navigate = useNavigate();
  const {employeeId = ''} = useParams();

  const columns: ColumnDef<IPayslip>[] = [
    {
      accessorKey: 'month',
      header: 'Month',
    },
    {
      accessorKey: 'date',
      header: 'Date paid',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({row}) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 hover:bg-neutral-50"
              >
                <VerticalEllipseIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[213px]">
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    ROUTES.employeeDeviceDetails
                      .replace(':employeeId', employeeId)
                      .replace(':deviceId', row.original.id),
                  )
                }
              >
                {/* <EyeOpenIcon className="fill-neutral-300" /> */}
                <span className="px-1 text-neutral-600">Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="fill-red-400" />
                <span className="px-1 text-red-400">Remove Device</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: payslipData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
        />

        <ViewSwitch view={view} setView={setView} />
      </div>

      <Table className="mt-6">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell className="whitespace-nowrap" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-4 border-t border-neutral-50">
        <div className="flex items-center gap-0.5">
          <Button
            variant="secondary"
            className="w-8 h-[26px] rounded-lg text-xs text-periwinkle-800 bg-periwinkle-50 hover:bg-periwinkle-50 active:bg-periwinkle-100 border-transparent"
          >
            1
          </Button>
        </div>

        <Button className="rounded-lg bg-periwinkle-25 hover:bg-periwinkle-50 text-xs font-semibold text-[#344054] active:bg-periwinkle-100">
          Showing {table.getFilteredRowModel().rows?.length} entries
          <DownArrowIcon className="fill-[#101828]" />
        </Button>
      </div>
    </>
  );
};
