/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.scss' {
    export const content: { [className: string]: string };
    export default content;
}