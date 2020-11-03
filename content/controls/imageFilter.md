---
title: Image Filter Control
image: /img/pageImages/imageFilterControl.jpg
description: The Babylon.js Filter Control is a web control built on top of Babylon.js in order to apply filter to pictures in web pages with blazing fast speed.
keywords: web controls, hardware accelerated, 2D, filter, images
further-reading:
video-overview: 
video-content:
---

# Image Filter Control

The Babylon.js Filter Control is a web control built on top of Babylon.js in order to apply filter to pictures in web pages with blazing fast speed.

## Introduction
Filtering images to apply effect might be tedious and slow on the CPU. The best place to do so (for a wide variety of effects) is on the GPU. But setting up an entire WebGL pipeline simply to process images might be tricky even more if you wish to benefit from WebGL 2 to 1 fallback and workaround famous platform issues.

To greatly simplify this task we introduced the `ImageFilter` Control.

![ImageFilter](/img/features/controls/imageFilter.png)

## How to use

### Installation
To begin with the image filter control, you first need to install the controls npm package.

```
npm install @babylonjs/controls
```

To reduce the size of your web page, the controls library is based on the es6 version of `@babylonjs/core` used as a peer dependency. Therefore if you are not relying on it so far in you project, you also need to install core:

```
npm install @babylonjs/core
```

### Instantiation
Once done, you can now import the control in your code:

```
import { ImageFilter } from "@babylonjs/controls/imageFilter";
```

And simply instantiate it in your page:

```
const imageFilter = new ImageFilter(filterCanvas);
```

You simply need to provide a canvas on which we will be able to use a WebGL context. You could as well provide another Babylon.js control in order to share the WebGL context.

Also you, would you need more specific engine configurations, or if you want to use post processes, you should manually use your own engine:

```
const engine = new Engine(filterCanvas);
const imageFilter = new ImageFilter(engine);
```

By default the controls relies on ThinEngine in order to optimize your bundle but it might have some limitations you do not want to have as part of your experiences.

## Using Post Process
In order to apply a custom shader as the image filter, you can use the following code:

```
const blackAndWhitePostProcess = new BlackAndWhitePostProcess("bw", 1, null, undefined, engine);
backAndWhiteFilter.filter(imageToProcess, blackAndWhitePostProcess);
```

Where imageToProcess could be either:
* the url of a picture.
* a video element (the current visible frame of the video will be used)
* another canvas element (the current visible state will be used)

This will apply the post process to the provided input and display it in the canvas.

## Using Custom shader
In order to apply an existing post process as the image filter, you can use the following code:

```
const customEffectWrapper = new EffectWrapper({
    name: "Custom",
    engine: customFilter.engine,
    fragmentShader: `
        // Samplers
        varying vec2 vUV;
        uniform sampler2D textureSampler;
        
        void main(void) 
        {
            gl_FragColor = texture2D(textureSampler, vUV);

            // Swizzle channels
            float r = gl_FragColor.r;
            gl_FragColor.r = gl_FragColor.b;
            gl_FragColor.b = r;
        }
    `,
    samplerNames: ["textureSampler"]
});
customFilter.filter(imageToProcess, customEffectWrapper);
```

Where imageToProcess could be either:
* the url of a picture.
* a video element (the current visible frame of the video will be used)
* another canvas element (the current visible state will be used)

This will apply the custom shader in parameter to the picture. By default, `vUV` is available as a varying defining the full ouptput as texture coordinates. `textureSampler` needs to be present and defines the texture corresponding to the input parameter.

Please note that if you need to add custom unifoms or samplers, they should be defined in the effect wrapper list:

