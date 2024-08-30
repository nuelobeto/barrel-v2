import * as React from 'react';
import {cn} from '@/lib/utils';
import {
  CheckMarkIcon,
  CheckboxEmptyIcon,
  CheckboxFilledIcon,
  DownArrowIcon,
} from './icons';
import {FieldError} from 'react-hook-form';
import {Avatar, AvatarFallback, AvatarImage} from './avatar';

const MultiSelect = ({
  children,
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
};

const MultiSelectTrigger = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center gap-2 justify-between rounded-xl border border-neutral-100 bg-white text-sm px-2.5 ring-offset-white placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-25 focus:border-purple-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <DownArrowIcon />
    </button>
  );
};

interface MultiSelectValuesProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  placeholder: string;
  selectedValues: string[];
  error?: FieldError | undefined;
}

const MultiSelectValues = ({
  className,
  placeholder,
  selectedValues,
  error,
  ...props
}: MultiSelectValuesProps) => {
  return (
    <div
      className={cn(
        'flex-1 flex items-center overflow-hidden',
        className,
        error &&
          'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-25',
      )}
      {...props}
    >
      {selectedValues.length > 0 ? (
        <div className="w-full flex items-center gap-[5px] overflow-hidden">
          {selectedValues.slice(0, 3).map((option, index) => (
            <span
              key={index}
              className={cn(
                'flex items-center justify-center h-[20px] w-fit border rounded-[6px] font-[400] text-[12px] leading-[16px] tracking-[-0.5%] px-[8px] py-[2px]',
                index === 0 && 'border-purple-100 bg-purple-25 text-purple-400',
                index === 1 && 'border-orange-100 bg-orange-25 text-orange-400',
                index === 2 && 'border-yellow-100 bg-yellow-25 text-yellow-500',
              )}
            >
              {option.split(' ')[0]}
            </span>
          ))}
          {selectedValues.length > 3 && (
            <span className="font-[400] text-[12px] text-neutral-300">
              +{selectedValues.length - 3} more
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm leading-5 text-neutral-300">
          {placeholder}
        </span>
      )}
    </div>
  );
};

interface MultiSelectContentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MultiSelectContent = ({
  children,
  className,
  setOpen,
  ...props
}: MultiSelectContentProps) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownRef.current.parentElement?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, setOpen]);

  return (
    <div
      className={cn('w-full absolute z-50 top-full pt-1.5', className)}
      {...props}
      ref={dropdownRef}
    >
      <div className="w-full max-h-96 overflow-auto rounded-xl border border-nuetral-50 bg-white text-neutral-600 shadow-md py-1 px-1.5 flex flex-col">
        {children}
      </div>
    </div>
  );
};

interface MultiSelectItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelectItem = ({
  children,
  className,
  value,
  selectedValues,
  setSelectedValues,
  ...props
}: MultiSelectItemProps) => {
  const handleSelect = () => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
      return;
    }
    setSelectedValues([...selectedValues, value]);
  };

  return (
    <button
      className={cn(
        'flex gap-1 w-full h-8 my-0.5 items-center rounded-[10px] p-[8.6px] text-sm outline-none focus:bg-gray-100 focus:text-neutral-600 hover:bg-gray-100 cursor-default',
        className,
        selectedValues.includes(value) && 'bg-gray-100',
      )}
      {...props}
      onClick={handleSelect}
    >
      {selectedValues.includes(value) ? (
        <CheckboxFilledIcon className="fill-neutral-600" />
      ) : (
        <CheckboxEmptyIcon />
      )}
      {children}
      {selectedValues.includes(value) && (
        <span className="absolute right-2.5">
          <CheckMarkIcon />
        </span>
      )}
    </button>
  );
};

const MultiSelectItemAvatar = ({
  image,
  fallback,
}: {
  image: string | undefined;
  fallback: string;
}) => {
  return (
    <Avatar className="w-5 h-5">
      <AvatarImage src={image} alt="" />
      <AvatarFallback className="text-[9px] bg-neutral-100">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};

export {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectValues,
  MultiSelectItem,
  MultiSelectItemAvatar,
};
