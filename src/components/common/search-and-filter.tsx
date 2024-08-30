import {FilterType} from '@/types';
import {SearchIcon} from '../ui/icons';
import {InputWrapper, Input, InputIconRight} from '../ui/input';
import {Text} from '../ui/typography';
import Filter from './Filter';

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filters: FilterType[];
};

export const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  filters,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      <InputWrapper className="w-[340px]">
        <Input
          placeholder="Search Documents"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-periwinkle-500 placeholder:text-periwinkle-500"
        />
        <InputIconRight>
          <SearchIcon className="fill-periwinkle-600" />
        </InputIconRight>
      </InputWrapper>

      <div className="flex items-center gap-3 xl:border-l border-y-neutral-50 xl:pl-3">
        <Text className="text-periwinkle-700 font-medium">Filters:</Text>
        <div className="flex items-center gap-2">
          {filters.map((filter, index) => (
            <Filter
              key={index}
              label={filter.label}
              filterOptions={filter.filterOptions}
              criteria={filter.critria}
              setCriteria={filter.setCriteria}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
