import {SearchAndFilter} from '@/components/common/search-and-filter';
import {Text} from '@/components/ui/typography';
import {FilterOption, FilterType, ViewType} from '@/types';
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
import {useNavigate, useParams} from 'react-router-dom';
import {ROUTES} from '@/router/routes';
import {ViewSwitch} from '@/components/common/view-switch';
import {IApp} from '@/types/members';

const appData: IApp[] = [
  {
    id: '1e62bda2-b3e2-4e6b-94c7-3b9b541a46e7',
    app: 'Slack',
    icon: '/images/slack.png',
    version: '1.0.0',
    date_installed: '2024-08-01',
    managed_by: 'f1f8a1d1-2a3f-4a34-9d8b-1c2127b7ef8d',
    status: 'installed',
  },
  {
    id: 'a24e63ab-fd5b-4cd1-9d2e-340d09e66d5c',
    app: 'Linear',
    icon: '/images/linear.png',
    version: '2.1.0',
    date_installed: '2024-08-05',
    managed_by: '35f9d123-5611-41f1-8c37-178df57d4f3d',
    status: 'downloading',
  },
  {
    id: '2dbe3a94-4c38-4d8b-abe8-d9bc7e0c86d3',
    app: 'Google Chrome',
    icon: '/images/chrome.png',
    version: '1.80.2',
    date_installed: '2024-08-07',
    managed_by: 'e23c91f5-6d3f-4f08-bc4c-2f1f314f27c3',
    status: 'uninstalled',
  },
  {
    id: 'f39d2b61-6e63-46e3-8b9a-4a97a7b53591',
    app: 'Adobe Photoshop',
    icon: '/images/adobe_photoshop.png',
    version: '4.30.0',
    date_installed: '2024-08-09',
    managed_by: 'c73d5f49-2844-473d-8b3f-b512c5a938d5',
    status: 'installed',
  },
  {
    id: '7c9d9f3d-b876-49d8-b6ab-8e9cfc5ec4cd',
    app: 'Adobe illustrator',
    icon: '/images/adobe_illustrator.png',
    version: '2.14.6',
    date_installed: '2024-08-10',
    managed_by: 'f4c8f0b9-5b6f-4824-9c8e-4e3d9f5f6f2e',
    status: 'downloading',
  },
  {
    id: 'fc2e9d45-a834-4d62-8a6d-b2f6c3f5a4b2',
    app: 'Microsoft Word',
    icon: '/images/ms_word.png',
    version: '8.8.60.477',
    date_installed: '2024-08-12',
    managed_by: 'a24b6d91-7394-453a-9c8f-2d4e5f6a4d5c',
    status: 'uninstalled',
  },
  {
    id: 'af3e1f4d-7e6b-490c-8e1d-9f6c3f7e8f3a',
    app: 'Microsoft Excel',
    icon: '/images/ms_excel.png',
    version: '5.15.2',
    date_installed: '2024-08-14',
    managed_by: 'b7d5c2a8-4b3f-48f1-b6c3-8f2e3d5c7a1d',
    status: 'installed',
  },
  {
    id: 'd3f6e1c5-9b3d-4e7c-8c1f-2f8d5b4a7e6b',
    app: 'Adobe premier pro',
    icon: '/images/adobe_indesign.png',
    version: '4.0.2',
    date_installed: '2024-08-15',
    managed_by: 'c2f3d5a7-1f4b-4e6b-8c9f-2e4f7c5d3a1b',
    status: 'downloading',
  },
  {
    id: 'c5f7e2b8-3a9f-4d8c-9c1d-5f4b3e7c6d2a',
    app: 'Zoom',
    icon: '/images/zoom.png',
    version: '8.22.1',
    date_installed: '2024-08-16',
    managed_by: 'e3d5f6a8-4b3c-4f1d-8e2c-9f7a5d6c3a1f',
    status: 'uninstalled',
  },
  {
    id: 'b2f4e3d5-8c1a-4d9f-8e6d-2a4c7f5b3d2a',
    app: 'Visual Studio Code',
    icon: '/images/vs_code.png',
    version: '53.1.12',
    date_installed: '2024-08-18',
    managed_by: 'f6c3e5a7-1b4f-4d6c-8f1d-9b2a5d7c3a9f',
    status: 'installed',
  },
];

export const EmployeeApps = () => {
  const [view, setView] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<FilterOption[]>([]);
  const statusOptions = [
    {id: 'active', name: 'Active'},
    {id: 'inactive', name: 'Inactive'},
    {id: 'on leave', name: 'On leave'},
    {id: 'terminated', name: 'Terminated'},
  ];
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

  const columns: ColumnDef<IApp>[] = [
    {
      accessorKey: 'app',
      header: 'App',
      cell: ({row}) => (
        <div className="flex items-center gap-2 pr-6">
          <img src={row.original.icon} alt="" width={30} height={30} />
          <Text variant="body6" className="text-neutral-400">
            {row.getValue('app')}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: 'version',
      header: 'Version',
    },
    {
      accessorKey: 'date_installed',
      header: 'Date installed',
    },
    {
      accessorKey: 'managed_by',
      header: 'Managed by',
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
                <span className="px-1 text-red-400">Remove App</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: appData,
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
      {view === 'list' && (
        <>
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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
      )}

      {view == 'grid' && (
        <div className="grid grid-cols-4 gap-6 mt-6">
          {appData.map((app, index) => (
            <div
              key={index}
              className="flex flex-col border border-neutral-50 p-4 pb-1 rounded-xl"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <img src={app.icon} alt="" width={30} height={30} />
                  <Badge variant={app.status}>{app.status}</Badge>
                </div>
                <Text
                  variant="body4"
                  className="text-neutral-600 font-semibold"
                >
                  Slack
                </Text>
                <div className="flex items-center justify-between py-4">
                  <Text variant={'body6'} className="font-medium">
                    Version
                  </Text>
                  <Text variant={'body6'} className="text-neutral-400">
                    72.1.8
                  </Text>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-neutral-50">
                <Text variant={'body6'} className="font-medium">
                  Date installed
                </Text>
                <Text variant={'body6'} className="text-neutral-400">
                  {app.date_installed}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
