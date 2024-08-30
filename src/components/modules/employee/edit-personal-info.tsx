import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {useParams} from 'react-router-dom';
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
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {IEmployee} from '@/types/members';
import memberServices from '@/services/memberServices';
import {ErrorResponse} from '@/types/error';
import {COUNTRIES} from '@/helpers/countries';
import {ScrollArea} from '@/components/ui/scroll-area';

const countryNames = Object.entries(COUNTRIES);

const placeholderDate = new Date('1900-01-01T00:00:00Z');

const formSchema = z.object({
  first_name: z.string().min(1, {message: 'First name is required'}),
  last_name: z.string().min(1, {message: 'Last name is required'}),
  middle_name: z.string().min(1, {message: 'Middle name is required'}),
  dob: z
    .date({
      required_error: 'Please select a date of birth',
      invalid_type_error: "That's not a valid date!",
    })
    .refine(
      date => {
        return date.getTime() !== placeholderDate.getTime();
      },
      {
        message: 'Please update your date of birth',
      },
    ),
  gender: z.string().min(1, {message: 'Please select a gender'}),
  marital_status: z.string().min(1, {message: 'Marital status is required'}),
  nationality: z.string().min(1, {message: 'Nationality is required'}),
  country: z.string().min(1, {message: 'Country is required'}),
});

export const EditPersonalInfo = ({
  employeePersonalDetails,
}: {
  employeePersonalDetails: IEmployee['personal_info'];
}) => {
  const [open, setOpen] = useState(false);
  const {employeeId} = useParams();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      first_name: employeePersonalDetails?.first_name ?? '',
      last_name: employeePersonalDetails?.last_name ?? '',
      middle_name: employeePersonalDetails?.middle_name ?? '',
      gender: employeePersonalDetails?.gender ?? '',
      marital_status: employeePersonalDetails?.marital_status ?? '',
      nationality: employeePersonalDetails?.nationality ?? '',
      country: employeePersonalDetails?.country ?? '',
      dob: employeePersonalDetails?.dob
        ? new Date(employeePersonalDetails.dob)
        : placeholderDate,
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: memberServices.updateEmployeePersonal,
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
          'Failed to update employee personal information',
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      employee_id: employeePersonalDetails?.employee_id,
      member_id: employeeId as string,
      dob: values.dob ? format(values.dob, 'yyyy-MM-dd') : undefined,
    };

    mutate(data);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={!employeePersonalDetails}
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
                Edit Personal Information
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
                      name="first_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({field}) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'input'} className="px-2.5">
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                  {field.value && format(field.value, 'PPP')}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 pointer-events-auto"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={date =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
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
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marital_status"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
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
                              {countryNames.map(([id, val]) => (
                                <SelectItem key={id} value={id}>
                                  {val}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
