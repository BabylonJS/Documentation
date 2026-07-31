---
title: Using the Playground for Development in Babylon.js
image:
description: Learn all about making your development process easier with the super handy playground.
keywords: diving deeper, contribution, contribute, open-source, oss, playground, develope
further-reading:
video-overview:
video-content:
---

# Using the Playground in Development of BJS

During the early stages of developing code to contribute to Babylon.js, it can be useful to try that code in the Playground. Just ensure that the Playground is in TypeScript mode by using the link https://www.babylonjs-playground.com/ts.html#. The `New` button will then give you the starting code.

## An Example

Babylon.js has code to create a Bezier curve at https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Maths/math.path.ts (just search for `Curve3` on this page), so it would make sense to put any code to create a Bezier surface in the same file.

The first step is to produce code that works. You can, of course, immediately follow the steps in [how to start contributing](/contribute/toBabylon/HowToContribute), and before submitting a PR there will need to be working code, as described on this page. However, you might not yet be confident with the full process of forking the code, using Git, setting up an IDE, and creating pull requests, even if you are familiar with using TypeScript.

So, an alternative is to try out the code in the Playground. The following Playground shows the TypeScript code for a Bezier surface being developed in the Playground.

<Playground id="H3AF26#1" title="Playground Code Example - Bezier Surface" description="Simple playground example of a Bezier Surface." image="/img/playgroundsAndNMEs/divingDeeperUsingPlaygrounds1.webp"/>

Though this shows working code, it is not completely ready to be copied into a local Babylon.js repository, committed, and submitted as a PR. For a start, not all the needed comments are in place.

Also once placed in the local repository the first line

```javascript
class BezierSurface {
```

would need to be changed to

```javascript
export class BezierSurface {
```


## From Playground to Pull Request

Once you are happy that the code works and have copied it to your local repository, please read the following before submitting your PR to help ensure a smooth, positive result.

[Start Contributing](/contribute/toBabylon/HowToContribute)
[Contributing Read Me](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md)
[Code Guidelines](/contribute/toBabylon/approvedNamingConventions)
[Comments in the API](/contribute/toBabylon/contributeToAPI)

On the other hand, there is always the possibility that someone on the core team will like your idea and its execution so much that they might just copy it into Babylon.js directly.
