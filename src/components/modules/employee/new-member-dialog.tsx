import {useState} from 'react';
import {
  FieldArrayWithId,
  FieldValues,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {Input, InputWrapper, InputIconRight} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {HelpIcon} from '@/components/ui/icons';
import BulkUploadTriggerAction from './bulk-upload-dialog';
import {
  InviteMemberType,
  Manager,
  MembersApiResponse,
  MemberType,
} from '@/types/members';
import memberServices from '@/services/memberServices';
import {RoleType} from '@/types/role';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {ErrorResponse} from '@/types/error';
import {SelectComponent} from '@/components/ui/creatable-select';
import businessServices from '@/services/businessServices';
import {Option} from '@/types';
import {
  JobTitleDepartment,
  JobTitlesDepartmentsApiResponse,
} from '@/types/business';
import {useFetchRoles} from '@/hooks/useQueries';

interface RoleOptions {
  id: string;
  name: string;
}

interface MembersForm {
  index: number;
  members: MembersApiResponse;
  form: UseFormReturn<z.infer<typeof inviteMemberSchema>>;
  fields: FieldArrayWithId<InviteMemberFormValues, 'members', 'id'>[];
  jobTitlesRes: JobTitlesDepartmentsApiResponse;
  creatingJobTitleDepartment: boolean;
  setCreatingJobTitleDepartment: React.Dispatch<React.SetStateAction<boolean>>;
  selectedJobTitle: Option | null;
  setSelectedJobTitle: React.Dispatch<React.SetStateAction<Option | null>>;
}

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const memberSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  role_id: z.string().min(1, 'Job role is required'),
  job_title: optionSchema.refine(data => data.value !== '', {
    message: 'Job title is required',
  }),
  manager: z.string().min(1, 'Manager is required'),
});

