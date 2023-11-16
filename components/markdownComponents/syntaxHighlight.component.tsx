import { FunctionComponent, useState } from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import { Alert, AlertTitle, IconButton, Tooltip } from "@mui/material";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import vsDark from "prism-react-renderer/themes/vsDark";

export const SyntaxHighlighting: FunctionComponent<{ className: string; children: string }> = (props) => {
    const [isCopy, setIsCopied] = useState(false);
    const [checkedTimeout, setCheckedTimeout] = useState<NodeJS.Timeout>(null);
    if (!props.className && typeof props.children === "string" && !props.children.includes("\n")) {
        return <code>{props.children}</code>;
    }
    const language = props.className ? (props.className.replace(/language-/, "") as Language) : "javascript";
    const copyPaste = () => {
        navigator.clipboard.writeText(props.children.trim())
        setIsCopied(true);
        const newTimeout = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        if(checkedTimeout) {
            clearTimeout(checkedTimeout)
        }
        setCheckedTimeout(newTimeout)
    }
    const copyPasteIcon = !isCopy ?
        <Tooltip title="Copy">
            <IconButton size="small" color="inherit" onClick={copyPaste}>
                <ContentCopyIcon style={{ cursor: 'pointer', transform: "scaleX(-1)", rotate: "180deg", fontSize: "1rem", alignSelf: "end", marginBottom: "0.1rem" }} />
            </IconButton>
        </Tooltip>
        :
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <i style={{marginRight: "0.3rem", fontSize: "0.8rem"}}>Copied!</i>
            <IconButton size="small" color="inherit" onClick={copyPaste}>
                <LibraryAddCheckIcon style={{ fontSize: "1rem", alignSelf: "end", marginBottom: "0.1rem" }} />
            </IconButton>
        </div>
        // <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        //     <i style={{marginRight: "0.3rem", fontSize: "0.8rem"}}>Copied!</i>
        //     <LibraryAddCheckIcon style={{ fontSize: "1rem", marginBottom: "0.1rem" }} />
        // </div>
    return (
        <div style={{display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0.3rem" }}>
                <i>{language}</i>
                {copyPasteIcon}
            </div>
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
        </div>
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
