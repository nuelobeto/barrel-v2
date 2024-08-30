import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {DownArrowIcon} from './icons';
import {countryCodes, CountryCodesType} from '@/helpers/calling-code';

type Props = {
  countryCode: CountryCodesType | null;
  setCountryCode: React.Dispatch<React.SetStateAction<CountryCodesType | null>>;
};

export const CountryCode = ({countryCode, setCountryCode}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[2px]">
        <span className="text-sm">
          {!countryCode ? 'NG' : countryCode.code}
        </span>
        <DownArrowIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {countryCodes.map((countryCode, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => setCountryCode(countryCode)}
          >
            {countryCode.country}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
