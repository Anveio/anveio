"use client";

import { ClientSideUser } from "@/types";
import * as React from "react";
import { UserContext } from "./user-context";

export function UserProvider(
  props: React.PropsWithChildren<{ user: ClientSideUser | null | undefined }>
) {
  const [user, setUser] = React.useState<ClientSideUser | null | undefined>(
    props.user
  );

  React.useEffect(() => {
    handleSetUser(props.user);
  }, [props.user]);

  const handleSetUser = (newUser: ClientSideUser | null | undefined) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: handleSetUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
