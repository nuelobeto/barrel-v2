/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {cn} from '@/lib/utils';
import {useCallback, useEffect, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Separator} from '@/components/ui/separator';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {Text} from '@/components/ui/typography';
import {
  TextFieldInForm,
  TextFieldInTable,
} from './field-preview.tsx/text-field';
import {
  CheckboxEmptyIcon,
  CheckboxFilledIcon,
  LeftArrowIcon,
  RightArrow2,
  SmartFieldCancelIcon,
} from '@/components/ui/icons';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  handleSave: (payload: any) => void;
};

export const AddOrEditCustomField = ({
  open,
  setOpen,
  title,
  description,
  handleSave,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [step, setStep] = useState(1);

  const close = useCallback(() => {
    setOpen(false);
    setStep(1);
    setExpanded(false);
  }, [setOpen]);

  const fieldSchema = z.object({
    module: z.string().min(1, {
      message: 'This field is required',
    }),
    category: z.string().min(1, {
      message: 'This field is required',
    }),
    field_name: z.string().min(1, {
      message: 'This field is required',
    }),
    field_description: z.string().optional(),
    collect_info: z.enum(['true', 'false'], {
      message: 'This field is required',
    }),
    who_fills_this: z
      .enum([
        'admins when hiring',
        'admins when terminating',
        'new hires during onboarding',
      ])
      .optional(),
    data_type: z.string().min(1, {
      message: 'This field is required',
    }),
    has_default_value: z.boolean().default(false).optional(),
    tooltip_message: z.string().optional(),
  });

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      module: '',
      category: '',
      field_name: '',
      field_description: '',
      data_type: '',
      has_default_value: false,
      tooltip_message: '',
    },
  });

  function handleContinue(values: z.infer<typeof fieldSchema>) {
    console.log(values);
    setStep(2);
  }

  const module = form.watch('module');
  const category = form.watch('category');
  const field_name = form.watch('field_name');
  const dataType = form.watch('data_type');

  const modules = [
    {
      label: 'Employee',
      value: 'employee',
    },
    {
      label: 'Document',
      value: 'document',
    },
  ];

  const employeeCategories = [
    {
      label: 'Onboarding',
      value: 'onboarding',
    },
    {
      label: 'Off boarding',
      value: 'off-boarding',
    },
    {
      label: 'Compensation',
      value: 'compensation',
    },
  ];

  const documentCategories = [
    {
      label: 'Company document',
      value: 'company-document',
    },
    {
      label: 'Templates',
      value: 'templates',
    },
  ];

  const dataTypes = [
    {
      label: 'Text',
      value: 'text',
    },
    {
      label: 'Date',
      value: 'date',
    },
  ];

  function getCategories(module: string) {
    switch (module) {
      case 'employee':
        return employeeCategories;
      case 'document':
        return documentCategories;
      default:
        return [];
    }
  }

  useEffect(() => {
    if (!open) {
      close();
    }

    if (module && category && field_name && dataType) {
      setExpanded(true);
    }
  }, [open, dataType, module, category, field_name, close]);

  const permittedSchema = z.object({
    value: z.string().min(1, {message: 'Value is required'}),
    label: z.string().min(1, {message: 'Label is required'}),
    category: z.string().min(1, {message: 'Category is required'}),
  });

  const permissionSchema = z.object({
    applies_to: z
      .array(permittedSchema)
      .min(1, {message: 'This field is required'}),
    can_edit: z.enum(['employees', 'employees and admins', 'admins'], {
      message: 'This field is required',
    }),
    can_view: z.enum(['everyone', 'employees and admins', 'admins'], {
      message: 'This field is required',
    }),
  });

  const permissionForm = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      applies_to: [],
    },
  });

  function handleSaveObject(values: z.infer<typeof permissionSchema>) {
    const payload = {
      ...form.getValues(),
      ...values,
    };
    console.log('Payload:', payload); // For debugging
    handleSave(payload);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild hidden></SheetTrigger>

      {step === 1 && (
        <SheetContent
          className={cn(
            'py-6 pl-0 pr-6 bg-transparent border-none shadow-none transition-[width] duration-500',
            expanded ? 'min-w-[1344px]' : 'w-[672px]',
          )}
        >
          <div className="flex w-full h-full bg-periwinkle-50 rounded-xl">
            {expanded && (
              <div className="grow h-full px-[60px] pt-[122px] overflow-auto">
                <Text
                  variant={'body2'}
                  element="h2"
                  className="font-sauce text-neutral-600 font-semibold"
                >
                  Preview your custom field
                </Text>

                <div className="mt-8 flex flex-col gap-9">
                  <div className="flex flex-col gap-2">
                    <Text variant={'body5'} className="font-medium">
                      How will this field appear when collected in a form?
                    </Text>
                    <TextFieldInForm field_name="Date added" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Text variant={'body5'} className="font-medium">
                      How will this field appear in a table?
                    </Text>
                    <TextFieldInTable />
                  </div>
                </div>
              </div>
            )}

            <div className="w-[672px] h-full bg-white rounded-xl shadow-lg">
              <SheetHeader className="px-6 py-4 border-b border-neutral-25 h-[88px] relative flex flex-col justify-center">
                <SheetTitle className="flex-row items-start justify-center font-[600] text-[20px] leading-[32px] text-neutral-600">
                  {title}
                </SheetTitle>
                <SheetDescription>{description}</SheetDescription>

                <Button
                  variant={'ghost'}
                  className="rounded-[100px] border border-[#0E8DFB] text-[#0E8DFB] absolute right-6 text-sm"
                >
                  Step 1/2
                </Button>
              </SheetHeader>

              <div className="py-8 px-6 h-[calc(100%-88px-72px)] overflow-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleContinue)}>
                    <div className="flex flex-col gap-[18px]">
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="module"
                          render={({field}) => (
                            <FormItem className="w-1/2">
                              <FormLabel>
                                Select module{' '}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {modules.map((module, index) => (
                                    <SelectItem
                                      key={index}
                                      value={module.value}
                                    >
                                      {module.label}
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
                          name="category"
                          render={({field}) => (
                            <FormItem className="w-1/2">
                              <FormLabel>
                                Select category
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getCategories(module).map(
                                    (category, index) => (
                                      <SelectItem
                                        key={index}
                                        value={category.value}
                                      >
                                        {category.label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="field_name"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>
                              Field name <span className="text-red-400">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="field_description"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Field description (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a description for others viewing this field in reports and profiles."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="bg-neutral-50 my-8" />

                    <FormField
                      control={form.control}
                      name="collect_info"
                      render={({field}) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel>
                            How should Rippling collect this information?{' '}
                            <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                                <FormControl>
                                  <RadioGroupItem value="true" />
                                </FormControl>
                                <div className="flex flex-col gap-2">
                                  <FormLabel className="text-neutral-600 font-medium m-0">
                                    Collect this information from employees.
                                  </FormLabel>
                                  <FormDescription className="m-0">
                                    Collect this information from employees or
                                    admins.
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                                <FormControl>
                                  <RadioGroupItem value="false" />
                                </FormControl>
                                <div className="flex flex-col gap-2">
                                  <FormLabel className="text-neutral-600 font-medium m-0">
                                    Don't collect it. I'll add field values
                                    manually.
                                  </FormLabel>
                                  <FormDescription className="m-0">
                                    Don't collect it. I'll add field values
                                    manually.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-neutral-50 my-8" />

                    <FormField
                      control={form.control}
                      name="who_fills_this"
                      render={({field}) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel>Who should fill in this field?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-[14px] border border-neutral-50 rounded-xl">
                                <FormControl>
                                  <RadioGroupItem
                                    value={'admins when hiring'}
                                  />
                                </FormControl>

                                <FormLabel className="text-neutral-600 font-medium">
                                  Ask admins when hiring a new employee
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-[14px] border border-neutral-50 rounded-xl">
                                <FormControl>
                                  <RadioGroupItem
                                    value={'admins when terminating'}
                                  />
                                </FormControl>
                                <FormLabel className="text-neutral-600 font-medium">
                                  Ask admins when terminating an employee
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-[14px] border border-neutral-50 rounded-xl">
                                <FormControl>
                                  <RadioGroupItem
                                    value={'new hires during onboarding'}
                                  />
                                </FormControl>
                                <FormLabel className="text-neutral-600 font-medium">
                                  Ask new hires during onboarding
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-neutral-50 my-8" />

                    <FormField
                      control={form.control}
                      name="data_type"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>
                            Data type <span className="text-red-400">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Date" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataTypes.map((dataType, index) => (
                                <SelectItem key={index} value={dataType.value}>
                                  {dataType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-neutral-50 my-8" />

                    <FormField
                      control={form.control}
                      name="has_default_value"
                      render={({field}) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 h-10">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-neutral-400 font-normal">
                            This field has a default value.
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tooltip_message"
                      render={({field}) => (
                        <FormItem className="mt-[19px]">
                          <FormLabel>
                            Guide users with a tooltip when they fill in the
                            form (optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide useful tips for the person filling out this information"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              <div className="h-[72px] border-t border-neutral-25 flex items-center justify-end gap-[17px] px-[24px]">
                <Button variant="secondary" type="button" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={form.handleSubmit(handleContinue)}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      )}

      {step === 2 && (
        <SheetContent
          className={cn(
            'w-[672px] py-6 pl-0 pr-6 bg-transparent border-none shadow-none transition-[width] duration-500',
          )}
        >
          <div className="w-full h-full bg-white rounded-xl shadow-lg">
            <SheetHeader className="px-6 py-4 border-b border-neutral-25 h-[88px] relative flex flex-col justify-center">
              <SheetTitle className="flex-row items-start justify-center font-[600] text-[20px] leading-[32px] text-neutral-600">
                Configure field scope and permissions
              </SheetTitle>
              <SheetDescription>
                Who does this field apply to? Who should be able to view or edit
                this field?
              </SheetDescription>

              <Button
                variant={'ghost'}
                className="rounded-[100px] border border-[#0E8DFB] text-[#0E8DFB] absolute right-6 text-sm"
              >
                Step 2/2
              </Button>
            </SheetHeader>

            <div className="py-8 px-6 h-[calc(100%-88px-72px)] overflow-auto">
              <Form {...permissionForm}>
                <form onSubmit={permissionForm.handleSubmit(handleSaveObject)}>
                  <FormField
                    control={permissionForm.control}
                    name="applies_to"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Who does this field apply to?{' '}
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <PermissionDropdown
                            isAllowed={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="bg-neutral-50 my-8" />

                  <FormField
                    control={permissionForm.control}
                    name="can_edit"
                    render={({field}) => (
                      <FormItem className="flex flex-col gap-3">
                        <FormLabel>
                          Who can change the value of the custom field?{' '}
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="employees" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Employees themselves
                                </FormLabel>
                                <FormDescription className="m-0">
                                  Only employees can change this info about
                                  themselves; admins cannot make changes.
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="employees and admins" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Employees themselves and their admins
                                </FormLabel>
                                <FormDescription className="m-0">
                                  Employees can change this info about
                                  themselves; admins can change this info for
                                  employees within their permission scope
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="admins" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Admins only
                                </FormLabel>
                                <FormDescription className="m-0">
                                  Only admins can change this info for employees
                                  within their permission scope; employees
                                  cannot make changes.
                                </FormDescription>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="bg-neutral-50 my-8" />

                  <FormField
                    control={permissionForm.control}
                    name="can_view"
                    render={({field}) => (
                      <FormItem className="flex flex-col gap-3">
                        <FormLabel>
                          Who should be able to view values of this field?{' '}
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="everyone" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Everyone in the company
                                </FormLabel>
                                <FormDescription className="m-0">
                                  Everyone can view this info for all other
                                  employees
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="employees and admins" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Employees themselves and their admins
                                </FormLabel>
                                <FormDescription className="m-0">
                                  The employees can view this info for
                                  themselves; Admins can view this info about
                                  themselves or employees within their
                                  permission scope
                                </FormDescription>
                              </div>
                            </FormItem>
                            <FormItem className="flex space-x-3 space-y-0 p-3 border border-neutral-50 rounded-xl">
                              <FormControl>
                                <RadioGroupItem value="admins" />
                              </FormControl>
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-neutral-600 font-medium m-0">
                                  Admins Only
                                </FormLabel>
                                <FormDescription className="m-0">
                                  Admins can view this info for employees within
                                  their permission scope; employees cannot view
                                  this field.
                                </FormDescription>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <div className="h-[72px] border-t border-neutral-25 flex items-center justify-end gap-[17px] px-[24px]">
              <Button variant="secondary" type="button" onClick={close}>
                Cancel
              </Button>
              <Button onClick={permissionForm.handleSubmit(handleSaveObject)}>
                Save object
              </Button>
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};

type Permitted = {
  value: string;
  label: string;
  category: string;
};

interface GroupedByCategory {
  permitted: {
    value: string;
    label: string;
  }[];
  category: string;
}

const PermissionDropdown = ({
  isAllowed,
  onChange,
}: {
  isAllowed: Permitted[];
  onChange: (value: Permitted[]) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSelect = (newItem: Permitted) => {
    const exists = isAllowed?.some(item => item.value === newItem.value);
    const newArray = exists
      ? isAllowed.filter(item => item.value !== newItem.value)
      : [...isAllowed, newItem];
    onChange(newArray);
  };

  const handleDeleteCategory = (category: string) => {
    const newArray = isAllowed.filter(item => item.category !== category);
    onChange(newArray);
  };

  const groupByCategory = (items: typeof isAllowed): GroupedByCategory[] => {
    return items.reduce((acc: GroupedByCategory[], item) => {
      const existingCategory = acc.find(
        group => group.category === item.category,
      );

      if (existingCategory) {
        existingCategory.permitted.push({value: item.value, label: item.label});
      } else {
        acc.push({
          category: item.category,
          permitted: [{value: item.value, label: item.label}],
        });
      }

      return acc;
    }, []);
  };

  const groupedItems = groupByCategory(isAllowed);

  const departments = [
    {
      value: '2',
      label: 'Sales department',
      category: 'department',
    },
    {
      value: '3',
      label: 'Engineering department',
      category: 'department',
    },
    {
      value: '4',
      label: 'Finance department',
      category: 'department',
    },
    {
      value: '5',
      label: 'Marketing department',
      category: 'department',
    },
    {
      value: '6',
      label: 'Customer support department',
      category: 'department',
    },
  ];

  const admins = [
    {
      value: '7',
      label: 'Soji',
      category: 'admins',
    },
    {
      value: '8',
      label: 'Taslim',
      category: 'admins',
    },
    {
      value: '9',
      label: 'Jolomi',
      category: 'admins',
    },
    {
      value: '10',
      label: 'Kehinde',
      category: 'admins',
    },
    {
      value: '11',
      label: 'Dayo',
      category: 'admins',
    },
    {
      value: '12',
      label: 'Fareed',
      category: 'admins',
    },
    {
      value: '13',
      label: 'Nuel',
      category: 'admins',
    },
  ];

  return (
    <div className="w-full relative">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full min-h-10 border border-neutral-100 rounded-xl flex items-center p-2.5 gap-[5px] flex-wrap"
          >
            {groupedItems.map((item, index) => (
              <div
                key={index}
                className="h-[24px] flex items-center px-1.5 py-1 rounded-lg border border-purple-100 bg-purple-25 group relative cursor-default"
                onClick={e => e.stopPropagation()}
              >
                <span
                  className="absolute -top-1.5 -right-1.5 hidden group-hover:block"
                  onClick={() => handleDeleteCategory(item.category)}
                >
                  <SmartFieldCancelIcon />
                </span>

                {item.category === 'All - Everyone' ? (
                  <Text className="text-purple-800 text-xs font-normal">
                    {item.category}
                  </Text>
                ) : (
                  <div className="flex items-center gap-[4px]">
                    <Text className="text-purple-800 text-xs font-normal">
                      {item.category}
                    </Text>
                    <RightArrow2 className="fill-purple-800" />
                    <Text className="text-purple-800 text-xs font-normal">
                      {item.permitted[0].label}
                    </Text>
                    {item.permitted.length > 1 && (
                      <Text className="text-purple-800 text-xs font-semibold">
                        +{item.permitted.length - 1} more
                      </Text>
                    )}
                  </div>
                )}
              </div>
            ))}
          </button>
        </PopoverTrigger>

        {!selectedCategory && (
          <PopoverContent className="w-[600px] p-0">
            {/* header */}
            <div className="flex flex-col px-4 pt-3 pb-1.5 border-b border-neutral-50">
              <Text variant={'body5'} className="font-medium">
                Operator:
              </Text>
              <Text variant={'body6'} className="font-medium">
                AND:{' '}
                <span className="font-normal text-neutral-300">
                  to add those people who meet the required criteria
                </span>
              </Text>
            </div>

            {/* body */}
            <div className="py-1.5 px-1.5 flex flex-col gap-2.5">
              <button
                className="flex items-center justify-between py-1.5 px-3 hover:bg-neutral-25 rounded-[10px]"
                onClick={() =>
                  handleSelect({
                    value: '1',
                    label: 'Everyone',
                    category: 'All - Everyone',
                  })
                }
              >
                <Text variant={'body6'} className="text-neutral-500">
                  All employees (Managers, Employees, etc.)
                </Text>
                <LeftArrowIcon />
              </button>
              <button
                className="flex items-center justify-between py-1.5 px-3 hover:bg-neutral-25 rounded-[10px]"
                onClick={() => setSelectedCategory('admins')}
              >
                <Text variant={'body6'} className="text-neutral-500">
                  Admins
                </Text>
                <LeftArrowIcon />
              </button>
              <button
                className="flex items-center justify-between py-1.5 px-3 hover:bg-neutral-25 rounded-[10px]"
                onClick={() => setSelectedCategory('department')}
              >
                <Text variant={'body6'} className="text-neutral-500">
                  Department
                </Text>
                <LeftArrowIcon />
              </button>
            </div>
          </PopoverContent>
        )}

        {selectedCategory === 'admins' && (
          <PopoverContent className="w-[600px] p-0">
            {/* header */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-1.5 border-b border-neutral-50">
              <Button
                variant={'secondary'}
                onClick={() => setSelectedCategory('')}
              >
                Go back
              </Button>
              <Text variant={'body5'} className="font-medium">
                Admins
              </Text>
            </div>

            {/* sub header */}
            <div className="flex flex-col px-4 pt-3 pb-1.5 border-b border-neutral-50">
              <Text variant={'body5'} className="font-medium">
                Admins
              </Text>
              <Text variant={'body6'} className="font-normal text-neutral-300">
                Select multiple
              </Text>
            </div>

            {/* body */}
            <div className="py-1.5 px-1.5 flex flex-col gap-1 max-h-[200px] overflow-auto">
              {admins.map((admin, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 py-1.5 px-3 hover:bg-neutral-25 rounded-[10px]"
                  onClick={() => handleSelect(admin)}
                >
                  {isAllowed?.some(item => item.value === admin.value) ? (
                    <CheckboxFilledIcon />
                  ) : (
                    <CheckboxEmptyIcon className="" />
                  )}
                  <Text>{admin.label}</Text>
                </button>
              ))}
            </div>
          </PopoverContent>
        )}

        {selectedCategory === 'department' && (
          <PopoverContent className="w-[600px] p-0">
            {/* header */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-1.5 border-b border-neutral-50">
              <Button
                variant={'secondary'}
                onClick={() => setSelectedCategory('')}
              >
                Go back
              </Button>
              <Text variant={'body5'} className="font-medium">
                Department
              </Text>
            </div>

            {/* sub header */}
            <div className="flex flex-col px-4 pt-3 pb-1.5 border-b border-neutral-50">
              <Text variant={'body5'} className="font-medium">
                Department
              </Text>
              <Text variant={'body6'} className="font-normal text-neutral-300">
                Select multiple
              </Text>
            </div>

            {/* body */}
            <div className="py-1.5 px-1.5 flex flex-col gap-1 max-h-[200px] overflow-auto">
              {departments.map((department, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 py-1.5 px-3 hover:bg-neutral-25 rounded-[10px]"
                  onClick={() => handleSelect(department)}
                >
                  {isAllowed?.some(item => item.value === department.value) ? (
                    <CheckboxFilledIcon />
                  ) : (
                    <CheckboxEmptyIcon className="" />
                  )}
                  <Text>{department.label}</Text>
                </button>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
