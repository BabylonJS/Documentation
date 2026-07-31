---
title: Sprites
image: 
description: Learn all about sprites in Babylon.js.
keywords: babylon.js, diving deeper, sprites
further-reading:
video-overview:
video-content:
---

# Sprites

Sprites are 2D images and always face the camera. They can be used to display animated characters and particles, and to simulate complex 3D objects like trees.  

For animation, individual sprite images are collected together in a single file called a spritesheet.

* A uniform spritesheet is one where all the sprites are exactly the same size and arranged in order in the file. When you read the term spritesheet in the documentation, you can usually assume that it is referring to a uniform spritesheet. A uniform spritesheet is overseen by a *Sprite Manager*.
* A packed spritesheet is one where the sprites can be of different sizes and are often packed in such a way as to minimize the overall size of the file. Usually the full term _packed spritesheet_ will be used for such a spritesheet. A packed spritesheet is overseen by a *Sprite Packed Manager*. * available from BJS version 4.1*

For sprites, the use of one of these managers is mandatory, even for a single sprite. They optimize GPU resources by grouping multiple instances of a sprite in one place. 

Also available for any grid-like implementation (in a 2D or 2.5D game level, for instance) that requires thousands of sprites to be animated and rendered is a special system called a *Sprite Map*, *available from BJS version 4.1*
