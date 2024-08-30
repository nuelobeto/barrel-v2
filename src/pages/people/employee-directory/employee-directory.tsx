import {useState} from 'react';
import {useDebouncedValue} from '@wojtekmaj/react-hooks';
import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {Text} from '@/components/ui/typography';
import {PersonIcon} from '@/components/ui/icons';
import {EmployeeTable} from '@/components/modules/employee/employee-table';
import BulkUploadTriggerAction from '@/components/modules/employee/bulk-upload-dialog';
import NewMemberTriggerAction from '@/components/modules/employee/new-member-dialog';
import {
  useFetchBusiness,
  useFetchJobTitles,
  useFetchMembers,
} from '@/hooks/useQueries';
import {ROUTES} from '@/router/routes';
import {JobTitlesDepartmentsApiResponse} from '@/types/business';
import {MembersApiResponse} from '@/types/members';

interface FilterState {
  job_title: string;
  manager: string;
  status: string;
}

export default function EmployeeDirectory() {
  const [showBanner, setShowBanner] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    job_title: '',
    manager: '',
    status: '',
  });

  const debouncedSearch = useDebouncedValue(search, 500);

  const {data: business} = useFetchBusiness();
  const {data: members} = useFetchMembers({
    businessId: business?.data?.id as string,
    limit,
    page,
    search: debouncedSearch,
    filters,
  });

  const {data: jobTitlesRes, status: jobTitlesStatus} = useFetchJobTitles();
  const hasFiltersApplied = Object.values(filters).some(Boolean) || search;

  const isEmptyState =
    members?.data?.result?.length === 0 &&
    jobTitlesStatus === 'success' &&
    !hasFiltersApplied;

  return (
    <DashboardLayout>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.employeeDirectory}>
                People
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Employee directory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {members?.data?.result?.length && jobTitlesStatus === 'success' ? (
          <NewMemberTriggerAction members={members} jobTitlesRes={jobTitlesRes}>
            <Button>
              <PersonIcon className="fill-white" />
              Add Employee
            </Button>
          </NewMemberTriggerAction>
        ) : (
          <Button>
            <PersonIcon className="fill-white" />
            Add Employee
          </Button>
        )}
      </Header>

      <Main>
        {showBanner && (
          <div className="py-22 pl-6 xl:pl-[110px] bg-lilac-10 flex flex-col relative">
            <Button
              variant="ghost"
              className="absolute top-4 right-6 p-0"
              onClick={() => setShowBanner(false)}
            >
              <img src="/images/close.svg" alt="close" width={26} height={26} />
            </Button>
            <Text
              element="h2"
              variant="heading9"
              className="text-periwinkle-900 font-bold"
            >
              Your people are the heart of your business
            </Text>
            <Text className="text-periwinkle-800 mt-2 max-w-[523px]">
              You can add your staff individually or upload your team’s data in
              by downloading a template and uploading it using our “Bulk upload
              features.
            </Text>

            {/* hack to activate the buttons only when there are members to prevent the page from breaking */}
            {members && jobTitlesRes ? (
              <div className="mt-6 flex items-center gap-4">
                <NewMemberTriggerAction
                  members={members}
                  jobTitlesRes={jobTitlesRes}
                >
                  <Button>
                    <PersonIcon className="fill-white" />
                    Add Employee
                  </Button>
                </NewMemberTriggerAction>
                <BulkUploadTriggerAction>
                  <Button variant="ghost" className="text-purple-400 p-0">
                    Use bulk upload
                  </Button>
                </BulkUploadTriggerAction>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-4">
                <Button>
                  <PersonIcon className="fill-white" />
                  Add Employee
                </Button>
                <Button variant="ghost" className="text-purple-400 p-0">
                  Use bulk upload
                </Button>
              </div>
            )}

            <img
              src="/images/main-art.svg"
              alt="main art"
              className="absolute -bottom-6 right-20 w-[342px] h-[119px] xl:w-[481px] xl:h-[167px] 2xl:w-auto 2xl:h-auto hidden lg:block"
              width={577.4}
              height={200}
            />
          </div>
        )}

        <section className="mt-10 px-6">
          {isEmptyState ? (
            <div className="mt-35 flex flex-col items-center justify-center">
              <Text
                element="h2"
                variant="heading9"
                className="font-semibold text-neutral-600"
              >
                No data added yet.
              </Text>
              <Text className="text-periwinkle-800 mt-2 max-w-[523px]">
                Entrust your heart (people) with us, we promise we won’t break
                it.
              </Text>
              <div className="mt-6 flex items-center gap-4">
                <NewMemberTriggerAction
                  members={members}
                  jobTitlesRes={jobTitlesRes}
                >
                  <Button>
                    <PersonIcon className="fill-white" />
                    Add new member
                  </Button>
                </NewMemberTriggerAction>
                <BulkUploadTriggerAction>
                  <Button variant="ghost" className="text-purple-400 p-0">
                    Use bulk upload
                  </Button>
                </BulkUploadTriggerAction>
              </div>
            </div>
          ) : (
            <EmployeeTable
              jobTitlesRes={jobTitlesRes as JobTitlesDepartmentsApiResponse}
              members={members as MembersApiResponse}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              search={search}
              setSearch={setSearch}
              filters={filters}
              setFilters={setFilters}
              hasFiltersApplied={hasFiltersApplied}
            />
          )}
        </section>
      </Main>
    </DashboardLayout>
  );
}
