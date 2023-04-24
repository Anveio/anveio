import { Session } from "next-auth";
import React from "react";

/**
 * React component that takes a next-auth Session as a prop and returns children
 * if truthy, null if not
 */
interface Props {
  session: Session | null;
}

export const WithSessionOnly = (props: React.PropsWithChildren<Props>) => {
  if (!props.session) {
    return null;
  }

  return <>{props.children}</>;
};
