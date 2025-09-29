# MSDF Text Renderer

## Introduction
The TextRenderer class provides a powerful and efficient solution for rendering crisp, scalable text in Babylon.js scenes using MSDF (Multi-channel Signed Distance Fields). Unlike traditional bitmap fonts or SDF techniques, MSDF preserves sharp corners and detailed glyph shapes at any scale, making it ideal for modern 3D and 2D applications that demand both performance and visual fidelity.

Example:

<Playground id="#6RLCWP#38" title="TextRenderer example" description="Example of using a TextRenderer"/>

Rendering text in WebGL presents a unique challenge: balancing resolution-independence with performance. Simple bitmap fonts scale poorly and blur at larger sizes, while classic single-channel SDFs tend to lose precision around complex edges. MSDF solves these issues by encoding distance information into three color channels (RGB), allowing precise reconstruction of glyph shapes using a shader, regardless of size or zoom level.

This technique offers:

* Resolution-independent clarity — no pixelation at large scales.

* GPU-efficient rendering — no need to regenerate or resize textures.

* Support for complex typographic details — sharp corners, curves, and serifs remain intact.

The TextRenderer class handles MSDF rendering under the hood, managing vertex buffers, instancing, and shader logic seamlessly. It supports advanced features like billboarding, text thickness control, and instanced paragraph rendering, enabling dynamic, high-quality text rendering in immersive 3D environments.

Whether you're building UI overlays, 3D HUDs, or in-world labels, TextRenderer offers a scalable and performant foundation for text in Babylon.js.

## Installation

The MSDF Text Renderer is available as an UMD NPM package

```shell
-npm install babylonjs-addons --save
```

and as an ES6 package:

```shell
-npm install @babylonjs/addons --save
```

## Initialization

Because we need to load the correct shaders (either webgl or webgpu), the creation of a TextRenderer is async:

```
const sdfFontDefinition = await (await fetch("https://assets.babylonjs.com/fonts/roboto-regular.json")).text();
const fontAsset = new ADDONS.FontAsset(sdfFontDefinition, "https://assets.babylonjs.com/fonts/roboto-regular.png");

const textRenderer = await ADDONS.TextRenderer.CreateTextRendererAsync(fontAsset, engine);
```

The fontAsset is the definition of the font shapes and can be shared across several TextRenderers.

## Generating font data

You can check the following free tools to generate font assets for your project:

* https://msdf-bmfont.donmccurdy.com/
* https://github.com/Chlumsky/msdfgen#using-a-multi-channel-distance-field

## Usage

Using a TextRenderer is pretty straightforward:

```
textRenderer.addParagraph("Hello World !");
```

This will add the text centered on the screen.

You can also provide options to control how your paragraph is set up:

```
textRenderer.addParagraph("What's up ?", {
    textAlign: "center"
});
```

The options are defined with that type:

```
type ParagraphOptions = {
    maxWidth: number;
    lineHeight: number;
    letterSpacing: number;
    tabSize: number;
    textAlign: "left" | "right" | "center";
    translate: Vector2 | undefined;
};
```

You can also add a third parameter to the call to addParagraph to control where you want your text:

```
textRenderer.addParagraph("What's up ?", {
    textAlign: "center"
}, BABYLON.Matrix.Translation(5, 0, 0));
```

The following properties are also available to control all the rendering of a TextRenderer:

* color: Color4 used to define the color of the text
* thicknessControl: a float indication how to change the overall default thickness (between -0.5 to 0.5 with 0 as the default value)
* parent: A node entity used to attach to text to
* isBillboard: a boolean indicating you want the text to always face the camera. ** Please note that in this case only the translation part of the parent world matrix will be considered **
* isBillboardScreenProjected: indicates whether billboard mode renders the text in screen-space. When set to true, the text keeps a constant on-screen size—its scale no longer changes with the camera’s distance.
* strokeColor: Color4 used to define the color of the stroke around the text
* strokeInsetWidth: Size of the stroke inset (inside the text)
* strokeOutsetWidth: Size of the stroke outset (outside the text)
* ignoreDepthBuffer: Will ignore depth buffer value and render the text on top of whatever is already in the frame buffer
* transformMatrix: Matrix used to move the entire list of paragraphs as a whole

## Positioning and scaling

By default the text will be rendered at 0,0,0. Then we apply paragraph world matrix and then the transform matrix.

You can control its position, rotation and scaling by setting a parent. If you opt to use the billboard mode then only position from the parent will be used.

The overall location of the text will be computed as follow:

Final world matrix = Parent World * Transform Matrix * Paragraph Matrix

## Examples

Setting a parent:

<Playground id="#6RLCWP#39" title="TextRenderer" description="Setting a parent"/>

A Star Wars scroller:

<Playground id="#6RLCWP#40" title="TextRenderer" description="Star Wars scroller"/>

Thickness control:

<Playground id="#IABMEZ#4" title="TextRenderer" description="Thickness control"/>

Stroke:

<Playground id="#6RLCWP#41" title="TextRenderer" description="Setting a parent"/>
