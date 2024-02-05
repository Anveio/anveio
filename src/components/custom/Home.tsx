/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oV3PeXm9LZR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";

interface Props {
  title: string;
  description: string;
  imageHref: string;
  slug: string;
}

export function FeaturedBlogPost(props: Props) {
  return (
    <Card className="animate-fade-in-up transition-all duration-500 ease-in-out transform translate-y-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      
      <div className="absolute -top-2 -right-2">
        <FlameIcon className="h-6 w-6 text-red-500 z-10" />
      </div>
      <div>
        <Image
          alt="Hero image"
          className="pointer-events-none select-none rounded-b-xl blog-post-cover-image pt-2 w-full h-full object-cover"
          height={400}
          src={props.imageHref}
          priority
          width={400}
        />
      </div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-bold mb-2 text-zinc-900 dark:text-gray-300">
            {props.title}
          </h2>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {props.description}
          </p>
        </div>
        <div className="mt-4 self-end">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-yellow-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-yellow-300 dark:text-gray-900 dark:hover:bg-yellow-400 dark:focus-visible:ring-yellow-200"
            href={`/blog/${props.slug}`}
          >
            Read
          </Link>
        </div>
      </div>
    </Card>
  );
}

function FlameIcon(props: React.HTMLProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
