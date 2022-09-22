---
title: Getting Started - Chapter 6 - The Switch On Event
image:
description: Learn how to start/stop a particle system with a click.
keywords: getting started, start, chapter 6, particles, input, interaction
further-reading:
video-overview:
video-content:
---

# Getting Started - The Switch On Event

## The Switch On Event

When we click the screen pointer on the fountain we want it to start. We do this by adding a function to an _onPointerObservable_ to deal with a pointer down event that switches the particle system between stop and start.

```javascript
let switched = false; //on off flag

scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
      if (pointerInfo.pickInfo.hit) {
        pointerDown(pointerInfo.pickInfo.pickedMesh);
      }
      break;
  }
});
```

```javascript
const pointerDown = (mesh) => {
  if (mesh === fountain) {
    //check that the picked mesh is the fountain
    switched = !switched; //toggle switch
    if (switched) {
      particleSystem.start();
    } else {
      particleSystem.stop();
    }
  }
};
```

<Playground id="#TC31NV#5" title="Start/Stop Particles on Click" description="Start and stop a particle system on click." image="/img/playgroundsAndNMEs/gettingStartedParticleSpray1.jpg"/>

Now we add this into the village world.

<Playground id="#KBS9I5#93" title="Add The Fountain To The Village" description="Add the fountain to the village." image="/img/playgroundsAndNMEs/gettingStartedParticleSpray2.jpg"/>

So far all the actions have been in daylight and now time moves to the night where we will need street lights.
