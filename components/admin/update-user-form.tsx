'use client';

import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { updateUserSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { USER_ROLES } from '@/lib/constants';
import { updateUser } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';

const UpdateUserForm = ({
  user,
  userId,
  type,
}: {
  user: User;
  userId: string;
  type: 'Update' | 'Create';
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });
  const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (data) => {
    const res = await updateUser(data);

    if (!res.success) {
      toast.error(res.message);
    }

    toast.success(res.message);

    form.reset();

    router.push('/admin/users');
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'email'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter user email"
                      className="rounded-r-none"
                      disabled={true}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'name'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter user name"
                      className="rounded-r-none"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'role'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50">
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800 py-3 px-4 w-full">
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
