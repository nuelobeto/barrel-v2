import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {IEmployee} from '@/types/members';
import memberServices from '@/services/memberServices';
import {ErrorResponse} from '@/types/error';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  salary_grade: z.string().min(1, {message: 'Salary grade is required'}),
  base_salary: z.string().min(1, {message: 'Base salary is required'}),
  net_salary: z.string().min(1, {message: 'Net salary is required'}),
  bonus: z.string().min(1, {message: 'Bonus is required'}),
  commission: z.string().min(1, {message: 'Commission is required'}),
  pay_frequency: z.string().min(1, {message: 'Pay frequency is required'}),
  bank_name: z.string().min(1, {message: 'Bank name is required'}),
  account_number: z.string().min(1, {message: 'Account number is required'}),
  bank_account_name: z
    .string()
    .min(1, {message: 'Bank account name is required'}),
  tax_amount: z.string(),
  swift_code: z.string().min(1, {message: 'Swift code is required'}),
  sort_code: z.string().min(1, {message: 'Sort code is required'}),
});

export const EditCompensationInfo = ({
  employeeCompensationDetails,
}: {
  employeeCompensationDetails: IEmployee['compensations'];
}) => {
  const [open, setOpen] = useState(false);
  const {employeeId} = useParams();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      salary_grade: employeeCompensationDetails?.salary_grade ?? '',
      base_salary: employeeCompensationDetails?.base_salary ?? '',
      net_salary: employeeCompensationDetails?.net_salary ?? '',
      bonus: employeeCompensationDetails?.bonus ?? '',
      commission: employeeCompensationDetails?.commission ?? '',
      pay_frequency: employeeCompensationDetails?.pay_frequency ?? '',
      bank_name: employeeCompensationDetails?.bank_name ?? '',
      account_number: employeeCompensationDetails?.account_number ?? '',
      bank_account_name: employeeCompensationDetails?.bank_account_name ?? '',
      tax_amount: employeeCompensationDetails?.tax_amount ?? '',
      swift_code: employeeCompensationDetails?.swift_code ?? '',
      sort_code: employeeCompensationDetails?.sort_code ?? '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: memberServices.updateEmployeeCompensations,
    onSuccess: () => {
      toast.success('Updated successfully');
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['employee', employeeId],
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data.message ||
          'Failed to update employee compensation information',
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      member_id: employeeId as string,
    };

    mutate(data);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={!employeeCompensationDetails}
        className="flex items-center gap-2 px-3 py-2.5"
      >
        <EditIcon className="fill-neutral-600" />
        <span className="font-medium text-sm text-neutral-600">Edit</span>
      </SheetTrigger>
      <SheetContent className="w-[672px] p-6 bg-transparent border-none shadow-none">
        <div className="w-full h-full bg-white rounded-xl">
          <SheetHeader>
            <div className="flex items-center h-16 px-6 border-b border-neutral-25">
              <SheetTitle className="flex-row items-start justify-center font-semibold text-xl text-neutral-600">
                Edit Compensation Information
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="px-6 flex flex-col h-[calc(100%-64px)]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col h-full"
              >
                <ScrollArea>
                  <div className="py-8 flex flex-col gap-5">
                    <FormField
                      control={form.control}
                      name="salary_grade"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Salary Grade</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="base_salary"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Base Salary</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="net_salary"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Net Salary</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bonus"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Bonus</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commission"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Commission</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pay_frequency"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Pay Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Biweekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="account_number"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_account_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tax_amount"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Tax Amount</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="swift_code"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Swift code</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sort_code"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Sort code</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>

                <div className="mt-auto border-t border-neutral-25 flex items-center justify-end gap-4 py-4 px-6 -mx-6">
                  <SheetClose asChild>
                    <Button variant="secondary" type="button">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={status === 'pending'}>
                    <CheckMarkIcon className="fill-white" />
                    Update information
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
