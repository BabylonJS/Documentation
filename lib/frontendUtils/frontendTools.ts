import { IExampleLink } from "../content.interfaces";

export const getExampleLink = (example: Partial<IExampleLink>, full: boolean = true) => {
    const idToUse = example.playgroundId || example.id;
    const id = idToUse ? (idToUse[0] === "#" ? idToUse : `#${idToUse}`) : "";
    return (example.type === "nme" ? "https://nme.babylonjs.com/" : "https://playground.babylonjs.com/" + (full ? "full.html" : "")) + id;
};

export const getExampleImageUrl = (example: Partial<IExampleLink>) => {
    const idToUse = example.playgroundId || example.id;
    return `/img/playgroundsAndNMEs/${example.type}${idToUse.replace(/#/g, "-")}.png`;
};

export const getImageUrl = (imageUrl?: string) => {
    return imageUrl || "/img/defaultImage.png";
};

export const getUrlById = (id: string[]) => {
    return `/${id.join("/")}`;
};

export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    options: {
        invokeOnFirstCall?: boolean;
        maxWait?: number;
    } = {},
) => {
    let timeout: number = 0;
    let lastInvocationTime: number = 0;

    function callFunc(args: Parameters<T>): void {
        lastInvocationTime = Date.now();
        func.apply(null, args);
    }

    function shouldInvoke(): boolean {
        const now = Date.now();
        const timeSinceLastInvocation = now - lastInvocationTime;

        return (options.maxWait && timeSinceLastInvocation >= options.maxWait) || (!lastInvocationTime && !!options.invokeOnFirstCall);
    }

    return (...args: Parameters<T>) => {
        if (shouldInvoke()) {
            callFunc(args);
        }

        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => callFunc(args), wait);
    };
};

export const throttle = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    return debounce(func, wait, { invokeOnFirstCall: true, maxWait: wait });
};
