import Image from "next/image";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Alert, AlertTitle, IconButton, Tooltip, Box } from "@mui/material";
import LinkIcon from "@mui/icons-material/ContentCopy";

export const SyntaxHighlighting: FunctionComponent<{ className: string; children: string }> = (props) => {
    const [isCopy, setIsCopied] = useState(false);
    const [checkedTimeout, setCheckedTimeout] = useState<NodeJS.Timeout>(null);
    if (!props.className && typeof props.children === "string" && !props.children.includes("\n")) {
        return <code>{props.children}</code>;
    }
    const language = props.className ? (props.className.replace(/language-/, "")) : "javascript";
    const copyPaste = () => {
        navigator.clipboard.writeText(props.children.trim());
        setIsCopied(true);
        const newTimeout = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        if (checkedTimeout) {
            clearTimeout(checkedTimeout);
        }
        setCheckedTimeout(newTimeout);
    };
    const copyPasteIcon = !isCopy ? (
        <Tooltip title="Copy">
            <IconButton size="small" color="inherit" onClick={copyPaste} sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}>
                <LinkIcon width="24" height="24"></LinkIcon>
            </IconButton>
        </Tooltip>
    ) : (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Box
                component="i"
                sx={{
                    marginRight: "0.3rem",
                    fontSize: "0.8rem",
                }}
            >
                Copied!
            </Box>
            <IconButton size="small" color="inherit" onClick={copyPaste} sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}>
                <LinkIcon width="24" height="24"></LinkIcon>
            </IconButton>
        </Box>
    );
    return (
        <Box
            sx={{
                position: "relative",
                "&:hover .copy-button": {
                    opacity: 1,
                },
                "@media (hover: none)": {
                    "& .copy-button": {
                        opacity: 0.7,
                    },
                },
            }}
        >
            <Box
                className="copy-button"
                sx={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    zIndex: 1,
                    opacity: 0.3,
                    transition: "opacity 0.2s ease",
                    color: "#DFDFDF",
                }}
            >
                {copyPasteIcon}
            </Box>
            <Highlight theme={themes.vsDark} code={props.children.trim()} language={language}>
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
        </Box>
    );
};

type AlertMarkdownComponentProps = PropsWithChildren<{ severity: "error" | "warning" | "info" | "success"; description: string; title?: string }>;
export const AlertMarkdownComponent: FunctionComponent<AlertMarkdownComponentProps> = (props: AlertMarkdownComponentProps) => {
    return (
        <Alert severity={props.severity} style={{ marginBottom: "1.3rem" }}>
            {props.title || <AlertTitle>{props.title}</AlertTitle>}
            <p style={{ margin: "0" }} dangerouslySetInnerHTML={{ __html: props.description }} />
            {props.children}
        </Alert>
    );
};
