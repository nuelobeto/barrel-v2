import {SearchAndFilter} from '@/components/common/search-and-filter';
import {ViewSwitch} from '@/components/common/view-switch';
import {FilterOption, FilterType, ViewType} from '@/types';
import {IEmployeeDocument} from '@/types/document';
import {useState} from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  CopyIcon,
  DocumentFilledIcon,
  EditIcon,
  EyeOpenIcon,
  Trash,
  VerticalEllipseIcon,
} from '@/components/ui/icons';
import {Text} from '@/components/ui/typography';

const data: IEmployeeDocument[] = [
  {
    id: '1a2b3c',
    title: 'Project Plan',
    status: 'Provided by barrel',
    created_by: 'Emmanuel',
  },
  {
    id: '4d5e6f',
    title: 'Marketing Strategy',
    status: 'Provided by barrel',
    created_by: 'Soji',
  },
  {
    id: '7g8h9i',
    title: 'Sales Report',
    status: 'Provided by barrel',
    created_by: 'Dayo',
  },
  {
    id: '7g8h9d',
    title: 'Engineering Report',
    status: 'Provided by barrel',
    created_by: 'Taslim',
  },
];

const columns: ColumnDef<IEmployeeDocument>[] = [
  {
    accessorKey: 'title',
    header: 'Name',
    cell: ({row}) => (
      <div className="flex items-center gap-2 pr-6">
        <div className="bg-orange-25 flex items-center justify-center w-7.5 h-7.5 rounded-2.5xl">
          <DocumentFilledIcon
            className="fill-orange-400"
            width={16}
            height={16}
          />
        </div>
        <Text variant="body6" className="text-neutral-400 font-medium">
          {row.getValue('title')}
        </Text>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => (
      <div className="flex items-center gap-3">
        <img src="/images/avatar.svg" alt="avatar" width={20} height={20} />
        <Text variant="body5" className="font-normal text-neutral-600">
          {row.getValue('status')}
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
            <DropdownMenuItem>
              <EyeOpenIcon className="fill-neutral-300" />
              <span
                className="px-1 text-neutral-600"
                onClick={() => console.log(row.original.id)}
              >
                View
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EditIcon className="fill-neutral-300" />
              <span className="px-1 text-neutral-600">Edit template</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon className="fill-neutral-300" width={20} height={20} />
              <span className="px-1 text-neutral-600">Duplicate template</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="fill-red-400" />
              <span className="px-1 text-red-400">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const EmployeeDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<FilterOption[]>([]);
  const [view, setView] = useState<ViewType>('list');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const filters: FilterType[] = [
    {
      label: 'Status',
      critria: status,
      setCriteria: setStatus,
      filterOptions: [
        {id: 'draft', name: 'draft'},
        {id: 'published', name: 'published'},
        {id: 'archived', name: 'archived'},
      ],
    },
  ];

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

      <>
        {view === 'list' && (
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
        )}

        {view === 'grid' && (
          <div className="mt-6 grid grid-cols-4 min-[1700]:grid-cols-5 gap-4">
            {data.map((document, index) => (
              <div key={index} className="bg-periwinkle-50 rounded-xl p-3">
                {/* header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 pr-6">
                    <div className="bg-orange-25 flex items-center justify-center w-7.5 h-7.5 rounded-2.5xl">
                      <DocumentFilledIcon
                        className="fill-orange-400"
                        width={16}
                        height={16}
                      />
                    </div>
                    <Text
                      variant="body6"
                      className="text-neutral-500 font-medium whitespace-normal line-clamp-1"
                    >
                      {document.title}
                    </Text>
                  </div>
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
                      <DropdownMenuItem>
                        <EyeOpenIcon className="fill-neutral-300" />
                        <span
                          className="px-1 text-neutral-600"
                          onClick={() => console.log(document.id)}
                        >
                          View
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EditIcon className="fill-neutral-300" />
                        <span className="px-1 text-neutral-600">
                          Edit template
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CopyIcon
                          className="fill-neutral-300"
                          width={20}
                          height={20}
                        />
                        <span className="px-1 text-neutral-600">
                          Duplicate template
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="fill-red-400" />
                        <span className="px-1 text-red-400">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* body */}
                <div className="border border-periwinkle-200 rounded-10px w-full mb-3">
                  <img
                    src="/images/sample-doc.png"
                    alt="document"
                    width={243}
                    height={155}
                    className="rounded-10px w-full"
                  />
                </div>

                {/* footer */}
                <div className="flex items-center gap-3">
                  <img
                    src="/images/avatar.svg"
                    alt="avatar"
                    width={20}
                    height={20}
                  />
                  <Text
                    variant="body6"
                    className="font-normal text-neutral-500"
                  >
                    {document.created_by}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    </>
  );
};
