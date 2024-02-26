'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props extends React.ComponentProps<typeof Link> {
  inactiveClassName?: string;
  activeClassName?: string;
}

export const NavbarLink = ({ activeClassName, ...props }: Props) => {
  const pathname = usePathname();

  const stringHref = props.href.toString();

  const userIsOnbasePath = pathname === '/';

  const isActivePath = userIsOnbasePath
    ? stringHref === pathname
    : props.href.toString().startsWith(pathname);

  return (
    <Link
      {...props}
      prefetch
      className={cn(
        isActivePath ? activeClassName : props.inactiveClassName,
        props.className
      )}
    />
  );
};
