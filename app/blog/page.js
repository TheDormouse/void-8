import { serialize } from "next-mdx-remote/serialize";
import { promises as fs } from "fs";
import { MdxContent } from "./mdx-content";

import path from "path";
import Link from "next/link";

async function getAllPostFilenames() {
  // Get all MDX files from the posts directory
  const postsDir = path.join(process.cwd(), "./posts");
  const filenames = await fs.readdir(postsDir);
  return filenames.map((filename) => filename.replace(".mdx", ""));
}

async function getPost(filepath) {
  // Read the file from the filesystem
  const raw = await fs.readFile(`./posts/${filepath}.mdx`, "utf-8");

  // Serialize the MDX content and parse the frontmatter
  const serialized = await serialize(raw, {
    parseFrontmatter: true,
  });

  // Typecast the frontmatter to the correct type
  let frontmatter = serialized.frontmatter;
  frontmatter.slug = filepath;

  // Return the serialized content and frontmatter
  return {
    frontmatter,
    serialized,
  };
}

function sortPostsByDate(posts) {
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB - dateA; // Sort from newest to oldest
  });
}

export default async function PostsPage() {
  const postFilenames = await getAllPostFilenames();

  const posts = await Promise.all(
    postFilenames.map(async (filename) => {
      return await getPost(filename);
    })
  );

  const sortedPosts = sortPostsByDate(posts);

  return (
    <div style={{ maxWidth: 600, margin: "auto", color: "white" }}>
      {sortedPosts.map((post, index) => (
        <div key={index}>
          <Link href={`/blog/${post.frontmatter.slug}`}>
            <h1>{post.frontmatter.title}</h1>
          </Link>
          <p>Posted: {post.frontmatter.date}</p>
          <hr />
          <MdxContent source={post.serialized} />
        </div>
      ))}
    </div>
  );
}
