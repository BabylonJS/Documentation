import { Plugin, Processor } from "unified";
import visit from "unist-util-visit";
import { Node } from "unist";

import { createElement } from "react";
// import ReactDOM from "react-dom";
import { unified } from "unified";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";
import parse from "rehype-parse";

// linting
import { AnchorWrapper } from "../../components/wrappers/anchorWrapper.component";

/**
 * This is an example of a simple unified plugin that can be used to make changes to the code.
 * @param options Options to pass to the plugin
 */
export const testPlugin: Plugin<[any?] | [Processor?, any?]> = (options) => {
    const visitor: visit.Visitor<Node> = (node: any /*, index, parent*/) => {
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

export const addPlaygroundSearch: Plugin<[any?] | [Processor?, any?]> = (options) => {
    const visitor: visit.Visitor<Node> = (node: any /*, index, parent*/) => {
        var props = node.properties as { [key: string]: any };
        const classes = (props.className || []) as string[];
        if (node.tagName === "section" && (classes.indexOf("tsd-kind-method") !== -1 || classes.indexOf("tsd-kind-property") !== -1)) {
            let methodName = "";
            (node.children as any[]).forEach((child) => {
                if (child.tagName === "h3") {
                    (child.children as any[]).forEach((h3Child) => {
                        if (h3Child.type === "text") {
                            methodName += h3Child.value;
                        }
                    });
                    const playgroundSearch = {
                        tagName: "a",
                        type: "element",
                        properties: {
                            className: ["playground-search-link"],
                            href: `/playground?type=code&q=${methodName}`,
                        },
                        children: [
                            {
                                type: "text",
                                value: `Search playground for ${methodName}`,
                            },
                        ],
                    };
                    child.children.push(playgroundSearch);
                }
            });
        }
        return;
    };
    return (tree: Node /*, file , next*/) => {
        visit(tree, "element", visitor);
    };
};

export const apiLinkParserPlugin: () => Plugin<[any?] | [Processor?, any?]> = (baseLocation = "typedoc") => {
    return () => {
        const visitor: visit.Visitor<Node> = (node: any /*, index, parent*/) => {
            var props = node.properties as { [key: string]: any };
            if (node.tagName === "a" && props.href && !props.href.startsWith("http") && props.href.indexOf("/") !== -1 && props.href[0] !== ".") {
                props.href = `/${baseLocation}/${props.href}`;
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
};

export const parseNode = (htmlContent: string, baseLocation = "typedoc") => {
    // const parsed = unified().use(html).stringify(node);
    var processor = unified()
        .use(parse)
        .use(highlight)
        .use(apiLinkParserPlugin.call(null, baseLocation))
        .use(addPlaygroundSearch)
        .use(rehype2react, {
            createElement: createElement,
            components: {
                a: AnchorWrapper,
            },
        });

    return processor.processSync(htmlContent) as any;
};
