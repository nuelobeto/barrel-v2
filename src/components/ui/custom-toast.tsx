import toast, {ToastBar, ToastOptions} from 'react-hot-toast';
import {CloseIcon, InfoIcon} from '@/components/ui/icons';

const customToast = {
  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...options,
      icon: <InfoIcon className="fill-purple-400 max-w-5 w-full" />,
    } as ToastOptions),
  warning: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...options,
      icon: <InfoIcon className="fill-orange-300 max-w-5 w-full" />,
    } as ToastOptions),

  // custom success toast
  lgSuccess: (
    content: {title: string; description: string; actions?: React.ReactNode},
    options?: ToastOptions,
  ) =>
    toast.custom(
      t => (
        <ToastBar toast={t}>
          {() => (
            <div className="flex items-start w-full py-1">
              <InfoIcon className="fill-green-500 max-w-5 w-full" />
              <div className="ml-2">
                <p className="text-sm text-neutral-600 font-medium">
                  {content.title}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {content.description}
                </p>
                {content.actions && (
                  <div className="mt-3">{content.actions}</div>
                )}
              </div>
              <button className="ml-auto" onClick={() => toast.dismiss(t.id)}>
                <CloseIcon />
              </button>
            </div>
          )}
        </ToastBar>
      ),
      options,
    ),
};

export {customToast};
