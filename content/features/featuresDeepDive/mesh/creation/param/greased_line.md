---
title: Creating A GreasedLine
image:
description: Learn how to create GreasedLines in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, greasedline, greased line
further-reading:
video-overview:
video-content:
---

## GreasedLine

`GreasedLine` is a special type of line which uses a regular mesh with triangles to display a line of any width. It incorporates custom shaders designed to ensure that the mesh always faces the camera resulting in consistent thickness from all perspectives. The shaders are provided using plugin material. You can use `StandardMaterial` or `PBRMaterial` with `GreasedLine` so you can use any property of the material to stylize your line. `GreasedLine` also features dashing, multicolored lines with sampling option, color blending options, variable width of both side of the line (upper, lower part), visibility (what percentage of the line is visible), points coordinates offsets, instance mode (you can add more lines to an instance and they will be drawn in one draw call), lazy mode. The values for these features are animatable. You can translate, rotate and scale the line as well because it's a mesh.

## Create a GreasedLine

The easiest, preferred and recommended way to create a `GreasedLine` is to use the `CreateGreasedLine` function:

```javascript
function CreateGreasedLine(name: string, options: GreasedLineMeshBuilderOptions, materialOptions?: Nullable<GreasedLineMaterialBuilderOptions>, scene?: Nullable<Scene>)
```

The simplest usage is:

```javascript
const line = BABYLON.CreateGreasedLine("name", { points });
```

<Playground id="#H1LRZ3#98" title="Basic usage" description="Basic scenarios with GreasedLine." />
<Playground id="#H1LRZ3#21" title="Transforming a GreasedLine mesh" description="Translate, rotate or scale your line mesh." />

### GreasedLineMeshBuilderOptions

You will find explanation of these options below this code snippet.

```javascript
points: GreasedLinePoints;
pointsOptions?: GreasedLinePointsOptions;
widths?: number[];
widthDistribution?: GreasedLineMeshWidthDistribution;
instance?: GreasedLineMesh;
updatable?: boolean;
uvs?: number[];
lazy?: boolean;
```

#### **points**

Points of the line specified as x, y, z coordinates. _All the points connected are called a line. The part of the line between two points is called a line segment in this documentation._

`points` can be type of `number[]`, `number[][]`, `Vector3[]`, `Vector3[][]`, `Float32Array` or `Float32Array[]`.

If you want to draw only one contiguous line you can use 1D arrays or `Float32Array`. If you want to draw multiple lines you have to use 2D arrays or `Float32Array[]`.

To draw multiple disconnected lines using a flat `Float32Array` you can specify the `pointsOptions.stride` property in the `GreasedLineMeshBuilderOptions` object. This value sets how many entries from the `Float32Array`will be used to create one line. One entry = 3 float values.

<Playground id="#TCURLI#3" title="Float32Array stride" description="How to create disconnected lines using a flat Float32Array." />

```javascript
const points =
[
    0, 0, 0,
    1, 0, 0,
    1, 1, 0
]
// x, y, z,
// x, y, z, ...

// is the same as
const points =
[
    new BABYLON.Vector3(0,0,0)
    new BABYLON.Vector3(1,0,0)
    new BABYLON.Vector3(1,1,0)
]
```

_It's a good habit to format your `number` coordinates for better readability._

We recommend you to use the `number` or `Float32Array` objects if possible to avoid unnecessary creation of temporary `Vector3` objects holding the points, mainly if you are creating the coordinates dynamically on the fly. The coordinates are converted to `number[][]` internally so `number[]` or `number[][]` are the fastest options.

To draw two or more at once lines you can define the points as:

```javascript
const points = [
  [0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 0],
];
```

You can draw more lines at once by using the `instance` option. See the **Instance mode** example below.

You need to specify at least two points to draw a line, obviously.

_Do not use sharp angle connected long lines because they can be distorted by perspective. Use smaller line segments._ There are helper functions available in `BABYLON.GreasedLineTools` for that. See the GreasedLineTools section for more info. Another option is to create two lines and add them to one instance or you can add them as to separate lines like (this approach can cause little quirks where the lines 'connects' to each other when using dash mode - depending on your line width):

```javascript
const points = [
  [-10, 0, 0, 0, 10, 0],
  [0, 10, 0, 10, 0, 0],
];
```

