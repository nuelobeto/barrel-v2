/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
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
  CheckMarkIcon,
  DownArrowIcon,
  EditIcon,
  PlusIcon,
  Trash,
  VerticalEllipseIcon,
} from '@/components/ui/icons';
import {IField} from '@/types/data-manager';
import {DataTypeBadge} from '@/components/ui/data-type-badge';
import {AddOrEditCustomField} from '@/components/modules/data-manager/add-edit-custom-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/router/routes';

const fieldData: IField[] = [
  {
    id: '1e62bda2-b3e2-4e6b-94c7-3b9b541a46e7',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'text',
    type: 'Custom',
  },
  {
    id: 'a24e63ab-fd5b-4cd1-9d2e-340d09e66d5c',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'text',
    type: 'Custom',
  },
  {
    id: '2dbe3a94-4c38-4d8b-abe8-d9bc7e0c86d3',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'text',
    type: 'Custom',
  },
  {
    id: 'f39d2b61-6e63-46e3-8b9a-4a97a7b53591',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'date',
    type: 'Custom',
  },
  {
    id: 'fc2e9d45-a834-4d62-8a6d-b2f6c3f5a4b2',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'date',
    type: 'Custom',
  },
  {
    id: 'af3e1f4d-7e6b-490c-8e1d-9f6c3f7e8f3a',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'text',
    type: 'Custom',
  },
  {
    id: 'af3e1f4d-7e6b-490c-8e1d-9f6c3f7e8f3a',
    field_name: 'Employee first name',
    field_description: 'Customfieldswithinput',
    section: 'Employee directory',
    data_type: 'date',
    type: 'Custom',
  },
];

export default function DataObject() {
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<FilterOption[]>([]);
  const [payload, setPayload] = useState<any | null>(null);
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

  const columns: ColumnDef<IField>[] = [
    {
      accessorKey: 'field_name',
      header: 'Field name & descriptions',
      cell: ({row}) => (
        <div className="flex items-center gap-2 pr-6">
          <Text
            variant="body6"
            className="text-purple-300 underline underline-offset-1"
          >
            {row.getValue('field_name')}
          </Text>
          .
          <Text variant={'body6'} className="text-neutral-300">
            {row.original.field_description}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: 'section',
      header: 'Section',
    },
    {
      accessorKey: 'data_type',
      header: 'Data type',
      cell: ({row}) => <DataTypeBadge type={row.original.data_type} />,
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
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
              <DropdownMenuItem onClick={() => setOpenEditDrawer(true)}>
                <EditIcon />
                Edit field
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                <Trash className="fill-red-400" />
                <span className="text-red-400">Delete Field</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: fieldData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSave = (payload: any) => {
    console.log(payload, 'add');
    setSuccess(true);
  };

  const handleSaveEdit = (payload: any) => {
    setOpenConfirmDialog(true);
    setPayload(payload);
  };

  const confirmSaveEdit = () => {
    console.log(payload, 'edit');
    setOpenConfirmDialog(false);
    setSuccess(true);
  };

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Header>
        <Text variant={'heading10'} element="h1" className="font-bold">
          Data manager
        </Text>

        <Button onClick={() => setOpenAddDrawer(true)}>
          <PlusIcon className="fill-white" />
          Add field
        </Button>
      </Header>

      <Main>
        <div className="py-8 px-6">
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
        </div>

        <AddOrEditCustomField
          open={openAddDrawer}
          setOpen={setOpenAddDrawer}
          title="Create a custom field"
          description={`Tell us about the field you want to create and how you'd like
                  to collect the data for it.`}
          handleSave={handleSave}
        />

        <AddOrEditCustomField
          open={openEditDrawer}
          setOpen={setOpenEditDrawer}
          title="Edit custom field"
          description={`Tell us about the field you want to create and how you'd like
                  to collect the data for it.`}
          handleSave={handleSaveEdit}
        />

        <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
          <DialogTrigger></DialogTrigger>
          <DialogContent
            style={{borderRadius: '24px'}}
            className="w-[577px] p-0 border-none overflow-clip gap-0"
          >
            <DialogHeader className="p-8 gap-2">
              <DialogTitle className="text-xl text-neutral-600 font-semibold">
                Are you sure you want to save changes to this field?
              </DialogTitle>
              <DialogDescription>
                <Text variant={'body4'} className="text-neutral-400">
                  Next, let’s take a look at the list of apps that you can use
                  to start improving your business in minutes.
                </Text>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 px-6 flex items-center justify-end gap-3 border-t border-neutral-25">
              <Button
                variant={'secondary'}
                onClick={() => setOpenConfirmDialog(false)}
              >
                Go back
              </Button>
              <Button onClick={confirmSaveEdit}>
                <CheckMarkIcon className="fill-white" />
                Proceed to save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={success} onOpenChange={setSuccess}>
          <DialogTrigger></DialogTrigger>
          <DialogContent
            style={{borderRadius: '24px'}}
            className="w-[504px] p-0 border-none overflow-clip gap-0"
            hideClosebtn={true}
          >
            <div className="w-full h-[260px] bg-[#45aeff4b] flex items-center justify-center">
              <img
                src="/images/Success.svg"
                alt=""
                width={130.77}
                height={130.77}
              />
            </div>

            <DialogHeader className="p-8 gap-2">
              <DialogTitle className="text-2xl text-neutral-600 font-semibold">
                Congratulations! You’re done.
              </DialogTitle>
              <DialogDescription>
                <Text variant={'body4'} className="text-neutral-400">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </Text>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 px-6 flex items-center justify-end gap-3 border-t border-neutral-25">
              <Button
                variant={'secondary'}
                onClick={() => navigate(ROUTES.people)}
              >
                Go home
              </Button>
              <Button onClick={() => navigate(ROUTES.dataManager)}>
                Go to object manager
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogTrigger></DialogTrigger>
          <DialogContent
            style={{borderRadius: '24px'}}
            className="w-[577px] p-0 border-none overflow-clip gap-0"
          >
            <DialogHeader className="p-8 gap-2">
              <DialogTitle className="text-xl text-neutral-600 font-semibold">
                Are you sure you want to delete this field?
              </DialogTitle>
              <DialogDescription>
                <Text variant={'body4'} className="text-neutral-400">
                  Next, let’s take a look at the list of apps that you can use
                  to start improving your business in minutes.
                </Text>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 px-6 flex items-center justify-end gap-3 border-t border-neutral-25">
              <Button
                variant={'secondary'}
                onClick={() => setOpenDeleteDialog(false)}
              >
                Go back
              </Button>
              <Button variant={'error'}>
                <CheckMarkIcon className="fill-white" />
                Proceed to delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Main>
    </DashboardLayout>
  );
}
