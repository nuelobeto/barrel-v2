import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DocumentIcon,
  NotificationIcon,
  PeopleIcon,
  StarIcon,
} from '@/components/ui/icons';
import {Button} from '../ui/button';
import {FoldHorizontal, LogOutIcon, UnfoldHorizontal} from 'lucide-react';
import useSidebar from '@/store/useSidebar';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/router/routes';
import {NavLink, useNavigate} from 'react-router-dom';

export const Sidebar = () => {
  const {expanded, toggleSidebar} = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('business');
    navigate(ROUTES.login);
  };

  const links = [
    {
      text: 'People',
      url: ROUTES.employeeDirectory,
      icon: <PeopleIcon />,
    },
    {
      text: 'Documents',
      url: ROUTES.documents,
      icon: <DocumentIcon />,
    },
    {
      text: 'Data manager',
      url: ROUTES.dataManager,
      icon: <StarIcon />,
    },
  ];

  return (
    <aside
      className={`h-screen flex flex-col transition-[width] duration-300 bg-white border-r border-neutral-50 z-10 ${
        expanded ? 'min-w-[280px]' : 'w-16'
      }
    `}
    >
      <div className="h-18 flex items-center justify-between px-4">
        <div className="flex gap-2 items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              'flex flex-col transition-all duration-300',
              expanded
                ? 'opacity-1 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            )}
          >
            <h1 className="font-medium text-sm leading-5 text-neutral-600">
              Barrel
            </h1>
            <p className="font-medium text-xs leading-5 text-neutral-300">
              evan@usebarrel.io
            </p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'hover:bg-neutral-25 transition-all duration-300',
            expanded
              ? 'opacity-1 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
        >
          <NotificationIcon />
        </Button>
      </div>
      <div className="py-[20px] px-[16px] flex flex-col gap-[2px]">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.url}
            className={({isActive}) =>
              cn(
                'h-[36px] flex items-center gap-[6px]  rounded-[8px] text-sm text-neutral-600 font-medium',
                isActive && 'bg-neutral-25',
                expanded ? 'px-0' : 'px-[8px] justify-center',
              )
            }
          >
            <span className="flex items-center justify-center w-8 h-8">
              {link.icon}
            </span>

            {expanded && link.text}
          </NavLink>
        ))}
      </div>
      <div className="py-6 px-4 flex flex-col h-full grow gap-2">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            'mt-auto mr-auto p-0 text-neutral-500 h-8',
            expanded ? 'w-full justify-start px-2' : 'w-8',
          )}
        >
          <LogOutIcon width={16} height={16} />
          {expanded && 'Logout'}
        </Button>

        <Button
          variant="ghost"
          className="mt-4 p-0 hover:bg-neutral-25 w-8 h-8"
          onClick={toggleSidebar}
        >
          {!expanded ? (
            <UnfoldHorizontal
              width={20}
              height={20}
              className="stroke-neutral-400"
            />
          ) : (
            <FoldHorizontal
              width={20}
              height={20}
              className="stroke-neutral-400"
            />
          )}
        </Button>
      </div>
    </aside>
  );
};
