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
import toc from "remark-toc";
import parse from "rehype-parse";
import html from "rehype-stringify";

// linting
import lint from "remark-lint";
import lintFirstLine from "remark-lint";
// import stringify from 'rehype-stringify';
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
        if (node.tagName === "a" && props.href && !props.href.startsWith("http") && props.href.indexOf("/") !== -1 && props.href[0] !== '.') {
            props.href = `/typedoc/${props.href}`;
        }
        if(node.tagName === "input") {
            props.readonly = true;
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
    var processor = unified()
        .use(markdown)
        .use(lint)
        .use(lintFirstLine, 2)
        .use(slug)
        .use(toc)
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
    processor.process(fileContent).then(
        (result) => {},
        (error) => {
            console.log(error);
        },
    );
    return processor.processSync(`## toc\n${fileContent}`) as any;
};

export const htmlToJson = (fileContent: string) => {
    var processor = unified().use(parse, { emitParseErrors: true });
    return processor.parse(fileContent);
};

export const parseNode = (node: Node) => {
    const parsed = unified().use(html).stringify(node);
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

    return processor.processSync(parsed) as any;
};
