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

PG MARKER - bab.chap3.anim.7.html

After adjusting the position of the car and its route so that it travels past the village houses we have 

PG MARKER - bab.chap3.anim.8.html

As it is the repetition of the car not only looks a bit silly it is also annoying. Let's improve the environment a little so that the car can look like it is driving through the village. We will place the village in a valley with distant hills created from a height map and put a road in for the car to travel along. While we are doing that let's add a sky. Then in the future chapters dot a few trees about and add a fountain we can switch on and off.
