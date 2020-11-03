import { IExampleLink } from "../content.interfaces";

export const getExampleLink = (example: IExampleLink) => {
    const id = example.id ? (example.id[0] === "#" ? example.id : `#${example.id}`) : "";
    return (example.type === "pg" ? "https://playground.babylonjs.com/full.html" : "https://nme.babylonjs.com/") + id;
};
