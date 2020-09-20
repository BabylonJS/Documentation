# Getting Started - Working With Code
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

https://www.babylonjs-playground.com/#KDPAQ9#8

After adjusting the position of the car and its route so that it travels past the village houses we have 

https://www.babylonjs-playground.com/#KDPAQ9#9

In this case we have built the car. Let's now look at a model character that we can import along with its built-in animation.

