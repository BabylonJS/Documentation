---
title: Using the Playground for Development in Babylon.js
image: 
description: Learn all about making your development process easier with the super handy playground.
keywords: welcome, babylon.js, diving deeper, contribution, contribute, open-source, oss, playground, develope
further-reading:
video-overview:
video-content:
---

# Using the Playground in Development of BJS

During the early stages of developing code to contribute to Babylon.js it can be useful to try out that code in the Playground. Just ensure that the Playground is in Typescript mode by using the link https://www.babylonjs-playground.com/ts.html# . The `New` button will then give you the starting code. 

## An Example

Babylon.js has code to form a bezier curve found at https://github.com/BabylonJS/Babylon.js/blob/master/src/Math/babylon.math.ts , (just search for Curve3 on this page) so it would make sense to put any code to form a bezier surface on the same page.

The first step is to produce code that works. You can of course immediately follow the steps in [how to start contributing](/how_to/how_to_start) and of course before submitting a PR there will have to be working code submitted as described on this page. However you might not yet be confident with the whole approach of forking the code, using git, setting up an IDE and pull requests but are familiar with using Typescript.

So an alternative is to try out the code in the playground. The following playground shows the Typescript code for a bezier surface which is in development with the playground.

* <Playground id="H3AF26#1" title="Playground Code Example - Bezier Surface" description="Simple playground example of a Bezier Surface." image="/img/playgroundsAndNMEs/divingDeeperUsingPlaygrounds1.jpg"/>

Though this shows working code it is not completely ready for copying into a local repository of Babylon.js, committing and sending a PR. For a start not all the comments needed are in place. 

Also once placed in the local repository the first line

```javascript
class BezierSurface {
```

would need to be changed to

```javascript
export class BezierSurface {
```


## From Playground to Pull Request

Once you are happy the code works and you have copied it to your local repository then before submitting your PR please make sure you have read the following to ensure a smooth positive result.

[Start Contibuting](how to start contributing)  
[Contributing Read Me](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md)  
[Code Guidelines](//doc.babylonjs.com/how_to/approved_naming_conventions)  
[Comments in the API](//doc.babylonjs.com/how_to/contribute_to_api)

On the other hand there is always the possibility that someone in the core team likes your idea and its execution so much they might just copy and add it to Babylon.js directly.


&nbsp;