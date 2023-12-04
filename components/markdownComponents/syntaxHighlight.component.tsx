import Image from "next/image";
import { FunctionComponent, useState } from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import { Alert, AlertTitle, IconButton, Tooltip, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import vsDark from "prism-react-renderer/themes/vsDark";

const syntaxHighlightingStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            flexDirection: "column"
        },
        header: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "0.3rem"
        },
        copyIcon: {
            cursor: 'pointer',
            transform: "scaleX(-1)",
            rotate: "180deg",
            fontSize: "1rem",
            alignSelf: "end",
            marginBottom: "0.1rem"
        },
        copiedContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        copiedIcon: {
            fontSize: "1rem",
            alignSelf: "end",
            marginBottom: "0.1rem"
        },
        copiedText: {
            marginRight: "0.3rem",
            fontSize: "0.8rem"
        }
    }),
);

export const SyntaxHighlighting: FunctionComponent<{ className: string; children: string }> = (props) => {
    const [isCopy, setIsCopied] = useState(false);
    const [checkedTimeout, setCheckedTimeout] = useState<NodeJS.Timeout>(null);
    const classes = syntaxHighlightingStyles();
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
                <Image alt="Copy" src="/fluent-icons/ic_fluent_copy_24_regular.svg" width={24} height={24} />
            </IconButton>
        </Tooltip>
        :
        <div className={classes.copiedContainer}>
            <i className={classes.copiedText}>Copied!</i>
            <IconButton size="small" color="inherit" onClick={copyPaste}>
                <Image alt="Copy Complete" src="/fluent-icons/ic_fluent_completed_24_regular.svg" width={24} height={24} />
            </IconButton>
        </div>
    return (
        <div className={classes.container}>
            <div className={classes.header}>
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
        <Alert severity={props.severity} style={{marginBottom: "1.3rem"}}>
            {props.title || <AlertTitle>{ props.title }</AlertTitle>}
            <p style={{margin: "0"}}>{props.description}</p>
        </Alert>
    );
};
