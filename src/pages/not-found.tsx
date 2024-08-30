import {Link} from 'react-router-dom';
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

export const NotFound = () => {
  return (
    <DashboardLayout>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Page not found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <Main>
        <div className="flex items-center justify-center h-[calc(100vh-96px)]">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-neutral-900">404</h1>
            <p className="mt-3 text-lg text-neutral-600">
              The page you are looking for does not exist.
            </p>
            <Link to="/" className="block mt-5 text-purple-600 underline">
              Go back to home
            </Link>
          </div>
        </div>
      </Main>
    </DashboardLayout>
  );
};
