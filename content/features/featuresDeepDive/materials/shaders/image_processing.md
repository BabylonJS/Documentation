---
title: Image Processing
image:
description: Learn all about image processing in Babylon.js.
keywords: babylon.js, advanced, image processing
further-reading:
video-overview:
video-content:
---

In case you are using an `ImageProcessingPostProcess` on your scene, or another post process that may use `ImageProcessingPostProcess` under the hood, like `MotionBlurPostProcess`, you will notice a slightly different color output in the final image, compared to what you want to output with `gl_FragColor`.

This is due to the fact that `ImageProcessingPostProcess` is expecting a linear color input, and therefore converts every pixel to gamma color space. If you want to read more about linear color space versus gamma color space, read [this](https://en.wikipedia.org/wiki/Gamma_correction).

## Fix my pixel shader

To spare you the reading, basically, your `gl_FragColor` is put to the power `1 / 2.2`, which we call a standard gamma transformation.

In order to counteract that, you should apply the opposite transformation, which is, in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) language :

```
#ifdef IMAGEPROCESSINGPOSTPROCESS
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(2.2));
#endif
```

Of course you want to only have this additional line in your shader in case an `ImageProcessingPostProcess` is active on your scene. That's why you must enclose this in a `#define` statement.

For convenience, we added a small shader include that does just that. You can add this after every `gl_FragColor` output :

```
#include<imageProcessingCompatibility>
```

Now you need to toggle that define based on the presence of an `ImageProcessingPostProcess`.
In your material code, it should resemble something like this :

```
defines.IMAGEPROCESSINGPOSTPROCESS = scene.imageProcessingConfiguration.applyByPostProcess;
```

And now, whether you have the post-process active or not, the color should be similar !

### Further Reading

You may have a similar problem if you want to use fog on your scene, with a custom shader material.

[Here](/features/featuresDeepDive/materials/shaders/Fog+ShaderMat) is a helpful page to get your shaders to be fog-ready.

## Tonemapping

If you are using tonemapping on your materials, it can happen that your image appears brighter than expected. It means that several image processing are applied in your pipeline.

Some post processes internally use a prepass to get some information, and this prepass proceeds to some image processing itself. In that case, color can be processed several times which is incorrect. For instance, it can happen if you use `pbr.imageProcessingConfiguration = myImageProcessingConfiguration;` along with an `SSAO2RenderingPipeline`.

So if you notice that problem, try to manually deactivate the gamma transform from the prepass :

```javascript
scene.enablePrePassRenderer().disableGammaTransform = true;
```

Colors should then behave as expected from your `imageProcessingConfiguration`.
