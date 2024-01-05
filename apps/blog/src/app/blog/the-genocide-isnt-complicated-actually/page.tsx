import { Article } from "@/components/custom/Blog";
import { Blink } from "@/components/custom/ExternalInlineLink";
import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: BLOG_POSTS["the-genocide-isnt-complicated-actually"].title,
  description:
    "An essay on how the Palestinian people can achieve peace within the next 10 years.",
  openGraph: {
    title: BLOG_POSTS["the-genocide-isnt-complicated-actually"].title,
    description:
      "An essay on how the Palestinian people can achieve peace within the next 10 years.",
    url: "https://anveio.com",
    siteName: "Anveio",
    images: [
      {
        url: "https://anveio.com/blog-assets/the-genocide-isnt-complicated-actually/opengraph.png",
        width: 871,
        height: 408,
      },
      {
        url: "https://anveio.com/blog-assets/the-genocide-isnt-complicated-actually/1953.webp",
        width: 800,
        height: 555,
        alt: "",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://anveio.com"),
};

export default function Post() {
  return (
    <Article>
      <div className="space-y-3">
        <p className="italic text-center">
          Published{" "}
          {formatDateWithSuffix(
            BLOG_POSTS["the-genocide-isnt-complicated-actually"].publishedAt
          )}
        </p>
        <h1 className="text-center text-2xl font-semibold">
          {BLOG_POSTS["the-genocide-isnt-complicated-actually"].title}
        </h1>
        <Image
          alt="Decorative box art of an imaginary RPG game"
          src={"/blog-assets/the-genocide-isnt-complicated-actually/cover.webp"}
          className="blog-post-cover-image"
          width={896}
          height={896}
          priority
        />
        <p className="italic text-center">
          Hamas is bad. But not just because they're a religious fundamentalist
          terror group. It's because they make a non-violent end to Israel's
          genocide in Gaza impossible so long as they exist.
        </p>
      </div>
      <section className="space-y-12">
        <h2 className="text-2xl font-bold">A blueprint for peace</h2>
        <p>
          <span className="inline leading-[0] font-bold bg-gradient-to-br bg-clip-text text-transparent from-[#FFFF92] to-[#EE8912]">
            Dawn April 10, 1971:
          </span>{" "}
          The sun rises on millions of Bengalis living in Dhaka, the capital of
          Bangladesh. The army of West Pakistan has just seized control of the
          city after a brutal 16 day campaign that had killed between 300,000
          and 3 million Bengali people and displaced up to 30 million more -- 10
          million fled to India. Operation Searchlight was its name, and those
          who fled were the lucky ones. My family stayed.
        </p>
        <p>
          If you were in Dhaka that morning watching West Pakistan's tanks roll
          through the city streets you'd be justified in thinking the battle for
          Bangladesh's independence was lost and that its people were doomed to
          another 30 years of subjugation and exploitation. But, mere months
          from then, Bangladesh would actually win and become a globally
          recognized independent state and the forces of West Pakistan would
          surrender to India and leave the country, never to return. The events
          leading up to this genocide and the events leading to the defeat of
          its perpetrators are a blueprint for how the Palestinian people can
          escape their current situation.
        </p>
        <p>
          How? Non-violent protests, a revolutionary election, the political
          will to declare independence, and a millions-strong general strike are
          how Bangladesh got from vassal state to tenuous independence. Western
          support for the perpetrators evaporating in light of media coverage of
          the atrocity, military support from regional powers for the victims,
          and just enough resistance fighting to stay alive are how it got from
          foreign tanks in the capital to globally recognized statehood.
        </p>
        <p>
          None of this requires impotent screaming at Biden to suddenly start
          doing the right thing or praying that the Israeli government sees the
          error of their ways or other similar magical thinking. History has
          taught us there is a path out from oppression and it's up to the
          Palestinian people to carve it.
        </p>
        <p>Listen:</p>
      </section>
      <section className="space-y-12">
        <h2 className="text-2xl font-bold">
          Genocide is always{" "}
          <span className="inline leading-[0] bg-gradient-to-br bg-clip-text text-transparent from-[#b6f492] to-[#338b93]">
            "complicated"
          </span>
        </h2>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/the-genocide-isnt-complicated-actually/gazipur.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            Days before the Operation Searchlight began, Bangladesh police
            refused orders from the West Pakistan government to fire on student
            protestors outside of Gazipur Ordnance Factory. West Pakistan's
            response: "Fine, I'll do it myself."
          </figcaption>
        </figure>
        <p>
          In 2015 I traveled to my birthplace of Khulna, the second largest city
          in Bangladesh, and wandered the streets searching for book vendors. On
          the plane over I had learned from my grandfather stories from his
          perspective on Bangladesh's war for independence and I was enchanted:
          I hadn't even known there was one. At that time the Wikipedia page for
          the war was just a few paragraphs long. I was convinced the real story
          of what happened in 1971 could only be found here, in Bangladesh,
          through the oral tradition of those who had lived through it and from
          the small percentage of Bengalis who could read and write and
          therefore tell their stories.
        </p>
        <p>
          I squeezed through dark and dingy hallways in Khulna's New Market
          (it's been called "New" for the last 20 years) to get into one book
          store. The owner aggressively tried to sell me every book he had in
          stock and had the vibe of a salesman who hadn't seen a customer in
          days. Partially out of pity but also because he was massively
          undercharging, I must have bought at least 30 books. If you ask
          ChatGPT about Operation Searchlight it's quite light on details
          because it obviously never ingested the millions of tokens that I
          bought for about $20 that day.
        </p>
        <p>
          The books are written in charmingly poor English. There's lovely poems
          about a village baobab tree metaphorically cut during its youth, a
          beloved goat kept as a pet found slaughtered after its owner came out
          of hiding from the invading forces. There's also more serious but
          equally heartfelt accounts of parents searching for lost children and
          students losing their college sweethearts when West Pakistani tanks
          rolled onto university campuses (they targeted the intelligentsia
          first).
        </p>

        <p>
          The sense you come away with reading these books is that people were
          primarily <span className="italic">confused</span>. Most of the people
          in the country were farmers living in the wilderness in literal mud
          huts. The politically active who had organized against West Pakistan
          and understood how they had been orchestrating mass starvation in
          Bangladesh by stealing the country's harvest had no idea that this
          degree of brutal retaliation was even possible, and news traveled too
          slowly back then for them to be able to effectively prepare.
        </p>
        <p>
          There's "complications" in these stories too. The Bihari people of
          Bangladesh were loyal to West Pakistan, for reasons, and formed
          militias to aid invading forces against Bangladesh's Mukti Bahini
          resistance group. Suspicion between countrymen and countrywomen were
          abound and discrimination and preemptive killing of innocent civilians
          certainly happened if these accounts are to be believed. It's been
          confirmed that Richard Nixon had to change his underwear after reading
          a report that <span className="italic">three</span> different types of
          brown people were killing each other. "Triple the efficiency!" he
          moaned. Just kidding, the sick fuck probably never changed his
          underwear.
        </p>
        <figure className="py-16 space-y-4">
          <blockquote
            className={`text-2xl text-center font-semibold before:content-['“'] after:content-['”']`}
          >
            Kill 3 million of them and the rest will eat out of our hands
          </blockquote>
          <figcaption className="text-center text-xl italic">
            {" "}
            - Yahya Khan, President of West Pakistan, 22 February 1971
          </figcaption>
        </figure>

        <p>
          And prior to Kristallnacht a communist did indeed start a fire in the
          Reichstag, and before the trail of tears Native Americans did indeed
          scalp American colonists, and in Palestine Hamas did murder innocent
          festival goers.
        </p>
        <p>
          My therapist once told me about something narcissists do, called
          "leveling". He told me narcissists make a strategy out of treating
          their abuse as equal to the slights against them. "Sure I cheated on
          you, but I had to! You're never around!". This equalizing of the
          severity of bad deeds only benefits the party willing to do more harm,
          he said.
        </p>
        <p>
          On a large enough scale, you can find examples of victims behaving
          badly if you go looking for them. But the morally responsible thing to
          do is to look at the totality of the violence and determine who's
          really hurting. And dear reader when it comes to genocide, if you're
          honest about it, it's never hard to tell.
        </p>
        <p>
          But enough about figuring out who the bad guys are, that's obvious to
          anyone not plagued by motivated reasoning. How do we bring an end to
          the suffering? The conflict between Israel and Palestine is commonly
          treated as a joke stand-in for some impossible-to-resolve situation
          but after following the situation for the past 15 years it's one of
          those rare things that gets <span className="italic">simpler</span>{" "}
          the more you learn about it, at least morally, in much the same way
          you can skip reading every pamphlet from the American colonists
          describing the savagery of the Native Americans before deciding the
          colonists were in the wrong.
        </p>
        <p>
          The rest of the world thinks it needs to solve Palestinians' problems
          for them but when you adopt the lens that this is their problem to
          solve, the solution becomes clear and there's several blueprints to
          follow. Here's one:
        </p>
        <figure className="flex flex-col justify-center items-center">
          <Image
            src={
              "/blog-assets/the-genocide-isnt-complicated-actually/girlsmarch.webp"
            }
            alt=""
            width={600}
            height={600}
          />
          <figcaption className="text-sm text-center py-8">
            Students preparing to resist West Pakistan, 1970
          </figcaption>
        </figure>
      </section>
      <section className="space-y-12">
        <h2 className="text-xl font-bold"></h2>
      </section>
      <section className="space-y-12">
        <h2 className="text-2xl font-bold">
          Palestine doesn't need Hamas.{" "}
          <span className="bg-clip-text font-extrabold text-transparent green-gradient">
            It needs Gandhi.
          </span>
        </h2>
        <p>
          Or Sheikh Rahman (more on him later). The independence of Bangladesh
          was achieved through the most peaceful and well-executed non-violent
          protest, election, and general strike in human history. And it
          followed the model established by Gandhi.
        </p>
        <p className="italic">
          <span className="font-semibold">
            TL;DR for this section (but read the whole thing if you want to
            learn about the milestones in Bangladesh's unlikely path to
            independence and see some parallels to the situation in Gaza)
          </span>
          : Bangladesh achieved independence through decades of non-violent
          protest. Gandhi had proven that protesting is a checkmate: either give
          in to the demands of the protestors and lose control now or crush it
          violently and lose control a bit later. These protests sparked the
          creation of a united political party to fight for independence and
          that party won in a landslide election and a declaration of
          independence soon followed which triggered West Pakistan's genocide.
          Their brutality against Bangladesh's peaceful protests was not
          un-noticed by the rest of the world either, which is a fact that would
          be instrumental in Bangladesh's victory during Operation Searchlight.
        </p>
        <p>
          In 1949, Bangladesh wasn't a country. It was a remarkably fertile bit
          of land about the size of Illinois known colloquially as Bangal and
          inhabited by tens of millions of decentralized farmers with little
          else going on. The British (of course it's them) came and "civilized"
          the area. They established a government and, when they decolonized,
          gifted it to West Pakistan (now known as just Pakistan). West Pakistan
          treated Bangladesh as its bread basket. It exercised its military and
          political strength gained from being a vassal of the British
          government to force food and wealth to be exported to Pakistan,
          leading to the deaths of at least several hundred thousand people from
          starvation. I guess West Pakistan also picked up some tips from their
          colonizer's treatment of the Irish.
        </p>

        <p>
          In 1952 police under Pakistan authority fired on thousands of students
          making a humble demand: recognition of Bangladesh's native language by
          West Pakistan. Many students died that day, which laid the seeds for a
          political party led by the surviving students to later take power.
        </p>
        <p>
          By 1970, it had been quite a few iterations of this cycle of
          exploitation, protest, and beatdown. Things were bad enough that there
          was only one political idea that now mattered: independence. So the
          people of Bangladesh used the tools the British unknowingly provided
          them to flip the script on West Pakistan in a way no one expected.
          See, the British had set up a single government for both countries and
          allocated seats according to each country's population. Bangladesh was
          far more populous and was allocated 162 seats -- ostensibly fair --
          but had failed to assemble a unified coalition to stand against the
          138 seats of West Pakistan, likely due to a rigged system, election
          meddling, and West Pakistan's superior political experience.
        </p>
        <p>
          That year, Bengali people voted overwhelmingly for the Awami League
          who promised independence above all else, and they proceeded to seize
          160 of the 162 seats. Awami almost immediately, led by a charmingly
          nerdy fellow named Sheikh Rahman, sued for independence via a document
          called the{" "}
          <Blink href="https://en.wikipedia.org/wiki/Six_point_movement">
            Six Points
          </Blink>
          . West Pakistan responded by pretending the election didn't happen,
          that the Six Points didn't exist, and refused to transfer power to
          Sheikh Rahman and the Awami League.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/the-genocide-isnt-complicated-actually/situation-report.webp"
            }
            alt="Memo from England's ambassador to West Pakistan to England: 'We now have a fuller account of Sheikh Mujibur Rahman's speech in Dacca on 7 March. We still do not have a text. But it is clear that Mujib has set 5 conditions for his participation in the Assembly Meeting proposed by President Yahya Khan for 25 March. The conditions are: 1. Widthdrawal of all troops to barracks 2. No furrther firing on civilians; 3. No further military reinforcement from West Pakistan; 4. No military interference in the working of Bangla Desh Government; 5. Maintenance of law and order to be left exclusively to the Police and Bengali Rifles (East Pakistanis) (A press report mentions also assistancy by Awami League Volunteers)."
            width={800}
            height={1200}
          />
          <figcaption className="text-sm text-center">
            England's ambassador in West Pakistan describing Sheikh Rahman's
            demands.
          </figcaption>
        </figure>
        <p>
          Simply refusing to recognize the winners of an election is certainly A
          Strategy, but Sheikh Rahman wasn't putting up with any of it. He
          called for a nationwide general strike (more specifically, the Awami
          League straight up made it illegal to work. Based.)
        </p>
        <p>
          Shortly after, the{" "}
          <Blink href={"https://en.wikipedia.org/wiki/1970_Bhola_cyclone"}>
            1970 Bhola Cyclone
          </Blink>{" "}
          hit Bangladesh, killing at least 300,000 people. West Pakistan passive
          aggressively chose to do basically nothing to help in the relief
          efforts of the disaster. A Reagan-esque "if they all die maybe we
          don't have to worry about them" strategy. It didn't work and the
          Bengali people just got angrier.
        </p>
        <p>
          Tensions were high as the country basically just elected independence
          but the tyrants in power weren't letting go, and protests were
          breaking out everywhere. One protest in particular, at the Gazipur
          Ordnance Factory, showed Pakistan that they couldn't rely on political
          influence and the status quo to remain in power, they'd have to get
          involved directly and with overwhelming force. They ordered the
          Bengali police at the factory to shoot protestors but this time,
          unlike in 1952, the police didn't listen. They joined the protestors
          instead.
        </p>
        <p>
          And so days later, Operation Searchlight began. But I expect most of
          you at this point are thinking "enough backstory about your shitty
          little country, how does this relate to the situation in Palestine?"
          Well notice that up until this point Bangladesh is actually winning
          the war: every action West Pakistan had been taking since the student
          revolt in 1952 made them lose their iron grip over Bangladesh just a
          bit more. The brutality became more obvious and more unbearable with
          each crushed protest, with every dead student, with every starving
          farmer.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/the-genocide-isnt-complicated-actually/dominos.webp"
            }
            alt="Palestinian Authority is ruled by coalition promising independence through strict non-violence -> Israel crushes protests with violence -> US ends unconditional support for Israel -> Israel retreats under thread of a regional power -> An independent Palestine"
            width={800}
            height={535}
          />
          <figcaption className="text-sm text-center">
            If we play our cards right.
          </figcaption>
        </figure>
      </section>
      <section className="space-y-12">
        <h2 className="text-2xl font-bold">A post-Hamas path to peace</h2>
        <p>
          Bangladesh's victory in Operation Searchlight isn't complicated
          either. West Pakistan's brutality during the military campaign was
          motivated by the fact that they could not afford a protracted
          resistance and they hoped to pacify it within months. But Bangladesh
          had gained the sympathy of the world and especially India, the major
          power in the region. India was supplying the resistance and Pakistan,
          in a panic, attacked India in early December 1971. They
          unconditionally surrendered to India about a week later. The United
          States continued to provide support for West Pakistan throughout the
          operation but this soon became a politically untenable position and
          they halted their military alliance with West Pakistan and recognized
          Bangladesh as an independent country shortly after.
        </p>
        <div className="space-y-6">
          <p>Establishing a few axioms about the situation in Palestine:</p>
          <ol className="list-disc space-y-4">
            <li className="list-item">
              <div>
                <h3 className="text-xl font-semibold">
                  Non-violence is a winning strategy.
                </h3>
                <p>
                  There are examples, of course, of violent revolution working
                  throughout history but a lot more needs to go right and it's
                  not feasible when the disparity in military strength is
                  overwhelming.
                </p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <h3 className="text-xl font-semibold">
                  Hamas stands zero chance of military victory against Israel.
                </h3>
                <p>
                  They need to go. Priority-zero when enacting non-violence is
                  is managing optics and Hamas is optically radioactive (for
                  good reason). Even if they were to continue to exist but
                  change their strategy the name itself would guarantee failure
                  but more broadly the Palestinian people need to rebrand this
                  conflict entirely and shed any ties to Hamas. The polling
                  around support for Hamas amonst Gazans is unreliable and
                  spotty but I predict whatever support exists for Hamas, even
                  if the majority of Palestinians strongly support them (which
                  it's not clear that they do), will drop rapidly if a
                  reasonable alternative to victory is available.
                </p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <h3 className="text-xl font-semibold">
                  Israel is incapable of continuing the genocide without backing
                  from the United States.
                </h3>
                <p>
                  Ending the US's support for Israel is the most critical
                  milestone in achieving peace in Palestine. Without its support
                  regional powers like Egypt, Turkey, and Iran (I don't like
                  them either but they can be useful for something) can do their
                  job of maintaining a balance of power in the region. US
                  support is giving Israel cheat codes to break the rules of
                  geopolitics.
                </p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <h3 className="text-xl font-semibold">
                  Popular support for Israel in the United States can end.
                </h3>
                <p>
                  This one requires a bit more punditry around the data on my
                  part but hear me out. Take a look at a poll from the Brookings
                  institute measuring Americans' sentiment towards Israel and
                  Palestine a few months before the war began and 2 weeks into
                  the war.
                </p>
                <div className="py-8 flex justify-center">
                  <figure>
                    <Image
                      src={
                        "/blog-assets/the-genocide-isnt-complicated-actually/poll.png"
                      }
                      alt=""
                      width={800}
                      height={711}
                    />
                    <figcaption className="text-sm text-center py-4">
                      Most of the support went to Israel but support for
                      Palestine saw a small bump.
                    </figcaption>
                  </figure>
                </div>
                <p>
                  Events like Hamas' terrorist attack on Israel should
                  historically draw universal rallying around the victim but I'd
                  say a change in support from 25.4% to 42.9% in the wake of
                  such an attack can best be described as{" "}
                  <span className="italic">muted.</span> As the suffering of the
                  Palestinian people gets airtime in American media, history and
                  humanity have shown that support for the perpretators of the
                  suffering will drop precipitously.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl">A timeline for Palestine's independence</h3>
          <ol className="list-disc space-y-4">
            <li className="list-item">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  April 2024 - Hamas surrenders and the current war ends.
                </h3>
                <p>
                  After running out of supplies and an effective scorched earth
                  campaign from a US-backed Israel, the remaining members of
                  Hamas are either captured, flee to sympathetic countries, or
                  surrender. The Palestinian Authority announce new elections.
                </p>
                <p>
                  About 100,000 Palestinians have died at this point and support
                  for Israel among Americans has dropped to a level prior to the
                  start of the war, with about 20% leaning towards Israel, 20%
                  leaning towards Palestine, and the remaining leaning towards
                  neither side. This is fertile ground for an effectively
                  managed non-violent campaign by Palestine to make the US'
                  current stance of unconditional support of Israel politically
                  untenable.
                </p>
              </div>
            </li>
            <li className="list-item">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  June 2024 - A political party seeking independence through
                  non-violence gains almost complete control of the Palestinian
                  Authority.
                </h3>
                <p>
                  They promise that every new construction project by Israeli
                  settlers will be resisted even if it means dead protestors.
                  They're able to effectively sell this idea because it
                  checkmates Israel: either the expansion ends or Israel crushes
                  them violently which accelerates the timeline for the US
                  ending their unconditional support. Either way, the protests
                  themselves are an optical win.
                </p>
                <p>
                  They demand the removal of all IDF forces from Gaza and the
                  West Bank contingent on continued non-violence from Palestine.
                  They aggressively rebrand any violence from latent terrorists
                  residing within the country as foreign intervention and likely
                  funded by Israel itself to build support for its expansion
                  efforts (it's easy, just point to Netanyahu supporting Hamas
                  and describing the need for Hamas' existence to give Israel
                  cassus belli.)
                </p>
              </div>
            </li>
            <li className="list-item">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  February 2025 - US State Department imposes key conditions on
                  its support of Israel.
                </h3>
                <p>
                  The obvious lesson for any president to learn from Biden's
                  massive drop in support after the October attack is that
                  there's no way to win politically when conflict arises between
                  Israel and Palestine. For decades, US presidents have had to
                  endure the insufferable Netanyahu's whims in the region and
                  the next president (hopefully Biden) will be looking for ways
                  to reverse the dynamic of Israel leading the US by the nose.
                </p>
                <p>
                  By this point the bad press for Israel following their
                  response to Palestine's protests will have tipped the scales
                  for the American people with more supporting Palestine than
                  Israel.
                </p>
                <p>
                  The key conditions that would maintain American interests in
                  the region but decrease Israel's uncontested ability to do
                  whatever it likes are: US provides equal financial support for
                  Palestine while the non-violent regime is in power and and
                  continues to be non-violent, US commits to rebuilding
                  Palestine's infrastructure and economy after the war, US
                  strengthens ties to regional powers that aren't hostile to the
                  US like Turkey and Egypt. The US keeps its defensive alliance
                  with Israel but does not promise any support for IDF forces
                  attacked outside the borders of Israel itself.
                </p>
              </div>
            </li>
            <li className="list-item">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  December 2025 - Palestine joins a regional defensive pact in
                  the Middle-East, invites Israel to it, and campaigns for
                  global recognition of Palestine as a sovereign state.
                </h3>
                <p>
                  The funny thing about the Palestinians is they overwhelmingly
                  don't favor a one-state solution but even fewer support a two
                  state solution. The ideally want all the land annexed by
                  Israel back but that's almost certainly not possible without
                  more violence.
                </p>
                <p>
                  Israel now needs to play by the rules of regional geopolitics
                  and any incursion into Palestine is impossible at this point.
                  They have no choice but to accept the invite into the
                  defensive pact and operate as a normal nation playing by
                  normal rules. There's peace in the region and the fledgling
                  soveriegn nation of Palestine can begin rebuilding and
                  honoring the sacrifice of those who died fighting for it.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <section className="space-y-12">
        <h2 className="text-2xl font-bold">There's hope</h2>
        <p>
          It's not anti-semitic to be critical of Israel's treatment of
          Palestinians. I grew up in a majority Jewish community in Long Island
          where so many of my classmates went to Hebrew school I asked my
          parents why I wasn't enrolled too. Jewish peoples' opinions on
          Israel's behavior are as varied as any other demographic's and it's
          anti-semitic to treat them as a monolithic block. Many of the pro-war
          Zionists are not jewish either and are hawkish for their own reasons.
        </p>
        <p>
          What we can expect during the war between Israel and Palestine is
          increasing attempts to control the media narrative in order to keep
          support for Israel among Americans high. This will include labelling
          Jewish people who don't support Israel as "not real" Jews, spreading
          uncertainty about strikes that result in large amounts of civilian
          casualties, and attempts to appear humane to Palestinian civilians but
          whos real purpose is to propagandize to American viewers.
        </p>
        <p>
          I don't think it will work. Humanity's capacity to feel empathy for
          victims of oppression has a pretty strong track record and I want to
          believe that the example set by the brave men and women in Bangladesh
          from the 1950s to 1970 can be followed by others in similarly dire
          situations. These things have humble beginnings but glorious, peaceful
          ends.
        </p>
        <figure className="flex flex-col justify-center items-center py-8">
          <Image
            src={
              "/blog-assets/the-genocide-isnt-complicated-actually/1953.webp"
            }
            alt=""
            width={800}
            height={800}
          />
          <figcaption className="text-sm text-center py-4">
            Students marching for the recognition of Bangla as an official
            language, 21 February 1953.
          </figcaption>
        </figure>
      </section>
      <RecordEventOnMount event={analyticsEvent} />
    </Article>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:blog:the-genocide-isnt-complicated-actually",
} as const;
