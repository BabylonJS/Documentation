---
title: GreasedLine advanced examples
image:
description: Short tutorial for advanced scenarios using GreasedLine 
keywords: diving deeper, meshes, parametric shapes, greasedline, greased line
further-reading:
video-overview:
video-content:
---

## GreasedLine advanced examples

This page contains some ideas for using GreasedLine.

### Audio analyzer

Shows how you can use `widths` and `offsets` to create a simple audio analyzer. There are two horizontal lines drawn. The big analyzer's widths are are changed and the smaller's offsets according the frequency data of the music. It also shows how can you manually create a `RawTexture` for the `colors` option. The colors are animated simply by modifying the UV offset of the colors texture.

Please unmute audio after the PG starts.

<Playground id="#3N0IS0#2" title="Line audio analyzer" description="A line audio analyzer with GreasedLine." />

### Circular audio analyzer

<Playground id="#H1LRZ3#232" title="Circle audio analyzer" description="A circle shaped audio analyzer with GreasedLine." />

### Light speed

Shows how to create a light speed effect using `widths`, `visibility` and scaling the lines along the `z` axis. There are several lines draw in `lazy` mode and joined into one mesh when the `updateLazy()` method is called. 

Visibility is set to a very low value so the lines appears as dots at the beginning. Widths are also kept low at startup. Simply by increasing the visiblity, widths and scaling the lines the effect becomes alive. Playing a bit with the glow value also helps the effect to be more attractive. 

If you want a longer effect you can create more instances of the line mesh and start animating them just at the right time. You could also use only two instances and reuse them. Animate one, prepare the other, animate the second and prepare the first one. Repeatn and you will get an infinite light speed effect.

<Playground id="#7MN4LZ#16" title="Light speed effect" description="Light speed effect." />

### Flower power

Slowly revealing beautiful text drawn by flowers. 

Uses `GreasedLineTools.GetPointsFromText` function to get the points coordinates of the drawn text. The text is then hidden and only it's line coordinates are used. Using the `GreasedLineTools.GetPositionOnLineByVisibility` goes through the drawn text by incrementing the visibility value and adds animated `Sprite`s of flowers to slowly reveal the whole text. 

If your text is not complete and flowers are missing you have to increase the capacity of the `SpriteManager` or lower the density of the flower by lowering the value at line 47. You can also alter the target size of the flowers in the `addFlower` function.

<Playground id="#0637HC#3" title="Flower power" description="Drawing text with a nice flower effect." />

### Lighting bolts

These lightnings will make even Thor envy. Calculates the position and widths of the bolts using a simple recursive algorithm and draws the lines. Add a bit of glow and you get a cool lightning.

<Playground id="#P5GH2C#2" title="Lighting bolts" description="Create cool looking lighting bolts using GreasedLine." />

### Sparks

GreasedLine can be used to create sparks.

First generate the path the sparks will follow. Create GreasedLines each with a random color from a predefined color palette and with different widths.

<Playground id="#KIW47V#1" title="Simulating sparks - step 1" description="A cool UFO surrounded by sparks created by GreasedLine - step 1." />

Now set to dash mode and set a `dashRatio` close to 1 so only a small part of the line will be visible in dash mode. Set the number of sparks along the line to an appropriate value.

```javascript
useDash: true,
dashRatio: 0.98,
dashCount: 10
```

<Playground id="#KIW47V#2" title="Simulating sparks - step 2" description="A cool UFO surrounded by sparks created by GreasedLine - step 2." />

Now start to animate the `dashOffset` property of the `line.greasedLineMaterial`. Add a glow effect as well.

```javascript
scene.onBeforeRenderObservable.add(() => {
    const animRatio = scene.getAnimationRatio()
    for (let i = 0; i < sparkCount; i++) {
        sparks[i].line.greasedLineMaterial.dashOffset += sparks[i].speed * animRatio
    }
})
```

<Playground id="#KIW47V#2" title="Simulating sparks - step 3" description="A cool UFO surrounded by sparks created by GreasedLine - step 3." />

All we need to do now is add the UFO and some particles.

<Playground id="#KIW47V" title="Simulating sparks" description="A cool UFO surrounded by sparks created by GreasedLine." />

### Revealing text

Shows how can you make a revealing text using the `visibility` property.

<Playground id="#H1LRZ3#234" title="Revealing text" description="The text is slowly drawn on the screen." />

### Trees

Just some vegetation drawn using GreasedLines. 

You will want to tweak the parameters for sure to get a low poly version of the the tree/grass/bush otherwise this technique is not recommended for production because it generates a lot of geometry. The visual appearance is neither not quite satisfying but you can achieve quite good results by generating grass/bushes (remove the trunk of the tree). Instancing is highly recommended. 

Press PLAY to generate a new one.

<Playground id="#DEHK6P#3" title="Trees" description="Parametric trees using GreasedLine." />
