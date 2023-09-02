// import { Routes } from "@/lib/constants/routes";
// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import clsx from "clsx";
// import Image from "next/image";
// import Link from "next/link";
// import CompanyLogoWhite from "../../../public/company-logo-white.svg";
// import { MobileSidebar } from "./MobileSidebar";
// import { ProfileButton } from "./SidebarButtons";
// import {
//   AivisorLink,
//   SidebarTeamLinks,
//   SidebarTopLevelNavLinks,
// } from "./SidebarNavLink";
// import { Button } from "@/components/ui/button";

// export function Sidebar() {
//   return (
//     <div>
//       <MobileSidebar>
//         <SidebarCore shouldGenerateConversationTitles={false} />
//       </MobileSidebar>
//       <SidebarCore
//         shouldGenerateConversationTitles={true}
//         className="hidden lg:flex"
//       />
//     </div>
//   );
// }

// interface Props {
//   shouldGenerateConversationTitles: boolean;
//   className?: string;
//   closeOnNavChange?: boolean;
// }

// function SidebarCore(props: Props) {
//   return (
//     <div
//       className={clsx(
//         "fixed top-0 z-40 flex h-[100dvh] h-full w-[15rem] flex-col bg-gray-900",
//         props.className
//       )}
//     >
//       <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10">
//         <div className="flex h-16 items-center">
//           <Link
//             href="/"
//             className="group flex w-full gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-blue-600 lg:text-sm"
//           >
//             <Image className="h-8 w-auto" src={CompanyLogoWhite} alt="" />
//             <span className="invisible text-white hover:visible">Home</span>
//           </Link>
//         </div>
//         <nav className="flex flex-1 flex-col">
//           <ul role="list" className="flex flex-1 flex-col gap-y-0">
//             <li>
//               <AivisorLink />
//             </li>
//             <SidebarTopLevelNavLinks />
//           </ul>
//         </nav>
//       </div>

//       <div className="mt-auto grid gap-3 bg-inherit text-indigo-200">
//         <SignedOut>
//           <div className="grid grid-cols-2 gap-3 p-3">
//             <Link href={Routes.LOGIN}>
//               <Button
//                 variant={"secondary"}
//                 className="w-full bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Log in
//               </Button>
//             </Link>
//             <Link href={Routes.SIGNUP}>
//               <Button
//                 variant={"default"}
//                 className="w-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Sign up
//               </Button>
//             </Link>
//           </div>
//         </SignedOut>
//         <SignedIn>
//           <ProfileButton />
//         </SignedIn>
//       </div>
//     </div>
//   );
// }
