import { FunctionComponent, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/system/Box";
import { InputBase, Paper, Typography, IconButton, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface SearchEntry {
    name: string;
    kind: string;
    module: string;
    url: string;
}

const KIND_COLORS: Record<string, string> = {
    Class: "#2196f3",
    Interface: "#4caf50",
    Enum: "#ff9800",
    Function: "#9c27b0",
    Type: "#00bcd4",
    Variable: "#795548",
    Module: "#607d8b",
    Property: "#e91e63",
    Method: "#9c27b0",
    Accessor: "#009688",
    Constructor: "#ff5722",
};

// Determines a search "context" from the page id
type SearchMode = "global" | "module" | "members";

function getSearchMode(id: string[]): SearchMode {
    if (!id || id.length === 0 || (id.length === 1 && id[0] === "index")) return "global";
    const pageType = id[0];
    if (pageType === "modules") return "module";
    if (["classes", "interfaces", "enums"].includes(pageType)) return "members";
    return "global";
}

function getModuleFromId(id: string[]): string {
    if (id.length < 2) return "";
    // e.g. id = ["modules", "_babylonjs_core"] or ["classes", "_babylonjs_core.Scene"]
    const raw = id[1].split(".")[0]; // "_babylonjs_core"
    return raw.replace(/^_/, "@").replace(/_/g, "/");
}

function getPageTitle(id: string[]): string {
    if (id.length < 2) return "";
    // e.g. "_babylonjs_core.Scene" → "Scene"
    const parts = id[1].split(".");
    return parts.length > 1 ? parts.slice(1).join(".") : parts[0].replace(/^_/, "@").replace(/_/g, "/");
}

/** Scan the current page's DOM for TypeDoc member index links */
function parsePageMembers(): SearchEntry[] {
    const entries: SearchEntry[] = [];
    // Class/interface pages have tsd-index-section groups with a heading + links
    const sections = Array.from(document.querySelectorAll(".tsd-index-section"));
    for (const section of sections) {
        const heading = section.querySelector(".tsd-index-heading");
        const kind = heading?.textContent?.trim() || "Member";
        const kindSingular = kind.replace(/ies$/, "y").replace(/ors$/, "or").replace(/s$/, "");
        const links = Array.from(section.querySelectorAll("a.tsd-index-link"));
        for (const link of links) {
            const span = link.querySelector("span");
            const name = span?.textContent?.trim() || "";
            const href = link.getAttribute("href") || "";
            if (name && href) {
                entries.push({
                    name,
                    kind: kindSingular,
                    module: "",
                    url: href, // "#anchor" hash link
                });
            }
        }
    }
    return entries;
}

interface TypeDocSearchProps {
    baseLocation?: string;
    id?: string[];
}

interface ManifestEntry {
    module: string;
    file: string;
    count: number;
}

export const TypeDocSearch: FunctionComponent<TypeDocSearchProps> = ({ baseLocation = "typedoc", id = [] }) => {
    const [query, setQuery] = useState("");
    const [manifest, setManifest] = useState<ManifestEntry[] | null>(null);
    // Per-module data keyed by module name; null = not yet loaded
    const [moduleData, setModuleData] = useState<Record<string, SearchEntry[]>>({});
    const [pageMembers, setPageMembers] = useState<SearchEntry[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const router = useRouter();
    const theme = useTheme();

    const mode = getSearchMode(id);
    const currentModule = getModuleFromId(id);
    const pageTitle = getPageTitle(id);

    const prefix = baseLocation.replace(/\//g, "-");

    // Load manifest (tiny file listing available modules)
    const loadManifest = useCallback(() => {
        if (manifest) return;
        fetch(`/api-search/${prefix}/manifest.json`)
            .then((r) => r.json())
            .then((data: ManifestEntry[]) => setManifest(data))
            .catch(() => setManifest([]));
    }, [manifest, prefix]);

    // Load a specific module's search data
    const loadModule = useCallback(
        (mod: string) => {
            if (moduleData[mod]) return; // already loaded
            if (!manifest) return;
            const entry = manifest.find((m) => m.module === mod);
            if (!entry) return;
            fetch(`/api-search/${prefix}/${entry.file}`)
                .then((r) => r.json())
                .then((data: SearchEntry[]) => {
                    // Attach module name to each entry (not stored in per-module files)
                    const withMod = data.map((e) => ({ ...e, module: mod }));
                    setModuleData((prev) => ({ ...prev, [mod]: withMod }));
                })
                .catch(() => setModuleData((prev) => ({ ...prev, [mod]: [] })));
        },
        [manifest, moduleData, prefix],
    );

    // Load all modules (for global search)
    const loadAllModules = useCallback(() => {
        if (!manifest) return;
        for (const entry of manifest) {
            loadModule(entry.module);
        }
    }, [manifest, loadModule]);

    // When manifest arrives and we know the mode, load the right data
    useEffect(() => {
        if (!manifest) return;
        if (mode === "module" && currentModule) {
            loadModule(currentModule);
        } else if (mode === "global") {
            loadAllModules();
        }
    }, [manifest, mode, currentModule, loadModule, loadAllModules]);

    // Parse page members from DOM when on a class/interface page
    useEffect(() => {
        if (mode === "members") {
            // Small delay to let the page content render
            const timer = setTimeout(() => setPageMembers(parsePageMembers()), 200);
            return () => clearTimeout(timer);
        } else {
            setPageMembers([]);
        }
    }, [mode, id.join("/")]);

    // Close on outside click
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setExpanded(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Build the searchable dataset based on context
    const searchableItems = useMemo((): SearchEntry[] => {
        if (mode === "members") {
            return pageMembers;
        }
        if (mode === "module" && currentModule) {
            return moduleData[currentModule] || [];
        }
        // Global: concatenate all loaded modules
        return Object.values(moduleData).flat();
    }, [mode, pageMembers, moduleData, currentModule]);

    // Filter results
    const results = useMemo(() => {
        if (query.length < 2) return [];
        const q = query.toLowerCase();
        const matches = searchableItems.filter(
            (entry) =>
                entry.name.toLowerCase().includes(q) ||
                (entry.module && (entry.module + "." + entry.name).toLowerCase().includes(q)),
        );
        matches.sort((a, b) => {
            const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
            const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
            if (aStarts !== bStarts) return aStarts - bStarts;
            return a.name.localeCompare(b.name);
        });
        return matches.slice(0, 50);
    }, [searchableItems, query]);

    const navigate = (entry: SearchEntry) => {
        setExpanded(false);
        setQuery("");
        if (entry.url.startsWith("#")) {
            // In-page anchor navigation
            const el = document.getElementById(entry.url.slice(1));
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.pushState(null, "", entry.url);
            }
        } else {
            router.push(entry.url);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
            e.preventDefault();
            navigate(results[activeIdx]);
        } else if (e.key === "Escape") {
            setExpanded(false);
            setQuery("");
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        if (activeIdx >= 0 && listRef.current) {
            const item = listRef.current.children[activeIdx] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [activeIdx]);

    // Focus input when search expands
    useEffect(() => {
        if (expanded) {
            if (mode !== "members") loadManifest();
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [expanded, loadManifest, mode]);

    const placeholder = mode === "members"
        ? `Search ${pageTitle} members\u2026`
        : mode === "module"
        ? `Search ${currentModule}\u2026`
        : "Search API\u2026";

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1200,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                {!expanded ? (
                    <IconButton
                        onClick={() => setExpanded(true)}
                        size="small"
                        aria-label="Search API"
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                            backdropFilter: "blur(8px)",
                            boxShadow: theme.shadows[2],
                            "&:hover": {
                                backgroundColor: theme.palette.background.paper,
                            },
                        }}
                    >
                        <SearchIcon fontSize="small" />
                    </IconButton>
                ) : (
                    <Box sx={{
                        width: { xs: "calc(100vw - 80px)", sm: 360 },
                        maxWidth: 360,
                    }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                backdropFilter: "blur(8px)",
                                border: `1px solid ${theme.palette.primary.main}`,
                                boxShadow: theme.shadows[4],
                                px: 1.5,
                                py: 0.25,
                            }}
                        >
                            <SearchIcon sx={{ color: alpha(theme.palette.text.primary, 0.5), mr: 1, fontSize: 20 }} />
                            <InputBase
                                inputRef={inputRef}
                                placeholder={placeholder}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIdx(-1);
                                }}
                                onKeyDown={onKeyDown}
                                sx={{
                                    flex: 1,
                                    color: "inherit",
                                    fontSize: 14,
                                    "& .MuiInputBase-input": {
                                        padding: "4px 0",
                                    },
                                }}
                                inputProps={{
                                    "aria-label": "Search API",
                                    "aria-controls": "typedoc-search-results",
                                    "aria-expanded": query.length >= 2 && results.length > 0,
                                    "aria-activedescendant": activeIdx >= 0 ? `typedoc-search-opt-${activeIdx}` : undefined,
                                    "aria-autocomplete": "list" as const,
                                    role: "combobox",
                                    autoComplete: "off",
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setExpanded(false);
                                    setQuery("");
                                }}
                                aria-label="Close search"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {query.length >= 2 && (
                            <Paper
                                elevation={8}
                                sx={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1300,
                                    maxHeight: 400,
                                    overflow: "auto",
                                    mt: 0.5,
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                {results.length === 0 ? (
                                    <Box sx={{ p: 2, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {mode !== "members" && manifest === null ? "Loading\u2026" : "No results found"}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ul
                                        ref={listRef}
                                        id="typedoc-search-results"
                                        role="listbox"
                                        style={{ margin: 0, padding: 0, listStyle: "none" }}
                                    >
                                        {results.map((entry, idx) => (
                                            <li
                                                key={entry.url + entry.name}
                                                id={`typedoc-search-opt-${idx}`}
                                                role="option"
                                                aria-selected={idx === activeIdx}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    navigate(entry);
                                                }}
                                                onMouseEnter={() => setActiveIdx(idx)}
                                                style={{
                                                    padding: "8px 12px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    backgroundColor:
                                                        idx === activeIdx
                                                            ? alpha(theme.palette.primary.main, 0.12)
                                                            : "transparent",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        color: KIND_COLORS[entry.kind] || theme.palette.text.secondary,
                                                        minWidth: 60,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {entry.kind}
                                                </span>
                                                <span style={{ fontWeight: 500 }}>{entry.name}</span>
                                                <span
                                                    style={{
                                                        marginLeft: "auto",
                                                        fontSize: 12,
                                                        color: theme.palette.text.secondary,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {entry.module}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Paper>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
