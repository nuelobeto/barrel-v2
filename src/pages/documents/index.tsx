import {useState} from 'react';
import {Link, NavLink, Outlet} from 'react-router-dom';
import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {Text} from '@/components/ui/typography';
import {DocumentFilledIcon} from '@/components/ui/icons';
import UploadTemplateTriggerAction from '@/components/modules/document/upload-template';
import {ROUTES} from '@/router/routes';

const navlinks = [
  {
    url: ROUTES.companyDocuments,
    text: 'Company Documents',
  },
  {
    url: ROUTES.documentTemplates,
    text: 'Templates',
  },
];

export const Documents = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <DashboardLayout>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.documentTemplates}>
            <Button variant="secondary">
              <DocumentFilledIcon className="fill-neutral-600" />
              Explore templates
            </Button>
          </Link>
          <UploadTemplateTriggerAction>
            <Button>
              <DocumentFilledIcon className="fill-white" />
              Upload document
            </Button>
          </UploadTemplateTriggerAction>
        </div>
      </Header>

      <Main>
        <div
          className={`py-22 pl-6 xl:pl-[110px] bg-yellow-25 flex flex-col relative
            ${showBanner ? 'block' : 'hidden'}`}
        >
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
            Unlock Seamless Efficiency
          </Text>
          <Text className="text-periwinkle-800 mt-2 max-w-[523px]">
            Streamline Your Workflow by effortlessly managing, organising, and
            accessing your documents"
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
          <img
            src="/images/documents-main-art.svg"
            alt="main art"
            className="absolute -bottom-3 right-10 xl:right-[100px] lg:w-[322px] lg:h-[176px] 2xl:w-auto 2xl:h-auto hidden lg:block"
            width={544}
            height={296.9}
          />
        </div>

        <section className="mx-6 mt-10">
          <div className="flex items-center gap-6 border-b border-neutral-50">
            {navlinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.url}
                className={({isActive}) =>
                  `h-[36px] mb-[-1px] font-medium text-[14px] leading-[20px] ${
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
        </section>

        <div className="mx-6 pb-20">
          <Outlet />
        </div>
      </Main>
    </DashboardLayout>
  );
};
