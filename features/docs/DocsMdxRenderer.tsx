import { FunctionComponent } from "react";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { markdownComponents } from "../../components/markdownComponents/markdownComponents";

export const DocsMdxRenderer: FunctionComponent<{ mdxContent?: MDXRemoteSerializeResult }> = ({ mdxContent }) => {
    return mdxContent ? <MDXRemote {...(mdxContent as any)} components={markdownComponents as any} /> : null;
};
