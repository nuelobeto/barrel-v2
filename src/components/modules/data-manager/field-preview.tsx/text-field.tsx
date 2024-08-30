import {CalendarIcon} from '@/components/ui/icons';
import {Text} from '@/components/ui/typography';

type Props = {
  field_name: string;
};
export const TextFieldInForm = ({field_name}: Props) => {
  return (
    <div className="py-8 px-6 rounded-xl shadow-lg bg-white flex flex-col gap-2">
      <label className="font-medium text-sm text-neutral-600">
        {field_name}
      </label>
      <div className="h-10 rounded-xl border border-neutral-100 px-2.5 flex items-center gap-2">
        <CalendarIcon />
        <Text variant={'body5'} className="font-normal text-neutral-300">
          mm/dd/yyyy
        </Text>
      </div>
    </div>
  );
};

export const TextFieldInTable = () => {
  return (
    <div className="rounded-xl overflow-clip">
      <table className="w-full">
        <thead>
          <tr className="h-[48px]">
            <th className="px-4 text-xs font-medium text-neutral-600 bg-periwinkle-300 text-left">
              Employee
            </th>
            <th className="px-4 text-xs font-medium text-neutral-600 bg-periwinkle-300 text-left">
              Date added
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-50 h-[48px]">
            <td className="px-4 text-xs font-medium text-neutral-400 bg-white text-left">
              <div className="flex items-center gap-2">
                <img src="/images/avatar.svg" alt="" width={32} height={32} />
                <div className="flex flex-col">
                  <Text variant={'body6'}>Soji Agboola</Text>
                  <Text
                    variant={'body6'}
                    className="font-normal text-neutral-400"
                  >
                    Engineering
                  </Text>
                </div>
              </div>
            </td>
            <td className="px-4 text-xs font-medium text-neutral-400 bg-white text-left">
              <Text variant={'body6'} className="text-neutral-400">
                01/01/2024
              </Text>
            </td>
          </tr>
          <tr className="border-b border-neutral-50 h-[48px]">
            <td className="px-4 text-xs font-medium text-neutral-400 bg-white text-left">
              <div className="flex items-center gap-2">
                <img src="/images/avatar.svg" alt="" width={32} height={32} />
                <div className="flex flex-col">
                  <Text variant={'body6'}>Soji Agboola</Text>
                  <Text
                    variant={'body6'}
                    className="font-normal text-neutral-400"
                  >
                    Engineering
                  </Text>
                </div>
              </div>
            </td>
            <td className="px-4 text-xs font-medium text-neutral-400 bg-white text-left">
              <Text variant={'body6'} className="text-neutral-400">
                01/01/2024
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
