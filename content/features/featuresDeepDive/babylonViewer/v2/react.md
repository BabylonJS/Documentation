---
title: Viewer & React
image:
description: Using the Viewer with React.
keywords: viewer, react, jsx
further-reading:
    - title: Viewer Migration (V1 -> V2)
      url: /features/featuresDeepDive/babylonViewer/migrationGuide
video-overview:
video-content:
---

The  `HTML3DElement` (`<babylon-viewer>`) is an HTML custom element that is most easily used directly in HTML. There are many popular frameworks that layer on top of HTML though, with React being one such framework that is very widely used.

There are a couple of ways to use the Babylon Viewer in these types of Frameworks, and particularly with React.

1. Use the `CreateViewerForCanvas` function to build a framework specific layer on top of the low level Viewer (e.g. a sibling of the `HTML3DElement` that is framework specific). If there is enough [community interest](https://forum.babylonjs.com/t/babylon-viewer-v2/54317) in this, the Babylon team may provide an implementation.
1. Use the `HTML3DElement` (`<babylon-viewer>`) directly in React. There are some limitations with this approach that don't fit super well with the React component model, particularly the fact that properties map to element attributes, and attributes can only be strings. This can be awkward in React where developers are used to passing in objects, callbacks, etc. as property values. If you want to try this option, and you are using TypeScript, you'll need to add JSX type declarations for the `HTML3DElement` (`<babylon-viewer>`). For example, here is a partial type declaration that only includes the `source` and `environment` attributes:

```typescript
interface HTML3DElementAttributes
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  source?: string;
  environment?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'babylon-viewer': HTML3DElementAttributes;
    }
  }
}
```
