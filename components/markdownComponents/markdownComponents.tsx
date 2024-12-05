import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { PlaygroundMarkdownComponent, NMEMarkdownComponent, NGEMarkdownComponent } from "./example.component";
import { ImageMarkdownComponent } from "./image.component";
import { YoutubeComponent, MediaFileComponent } from "./media.component";
import { AlertMarkdownComponent, SyntaxHighlighting } from "./syntaxHighlight.component";
import { H1MarkdownComponent, H2MarkdownComponent, H3MarkdownComponent, H4MarkdownComponent } from "./tableOfContentItem.component";
import { CodePenComponent } from "./codepen.component";

export const markdownComponents = {
    Alert: AlertMarkdownComponent,
    Youtube: YoutubeComponent,
    Media: MediaFileComponent,
    Playground: PlaygroundMarkdownComponent,
    CodePen: CodePenComponent,
    nme: NMEMarkdownComponent,
    NME: NMEMarkdownComponent,
    nge: NGEMarkdownComponent,
    NGE: NGEMarkdownComponent,
    pre: (props) => <div {...props} />,
    code: SyntaxHighlighting,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    img: ImageMarkdownComponent,
    h1: H1MarkdownComponent,
    h2: H2MarkdownComponent,
    h3: H3MarkdownComponent,
    h4: H4MarkdownComponent,
    H2Image: H2MarkdownComponent,
    H3Image: H3MarkdownComponent,
};