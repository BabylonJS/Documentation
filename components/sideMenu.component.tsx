import { IMenuItem } from "../lib/content.interfaces";
import { FunctionComponent, useState, ReactFragment, useEffect, useRef } from "react";

import Link from "next/link";
import { IconButton, TextField, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterIcon from "@mui/icons-material/FilterList";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export interface ISideMenuProps {
    items: IMenuItem[];
    selected: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            minHeight: 30,
            display: "flex",
            alignItems: "flex-start",
            "& a": {
                marginTop: theme.spacing(0.6),
            },
        },
        noChild: {
            marginLeft: 20,
        },
        noChildFirstLevel: {
            marginLeft: 30,
        },
        childWithChildren: {
            marginLeft: 20,
        },
        drawer: {
            flexShrink: 0,
        },
        drawerPaper: {
            width: 300,
            height: 40,
        },
        filterContainer: {
            transition: "height 0.2s",
        },
        filterIcon: {
            position: "absolute",
            top: 0,
            right: 0,
        },
        aside: {
            position: "relative",
            margin: 16,
        },
        poweredBy: {
            display: "flex",
            position: "fixed",
            bottom: 8,
            backgroundColor: theme.customPalette.sideMenu.poweredByBackgroundColor,
            fontSize: "0.9rem",
            border: "solid 1px",
            padding: theme.spacing(0, 1),
            "& svg": {
                height: 24,
                width: 56,
            },
            "& a": {
                display: "flex",
            },
            [theme.breakpoints.up("md")]: {
                backgroundColor: theme.customPalette.sideMenu.backgroundColor,
            },
        },
        menuItemLink: {
            color: theme.customPalette.sideMenu.textColor,
            "&:hover": {
                color: theme.customPalette.sideMenu.menuItemHoverColor,
            },
        },
        selectedMenuItemLink: {
            color: theme.customPalette.sideMenu.selectedMenuItemLinkColor,
            fontWeight: 800,
            "&:hover": {
                color: theme.customPalette.sideMenu.menuItemHoverColor,
            },
        },
        positionIcon: {
            transform: "scale(0.8) translateY(8px)",
        },
    }),
);

export const SideMenu: FunctionComponent<ISideMenuProps> = ({ items, selected }) => {
    const classes = useStyles();
    const [opened, setOpened] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [toggleFilter, setToggleFilter] = useState<boolean>();

    const textFieldRef = useRef<HTMLInputElement>();

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
        const className = hasChildren ? (level ? classes.childWithChildren : "") : level !== 0 ? classes.noChild : classes.noChildFirstLevel;
        return (item.filtered && toggleFilter) || !item.url ? null : (
            <li className={className} key={key}>
                <div className={classes.menuItem}>
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
                    <Link href={item.url}>
                        <span className={isSelected ? classes.selectedMenuItemLink : classes.menuItemLink}>{item.name}</span>
                    </Link>
                </div>
                {isOpened && <ul>{item.children.map((child) => renderMenuItem(child, level + 1))}</ul>}
            </li>
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
        <aside className={classes.aside}>
            <div style={{ height: toggleFilter ? 40 : 0, overflow: toggleFilter ? "unset" : "hidden" }} className={classes.filterContainer}>
                <TextField ref={textFieldRef} label="Filter" onChange={(e) => setFilter(e.target.value.toLowerCase())} variant="outlined" size="small" />
            </div>
            <IconButton className={classes.filterIcon} aria-label="filter" size="small" onClick={() => setToggleFilter(!toggleFilter)}>
                <FilterIcon />
            </IconButton>
            <nav>
                <ul>{items.map((item) => renderMenuItem(item))}</ul>
            </nav>
            <div className={classes.poweredBy}>
                <Link href="https://vercel.com/?utm_source=babylonjs&utm_campaign=oss" target={"_blank"} rel={"noopener"}>
                    Powered by{" "}
                    <svg width="283" height="64" viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                            fill="currentColor"
                        />
                    </svg>
                </Link>
            </div>
        </aside>
    );
};
