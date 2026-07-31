---
title: Azure Media Player 360 Video Plugin
image: /img/pageImages/AMP360Video.webp
description: The Azure Media Player 360 Video Plugin is a handy 360 video plugin for easy integration into your Babylon.js 360 Web Apps.
keywords: extensions, AMP, Azure Media Player, Azure 360 Video, 360, 360 Video, plugin
further-reading:
video-overview:
video-content:
---

# Azure Media Player 360 Video Plugin

The Azure Media Player 360 Video Plugin is a handy 360 video plugin for easy integration into your Babylon.js 360 Web Apps.

## Introduction

The [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html) 360 Video plugin for AMP (aka [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html)) uses Babylon.js to facilitate the integration of 360 videos into your web app.

The plugin natively supports VR headsets (Windows Mixed Reality, etc.).

{/* [Online Demo of the plugin](https://www.babylonjs.com/Demos/Amp360Video/) */}

## How to Run Locally

First, clone the Babylon.js extensions repository:

```bash
git clone https://github.com/BabylonJS/Extensions.git
```

Once the repository has been cloned, open a command prompt in the Amp360Video folder.

Then, type the following commands:

```bash
npm install
npm start
```

The hosting web page will automatically open (using webpack-dev-server).

## How it works

The 360 video plugin is a [videojs](https://docs.videojs.com/tutorial-plugins.html) plugin compatible with AMP versions 2.1.7 through the latest supported version (2.2.3 at the time of writing).

The plugin depends on Babylon.js in order to enable 3D functionalities in AMP.

For more information about AMP, you can access their [documentation](http://amp.azure.net/libs/amp/latest/docs/index.html).

## How to use it on your website

After deploying the bundled JavaScript file [`dist/amp-360video.js`](https://raw.githubusercontent.com/BabylonJS/Extensions/master/Amp360Video/dist/amp-360video.js) from the dist directory to your website, you can follow the steps below.

> Note: If you used the plugin before, you might have needed to reference Babylon.js in your site. We now provide a bundle that keeps delivery as small as possible, so the Babylon.js reference is no longer required.

## External Resources

Include the following resources in your HTML:

```html
<!-- Link to pep.js to ensure pointer events work consistently in all browsers -->
<script src="https://code.jquery.com/pep/0.4.1/pep.js"></script>

<!-- Link to the AMP resources -->
<link href="https://amp.azure.net/libs/amp/2.2.3/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
<script src="https://amp.azure.net/libs/amp/2.2.3/azuremediaplayer.min.js"></script>
```

## Plugin Script

Include the link to your previously downloaded plugin script in your HTML:

```html
<!-- Link to the plugin file -->
<script src="amp-360video.js"></script>
```

## Plugin Setup

You can either embed the plugin in your HTML or initialize it in code, as specified in the [AMP documentation](http://amp.azure.net/libs/amp/latest/docs/index.html#plugins).

### Html Initialization

Add the **threeSixty plugin** to your video data-setup:

```html
<video playsinline crossorigin="anonymous" class="azuremediaplayer amp-default-skin amp-big-play-centered" autoplay controls width="100%" height="100%" data-setup='{ "techOrder": ["azureHtml5JS", "html5"], "plugins": { "threeSixty": { } } }'>
    <source src="//willzhanmswest.streaming.mediaservices.windows.net/1f2dd2dd-ee99-40be-aae9-d0c2209982eb/DroneFlightOverLasVegasStripH3Pro7.ism/Manifest" type="application/vnd.ms-sstr+xml" />
    <p class="amp-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
    </p>
</video>
```

The only difference from your default AMP initialization is the presence of the 360 plugin:

```javascript
"plugins": { "threeSixty": { } }'
```

One example can be found in the _index.html_ file located in the [repo](https://github.com/BabylonJS/Extensions/blob/master/Amp360Video/index.html).

### Code Initialization

The following code initializes the plugin in your AMP player:

```javascript
const myPlayer = amp(
  "videoPlayer",
  {
    nativeControlsForTouch: false,
    autoplay: false,
    controls: true,
    width: "640",
    height: "480",
    poster: "",
    techOrder: ["azureHtml5JS", "html5"],
    plugins: {
      threeSixty: {
        enableVR: true,
      },
    },
  },
  function () {
    console.log("Good to go!");
    // add an event listener
    this.addEventListener("ended", function () {
      console.log("Finished!");
    });
  },
);

myPlayer.src([
  {
    src: "//willzhanmswest.streaming.mediaservices.windows.net/1f2dd2dd-ee99-40be-aae9-d0c2209982eb/DroneFlightOverLasVegasStripH3Pro7.ism/Manifest",
    type: "application/vnd.ms-sstr+xml",
  },
]);
```

One example can be found in the indexCode.html file located in the [repo](https://github.com/BabylonJS/Extensions/blob/master/Amp360Video/indexCode.html).

## Define the 360 video format (Monoscopic, Side by Side, Top Bottom)

Several types of 360 video exist today. The most common are Monoscopic Panoramic, Stereoscopic Side by Side panoramic, and Top Bottom panoramic.

The first represents a panoramic view dedicated to one eye. The second contains two panoramic views, one for each eye, whereas the last contains both panoramic views on the top and bottom of the video, respectively.

The plugin defaults to Monoscopic panoramic mode.

In order to specify the type of your source (this can unfortunately not be automated in the plugin), you can specify a different value in your options:

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "videoType": "stereoscopicTopBottom" } }
```

The available types are: "monoscopicPanoramic", "stereoscopicSideBySide", "stereoscopicTopBottom".

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        videoType: "stereoscopicTopBottom"
    }
}
```

The available types are: "monoscopicPanoramic", "stereoscopicSideBySide", "stereoscopicTopBottom".

## Enable/Disable the VR Button

By default, the plugin includes a VR mode available through a button shaped like a head-mounted display.

In order to disable the button, you can specify in your options:

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "enableVR": false } }
```

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        enableVR: false
    }
}
```

## Update the camera FOV

By default, the plugin uses a camera with a 1.18-radian field of view.

In order to change it if needed, you can specify a different value in your options:

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "fov": 1 } }
```

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        fov: 1
    }
}
```

