interface CodePenProps {
    pen: string;
    title: string;
    tab?: string;
    height?: string;
}

export function CodePenComponent(props: CodePenProps) {
    console.log(props);
    return (
        <div className="codepen-component">
            <iframe
                src={`https://codepen.io/team/codepen/embed/preview/${props.pen}?height=265&theme-id=dark&default-tab=${props.tab || "js,result"}`}
                style={{ width: "100%", height: props.height || "400px", border: "0", borderRadius: "4px", overflow: "hidden" }}
                title={props.title}
                loading="lazy"
            />
            <p>
                See the Pen <a href={`https://codepen.io/BabylonJS/pen/${props.pen}/`}>{props.title}</a> by Babylon.js (<a href="https://codepen.io/BabylonJS">@BabylonJS</a>).
            </p>
        </div>
    );
}
