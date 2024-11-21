import redirects from "../../redirects.json";
export function getRedirects() {
    // read the file redirects.json from the base directory
    // return the ids
    const ids = redirects.redirects.map((redirect: { source: string; destination: string }) => {
        const id = redirect.source.substring(1).split("/");
        return {
            params: {
                id,
            },
        };
    });
    return ids;
}

export function isRedirect(id: string[]) {
    const joined = "/" + id.join("/");
    return redirects.redirects.some((redirect: { source: string; destination: string }) => {
        return redirect.source === joined;
    });
}

export function getRedirect(id: string[]) {
    const joined = "/" + id.join("/");
    return (
        redirects.redirects.find((redirect: { source: string; destination: string }) => {
            return redirect.source === joined;
        }).destination || ""
    );
}
