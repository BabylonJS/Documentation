import { FunctionComponent } from "react";
import { ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";

export interface IEMLinkProps extends ComponentsWithoutNodeOptions {}

export enum ColorType {
    INFO = "info",
    DANGER = "danger",
    DARK = "dark",
    PRIMARY = "primary",
    LINK = "link",
    SUCCESS = "success",
    WARNING = "warning",
}

export enum ElementType {
    MESSAGE = "message",
    TAG = "tag",
}

// [ELEMENTTYPE.COLORTYPE.PARAM(s)]
// example of string to parse: "[message.info] Message" , "[tag.info[.2]] Available since 4.2"

/**
 * Replaces <em> element
 */
export const EMWrapper: FunctionComponent<IEMLinkProps> = ({ children }) => {
    const parsed = parseMessage(children.toString());
    if (parsed.match) {
        const color = parsed.color || ColorType.INFO;
        switch (parsed.type) {
            case ElementType.MESSAGE:
                return (
                    // <Message color={color}>
                    //     <Message.Body>{parsed.content}</Message.Body>
                    // </Message>
                    <></>
                );
            case ElementType.TAG:
                const splitLocation = parsed.params !== undefined ? (parsed.params as number) : 1;
                const splits = parsed.content.split(" ");
                const firstPart = splits.splice(0, splitLocation);
                return (
                    // <Tag.Group gapless>
                    //     <Tag color="dark">{firstPart.join(" ")}</Tag>
                    //     <Tag color={color}>{splits.join(" ")}</Tag>
                    // </Tag.Group>
                    <></>
                );
        }
    }
    return <em>{children}</em>;
};

const parseMessage = (message: string): { match: boolean; type?: ElementType; color?: ColorType; params?: any; content: string } => {
    // check if there is a special case
    const matches = message.match(/\((.+)\)(.*)/);
    if (matches) {
        const splits = matches[1].split(".");
        if (ElementType[splits[0].toUpperCase()]) {
            return {
                match: true,
                type: ElementType[splits[0].toUpperCase()],
                color: ColorType[splits[1].toUpperCase()],
                params: splits[2],
                content: (matches[2] || '').trim(),
            };
        }
    }
    return { match: false, content: message };
};
