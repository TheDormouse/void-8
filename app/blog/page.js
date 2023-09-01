import { serialize } from "next-mdx-remote/serialize";
import { promises as fs } from "fs";
import { MdxContent } from "./mdx-content";
import { View, Common } from "../client/View";
import Box from "../Box";
import { Sound } from "../Sound";
import space from "../sounds/SF-bkg-space-loop-1.wav";
import { view } from "../index.module.css";

import path from "path";
import Link from "next/link";
import Image from "next/image";
import profilepicture from "./Subject.png";

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

  const sidebarStyles = {
    position: "fixed",
    right: "50px", // Adjust this value for the desired padding
    top: "50%",
    transform: "translateY(-50%)",
    border: "1px solid white",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "center",
    color: "white",
    width: "200px",
  };

  return (
    <>
      <Link href="/">
        <div
          style={{ position: "absolute", top: 10, left: 10, cursor: "pointer" }}
        >
          ← HOME
        </div>
      </Link>

      <View className={view}>
        <Box position={[0, 0, 0]} />
        <Sound url={space} />
        <Common />
      </View>

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
      <div style={sidebarStyles}>
        <Image src={profilepicture} width={100} height={100} />
        <h3>Marchy&apos;s Blog</h3>
        <p>Welcome to my incoherent ramblings. Enjoy</p>
      </div>
    </>
  );
}
