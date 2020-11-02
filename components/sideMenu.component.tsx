import { IMenuItem } from "../lib/content.interfaces";
import { FunctionComponent, useState, ReactFragment, useEffect } from "react";

import Link from "next/link";
import { createStyles, IconButton, makeStyles, TextField, Theme } from "@material-ui/core";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FilterIcon from "@material-ui/icons/FilterList";

export interface ISideMenuProps {
    items: IMenuItem[];
    selected: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            minHeight: 30,
        },
        noChild: {
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
    }),
);

export const SideMenu: FunctionComponent<ISideMenuProps> = ({ items, selected }) => {
    const classes = useStyles();
    const [opened, setOpened] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [toggleFilter, setToggleFilter] = useState<boolean>();

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
        const isOpened = (filter && toggleFilter) || opened.indexOf(key) !== -1;
        const isSelected = selected.startsWith(key);
        const className = hasChildren ? (level ? classes.childWithChildren : "") : classes.noChild;
        return (item.filtered && toggleFilter) || !item.url ? (
            null
        ) : (
            <li className={className} key={key}>
                <div className={classes.menuItem}>
                    {!!hasChildren && (
                        <IconButton size="small" onClick={() => openCloseItem(item)}>
                            {hasChildren ? isOpened ? <ExpandMoreIcon></ExpandMoreIcon> : <ChevronRightIcon></ChevronRightIcon> : <></>}
                        </IconButton>
                    )}
                    <Link href={item.url}>
                        <a>
                            <span style={{ color: isSelected ? "#9379E6" : "#252C26" }}>{item.name}</span>
                        </a>
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
        setOpened(openedArray);
    }, []);

    getFilteredItems(items, filter.toLowerCase().trim());

    return (
        <aside className={classes.aside}>
            <div style={{ height: toggleFilter ? 40 : 0, overflow: toggleFilter ? "unset" : "hidden" }} className={classes.filterContainer}>
                <TextField label="Filter" onChange={(e) => setFilter(e.target.value.toLowerCase())} variant="outlined" size="small" />
            </div>
            <IconButton className={classes.filterIcon} aria-label="filter" size="small" onClick={() => setToggleFilter(!toggleFilter)}>
                <FilterIcon />
            </IconButton>
            <nav>
                <ul>{items.map((item) => renderMenuItem(item))}</ul>
            </nav>
        </aside>
    );
};