## Update the default camera orientation

If the camera is not looking where you expect when the video starts, you can use the defaultCameraOrientationX and defaultCameraOrientationY options to adjust the camera's starting point for your use case. These properties are angles around the x and y axes, respectively, defined in radians.

In order to change them, you can specify a different value in your options:

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "defaultCameraOrientationX": 1 } }
```

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        defaultCameraOrientationY: 1
    }
}
```

## Disable WebGL2

The default setup enables WebGL2 to enhance application performance. If you encounter compatibility issues across platforms and want to disable it, you can use the setup below:

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "disableWebGL2Support": true } }
```

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        disableWebGL2Support: true
    }
}
```

## Adapt to native resolution

To provide the best performance, the plugin does not account for your [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) setup by default. It renders 1 to 1 with CSS pixels. On a HiDPI or Retina display, the ratio might be quite high, which means that if you want to make full use of your pixels (using physical pixels), the plugin may need to render, for example, four times more pixels than the actual CSS pixel count.

You can use the plugin's hardwareScalingLevel setting to choose how many times the physical pixels of your device are multiplied to define the number of CSS pixels. For instance, a value of 0.5 means there would be twice as many pixels in width and height as the number of CSS pixels, which greatly enhances the resolution.

### By HTML configuration

In the data-setup plugin section:

```javascript
"plugins": { "threeSixty": { "hardwareScalingLevel": 0.5 } }
```

### By code configuration

This works exactly the same as the previous point. In the options of your plugin:

```javascript
plugins: {
    "threeSixty": {
        hardwareScalingLevel: 0.5
    }
}
```
