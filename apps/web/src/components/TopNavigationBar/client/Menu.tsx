"use client";

import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import DefaultProfilePicture from "@/images/avatars/avatar-1.png";
import { Session } from "next-auth";
import { Routes } from "@/lib/constants/routes";

interface Props {
  session: Session;
}

export function TopNavigationBarMenu(props: Props) {
  return (
    <Menu as="div" className="relative ml-4 flex-shrink-0">
      <div>
        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="sr-only">Open user menu</span>
          <Image
            className="h-8 w-8 rounded-full"
            src={DefaultProfilePicture}
            alt=""
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={clsx(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={Routes.SETTINGS}
                className={clsx(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={clsx(
                  active ? "bg-gray-100" : "",
                  "block w-full px-4 py-2 text-left text-sm text-gray-700"
                )}
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
