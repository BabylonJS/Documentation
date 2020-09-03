# Getting Started - Working With Code
## Foundation of Animation

We will start with a wheel and rotate it about its axle. Remember that in order to have the car the upright we rotated it about the x axis and so the axle is along the y axis of the cylinder.

We need to create a new animation object

```javascript
    const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
```
which has the parameters - name, property to animate, animation frames per second, property to animate type, loop mode, in this case repeat animation.

We follow this with the key frame array where we set values for the property to animate by frame number
```javascript
const wheelKeys = []; 

//At the animation key 0, the value of rotation.y is 0
wheelKeys.push({
    frame: 0,
    value: 0
});

//At the animation key 30, (after 1 sec since afps = 30) the value of rotation.y is 2PI for a complete rotation
wheelKeys.push({
    frame: 30,
    value: 2 * Math.PI
});
```

Finally we link the key frame array to the animation, the animation to the mesh and begin it.
```javascript
//set the keys
animWheel.setKeys(wheelKeys);

//Link this animation to a wheel
wheelRB.animations = [];
wheelRB.animations.push(animWheel);

//Begin animation - object to animate, first frame, last frame and loop if true
scene.beginAnimation(wheelRB, 0, 30, true);
```

Since all the wheels rotate the same we can use the same animation for all.

```javascript
scene.beginAnimation(wheelRF, 0, 30, true);
scene.beginAnimation(wheelLB, 0, 30, true);
scene.beginAnimation(wheelLF, 0, 30, true);
```

PG MARKER - bab.chap3.anim.5.html

To ensure that in later playgrounds the focus is on new code we will save the car as a model and import and animate it as an item.

```javascript
BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/BabylonJSGuide/docampus/master/public/html/assets/", "car.babylon").then(() =>  {
    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
});
```

PG MARKER - bab.chap3.anim.6.html

We can now animate the car itself and add it into the village
