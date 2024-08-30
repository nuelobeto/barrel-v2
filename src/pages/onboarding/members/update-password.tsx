import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {EyeIcon, EyeOffIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input, InputIconRight, InputWrapper} from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import authServices from '@/services/authServices';
import {CreatePasswordType} from '@/types/auth';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function UpdateMemberPassword() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const {mutate, status} = useMutation({
    mutationFn: (payload: CreatePasswordType) =>
      authServices.createPassword(payload),
    onSuccess: () => {
      toast.success('Password updated');
    },
    onError: () => {
      toast.error('Update failed');
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    const savedToken: string | null = localStorage.getItem('verificationToken');
    const verificationToken: string | undefined = savedToken
      ? JSON.parse(savedToken)
      : undefined;

    if (verificationToken) {
      const payload = {
        password: values.password,
        verificationToken,
      };

      mutate(payload);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex place-items-center min-h-screen"
      >
        <Card className="mx-auto w-full max-w-[420px]">
          <CardHeader>
            <CardTitle className="text-2xl">Update Password</CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {(['password', 'confirmPassword'] as const).map(
                (field: 'password' | 'confirmPassword') => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({field: formField}) => (
                      <FormItem>
                        <FormLabel htmlFor={field}>
                          {field === 'password'
                            ? 'New Password'
                            : 'Confirm Password'}
                        </FormLabel>
                        <FormControl>
                          <InputWrapper>
                            <Input
                              {...formField}
                              id={field}
                              type={showPassword[field] ? 'text' : 'password'}
                              required
                            />
                            <InputIconRight
                              onClick={() => togglePasswordVisibility(field)}
                            >
                              {showPassword[field] ? (
                                <EyeOffIcon
                                  width={20}
                                  height={20}
                                  className="stroke-gray-500"
                                />
                              ) : (
                                <EyeIcon
                                  width={20}
                                  height={20}
                                  className="stroke-gray-500"
                                />
                              )}
                            </InputIconRight>
                          </InputWrapper>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ),
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending' ? 'Loading...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
