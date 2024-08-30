import {Button} from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-t border-neutral-50">
      <div className="flex items-center gap-0.5">
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant="secondary"
            className={`w-8 h-[26px] rounded-lg text-xs text-periwinkle-800 hover:bg-periwinkle-50 active:bg-periwinkle-100 border-transparent ${
              currentPage === index + 1 ? 'bg-periwinkle-50' : 'bg-white'
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      <Select
        onValueChange={value => {
          onPageSizeChange(Number(value));
          onPageChange(1);
        }}
        defaultValue={pageSize.toString()}
      >
        <SelectTrigger className="h-9 w-fit rounded-lg bg-periwinkle-25 hover:bg-periwinkle-50 text-xs font-semibold text-[#344054] active:bg-periwinkle-100 border-none">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="w-44">
          {[10, 25, 50, 100].map(size => (
            <SelectItem
              key={size}
              value={size.toString()}
              className="w-full h-8 py-1 px-2.5 text-xs text-neutral-600 hover:bg-neutral-50"
            >
              Showing {size} entries
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
