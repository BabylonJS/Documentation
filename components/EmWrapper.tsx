import { FunctionComponent, useState } from "react";
import { ComponentProps } from "rehype-react";

import Message from "react-bulma-components/src/components/message";

export interface IEMLinkProps extends ComponentProps {}

export enum MessageType {
    INFO = "info",
    DANGER = "danger",
    DARK = "dark",
    PRIMARY = "primary",
    LINK = "link",
    SUCCESS = "success",
    WARNING = "warning",
}

/**
 * Replaces <em> element
 */
export const EMWrapper: FunctionComponent<IEMLinkProps> = ({ children }) => {
    const innerText = children.toString();
    const split = innerText.split(" ") || [''];
    const messageType = split.shift().toUpperCase();

    if (MessageType[messageType]) {
        return (
            <Message color={MessageType[messageType]}>
                <Message.Body>
                    {split.join(" ")}
                </Message.Body>
            </Message>
        );
    }
    return <em>{children}</em>;
};
