---
title: Viewer Migration (V1 -> V2)
image:
description: Migrating from the V1 Babylon Viewer to V2
keywords: viewer, v1, v2, migration, upgrade
video-overview:
video-content:
---

While the Babylon team strives to maintain API backward compatibility, unfortunately it was not possible to have back compat *and* adopt modern tech for the V2 Babylon Viewer. One of the primary challenges is that V1 used [Handlebars](https://handlebarsjs.com/) which allows attributes and elements to be used interchangeably. For example, all of the following are equivalent with Handlebars:

```html
<babylon camera.behaviors.auto-rotate="0" />

<babylon>
  <camera behaviors.auto-rotate="0" />
</babylon>

<babylon>
  <camera>
    <behaviors auto-rotate="0" />
  </camera>
</babylon>
```

Handlebars was an OSS tech that predated [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements), the web standard that covers custom elements. As part of both modernizing the Babylon Viewer and shrinking bundle sizes, we wanted to move to web standards that are already supported by the browser. However, Web Components Custom Elements requires attributes to be statically declared, so the Handlebars attribute/element model cannot practically be retained.

This means some manual steps are required to migrate from Babylon Viewer V1 to V2. We don't currently have a migration guide or tooling, but if you run into problems migrating, please reach out on the [Babylon forum](https://forum.babylonjs.com/c/questions).
