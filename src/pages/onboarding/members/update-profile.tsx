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
import authServices from '@/services/authServices';
import {UpdateProfileType} from '@/types/auth';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

const userProfileSchema = z.object({
  username: z.string(),
  // avatar: z.string().url(),
});

export function UpdateMemberProfile() {
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
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

  const onSubmit = (values: z.infer<typeof userProfileSchema>) => {
    const payload: UpdateProfileType = {
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
            <CardTitle className="text-2xl">User Details</CardTitle>
            <CardDescription>
              Fill out the form to add your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