const inviteMemberSchema = z.object({
  members: z.array(memberSchema),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export default function NewMemberTriggerAction({
  children,
  members,
  jobTitlesRes,
}: {
  children: React.ReactNode;
  members: MembersApiResponse;
  jobTitlesRes: JobTitlesDepartmentsApiResponse;
}) {
  const queryClient = useQueryClient();
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [creatingJobTitleDepartment, setCreatingJobTitleDepartment] =
    useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<Option | null>(null);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      members: [
        {
          first_name: '',
          last_name: '',
          email: '',
          role_id: '',
          manager: '',
          job_title: {value: '', label: ''},
        },
      ],
    },
  });

  const {fields, append} = useFieldArray({
    control: form.control,
    name: 'members',
  });

  const addMember = () => {
    append({
      first_name: '',
      last_name: '',
      email: '',
      role_id: '',
      manager: '',
      job_title: {value: '', label: ''},
    });
  };

  const {mutate, status} = useMutation({
    mutationFn: (payload: InviteMemberType[]) =>
      memberServices.inviteMembers(payload),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({
        queryKey: ['members'],
      });
      setOpenFormDialog(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data.message || 'Failed to send invitation');
    },
  });

  const onSubmit = (values: InviteMemberFormValues) => {
    const payload = values.members.map(member => ({
      ...member,
      job_title: selectedJobTitle?.value,
    }));

    mutate(payload);
  };

  return (
    <Sheet open={openFormDialog} onOpenChange={setOpenFormDialog}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="h-auto m-6">
        <SheetHeader className="border-b border-neutral-25 -mx-6 px-6 pb-6">
          <SheetTitle>Add Employee data</SheetTitle>
          <SheetDescription className="mt-2.5">
            Please enter the employee details or you can click here to{' '}
            <BulkUploadTriggerAction>
              <Button
                variant="ghost"
                className="text-xs p-0 text-purple-400 font-medium underline h-auto"
              >
                use the bulk upload
              </Button>
            </BulkUploadTriggerAction>
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="text-periwinkle-800 font-normal flex flex-col gap-6 h-full overflow-x-hidden overflow-y-auto scroll"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {fields.map((field, index) => (
              <MemberForm
                index={index}
                key={field.id}
                fields={fields}
                form={form}
                members={members}
                jobTitlesRes={jobTitlesRes}
                creatingJobTitleDepartment={creatingJobTitleDepartment}
                setCreatingJobTitleDepartment={setCreatingJobTitleDepartment}
                selectedJobTitle={selectedJobTitle}
                setSelectedJobTitle={setSelectedJobTitle}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              className="w-fit"
              onClick={addMember}
            >
              Add another employee
            </Button>
            <SheetFooter className="mt-auto flex items-center justify-center border-t border-neutral-25 -mx-6 px-6 pt-4">
              <SheetClose asChild>
                <Button variant="secondary">Cancel</Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={status === 'pending' || creatingJobTitleDepartment}
              >
                <img src="/images/check.svg" alt="" width={20} height={20} />
                Add employee(s)
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

const MemberForm = ({
  index,
  members,
  form,
  fields,
  jobTitlesRes,
  creatingJobTitleDepartment,
  setCreatingJobTitleDepartment,
  selectedJobTitle,
  setSelectedJobTitle,
}: MembersForm) => {
  const queryClient = useQueryClient();

  const {data: roles} = useFetchRoles();

  const managerOptions: Manager[] =
    members?.data.result
      ?.filter((m: MemberType) => m.role !== 'member' && m.role !== null)
      ?.map((m: MemberType) => ({
        id: m.id,
        name: `${m.user.first_name} ${m.user.last_name}`,
        avatar: m.user.avatar,
      })) || [];

  const roleOptions: RoleOptions[] =
    roles?.data?.map((r: RoleType) => ({
      id: r.id,
      name: r.name,
    })) || [];

  const jobTitlesData =
    jobTitlesRes?.data.map((jobTitle: JobTitleDepartment) => ({
      value: jobTitle.id,
      label: jobTitle.name,
    })) || [];

  const [jobTitles, setJobTitles] = useState<Option[]>(jobTitlesData);

  const {mutate: createJobTitleDepartment} = useMutation({
    mutationFn: businessServices.createJobTitleDepartments,
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['jobTitles']});

      const newOption = {value: data?.data?.id, label: data?.data?.name};

      setJobTitles(prev => [...prev, newOption]);
      setSelectedJobTitle(newOption);
      setCreatingJobTitleDepartment(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data.message || 'Failed to create job title/department',
      );
    },
  });

  const handleCreateJobTitle = (inputValue: string) => {
    setCreatingJobTitleDepartment(true);

    createJobTitleDepartment({
      name: inputValue,
      type: 'job_title',
    });
  };

  const handleJobTitleChange = (
    selectedOption: Option | null,
    field: FieldValues,
  ) => {
    setSelectedJobTitle(selectedOption);
    field.onChange(selectedOption || {value: '', label: ''});
  };

  return (
    <div
      className={`flex flex-col gap-5 border-b border-neutral-50 ${
        fields.length > 1 ? 'pb-10' : 'pb-6'
      } ${index !== 0 ? 'pt-4' : 'pt-2'}
    `}
    >
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name={`members.${index}.first_name`}
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel htmlFor={`members.${index}.first_name`}>
                First name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={`members.${index}.first_name`}
                  type="text"
                  placeholder="Enter first name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`members.${index}.last_name`}
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel htmlFor={`members.${index}.last_name`}>
                Last name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={`members.${index}.last_name`}
                  type="text"
                  placeholder="Enter last name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`members.${index}.email`}
        render={({field}) => (
          <FormItem>
            <FormLabel htmlFor={`members.${index}.email`}>Work Email</FormLabel>
            <FormControl>
              <InputWrapper className="mt-2">
                <Input
                  {...field}
                  id={`members.${index}.email`}
                  type="email"
                  placeholder="Enter work email address"
                />
                <InputIconRight>
                  <HelpIcon />
                </InputIconRight>
              </InputWrapper>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`members.${index}.role_id`}
        render={({field}) => (
          <FormItem>
            <FormLabel htmlFor={`members.${index}.role_id`}>Job Role</FormLabel>
            <Select onValueChange={field.onChange}>
              <SelectTrigger className="w-full mt-2 text-periwinkle-800 font-normal capitalize">
                <SelectValue placeholder="Select Job role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roleOptions.map((role, idx) => (
                    <SelectItem
                      key={idx}
                      value={role.id}
                      className="capitalize"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`members.${index}.job_title`}
        render={({field}) => (
          <FormItem>
            <FormLabel htmlFor={`members.${index}.job_title`}>
              Job Title
            </FormLabel>
            <SelectComponent
              {...field}
              isLoading={creatingJobTitleDepartment}
              isDisabled={creatingJobTitleDepartment}
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
        name={`members.${index}.manager`}
        render={({field}) => (
          <FormItem>
            <FormLabel htmlFor={`members.${index}.manager`}>Manager</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full mt-2 text-periwinkle-800 font-normal">
                <SelectValue placeholder="Select manager..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {managerOptions.map((manager, idx: number) => (
                    <SelectItem
                      key={idx}
                      value={manager.id}
                      className="flex items-center"
                    >
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
