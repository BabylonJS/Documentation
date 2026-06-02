import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import { parseMarkdownFrontmatter } from "./frontmatter";
import { getMarkdownPlugins } from "./plugins";

export const compileMarkdown = async (content: string): Promise<MDXRemoteSerializeResult> => {
    const { serialize } = await import("next-mdx-remote/serialize");
    const { remarkPlugins, rehypePlugins } = await getMarkdownPlugins();

    return serialize(content, {
        mdxOptions: {
            remarkPlugins,
            rehypePlugins,
        },
    });
};

export const compileMarkdownWithFrontmatter = async (markdownWithFrontmatter: string) => {
    const { content, frontmatter } = parseMarkdownFrontmatter(markdownWithFrontmatter);
    const mdxContent = await compileMarkdown(content);

    return {
        mdxContent,
        compiledSource: mdxContent.compiledSource,
        frontmatter,
    };
};