```
const customEffectWrapper = new EffectWrapper({
    name: "Custom",
    engine: customFilter.engine,
    fragmentShader: `
        varying vec2 vUV;
        
        // Default Sampler
        uniform sampler2D textureSampler;

        // Custom uniforms
        uniform sampler2D otherTexture;
        uniform vec3 colorOffset;

        const vec2 scale = vec2(0.25, 1.);

        void main(void) 
        {
            gl_FragColor = texture2D(textureSampler, vUV);

            // Swizzle channels
            float r = gl_FragColor.r;
            gl_FragColor.r = gl_FragColor.b;
            gl_FragColor.b = r;
            gl_FragColor.rgb += clamp(colorOffset, 0., 1.);

            gl_FragColor.rgb *= texture2D(otherTexture, vUV * scale).rgb;
        }
    `,
    // Defines the list of existing samplers (default + customs).
    samplerNames: ["textureSampler", "otherTexture"],
    // Defines the list of existing uniform to be bound.
    uniformNames: ["colorOffset"],
});
```

Then you can simply bind them either in `onApply`:

```
customEffectWrapper.onApplyObservable.add(() => {
    // Sets the custom values.
    customEffectWrapper.effect.setTexture("otherTexture", otherTexture);
    customEffectWrapper.effect.setFloat3("colorOffset", 0.2, 0, 0.2);
})
```

Or during the render loop:

```
// Rely on the underlying engine render loop to update the filter result every frame.
engine.runRenderLoop(() => {
    // Only render if the custom texture is ready (the default one is 
    // checked for you by the render function)
    if (!otherTexture.isReady()) {
        return;
    }

    // Sets the custom values.
    time += engine.getDeltaTime() / 1000;
    customEffectWrapper.effect.setTexture("otherTexture", otherTexture);
    customEffectWrapper.effect.setFloat3("colorOffset", Math.cos(time) * 0.5 + 0.5, 0, Math.sin(time) * 0.5 + 0.5);

    // Render. Please note we are using render instead of filter to improve 
    // performances of real time filter. filter is creating a promise and will therefore
    // generate some lags and garbage.
    customFilter.render(mainTexture, customEffectWrapper);
});
```

Finally, if you are relying on new textures, you need to wait for them to be ready before rendering.

## Process to the canvas
This is by far the simplest, if you have a canvas in your page. You simply need to use the following code to fit the provided element to the canvas size:

```
imageFilter.filter(imageToProcess, filter);
```

On the previous line, imageToResize could be either:
* the url of a picture.
* a video element (the current visible frame of the video will be used)
* another canvas element (the current visible state will be used)

This is the default behavior.

## Process to a Babylon Texture
Instead of filtering directly to a canvas, you could prefer to only create a Babylon.js texture on the GPU. For this, you can use the following function:

```
const texture = imageFilter.getFilteredTexture(imageToResize, { width: 128, height: 100 }, filter);
```

Like before, imageToResize could be either:
* the url of a picture.
* a video element (the current visible frame of the video will be used).
* another canvas element (the current visible state will be used).

You also need to provide the size you want your texture to have on the GPU.

Now you are free to use this texture with any other controls.

## Real Time filtering
Instead of filtering only one time, you might want to create dynamic real time effects. For this, you can simply render the effect during the render loop:

```
// Rely on the underlying engine render loop to update the filter result every frame.
engine.runRenderLoop(() => {
    // Only render if the custom texture is ready (the default one is 
    // checked for you by the render function)
    if (!otherTexture.isReady()) {
        return;
    }

    // Sets the custom values.
    time += engine.getDeltaTime() / 1000;
    customEffectWrapper.effect.setTexture("otherTexture", otherTexture);
    customEffectWrapper.effect.setFloat3("colorOffset", Math.cos(time) * 0.5 + 0.5, 0, Math.sin(time) * 0.5 + 0.5);

    // Render. Please note we are using render instead of filter to improve 
    // performances of real time filter. filter is creating a promise and will therefore
    // generate some lags and garbage.
    customFilter.render(mainTexture, customEffectWrapper);
});
```

This requires to use the render function instead of the filter one to enhance your experience performances.

## Full Code Sample

You can find the integrallity of the code sample above on [Github](https://github.com/BabylonJS/Controls/blob/master/www/imageFilter/index.ts) if you want to see it in action and better see how some of the functionnalities could be used.

## Live Demo

Please, have a look at the [Live Image Filter Demo](https://controls.babylonjs.com/imageFilter) to better appreciate how it works.
