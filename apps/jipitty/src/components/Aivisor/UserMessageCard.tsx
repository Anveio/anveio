"use client"

import * as React from "react"
import { Menu, Transition } from "@headlessui/react"
import {
	CodeBracketIcon,
	EllipsisVerticalIcon,
	FlagIcon,
	StarIcon
} from "@heroicons/react/20/solid"
import ChatGptLogo from "@/images/logos/chat-gpt.svg"
import Image from "next/image"
import clsx from "clsx"
import { getConversationResponseBodySchema } from "@/lib/utils"
import { z } from "zod"

import { auth, useUser } from "@clerk/nextjs"

interface Props {
	message: z.infer<typeof getConversationResponseBodySchema>["messages"][number]
}

function formatDate(date: Date) {
	const options = {
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true
	} as const

	return date.toLocaleString("en-US", options)
}

export function UserMessageCard(props: Props) {
	const { user } = useUser()

	return (
		<div className="bg-white">
			<div className="flex space-x-3 px-4 py-5 sm:px-6">
				<div className="flex-shrink-0">
					<Image
						height={40}
						width={40}
						className="h-10 w-10 rounded-full"
						src={user?.profileImageUrl ?? ""}
						alt=""
					/>
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-gray-900">
						<a href="#" className="hover:underline">
							{user?.firstName} {user?.lastName}
						</a>
					</p>
					<p className="text-sm text-gray-500">
						<a href="#" className="hover:underline">
							{formatDate(props.message.createdAt)}
						</a>
					</p>
				</div>
				<div className="flex flex-shrink-0 self-center">
					<Menu as="div" className="relative inline-block text-left">
						<div>
							<Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
								<span className="sr-only">Open options</span>
								<EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
							</Menu.Button>
						</div>

						<Transition
							as={React.Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={clsx(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"flex px-4 py-2 text-sm"
												)}
											>
												<StarIcon
													className="mr-3 h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
												<span>Add to favorites</span>
											</a>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={clsx(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"flex px-4 py-2 text-sm"
												)}
											>
												<CodeBracketIcon
													className="mr-3 h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
												<span>Embed</span>
											</a>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={clsx(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"flex px-4 py-2 text-sm"
												)}
											>
												<FlagIcon
													className="mr-3 h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
												<span>Report content</span>
											</a>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
			<div className="px-4 pb-5 sm:px-6">{props.message.content}</div>
		</div>
	)
}
