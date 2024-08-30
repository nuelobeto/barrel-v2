import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {CheckMarkIcon, EditIcon} from '@/components/ui/icons';
import {Input} from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

export const EditBenefitsInfo = () => {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    health_insurance_plan: z.string().optional(),
    dental_insurance_plan: z.string().optional(),
    vision_insurance_plan: z.string().optional(),
    retirement_plan: z.string().optional(),
    life_insurance: z.string().optional(),
    disability_insurance: z.string().optional(),
    paid_time_off_balance: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      health_insurance_plan: '',
      dental_insurance_plan: '',
      vision_insurance_plan: '',
      retirement_plan: '',
      life_insurance: '',
      disability_insurance: '',
      paid_time_off_balance: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="h-[40px] flex items-center gap-[8px]">
        <EditIcon className="fill-neutral-600" />
        <span className="font-[500] text-[14px] leading-[20px] text-neutral-600">
          Edit
        </span>
      </SheetTrigger>
      <SheetContent className="w-[672px] p-[24px] bg-transparent border-none shadow-none">
        <div className="w-full h-full bg-white rounded-xl">
          <SheetHeader>
            <div className="flex items-center h-[64px] px-[24px] border-b border-neutral-25">
              <SheetTitle className="flex-row items-start justify-center font-[600] text-[20px] leading-[32px] text-neutral-600">
                Edit Benefits Information
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="h-[calc(100%-72px-64px)] py-[32px] px-[24px] overflow-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-[19px]"
              >
                <FormField
                  control={form.control}
                  name="health_insurance_plan"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Health Insurance Plan</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dental_insurance_plan"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Dental Insurance Plan</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vision_insurance_plan"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Vision Insurance Plan</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retirement_plan"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Retirement Plan</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="life_insurance"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Life Insurance</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disability_insurance"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Disability Insurance</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paid_time_off_balance"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Paid Time Off Balance</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
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
