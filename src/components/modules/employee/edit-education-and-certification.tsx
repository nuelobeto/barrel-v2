import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {useParams} from 'react-router-dom';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
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
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar} from '@/components/ui/calendar';
import {ScrollArea} from '@/components/ui/scroll-area';

const placeholderDate = new Date('1900-01-01T00:00:00Z');

const formSchema = z.object({
  highest_degree_obtained: z.string().min(1, {message: 'Degree is required'}),
  field_of_study: z.string().min(1, {message: 'Field of study is required'}),
  institution_name: z
    .string()
    .min(1, {message: 'Institution name is required'}),
  graduation_year: z
    .date({
      required_error: 'Please enter a valid date',
      invalid_type_error: "That's not a valid date!",
    })
    .refine(
      date => {
        return date.getTime() !== placeholderDate.getTime();
      },
      {
        message: 'Please select a valid date',
      },
    ),
  certification: z.string().min(1, {message: 'Certification is required'}),
});

export const EditEducationAndCertification = ({
  employeeEducationCert,
}: {
  employeeEducationCert: IEmployee['education_cert'];
}) => {
  const {employeeId} = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      highest_degree_obtained:
        employeeEducationCert?.highest_degree_obtained ?? '',
      field_of_study: employeeEducationCert?.field_of_study ?? '',
      institution_name: employeeEducationCert?.institution_name ?? '',
      graduation_year: employeeEducationCert?.graduation_year
        ? new Date(employeeEducationCert?.graduation_year)
        : placeholderDate,
      certification: employeeEducationCert?.certification ?? '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: memberServices.updateEmployeeEducationCert,
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
          'Failed to update employee work information',
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      member_id: employeeId as string,
      graduation_year: values.graduation_year
        ? format(values.graduation_year, 'yyyy-MM-dd')
        : undefined,
    };

    mutate(data);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={!employeeEducationCert}
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
                Edit Education and Certifications
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
                    {' '}
                    <FormField
                      control={form.control}
                      name="highest_degree_obtained"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Highest Degree Obtained</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="field_of_study"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="institution_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Institution Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="graduation_year"
                      render={({field}) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Graduation Year</FormLabel>
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
                      name="certification"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Certifications</FormLabel>
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
