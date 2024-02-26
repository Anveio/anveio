'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogInForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

const Tab = {
  SIGN_UP: 's',
  LOGIN: 'l',
};

export const AuthForm = (props: { tab: 's' | 'l' }) => {
  return (
    <Tabs defaultValue={props.tab} className='max-w-lg px:3 lg:px-0 mx-auto'>
      <TabsList className='grid w-full grid-cols-2 bg-zinc-800 text-white'>
        <TabsTrigger value={Tab.SIGN_UP}>Sign up</TabsTrigger>
        <TabsTrigger value={Tab.LOGIN}>Log in</TabsTrigger>
      </TabsList>
      <TabsContent value={Tab.SIGN_UP}>
        <SignUpForm />
      </TabsContent>
      <TabsContent value={Tab.LOGIN}>
        <LogInForm />
      </TabsContent>
    </Tabs>
  );
};
