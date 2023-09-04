import { serialize } from "next-mdx-remote/serialize";
import { promises as fs } from "fs";
import Client from "./client.jsx";
import path from "path";

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

export default async function TheBox() {
  const postFilenames = await getAllPostFilenames();

  const posts = await Promise.all(
    postFilenames.map(async (filename) => {
      return await getPost(filename);
    })
  );

  const sortedPosts = sortPostsByDate(posts);

  return <Client posts={sortedPosts} />;
}
