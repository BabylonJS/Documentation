import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { Children, FunctionComponent, isValidElement, PropsWithChildren, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";

type CodeVariantName = "es6" | "pure-es6" | "umd";

type CodeVariantProps = PropsWithChildren<{
    variant: CodeVariantName;
    label: string;
}>;

const codeVariantStorageKey = "babylon-docs-code-variant";
const codeVariantChangeEvent = "babylon-code-variant-change";

export const CodeVariant: FunctionComponent<CodeVariantProps> = ({ children }) => {
    return <>{children}</>;
};

export const CodeVariants: FunctionComponent<PropsWithChildren<{ defaultVariant?: CodeVariantName }>> = ({ children, defaultVariant = "es6" }) => {
    const theme = useTheme();
    const variants = Children.toArray(children).filter(
        (child): child is ReactElement<CodeVariantProps> =>
            isValidElement<CodeVariantProps>(child) && (child.props.variant === "es6" || child.props.variant === "pure-es6" || child.props.variant === "umd"),
    );
    const availableVariants = variants.map(({ props }) => props.variant);
    const initialVariant = availableVariants.includes(defaultVariant) ? defaultVariant : availableVariants[0];
    const [selectedVariant, setSelectedVariant] = useState<CodeVariantName | undefined>(initialVariant);
    const [contentHeight, setContentHeight] = useState<number>();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedVariant = window.localStorage.getItem(codeVariantStorageKey) as CodeVariantName | null;
        if (storedVariant && availableVariants.includes(storedVariant)) {
            setSelectedVariant(storedVariant);
        }

        const handleVariantChange = (event: Event) => {
            const variant = (event as CustomEvent<CodeVariantName>).detail;
            if (availableVariants.includes(variant)) {
                setSelectedVariant(variant);
            }
        };

        window.addEventListener(codeVariantChangeEvent, handleVariantChange);
        return () => window.removeEventListener(codeVariantChangeEvent, handleVariantChange);
    }, [children]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) {
            return;
        }

        const updateHeight = () => {
            setContentHeight(content.getBoundingClientRect().height);
        };
        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [selectedVariant]);

    if (!variants.length || !selectedVariant) {
        return null;
    }

    const handleChange = (_event: SyntheticEvent, variant: CodeVariantName) => {
        setSelectedVariant(variant);
        window.localStorage.setItem(codeVariantStorageKey, variant);
        window.dispatchEvent(new CustomEvent<CodeVariantName>(codeVariantChangeEvent, { detail: variant }));
    };

    return (
        <Box sx={{ marginBottom: theme.spacing(2) }}>
            <Tabs
                aria-label="Babylon.js package format"
                value={selectedVariant}
                onChange={handleChange}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    minHeight: 40,
                    backgroundColor: theme.vars.customPalette.header,
                    color: "white",
                    "& .MuiTab-root": {
                        minHeight: 40,
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: "white",
                    },
                }}
            >
                {variants.map(({ props }) => (
                    <Tab
                        key={props.variant}
                        value={props.variant}
                        label={props.label}
                        title={
                            props.variant === "pure-es6"
                                ? "Pure imports require explicit registration for the engine and optional features used by your application."
                                : undefined
                        }
                    />
                ))}
            </Tabs>
            <Box
                sx={{
                    height: contentHeight ?? "auto",
                    overflow: "hidden",
                    transition: theme.transitions.create("height", {
                        duration: theme.transitions.duration.standard,
                        easing: theme.transitions.easing.easeInOut,
                    }),
                    "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                    },
                }}
            >
                <Box ref={contentRef} sx={{ display: "flow-root" }}>
                    {variants.find(({ props }) => props.variant === selectedVariant)}
                </Box>
            </Box>
        </Box>
    );
};
