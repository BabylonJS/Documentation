import { IMenuItem } from "../lib/content.interfaces";
import { FunctionComponent, useState, ReactFragment, useEffect, useRef, useContext } from "react";

import Link from "next/link";
import { IconButton, TextField, useTheme } from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterIcon from "@mui/icons-material/FilterList";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box } from "@mui/system";
import { BaseUrlContext } from "../pages/_app";

export interface ISideMenuProps {
    items: IMenuItem[];
    selected: string;
}

export const SideMenu: FunctionComponent<ISideMenuProps> = ({ items, selected }) => {
    const [opened, setOpened] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [toggleFilter, setToggleFilter] = useState<boolean>();

    const textFieldRef = useRef<HTMLInputElement>();
    const theme = useTheme();

    const openCloseItem = (item: IMenuItem) => {
        const idx = opened.indexOf(item.url);
        if (idx !== -1) {
            const newOpened = opened.slice(0);
            newOpened.splice(idx, 1);
            setOpened(newOpened);
        } else {
            setOpened([...opened, item.url]);
        }
    };

    const renderMenuItem = (item: IMenuItem, level: number = 0): ReactFragment => {
        const hasChildren = item.children && item.children.length;
        const key = item.url;
        const isSelected = selected === key;
        const isOpened = (filter && toggleFilter) || opened.indexOf(key) !== -1;
        const baseUrl = useContext(BaseUrlContext);
        return (item.filtered && toggleFilter) || !item.url ? null : (
            <Box
                component="li"
                sx={
                    hasChildren
                        ? level
                            ? { marginLeft: "20px" }
                            : {}
                        : level !== 0
                        ? {
                              marginLeft: "20px",
                          }
                        : { marginLeft: "30px" }
                }
                key={key}
            >
                <Box
                    sx={{
                        minHeight: "30px",
                        display: "flex",
                        alignItems: "flex-start",
                        "& a": {
                            marginTop: theme.spacing(0.6),
                        },
                    }}
                >
                    {!!hasChildren && (
                        <IconButton size="small" onClick={() => openCloseItem(item)}>
                            {hasChildren ? isOpened ? <ExpandMoreIcon></ExpandMoreIcon> : <ChevronRightIcon></ChevronRightIcon> : <></>}
                        </IconButton>
                    )}
                    {!hasChildren && level > 0 && (
                        <IconButton disabled={true} size="small">
                            <FiberManualRecordIcon style={{ padding: 8 }} />
                        </IconButton>
                    )}
                    
                    <Link href={baseUrl + item.url}>
                        <Box
                            component="span"
                            sx={
                                isSelected
                                    ? {
                                          color: theme.customPalette.sideMenu.selectedMenuItemLinkColor,
                                          fontWeight: 800,
                                          "&:hover": {
                                              color: theme.customPalette.sideMenu.menuItemHoverColor,
                                          },
                                      }
                                    : {
                                          color: theme.customPalette.sideMenu.textColor,
                                          "&:hover": {
                                              color: theme.customPalette.sideMenu.menuItemHoverColor,
                                          },
                                      }
                            }
                        >
                            {item.name}
                        </Box>
                    </Link>
                </Box>
                {isOpened && <ul>{item.children.map((child) => renderMenuItem(child, level + 1))}</ul>}
            </Box>
        );
    };

    const getFilteredItems = (itemsToFilter: IMenuItem[], filterWord = filter.toLowerCase()) => {
        itemsToFilter.forEach((item) => {
            item.filtered = false;
            item.childFoundWithFilter = false;
            if (item.children && item.children.length) {
                getFilteredItems(item.children, filterWord);
                if (!item.childFoundWithFilter) {
                    item.childFoundWithFilter = !!item.children.find((item) => !item.filtered);
                }
            }
            if (item.childFoundWithFilter) {
                item.filtered = false;
            } else {
                item.filtered = item.name.toLowerCase().indexOf(filterWord) === -1;
            }
        });
    };

    useEffect(() => {
        // force-open the selected item on load
        const splits = selected.split("/").filter((s) => s);
        const openedArray = [];
        splits.reduce((prev, current) => {
            openedArray.push(`${prev}/${current}`);
            return `${prev}/${current}`;
        }, "");
        const filteredOpened = opened.filter((o) => openedArray.indexOf(o) === -1);
        setOpened([...filteredOpened, ...openedArray]);
    }, [selected]);

    useEffect(() => {
        if (toggleFilter) {
            textFieldRef.current?.querySelector("input").focus();
        }
    }, [toggleFilter]);

    getFilteredItems(items, filter.toLowerCase().trim());

    return (
        <Box
            component="aside"
            sx={{
                position: "relative",
                margin: "16px",
            }}
        >
            <Box
                sx={{
                    transition: "height 0.2s",
                }}
                style={{ height: toggleFilter ? 40 : 0, overflow: toggleFilter ? "unset" : "hidden" }}
            >
                <TextField ref={textFieldRef} label="Filter" onChange={(e) => setFilter(e.target.value.toLowerCase())} variant="outlined" size="small" />
            </Box>
            <IconButton
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                }}
                aria-label="filter"
                size="small"
                onClick={() => setToggleFilter(!toggleFilter)}
            >
                <FilterIcon />
            </IconButton>
            <nav>
                <ul>{items.map((item) => renderMenuItem(item))}</ul>
            </nav>
        </Box>
    );
};
