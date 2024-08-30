import {useParams} from 'react-router-dom';
import {differenceInCalendarDays, format, isValid, parseISO} from 'date-fns';
import {Button} from '@/components/ui/button';
import {PersonRemoveIcon, TransitionIcon} from '@/components/ui/icons';
import {useFetchEmployee} from '@/hooks/useQueries';
import {COUNTRIES} from '@/helpers/countries';

function StartDate({startDate}: {startDate: string}) {
  if (!startDate || !isValid(parseISO(startDate))) {
    return (
      <div className="flex flex-col gap-1">
        <p className="w-[250px] font-medium leading-6 text-neutral-600">
          Start date
        </p>
        <div className="flex items-center gap-1">
          <img src="/images/event_available.svg" alt="Start date icon" />
          <p className="text-sm leading-5 text-periwinkle-800">
            Date not available
          </p>
        </div>
      </div>
    );
  }

  const startDateValue =
    startDate && isValid(parseISO(startDate)) ? startDate : '';
  const today = new Date();
  const startDateObj = parseISO(startDateValue);
  const daysDifference = differenceInCalendarDays(startDateObj, today);
  const formattedStartDate = format(startDateObj, 'MMMM dd, yyyy');

  return (
    <div className="flex flex-col gap-1">
      <p className="w-[250px] font-medium leading-6 text-neutral-600">
        Start date
      </p>
      <div className="flex items-center gap-1">
        <img src="/images/event_available.svg" alt="" />
        <p className="text-sm leading-5 text-periwinkle-800">
          {formattedStartDate}
          {daysDifference > 0 &&
            ` - in ${daysDifference} ${daysDifference === 1 ? 'day' : 'days'}`}
        </p>
      </div>
    </div>
  );
}

export const OffboardTransitionEmployee = () => {
  const {employeeId = ''} = useParams();
  const {data: employeeData} = useFetchEmployee(employeeId);

  const employee = employeeData?.data;
  const countryCode = employee?.personal_info?.country?.toLowerCase() ?? '';
  const countryName = countryCode
    ? COUNTRIES[countryCode.toUpperCase() as keyof typeof COUNTRIES]
    : '-';
  const startDate = employee?.employment_details?.date_of_hire;

  return (
    <div className="w-fit min-[1200px]:w-[445px] h-fit border border-neutral-50 rounded-xl">
      <div className="p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <p className="w-[250px] text-base font-medium leading-6 text-neutral-600">
            Country
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm leading-5 text-periwinkle-800">
              {countryName ?? '-'}
            </p>
            {countryCode && (
              <img
                src={`https://flagcdn.com/16x12/${countryCode}.png`}
                srcSet={`https://flagcdn.com/32x24/${countryCode}.png 2x,
                https://flagcdn.com/48x36/${countryCode}.png 3x`}
                width="16"
                height="12"
                alt={countryName}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="w-[250px] text-base font-medium leading-6 text-neutral-600">
            Employment type
          </p>
          <p className="text-sm leading-5 text-periwinkle-800 capitalize">
            {employee?.employment_details?.employment_type ?? '-'}
          </p>
        </div>

        <StartDate startDate={startDate as string} />
      </div>
      <div className="h-18 border-t border-neutral-50 flex items-center justify-end gap-3 px-6">
        <Button variant="secondary">
          <PersonRemoveIcon className="fill-neutral-600" /> Off-board
        </Button>
        <Button variant="secondary">
          <TransitionIcon className="fill-neutral-600" /> Transition
        </Button>
      </div>
    </div>
  );
};
