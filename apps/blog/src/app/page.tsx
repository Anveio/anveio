import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSaying } from "@/lib/sayings";
import { CollaborativeApp, WithRoom } from "./Room";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToasterButtons } from "@/components/Toaster";

export default function Home() {
  return (
    <>
      <main className="min-h-screen antialiased bg-background overflow-hidden relative">
        <div className="pt-28 md:pt-52 pb-10 md:pb-24 px-8 relative z-40">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="z-50 opacity-100">
              <div className="w-full flex justify-center">
                <div className="py-1 flex items-center space-x-2 border rounded-full border-[#8C8C8C]/[0.4] w-fit px-4 bg-gradient-to-b from-[#8C8C8C]/[0.4] to-[#8C8C8C]/[0.25] shadow-[0px_1px_4px_0px_rgba(255,255,255,.12)]) mb-8">
                  <span className="text-neutral-200">{getSaying(0)}</span>
                </div>
              </div>
            </div>
            <h1 className="text-white text-center text-3xl md:text-6xl mb-4 font-bold">
              Shovon Hasan
            </h1>
            <div>
              <p className="text-center font-medium text-base md:text-lg text-[#FFFFFF]/[.48] mb-8"></p>
            </div>
          </div>
        </div>
        <section className="flex justify-center space-x-3">
          <ToasterButtons />
        </section>
        <section className="mx-auto mt-10 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none ">
          <div
            className="grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-3 gap-4"
          >
            <BlogPost
              title={
                "Easily fixing security vulnerabilities in transitive dependencies with Yarn"
              }
              content={
                "It's 4:30 on a Friday and GitHub hits you with one of these. How do you make this go away and still get home on time?"
              }
            />
            <BlogPost
              title={"Writing Type-safe Defaults with TypeScript's Pick Type"}
              content={
                "A common pattern I use when writing TypeScript applications is creating default objects and overwriting some or all of those defaults with data provided by the user. But there's a common mistake when implementing this pattern that can be fixed with a little knowledge of TypeScript's built in utilities."
              }
            />
            <BlogPost
              title={"Using Absolute Imports with Jest in Create React App"}
              content={
                "You've written your create-react-app application using absolute imports resolved from e.g. a folder named src but when you run your tests you get a message like this:"
              }
            />
            <BlogPost
              title={
                "Easily fixing security vulnerabilities in transitive dependencies with Yarn"
              }
              content={
                "It's 4:30 on a Friday and GitHub hits you with one of these. How do you make this go away and still get home on time?"
              }
            />
          </div>
        </section>
      </main>
      <WithRoom roomId="blog-home">
        <CollaborativeApp />
      </WithRoom>
    </>
  );
}

const BlogPost = (props: { title: string; content: string }) => {
  return (
    <Link href="/wip">
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.content}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end align-self-end">
          <Button>Read</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
