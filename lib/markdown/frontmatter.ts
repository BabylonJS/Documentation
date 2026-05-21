import matter from "gray-matter";

export const parseMarkdownFrontmatter = (markdownWithFrontmatter: string) => {
    const { content, data: frontmatter } = matter(markdownWithFrontmatter);

    return {
        content,
        frontmatter,
    };
};
