import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {Text} from '@/components/ui/typography';
import {ROUTES} from '@/router/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {
  DownArrowIcon,
  EditIcon,
  HandIcon,
  LockIcon,
  Trash,
} from '@/components/ui/icons';
import {Badge} from '@/components/ui/badge';
import {useParams} from 'react-router-dom';

export const DeviceDetails = () => {
  const {employeeId = ''} = useParams();

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
              <BreadcrumbLink
                href={ROUTES.employeeDevices.replace(':employeeId', employeeId)}
              >
                Employee details
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Device</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <Main>
        <div className="w-full pt-[40px] px-[24px] pb-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#F2F2F2] overflow-clip">
                <img
                  src="/images/device.png"
                  alt=""
                  width={68.5}
                  height={52.5}
                />
              </div>
              <div className="flex flex-col">
                <Text
                  element="h2"
                  className="font-bold text-xl leading-8 text-periwinkle-900"
                >
                  MacBook Pro M2 13inch - 34511
                </Text>
                <Text className="text-sm leading-5 text-neutral-400">
                  Laptop & Computer Device
                </Text>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'secondary'}>
                  Actions
                  <DownArrowIcon className="fill-neutral-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[213px] py-3">
                <div className="flex flex-col">
                  <Text variant={'body5'} className="text-neutral-300 px-1.5">
                    Security
                  </Text>
                  <div className="flex flex-col">
                    <DropdownMenuItem>
                      <LockIcon />
                      Lock Device
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HandIcon /> Wipe Device
                    </DropdownMenuItem>
                  </div>
                </div>
                <div className="flex flex-col mt-2">
                  <Text variant={'body5'} className="text-neutral-300 px-1.5">
                    Device
                  </Text>
                  <div className="flex flex-col">
                    <DropdownMenuItem>
                      <EditIcon />
                      Change owner
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400">
                      <Trash className="fill-red-400" />
                      Remove Device
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-[32px] mt-[48px]">
            <div className="p-[24px] flex flex-col gap-3 border border-neutral-50 rounded-xl">
              <div className="h-[40px] flex items-center">
                <Text
                  variant={'body4'}
                  className="text-neutral-600 font-medium"
                >
                  Device Details
                </Text>
              </div>
              <div className="grid grid-cols-4 gap-[32px]">
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Name
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    MacBook Pro M2 13in - 16gb...
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Category
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Laptop & Computer
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Purchase Date
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Jan 13, 2022
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Status
                  </Text>
                  <Badge variant="allocated" className="w-fit">
                    Allocated
                  </Badge>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Assigned To
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Emmanuel Obeto
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Manufacturer
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Apple Inc.
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Location
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Lagos, Nigeria
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Asset Number
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    34511
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Condition
                  </Text>
                  <Badge variant={'perfect'} className="w-fit">
                    Perfect
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-[24px] flex flex-col gap-3 border border-neutral-50 rounded-xl">
              <div className="h-[40px] flex items-center">
                <Text
                  variant={'body4'}
                  className="text-neutral-600 font-medium"
                >
                  Manufacturer Support Lifecycle
                </Text>
              </div>
              <div className="grid grid-cols-4 gap-[32px]">
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Manufacture Date
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    January 01, 2018
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Purchase Date
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    June 01, 2018
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Expiry Date
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    Dec 01, 2023
                  </Text>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Till Expire
                  </Text>
                  <Text variant={'body5'} className="text-periwinkle-800">
                    8 Months 03 days
                  </Text>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <Text
                    variant={'body4'}
                    className="text-neutral-600 font-medium"
                  >
                    Status
                  </Text>
                  <Badge variant={'compliant'} className="w-fit">
                    Compliant
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-[24px] flex flex-col gap-3 border border-neutral-50 rounded-xl">
              <div className="h-[40px] flex items-center">
                <Text
                  variant={'body4'}
                  className="text-neutral-600 font-medium"
                >
                  Security & OS Details
                </Text>
              </div>
              <div className="grid grid-cols-4 gap-[32px]">
                <div className="p-4 rounded-xl border border-periwinkle-100 bg-periwinkle-25 flex flex-col gap-6">
                  <div className="flex items-center gap-[13px]">
                    <div className="w-[40px] h-[40px] flex items-center justify-center rounded-lg border border-periwinkle-50 bg-white">
                      <img
                        src="/images/device-antivirus.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <Text variant={'body6'} className="text-periwinkle-800">
                      Anti virus
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Text
                      variant={'body5'}
                      className="text-neutral-600 font-medium"
                    >
                      kaspersky internet security
                    </Text>
                    <Badge variant={'installed'}>Installed</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-periwinkle-100 bg-periwinkle-25 flex flex-col gap-6">
                  <div className="flex items-center gap-[13px]">
                    <div className="w-[40px] h-[40px] flex items-center justify-center rounded-lg border border-periwinkle-50 bg-white">
                      <img
                        src="/images/device-mdm.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <Text variant={'body6'} className="text-periwinkle-800">
                      MDM
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Text
                      variant={'body5'}
                      className="text-neutral-600 font-medium"
                    >
                      AppTec360
                    </Text>
                    <Badge variant={'integrated'}>Integrated</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-periwinkle-100 bg-periwinkle-25 flex flex-col gap-6">
                  <div className="flex items-center gap-[13px]">
                    <div className="w-[40px] h-[40px] flex items-center justify-center rounded-lg border border-periwinkle-50 bg-white">
                      <img
                        src="/images/device-saml.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <Text variant={'body6'} className="text-periwinkle-800">
                      SAML
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Text
                      variant={'body5'}
                      className="text-neutral-600 font-medium"
                    >
                      AppTec360
                    </Text>
                    <Badge variant={'installed'}>Installed</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-periwinkle-100 bg-periwinkle-25 flex flex-col gap-6">
                  <div className="flex items-center gap-[13px]">
                    <div className="w-[40px] h-[40px] flex items-center justify-center rounded-lg border border-periwinkle-50 bg-white">
                      <img
                        src="/images/device-os.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <Text variant={'body6'} className="text-periwinkle-800">
                      OS Version
                    </Text>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Text
                      variant={'body5'}
                      className="text-neutral-600 font-medium"
                    >
                      2r73wt78760r
                    </Text>
                    <Badge variant={'updated to latest version'}>
                      Updated to latest version
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </DashboardLayout>
  );
};
