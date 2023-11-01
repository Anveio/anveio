import Link from "next/link";
import * as React from "react";

export default function CreateLayout(props: React.PropsWithChildren<{}>) {
  return (
    <div className="min-w-screen min-h-screen  bg-zinc-950">
      <div className="max-w-4xl m-auto py-3 sm:py-4 ">
        <div className="py-4">
          <Link href="/" scroll={false}>
            {"<-"} Home
          </Link>
        </div>
        {props.children}
      </div>
    </div>
  );
}
