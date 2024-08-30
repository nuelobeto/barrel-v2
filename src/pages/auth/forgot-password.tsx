import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Link} from 'react-router-dom';
import {ROUTES} from '@/router/routes';
import authServices from '@/services/authServices';
import {useMutation} from '@tanstack/react-query';
import {ForgotPasswordType} from '@/types/auth';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export function ForgotPassword() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: (payload: ForgotPasswordType) =>
      authServices.forgotPassword(payload),
    onSuccess: () => {
      toast.success('An email has been sent to your inbox');
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const payload = {
      email: values.email,
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
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we will send you a link to reset your
              password.
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

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending' ? 'Loading...' : 'Continue with email'}
              </Button>

              <Link
                to={`/${ROUTES.login}`}
                className="ml-auto block text-xs underline mx-auto"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
