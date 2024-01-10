import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: BLOG_POSTS["how-to-be-good-at-sex-guide-for-straight-men"].title,
  description:
    "An essay on finding yourself and as a positive consequence, becoming magnetically sexy.",
  openGraph: {
    title: BLOG_POSTS["how-to-be-good-at-sex-guide-for-straight-men"].title,
    description:
      "An essay on finding yourself and as a positive consequence, becoming magnetically sexy.",
    url: "https://anveio.com",
    siteName: "Anveio",
    images: [
      {
        url: "https://anveio.com/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/opengraph-image.jpg",
        width: 1080,
        height: 1080,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://anveio.com"),
};

export default function Post() {
  return (
    <article className="space-y-36 text-base leading-8">
      <div className="space-y-3">
        <p className="italic text-center">
          Published{" "}
          {formatDateWithSuffix(
            BLOG_POSTS["how-to-be-good-at-sex-guide-for-straight-men"]
              .publishedAt
          )}
        </p>
        <h1 className="text-center text-2xl font-semibold">
          {BLOG_POSTS["how-to-be-good-at-sex-guide-for-straight-men"].title}
        </h1>
        <Image
          alt="Decorative box art of an imaginary RPG game"
          src={
            "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/cover.webp"
          }
          className="blog-post-cover-image"
          width={896}
          height={896}
          priority
        />
        <p className="italic text-center">Pictured: you, in the future</p>
      </div>
      <section className="space-y-10">
        <h2 className="text-2xl font-bold">Effing the Ineffable</h2>
        <p>
          Good sex doesn’t start in the bedroom. It started at least a few hours
          ago while you were making dinner when she asked if she could help and
          you told her you could use her help stirring the mushrooms but when
          she tried she wasn’t doing it quite right so you got behind her,
          shoulders around hers, and gently guided her hands with yours and
          showed her the way. And when she started getting the hang of it and
          you told her “You’re doing great” and you lovingly squeezed her waist
          and give her a kiss on the cheek and told her “Thank you”.
        </p>
        <p>
          Actually, no, it started that morning when you remembered she had to
          make an annoying call to the bank to dispute a credit card charge but
          you remembered how much she hates being on the phone so you did it for
          her while making coffee for the two of you before she even woke up.
        </p>
        <p>
          But really it started years ago when, after some reflection, you
          realized you harbored resentment towards women that had been there
          since you were a teenager because you were taught that your worth as a
          man depended on validation from women. And that your father, and all
          men but your father especially, failed to model a healthy heterosexual
          relationship. You grew up thinking relationships were 1v1— that they
          were about keeping score and filling roles that were decided by other
          people. You grew up thinking romance had a shelf life and that true
          love, in the best case, just was not in the cards for you, and in the
          worst case didn’t exist at all. Why even bother with relationships if
          the only thing in store is headaches? “Oh right, I’m worth less unless
          I attract women”. But the chase for women was all status games and
          posturing and even when it wasn’t it was like taking a test where you
          aren’t allowed to read the question. “Sorry, you texted too much and
          came off as clingy”. Or: “Sorry, you texted too little and came off
          avoidant and disinterested”. Somewhere along the way all this bullshit
          had you falling out of love with women and the love gave way to
          resentment and the resentment gave way to bad sex because sex needs
          love if it’s gonna be good.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/this-be-the-verse.webp"
            }
            alt=""
            width={400}
            height={500}
          />
          <figcaption className="text-sm text-center py-4">
            The games we torture ourselves with are a waste of time, but why do
            we play these games anyway?
          </figcaption>
        </figure>
        <p>
          The answer to “how do I have good sex as a straight guy” begins with
          this: you love your partner and you have hope for your relationship.
          Your love and hope will guide you to derive pleasure from exerting
          effort like cooking dinner and doing chores. It’ll lead to you
          communicating what you like, earnestly listening to what they like,
          and being attuned to both your bodies about what feels good. You’ll
          implicitly trust your partner to reciprocate your effort and
          commitment so that when resentment arises (”I did all the chores this
          week and I feel like I’m pulling most of the weight”), it’s a light
          sting rather than a pressure cooker that’s left on month after month
          after month. Stings can be healed but an explosion can’t.
        </p>
        <p>
          This piece, and the answer to the question “how do I have good sex as
          a straight guy”, contains zero details about the mechanics of sex, and
          I’m genuinely sorry for how disappointing that is because it means the
          actual answer involves introspection and change which is a lot harder
          than like using the “come hither” motion with your finger or whatever.
          In order to love your partner fully.
        </p>
        <p>
          Be nice to yourself, so you can be nice to your girlfriend, so she’ll
          find you sexy and enjoy having sex with you.
        </p>
        <p>
          But how do you get there? It’s hard to love someone if you’re in your
          own head all the time. It’s hard to be genuine if you’re constantly
          worried about how you’re perceived. It’s hard to let your body express
          your love in ways words never could when we spend so much of our lives
          feeling like aliens in our own bodies. It’s hard to have hope for a
          relationship when we see and experience bad relationships time and
          time again and don’t know how to process them so we don’t put our pain
          and hurt onto our partner.
        </p>
        <p>
          Getting meta for a moment, it’s odd that so much content on the
          internet for straight men is either predatory or misses The Point.
          Most of it assumes we have zero interest in being a good person and
          that we’re eager to engage in negative-sum gender dynamics, or that we
          should be violent in bed, or incurious about our partners as humans.
          Take a moment to appreciate the absurdity of male “gurus” who buy
          their own bullshit so deeply they presume to know your girlfriend or
          wife better than you do because they “know” “women” and your partner —
          the love of your life — can be reduced to the guru’s ill-conceived
          gender stereotypes. It’s a desert out there for the straight guy who
          wants to be strong and kind and curious. Goku if he was a nerd, if you
          will. Or gigachad if he was a monk.
        </p>
        <p>
          Tthe first step is unlearning society's definition of a man and
          reinventing a new definition for yourself from first principles. The
          second step is to learn to love women again.
        </p>
      </section>
      <section className="space-y-10">
        <h2 className="text-2xl font-bold">Lover, Love Thyself</h2>
        <p>
          To get good at sex we have to start off by forgetting what it means to
          be a man. Clean slate.
        </p>
        <p>
          "Forget how to be a man? And that’ll make me good at sex? More
          omega-male liberal bullshit" You're saying, understandably skeptical.
          OK I hear you, but hear me out as well.
        </p>
        <p>Listen:</p>
        <p>
          The idea of a "man" is awfully convenient for society. A man is an
          unfeeling machine that takes care of business. That does what needs to
          be done regardless of how it makes them feel, especially if that
          feeling is suffering. That only ever acts logically so he's easy to
          predict. Someone who's better off isolated so that yearnings of the
          heart don't get in the way of simple incentives like money, power, and
          status so that when you’re given a script to live by you stick to it:
          “be a doctor”, “be a soldier’, “don’t complain”, “do not, under any
          circumstances, dance”. A “man” is physically fit and possesses
          desirable genetic traits. No need to continue the atrocity of chattel
          slavery, we've convinced men to do it to themselves.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/chandler.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            Chandler Bing knew
          </figcaption>
        </figure>
        <p>
          Even more convenient for the people who benefit from you sticking to
          the script: there is only one person that has to deal with the pain,
          confusion, and shame caused by living your life this way and that
          person is you. So you live our life trying to be this thing and you
          internalize the lie that if men were any other way then the world
          would be worse off. Because after all you're too stupid to come up
          with our own way of making the world better, right? And you're all too
          eager to believe this because if you have to suffer with no complaint,
          at least you're suffering for a reason.
        </p>
        <p>
          Know that at the heart of every machine man is the deep humiliation of
          knowing they’re living life according to someone else's expectations.
          If you can notice this in yourself it may feel like confusion, "I
          don't know what else I'd be doing", or shame, "if I don't follow the
          script I'll ruin my life", or regret "I can't accept that I wasted all
          those years not being myself; it's too painful", or anger, "fuck you I
          don't even fucking know who I am, life's a joke". Or possibly all of
          the above.
        </p>
        <p>
          I promise to get to the actual sex tips in a second but first you have
          to know that I'm not framing things this way to get you mad at some
          shadow masters in a smoke-filled room who decided that this was the
          way things would be. Ideas that survive did so through natural
          selection and this particular mythology of a "man" is, in evolutionary
          terms, extremely competitive. It's a system where humans turn into
          homogeneous machines that, through the power of shaming men who don't
          stick to the script, instantly transforms them into another machine
          man. No other definition of masculinity had a chance to survive. I’ll
          provide a better definition in a second (and as a bonus a definition
          of femininity too, only the best for you brüther) but in the meantime:
          bravo to the Machine Theory of Masculinity for doing so well.
        </p>
      </section>
      <section>
        <h3 className="text-2xl font-bold">
          A working theory of masculinity and femininity.
        </h3>
        <p>
          You’re allowed to come up with your own definitions or even to pick
          freely from others’ definitions based on your taste because this shit
          is all arbitrary and definitions exist to serve human understanding.
          There’s no such thing as a chair, and so on.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/language.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            Don't mind me just putting another nail on the beach.
          </figcaption>
        </figure>
        <p>
          So with that being said, I invite you to entertain the idea that
          masculinity is not the opposite of femininity but that the two are
          complementary. You can be both masculine and feminine at the same
          time, and in fact being both is what our society values most. Your
          initial reaction to the previous statement might be to raise an
          eyebrow but I also invite you to wonder how much of your skepticism is
          because there’s a part of you that thinks femininity is inferior or
          not worth exhibiting.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/2x2.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            If King, Warrior, Magician, Lover was good
          </figcaption>
        </figure>
        <p>
          Masculinity is directly proportional to the amount of integration and
          agency your actions exhibit. Someone who’s masculine demonstrates a
          high amount of both. Do you have a strong vision of who you are and
          what you want, or are you always conflicted? That’s integration.
          Another lens is Internal Family Systems (IFS) which posits that your
          conscious experience and behavior is affected by versions of your self
          that were stamped into your subconscious at important or traumatic
          times in your life and that you can reintegrate these mini-”you”s
          through compassion and curiosity. Until you do so, you live a life
          conflicted.
        </p>
        <p>
          Agency is your sense of how much you believe you can bend reality to
          your will, that you can make the things you want to make happen,
          happen.
        </p>
        <p>
          Femininity is directly proportional to how much your behavior
          sacrifices your self-interest for the benefit of others. Fairly
          straightforward, I think, although I acknowledge as a straight dude I
          may be under-thinking the traditionally female half of this theory.
        </p>
        <p>Here’s the same graph with some examples:</p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/2x2-2.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            The incel-soldier axis is real
          </figcaption>
        </figure>
        <p>
          Keep in mind that masculinity and femininity are measured by an
          observer and their assessment is bound by the limitations of their
          knowledge. You may view a role you take on as low self-interest but
          others may perceive you to be self-interested.
        </p>
        <p>
          The point of this framework is to get you to understand that it’s okay
          for men to be feminine, it’s good, even. You may also notice that
          aesthetics is missing from this discussion, “isn’t being super into
          makeup and nails feminine?” you may ask. And I’m here to tell you that
          being confidently into makeup and nails, so much so that you open a
          business or develop a world-class proficiency at it, is masculine as
          hell. This applies regardless of society’s present view on any
          particular interest: wearing flowy clothing, Lego, books, working out,
          internet memes, etc. Any interest is masculine if you engage in it
          without shame.
        </p>
        <p>
          All the quadrants are good in their own way except for the bottom left
          quadrant: low femininity and low masculinity. When we find ourselves
          here it’s a sign we have room to grow. It’s where we’re born, after
          all.
        </p>
      </section>
      <section className="space-y-10">
        <h2 className="text-2xl font-bold">
          Falling (Back) in Love with Women
        </h2>
        <p>
          Most straight guys don’t even like women. It’s likely they don’t even
          realize it because they don’t know what the alternative to the current
          dynamics are. I can’t blame them because society is almost structured
          specifically to make men and women hate each other. Most straight
          women don’t even like guys either. For women it’s the fear of being
          physically hurt or murdered, pressured into doing something they don’t
          want to do, or lied to in infinite possible ways. For guys it’s the
          cycle of desperation, confusion, and rejection.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/how-to-be-good-at-sex-guide-for-straight-men/shes-my-friend.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            Gigachad responds to someone adrift
          </figcaption>
        </figure>
        <p>
          Our ancestors used to have to deal with dangerous fauna: lions,
          tigers, bears. Today we have to deal with dangerous psychofauna.
          Disinformation cycles amplified by recommendation algorithms,
          propaganda funded by billionaires, and dating apps, for example. You
          feel lonely or you want to pursue a long-term relationship and 80% of
          people your age meet their partners online so you download Tinder. The
          psychofauna has fixed its eyes on you.
        </p>
        <p>
          You match with a few women (if you’re lucky), some of whom you really
          like and enjoy a short text interaction with. You naturally fill up
          with hope that maybe you’ve found someone who could be the one, an
          image of the two of you buying your first home together flashes in
          your mind. You’re pushing a baby stroller down a beautiful suburban
          neighborhood. But her texts start getting shorter and ultimately stop
          coming altogether. You have no way of knowing but you offered to go to
          an Indian place but she really doesn’t like spicy food so she took
          someone else’s offer to get burgers and she didn’t know how to let you
          down gently and she’s gonna be too shy to reach out after being so
          avoidant. The psychofauna has devoured your legs.
        </p>
        <p>
          I’m here to tell you that this really sucks and it’s ok if it really
          hurts. It’s a critical emotional hit every time it happens. But our
          reaction to this kind of situation is even worse: we say to ourselves
          “they have no obligation to us, I’m the idiot for even expecting
          anything from this situation. Buying a house together? Kids? Immature
          fantasies of a deluded mind, I didn’t even know this person. I’m being
          cringe.” The psychofauna is digesting you and seeking the next prey.
        </p>
        <p>
          Your fantasies about being with that girl were your childlike hope
          guiding you to love and you should listen to it more, not less — but
          only when the dynamics aren’t completely fucked, which they absolutely
          are on Tinder. It’s so fucked that getting ghosted early is actually
          the best case scenario, imagine actually going on a date and hooking
          up.
        </p>
        <p>
          First of all: hookups make zero sense. Good sex can be a
          transcendental experience but it takes an emotional bond and knowledge
          of each other’s bodies — the areas, pressures, rhythms, and angles
          that work for each of you — that’s discovered through months of honest
          communication. You’re absolutely not gonna get that from a hookup.
          There are a subset of people that claim hookups are fine but my guess
          is these people either don’t know how good sex can be or the void in
          their heart is so painful that even a distraction for a night is good
          enough to make this cycle worth it.
        </p>
        <p>
          And the reason we pursue hookups in the first place is we feel some
          emotion inside of us, usually boredom or loneliness, that we want to
          get rid of. But by the end of the hookup we feel even worse than we
          started and ironically we’ll be back on the apps in no time looking
          for another hookup to counter this even stronger loneliness. Tinder
          doesn’t improve its bottom line by getting you a successful
          relationship, it improves its bottom line by getting you to think
          Tinder Gold is worth it.
        </p>
        <p>
          It’s way more fun to complain about the way things are than to give
          you solutions to this problem, and the entire framework I offer you is
          basically: “stop hating yourself so you can love others and everything
          will sort itself out between you two.” so I’m gonna be light on advice
          but here I can be concrete: the only winning move is to not play, you
          need to get off the apps. Don’t worry: you’re not sacrificing
          anything. You’re gaining a life free of an endless stream of emotional
          nukes targeted at your heart.
        </p>
      </section>
      <section className="space-y-10">
        <h2 className="text-2xl font-bold">So you’ve figured yourself out</h2>
        <p>
          All the stuff other people torture themselves with: “am I texting too
          much? Am I not texting enough? Do I seem like a loser if my schedule
          is too flexible? Should I pretend I need to check my calendar before
          scheduling the next date even though I’m madly in love with this girl?
          Should I use a fake birthday so she thinks our signs are compatible?”
          now seem like nonsense. You’re awesome so your love for your girl is
          awesome, it doesn’t need to be molded or put through the filter of
          dating mind games. You’ve come home to yourself and you, in some
          mystical sense, have become a force of nature.
        </p>
      </section>
      <RecordEventOnMount event={analyticsEvent} />
    </article>
  );
}

const analyticsEvent = {
  eventType: "view:blog:how-to-have-good-sex-guide-for-straight-men",
} as const satisfies AnalyticsEvent;
