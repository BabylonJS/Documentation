import { FunctionComponent } from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";

export const SyntaxHighlighting: FunctionComponent<{className: string, children: string}> = (props) => {
    const language = props.className.replace(/language-/, "") as Language;
    return (
        <Highlight {...defaultProps} code={props.children.trim()} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{ ...style, padding: "20px" }}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};
