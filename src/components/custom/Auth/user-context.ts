import { ClientSideUser } from '@/types';
import * as React from 'react';

export const UserContext = React.createContext<
  | {
      user: ClientSideUser | null | undefined;
      setUser: (newUser: ClientSideUser | null | undefined) => void;
    }
  | undefined
>(undefined);

export const useUser = () => {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
