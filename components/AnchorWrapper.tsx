import { FunctionComponent, useState } from "react";
import { ComponentProps } from "rehype-react";

export interface IDocumentationLinkProps extends ComponentProps {
    href: string;
    title?: string;
}

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const AnchorWrapper: FunctionComponent<IDocumentationLinkProps> = (props) => {
    // just as a test
    const [counter, setCounter] = useState<number>(0);
    const onClick = () => {
        setCounter(counter + 1);
    };
    const isInternal = !props.href.startsWith("http");
    const isPlayground = props.href.indexOf("babylonjs-playground.com") !== -1 || props.href.indexOf("playground.babylonjs") !== -1;
    if (!isInternal && !isPlayground) {
        return <a {...props}></a>;
    } else
        return (
            <a title={props.title} className="playgroundLink" onClick={onClick}>
                {/* <span>{counter}</span> */}
                {props.children}
            </a>
        );
};
