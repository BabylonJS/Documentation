# Getting Started - Working with Code
## Grounding the World
At the moment we have a box floating in space. To make the scene more world like let's add ground and think of our box as a building set on the ground.

Adding a ground is simple using

```javascript
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10});
```
As we need to create a ground large enough, to put some buildings (boxes) on, the options parameter has two properties set, width in the x direction and height in the z direction. (Yes, we agree, since y is vertical it would make more sense for the properties to be width and depth.)

https://www.babylonjs-playground.com/#KBS9I5#67

The immediate thing to note is that  the ground cuts through the middle of the box. This is because when they are created meshes are positioned at the origin.

![ground](/img/getstarted/ground.png)

We need to move the box up half its height using

```javascript
box.position.y = 0.5;  //box created with default size so height is 1
```

https://www.babylonjs-playground.com/#KBS9I5#66

![house 0](/img/getstarted/house0.png)

Currently our world is silent. Let's add some sound.
