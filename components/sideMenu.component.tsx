import { IMenuItem } from "../lib/content.interfaces";
import { FunctionComponent, useState, ReactFragment, useEffect } from "react";

import Button from "react-bulma-components/src/components/button";
import Link from "next/link";

export interface ISideMenuProps {
    items: IMenuItem[];
    selected: string;
}

export const SideMenu: FunctionComponent<ISideMenuProps> = ({ items, selected }) => {
    const [opened, setOpened] = useState<string[]>([]);

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
        const isOpened = opened.indexOf(key) !== -1;
        const isSelected = selected.startsWith(key);
        return (
            <div style={{ marginLeft: `40px`, marginBottom: "10px" }} key={key}>
                <div>
                    <Button size="small" disabled={!hasChildren} color="primary" onClick={() => openCloseItem(item)}>
                        {" "}
                        {hasChildren ? (isOpened ? "-" : "+") : "*"}{" "}
                    </Button>{" "}
                    <Link href={item.url}>
                        <a style={{ color: isSelected ? "blue" : "black" }}>{item.name}</a>
                    </Link>
                </div>
                {isOpened && item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
        );
    };

    useEffect(() => {
        // force-open the selected item on load
        const splits = selected.split("/").filter(s => s);
        const openedArray = []
        splits.reduce((prev, current) => {
            openedArray.push(`${prev}/${current}`);
            return `${prev}/${current}`;
        }, "");
        setOpened(openedArray);
    }, []);

    return (
        <aside>
            <nav>{items.map((item) => renderMenuItem(item))}</nav>
        </aside>
    );
};
