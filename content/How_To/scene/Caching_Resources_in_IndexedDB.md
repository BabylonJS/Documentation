---
title: Optimizing Using Cached Resources
image: 
description: Learn how to optimize your scene using cached resources in Babylon.js.
keywords: diving deeper, scene, optimization, optimize, cache
further-reading:
video-overview:
video-content:
---

# How To Optimize Using Cached Resources

By default, all texture contents are cached by the engine, so if you load the same texture twice, it will be instant (and resource will be shared to save memory).

Starting with the **1.4 release** of Babylon.JS, you can indicate that you want to **cache the resources associated with your scene/game** inside the local **IndexedDB** of the browser. It can enhance the gamer experience as the JSON and textures files can be directly loaded from the database rather than from the web.

## Usage

To enable offline support, the first thing you need to do is create a _**.manifest**_ file associated with your scene. It should be named _NameOfYourScene.babylon.manifest_.

**Starting with Babylon.js v4.0 you also have to turn the feature on with:**
```
BABYLON.Database.IDBStorageEnabled = true;
```

**Note:** by default, the Babylon engine is configured to use online resources. So if you don’t provide any .manifest file, it will assume that you want the resources to be loaded directly from the web all the time.

Inside this **.manifest** file, insert the following piece of JSON:

```javascript
{
  "version" : 1,
  "enableSceneOffline" : true,
  "enableTexturesOffline" : true
}
```

When you’re loading a scene using the Babylon engine, one of the first things it will try is loading this manifest file and checking this JSON description. If not found (404), it will directly load the resources from the web. If found, it will load the values. You can then change those values anytime, they will be verified every time the engine loads your scene.

You have 3 parameters to fill:

1. The first one is _**version**_ and must be an integer. It’s simply the current version of your assets. If you’re changing it, the Babylon engine will detect that change during the next reload of your scene. This will force a complete reload amp; update of all the assets into the browser’s database. This can be useful is you want to be sure that the client browser is using up-to-date textures or scene description recently put on your web server.

2. The second parameter _**enableSceneOffline**_ is a boolean. If set to true, you will be asking to load the JSON associated with your scene (the file with the .babylon extension) and store it into the local database of the user. Next time the user loads the game, the scene description will be directly loaded from the DB rather than from the hosting web server.

3. The third parameter _**enableTexturesOffline**_ is also a boolean. This time, you will be asking the Babylon engine to load all textures (PNG or JPG files) and store them into the local database of the user. Thus, the textures will be directly streamed from the database rather than the web server.

**Note:** images are loaded using XHR2 in the blob format. IE11, Firefox and Chrome 37+ support the storing of blob data into the IndexedDB. [More details](http://caniuse.com/#search=indexeddb)

## Exceptions
If you do not want to enable offline mode, you can set `engine.enableOfflineSupport = false`. This will completely turn off the feature.
If you want more fine-grained control, you can use the `scene.disableOfflineSupportExceptionRules` array:

```
scene.disableOfflineSupportExceptionRules.push(/dude\.babylon/gi);
```

## Samples

Most of the samples on our [website mainpage](https://www.babylonjs.com) are configured to use offline for their scene and textures. For instance, you can try the [Espilit scene](https://www.babylonjs.com/demos/glowingespilit/). The scene is described in _espilit.babylon_ and the associated manifest file is _espilit.babylon.manifest_.

One of the scenes is configured to only cache the texture. It’s the “[The Car](https://www.babylonjs.com/demos/thecar/)” scene. It’s because the JSON file, _TheCar.babylon_, is more than 93 MB. IE11 and Chrome can’t store a big file like that into their DB, so decision was made to avoid trying to cache it.