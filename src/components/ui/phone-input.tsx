import * as React from 'react';
import {CheckIcon} from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Input, InputProps} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {ScrollArea} from './scroll-area';
import {DownArrowIcon} from './icons';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value | '') => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({className, onChange, ...props}, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn('flex', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={value => onChange?.(value ?? '')}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, ...props}, ref) => (
    <Input
      className={cn(
        'border-l-0 rounded-e-xl rounded-s-none text-periwinkle-900 pl-2',
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = {label: string; value: RPNInput.Country};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className={cn(
            'flex gap-0.5 rounded-e-none rounded-s-xl border-neutral-100 pl-3.5 pr-0 py-2.5 border-r-0 focus-visible:ring-offset-2 bg-white text-sm text-neutral-600 placeholder:text-neutral-200 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:border-purple-400 focus-visible:ring-purple-25 hover:bg-neutral-25',
          )}
          disabled={disabled}
        >
          <span className="text-sm text-neutral-600 font-normal w-5">
            {value ?? '🌐'}
          </span>
          <DownArrowIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 absolute -left-7">
        <Command>
          <CommandList className="max-h-fit">
            <CommandInput
              className="text-xs h-8"
              placeholder="Search country..."
            />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {options
                  .filter(x => x.value)
                  .map(option => (
                    <CommandItem
                      className="gap-2 rounded-lg"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-xs">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-xs">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const flagUrlBase = 'https://flagcdn.com/16x12';

const FlagComponent = ({country, countryName}: RPNInput.FlagProps) => {
  const [imageError, setImageError] = React.useState(false);

  const flagUrl = `${flagUrlBase}/${country.toLowerCase()}.png`;

  React.useEffect(() => {
    const img = new Image();
    img.src = flagUrl;
    img.onerror = () => setImageError(true);
  }, [country, flagUrl]);

  return (
    <span className="flex overflow-hidden rounded-sm">
      {!imageError ? (
        <img
          src={flagUrl}
          alt={countryName}
          title={countryName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          width={16}
          height={12}
        />
      ) : (
        <span className="flex items-center justify-center w-4 h-3 text-xs">
          {country.toUpperCase()}
        </span>
      )}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export {PhoneInput};
