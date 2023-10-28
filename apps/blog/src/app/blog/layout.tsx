import Link from "next/link";
import * as React from "react";

export default function BlogLayout(props: React.PropsWithChildren<{}>) {
  return (
    <div className="py-3 sm:py-4 px-3 sm:px-3">
      <div className="max-w-4xl m-auto bg-zinc-950">
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