Please note that `points` property is not updatable unlike when using a `LineMesh`. You have to use the property `offsets` on the line instance to update the position of points without recreating the mesh. Updating the `offsets` doesn't involve any calulcations and updated only one vertex buffer. See below the Offsets section and the PG example Offsetting line vertices. 

However there are two public methods available on the line instance for manipulating the points. Both of these functions will destroy the mesh and create a new one. This point manipulation method is slower but if you are not dealing with a lot of lines it should not cause FPS issues.

```javascript
addPoints(points: number[][]) // ads points to the existing ones and recreates the mesh
setPoints(points: number[][]) // sets the points and recreates the mesh - the number of points must be the same as in the original line
```

_If you are using the right handed coordinate system please create the lines after you switch the scene to it._

_If you modify the number of points in the line you have to set the widths for the new lines or lines segments prior calling any of these two methods._

#### **widths** and **widthDistribution**

You can specify two width multiplier values for each point in your line. These values are multiplied with the `width` of the line to draw the resulting line. The first value specifies the width multiplier of the line below the line and the second above the line. These values are not normalized so if you use a value of 2, 2 the line will be twice the width at that point. _There must be exactly the same count of width pair values as there are points._

The `CreateGreasedLine` function uses the function `CompleteGreasedLineWidthTable` to fill the missing values, if any. You can use the `widthDistribution` option to set the method used to automatically fill the `widths` table.

You can choose from these values:

```javascript
enum GreasedLineMeshWidthDistribution {
    WIDTH_DISTRIBUTION_NONE = 0,
    WIDTH_DISTRIBUTION_REPEAT = 1,
    WIDTH_DISTRIBUTION_EVEN = 2,
    WIDTH_DISTRIBUTION_START = 3,
    WIDTH_DISTRIBUTION_END = 4,
    WIDTH_DISTRIBUTION_START_END = 5,
}
```

The default for this option is `WIDTH_DISTRIBUTION_START`.

Let's see an example:

```javascript
const points = [0, 0, 0, 1, 0, 0];
const widths = [2, 2];
const line = BABYLON.CreateGreasedLine("line", { points, widths });
// the width table will be filled as [2, 2, 1, 1]
```

You can use the function `CompleteGreasedLineWidthTable` manually and set the `widthDistribution` to `WIDTH_DISTRIBUTION_NONE`. If you prepared the width table with the correct number of entries, set `widthDistribution` to `WIDTH_DISTRIBUTION_NONE` as well.

Please have a look at the API docs for more explanation about the width distribution modes.

_You might wonder when you proceed reading to the `materialOptions` and you'll find the `width` option specified there and `widths` here. It's because the `options` objects contains all the mesh related options and `width` is used when creating the material, so it's material related._

<Playground id="#H1LRZ3#52" title="Widths" description="Variable line width along the line and automatic width distribution." />

#### **instance**

You can add lines to an existing line whenever you want. All you need to is to specify the `instance` option and set a `GreasedLineMesh` instance to it. Everytime you add a new line all the data needed to render the line will be recalculated and the buffers will be updated. If you are adding many lines to an instance, use the `lazy` option. _Lines added to an instance are joined with the existing mesh_. See the examples for code.

<Playground id="#H1LRZ3#47" title="Instance mode" description="Example of adding lines to an instance and creating a big line mesh with many lines." />

#### **updatable**

If you want to update your line mesh after it was created set this option to `true` when creating the line. This applies to `offsets`, `segmentWidths` and `colorPointers`. This option doesn't affect the line materials which can be updated any time. Set this value to `false` if you don't intend to update line mesh for more performance. If you are adding lines to an existing line instance you have to set this option on the line created the first.

#### **uvs**

You can set your custom UVs when creating the line.

#### **lazy**

You can disable recalculating line data and updating the buffers when adding a new line to a line instance by setting this option to true. This option is always used with the `instance` option specified. If you're done with adding new lines you just need to call `line.updateLazy()` to recalculate the data and update the buffers. See the examples for code.

<Playground id="#H1LRZ3#39" title="Lazy mode" description="Example of add lines to an instance in lazy mode for easiy handling thousands of lines." />

### GreasedLineMaterialBuilderOptions

