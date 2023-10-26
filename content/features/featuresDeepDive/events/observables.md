---
title: Observables
image:
description: Learn all about observables in Babylon.js.
keywords: diving deeper, observables
further-reading:
video-overview:
video-content:
---

## How To Use Observables

For many of you creating Babylon.js projects only [GUI](/features/featuresDeepDive/gui) and [scene](/features/featuresDeepDive/events/observables#scene-observables) Observables will be needed, particularly [scene.onPointerObservable](/features/featuresDeepDive/scene/interactWithScenes).

## Introduction

Babylon.js provides a lot of events (like scene.beforeRender) and before v2.4 there was not a unified way to handle them.
Starting with v2.4, we introduced (without breaking backward compatibility of course) a new pattern: the Observables.

There are two parts: the [Observable](/typedoc/classes/babylon.observable) and the [Observer](/typedoc/classes/babylon.observer). The Observable is a property of an object which represents a given event (like beforeRender for instance).
Users that want to have their own piece of code running in response to such event will register an Observer to the appropriate Observable. Then it's the duty of the Observable to execute the Observers, when appropriate.

The implementer uses an Observable to create a property which will trigger all the registered observers. The Generic type T is used to communicate a given data type from the Observable to the Observer.

Most users will simply be adding their own Observers to the Observables that Babylon.js provides. But it is also possible to create your own Observables (a simple example of which is below). For those who want to delve deeper please see the [API](/typedoc/classes/babylon.observable).

- <Playground id="#6IGFM2" title="Simple Custom Observable Example" description="Simple example of using an observable in a scene." image="/img/playgroundsAndNMEs/divingDeeperObservable1.jpg"/>
  An Observable - onXChange- is added to the master sphere. The two minion spheres and the actions they have to undertake form the two Observers which react when a change in the x position of the master is observed.

## Observable Methods and Properties

The following are available:

- [add](/typedoc/classes/babylon.observable#add)(): to add an Observer
- [addOnce](/typedoc/classes/babylon.observable#addonce)(): to add an Observer which will be executed once and then removed
- [remove](/typedoc/classes/babylon.observable#remove)(): to remove a previously registered Observer
- [removeCallback](/typedoc/classes/babylon.observable#removecallback)(): same as above but giving the callback instead of the Observer instance
- [notifyObservers](/typedoc/classes/babylon.observable#notifyobservers)(): used to notify all the registered Observers
- [notifyObserversWithPromise](/typedoc/classes/babylon.observable#notifyobserverswithpromise)(): calling this will execute each callback, expecting it to be a promise or return a value. If at any point in the chain one function fails, the promise will fail and the execution will not continue.
- [hasObservers](/typedoc/classes/babylon.observable#hasobservers): a property that returns true if at least one Observer is registered
- [hasSpecificMask](/typedoc/classes/babylon.observable#hasspecificmask)(mask): a function that returns true if at least one Observer is registered with this mask
- [clear](/typedoc/classes/babylon.observable#clear)() to remove all Observers
- [clone](/typedoc/classes/babylon.observable#clone)() to simply clone the object but not the registered Observers.

The following static methods are available:

- [FromPromise](/typedoc/classes/babylon.observable#fromPromise)(): to create an Observable from a Promise.

Many Babylon.js objects have a range of available Observables. Here is an [unordered list](//doc.babylonjs.com/search/?bjsq=observable) from the search facility of the Documentation with links to the API.

## Creating An Observable

It is not necessary to create a new Observable in order to add an Observer to an Observable that Babylon.js provides, but you may wish to create your own Observables. In particular, Observables can be very useful for connecting external libraries to Babylon.js:

```javascript
import { io } from "socket.io-client";

const socket = io("/admin");

const onConnectObservable = new Observable();
const text1 = new BABYLON.GUI.TextBlock();

socket.on("connect", () => {
  onConnectObservable.notifyObservers();
});

onConnectObservable.add(() => {
  text1.text = "Connected";
});
```

There is also a utility method `Observable.FromPromise` to create an Observable from a Promise:

```javascript
const onStatusObservable = Observable.FromPromise(axios("/ping").then((response) => response.statusText));

onStatusObservable.add((statusText) => {
  text1.text = "Server status: " + statusText;
});
```

Creating your own Observables can be help reduce coupling between different components. Instead of a hierarchy of components depending on each other, you can create multiple independent components and then simply connect them using a single parent component.

## Add An Observer

An Observer is formed from an object set to watch the Observable and the objects reaction to the observation.

In the following example the sphere and its scale change create an Observer through the Observable.[add](/typedoc/classes/babylon.observable#add)() method.

Set the Observable that notifies its Observers before the scene starts the rendering each frame.

```javascript
const alpha = 0;
scene.onBeforeRenderObservable.add(function () {
  sphere.scaling.y = Math.cos(alpha);

  alpha += 0.01;
});
```

- <Playground id="#UP2O8#0" title="Add an Observer" description="Simple example of how to add an observer to a scene." image="/img/playgroundsAndNMEs/divingDeeperObservable2.jpg"/>

To remove an Observer, you need to store it during it's creation to refer to it with remove. The following example remove the Observer before it is notified of even the first frame rendering.

```javascript
const alpha = 0;
const observer = scene.onBeforeRenderObservable.add(function () {
  sphere.scaling.y = Math.cos(alpha);

  alpha += 0.01;
});

scene.onBeforeRenderObservable.remove(observer);
```

- <Playground id="#UP2O8#1" title="Add and Remove an Observer" description="Simple example of how to add and remove an observer from a scene." image="/img/playgroundsAndNMEs/divingDeeperObservable3.jpg"/>

The following example removes the Observer during the rendering cycle. Since it is not possible to remove an Observer that does not exist there is a need to check whether the Observable still has the Observer.

```javascript
const alpha = 0;
const observer = scene.onBeforeRenderObservable.add(function () {
  sphere.scaling.y = Math.cos(alpha);

  alpha += 0.01;

  if (scene.onBeforeRenderObservable.hasObservers && alpha > 3) {
    scene.onBeforeRenderObservable.remove(observer);
  }
});
```

## Scene Observables

TheBabylon.js Scene Object has over 20 observables that 'fire' under various conditions. Most of them are checked EACH frame/render, and in a deterministic/predictable order or sequence. Below is a list of Scene observables checked during each renderLoop... in the order they are checked:

- [onBeforeAnimationsObservable](/typedoc/classes/babylon.scene#onbeforeanimationsobservable)
- [onAfterAnimationsObservable](/typedoc/classes/babylon.scene#onafteranimationsobservable)
- [onBeforePhysicsObservable](/typedoc/classes/babylon.scene#onbeforephysicsobservable)
- [onAfterPhysicsObservable](/typedoc/classes/babylon.scene#onafterphysicsobservable)
- [onBeforeRenderObservable](/typedoc/classes/babylon.scene#onbeforerenderobservable)
- [onBeforeRenderTargetsRenderObservable](/typedoc/classes/babylon.scene#onbeforerendertargetsrenderobservable)
- [onAfterRenderTargetsRenderObservable](/typedoc/classes/babylon.scene#onafterrendertargetsrenderobservable)
- [onBeforeCameraRenderObservable](/typedoc/classes/babylon.scene#onbeforecamerarenderobservable)
- [onBeforeActiveMeshesEvaluationObservable](/typedoc/classes/babylon.scene#onbeforeactivemeshesevaluationobservable)
- [onAfterActiveMeshesEvaluationObservable](/typedoc/classes/babylon.scene#onafteractivemeshesevaluationobservable)
- [onBeforeParticlesRenderingObservable](/typedoc/classes/babylon.scene#onbeforeparticlesrenderingobservable)
- [onAfterParticlesRenderingObservable](/typedoc/classes/babylon.scene#onafterparticlesrenderingobservable)
- [onBeforeRenderTargetsRenderObservable](/typedoc/classes/babylon.scene#onbeforerendertargetsrenderobservable)
- [onAfterRenderTargetsRenderObservable](/typedoc/classes/babylon.scene#onafterrendertargetsrenderobservable)
- [onBeforeDrawPhaseObservable](/typedoc/classes/babylon.scene#onbeforedrawphaseobservable)
- [onAfterDrawPhaseObservable](/typedoc/classes/babylon.scene#onafterdrawphaseobservable)
- [onAfterCameraRenderObservable](/typedoc/classes/babylon.scene#onaftercamerarenderobservable)
- [onAfterRenderObservable](/typedoc/classes/babylon.scene#onafterrenderobservable)

The Scene Object also has observers: onReady, onDataLoaded, onDispose, but they do not happen within a rendering/frame.

Also, [onBeforeStepObservable](/typedoc/classes/babylon.scene#onbeforestepobservable) and [onAfterStepObservable](/typedoc/classes/babylon.scene#onafterstepobservable) are available when using [deterministic lock step](/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep)

However possibly the most useful Observable is the one that checks what is happening to the screen pointer whether with mouse or with finger or controller. [scene.onPointerObservable](/typedoc/classes/babylon.scene#onpointerobservable) . For more details on that have a look into the [Interactions HowTo](/features/featuresDeepDive/scene/interactWithScenes)

## Observable-based countdown function

Starting Babylon 4.2 a new way of setting a delay call for a function was added. This method is calculating the time delay using observables. Think about a setTimeout function, but inside the babylon context. The best way to explain is to show an example:

```javascript
// classic set timeout:
setTimeout(() => {
  // code running here is not guaranteed to be called inside the render loop
  // Actually, it is most likely that it will be called OUTSIDE the render loop
}, 3000);

// the new and simple way
BABYLON.setAndStartTimer({
  timeout: 3000,
  contextObservable: scene.onBeforeRenderObservable,
  onEnded: () => {
    // code running here is guaranteed to run inside the beforeRender loop
  },
});
```

### setAndStartTimer

As you can see in the example, the babylon countdown timer is taking an observable as context. This observable is the most important part of this code - the observable is the context in which the rest of the time functions will be called and is in charge of calculating the delta time until finished. To explain it simply, these are the steps for the function we implemented before:

1. set time = 0, add an observer to scene.onBeforeRenderObservable
2. wait for the observer to be called.
3. in the observer - check if time-passed-since-start > timeout
4. If not, go to 2
5. If yes, call onEnded, remove the observer
6. We are done

A full example of the function's API:

```javascript
BABYLON.setAndStartTimer({
  timeout: 3000,
  contextObservable: scene.onBeforeRenderObservable,
  breakCondition: () => {
    // this will check if we need to break before the timeout has reached
    return scene.isDisposed();
  },
  onEnded: (data) => {
    // this will run when the timeout has passed
  },
  onTick: (data) => {
    // this will run
  },
  onAborted: (data) => {
    // this function will run when the break condition has met (premature ending)
  },
});
```

As you can understand, any observable can be used here, but some don't really make any sense. If, for example, we use pointer down observable, it might take a long time until the next call of the observer, making it impractical. But if you need to process pointer down input for the next 2 minutes, you can use it this way:

```javascript
let gameIsOn = true;
BABYLON.setAndStartTimer({
    timeout: 2 * 60 * 1000,
    contextObservable: scene.onPointerObservable,
    observableParameters: { mask: BABYLON.PointerEventTypes.POINTERDOWN },
    breakCondition: () => {
        // break if the game ended prior to this timeout
        return !gameIsOn;
    },
    onEnded: () { console.log('time is over'); },
    onTick: (data) => {
        // data.payload is the pointerInfo object from the onPointerObservable
        doSomethingWithTheData(data);
    }
});
```

A more practical example can be used to make the user touch something for 3 seconds (while indicating that the 3 seconds is counting):

```javascript
const guiButton = // created a GUI button
const guiButtonMaterial = ... // get the material
let pressed = false;
scene.onPointerDown = () => {
    pressed = true;
    BABYLON.setAndStartTimer({
        timeout: 2 * 60 * 1000,
        contextObservable: scene.onBeforeRenderObservable,
        breakCondition: () => {
            // break if no longer pressed
            return !pressed;
        },
        onEnded: () {
            console.log('Button pressed!');
            // back to a black button
            guiButtonMaterial.diffuseColor.set(0,0,0);
         },
        onTick: (data) => {
            // turn it slowly green on each call to the registered observer
            guiButtonMaterial.diffuseColor.set(0,data.completeRate,0);
        },
        onAborted: () => {
            // Aborted, back to a black button
            guiButtonMaterial.diffuseColor.set(0,0,0);
        }
    });
}

scene.onPointerUp = () => {
    pressed = false;
}
```

### Advanced Timer

Apart from this quick function, you can use the AdvancedTimer class, which brings a bit more flexibility but is a lot more verbose. The object itself is reusable, so it can eventually saved a few unneeded calls and object creations. The last example using the AdvancedTimer will look like this:

```javascript
const guiButton = // created a GUI button
const guiButtonMaterial = ... // get the material
const advancedTimer : BABYLON.AdvancedTimer<Scene> = new BABYLON.AdvancedTimer({
    timeout: 3000,
    contextObservable: scene.onBeforeRenderObservable
});
advancedTimer.onEachCountObservable.add(() => {
    // turn it slowly green on each call to the registered observer
    guiButtonMaterial.diffuseColor.set(0,data.completeRate,0);
});
advancedTimer.onTimerAbortedObservable.add(() => {
    // Aborted, back to a black button
    guiButtonMaterial.diffuseColor.set(0,0,0);
});
advancedTimer.onTimerEndedObservable.add(() => {
    // back to a black button
    guiButtonMaterial.diffuseColor.set(0,0,0);
    console.log('Button pressed!');
});

scene.onPointerDown = () => {
    advancedTimer.start();
}

scene.onPointerUp = () => {
    advancedTimer.stop();
}
```

## Usage with RxJS

[RxJS](https://rxjs.dev/) is a common library for handling Observables which are compliant with the [current ECMAScript Observable proposal](https://github.com/tc39/proposal-observable#ecmascript-observable). It provides a wide range of operators, allowing for advanced execution patterns.

The following (TypeScript) code can be used to convert a Babylon Observable into its RxJS equivalent:

```typescript
/**
 * Wraps a Babylon Observable into an rxjs Observable
 * 
 * @param bjsObservable The Babylon Observable you want to observe
 * @example
 * ```
 * import { Engine, Scene, AbstractMesh } from '@babylonjs/core'
 *
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement
 * const engine = new Engine(canvas)
 * const scene = new Scene(engine)
 *
 * const render$: Observable<Scene> = fromBabylonObservable(scene.onAfterRenderObservable)
 * const onMeshAdded$: Observable<AbstractMesh> = fromBabylonObservable(scene.onNewMeshAddedObservable)
 * ```
 */
export function fromBabylonObservable<T>(
  bjsObservable: BJSObservable<T>
): Observable<T> {
  return new Observable<T>((subscriber) => {
    if (!(bjsObservable instanceof BJSObservable)) {
      throw new TypeError("the object passed in must be a Babylon Observable");
    }

    const handler = bjsObservable.add((v) => subscriber.next(v));

    return () => bjsObservable.remove(handler);
  });
}
```
