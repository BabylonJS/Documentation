---
title: Creating The Mini-fied Version of Babylon.js
image:
description: Learn how to create the mini-fied version of Babylon.js.
keywords: babylon.js, advanced, minified, thin
further-reading:
video-overview:
video-content:
---

To create the minified version of Babylon.js you just have to
use [gulp](https://github.com/BabylonJS/Babylon.js/tree/master/Tools/Gulp)

But you may want to work with all basic files. In this case, please download the code and use the following include (be aware to have the babylon folder at the root of your site. If you want to use your own shaders in this case, you just have to reference them with a "./" at beginning):

```html
<script src="tools/DevLoader/BabylonLoader.js"></script>
```

And add this command to your script:

```javascript
BABLONDEVTOOLS.Loader.load(function () {
  // Your code using Babylon.
});
```

This will take care of referencing all the required files and launch your code once ready.

If you need any script files to load after Babylon, you can require them:

```javascript
BABLONDEVTOOLS.Loader.require("index.js").load();
```

You can also control the root of your Babylon Folder:

```javascript
BABLONDEVTOOLS.Loader.root("../../").require("index.js").require("other.js").load();
```

When working with all files, you can provide the following information to the engine:

- BABYLON.Engine.CodeRepository: By default, this value points to "/src/"
- BABYLON.Engine.ShadersRepository: By default, this value points to "/src/Shaders/"
