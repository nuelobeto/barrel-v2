import {ViewType} from '@/types';
import {Button} from '../ui/button';

type Props = {
  view: ViewType;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
};

export const ViewSwitch = ({view, setView}: Props) => {
  return (
    <div className="flex items-center border border-neutral-100 rounded-xl transition-all">
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-r-[0px] border-transparent"
        onClick={() => setView('list')}
      >
        <img src="/images/lists.svg" alt="list view" width={20} height={20} />
      </Button>
      <Button
        variant={view === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-l-[0px] border-transparent"
        onClick={() => setView('grid')}
      >
        <img src="/images/grid.svg" alt="grid view" width={20} height={20} />
      </Button>
    </div>
  );
};
