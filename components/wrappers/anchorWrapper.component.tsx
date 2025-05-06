import { FunctionComponent, useContext } from "react";
import { ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";
import { BaseUrlContext } from "../../pages/_app";

export interface IDocumentationLinkProps extends ComponentsWithoutNodeOptions {
    href: string;
    title?: string;
}

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const AnchorWrapper: FunctionComponent<IDocumentationLinkProps> = (props) => {
    if (!props.href) {
        return <a {...props}></a>;
    }
    const isInternal = !props.href.startsWith("http") || props.href.startsWith("https://doc.babylonjs.com/");
    if (!isInternal) {
        return <a rel="noopener" target="_blank" {...props}></a>;
    } else {
        const isRelative = props.href.startsWith(".");
        const baseUrl = useContext(BaseUrlContext);
        const href = props.href.replace(".html", "").replace("globals", "");
        return <a {...props} href={(isRelative ? "" : baseUrl) + href}></a>;
    }
};
