---
title: Getting Started - Chapter 3 - Car Animation
image:
description: Continue learning about animations in Babylon.js.
keywords: getting started, start, chapter 3, animation, animation basics
further-reading:
video-overview:
video-content:
---

# Getting Started - Car Animation

## Animate the Car in the Village

In a similar way to how we animated the wheels we now animate the car to travel a straight line over 5 secs., stop for 2 secs. and then repeat.
```javascript
const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

const carKeys = []; 

carKeys.push({
    frame: 0,
    value: -4
});

carKeys.push({
    frame: 150,
    value: 4
});

carKeys.push({
    frame: 210,
    value: 4
});

animCar.setKeys(carKeys);

car.animations = [];
car.animations.push(animCar);

scene.beginAnimation(car, 0, 210, true);
```

<Playground id="#KDPAQ9#16" title="Animated the Car Forward" description="Simple example of how to animate the car's position forward." image="/img/playgroundsAndNMEs/gettingStartedCarAnimation1.jpg"/>

After adjusting the position of the car and its route so that it travels past the village houses we have 

<Playground id="#KDPAQ9#17" title="Add the Car to the Village" description="Add the animating car back into the village." image="/img/playgroundsAndNMEs/gettingStartedCarAnimation2.jpg"/>

In this case we have built the car. Let's now look at a model character that we can import along with its built-in animation.

