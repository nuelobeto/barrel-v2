import {useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
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
import {useMutation} from '@tanstack/react-query';
import authServices from '@/services/authServices';
import toast from 'react-hot-toast';
import {ActivateAccountType} from '@/types/auth';
import {ROUTES} from '@/router/routes';

const activateAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function ActivateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const email = params.email;

  const {mutate, status} = useMutation({
    mutationFn: (payload: ActivateAccountType) =>
      authServices.activateAccount(payload),
    onSuccess: () => {
      toast.success('Your account has been activated');
      navigate(`/${ROUTES.updateCompanyPassword}`);
    },
    onError: () => {
      console.log('Error');
      toast.error('Some Error');
    },
  });

  const form = useForm<z.infer<typeof activateAccountSchema>>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      email: email ?? '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof activateAccountSchema>) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex place-items-center min-h-screen"
      >
        <Card className="mx-auto w-full max-w-[420px]">
          <CardHeader>
            <CardTitle className="text-2xl">Activate Account</CardTitle>
            <CardDescription>
              Enter your email and temporary password below to activate your
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Temporary password</FormLabel>
                    <FormControl>
                      <InputWrapper>
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                        />
                        <InputIconRight
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
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

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending' ? 'Loading...' : 'Activate Account'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="#" className="underline">
                Talk to support
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
