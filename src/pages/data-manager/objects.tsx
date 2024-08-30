import {SearchAndFilter} from '@/components/common/search-and-filter';
import {Text} from '@/components/ui/typography';
import {FilterOption, FilterType} from '@/types';
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
import {
  DownArrowIcon,
  StarIcon,
  VerticalEllipseIcon,
} from '@/components/ui/icons';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/router/routes';
import {IObject} from '@/types/data-manager';

const objectData: IObject[] = [
  {
    id: '1e62bda2-b3e2-4e6b-94c7-3b9b541a46e7',
    object_name: 'Employee',
    category: 'Personal details',
    api_name: 'employee__deets',
    type: 'Custom object',
    last_modified: 'by Taslim Oseni',
    modified_at: '04/23/2024',
  },
  {
    id: 'a24e63ab-fd5b-4cd1-9d2e-340d09e66d5c',
    object_name: 'Devices',
    category: 'Compensation details',
    api_name: 'compensation__deets',
    type: 'Custom object',
    last_modified: 'by Taslim Oseni',
    modified_at: '04/23/2024',
  },
  {
    id: '2dbe3a94-4c38-4d8b-abe8-d9bc7e0c86d3',
    object_name: 'Compensations',
    category: 'Work details',
    api_name: 'work_deets',
    type: 'Custom object',
    last_modified: 'by Taslim Oseni',
    modified_at: '04/23/2024',
  },
  {
    id: 'f39d2b61-6e63-46e3-8b9a-4a97a7b53591',
    object_name: 'Documents',
    category: 'document details',
    api_name: 'document_deets',
    type: 'Custom object',
    last_modified: 'by Taslim Oseni',
    modified_at: '04/23/2024',
  },
  {
    id: 'fc2e9d45-a834-4d62-8a6d-b2f6c3f5a4b2',
    object_name: 'Payslips',
    category: 'Payslip details',
    api_name: 'payroll_deets',
    type: 'Custom object',
    last_modified: 'by Taslim Oseni',
    modified_at: '04/23/2024',
  },
  {
    id: 'af3e1f4d-7e6b-490c-8e1d-9f6c3f7e8f3a',
    object_name: 'Seyi',
    category: 'Personal details',
    api_name: 'personal_deets',
    type: 'Barrel object',
    last_modified: null,
    modified_at: null,
  },
  {
    id: 'af3e1f4d-7e6b-490c-8e1d-9f6c3f7e8f3a',
    object_name: 'Kehinde',
    category: 'Payslip details',
    api_name: 'payslip_deets',
    type: 'Barrel object',
    last_modified: null,
    modified_at: null,
  },
];

export const DataManagerObjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<FilterOption[]>([]);
  const categoryOptions = [
    {id: 'Personal details', name: 'Personal details'},
    {id: 'Compensation details', name: 'Compensation details'},
    {id: 'Work details', name: 'Work details'},
    {id: 'document details', name: 'document details'},
  ];
  const filters: FilterType[] = [
    {
      label: 'Category',
      critria: category,
      setCriteria: setCategory,
      filterOptions: categoryOptions,
    },
  ];

  const navigate = useNavigate();

  const columns: ColumnDef<IObject>[] = [
    {
      id: 'select',
      header: () => <StarIcon className="fill-periwinkle-500" />,
      cell: () => <StarIcon className="fill-periwinkle-500" />,
    },
    {
      accessorKey: 'object_name',
      header: 'Object name',
      cell: ({row}) => (
        <Text variant="body6" className="text-purple-300">
          {row.getValue('object_name')}
        </Text>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'api_name',
      header: 'Api name',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'last_modified',
      header: 'Last modified',
      cell: ({row}) => (
        <div className="flex items-center gap-2 pr-6">
          <Text variant="body6" className="text-purple-300">
            {row.getValue('last_modified')}
          </Text>
          .
          <Text variant={'body6'} className="text-neutral-300">
            {row.original.modified_at}
          </Text>
        </div>
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
                    ROUTES.dataManagerAddField.replace(
                      ':objectId',
                      row.original.id,
                    ),
                  )
                }
              >
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: objectData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
        />
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
    </div>
  );
};
