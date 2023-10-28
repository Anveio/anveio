import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import Image from "next/image";

export const metadata = {
  title: BLOG_POSTS["algorithmic-loot-generation-sucks"].title,
  description:
    "A rant on how algorithmic loot generation has ruined the stories we form of our time playing games.",
};

export default function Post() {
  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <p className="italic text-center">
          Published{" "}
          {formatDateWithSuffix(
            BLOG_POSTS["algorithmic-loot-generation-sucks"].publishedAt
          )}
        </p>
        <h1 className="text-center text-2xl font-semibold">
          {BLOG_POSTS["algorithmic-loot-generation-sucks"].title}
        </h1>
        <Image
          alt="Decorative box art of an imaginary RPG game"
          src={"/blog-assets/algorithmic-loot-generation-sucks/cover.webp"}
          width={896}
          height={274}
        />
        <p className="italic text-center">
          We would have been better off algorithmically generating the stories.
        </p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          The year is{" "}
          <span className="inline leading-[0] bg-gradient-to-br bg-clip-text text-transparent from-[#FFFF92] to-[#EE8912]">
            2004
          </span>
        </h2>
        <p>
          You're playing an RPG at your computer on a rainy Friday evening. You
          enter the Cave of Despair with your ragtag group to rescue a child
          kidnapped from the village nearby. After failing to convince the
          bandit chieftan who's holed up in the cave with his clan you're forced
          to kill him. You spend the next hour struggling and trying different
          different strategies until finally his head falls. Upon opening his
          treasure chest you find the Bow of Silent Ends, a magical artifact
          that the chieftan had stolen but could not appreciate the power of.
          You drag it into the weapon slot of one of your party members and
          right click the nearest enemy. Your brain floods with happy chemicals
          as you discover that your archer now does four times as much damage as
          he used to and you can take on the Lizard King at the top of Mythical
          Mountain, who you failed to beat after hours of trying last night.
          You're filled with determination and excitement as you head back up
          the mountain, glad for this hard-won turn of the tide in your favor
          and your mind buzzes with possibilities at what loot The Lizard King
          will drop next.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          The year is{" "}
          <span className="inline leading-[0] bg-gradient-to-br bg-clip-text text-transparent from-[#b6f492] to-[#338b93]">
            2023
          </span>
        </h2>
        <p>
          You load into your game. Corporate decided that games receive better
          reviews if they can keep you playing them longer so developers had to
          come up with enough content to keep you staring at your screen for at
          least 600 hours. Better reviews means more sales but making content is
          hard so you load into Procedurally Generated Cave Template 23. This
          one has pirate bandits. Damn, third time in a row. You prefer the
          blood cultist caves because they have fewer enemies. You kill the
          first enemy in 1 seconds and spend 2 seconds pressing E to loot it,
          vacantly moving your mouse around to grab the 23 gold off the body
          (adding to your stockpile of 293,523), and Minor Healing Potion which
          you like because they have a pretty decent value/weight ratio. You
          kill the boss at the end with two button presses and find a Leather
          Helmet of the Ox which is a 8% increase in stamina but a 2% decrease
          in damage. You take it to sell for later. You can't wear leather.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          We've failed to procedurally generate meaning
        </h2>
        <p>
          Making meaningful loot drops is difficult work, sure, but loot is at
          the core of our experience of playing games. The possibility of an
          amazing find adds a sense of anticipation and uncertainty to every
          encounter with an enemy. We form relationships with loot -- we
          remember the moment we found it, how we took a second to appreciate
          how cool it looked on our character, how it let us overcome a
          challenge we previously thought impossible. They are part of the story
          of our save file and the story of our life. Loot helped us learn that
          when one problem seems insurmountable we can lean firmly into a
          different but related problem and still make progress. Why did we
          think this, of all parts of game development, needed to be automated
          away?
        </p>
      </section>
    </article>
  );
}
