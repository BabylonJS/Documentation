import { IExampleLink } from "../content.interfaces";

export const getExampleLink = (example: IExampleLink) => {
    const id = example.id ? (example.id[0] === "#" ? example.id : `#${example.id}`) : "";
    return (example.type === "pg" ? "https://playground.babylonjs.com/full.html" : "https://nme.babylonjs.com/") + id;
};

export const getImageUrl = (imageUrl?: string) => {
    return imageUrl || "/img/defaultImage.png";
};

export const getUrlById = (id: string[]) => {
    return `/${id.join("/")}`;
};
