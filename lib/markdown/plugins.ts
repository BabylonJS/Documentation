export const getMarkdownPlugins = async () => {
    const rehypeSlug = (await import("rehype-slug")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    const remarkMath = (await import("remark-math")).default;
    const rehypeKatex = (await import("rehype-katex")).default;

    return {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeSlug, rehypeKatex],
    };
};
