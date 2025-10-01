import type { FunctionComponent } from "react";

import { useMemo, useState } from "react";

interface CodeSandboxProps {
    id: string;
    module?: string;
    title: string;
    editor?: boolean;
    preview?: boolean;
    height?: string;
}

export const CodeSandboxComponent: FunctionComponent<CodeSandboxProps> = (props) => {
    const { id, module = "%2Fsrc%2Findex.tsx", title, height = "400px" } = props;

    const view = useMemo(() => {
        let { editor, preview } = props;
        if (!editor && !preview) {
            editor = true;
            preview = true;
        }

        if (editor && preview) {
            return "editor+%2B+preview";
        } else if (editor) {
            return "editor";
        } else if (preview) {
            return "preview";
        }
    }, [props.editor, props.preview]);

    return (
        <div className="codesandbox-component">
            <iframe
                src={`https://codesandbox.io/embed/${id}?view=${view}&module=${module}&hidenavigation=1&fontsize=12`}
                style={{ width: "100%", height, border: "0", borderRadius: "4px", overflow: "hidden" }}
                title={title}
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
        </div>
    );
};
