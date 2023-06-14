---
title: Dynamic Textures
image:
description: Learn all about dynamic textures in Babylon.js.
keywords: diving deeper, materials, dynamic textures, texxture
further-reading:
video-overview:
video-content:
---

A dynamic texture works by creating a canvas onto which you can draw using all the facilities of the [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

![dynamic texture](/img/how_to/dyntext.png)

## Creating and Applying

This is simply achieved using the `dynamicTexture` function with just three parameters,

```javascript
const myDynamicTexture = new BABYLON.DynamicTexture(name, option, scene);
```

though the existing default values of `minmaps`, `sampling mode` and `texture format` can be overwritten by their addition.

Whereas the name and scene parameters are obvious, the `option` parameter, which determines the width and height of the dynamic texture, can be one of three values:

1. An already created canvas, in which case `canvas.width` and `canvas.height` are used;
2. An object having the properties `width` and `height`;
3. A number, in which case both width and height are set to this number.

Once created, the dynamic texture is used as the `diffuseTexture` for a material in the usual way:

```javascript
const myMaterial = new BABYLON.StandardMaterial("Mat", scene);
myMaterial.diffuseTexture = myDynamicTexture;
mesh.material = myMaterial;
```

## Writing Text

A `drawText` method is available so that text can be written directly onto the dynamic texture.

```javascript
myDynamicTexture.drawText(text, x, y, font, color, canvas color, invertY, update);
```

Here are the parameters:

- text: string, the words to be written;
- x: number, distance from the left-hand edge;
- y: number, distance from the top or bottom edge, depending on invertY;
- font: string, font definition in the form font-style, font-size, font_name;
- invertY: boolean, true by default in which case y is the distance from the top, when false, y is distance from the bottom and the letters reversed;
- update: boolean, true by default, the dynamic texture will immediately be updated.

<Playground id="#5ZCGRM#2" title="Drawing Text" description="Simple example of drawing text with dynamic textures." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture1.jpg"/>

## Canvas Methods

You can obtain the canvas context using

```javascript
const ctx = myDynamicTexture.getContext();
```

exposing all the possibilities of the [HTML5 canvas](https://www.w3schools.com/Tags/ref_canvas.asp) element to give you full control over drawing, transforming, compositing and other pixel manipulation to create or update your dynamic texture in real time.

### Drawing Curves

As an example, drawing using a quadratic curve

```javascript
ctx.beginPath();
ctx.moveTo(75, 25);
ctx.quadraticCurveTo(25, 25, 25, 62.5);
ctx.quadraticCurveTo(25, 100, 50, 100);
ctx.quadraticCurveTo(50, 120, 30, 125);
ctx.quadraticCurveTo(60, 120, 65, 100);
ctx.quadraticCurveTo(125, 100, 125, 62.5);
ctx.quadraticCurveTo(125, 25, 75, 25);
ctx.stroke();
```

To apply the drawing, the dynamic texture needs updating

```javascript
myDynamicTexture.update();
```

**Note:** use `update(false)` if you do not want to use `invertY`.

<Playground id="#5ZCGRM#3" title="Drawing A Curve" description="Simple example of drawing a circle with dynamic textures." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture2.jpg"/>

### Images

Images can be added to fill part or the whole of the canvas using the `drawImage` method. Remember that you will have to wait for the image to load before assigning it to the canvas and update the dynamic texture afterwards.

For whole image

```javascript
const img = new Image();
img.src = 'PATH TO IMAGE';
img.onload = function() {

ctx.drawImage(this, 0, 0);
myDynamicTexture.update();
```

For part of the image scaled onto part of the canvas

```javascript
const img = new Image();
img.src = 'PATH TO IMAGE';
img.onload = function() {

ctx.drawImage(this, image start x, image start y, image width, image height, canvas to x, canvas to y, destination width, destination height);
myDynamicTexture.update();
```

<Playground id="#5ZCGRM#4" title="Adding An Image" description="Simple example of adding an image with dynamic textures." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture3.jpg"/>

### Transformations

Anything that is drawn to a canvas can be transformed using methods like `scale`, `rotate`, or `translate`. It is helpful to `save` the context before transformaiton and then `restore` context after transformation to ensure the texure updates correctly.

``` javascript
const texSize = 512;

ctx.save();

// define position and size of rectangle
const left = texSize * 0.5 - (texSize * 0.125);
const top = texSize * 0.5 - (texSize * 0.125);
const width = 0.25 * texSize;
const height = 0.25 * texSize;

// translate context to center rotation of rectangle
const rotationCenterU = width * 0.5 + left;
const rotationCenterV = height * 0.5 + top;
ctx.translate(rotationCenterU, rotationCenterV);

// rotate context before drawing
ctx.rotate(Math.PI/4);

// draw rectangle
ctx.fillStyle = "Red";
ctx.fillRect(-width * 0.5, -height * 0.5, width, height);

ctx.restore();

```

<Playground id="#6XFI1A" title="Translate and Rotate Rectangle" description="Simple example of transforming a rectangle on a dynamic texture" image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture8.jpg"/>


## Playground Combination

This playground combines all the above techniques.

<Playground id="#5ZCGRM#1" title="All Dynamic Texture Techniques" description="Simple example of all of the dynamic texture techniques." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture4.jpg"/>

## Text and Area Matching

For a single line of text it is possible to fit the text into a specified area or to fit an area to a specified text.

### Fit Text Into an Area.

You have a plane with width and height, `planeWidth` and `planeHeight`, to form the width and height of the dynamic texture multiply both the plane width and height by the same number to maintain aspect ratio. The number to multiply by defines the sharpness of the text, low numbers produce blurred text. Now you can create the dynamic texture.

```javascript
const DTWidth = planeWidth * 60;
const DTHeight = planeHeight * 60;
const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene);
```

For the next stage using any size of font write and measure the width of text on the dynamic texture.

```javascript
const ctx = dynamicTexture.getContext();
const size = 12; //any value will work
ctx.font = size + "px " + font_type;
const textWidth = ctx.measureText(text).width;
```

The ratio of text width to size of font applied can be applied to the dynamic texture width to determine the font size that will fit the plane.

```javascript
const ratio = textWidth / size;

const font_size = Math.floor(DTWidth / ratio);
```

If you wish you can apply a multiplier to the ratio, the larger the multiplier the smaller the text and bigger margins.

```javascript
const font_size = Math.floor(DTWidth / (ratio * 1.1));
```

Now set the font and draw the text

```javascript
const font = font_size + "px " + font_type;
dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
```

Finally set and apply the material for the plane.

```javascript
const mat = new BABYLON.StandardMaterial("mat", scene);
mat.diffuseTexture = dynamicTexture;
plane.material = mat;
```

<Playground id="#TMHF80#1" title="Fit Text To Plane" description="Simple example of fitting text to a plane with a dynamic texture." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture5.jpg"/>

### Fit an Area to Text

Take a plane mesh of fixed height, **planeHeight** and text with a set font size you can then calculate how wide the plane must be for the text to fit in. In order to do this you need to know the width the text will take up on a dynamic texture. This is calculated using a temporary dynamic texture and measuring the text.

```javascript
const temp = new BABYLON.DynamicTexture("DynamicTexture", 64, scene);
const tmpctx = temp.getContext();
tmpctx.font = font;
const DTWidth = tmpctx.measureText(text).width;
```

Choose a height for the dynamic texture, **DTHeight** and to maintain the aspect ratio of the plane to the dynamic texture:

1. calculate the `ratio` planeHeight:DTHeight;
2. use the ratio to calculate the width of the `planeWidth` = DTWidth \* ratio;
3. create the dynamic texture to use as material with width and height, DTWidth and DTHeight;
4. draw text on dynamic texture;
5. create the plane with width and height planeWidth and planeHeight.

```javascript
const planeHeight = 3;
const DTHeight = 256; //or set as wished
const ratio = planeHeight / DTHeight;
const planeWidth = DTWidth * ratio;

const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene, false);
const mat = new BABYLON.StandardMaterial("mat", scene);
mat.diffuseTexture = dynamicTexture;
dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true); //use of null, null centers the text

const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight }, scene);
plane.material = mat;
```

<Playground id="#TMHF80" title="Fit Plane To Text" description="Simple example of fitting a plane to text with a dynamic texture." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture6.jpg"/>

## Serialization

The dynamic texture can be serialized with the scene using `SceneSerializer.Serialize()` or a mesh using `SceneSerializer.SerializeMesh()`.

**Note:** Be sure that the scene is ready before serialization.

This playground demonstrates serializing a dynamic texture associated with a material on a mesh:

<Playground id="#FU0ES5" title="Drawing Text and a Curve Texture Serialized Mesh" description="Simple example of drawing text and a curve texture serialized mesh." image="/img/playgroundsAndNMEs/divingDeeperDynamicTexture7.jpg"/>

## Dynamic Texture Example
![product customization with dynamic texture](/img/how_to/productCustomizationDynamicTexture.png)

This playground example incorporates a user-manipulated dynamic texture allowing the customization of an asset. This scene demonstrates many of the previous concepts and shows why dynamic textures are a great way to provide users with interactive scene materials.

<Playground id="#XMEL56#7" title="Product Customization" description="Customize the graphics of a skateboard deck." isMain={true} category="Dynamic Texture"/>

