import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  CheckboxEmptyIcon,
  CheckboxFilledIcon,
  CloseCircleIcon,
  DownArrowIcon,
} from '../ui/icons';
import {FilterOption} from '@/types';

interface FilterProps {
  label: string;
  filterOptions: FilterOption[];
  criteria: FilterOption[];
  setCriteria: (selectedOptions: FilterOption[]) => void;
}

const Filter = ({label, filterOptions, criteria, setCriteria}: FilterProps) => {
  const handleSelect = (criterion: FilterOption) => {
    if (criteria.some(c => c.id === criterion.id)) {
      setCriteria(criteria.filter(c => c.id !== criterion.id));
      return;
    }
    setCriteria([...criteria, criterion]);
  };

  const removeCriterion = (criterion: FilterOption) => {
    setCriteria(criteria.filter(c => c.id !== criterion.id));
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1 h-8 rounded-xl border border-dashed border-neutral-200 py-1 px-3">
        <span className="text-xs text-periwinkle-700">
          {label}
          {criteria.length > 0 && ':'}
        </span>
        {criteria.length === 0 && <DownArrowIcon />}
        {criteria.length > 0 && (
          <div className="flex items-center gap-1 capitalize">
            <span className="text-xs text-purple-400">{criteria[0].name}</span>
            <span
              onClick={e => {
                e.stopPropagation();
                removeCriterion(criteria[0]);
              }}
            >
              <CloseCircleIcon className="fill-purple-500" />
            </span>
          </div>
        )}
        {criteria.length > 1 && (
          <span className="text-xs text-neutral-300">
            +{criteria.length - 1} more
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-fit min-w-[180px] rounded-xl border border-neutral-50 py-1 px-1.5 flex flex-col"
      >
        {filterOptions.map(option => (
          <button
            key={option.id}
            className="flex items-center justify-start text-neutral-600 gap-1 w-full h-8 my-0.5 rounded-10px p-[8.6px] text-sm outline-none focus:bg-gray-100 focus:text-neutral-600 hover:bg-gray-100 cursor-default capitalize"
            onClick={() => handleSelect(option)}
          >
            {criteria.some(c => c.id === option.id) ? (
              <CheckboxFilledIcon className="fill-purple-400" />
            ) : (
              <CheckboxEmptyIcon />
            )}
            {option.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
