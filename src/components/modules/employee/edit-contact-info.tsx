import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {z} from 'zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {isValidPhoneNumber} from 'react-phone-number-input';
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
import {PhoneInput} from '@/components/ui/phone-input';
import {ScrollArea} from '@/components/ui/scroll-area';

const formSchema = z.object({
  email: z.string().email().min(1, {message: 'Email is required'}),
  phone_number: z
    .string()
    .refine(isValidPhoneNumber, {message: 'Invalid phone number'}),
  emergency_contact_name: z.string().min(1, {message: 'Name is required'}),
  emergency_contact_relationship: z
    .string()
    .min(1, {message: 'Relationship is required'}),
  emergency_contact_phone_number: z
    .string()
    .refine(isValidPhoneNumber, {message: 'Invalid phone number'}),
  current_address: z.string().min(1, {message: 'Current address is required'}),
  permanent_address: z
    .string()
    .min(1, {message: 'Permanent address is required'}),
});

export const EditContactInfo = ({
  employeeContactDetails,
}: {
  employeeContactDetails: IEmployee['contact_info'];
}) => {
  const {employeeId} = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: employeeContactDetails?.email ?? '',
      phone_number: employeeContactDetails?.phone_number ?? '',
      emergency_contact_name:
        employeeContactDetails?.emergency_contact_name ?? '',
      emergency_contact_relationship:
        employeeContactDetails?.emergency_contact_relationship ?? '',
      emergency_contact_phone_number:
        employeeContactDetails?.emergency_contact_phone_number ?? '',
      current_address: employeeContactDetails?.current_address ?? '',
      permanent_address: employeeContactDetails?.permanent_address ?? '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: memberServices.updateEmployeeContact,
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
          'Failed to update employee contact information',
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
        disabled={!employeeContactDetails}
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
                Edit Contact Information
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
                      name="email"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="phone_no_container w-full relative">
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                placeholder="Enter phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_relationship"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Relationship</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_phone_number"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="current_address"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Current Address</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanent_address"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Permanent Address</FormLabel>
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