```javascript
createAndAssignMaterial?: boolean;
width?: number;
sizeAttenuation?: boolean;
materialType?: GreasedLineMeshMaterialType;
color?: Color3;
colorMode?: GreasedLineMeshColorMode;
colors?: Color3[];
colorDistribution?: GreasedLineMeshColorDistribution;
colorDistributioType?: GreasedLineMeshColorDistributionType;
useColors?: boolean;
colorsSampling?: number;
useDash?: boolean;
dashCount?: number;
dashOffset?: number;
dashRatio?: number;
visibility?: number;
resolution?: Vector2;
cameraFacing?: boolean;
```

#### **createAndAssignMaterial**

If set to true a new material will be created and a new material plugin will be attached to the material. The material will be set on the mesh. If the `instance` option is specified in the mesh options, no material will be created/assigned. If you omit `GreasedLineMaterialBuilderOptions` when calling `CreateGreasedLine` it behaves as if this option was set to true so it creates the material and the plugin. **The default value is true. You can share the material between multiple lines so if you don't need a new material, set this to `false` to save resources and gain performance.**

#### **width**

Line width in scene units unless `sizeAttenuation` is true. You can override the default value:

```javascript
GreasedLineMaterialDefaults.DEFAULT_WIDTH_ATTENUATED = 10;
GreasedLineMaterialDefaults.DEFAULT_WIDTH = 0.5;
```

All lines created after setting this value and not providing a `width` option will use this value as the default one.

#### **sizeAttenuation**

If true then line will width be always the same regardless the distance from the line. The upper line has constant with no matter how far from the camera it is. This PG also demonstrates how to use default values:

<Playground id="#FJRQ8N#149" title="Size attenuation and GreasedLineMaterialDefaults" description="Shows the difference between attenuated and not attenuated lines and how to set default width and color." />

#### **materialType**

Type of the material to use to render the line. Default is `StandardMaterial`. Currently you can choose from:

```javascript
enum GreasedLineMeshMaterialType {
    MATERIAL_TYPE_STANDARD = 0,
    MATERIAL_TYPE_PBR = 1,
    MATERIAL_TYPE_SIMPLE = 2
}
```

The first two materials are implemented using material plugins. The simple material is based on a shader material. It is super fast but does support only plain colors without lighting.

#### **color**

Color of the line. Applies to all line segments. Defaults to White. You can change the default color to any other color.

```javascript
BABYLON.GreasedLinePluginMaterial.DEFAULT_COLOR = BABYLON.Color3.Green();
```

#### **colorMode**

Color mode of the line. Applies to all line segments. The pixel color from the material shader will be modified with the value of `color` using the colorMode. The default mode is `GreasedLineMeshColorMode.SET`. It means it will set the color regardless the color from the material shader. To be more precise it will set the color to the exact value and doesn't care about the color information from the material (textures, lighting, ...)

You can choose from and the names are self-explanatory:

```javascript
enum GreasedLineMeshColorMode {
    COLOR_MODE_SET = 0,
    COLOR_MODE_ADD = 1,
    COLOR_MODE_MULTIPLY = 2,
}
```

Please note a difference: `MATERIAL_TYPE_SIMPLE` mixes the `color` and `colors` of the greased line material. `MATERIAL_TYPE_STANDARD` and `MATERIAL_TYPE_PBR` mixes the color from the base material with the `color` or the `colors` of the greased line material.

<Playground id="#H1LRZ3#268" title="Simple material in multiply color mode" description="Shows how the multiply color mode works with the simple greased line material." />

#### **colors** and **colorDistribution**

An array of colors of the line segments. Maximum number of colors supported for one line instance depends on the maximum texture width (we use 1D textures here for maximum performance) your GPU can support. Minimum for all WebGL systems is 4k. On most modern desktop GPUs it is 16k. Each color in the array represents a line segment color. _There must be exactly the same amount of colors in the array as there are line segments in the line._

The `CreateGreasedLine` function uses the function `CompleteGreasedLineColorTable` to fill the missing values, if any. You can use the `colorDistribution` option to set the method used to automatically fill the `colors` table.

You can choose from these values:

```javascript
enum GreasedLineMeshColorDistribution {
    COLOR_DISTRIBUTION_NONE = 0,
    COLOR_DISTRIBUTION_REPEAT = 1,
    COLOR_DISTRIBUTION_EVEN = 2,
    COLOR_DISTRIBUTION_START = 3,
    COLOR_DISTRIBUTION_END = 4,
    COLOR_DISTRIBUTION_START_END = 5,
}
```

The default for this option is `COLOR_MODE_START`.

Let's see an example (you will end up with a half red half white line)

