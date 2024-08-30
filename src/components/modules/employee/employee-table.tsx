/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {Loader} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
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
import {ROUTES} from '@/router/routes';
import {Input, InputIconRight, InputWrapper} from '@/components/ui/input';
import {
  EyeOpenIcon,
  PersonRemoveIcon,
  SearchIcon,
  TransitionIcon,
  VerticalEllipseIcon,
} from '@/components/ui/icons';
import {Text} from '@/components/ui/typography';
import Filter from '@/components/common/Filter';
import {Badge} from '@/components/ui/badge';
import {exportToCsv} from '@/helpers';
import {Manager, MembersApiResponse, MemberType} from '@/types/members';
import {FilterOption} from '@/types';
import {
  JobTitleDepartment,
  JobTitlesDepartmentsApiResponse,
} from '@/types/business';
import {Pagination} from '@/components/ui/pagination';

interface FilterState {
  job_title: string;
  manager: string;
  status: string;
}

interface EmployeeTableProps {
  jobTitlesRes: JobTitlesDepartmentsApiResponse;
  members: MembersApiResponse;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  search: string;
  setSearch: (search: string) => void;
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  hasFiltersApplied: boolean | string;
}

const statusOptions = [
  {id: 'active', name: 'Active'},
  {id: 'inactive', name: 'Inactive'},
  {id: 'on leave', name: 'On leave'},
  {id: 'terminated', name: 'Terminated'},
];

export const EmployeeTable = ({
  jobTitlesRes,
  members,
  filters,
  setFilters,
  page,
  setPage,
  limit,
  setLimit,
  search,
  setSearch,
  hasFiltersApplied,
}: EmployeeTableProps) => {
  const navigate = useNavigate();

  const totalPages = members?.data?.paginate?.totalPages || 1;

  const tableData = useMemo(() => {
    return (
      members?.data?.result?.map((m: MemberType) => {
        return {
          id: m.id,
          firstName: m.user.first_name,
          lastName: m.user.last_name,
          email: m.user.email,
          jobRole: m.role,
          manager: m.manager,
          status: m.status,
        };
      }) || []
    );
  }, [members]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const managerOptions: Manager[] =
    members?.data.result
      ?.filter((m: MemberType) => m.role !== 'member' && m.role !== null)
      .map((m: MemberType) => ({
        id: m.id,
        name: `${m.user.first_name} ${m.user.last_name}`,
        avatar: m.user.avatar,
      })) || [];

  const jobTitlesOptions =
    jobTitlesRes?.data.map((jobTitle: JobTitleDepartment) => ({
      id: jobTitle.id,
      name: jobTitle.name,
    })) || [];

  const updateFilter = (
    key: keyof FilterState,
    selectedOptions: FilterOption[],
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: selectedOptions.map(option => option.id).join(','),
    }));
  };

  const getCriteria = (
    filterKey: keyof FilterState,
    options: FilterOption[],
  ) => {
    return filters[filterKey]
      .split(',')
      .map(id => options.find(option => option.id === id)!)
      .filter(Boolean);
  };

  const getManagerName = (managerId: string) => {
    const manager = members?.data.result.find(
      (m: MemberType) => m.id === managerId,
    );
    return manager
      ? `${manager.user.first_name} ${manager.user.last_name}`
      : '-';
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({table}) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({row}) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'firstName',
      header: 'First name',
      cell: ({row}) => (
        <div className="capitalize">{row.getValue('firstName')}</div>
      ),
    },
    {
      accessorKey: 'lastName',
      header: 'Last name',
      cell: ({row}) => (
        <div className="capitalize">{row.getValue('lastName')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Work email',
      cell: ({row}) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'jobRole',
      header: 'Job role',
      cell: ({row}) => (
        <div className="capitalize">{row.getValue('jobRole') ?? '-'}</div>
      ),
    },
    {
      accessorKey: 'manager',
      header: 'Manager',
      cell: ({row}) => (
        <div className="capitalize">
          {getManagerName(row.getValue('manager')) ?? '-'}
        </div>
      ),
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
              <DropdownMenuItem>
                <PersonRemoveIcon className="mr-2" />
                Off-board
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TransitionIcon className="mr-2" />
                Transition
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES.employeePersonalDetails.replace(
                      ':employeeId',
                      row.original.id,
                    ),
                  );
                }}
              >
                <EyeOpenIcon className="mr-2" />
                View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-start gap-4 justify-between">
        <div className="flex xl:items-center gap-3 flex-col xl:flex-row">
          <InputWrapper className="w-[350px]">
            <Input
              placeholder="Search Team members"
              value={search}
              onChange={e => setSearch(e.target.value)}
              iconPosition="right"
            />
            <InputIconRight>
              <SearchIcon />
            </InputIconRight>
          </InputWrapper>

          <div className="flex items-center gap-3 xl:border-l border-y-neutral-50 xl:pl-3">
            <Text className="text-periwinkle-700 font-medium">Filters:</Text>
            <div className="flex items-center gap-2">
              <Filter
                label="Job title"
                filterOptions={jobTitlesOptions}
                criteria={getCriteria('job_title', jobTitlesOptions)}
                setCriteria={selectedOptions =>
                  updateFilter('job_title', selectedOptions)
                }
              />
              <Filter
                label="Manager"
                filterOptions={managerOptions}
                criteria={getCriteria('manager', managerOptions)}
                setCriteria={selectedOptions =>
                  updateFilter('manager', selectedOptions)
                }
              />
              <Filter
                label="Status"
                filterOptions={statusOptions}
                criteria={getCriteria('status', statusOptions)}
                setCriteria={selectedOptions =>
                  updateFilter('status', selectedOptions)
                }
              />
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => exportToCsv(tableData, 'employees')}
        >
          <img src="/images/article.svg" alt="" width={20} height={20} />
          Export report
        </Button>
      </div>

      {!members ? (
        <div className="w-full pt-20 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
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
              ) : hasFiltersApplied ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            pageSize={limit}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        </>
      )}
    </div>
  );
};
