import { Plugin, Processor } from "unified";
import visit from "unist-util-visit";
import { Node } from "unist";

import { ReactFragment, createElement } from "react";
// import ReactDOM from "react-dom";
import unified from "unified";
import markdown from "remark-parse";
import slug from "remark-slug";
import remark2rehype from "remark-rehype";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";
// import stringify from 'rehype-stringify';
import { AnchorWrapper } from "../components/AnchorWrapper";
import { EMWrapper } from "../components/EmWrapper";

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

export interface IParsedMDObject {
    result: ReactFragment;
}

export const parseMDFile = (fileContent: string): IParsedMDObject => {
    // // Use remark to convert markdown into HTML string
    // const processedContent = await remark()
    //     // is remark-slug needed?
    //     // we could use https://github.com/remarkjs/remark-react as well, if needed
    //     .use(lint)
    //     .use(toc)
    //     .use(html)
    //     .process("# toc\n" + fileContent);
    // const content = processedContent.toString();
    // return {
    //     content,
    // };

    var processor = unified()
        .use(markdown)
        .use(slug)
        //   .use(toc)
        .use(remark2rehype)
        .use(highlight)
        .use(testPlugin)
        .use(rehype2react, {
            createElement: createElement,
            components: {
                a: AnchorWrapper,
                em: EMWrapper,
            },
        }); // TODO - check how can we get react elements easily

    // prerendered so we can use sync
    return processor.processSync(fileContent) as any;
};