```javascript
const points = [0, 0, 0, 1, 0, 0, 2, 0, 0];
const colors = [BABYLON.Color3.Red()];
const line = BABYLON.CreateGreasedLine("line", { points }, { colors });
// the color table will be filled as [red, white] - white is the default
```

_The colors are used only when the option `useColors` is set to `true` and you doesn't set the `color` option. There is one exception, see the documentation for the `useColors` option below._

The color blending of the colors depends on `colorMode` option.

<Playground id="#H1LRZ3#34" title="Line colors" description="Multicolored lines and automatic color distribution." />

#### **colorDistributionType**

The method used to distribute the colors along the line. You can use segment distribution when each segment will use one color from the color table. Or you can use line distribution when the colors are distributed evenly along the line ignoring the segments.

<Playground id="#H1LRZ3#258" title="Color distribution type" description="Shows how to use available color distribution types." />
<Playground id="#H1LRZ3#55" title="Line colors using your own texture" description="Create your own color texture." />
<Playground id="#VUKIHZ#3" title="Animating line colors using your own texture" description="Animating colors on a line using your color texture." />
<Playground id="#H1LRZ3#233" title="Setting color pointers manually" description="A loader circle created by modifying the color pointers. Also shows how to use gradients with GreasedLine." />

#### **colorsSampling**

Sampling type of the colors texture. Defaults to NEAREST_NEAREST. The line segment will be distinctly colored. If you use for example LINEAR_LINEAR you'll get a smooth color gradient.

<Playground id="#H1LRZ3#59" title="Colors sampling" description="Create distinct or smooth gradient when coloring your line." />

#### **useColors**

If true, `colors` are used, otherwise they're ignored.

There is a scenario when you need to set `useColors` to `true` and set the `color` option as well. Look at the PG:

<Playground id="#H1LRZ3#383" title="Adding differently colored lines to an instance" description="Shows how can you add differently colored lines without creating the colors array manually." />

#### **useDash**

If true, dashing is used.

<Playground id="#H1LRZ3#119" title="Dashing" description="How to create dashed lines." />

#### **dashCount**

Number of dashes in the line. If you add more lines, all of them will use this dash count and they are not treated as one line.

#### **dashRatio**

Length of the dash. 0 to 1. 0.5 means half empty, half drawn.

#### **dashOffset**

Offset of the dashes along the line. 0 to 1. Normalized value.

#### **visibility**

Sets the line length visibility. Normalized value.
0 - 0% of the line will be visible.
1 - 100% of the line will be visible.

<Playground id="#H1LRZ3#120" title="Visibility" description="Control how much of your line is visible." />

#### **resolution**

Rendering resolution. There may be special occasions when you want to change the resolution. In most cases do not set this value.

#### **cameraFacing**

Whether to use camera facing for the line. Defaults to `true`. If set to `true` you have to use the `GreasedLineMesh` class to create the mesh. If set to `false` you have to use the `GreasedLineRibbonMesh` class. The builder function takes automatically care of this decision and sets this value automatically to `false` if `ribbonOptions` is present in the `GreasedLineBuilderMeshOptions`.

## GreasedLine materials

`GreasedLine` uses `StandardMaterial` or `PBRMaterial` or `ShaderMaterial` (`MATERIAL_TYPE_SIMPLE`) as the base material for rendering. It also uses a `GreasedLinePluginMaterial` which plugs into the base material and provides the additional features of `GreasedLine`.

If you want to alter the properties of the material you need to use `line.material` but if you want to change the `GreasedLine` specific material properties you need to do it on the `line.greasedMaterial` object. All three materials implements the `IGreasedLineMaterial` interface:

