import { Plugin, Processor } from "unified";
import visit from "unist-util-visit";
import { Node } from "unist";

import { createElement } from "react";
// import ReactDOM from "react-dom";
import unified from "unified";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";
import parse from "rehype-parse";

// linting
import { AnchorWrapper } from "../../components/wrappers/anchorWrapper.component";
import { EMWrapper } from "../../components/wrappers/emWrapper.component";

/**
 * This is an example of a simple unified plugin that can be used to make changes to the code.
 * @param options Options to pass to the plugin
 */
export const testPlugin: Plugin<[any?] | [Processor?, any?]> = (options) => {
    const visitor: visit.Visitor<Node> = (node /*, index, parent*/) => {
        var props = node.properties as { [key: string]: string };
        if (node.tagName === "a" && props.href.indexOf("p") !== -1) {
            props.className = `${props.className || ""} test`;
        }
        return;
    };
    return (tree: Node /*, file , next*/) => {
        visit(tree, "element", visitor);
    };
};

export const apiLinkParserPlugin: Plugin<[any?] | [Processor?, any?]> = (options) => {
    const visitor: visit.Visitor<Node> = (node /*, index, parent*/) => {
        var props = node.properties as { [key: string]: any };
        if (node.tagName === "a" && props.href && !props.href.startsWith("http") && props.href.indexOf("/") !== -1 && props.href[0] !== ".") {
            props.href = `/typedoc/${props.href}`;
        }
        if (node.tagName === "input") {
            props.readonly = true;
        }
        return;
    };
    return (tree: Node /*, file , next*/) => {
        visit(tree, "element", visitor);
    };
};

export const parseNode = (htmlContent: string) => {
    // const parsed = unified().use(html).stringify(node);
    var processor = unified()
        .use(parse, { emitParseErrors: true })
        .use(highlight)
        .use(apiLinkParserPlugin)
        .use(rehype2react, {
            createElement: createElement,
            components: {
                a: AnchorWrapper,
                em: EMWrapper,
            },
        });

    return processor.processSync(htmlContent) as any;
};
