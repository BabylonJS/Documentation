# How To Use PostProcess
Postprocesses allow you to create 2D effects on top of your scene.
A postprocess is linked to a camera and can be part of a chain of postprocesses where each postprocess uses the result of the previous one as input for its own processing.

## Base postprocess
Every postprocess is based upon ```BABYLON.PostProcess``` which uses this constructor:

```javascript
BABYLON.PostProcess = function (name, fragmentUrl, parameters, samplers, ratio, camera, samplingMode, engine, reusable)
```

We will get back to _fragmentUrl_, _parameters_ and _samplers_ parameters.

The _ratio_ is used to define the size of the postprocess (0.5 means that your postprocess will have a width = canvas.width * 0.5 and a height = canvas.height * 0.5).

The _camera_ parameter specifies which camera to attach to. If creating a post process to be managed by a render pipeline this should be set to null. See [Post Process Pipeline](/how_to/how_to_use_postprocessrenderpipeline)

The _samplingMode_ can be one of the following:
* BABYLON.Texture.NEAREST_SAMPLINGMODE
* BABYLON.Texture.BILINEAR_SAMPLINGMODE (**default**)
* BABYLON.Texture.TRILINEAR_SAMPLINGMODE

Please note that postprocess with trilinear sampling will be force to have a power of two size (256, 512, 1024, etc.)

The _engine_ parameter is the engine where you want to attach your postprocess.

The _reusable_ paameter indicates if your postprocess can be reused multiple times on the same camera (default is false).

## Additional parameters
By default (and if you are not using trilinear sampling) the postprocesses used the size of the screen scaled by the ratio you provide. But you can decide to force them to be rescaled to a power of two size in order to be more efficient. To enable this, just call `mypostprocess.alwaysForcePOT = true`.

You can also control how the size is chosen by setting `mypostprocess.scaleMode` to one of these values:
* BABYLON.Engine.SCALEMODE_FLOOR: Will fint the next lowest power of two.
* BABYLON.Engine.SCALEMODE_NEAREST: Will fint the nearest power of two.
* BABYLON.Engine.SCALEMODE_CEILING: Will fint the next highest power of two.

You can also control if the postprocess is cleared upon rendering with `mypostprocess.autoClear = true`. This is the default behavior.

If you turn off autoClear, you will be able to blend the render of the postprocess with its previous content by defining an alphaMode with `mypostprocess.alphaMode = BABYLON.Engine.ALPHA_COMBINE`.

This could be really useful when you have multiple postprocesses enabled together. You can even choose to share the output of several postprocesses with `mypostprocess.shareOutputWith(anotherPostprocess)`.

## Attach postprocess
Depending on how you have defined a postprocess, it can be attached one or more times to the same camera.
The same instance can also be attached to multiple cameras.

A camera has two methods:
#### **attachPostProcess**

```javascript
NUMBER function(PostProcess postProcess [,NUMBER atIndice])
```

#### **detachPostProcess**

```javascript
NUMBER function(PostProcess postProcess [,NUMBER[] atIndices])
```

# Builtin postprocesses
Babylon.js comes with a set of ready to use postprocesses.

## Pass
Do nothing. Used to copy the framebuffer into a postprocess for further use

```javascript
var postProcess = new BABYLON.PassPostProcess("Scene copy", 1.0, camera);
```

### Black and white
Apply a black and white effect:

```javascript
var postProcess = new BABYLON.BlackAndWhitePostProcess("bandw", 1.0, camera);
```

### Blur
Apply a directional blur using a kernel based blur:

```javascript
var postProcess = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), kernel, 0.25, camera);
```

The kernel value will define the ideal number of taps done by the postprocess. The postprocess will then adapt the kernel based on screen size and DPI resolution.

For instance here is an example with a kernel value of 32: https://www.babylonjs-playground.com/#FBH4J7#3
Or 256: https://www.babylonjs-playground.com/#FBH4J7#4

Obviously, as usual, try to stay reasonable with kernel size as it will impact the overall rendering speed.

### Convolution
Apply a kernel matrix to every pixel:

```javascript
var postProcess = new BABYLON.ConvolutionPostProcess("Sepia", BABYLON.ConvolutionPostProcess.EmbossKernel, 1.0, camera);
```

### FXAA
Apply a full screen antialiasing filter:

```javascript
var postProcess = new BABYLON.FxaaPostProcess("fxaa", 1.0, camera);
```

### Highlights
Apply a full screen highlight filter which will increment the luminosity of highlihts in your scene:

```javascript
var postProcess = new BABYLON.HighlightsPostProcess("highlights", 1.0, camera);
```

### Tonemap
Apply a full screen tone mapping filter:

```javascript
var postProcess = new BABYLON.TonemapPostProcess("tonemap", BABYLON.TonemappingOperator.Hable, 0.8, 1.0, camera);
```
The second parameter helps defining which operator will be used among the following ones:
* BABYLON.TonemappingOperator.Hable
* BABYLON.TonemappingOperator.Reinhard
* BABYLON.TonemappingOperator.HejiDawson
* BABYLON.TonemappingOperator.Photographic

