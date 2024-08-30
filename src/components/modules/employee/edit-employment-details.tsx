import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {FieldValues, useForm} from 'react-hook-form';
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
import {IEmployee, Manager} from '@/types/members';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar} from '@/components/ui/calendar';
import memberServices from '@/services/memberServices';
import {ErrorResponse} from '@/types/error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {SelectComponent} from '../../ui/creatable-select';
import businessServices from '@/services/businessServices';
import {Option} from '@/types';
import {ScrollArea} from '@/components/ui/scroll-area';

interface EditEmploymentDetailsProps {
  employeeEmploymentDetails: IEmployee['employment_details'];
  jobTitlesData: Option[];
  departmentsData: Option[];
  managerOptions: Manager[];
}

const placeholderDate = new Date('1900-01-01T00:00:00Z');

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const formSchema = z.object({
  job_title: optionSchema.refine(data => data.value !== '', {
    message: 'Job title is required',
  }),
  department: optionSchema.refine(data => data.value !== '', {
    message: 'Department is required',
  }),
  employment_type: z.string().min(1, {message: 'Employment type is required'}),
  employee_status: z.string().min(1, {message: 'Employee status is required'}),
  date_of_hire: z
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
  date_of_termination: z
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
  manager: z.string().min(1, {message: 'Manager is required'}),
  work_location: z.string().min(1, {message: 'Work location is required'}),
});

