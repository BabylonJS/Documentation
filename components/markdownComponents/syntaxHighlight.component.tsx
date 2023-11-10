import { FunctionComponent } from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import { Alert, AlertProps, AlertTitle } from "@mui/material";

import vsDark from "prism-react-renderer/themes/vsDark";

export const SyntaxHighlighting: FunctionComponent<{ className: string; children: string }> = (props) => {
    if (!props.className && typeof props.children === "string" && !props.children.includes("\n")) {
        return <code>{props.children}</code>;
    }
    const language = props.className ? (props.className.replace(/language-/, "") as Language) : "javascript";
    return (
        <Highlight {...defaultProps} theme={vsDark} code={props.children.trim()} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{ ...style, padding: "20px" }}>
                    <code>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </code>
                </pre>
            )}
        </Highlight>
    );
};

type AlertMarkdownComponentProps = {  severity: 'error' | 'warning' | 'info' | 'success', description: string, title?: string }
export const AlertMarkdownComponent: FunctionComponent<AlertMarkdownComponentProps> = (props: AlertMarkdownComponentProps) => {
    return (
        <Alert severity={props.severity}>
            {props.title || <AlertTitle>{ props.title }</AlertTitle>}
            <p style={{margin: "0"}}>{props.description}</p>
        </Alert>
    );
};
