import { FunctionComponent } from "react";
import Link from "next/link";
import { IDocumentationPageProps } from "../lib/content.interfaces";

export interface IBucketContentProps {
    childPages?: {
        [key: string]: IDocumentationPageProps;
    }
}

export const BucketContent: FunctionComponent<IBucketContentProps> = ({childPages}) => {
    return (
        <></>
        // <Columns breakpoint="tablet">
        //         {childPages &&
        //             Object.keys(childPages).map((child) => {
        //                 const childData = childPages[child].metadata;
        //                 const title = (childData.title || child).replace(/_/g, " ");
        //                 const link = "/" + childPages[child].id.join('/');
        //                 return (
        //                     <Columns.Column
        //                         tablet={{
        //                             size: "half",
        //                         }}
        //                         desktop={{
        //                             size: "half",
        //                         }}
        //                         widescreen={{
        //                             size: "one-third",
        //                         }}
        //                         fullhd={{
        //                             size: "one-quarter",
        //                         }}
        //                         key={child}
        //                     >
        //                         <Link href={link}>
        //                             <div>
        //                                 <Card className="document-card">
        //                                     <Card.Content>
        //                                         <Media>
        //                                             <Media.Item className="background-image-container" size={64} style={{ backgroundImage: `url(${childData.imageUrl})` }} renderAs="figure" position="left">
        //                                                 {/* <Image size={64} style={{opacity: 1}} alt={title} src={childData.imageUrl || "http://bulma.io/images/placeholders/128x128.png"} /> */}
        //                                             </Media.Item>
        //                                             <Media.Item>
        //                                                 <Heading size={4}>{title}</Heading>
        //                                                 <Heading subtitle size={6}>
        //                                                     {childData.description}
        //                                                 </Heading>
        //                                             </Media.Item>
        //                                         </Media>
        //                                         {/* <Content>This is the description of this file, will be taken from the metadata</Content> */}
        //                                     </Card.Content>
        //                                 </Card>
        //                             </div>
        //                         </Link>
        //                     </Columns.Column>
        //                 );
        //             })}
        //     </Columns>
    )
}