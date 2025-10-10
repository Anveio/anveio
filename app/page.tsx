import Link from "next/link"
import { formatDate, getAllPosts } from "@/lib/posts"

export const dynamic = "force-dynamic"

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <main>
      <section id="about">
        <p>
          I'm Shovon Hasan, an engineer at AWS EC2 focused on keeping large fleets
          available and unexciting. My favorite problems live at the intersection of
          humans, process, and systems.
        </p>
        <p>
          This site collects the essays, notes, and field reports that help me make sense of
          the infrastructure we depend on every day.
        </p>
        <ul className="inline-list">
          <li>
            <a href="mailto:shovon@hey.com">Email</a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/shovonhasan"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/shovon"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>

      <section id="writing">
        <h2>Writing</h2>
        <p>Observations on reliability, operational calm, and teams that scale with grace.</p>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.summary}</p>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
