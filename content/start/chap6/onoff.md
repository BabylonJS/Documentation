# Getting Started - Working With Code
# The Switch On Event
When we click the screen pointer on the fountain we want it to start. We do this by adding a function to an *onPointerObservable* to deal with a pointer down event that switches the particle system between stop and start.

```javascript
let switched = false;  //on off flag

scene.onPointerObservable.add((pointerInfo) => {      		
    switch (pointerInfo.type) {
		case BABYLON.PointerEventTypes.POINTERDOWN:
			if(pointerInfo.pickInfo.hit) {
                pointerDown(pointerInfo.pickInfo.pickedMesh)
            }
		break;
    }
});
```

```javascript
const pointerDown = (mesh) => {
    if (mesh === fountain) { //check that the picked mesh is the fountain
        switched = !switched;  //toggle switch
        if(switched) {
            particleSystem.start();
        }
        else {
            particleSystem.stop();
        }
    }
}
```


https://www.babylonjs-playground.com/#TC31NV#5

Now we add this into the village world.

https://www.babylonjs-playground.com/#KBS9I5#93

So far all the actions have been in daylight and now time moves to the night where we will need street lights.