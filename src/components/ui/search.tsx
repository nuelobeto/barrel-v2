import {Input} from './input';

export default function Search({placeholder}: {placeholder?: string}) {
  return (
    <Input
      className="placeholder:text-periwinkle-500 w-[340px]"
      placeholder={placeholder ?? 'Search'}
      iconPosition="right"
      type="search"
    />
  );
}
