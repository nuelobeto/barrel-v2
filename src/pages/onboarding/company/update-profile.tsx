import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import {Button} from '@/components/ui/button';
import {UpdateProfileType} from '@/types/auth';
import authServices from '@/services/authServices';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

const companyProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  // avatar: z.string().url().optional(),
});

export function UpdateCompanyProfile() {
  const form = useForm<z.infer<typeof companyProfileSchema>>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      // avatar: '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: (payload: UpdateProfileType) =>
      authServices.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Update failed');
    },
  });

  const onSubmit = (values: z.infer<typeof companyProfileSchema>) => {
    const payload: UpdateProfileType = {
      first_name: values.firstName,
      last_name: values.lastName,
      user_name: values.username,
      // avatar: values.avatar,
    };

    mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex place-items-center min-h-screen"
      >
        <Card className="w-full max-w-[420px] mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Update company profile</CardTitle>
            <CardDescription>
              Fill out the form to add your company information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="Enter first name"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Enter last name"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="avatar"
                render={({field}) => (
                  <FormItem>
                    <FormLabel htmlFor="avatar">Avatar</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="avatar"
                        type="file"
                        required
                        className="h-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={status === 'pending'}
            >
              {status === 'pending' ? 'Loading...' : 'Submit'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