export const EditEmploymentDetails = ({
  employeeEmploymentDetails,
  jobTitlesData,
  departmentsData,
  managerOptions,
}: EditEmploymentDetailsProps) => {
  const {employeeId} = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isJobTitleLoading, setIsJobTitleLoading] = useState(false);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState<Option[]>(jobTitlesData);
  const [departments, setDepartments] = useState<Option[]>(departmentsData);

  const initialJobTitle = jobTitles.find(
    jobTitle => jobTitle.label === employeeEmploymentDetails?.job_title,
  );
  const initialDepartment = departments.find(
    department => department.label === employeeEmploymentDetails?.department,
  );

  const [selectedJobTitle, setSelectedJobTitle] = useState<Option | null>(
    initialJobTitle || null,
  );
  const [selectedDepartment, setSelectedDepartment] = useState<Option | null>(
    initialDepartment || null,
  );

  const setLoadingState = (
    type: 'job_title' | 'department' | string,
    isLoading: boolean,
  ) => {
    if (type === 'job_title') {
      setIsJobTitleLoading(isLoading);
    } else if (type === 'department') {
      setIsDepartmentLoading(isLoading);
    }
  };

  const {mutate: createJobTitleDepartment, status: creatingJobTitleDepartment} =
    useMutation({
      mutationFn: businessServices.createJobTitleDepartments,
      onSuccess: (data, payload) => {
        Promise.all([
          queryClient.invalidateQueries({queryKey: ['jobTitles']}),
          queryClient.invalidateQueries({queryKey: ['departments']}),
        ]);

        const newOption = {value: data?.data?.id, label: data?.data?.name};
        if (payload.type === 'job_title') {
          setJobTitles(prev => [...prev, newOption]);
          setSelectedJobTitle(newOption);
        } else if (payload.type === 'department') {
          setDepartments(prev => [...prev, newOption]);
          setSelectedDepartment(newOption);
        }
        setLoadingState(payload.type, false);
      },
      onError: (error: ErrorResponse) => {
        toast.error(
          error.response?.data.message ||
            'Failed to create job title/department',
        );
      },
    });

  const handleCreateJobTitle = (inputValue: string) => {
    setLoadingState('job_title', true);

    createJobTitleDepartment({
      name: inputValue,
      type: 'job_title',
    });
  };

  const handleCreateDepartment = (inputValue: string) => {
    setLoadingState('department', true);

    createJobTitleDepartment({
      name: inputValue,
      type: 'department',
    });
  };

  const handleJobTitleChange = (
    selectedOption: Option | null,
    field: FieldValues,
  ) => {
    setSelectedJobTitle(selectedOption);
    field.onChange(selectedOption || {value: '', label: ''});
  };

  const handleDepartmentChange = (
    selectedOption: Option | null,
    field: FieldValues,
  ) => {
    setSelectedDepartment(selectedOption);
    field.onChange(selectedOption || {value: '', label: ''});
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      job_title: {
        value: employeeEmploymentDetails?.job_title ?? '',
        label: employeeEmploymentDetails?.job_title ?? '',
      },
      department: {
        value: employeeEmploymentDetails?.department ?? '',
        label: employeeEmploymentDetails?.department ?? '',
      },
      employment_type: employeeEmploymentDetails?.employment_type ?? '',
      employee_status: employeeEmploymentDetails?.employee_status ?? '',
      date_of_hire: employeeEmploymentDetails?.date_of_hire
        ? new Date(employeeEmploymentDetails?.date_of_hire)
        : placeholderDate,
      date_of_termination: employeeEmploymentDetails?.date_of_termination
        ? new Date(employeeEmploymentDetails?.date_of_termination)
        : placeholderDate,
      manager: employeeEmploymentDetails?.manager ?? '',
      work_location: employeeEmploymentDetails?.work_location ?? '',
    },
  });

  const {mutate: updateEploymentDetails, status} = useMutation({
    mutationFn: memberServices.updateEmploymentDetails,
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
      date_of_hire: values.date_of_hire
        ? format(values.date_of_hire, 'yyyy-MM-dd')
        : undefined,
      date_of_termination: values.date_of_termination
        ? format(values.date_of_termination, 'yyyy-MM-dd')
        : undefined,
      job_title: selectedJobTitle?.value,
      department: selectedDepartment?.value,
    };

    updateEploymentDetails(data);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={
          !employeeEmploymentDetails || !jobTitlesData || !departmentsData
        }
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
                Edit Employment Details
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
                      name="job_title"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="job_title">Job Title</FormLabel>
                          <SelectComponent
                            {...field}
                            isLoading={isJobTitleLoading}
                            isDisabled={isJobTitleLoading}
                            createAble={true}
                            isMulti={false}
                            value={selectedJobTitle}
                            options={jobTitles}
                            onChange={selectedOption =>
                              handleJobTitleChange(selectedOption, field)
                            }
                            onCreateOption={handleCreateJobTitle}
                            placeholder="Select/create job title"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="department">Department</FormLabel>
                          <SelectComponent
                            {...field}
                            isLoading={isDepartmentLoading}
                            isDisabled={isDepartmentLoading}
                            createAble={true}
                            isMulti={false}
                            value={selectedDepartment}
                            options={departments}
                            onChange={selectedOption =>
                              handleDepartmentChange(selectedOption, field)
                            }
                            onCreateOption={handleCreateDepartment}
                            placeholder="Select/create department"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employment_type"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="employment_type">
                            Employment Type
                          </FormLabel>
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
                              <SelectItem value="full time">
                                Full time
                              </SelectItem>
                              <SelectItem value="part time">
                                Part time
                              </SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                              <SelectItem value="contractor">
                                Contractor
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employee_status"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="employee_status">
                            Employee Status
                          </FormLabel>
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
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="on leave">On leave</SelectItem>
                              <SelectItem value="terminated">
                                Terminated
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_of_hire"
                      render={({field}) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="date_of_hire">
                            Date of Hire
                          </FormLabel>
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
                      name="date_of_termination"
                      render={({field}) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="date_of_termination">
                            Date of Termination
                          </FormLabel>
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
                      name="manager"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="manager">Manager</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full mt-2 text-periwinkle-800 font-normal">
                              <SelectValue placeholder="Select manager..." />
                            </SelectTrigger>
                            <SelectContent>
                              {managerOptions.map((manager, idx: number) => (
                                <SelectItem
                                  key={idx}
                                  value={manager.id}
                                  className="flex items-center"
                                >
                                  {manager.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="work_location"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel htmlFor="work_location">
                            Work Location
                          </FormLabel>
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
                  <Button
                    type="submit"
                    disabled={
                      status === 'pending' ||
                      creatingJobTitleDepartment === 'pending'
                    }
                  >
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
