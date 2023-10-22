import { EventRecorder } from "@/components/custom/EventRecorder";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { PagePresenceUpdater } from "@/components/custom/PagePresenceUpdater";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <main className="bg-background">
        <Image
          src={"/bghero.webp"}
          priority
          alt=""
          width={1000}
          height={1000}
          className="pointer-events-none absolute left-0 -right-20 h-full w-full select-none md:block"
          style={{ color: "transparent" }}
        />
        <div className="lg:pt-36 mx-auto lg:pb-36 py-8 px-8 max-w-7xl">
          <div className="mx-auto flex flex-col items-center">
            {/* <div className="opacity-100">
              <div className="w-full flex justify-center clip-reveal delay-1000">
                <div className="py-1 flex items-center space-x-1 border rounded-full border-[#8C8C8C]/[0.4] w-fit px-4 bg-gradient-to-b from-[#8C8C8C]/[0.4] to-[#8C8C8C]/[0.25] shadow-[0px_1px_4px_0px_rgba(255,255,255,.12)]) mb-8">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="relative -left-1 opacity-80 text-dark-warning-text-active"
                    height={"12px"}
                    width={"12px"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-neutral-200">
                    You are now connected
                  </span>
                </div>
              </div>
            </div> */}

            <h1 className="text-white text-center text-4xl md:text-6xl mb-4 font-bold hero-fade-up-enter-active delay-75">
              The Internet should{" "}
              <span className="inline leading-[0] bg-gradient-to-br bg-clip-text text-transparent from-[#FFFF92] to-[#EE8912]">
                feel alive.
              </span>
            </h1>
            <div>
              <p className="text-center font-medium text-base md:text-lg text-[#FFFFFF]/[.48] mb-8"></p>
            </div>
          </div>
          <section className="mx-auto mt-10 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none ">
            <div className="grid grid-cols-1 gap-4">
              {Object.values(BLOG_POSTS).map((post) => {
                return (
                  <LiveBlogPostCard
                    key={post.slug}
                    content={post.content}
                    title={post.title}
                    id={post.slug}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <EventRecorder pageId="home" />
      <PagePresenceUpdater pageId="home" />
    </>
  );
}

const BLOG_POSTS: Record<
  string,
  {
    slug: string;
    title: string;
    content: string;
  }
> = {
  "easily-fixing-security-vulnerabilities-in-transitive-dependencies-with-yarn":
    {
      slug: "easily-fixing-security-vulnerabilities-in-transitive-dependencies-with-yarn",
      content: `It's 4:30 on a Friday and GitHub hits you with one of these. How do you make this go away and still get home on time?`,
      title: `Easily fixing security vulnerabilities in transitive dependencies with Yarn`,
    },
  "writing-type-safe-defaults-with-typescripts-pick-type": {
    slug: "writing-type-safe-defaults-with-typescripts-pick-type",
    content: `A common pattern I use when writing TypeScript applications is creating default objects and overwriting some or all of those defaults with data provided by the user. But there's a common mistake when implementing this pattern that can be fixed with a little knowledge of TypeScript's built in utilities.`,
    title: `Writing Type-safe Defaults with TypeScript's Pick Type`,
  },
  "using-absolute-imports-with-jest-in-create-react-app": {
    slug: "using-absolute-imports-with-jest-in-create-react-app",
    content: `You've written your createReact-app application using absolute imports resolved from e.g. a folder named src but when you run your tests you get a message like this:`,
    title: `Using Absolute Imports with Jest in Create React App`,
  },
  "using-promises-with-filereader": {
    slug: "using-promises-with-filereader",
    content:
      "Using `await` to handle FileReader's asynchronicity can be a lot simpler than dealing with events.",
    title: "Using Promises with FileReader",
  },
  "time-space-complexity-of-array-sort-in-v8": {
    slug: "time-space-complexity-of-array-sort-in-v8",
    content:
      "If you've ever looked at the syntax for sorting an array in JavaScript, you may have wondered how it works under the hood.",
    title: "Time & Space Complexity of Array.sort() in V8",
  },
  "greedy-solution-to-an-array-balancing-problem": {
    slug: "greedy-solution-to-an-array-balancing-problem",
    content:
      "A few weeks ago on reddit I read a question that asked for a solution to a fairly simple looking array balancing problem. But it turns out that a satisfactory solution isn't easy to come by.",
    title: "Greedy Solution to an Array Balancing Problem",
  },
  "never-use-array-from-to-convert-strings-to-arrays": {
    slug: "never-use-array-from-to-convert-strings-to-arrays",
    content:
      "Splitting a string into an array is about 70 times faster with 'a string'.split('')",
    title: "Never Use Array.from() to Convert Strings to Arrays",
  },
  "simulating-an-ability-in-world-of-warcraft": {
    slug: "simulating-an-ability-in-world-of-warcraft",
    content: `After working through Gordon Zhu's fantastic "Practical JavaScript" course, I wanted to make an app to put my newfound knowledge to the test.`,
    title: "Simulating an Ability in World of Warcraft",
  },
} as const;
