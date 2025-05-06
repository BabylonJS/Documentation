---
title: The Asset Librarian
image-url: /img/defaultImage.png
description: Learn how to easily add free open source assets to your Babylon.js scene.
keywords: babylon.js, tools, resources, playground, assets, models, textures, NME, procedural, sound
further-reading:
video-overview:
video-content:
---

## The Asset Librarian

Babylon.js provides a large asset library of free models, environments, textures, materials, particles, sounds, etc. These assets are free for you to use under the [Creative Commons 0](https://creativecommons.org/share-your-work/public-domain/cc0/) license.

Intrdouced in Babaylon.js 5.0, the Asset Librarian is an incredibly simply tool allowing you to access this full library of content directly in the playground with simple lines of code.

Using the "Assets" namespace, you can easily add any asset into your scene.

For example adding the Pirate Fort mesh into your scene is as simple as this:

```javascript
BABYLON.ImportMeshAsync(Assets.meshes.pirateFort.rootUrl + Assets.meshes.pirateFort.filename, scene);
```

<Playground id="#ABDDD6#122" title="Load a Mesh Using the Asset Librarian" description="Simple example of how to use the Asset Librarian to load mesh into the scene." isMain={true} category="Import"/>

## Adding To the Asset Library

The raw files for the assets available through the Asset Librarian can be found in the [Babylon.js Assets Github Repository](https://github.com/BabylonJS/Assets).

This library of assets is free, open-source, and available for anyone to use under the [Creative Commons 0](https://creativecommons.org/share-your-work/public-domain/cc0/) license.

If you would like to contribute your own assets to the asset repository, you are ABSOLUTELY encouraged to do so. This is the spirit of Open Source Software.

We will gladly accept assets that:

1. Are family-friendly, safe, and welcoming to everyone.
2. Can be useful to anyone (no custom airplane turbine mounting bracket CAD files please)

Please be aware that the Babylon Development Team reserves the right to accept, decline, or remove ANY asset being contributed to this library for any reason, including: overusing hosting resources, content that is not family-friendly, safe, or welcoming of everyone, content that does not benefit the greater community.

Also please understand that by contributing your assets to the asset repository, you are offering your assets freely under the [Creative Commons 0](https://creativecommons.org/share-your-work/public-domain/cc0/) license. Only assets that are given freely to the public domain will be accepted.
