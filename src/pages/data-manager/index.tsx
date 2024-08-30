import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import BulkUploadTriggerAction from '@/components/modules/employee/bulk-upload-dialog';
import NewMemberTriggerAction from '@/components/modules/employee/new-member-dialog';
import {Button} from '@/components/ui/button';
import {DocumentFilledIcon, PersonIcon} from '@/components/ui/icons';
import {Text} from '@/components/ui/typography';
import {
  useFetchBusiness,
  useFetchJobTitles,
  useFetchMembers,
} from '@/hooks/useQueries';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/router/routes';
import {useState} from 'react';
import {NavLink, Outlet} from 'react-router-dom';

export default function DataManager() {
  const [showBanner, setShowBanner] = useState(true);
  const {data: business} = useFetchBusiness();
  const {data: members} = useFetchMembers({
    businessId: business?.data?.id as string,
  });
  const {data: jobTitlesRes} = useFetchJobTitles();

  return (
    <DashboardLayout>
      <Header>
        <Text variant={'heading10'} element="h1" className="font-bold">
          Data manager
        </Text>

        <Button>
          <DocumentFilledIcon className="fill-white" />
          Create object
        </Button>
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
              src="/images/data-manager-banner-img.png"
              alt="main art"
              className="hidden absolute -bottom-6 right-20 lg:block lg:w-[350px] xl:w-[380px]"
              width={441}
              height={271.591}
            />
          </div>
        )}

        <div className="py-10 px-6 w-full">
          <Tabs />

          <Outlet />
        </div>
      </Main>
    </DashboardLayout>
  );
}

const Tabs = () => {
  const tabs = [
    {
      label: 'Objects',
      url: ROUTES.dataManagerObjects,
    },
    {
      label: 'Permissions',
      url: ROUTES.dataManagerPermissions,
    },
  ];
  return (
    <div className="w-full h-9 border-b border-neutral-50 flex items-center gap-6">
      {tabs.map((tab, index) => (
        <NavLink
          key={index}
          to={tab.url}
          className={({isActive}) =>
            cn(
              'h-full text-sm font-medium border-b-2',
              isActive
                ? 'text-neutral-600 border-purple-400'
                : 'text-neutral-300 border-transparent',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};
