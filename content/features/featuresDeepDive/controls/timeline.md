---
title: Timeline Control
image: /img/pageImages/timelineControl.jpg
description: The Babylon.js Timeline Control is a web control built on top of Babylon.js that accelerates some of the typical features associated with video timelines.
keywords: web controls, hardware accelerated, 2D, timeline, video, thumbnails
further-reading:
video-overview: 
video-content:
---

# Video Timeline Control

The Babylon.js Timeline Control is a web control built on top of Babylon.js that accelerates some of the typical features associated with video timelines.

## Introduction
One of the inherent issue encountered while scrolling in a video timeline built from IMG tags is perfomance caveats. The bigger the number of pictures to scroll through, the slower and less smooth the interactions with the web page would be.

In order to increase the reactivity of the web page, we rely here on WebGL through Babylon.js to create an easy to reuse control displaying a video timeline.

![Timeline](/img/features/controls/timeline.png)

## How to use

### Installation
To begin with the timeline, you first need to install the controls npm package.

```
npm install @babylonjs/controls
```

To reduce the size of your web page, the controls library is based on the es6 version of `@babylonjs/core` used as a peer dependency. Therefore if you are not relying on it so far in you project, you also need to install core:

```
npm install @babylonjs/core
```

### Instantiation
Once done, you can now import the timeline in your code:

```
import { Timeline } from "@babylonjs/controls/timeline";
```

And simply instantiate it in your page:

```
const timeline = new Timeline(timelineCanvas, {
        totalDuration: 60,
        thumbnailWidth: 128,
        thumbnailHeight: 120,
        loadingTextureURI: "./assets/loading.png",
        getThumbnailCallback: (time: number, done: (input: any) => void) => {
            // This is strictly for demo purpose and should not be used in prod as it creates as many videos
            // as there are thumbnails all over the timeline.
            const hiddenVideo = document.createElement("video");
            document.body.append(hiddenVideo);
            hiddenVideo.style.display = "none";

            hiddenVideo.setAttribute("playsinline", "");
            hiddenVideo.muted = true;
            hiddenVideo.autoplay = navigator.userAgent.indexOf("Edge") > 0 ? false : true;
            hiddenVideo.loop = false;

            hiddenVideo.onloadeddata = () => {
                if (time === 0) {
                    done(hiddenVideo);
                }
                else {
                    hiddenVideo.onseeked = () => {
                        done(hiddenVideo);
                    }
                    hiddenVideo.currentTime = time;
                }
            }

            hiddenVideo.src = "./assets/test.mp4?" + time;
            hiddenVideo.load();
        }
    });
```

The main element to provide is a canvas on which we will be able to use a WebGL context to render the timeline. You could as well provide another Babylon.js control in order to share the WebGL context. For instance you could share the context this way with a Resizer in order to allow directly using a resized image as a thumbnail without extra copy.

As we do not want to be opiniated about the UX you prefer or about the thumbnail generation itself it is all left to your implementation. The only information you need to provide are:

* *totalDuration*: the full duration of the video to cover (use to compute when all the thumbnails should be generated).
* *thumbnailWidth*: define the width of your generated thumbnails (use during the rendering to know how much space they should take in the timeline)
* *thumbnailHeight*: define the height of your generated thumbnails (use to keep the ratio intact with the width previously defined)
* *loadingTextureURI*: define the url of an image used as a temporary replacement for not fully loaded thumbnail (this will help handling network latency gracefully)
* *getThumbnailCallback*: last, but definitely not the least, a callback where you will be able to provide the thumbnail fitting with the requested time in parameter. You can return through the done function either a video element set on the right frame (as done in the previous code sample), a canvas element containing for instance some pre processed data or some image URL. More choices will probably be added here to for instance support texture atlas as it might be a nice transport format.

You can also provide some none mandatory options:
* *useClosestThumbnailAsLoadingTexture*: it is set to true by default and if enabled, it will try to use the closest loaded thumbnail (in time) instead of the loading one as soon as some of them are ready.

### Render Loop

Finally, you can start rendering the thumbnails:

```
    timeline.runRenderLoop();
```

It is also possible to pass a custom callback to this method to ensure that some custom code would run every frame before rendering the timeline:

```
    timeline.runRenderLoop(() => {
        // Sync the timeline with a playing video
        if (!mainVideo.paused) {
            timeline.setCurrentTime(mainVideo.currentTime);
        }
    });
```

### Changing the current zoom level

By default, the timeline is not zoomed at all, it shows as many thumbnails as fit in the canvas distributed evenly along the entire video.

You can zoom until you see one thumbnail per chosen time unit of the video (so if the total duration is 60 and you are zoomed at 100%, you will be able to see 60 thumbnails in total when scrolling from left to right).

To zoom in/out, you can call the following code:

```
    // value is the percentage of zoom desired 0 for the entire video 100 for one thumbnail per unit
    timeline.setVisibleDurationZoom(value);
```

### Changing the current time

As changing the zoom level does not change the number of visible thumbnails, you need a way to control where you currently are in the list of thumbnails. The following code can be use to do so:

```
    // Sets the left side of the canvas to the current chosen time
    // The rest of the visible thumbnails are evenly distributed according to the chosen
    // zoom level.
    timeline.setCurrentTime(value);
```

The current time will be automatically bound between 0 and the max available position.

### Cache Warm Up

In case you have some of the thumbnails ready before waiting for the callback, you can submit them into the cache like this:

```
    timeline.addThumbnail(textureData, time);
```

The textureData type are the same allowed to be returned in the callback: a texture, a video, a canvas or an image url.

This can help if you generate the thumbnails client side to warm up the cache and thus reduce the thumbnails load time.

## Full Code Sample

You can find the integrallity of the code sample above on [Github](https://github.com/BabylonJS/Controls/blob/master/www/timeline/index.ts) if you want to see it in action and better see how some of the functionnalities could be used.

## Live Demo

Please, have a look at the [Live Timeline Demo](https://controls.babylonjs.com/timeline) to better appreciate how it works.
