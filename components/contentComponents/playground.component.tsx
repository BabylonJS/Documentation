import { FunctionComponent, useState } from "react";
import { ComponentProps } from "rehype-react";

export interface IPlaygroundProps extends ComponentProps {
    id?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
}

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const PlaygroundMarkdownComponent: FunctionComponent<IPlaygroundProps> = (props) => {
    // just as a test
    return (
        <div>
            {props.id} {props.title} {props.description} {props.imageUrl}
        </div>
    )
};
