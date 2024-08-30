import {DateIcon, TextIcon} from './icons';
import {Text} from './typography';

type Props = {
  type: string;
};

export const DataTypeBadge = ({type}: Props) => {
  const getIcon = () => {
    if (type === 'text') {
      return <TextIcon />;
    }
    if (type === 'date') {
      return <DateIcon />;
    }
  };

  return (
    <div className="w-fit h-6 rounded-md border border-[#C6E4FE] bg-[#F4FAFF] flex items-center gap-1 p-1 capitalize">
      {getIcon()}
      <Text variant={'body6'} className="text-[#0E8DFB] font-medium">
        {type}
      </Text>
    </div>
  );
};
