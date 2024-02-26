'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { registerNewUser } from '@/lib/auth/register-new-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from './user-context';

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Email must be in the correct format.',
      })
      .min(3, {
        message: 'Email must be at least 3 characters.',
      }),
    password: z.string().min(6, {
      message: 'Your password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.password !== data.email, {
    message: 'Password cannot be the same as your email',
    path: ['password'],
  });

export function SignUpForm() {
  const { user } = useUser();

  const [isSuccessful, setIsSuccessful] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (user) {
    return (
      <Alert variant='default'>
        <CheckCircle2Icon className='h-4 w-4' />
        <AlertTitle>Sign up successful</AlertTitle>
        <AlertDescription>
          You are logged in as {user.email} with ID {user.id}
        </AlertDescription>
      </Alert>
    );
  }

  const isFormSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await registerNewUser(values.email, values.password);
      setIsSuccessful(true);
    } catch (e) {
      setIsSuccessful(false);
    } finally {
    }
  }

  return (
    <div className='relative max-w-xl m-auto space-y-4'>
      <AnimatePresence>
        {isSuccessful ? (
          <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 10 }}
            animate={{
              y: 10,
              opacity: 1,
              transition: { duration: 0.5 },
            }}
          >
            <Alert variant='default'>
              <CheckCircle2Icon className='h-4 w-4' />
              <AlertTitle>Good</AlertTitle>
              <AlertDescription>
                Check your inbox for the invitation.
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: isSuccessful ? 0 : 1,
          y: isSuccessful ? 10 : 0,
          transition: { duration: 0.5 },
        }}
      >
        <Card className='bg-background text-white'>
          <CardHeader></CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id='sign-up-form'
                action='/api/auth/sign-up'
                method='post'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isFormSubmitting}
                          autoComplete={'email'}
                          required
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          disabled={isFormSubmitting}
                          autoComplete='new-password'
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Must be at least 6 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          disabled={isFormSubmitting}
                          autoComplete='new-password'
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className='justify-end'>
            <Button variant={'default'} type='submit' form='sign-up-form'>
              Request
              {isFormSubmitting ? (
                <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
              ) : (
                <ArrowRightIcon className='ml-2 h-4 w-4' />
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
