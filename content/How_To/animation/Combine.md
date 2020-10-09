# How To Combine Animations

## Concurrent

Simply set up more animations and add to the BabylonJS object's animations array.

For example adding a rotation animation to the [very simple slide animation](https://www.babylonjs-playground.com/#9WUJN#11) to get:

### Slide and Rotate

```javascript
var yRot = new BABYLON.Animation(
  "yRot",
  "rotation.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

var keyFramesR = [];

keyFramesR.push({
  frame: 0,
  value: 0
});

keyFramesR.push({
  frame: frameRate,
  value: Math.PI
});

keyFramesR.push({
  frame: 2 * frameRate,
  value: 2 * Math.PI
});

yRot.setKeys(keyFramesR);
```

- [Playground Example Slide and Rotate](https://www.babylonjs-playground.com/#9WUJN#12)

### Slide and Faster Rotation Rate

Changing the rotation values to larger numbers increases the rotation rate

```javascript
var yRot = new BABYLON.Animation(
  "yRot",
  "rotation.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

var keyFramesR = [];

keyFramesR.push({
  frame: 0,
  value: 0
});

keyFramesR.push({
  frame: frameRate,
  value: 4 * Math.PI
});

keyFramesR.push({
  frame: 2 * frameRate,
  value: 8 * Math.PI
});

yRot.setKeys(keyFramesR);
```

- [Playground Example Slide and Faster Rotate](https://www.babylonjs-playground.com/#9WUJN#13)

### Slide and Varying Rotation Rate

Changing the second key frame position to nearer the end of the frames gives a varying rotation rate.

```javascript
var yRot = new BABYLON.Animation(
  "yRot",
  "rotation.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

var keyFramesR = [];

keyFramesR.push({
  frame: 0,
  value: 0
});

keyFramesR.push({
  frame: 1.5 * frameRate,
  value: 4 * Math.PI
});

keyFramesR.push({
  frame: 2 * frameRate,
  value: 8 * Math.PI
});

yRot.setKeys(keyFramesR);
```

- [Playground Example Slide and Varying Rotation Rate](https://www.babylonjs-playground.com/#9WUJN#14)

## Consecutive Animations

In order to have one animation follow another then a further parameter needs to be added to the beginDirectAnimation function. This parameter is
itself a function to be called when the animation began by beginDirectAnimation is ended.

In fact two new parameters are needed since the function to be called is the sixth parameter and so the fifth parameter position needs to be filled.

### beginDirectAnimation and Parameters

scene.beginAnimation(target, start frame, end frame, loop, speed, on animation end);

- _target_ - _BabylonJS Object_, the BabylonJS object to be animated

- _animations_ - _array_, of all the animations to apply to the target

- _start frame_ - _number_, the frame at which to start the animation

- _end frame_ - _number_, the frame at which to end the animation

- _loop_ - _boolean : optional_, true when _loop mode_ of the animation is to be activated, false to run animation just once

- _speed_ - _number : optional_, default 1 matches animation frame rate, higher numbers speed up the animation, lower numbers slow it down

- _on animation end_ - _function : optional_, function called when animation ends, requires loop to be false

### Examples

The following are alterations to [Slide and Rotate](https://www.babylonjs-playground.com/#9WUJN#12)

In the first example the box rotates for 5 seconds then goes into a looped slide.

Code changes to beginDirectAnimation are looping becomes false, speed maintained as default 1, and the function nextAnimation is called as the first ends.

```javascript
scene.beginDirectAnimation(
  box,
  [yRot],
  0,
  2 * frameRate,
  false,
  1,
  nextAnimation
);
```

Additional function added before this is

```javascript
var nextAnimation = function() {
  scene.beginDirectAnimation(box, [xSlide], 0, 2 * frameRate, true);
};
```

- [Playground Example Consecutive Animations Rotate then Slide](https://www.babylonjs-playground.com/#9WUJN#15)

In the second example the rotation is continued as the box goes into a looped slide.

```javascript
var nextAnimation = function() {
  scene.beginDirectAnimation(box, [yRot, xSlide], 0, 2 * frameRate, true);
};
```

- [Playground Example Consecutive Animations Rotate then Rotate and Slide](https://www.babylonjs-playground.com/#9WUJN#16)