```javascript
/**
 * Interface which defines the available methods for a GreasedLineMaterial
 */
export interface IGreasedLineMaterial {
  /**
   * Normalized value of how much of the line will be visible
   * 0 - 0% of the line will be visible
   * 1 - 100% of the line will be visible
   */
  visibility: number;

  /**
   * Line base width. At each point the line width is calculated by widths[pointIndex] * width
   */
  width: number;

  /**
   * Turns on/off dash mode
   */
  useDash: boolean;

  /**
   * @see GreasedLinePluginMaterial.setDashCount
   * Number of dashes in the line.
   * Defaults to 1.
   */
  dashCount: number;

  /**
   * Dash offset
   */
  dashOffset: number;

  /**
   * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
   */
  dashRatio: number;

  /**
   * Whether to use the colors option to colorize the line
   */
  useColors: boolean;

  /**
   * The mixing mode of the color paramater. Default value is GreasedLineMeshColorMode.SET. MATERIAL_TYPE_SIMPLE supports only the default value/mode.
   * @see GreasedLineMeshColorMode
   */
  colorMode: GreasedLineMeshColorMode;

  /**
   * Colors of the line segments.
   * Defaults to empty.
   */
  colors: Nullable<Color3[]>;

  /**
   * If false then width units = scene units. If true then line will width be reduced.
   * Defaults to false.
   */
  sizeAttenuation: boolean;

  /**
   * Color of the line. Applies to all line segments.
   * Defaults to White.
   * MATERIAL_TYPE_STANDARD and MATERIAL_TYPE_PBR material's shaders will get recompiled if there was no color set and you set a color or when there was a color set and you set it to null.
   */
  color: Nullable<Color3>;

  /**
   * The method used to distribute the colors along the line.
   * You can use segment distribution when each segment will use on color from the color table.
   * Or you can use line distribution when the colors are distributed evenly along the line ignoring the segments.
   */
  colorsDistributionType: GreasedLineMeshColorDistributionType;

  /**
   * Defaults to engine.getRenderWidth() and engine.getRenderHeight()
   * Rendering resolution
   */
  resolution: Vector2;

  /**
   * Allows to change the color without marking the material dirty.
   * MATERIAL_TYPE_STANDARD and MATERIAL_TYPE_PBR material's shaders will get recompiled if there was no color set and you set a color or when there was a color set and you set it to null. Use the flag to not to recompile immediately.
   * @param value the color
   * @param doNotMarkDirty the flag
   */
  setColor(value: Nullable<Color3>, doNotMarkDirty?: boolean): void;

  /**
   *
   * @param colors colors array
   * @param lazy if true the colors texture will not be updated
   * @param forceNewTexture forces to create a new colors texture
   */
  setColors(colors: Nullable<Color3[]>, lazy: boolean, forceNewTexture?: boolean): void;

  /**
   * Creates and sets the colors texture from the colors array which was created in lazy mode
   */
  updateLazy(): void;
}
```

All other properties must be defined when creating the line.

As you can see in the comment of the `color` public property, the shader gets recompiled if there are specific changes of this property. A real life scenario: You might want to draw textured lines. On a specific event you want to colorize the texture. In this case create the line with `color` set to `Color3.White()` and set the `colorMode` to `GreasedLineColorMode.COLOR_MODE_MULTIPLY`. The result will be the same as not setting a `color`. However now you can change the `color` to for example `rgb(0.5, 0.5, 0.5)` to dim the texture colors without shader recompilation. This doesn't apply to `MATERIAL_TYPE_SIMPLE` because this material supports only `GreasedLineColorMode.COLOR_MODE_SET` so there will be no shader recompilation upon changes of the `color` property at all.

**Materials can be shared between line instances.** If you create a line a the other should have the same material options then create the other line(s) by setting its material option `createAndAssign` material to `false` and simply set the material:

```javascript
const points1 = [-1, 0, 0, 1, 0, 0];
const line1 = BABYLON.CreateGreasedLine("line1", { points: points1 });

const points2 = [-1, 1, 0, 1, 1, 0];
const line2 = BABYLON.CreateGreasedLine("line2", { points: points2 }, { createAndAssignMaterial: false });

line2.material = line1.material;
```

## Examples

The best way to show the possibilities of `GreasedLine` is to go through the following examples.

### Basic code snippets with StandardMaterial

#### Line with no material settings, default width, default color

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points });
```

#### Lines with no material settings, default width, default color

```javascript
const points = [
  [-1, 0, 0, 1, 0, 0],
  [-1, 1, 0, 1, 1, 0],
];
const lines = BABYLON.CreateGreasedLine("lines", { points });
```

#### Line with a color specified

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points }, { color: BABYLON.Color3.Red() });
```

You can set the default color:

```javascript
GreasedLineMaterialDefaults.DEFAULT_COLOR = BABYLON.Color3.Red();
```

Please note that the color will be cloned so changing this value will not affect the existing lines.

#### Line with a width specified

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points }, { width: 0.5 });
```

#### Line with multiple colors

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const colors = [BABYLON.Color3.Red(), BABYLON.Color3.Yellow()];
const line = BABYLON.CreateGreasedLine("line", { points }, { useColors: true, colors });
```

