---
title: Coroutines
image:
description: Easily extend logic over time with Babylon.js coroutines.
keywords: diving deeper, observable, observables, coroutine, coroutines
further-reading:
video-overview:
video-content:
---

# Coroutines in Babylon.js

## Introduction

Babylon 5.0 brings with it a new way for writing logic that runs over time:
coroutines!

Developers with experience using
[Unity 3D](https://docs.unity3d.com/Manual/Coroutines.html) and certain [native APIs](https://en.cppreference.com/w/cpp/language/coroutines) may already be familiar with some ideas and usages of coroutines. Broadly speaking, a coroutine is simply a function which can be paused and resumed.
In Babylon.js, we provide coroutine support through the `Observable` class to allow logic to be "spread" across multiple moments -- most commonly across multiple frames.

## Multi-frame Logic

Suppose you had a sequence of actions which were logically contiguous, but which you didn't want to all happen on the same frame. For example, suppose you want to spawn three meshes, but you don't want to spawn them all on the same frame and risk causing a frame hitch. Logically, then, what you want to do is something like the following:

- Spawn the first mesh.
- Wait until the next frame.
- Spawn the second mesh.
- Wait until the next frame.
- Spawn the third mesh.

Without coroutines, there are a number of varyingly-tricky things you could do to accomplish this with work queues, daisy-chained promises/callbacks, etc. With coroutines, however, you can do this pretty much by writing out the logic above directly.

```javascript
const spawnMeshesCoroutine = function* () {
  spawnTheFirstMesh();
  yield;
  spawnTheSecondMesh();
  yield;
  spawnTheThirdMesh();
};
scene.onBeforeRenderObservable.runCoroutineAsync(spawnMeshesCoroutine());
```

This coroutine will cause the logic of spawning the three meshes to be spread across three frames. If you run the above code on frame 100, for example, then `spawnTheFirstMesh` will be called on frame 100, `spawnTheSecondMesh` will be called on frame 101, and `spawnTheThirdMesh` will be called on frame 102. And, just like that, you've got logic running over multiple frames!

## How It Works

Babylon.js coroutines combine
[JavaScript generators](https://javascript.info/generators) with [`Observable`s](https://doc.babylonjs.com/divingDeeper/events/observables) to make it as easy as possible to spread logic across multiple frames.
At a high level, generator functions (an ES6 feature characterized by the `function*` syntax) don't return a simple return value object like traditional functions do. Instead, they return an intermediate object which allows the code inside the function to be run in "chunks," with the different chunks separated using the keyword `yield`. This intermediate object can then be invoked repeatedly, and each time it's invoked the generator function will "resume" from the last place it "paused" and keep going until it either gets to the next `yield` or reaches the end of the function.

This intermediate, repeatedly-invokable object is what `Observable.runCoroutineAsync` takes as an argument. The observable on which the coroutine is running will then invoke the generator -- causing another "chunk" of the coroutine's code to run -- every time that `Observable` itself is notified. This makes it very easy to write logic that "advances" every time a certain event monitored by an `Observable` occurs.

## Coroutines and Asynchronism

Coroutines are a clean and easy way to spread logic out over time, but they are not truly asynchronous in the same way as, for example, `Promise`s. Coroutines are polled per frame (or, more accurately, per `Observable`
notification), so they work very well for logic that happens densely -- for example, a logic sequence taking place over a series of subsequent frames. `Promise`s, by contrast, work very well for logic that happens
more sparsely -- network requests, file I/O, WebWorker calls, etc.
Coroutines and true asynchrony thus have separate but complementary strengths, so Babylon.js makes it easy to use a coroutine within a true async method and _vice versa_.

`Observable.runCoroutineAsync`, as the name implies, returns a `Promise<void>` which will either be resolved when the coroutine finishes or rejected if the coroutine is cancelled. This allows coroutines to be `await`ed as though they were true async functions. For example, the following code will print "Start", wait one second, print "A" and then "B" on back-to-back frames, then wait another second before printing "End".

```javascript
const coroutineFunc = function* () {
  console.log("A");
  yield;
  console.log("B");
};

const asynchronousFunc = async function () {
  console.log("Start");
  await BABYLON.Tools.DelayAsync(1000);
  await scene.onBeforeRenderObservable.runCoroutineAsync(coroutineFunc());
  await BABYLON.Tools.DelayAsync(1000);
  console.log("End");
};

asynchronousFunction();
```

Similarly, it's just as easy to pause a coroutine until a truly asynchronous function has completed. This is achieved using the `yield` keyword. The specifics are beyond the scope of this document, but `yield` can be thought of as an intermediate `return` command that pauses a generator function rather than terminating it. In Babylon.js coroutines, we typically use `yield` by itself to "return" nothing, which the coroutine system will
interpret as a command to pause the coroutine now and resume it next time the `Observable` is notified. However, we can also `yield` a `Promise`:

```javascript
yield BABYLON.Tools.DelayAsync(1000);
```

When we `yield` a `Promise`, the coroutine system will again immediately pause the coroutine for now; however, it won't resume it again until the first time the `Observable` is notified _after_ the `yield`ed `Promise` has been resolved. Thus, `yield`ing a `Promise` in a coroutine is very much like `await`ing a `Promise` in a true asynchronous function: it suspends execution of the function in question until the `Promise` is resolved.

```javascript
const asynchronousFunc = async function () {
  await BABYLON.Tools.DelayAsync(1000);
};

const coroutineFunc = function* () {
  console.log("A");
  yield;
  console.log("B");
  yield asynchronousFunc();
  console.log("C");
  yield;
  console.log("D");
};

scene.onBeforeRenderObservable.runCoroutineAsync(coroutineFunc());
```

This code snippet shows a coroutine `yield`ing a `Promise`; it will print "A" and "B" in back-to-back frames, then wait for one second, then then print "C" and "D" in back-to-back frames.

## Advanced Usage

The examples above have all illustrated simple, linear, finite logic sequences, but coroutines are not confined to this. Coroutines can be infinite, branching, and arbitrarily complex. In fact, it is entirely possible to write an entire core logic loop using coroutines.

```javascript
const playGame = function* () {
  displayGameLogo();

  while (!enterKeyPressed() && !escapeKeyPressed()) {
    yield;
  }

  if (escapeKeyPressed()) {
    return;
  }

  yield loadTheSceneAsync();

  spawnTheFirstMesh();
  yield;
  spawnTheSecondMesh();
  yield;
  spawnTheThirdMesh();
  yield;

  while (!escapeKeyPressed()) {
    if (jumpButtonPressed()) {
      // 30 frame uninterruptable parametric jump animation
      const jump = function* () {
        for (let t = 0; t <= Math.PI; t += Math.PI / 30) {
          playerCharacter.y = Math.sin(t);
          yield;
        }
      };
      // Suspend game logic until jump animation is complete
      // (Nonsensical thing to do, just for demonstration purposes)
      yield scene.onBeforeRenderObservable.runCoroutineAsync(jump());
    }

    yield;
  }

  yield saveGameStateAsync();

  showGoodbyeMessage();
};
scene.onBeforeRenderObservable.runCoroutineAsync(playGame());
```
