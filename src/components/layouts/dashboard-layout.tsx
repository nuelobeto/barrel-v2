import {Sidebar} from './sidebar';

export const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="grow h-screen">{children}</div>
    </div>
  );
};

export const Header = ({children}: {children: React.ReactNode}) => {
  return (
    <header className="w-full h-18 bg-white border-b border-neutral-50 px-6 flex items-center justify-between">
      {children}
    </header>
  );
};

export const Main = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="w-full h-[calc(100%-72px)] overflow-auto">{children}</main>
  );
};
