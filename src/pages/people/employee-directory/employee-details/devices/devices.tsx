import {SearchAndFilter} from '@/components/common/search-and-filter';
import {Text} from '@/components/ui/typography';
import {FilterType} from '@/types';
import {IDevice} from '@/types/device';
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
import {Badge} from '@/components/ui/badge';
import {exportToCsv} from '@/helpers';
import {useNavigate, useParams} from 'react-router-dom';
import {ROUTES} from '@/router/routes';

const devices: IDevice[] = [
  {
    id: '1',
    device: 'Laptop',
    ID: 'LAP-123456',
    make: 'HP',
    model: 'EliteBook 840 G7',
    status: 'allocated',
  },
  {
    id: '2',
    device: 'Smartphone',
    ID: 'PHN-789012',
    make: 'Apple',
    model: 'iPhone 13 Pro',
    status: 'allocated',
  },
  {
    id: '3',
    device: 'Tablet',
    ID: 'TAB-345678',
    make: 'Samsung',
    model: 'Galaxy Tab S7',
    status: 'deprecated',
  },
  {
    id: '4',
    device: 'Desktop',
    ID: 'DESK-901234',
    make: 'Dell',
    model: 'OptiPlex 7090',
    status: 'dismissed',
  },
  {
    id: '5',
    device: 'Smartwatch',
    ID: 'SWT-567890',
    make: 'Garmin',
    model: 'Fenix 6X',
    status: 'dismissed',
  },
  {
    id: '6',
    device: 'Printer',
    ID: 'PRT-123678',
    make: 'Brother',
    model: 'HL-L2350DW',
    status: 'deprecated',
  },
  {
    id: '7',
    device: 'Router',
    ID: 'RTR-456789',
    make: 'Netgear',
    model: 'Nighthawk AX12',
    status: 'dismissed',
  },
  {
    id: '8',
    device: 'Monitor',
    ID: 'MON-678901',
    make: 'LG',
    model: 'UltraFine 4K',
    status: 'unallocated',
  },
  {
    id: '9',
    device: 'Laptop',
    ID: 'LAP-234567',
    make: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    status: 'unallocated',
  },
  {
    id: '10',
    device: 'Smartphone',
    ID: 'PHN-890123',
    make: 'Google',
    model: 'Pixel 6 Pro',
    status: 'allocated',
  },
];

export const EmployeeDevices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const jobRoleOptions = ['Software Engineer', 'Product Manager', 'Desinger'];
  const [make, setMake] = useState<string[]>([]);
  const makeOptions = ['MacBook', 'Hewlett-Packard', 'Dell', 'Acer'];
  const [status, setStatus] = useState<string[]>([]);
  const statusOptions = ['Active', 'Deactivated', 'Pending'];
  const filters: FilterType[] = [
    {
      label: 'Job role',
      critria: jobRoles,
      setCriteria: setJobRoles,
      filterOptions: jobRoleOptions,
    },
    {
      label: 'Make',
      critria: make,
      setCriteria: setMake,
      filterOptions: makeOptions,
    },
    {
      label: 'Status',
      critria: status,
      setCriteria: setStatus,
      filterOptions: statusOptions,
    },
  ];

  const navigate = useNavigate();
  const {employeeId = ''} = useParams();

  const columns: ColumnDef<IDevice>[] = [
    {
      accessorKey: 'device',
      header: 'Device',
      cell: ({row}) => (
        <div className="flex items-center gap-2 pr-6">
          <img src="/images/device.png" alt="" width={30} height={30} />
          <Text variant="body6" className="text-purple-300 font-medium">
            {row.getValue('device')}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: 'ID',
      header: 'ID',
    },
    {
      accessorKey: 'make',
      header: 'Make',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({row}) => (
        <Badge variant={row.getValue('status')} className="capitalize">
          {row.getValue('status')}
        </Badge>
      ),
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
    data: devices,
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

        <Button
          variant="secondary"
          onClick={() => exportToCsv(devices, 'devices')}
        >
          <img src="/images/article.svg" alt="" width={20} height={20} />
          Export report
        </Button>
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
                  <TableCell className=" whitespace-nowrap" key={cell.id}>
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
