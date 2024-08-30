import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
import {ROUTES} from '@/router/routes';
import {LoginType} from '@/types/auth';
import authServices from '@/services/authServices';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '@/store/useAuth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function Login() {
  const {setUser} = useAuth();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {mutate: login, status} = useMutation({
    mutationFn: (payload: LoginType) => authServices.login(payload),
    onSuccess: data => {
      toast.success('Login successful');
      navigate(ROUTES.employeeDirectory);
      setUser(data.data.user);
      queryClient.invalidateQueries({queryKey: ['business']});
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const {mutate: googleLogin} = useMutation({
    mutationFn: () => authServices.googleAuth(),
    onSuccess: data => {
      toast.success('Login successful');
      navigate(ROUTES.employeeDirectory);
      setUser(data.data.user);
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    login(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex place-items-center min-h-screen"
      >
        <Card className="mx-auto w-full max-w-[420px]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
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
                    <FormLabel htmlFor="password">Password</FormLabel>
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
              <Link
                to={`/${ROUTES.forgotPassword}`}
                className="ml-auto inline-block text-xs underline"
              >
                Forgot your password?
              </Link>

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending' ? 'Loading...' : 'Login'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => googleLogin()}
              >
                Login with Google
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