The third parameter define the exposure adjustement.

You can find a demo here: https://www.babylonjs-playground.com/debug.html#J9H084#8

### ImageProcessing
Apply a complete range of special image treaments (image processing):

```javascript
var postProcess = new BABYLON.ImageProcessingPostProcess("processing", 1.0, camera);
```

You have several options available:
* colorGradingTexture: Used to provide a color grading texture applied on your scene. You can use:
    * a [colorGradingTexture](//doc.babylonjs.com/api/classes/babylon.colorgradingtexture) using a [.3dl](https://en.wikipedia.org/wiki/3D_lookup_table) format. Demo: https://www.babylonjs-playground.com/#17VHYI#15
    * a standard texture (using .png for example) but with _invertY_ set to _true_, wrap mode as clamp and _imageProcessingConfiguration.colorGradingWithGreenDepth_ set to _false_. Demo: https://www.babylonjs-playground.com/#17VHYI#9
* colorCurves: Used to provide several properties to change colors. More [details here](/overviews/physically_based_rendering_master#color-curves). Demo: https://www.babylonjs-playground.com/#J9H084#12
* contrast: 1.0 by default. Used to change the contrast. Demo: https://www.babylonjs-playground.com/#J9H084#9
* exposure: 1.0 by default. Used to change the exposure of the image. Demo: https://www.babylonjs-playground.com/#J9H084#10

You can also use this postprocess to enable a vignette effect. The vignette is positioned thanks to the following parameters:
* vignetteStretch: 0 by default
* vignetteCentreX: X coordinate of the center (0,0 is the center of the screen)
* vignetteCentreY: Y coordinate of the center (0,0 is the center of the screen)
* vignetteWeight: 1.5 by default
* vignetteColor: Color4 value to define the overall color
* vignetteBlendMode: BABYLON.ImageProcessingPostProcess.VIGNETTEMODE_MULTIPLY or BABYLON.ImageProcessingPostProcess.VIGNETTEMODE_OPAQUE

You can find a demo of the vignette here: https://www.babylonjs-playground.com/#J9H084#11

All features can be turned on and off with the following booleans:
* colorCurvesEnabled
* vignetteEnabled
* cameraToneMappingEnabled
* colorGradingEnabled

#### Configuration

Image postprocessing can be done with the ImageProcessingPostProcess but you can also use StandardMaterial and PBRMaterial built-in image processing features. To simplify the overall configuration of your image processing setup, you can define the properties you want on `scene.imageProcessingConfiguration`.
This object hosts the same properties as the ImageProcessingPostProcess.

By default, ImageProcessingPostProcess, StandardMaterial and PBRMaterial share the same configuration object (The one from the scene). This means that if you change a value on `scene.imageProcessingConfiguration` or directly on ImageProcessingPostProcess, StandardMaterial or PBRMaterial, this will affect all entities sharing the same configuration.

Here is an example of a global configuration: https://www.babylonjs-playground.com/#J9H084#13

Furthermore, as they share the same configuration, you can just dispose a postprocess you were using and automatically the image processing will be done at materials level. So here is an example of a configuration done at scene level, but with no postprocess to use it: https://www.babylonjs-playground.com/#J9H084#14 (As you can see the processing is then done by the material itself).

You can also decide to instantiate your own configuration and affect it to your material or to your postprocess with `postProcess.imageProcessingConfiguration = new BABYLON.ImageProcessingConfiguration()`. In this case, you will be able to configure this object independantly.

#### Default rendering pipeline

The image processing post process is also included in a rendering pipeline: the DefaultRenderingPipeline. This pipeline adds support for FXAA and bloom on top of the image processing. You can find a complete interactive demo here: https://www.babylonjs-playground.com/#5XB8YT#1

You can turn pipeline features on and off with the following booleans:
* fxaaEnabled
* bloomEnabled
* imageProcessingEnabled

## Refraction
Apply a refraction texture:

```javascript
var postProcess = new BABYLON.RefractionPostProcess("Refraction", "refMap.jpg", new BABYLON.Color3(1.0, 1.0, 1.0), 0.5, 0.5, 1.0, camera);
```
The constructor of this postprocess is the following:

```javascript
BABYLON.RefractionPostProcess = function (name, refractionTextureUrl, color, depth, colorLevel, ratio, null, samplingMode, engine, reusable)
```
_refractionTextureUrl_ is the URL of the refraction map. The luminance of every pixel is used to define the refraction level (white = min, black = max)
_color_ is the base color of the refraction (used to taint the rendering)
_depth_ is the simulated refraction depth
_colorLevel_ is the coefficient of the base color (0 to remove base color tainting)

## Color Correction
Apply a color filter:

```javascript
var postProcess = new BABYLON.ColorCorrectionPostProcess("color_correction", "./table.png", 1.0, camera);
```
The second parameter of the constructor is the URL of the color look-up table (also known as _LUT_) that contains the filter to apply. This must be a texture 16 pixels high and 256 pixels wide containing a modified set of RGB colors (x=red value, y=green value, z=blue value). The post-processing will then map the RGB values of the rendered pixels to the new values contained in the look-up table.

Here is what the default (without filter) look-up table looks like:

![LUT](/img/how_to/post-processes/lut-default.png)

Examples of filtered LUT to use for various filters:

![LUT](/img/how_to/post-processes/lut-inverted.png)
 Inverted colors

![LUT](/img/how_to/post-processes/lut-highcontrast.png)
 High contrast

![LUT](/img/how_to/post-processes/lut-posterized.png)
 Posterize

You can easily create new filters by using a image editing software to alter the look-up table to fit your needs. Copy/paste the default look-up table on a screenshot or picture before altering it to see in real time what the filtered image will look like.

## Custom postprocesses
You can also develop your own postprocess using ```BABYLON.PostProcess``` object.

To do so, you need to create a .fragment.fx file, a shader-storing DOM node, or a ShaderStore entry where you will store the GLSL shader code used for every pixel of the screen:

```javascript
GLSL
#ifdef GL_ES
precision highp float;
#endif

// Samplers
varying vec2 vUV;
uniform sampler2D textureSampler;

// Parameters
uniform vec2 screenSize;
uniform float highlightThreshold;

float highlights(vec3 color)
{
 return smoothstep(highlightThreshold, 1.0, dot(color, vec3(0.3, 0.59, 0.11)));
}

void main(void)
{
 vec2 texelSize = vec2(1.0 / screenSize.x, 1.0 / screenSize.y);
 vec4 baseColor = texture2D(textureSampler, vUV + vec2(-1.0, -1.0) * texelSize) * 0.25;
 baseColor += texture2D(textureSampler, vUV + vec2(1.0, -1.0) * texelSize) * 0.25;
 baseColor += texture2D(textureSampler, vUV + vec2(1.0, 1.0) * texelSize) * 0.25;
 baseColor += texture2D(textureSampler, vUV + vec2(-1.0, 1.0) * texelSize) * 0.25;
 
 baseColor.a = highlights(baseColor.rgb);

 gl_FragColor = baseColor;
}
```

Your shader must define the following values:
* Precision must be set to highp
* A varying vUV must be used to read texture coordinates
* The first sampler must be named textureSampler

Once you created your sampler, you can create a postprocess:

```javascript
var postProcess = new BABYLON.PostProcess("Down sample", "./Scenes/Customs/postprocesses/downsample", ["screenSize", "highlightThreshold"], null, 0.25, camera);
```

You have to specify:
* A name
* The URL of the shader coder*
* A list of your uniforms parameters
* A list of additional samplers
* The ratio
* The parent camera (deprecated)
* The sampling mode
* The engine
* Can be reusable

(*Please see the link at the bottom of this document to learn more ways to store shader code.)

You can set up things before the postprocess is applied by specifying a onApply function:

```javascript
postProcess.onApply = function (effect) {
    effect.setFloat2("screenSize", postProcess1.width, postProcess1.height);
    effect.setFloat("highlightThreshold", 0.90);
};
```

You can find another example here: https://www.babylonjs-playground.com/#DAC1WM

To use the output of a previous post process setTextureFromPostProcess can be used.
Note: This will set sceneSampler to the output of the post process before postProcess0 NOT the output of postProcess0.
```javascript
effect.setTextureFromPostProcess("sceneSampler", postProcess0);
```

## Chaining postprocesses
You can chain postprocesses on a specific camera. They are processed using the creation order. For instance here is the code used to simulate a bloom effect:

```javascript
var blurWidth = 1.0;

var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, camera);
var postProcess1 = new BABYLON.PostProcess("Down sample", "./Scenes/Customs/postprocesses/downsample", ["screenSize", "highlightThreshold"], null, 0.25, camera, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
postProcess1.onApply = function (effect) {
    effect.setFloat2("screenSize", postProcess1.width, postProcess1.height);
    effect.setFloat("highlightThreshold", 0.90);
};
var postProcess2 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), blurWidth, 0.25, camera);
var postProcess3 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), blurWidth, 0.25, camera);
var postProcess4 = new BABYLON.PostProcess("Final compose", "./Scenes/Customs/postprocesses/compose", ["sceneIntensity", "glowIntensity", "highlightIntensity"], ["sceneSampler"], 1, camera);
postProcess4.onApply = function (effect) {
    effect.setTextureFromPostProcess("sceneSampler", postProcess0);
    effect.setFloat("sceneIntensity", 0.5);
    effect.setFloat("glowIntensity", 0.4);
    effect.setFloat("highlightIntensity", 1.0);
};
```
You might want to [read more about shaders](https://www.eternalcoding.com/what-do-you-mean-by-shaders-learn-how-to-create-shaders-with-babylon-js/) and try our [CYOS shader editor](https://cyos.babylonjs.com/).
