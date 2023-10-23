import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="flex px-3 h-[62px]">
      <div className="max-w-6xl m-auto">
        <div className="block">
          <Link className="flex space-x-2 flex-shrink-0 relative" href="/">
            <span className="text-white font-medium">Home</span>
          </Link>
          <div className="hidden xs:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 py-2 space-x-6 rounded-full bg-[#25272C] border border-[#FFFFFF]/[0.05] text-sm items-center justify-center px-6 font-medium overflow-hidden">
            <Link
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
              href="/pricing"
            >
              Blog
            </Link>
            <Link
              target="__blank"
              rel="noopener noreferrer"
              href="https://github.com/getcursor/cursor"
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
            >
              Projects
            </Link>
            <Link
              target="__blank"
              rel="noopener noreferrer"
              href="https://discord.com/invite/PJEgRywgRy"
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
            >
              About Me
            </Link>
          </div>
          <div className="hidden xs:block space-x-4 items-center">
            <Link
              href="/api/auth/login"
              className="text-sm font-medium text-[#FFFFFF]/[0.64]"
            >
              WIP
            </Link>
            <button className="group relative rounded-full p-px text-[0.8125rem] font-semibold leading-6 shadow-xl shadow-zinc-950 text-white">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 py-1 px-4 ring-1 ring-white/10 flex items-center space-x-2">
                <span>Download</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-toR from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </div>
          {/* <div className="xs:hidden block">
            {!session.userId ? (
              <div className="flex space-x-3">
                <Link href={"/sign-in"}>
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            ) : (
              <ManageAccountMenu userId={session.userId} />
            )}
          </div> */}
        </div>
      </div>
    </nav>
  );
};
