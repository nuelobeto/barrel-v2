import toast from 'react-hot-toast';
import {CopyIcon} from '@/components/ui/icons';
import {cn} from '@/lib/utils';

type Props = {
  title: string;
  details: Detail[];
  edit: React.ReactNode;
};

export type Detail = {
  label: string;
  value: string | null;
  canCopy?: boolean;
  capitalize?: boolean;
};

export const EmployeeDetailsCard = ({title, details, edit}: Props) => {
  const value = (detail: Detail) => {
    if (!detail.value) {
      return (
        <div className="flex items-center justify-center w-fit h-6 py-1 px-2.5 text-xs text-orange-500 border border-[#F9580033] bg-[#FEDECC80] rounded-3xl">
          Missing details
        </div>
      );
    }

    if (detail.value && detail.canCopy) {
      return (
        <div className="flex items-center gap-2">
          {detail.value}
          <button
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-50"
            onClick={() => {
              navigator.clipboard.writeText(detail.value ?? '');
              toast.success(`Copied ${detail.label}`);
            }}
          >
            <CopyIcon className="fill-purple-200" />
          </button>
        </div>
      );
    }

    return detail.value;
  };

  return (
    <div className="flex-1 px-6 pt-6 pb-3 border border-neutral-50 rounded-xl">
      <div className="flex items-center justify-between">
        <p className="font-medium text-neutral-600">{title}</p>

        {edit}
      </div>

      <table className="mt-3 w-full">
        <tbody>
          {details.map((detail, index) => (
            <tr
              key={index}
              className={cn(
                'h-12 border-neutral-50',
                details.length - 1 === index
                  ? 'border-transparent'
                  : 'border-b',
              )}
            >
              <td className="w-[250px] text-xs font-medium text-neutral-600">
                {detail.label}
              </td>
              <td
                className={`text-xs text-neutral-400 ${
                  detail.capitalize ? 'capitalize' : ''
                }`}
              >
                {value(detail)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
