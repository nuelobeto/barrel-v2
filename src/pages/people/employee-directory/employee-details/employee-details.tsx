import {NavLink, Outlet, useLocation, useParams} from 'react-router-dom';
import {differenceInCalendarDays, isValid, parseISO} from 'date-fns';
import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {DataTreeIcon} from '@/components/ui/icons';
import {Text} from '@/components/ui/typography';
import {useFetchEmployee} from '@/hooks/useQueries';
import {ROUTES} from '@/router/routes';
import {OffboardTransitionEmployee} from '@/components/modules/employee/offboard-transition-employee';

interface NavLink {
  url: string;
  text: string;
  showOffboard?: boolean;
}

export default function EmployeeDetails() {
  const {employeeId = ''} = useParams();
  const location = useLocation();
  const {data: employeeData} = useFetchEmployee(employeeId);

  const employee = employeeData?.data;

  const navlinks: NavLink[] = [
    {
      url: ROUTES.employeePersonalDetails.replace(':employeeId', employeeId),
      text: 'Personal',
      showOffboard: true,
    },
    {
      url: ROUTES.employeeWorkDetails.replace(':employeeId', employeeId),
      text: 'Work',
      showOffboard: true,
    },
    {
      url: ROUTES.employeeCompensation.replace(':employeeId', employeeId),
      text: 'Compensation',
      showOffboard: true,
    },
    {
      url: ROUTES.employeeDocuments.replace(':employeeId', employeeId),
      text: 'Documents',
      showOffboard: false,
    },
    {
      url: ROUTES.employeeDevices.replace(':employeeId', employeeId),
      text: 'Devices',
      showOffboard: false,
    },
    {
      url: ROUTES.employeeApps.replace(':employeeId', employeeId),
      text: 'App',
      showOffboard: false,
    },
    {
      url: ROUTES.employeePayslip.replace(':employeeId', employeeId),
      text: 'Payslip',
      showOffboard: false,
    },
  ];

  const currentRoute = navlinks.find(link => link.url === location.pathname);
  const showOffboard = currentRoute?.showOffboard ?? false;

  const startDate = employee?.employment_details?.date_of_hire;
  const startDateValue =
    startDate && isValid(parseISO(startDate)) ? startDate : '';
  const today = new Date();
  const startDateObj = parseISO(startDateValue);
  const daysDifference = differenceInCalendarDays(startDateObj, today);

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
              <BreadcrumbLink href={ROUTES.employeeDirectory}>
                Employee directory
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Employee details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <div className="py-10 px-6">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-3">
              <Avatar className="w-[52px] h-[52px]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {employee?.personal_info?.first_name?.charAt(0) ?? '-'}
                  {employee?.personal_info?.last_name?.charAt(0) ?? '-'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Text variant="heading9" className="font-bold">
                  {employee?.personal_info?.first_name ?? '-'}{' '}
                  {employee?.personal_info?.last_name ?? '-'}
                </Text>
                <div className="flex gap-3 items-start lg:items-center flex-col lg:flex-row">
                  <p className="text-sm text-neutral-400">
                    {employee?.employment_details?.job_title ??
                      'Job title not set'}
                  </p>
                  <Badge className="capitalize" variant={employee?.status}>
                    {employee?.status}
                  </Badge>
                  {daysDifference > 0 ? (
                    <div className="h-6 text-xs font-medium text-neutral-500 rounded-full bg-neutral-25 flex items-center gap-1 hover:bg-neutral-25 p-1 pl-1.5">
                      <img
                        src="/images/badge-rocket.png"
                        alt=""
                        width={14}
                        height={14}
                      />
                      Starts
                      {` in ${daysDifference} ${
                        daysDifference === 1 ? 'day' : 'days'
                      }`}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <Button variant="secondary">
              <DataTreeIcon className="fill-neutral-600" /> View Org chart
            </Button>
          </div>

          <div className="sticky top-0 z-50 bg-white flex items-center gap-6 pt-8 border-b border-neutral-50">
            {navlinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.url}
                className={({isActive}) =>
                  `h-9 mb-[-1px] font-medium text-sm ${
                    isActive
                      ? 'text-neutral-600 border-b-2 border-purple-400'
                      : 'text-neutral-300'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>

          <div className={`mt-8 ${showOffboard ? ' w-full flex gap-8' : ''}`}>
            <Outlet
              context={{
                employee: employee,
              }}
            />
            {showOffboard && <OffboardTransitionEmployee />}
          </div>
        </div>
      </Main>
    </DashboardLayout>
  );
}
