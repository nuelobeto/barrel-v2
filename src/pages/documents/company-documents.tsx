import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
  Archive,
  DocumentFilledIcon,
  EditIcon,
  SearchIcon,
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
import {DocumentsApiResponse, IDocument} from '@/types/document';
import {useQuery} from '@tanstack/react-query';
import {Loader} from 'lucide-react';
import useAuth from '@/store/useAuth';
import {ROUTES} from '@/router/routes';
import UploadTemplateTriggerAction from '@/components/modules/document/upload-template';
import {FilterOption} from '@/types';

interface FilterState {
  status: string[];
}

const statusOptions = [
  {id: 'active', name: 'Active'},
  {id: 'deactivated', name: 'Deactivated'},
  {id: 'pending', name: 'Pending'},
];

const fetchPdfDocuments = async (): Promise<DocumentsApiResponse> => {
  const response = await fetch('http://localhost:3001/documents');
  if (!response.ok) {
    throw new Error('Failed to fetch state');
  }
  return response.json();
};

export const CompanyDocuments = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('grid');
  const {user} = useAuth();

  const [filters, setFilters] = useState<FilterState>({
    status: [],
  });

  const updateFilter = (
    key: keyof FilterState,
    selectedOptions: FilterOption[],
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: selectedOptions.map(option => option.id),
    }));
  };

  const {data: documentsData, status: documentsStatus} = useQuery({
    queryKey: ['documents'],
    queryFn: () => fetchPdfDocuments(),
  });

  const documents = documentsData?.data;

  const columns: ColumnDef<IDocument>[] = [
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
          <Text
            variant="body5"
            className="font-normal text-neutral-600 capitalize"
          >
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
                    ROUTES.editDocument.replace(':docId', row.original.id),
                  )
                }
              >
                <EditIcon className="fill-neutral-300" />
                <span className="px-1 text-neutral-600">Edit document</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-1">
                <Archive className="fill-neutral-300" width={20} height={20} />
                <span className="px-1 text-neutral-600">Archive document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: documents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (documentsStatus === 'pending') {
    return (
      <div className="flex items-center justify-center w-full py-20">
        <Loader className="animate-spin" />
      </div>
    );
  }

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
                label="Status"
                filterOptions={statusOptions}
                criteria={filters.status.map(
                  id => statusOptions.find(o => o.id === id) as FilterOption,
                )}
                setCriteria={criteria => updateFilter('status', criteria)}
              />
            </div>
          </div>
        </div>

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
      </div>

      {!documents?.length ? (
        <section className="mt-10 px-6">
          <div className="mt-35 flex flex-col items-center justify-center">
            <Text
              element="h2"
              variant="heading9"
              className="font-semibold text-neutral-600"
            >
              No documents added yet.
            </Text>
            <Text className="text-periwinkle-800 mt-2 max-w-[523px]">
              Entrust your heart (docs) with us, we promise we won’t break it.
            </Text>
            <div className="mt-6 flex items-center gap-4">
              <UploadTemplateTriggerAction>
                <Button>
                  <DocumentFilledIcon className="fill-white" />
                  Upload document
                </Button>
              </UploadTemplateTriggerAction>
              <Link to={ROUTES.documentTemplates}>
                <Button variant="ghost" className="text-purple-400 p-0">
                  Explore templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {view === 'grid' ? (
            <section
              className="mt-6 grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(267px, 1fr))',
              }}
            >
              {documents?.map(doc => (
                <div
                  key={doc.id}
                  className="bg-periwinkle-50 p-3 rounded-xl grid gap-3 "
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
                          {doc.title}
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
                                ROUTES.editDocument.replace(':docId', doc.id),
                              )
                            }
                          >
                            <EditIcon className="fill-neutral-300" />
                            <span className="px-1 text-neutral-600">
                              Edit document
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-1">
                            <Archive
                              className="fill-neutral-300"
                              width={20}
                              height={20}
                            />
                            <span className="px-1 text-neutral-600">
                              Archive document
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="border border-periwinkle-200 rounded-10px w-full">
                      <img
                        src={
                          doc.content[0].imageUrl || '/images/sample-doc.svg'
                        }
                        alt="document"
                        width={243}
                        height={155}
                        className="rounded-10px w-full object-cover object-top h-[155px]"
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
                      Created by {user?.user_name}
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
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap"
                        >
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
        </>
      )}
    </>
  );
};
