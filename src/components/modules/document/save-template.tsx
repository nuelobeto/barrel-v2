import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CheckMarkIcon,
  DocumentFilledIcon,
  PersonIcon,
} from '@/components/ui/icons';
import {Input} from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';

type Props = {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SaveTemplate = ({setShowSuccess}: Props) => {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    document_name: z.string().min(2, {
      message: 'This field is required',
    }),
    company_signatory: z.string().min(2, {
      message: 'This field is required',
    }),
    signature: z.string().optional(),
    send_test_sample: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_name: '',
      company_signatory: '',
      signature: '',
      send_test_sample: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setShowSuccess(true);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="h-[40px] flex items-center gap-[8px]">
        <Button>
          <DocumentFilledIcon className="fill-white" />
          Continue
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[672px] p-[24px] bg-transparent border-none shadow-none">
        <div className="w-full h-full bg-white rounded-xl">
          <SheetHeader>
            <div className="flex flex-col justify-center h-[88px] px-[24px] border-b border-neutral-25">
              <SheetTitle className="flex-row items-start justify-center font-[600] text-[20px] leading-[32px] text-neutral-600">
                Save as Document
              </SheetTitle>
              <SheetDescription className="text-neutral-400">
                You can choose to edit the document name or add more
                reciepients.
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
                  name="document_name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter document name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_signatory"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Company Signatory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <PersonIcon />
                              <SelectValue placeholder="Pick a signatory" />
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="signature"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter signature"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="send_test_sample"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor="send_test_sample"
                            className="text-neutral-400 font-normal"
                          >
                            Send test sample to mail
                          </Label>
                        </div>
                      </FormControl>
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
