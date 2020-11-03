/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.scss" {
    export const content: { [className: string]: string };
    export default content;
}

declare module '@mdx-js/react' {
    import * as React from 'react'
    type ComponentType =
      | 'a'
      | 'blockquote'
      | 'code'
      | 'delete'
      | 'em'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'hr'
      | 'img'
      | 'inlineCode'
      | 'li'
      | 'ol'
      | 'p'
      | 'pre'
      | 'strong'
      | 'sup'
      | 'table'
      | 'td'
      | 'thematicBreak'
      | 'tr'
      | 'ul'
    export type Components = {
      [key in ComponentType]?: React.ComponentType<{children: React.ReactNode}>
    }
    export interface MDXProviderProps {
      children: React.ReactNode
      components: Components
    }
    export class MDXProvider extends React.Component<MDXProviderProps> {}
  }

declare module "*.mdx" {
    let MDXComponent: (props: any) => JSX.Element;
    export default MDXComponent;
}
