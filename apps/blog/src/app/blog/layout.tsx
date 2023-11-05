import Link from "next/link";
import * as React from "react";

export default function BlogLayout(props: React.PropsWithChildren<{}>) {
  return (
    <div className="py-3 sm:py-4 px-3 md:px-6">
      <div className="max-w-4xl m-auto">
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
