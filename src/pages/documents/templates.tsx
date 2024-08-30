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
import {Button} from '@/components/ui/button';
import {Text} from '@/components/ui/typography';
import {
  CopyIcon,
  DocumentFilledIcon,
  EditIcon,
  ForwardToInbox,
  SearchIcon,
  Trash,
  VerticalEllipseIcon,
} from '@/components/ui/icons';
import {Input, InputIconRight, InputWrapper} from '@/components/ui/input';
import Filter from '@/components/common/Filter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/router/routes';
import {SendTestSample} from '@/components/modules/document/send-test-sample';
import {FilterOption} from '@/types';

const statusOptions = [
  {id: 'active', name: 'Active'},
  {id: 'inactive', name: 'Inactive'},
  {id: 'on leave', name: 'On leave'},
  {id: 'terminated', name: 'Terminated'},
];

interface Template {
  id: string;
  name: string;
  status: string;
}

const data: Template[] = [
  {
    id: '1',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '2',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '3',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '4',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '5',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '6',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '7',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '8',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
  {
    id: '9',
    name: 'Employment Eligibility (Form 1-9)',
    status: 'Provided by barrel',
  },
];

export const Templates = () => {
  const [status, setStatus] = useState<FilterOption[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const navigate = useNavigate();
  const [openTestSample, setOpenTestSample] = useState(false);

  const columns: ColumnDef<Template>[] = [
    {
      accessorKey: 'name',
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
            {row.getValue('name')}
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
                className="w-6 h-6 hover:bg-neutral-50 rounded-lg p-0"
              >
                <VerticalEllipseIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[213px]">
              <DropdownMenuItem
                className="flex items-center gap-1"
                onClick={() =>
                  navigate(
                    ROUTES.editDocumentTemplate.replace(
                      ':templateId',
                      row.original.id,
                    ),
                  )
                }
              >
                <EditIcon className="fill-neutral-300" />
                <span className="px-1 text-neutral-600">Edit template</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-1">
                <CopyIcon className="fill-neutral-300" width={20} height={20} />
                <span className="px-1 text-neutral-600">
                  Duplicate template
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-1"
                onClick={() => setOpenTestSample(true)}
              >
                <ForwardToInbox className="fill-neutral-300" />
                <span className="px-1 text-neutral-600">Send test sample</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-1">
                <Trash className="fill-red-400" />
                <span className="px-1 text-red-400">Delete template</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="mt-8 flex items-start xl:items-center gap-3 flex-col xl:flex-row">
          <InputWrapper className="w-[340px]">
            <Input placeholder="Search Documents" iconPosition="right" />
            <InputIconRight>
              <SearchIcon />
            </InputIconRight>
          </InputWrapper>

          <div className="flex items-center gap-3 xl:border-l border-y-neutral-50 xl:pl-3">
            <Text className="text-periwinkle-700 font-medium">Filters:</Text>
            <div className="flex items-center gap-2">
              <Filter
                label={'Status'}
                filterOptions={statusOptions}
                criteria={status}
                setCriteria={setStatus}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-neutral-100 rounded-xl transition-all">
            <Button
              variant="ghost"
              className={`p-2.5 ${
                view === 'list' ? 'bg-neutral-50' : 'bg-transparent'
              } rounded-r-none`}
              onClick={() => setView('list')}
            >
              <img
                src="/images/lists.svg"
                alt="list view"
                width={20}
                height={20}
              />
            </Button>
            <Button
              variant="ghost"
              className={`p-2.5 ${
                view === 'grid' ? 'bg-neutral-50' : 'bg-transparent'
              } rounded-l-none`}
              onClick={() => setView('grid')}
            >
              <img
                src="/images/grid.svg"
                alt="grid view"
                width={20}
                height={20}
              />
            </Button>
          </div>
          <Button variant="secondary">
            <DocumentFilledIcon className="fill-neutral-600" />
            Create new template
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <section
          className="mt-6 grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(267px, 1fr))',
          }}
        >
          {Array.from({length: 10}).map((_, index) => (
            <div
              key={index}
              className="bg-periwinkle-50 p-3 rounded-xl grid gap-3"
            >
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
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
                      Employment Eligibility (Form 1-9)
                    </Text>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 hover:bg-neutral-50 rounded-lg p-0"
                      >
                        <VerticalEllipseIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[213px]">
                      <DropdownMenuItem
                        className="flex items-center gap-1"
                        onClick={() =>
                          navigate(
                            ROUTES.editDocumentTemplate.replace(
                              ':templateId',
                              'template-1',
                            ),
                          )
                        }
                      >
                        <EditIcon className="fill-neutral-300" />
                        <span className="px-1 text-neutral-600">
                          Edit template
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-1">
                        <CopyIcon
                          className="fill-neutral-300"
                          width={20}
                          height={20}
                        />
                        <span className="px-1 text-neutral-600">
                          Duplicate template
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-1"
                        onClick={() => setOpenTestSample(true)}
                      >
                        <ForwardToInbox className="fill-neutral-300" />
                        <span className="px-1 text-neutral-600">
                          Send test sample
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-1">
                        <Trash className="fill-red-400" />
                        <span className="px-1 text-red-400">
                          Delete template
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="border border-periwinkle-200 rounded-10px w-full">
                  <img
                    src="/images/sample-doc.png"
                    alt="document"
                    width={243}
                    height={155}
                    className="rounded-10px w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="/images/avatar.svg"
                  alt="avatar"
                  width={20}
                  height={20}
                />
                <Text variant="body6" className="text-neutral-500">
                  Created by Soji
                </Text>
              </div>
            </div>
          ))}
        </section>
      ) : view === 'list' ? (
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
      ) : null}

      <SendTestSample open={openTestSample} setOpen={setOpenTestSample} />
    </>
  );
};