#### Line with multiple widths

```javascript
const points = [-1, 0, 0, -0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 1, 0, 0];
const widths = [1, 1, 2, 2, 3, 3, 2, 2];
const line = BABYLON.CreateGreaseLine("line", { points }, [widths]);
```

#### Instance mode

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points });

const points2 = [-1, 1, 0, 1, 1, 0];
BABYLON.CreateGreasedLine("line", { instance: line, points: points2 });
```

#### Lazy mode

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { lazy: true, points });

const points2 = [-1, 1, 0, 1, 1, 0];
BABYLON.CreateGreasedLine("line", { instance: line, lazy: true, points: points2 });

const points3 = [-1, -1, 0, 1, -1, 0];
BABYLON.CreateGreasedLine("line", { instance: line, lazy: true, points: points3 });

line.updateLazy();
```

#### Dashed line

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points }, { useDash: true, dashCount: 4, dashRatio: 0.5 });
```

#### Line visibility

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points }, { visibility: 0.5 });
```

#### Offsets

You can offset the vertices of the line. **Keep in mind that there are 2 vertices per point and the line must be updatable**. If your line disappears after calling this function it means you've provided not enough offsets. There is a function `BABYLON.GreasedLineTools.GetPointsCountInfo(points: number[][]): { total: number; counts: number[] }` which will tell you the exact counts. Just pass you line `points` option to this function.

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points, updatable: true });

const offsets = [-0.3, -0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
line.offsets = offsets;
```

<Playground id="#H1LRZ3#122" title="Offsetting line vertices" description="Shows how to move your line points after the line mesh was created." />
<Playground id="#235CZX#16" title="Offsetting line segments" description="Shows how to move your line segments after the line mesh was created." />
<Playground id="#ZRZIIZ#98" title="Modifying points positions" description="You can modify the positions by altering vertex buffer of the mesh." />

#### Adding/setting points to an existing GreasedLine instance

You can add points to an existing GreasedLine instance. The width table is extended automatically to match the vertices count and the new widths are set to 1. You have to replace these values manually after the points were added if needed. You can do it by setting the values on the `line.widths` array.

The color table, if `useColors` is `true` must be extended manually. Please pay attention to the code in the PG and the comments how to correctly extend the color table.

The line must be created with the `updatable: true` option.

Have a look at the PG called Adding and setting points on an existing instance at the end of the page.

#### Line transformations

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine("line", { points });

line.position.x = 2;
line.rotation.z = Math.PI / 2;
line.scaling = new BABYLON.Vector3(2, 2, 2);
```

#### Drawing arcs

```javascript
const f = new BABYLON.Vector3(-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()).scale(20);
const s = new BABYLON.Vector3(-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()).scale(20);
const t = new BABYLON.Vector3(-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()).scale(20);

const arc = BABYLON.Curve3.ArcThru3Points(f, s, t);
const arcLine = BABYLON.CreateGreasedLine("arc", { points: arc.getPoints() });
```

#### Line with texture

```javascript
const points1 = [-6, 0, 0, 6, 0, 0];
const line1 = BABYLON.CreateGreasedLine("line1", { points: points1 }, { width: 1, colorMode: BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY });

const texture = new BABYLON.Texture("/textures/amiga.jpg", scene);
texture.uScale = 10;

line1.material.emissiveTexture = texture;
```

The default `color` is white and the default `colorMode` is `BABYLON.GreasedLineMeshColorMode.COLOR_MODE_SET` so you need to set `colorMode` to `BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY` to render the texture visible or you can remove the color by setting its value to `null` if you don't want to do color blending at all. **Setting the color from `null` to a value or setting from a value to `null` will recompile the shader.**

```javascript
const points1 = [-6, 0, 0, 6, 0, 0];
const line1 = BABYLON.CreateGreasedLine("line1", { points: points1 }, { width: 1 });
line1.greasedLineMaterial.color = null;

const texture = new BABYLON.Texture("/textures/amiga.jpg", scene);
texture.uScale = 10;

line1.material.emissiveTexture = texture;
```

#### Setting line color using its material

You have to set a `colorMode` option or set the `color` to `null`. **Setting the color from `null` to a value or setting from a value to `null` will recompile the shader.**

```javascript
const points1 = [-6, 0, 0, 6, 0, 0];
const line1 = BABYLON.CreateGreasedLine("line1", { points: points1 }, { width: 1 });
line1.greasedLineMaterial.color = null;
line1.material.emissiveColor = BABYLON.Color3.Red();
```

#### Glowing line

You have to set a `colorMode` option or set the `color` to `null`. **Setting the color from `null` to a value or setting from a value to `null` will recompile the shader.**

```javascript
const points1 = [-6, 0, 0, 6, 0, 0];
const line1 = BABYLON.CreateGreasedLine("line1", { points: points1 }, { width: 1 });
line1.greasedLineMaterial.color = null;
line1.material.emissiveColor = BABYLON.Color3.Red();

const gl = new BABYLON.GlowLayer("glow", scene, {
  blurKernelSize: 32,
});
gl.intensity = 1.8;
gl.referenceMeshToUseItsOwnMaterial(line1);
```

#### Line using PBRMaterial

All you have to do is set the `materialType` to `BABYLON.GreasedLineMeshMaterialType.MATERIAL_TYPE_PBR` and set the `colorMode` to `BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY`. Do not set the `color` to `null` as it was the case with `StandardMaterial` unless you set the base color of the line another way, for example by setting a texture on `PBRMaterial`.

```javascript
const points = [-1, 0, 0, 1, 0, 0];
const line = BABYLON.CreateGreasedLine(
  "line",
  { points },
  {
    materialType: BABYLON.GreasedLineMeshMaterialType.MATERIAL_TYPE_PBR,
    colorMode: BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY,
  },
);

const pbrMaterial = line.material;
// set your PBR material properties here
```

#### Text using GreasedLine

You can draw text with Greased Line as well.

```javascript
const fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();

const points = BABYLON.GreasedLineTools.GetPointsFromText(
  "BabylonJS",
  16, // size
  16, // resolution
  fontData, // typeface.js font
);

const textLines = BABYLON.CreateGreasedLine("textLines", { points });
```

Read more about the `GetPointsFromText` function below and check out the example PG.

## GreasedLineTools

The `GreasedLineTools` contains useful helper functions which will help you to easily handle common tasks when using `GreasedLine`. Refer to the API for details.

### Meshes to lines

You can easily draw a wireframe of a mesh like this:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { segments: 32, diameter: 2 }, scene);
const sphereLines = BABYLON.CreateGreasedLine("sphereLines", { points: BABYLON.GreasedLineTools.MeshesToLines([sphere]) });
```

You can use a `predicate` as the second parameter of this function to modify the line points returned from this function. The predicate is called once for a face (once for every 3rd indice).

<Playground id="#VJ9KH2#9" title="MeshesToLines with OmitDuplicatesPredicate" description="Demonstrates converting a mesh to lines without duplicated edges." />

```javascript
predicate?: (
    p1: Vector3,
    p2: Vector3,
    p3: Vector3,
    indiceIndex: number,
    vertexIndex: number,
    mesh: AbstractMesh,
    meshIndex: number,
    vertices: FloatArray,
    indices: IndicesArray
) => Vector3[]

