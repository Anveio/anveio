import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * For external links that should open in a new tab and be underlined.
 * @returns
 */
export const Blink = (props: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      {...props}
      className={cn(props.className, "text-underline dark:text-blue-400")}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </Link>
  );
};
