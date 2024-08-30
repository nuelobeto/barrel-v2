import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {CheckMarkIcon, PersonIcon} from '@/components/ui/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SendTestSample = ({open, setOpen}: Props) => {
  const formSchema = z.object({
    emails: z.string().min(2, {
      message: 'This field is required',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild hidden></SheetTrigger>
      <SheetContent className="w-[672px] p-[24px] bg-transparent border-none shadow-none">
        <div className="w-full h-full bg-white rounded-xl">
          <SheetHeader>
            <div className="flex flex-col justify-center h-[88px] px-[24px] border-b border-neutral-25">
              <SheetTitle className="flex-row items-start justify-center font-[600] text-[20px] leading-[32px] text-neutral-600">
                Send Test sample
              </SheetTitle>
              <SheetDescription className="text-neutral-400">
                You can send this document as a test sample to your self or
                multiple people
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="h-[calc(100%-72px-88px)] py-[32px] px-[24px] overflow-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-[19px]"
              >
                <FormField
                  control={form.control}
                  name="emails"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <PersonIcon />
                              <SelectValue placeholder="Pick recipient(s)" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription>
                        You can send to yourself by just clicking “send to self”
                        on the drop down
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="h-[72px] border-t border-neutral-25 flex items-center justify-end gap-[17px] px-[24px]">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <CheckMarkIcon className="fill-white" />
              Update information
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