const predicate = (p1, p2, p3, ix, vx) => {
    if (vx % 4 === 0) {
        return [p1, p2, p3, p1]
    }
    return false
}

const points = BABYLON.GreasedLineTools.MeshesToLines([sphere], predicate)
```

### Convert number[] to Vector3[] and vice versa

You will often face situations when you need to convert your point coordinates mainly when using `GreasedLineTools` functions. There are two helper functions for that:

```javascript
BABYLON.GreasedLineTools.ToVector3Array(points: number[])
BABYLON.GreasedLineTools.ToNumberArray(array: Vector3[])
```

### Getting the count of points in your line instance

You will face certain tasks such creating color textures, offset buffers, etc. and you will need to know how many points is the line instance created from. Mainly if you use the functions below which will divide and segmentize your lines you'll easily lose tracking of the exact counts. You get the total number of points and number of points in each line in the line instance.

```javascript
BABYLON.GreasedLineTools.GetPointsCountInfo(points: number[][]): { total: number; counts: number[] }
```

is here to help.

### Dividing a line to smaller segments

You may want to divide your line to smaller pieces (to segments) for example for assigning different colors to the segments or setting different width on the segment or manipulating the offset of that smaller segment.

```javascript
const pointsOriginal = BABYLON.GreasedLineTools.ToVector3Array([0, 0, 0, 1, 0, 0]);
const points = BABYLON.GreasedLineTools.SegmentizeLineBySegmentLength(pointsOriginal, 0.25);
const points2 = BABYLON.GreasedLineTools.SegmentizeLineBySegmentCount(pointsOriginal, 4);
```

The line will be divided into 4 pieces because the line length is 1 and we asked for 0.25 long segments when using the first function or you can provide the number segments using the second function. Check the playgrounds for real life examples.

### Finding the last visible position on the line when using the visibility option

The visibility option allows you to render only part of the line. You can use this option to reveal your line by incrementing its value. Remember, the value of this option must be normalized so it must be between 0 and 1. For example you may want to display a marker where the line ends. You can use the `BABYLON.GreasedLineTools.GetPositionOnLineByVisibility(lineSegments: { point1: Vector3; point2: Vector3; length: number }[], lineLength: number, visbility: number, localSpace = false)` function for this. Examine the example Playground how to deal with this function.

### Getting points from text and a typeface.js font - the GetPointsFromText function

You can draw texts using `GreasedLine`. See the example code snippet above and the PG below.

```javascript
GreasedLineTools.GetPointsFromText(text: string, size: number, resolution: number, fontData: IFontData, z = 0, includeInner = true): number[][]
```

The `size` is the height of the text in BabylonJS units.
Keep the `resolution` as low as possible without loosing details. Start at low values as 4 and go up to 32-64 (or you can use 1 to get cool low resolution vector font).
`fontData` is the same object you would use with `BABYLON.MeshBuilder.CreateText`. You can generate your typeface.js font [here](https://gero3.github.io/facetype.js/).

### Other functions

There are other useful functions like getting points for drawing a circle/oval, an arc, drawing arrows, getting line length, etc. Check the source code, the API and/or the playgrounds.

**As an overall rule always cache your parameters when calling functions. These functions located in `GreasedLineTools` may be CPU intensive so avoid using them in the render loop or cache as much as possible. For example convert your `number` coordinates to `Vector3` coordinates once and store the result. Get the line length only once and buffer the value. Etc...**

## Picking and intersections

You can use the `findAllIntersections(ray)` function on the a `GreasedLineMesh` object to find the intersections of the ray and the line. You can finetune the intersection sensitivity by altering the value of the public property `intersectionTreshold`.

## Example playgrounds

<Playground id="#ZRZIIZ#96" title="Vertex colors" description="Colorize your line using vertex colors." />
<Playground id="#H1LRZ3#124" title="Picking & intersection" description="GreasedLine supports picking and ray intersections." />
<Playground id="#7CHU6U#14" title="Adding and setting points on an existing instance" description="Shows how can you add or set the points on an existing instance and how to deal with existing width/colors." />
<Playground id="#H1LRZ3#35" title="Glowing lines" description="Glowing lines." />
<Playground id="#H1LRZ3#97" title="Arrows" description="You can easily create arrows with GreasedLine." />
<Playground id="#H1LRZ3#60" title="Curves" description="Example of drawing a colorful curve." />
<Playground id="#H1LRZ3#241" title="Drawing text" description="You can also draw text with GreasedLine." />
<Playground id="#H1LRZ3#121" title="GetPositionOnLineByVisibility tool function example" description="Finding the last visible position on the line when using the visibility option." />
<Playground id="#H1LRZ3#136" title="Cloning" description="Cloning the GreasedLine mesh and it's material." />
<Playground id="#H1LRZ3#127" title="Serialization and parsing" description="Serializing and parsing the GreasedLine mesh and it's material." />
<Playground id="#H1LRZ3#542" title="Thin instances" description="How to deal with thin instances and instance colors." />
<Playground id="#H1LRZ3#194" title="Using PBR material" description="Example of using GreasedLine with PBR material." />
<Playground id="#H1LRZ3#22" title="Using PBR material with a texture" description="Example of using GreasedLine with PBR material." />
<Playground id="#H1LRZ3#193" title="PBR sphere demo" description="Example of using GreasedLineTools mesh to lines function with PBR material." />
<Playground id="#H1LRZ3#130" title="PBR sphere demo with a mesh to line predicate" description="Example of using GreasedLineTools mesh to lines function with PBR material and a predicate which you can use to modify the lines or omit them." />
<Playground id="#H1LRZ3#123" title="Mesh to 'opaque' lines example with PBR" description="Another example of using GreasedLineTools mesh to lines function with PBR material with a trick to make the wireframe mesh opaque." />
