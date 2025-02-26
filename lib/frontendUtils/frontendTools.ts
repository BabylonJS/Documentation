import { IExampleLink } from "../content.interfaces";

export const getExampleLink = (example: Partial<IExampleLink>, full: boolean = true) => {
    const idToUse = example.playgroundId || example.id;
    const id = idToUse ? (idToUse[0] === "#" ? idToUse : `#${idToUse}`) : "";
    // webgpu parameter. Stay safe and validate
    let params = example.engine && example.engine === "webgpu" ? `?${example.engine}` : "";
    if(example.version) {
        params += params ? `&version=${example.version}` : `?version=${example.version}`;
    }
    if(example.snapshot) {
        params += params ? `&snapshot=${example.snapshot}` : `?snapshot=${example.snapshot}`;
    }
    switch (example.type) {
        case "nge":
            return `https://nge.babylonjs.com/${id}`;
        case "nme":
            return `https://nme.babylonjs.com/${id}`;
        case "pg":
        default:
            return `https://playground.babylonjs.com/${full ? "full.html" : ""}${params}${id}`;
    }
};

export const getExampleImageUrl = (example: Partial<IExampleLink>) => {
    const idToUse = example.playgroundId || example.id;
    return `/img/playgroundsAndNMEs/${example.type}${idToUse.replace(/#/g, "-")}.png`;
};

export const getImageUrl = (imageUrl?: string, baseUrl?: string) => {
    const imgUrl = imageUrl || "/img/defaultImage.png";
    return imgUrl.startsWith("http") ? imgUrl : baseUrl ? baseUrl + imgUrl : imgUrl;
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
