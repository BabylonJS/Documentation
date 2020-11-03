import { FunctionComponent, useContext, useEffect } from "react";
import { DocumentationContext } from "../../pages/[...id]";

export interface IPlaygroundProps {
    id?: string;
    title?: string;
    description?: string;
    image?: string;
}

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const PlaygroundMarkdownComponent: FunctionComponent<IPlaygroundProps> = (props) => {
    const context = useContext(DocumentationContext);

    useEffect(() => {
        context.addExampleLink({
            type: "pg",
            ...props,
        });
    }, []);
    // just as a test
    return (
        <DocumentationContext.Consumer>
            {(context) => (
                <></>
                // <div>
                //     {props.id} {props.title} {props.description} {props.image}
                // </div>
            )}
        </DocumentationContext.Consumer>
    );
};
