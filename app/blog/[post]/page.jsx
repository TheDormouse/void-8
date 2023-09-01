import { serialize } from "next-mdx-remote/serialize";
import { promises as fs } from "fs";
import { MdxContent } from "../mdx-content";

async function getPost(filepath) {
  // Read the file from the filesystem
  const raw = await fs.readFile(filepath, "utf-8");

  // Serialize the MDX content and parse the frontmatter
  const serialized = await serialize(raw, {
    parseFrontmatter: true,
  });

  // Typecast the frontmatter to the correct type
  const frontmatter = serialized.frontmatter;

  // Return the serialized content and frontmatter
  return {
    frontmatter,
    serialized,
  };
}

export default async function Home({ params }) {
  const { post } = params;
  // Get the serialized content and frontmatter
  const { serialized, frontmatter } = await getPost(`./posts/${post}.mdx`);

  return (
    <div style={{ maxWidth: 600, margin: "auto", color: "white" }}>
      <h1>{frontmatter.title}</h1>
      <p>Blog {frontmatter.date}</p>
      <hr />
      <MdxContent source={serialized} />
    </div>
  );
}
