import { RefObject, useCallback, useEffect } from "react";

import { ITableOfContentsItem } from "../../lib/content.interfaces";

export const useHashScroll = (markdownRef: RefObject<HTMLDivElement>, id: string[], tocLinks: ITableOfContentsItem[], onReset: () => void) => {
    const routeKey = id.join("/");
    const scrollToTop = useCallback(() => {
        markdownRef.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
    }, [markdownRef]);

    useEffect(() => {
        if (!window.location.hash) {
            scrollToTop();
        }
        window.onhashchange = () => {
            if (location.hash === "") {
                scrollToTop();
            }
        };
        return () => {
            window.onhashchange = undefined as any;
            onReset();
        };
    }, [onReset, routeKey, scrollToTop]);

    useEffect(() => {
        if (window.location.hash) {
            const hash = window.location.hash;
            window.location.hash = "#tmp";
            window.location.hash = hash;
        }
    }, [tocLinks]);

    return scrollToTop;
};
