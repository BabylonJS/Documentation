import { FunctionComponent } from "react";
import { ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";

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
    const isInternal = !props.href.startsWith("http") || props.href.indexOf("//doc.babylonjs.com") !== -1;
    if (!isInternal) {
        return <a rel="noopener" target="_blank" {...props}></a>;
    } else {
        const href = props.href.replace('.html', '').replace('globals', '');
        return <a {...props} href={href}></a>;
    }
};
