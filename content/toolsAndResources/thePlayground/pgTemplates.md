---
title: Playground Templates
image:
description: Learn how to add common code snippets into the playground quickly with playground templates.
keywords: babylon.js, tools, resources, playground, templates
further-reading:
video-overview:
video-content:
  - title: Video Overview of Playground Templates
    url: https://youtu.be/SRvCe6N7mdE
---

## Using Playground Templates

With Babylon.js 4.2, you now have a handy new tool available in the playground. This tool allows you to hit `CTRL+Space` on your keyboard to bring up snippets handy bits of code. From loading a box, to exporting a .gltf file, some of the most commonly used code blocks are now available at the click of a button.

You can also use the `tab` button to quickly navigate to the next property in the code block to fill in.

## Contributing Playground Templates

If you'd like to add your own snippet of code to the available templates, you can do so by updating the playground templates configuration file in the engine.

[Playground Templates Config File](https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/playground/public/templates.json)

Each playground template entry into this .json file should include 3 components:

- Label - The name that will be visible in the Intellisense menu when hitting `CTRL+Space`
- Documentation - A link to the appropriate documentation page that most accurately covers the topic of the template you're adding.
- insertText - The code snippet itelf

Let's take a look at a simple example, Seting up a shadow generator.

```json
{
    "label" : "Setup a shadow generator",
    "documentation" : "https://doc.babylonjs.com/divingDeeper/lights/shadows",
    "insertText" : "var shadowGenerator = new BABYLON.ShadowGenerator(${1:size}, ${2:the_light_source});\nshadowGenerator.getShadowMap().renderList.push(${3:the_mesh_that_casts_a_shadow});\n${4:mesh_that_receives_the_shadow}.receiveShadows = true;"
},
```

This will produce the following lines of javascript code:

```javascript
var shadowGenerator = new BABYLON.ShadowGenerator(${1:size}, ${2:the_light_source});
shadowGenerator.getShadowMap().renderList.push(${3:the_mesh_that_casts_a_shadow});
${4:mesh_that_receives_the_shadow}.receiveShadows = true;
```

While the label and documentation components are fairly straight forward, the code snippet itself has a few things to note.

- 1. For any property that you'd like the user to be able to tab over to, you can wrap a default value into this syntax: `${1:x}`. In the case of the shadow generator, the first property entry has the word "size" substituted for 'x'. This means that the word "size" will show up as the default value for that property, inviting the user to override it with their desired value. Also note that for every additional property you'd like to allow the user to tab over to, you'll increment the number in front of the colon. So in the case of the shadow generator we see the following tab property entries `${1:size}`, `${2:the_light_source}`, `${3:the_mesh_that_casts_a_shadow}`, `${4:mesh_that_receives_the_shadow}`. Notice how the number is increasing.

- 2. If you'd like your playground template to span multiple lines, use the `\n` syntax to signal the start of a new line. Again, take a look at the shadow generator example to see this in action.
