---
title: How to use BabylonJS with Vue - messages driven scene
image:
description: How to integrate BabylonJS into a Vue application and use a messaging bus to pass data between the two frameworks
keywords: babylonJS, extension, external libraries, external, vue, vue2, vue3, quasar
further-reading:
video-overview:
video-content:
---

## Prerequisites

Clone the repo https://github.com/RolandCsibrei/babylonjs-vue-messages-driven-scene and install. Instructions can be found on the repo's home page.

You can also check the application running at https://babylonjs.nascor.tech/scene-director/

## The problem

If you are exposing BabylonJS objects and you are manipulating the directly with Vue, you will sooner or later end up with very low FPS caused by multiple redraws of the scene. The reason is that you mess up something with Vue's reflectivity and something is being called recurrently.

## The solution

Do not expose the BabylonJS objects and send always a copy of your objects in your methods or just simply use `JSON` for your data.

## Choosing JSON?

So do you have to `JSON.stringify` and `JSON.parse` every piece of data you are passing between Vue and BabylonJS? **Yes**, but we can write a class which will help us to do so with minimal effort.

Having everything in JSON opens up new possibilites, so we can leverage a messaging bus for easy data passing between the two frameworks.

## The idea behind messaging

We don't want our Vue code to know about BabylonJS implementation details, we want methods, we can call, which will ensure the required tasks to be done. Let's jump to the example project, it will be easier to follow how the data is passed and received.

## The Marble example

This examples uses Mitt bus (https://github.com/developit/mitt), but you can you any messaging bus. In Vue2 you can use `new Vue()` to create a bus.

![](/img/resources/vue/vue-messages-01.png)

`assets` - you all know
`bus` - the Mitt bus wrappers
`components` - our Vue component which displays the BabylonJS scene
`director` - our layer between Vue and BabylonJS
`scenes` - our BabylonJS scene
`utils` - some utility methods

## The Bus

Now that we can use messaging to communicate between Vue and BabylonJS, how about to have this communication `async` so for example the method called by Vue can `await` a method, which runs on BabylonJS code, so simply we create an async wrapper around the synchronous bus.

Let's introduce an interface for our message bus. I will show you only the `AsyncBus` implementation. The synchronous bus is pretty much the same. This interface must be implemented by our bus.

![](/img/resources/vue/vue-messages-02.png)

as seen in `AsyncBus.ts`

![](/img/resources/vue/vue-messages-03.png)

`AsyncBus` is just a facade and uses the Mitt bus under the hood, but adds asynchronousity to our messaging.

## The Scene Director

The Scene Director is a simple method-call-to-message converter, so your Vue code calls code on the `SceneDirector` which creates message(s) and sends it(them) using our `AsyncBus` and as far as our BabylonJS scene is interested in a message, (it is subscribed to process a particular message, basically at low level this is calling `Mitt.$on(messageType, callback)`, it gets executed. When the execution finished the BabylonJS scene have to notiy the Scene Director, that it has finished execution. The Scene Director `awaits` for a specific message type `SceneDirectorEventBusMessages.SceneDirectorCommandFinished` with some information about the executed command. Don't worry there are helpers methods and the usage is very easy.

Let's jump to Vue!

## Vue page

This example uses `App.vue` for the whole UI, but you should not put everything here and it is a good idea to have a `router` at hand and of course use pages/layouts/views/components for better modularity of your project.

![](/img/resources/vue/vue-messages-04.png)

First of all you have to import our `SceneDirector` class and create an instance so you can call it's methods.

![](/img/resources/vue/vue-messages-05.png)

The example application comes with three methods. As you can see, all methods are `async`. I marked some `void`, because I just don't want to `await` methods returning `void` for now. However the `getMeshnames` method has a return type of `string[]` and I am interested in the result, so I must use `await` here.

## Scene Director methods

Ok, so let's se our method implementation in the Scene Director.
![](/img/resources/vue/vue-messages-06.png)

All we do here is calling a helper method called `asyncCommand`

![](/img/resources/vue/vue-messages-07.png)

where we need to specify the message type and if we have something to send, the `payload`.

## Message types

We have to specify, what messages are we going to send throught our bus, so we have this:

![](/img/resources/vue/vue-messages-08.png)

There are two types of messages, just for better readibility, you can put them under one enum if you like so. `SceneDirectorEventBusMessages`, these are sent by Vue towards BabylonJS and obviosly the second one is moving from BabylonJS towards Vue.

It is a good idea not to create a message type for every single action, for example you are not going to create a message `LookLeft` and a `LookRight`, but you will create a message `LookAt` and call it with a parameter, however in your `SceneDirector` you can have two separate methods, so Vue just calls `LookLeft` or `LookRight` and the `SceneDirector` send a message `LookAt` with a parameter { rot: - Math.PI / 2 } or { rot: Math.PI / 2 } which will set the cameras `alpha` for example.

## BabylonJS scene

You simply register your message subscriptions by modifying this method:
![](/img/resources/vue/vue-messages-09.png)
So it maps message types to functions.

Let's have a look at the functions:
`addMarble` adds a new marble (maybe atoms should be a better name, just look at the page screenshot below)

![](/img/resources/vue/vue-messages-10.png)
As seen on the screenshot above, every mapped method receives a command. The `payload` stuff has to be clear for all of you, if not, you can access the `payload` sent by the `SceneDirector` here, in our case the `name` of the marble.

`addMarbleByName` just does this:

![](/img/resources/vue/vue-messages-11.png)

The very important thing here is to call `this.commandFinished(sceneDirectorCommand)` after you method has finished. If you started an animation and want to wait for it, no problem, just call `this.commandFinished(sceneDirectorCommand)` in your animation end callback.

If you want to send a message towards Vue, you can use

![](/img/resources/vue/vue-messages-12.png)

where `this.emitCommand` is just a helper method

![](/img/resources/vue/vue-messages-13.png)

and don't forget to register your message in `SceneDirector` (`MySceneDirector` in our example)

![](/img/resources/vue/vue-messages-14.png)

Unregistering events is a must also :) Just take your time :slight_smile:

## Vue ref

In `App.vue` we can `use` some data from the `SceneDirector`

![](/img/resources/vue/vue-messages-15.png)

what is a simple `ref`:

![](/img/resources/vue/vue-messages-16.png)

and whenever a `MarbleSelected` message arrives we just set the ref's `value`

![](/img/resources/vue/vue-messages-17.png)

**You should always prefer loosely coupled architecture of your solution, so you would rather use a callback instead of ref so you don't have to reference any Vue object in SceneDirector**. That way you could change Vue for any other framework and you don't have to rewrite any BJS related method. The Vue `ref` is used here just as an example of how to use refs. However if you are going to stick with Vue, `ref` is the way.

## The example app

![](/img/resources/vue/vue-messages-18.png)

The app creates 40 marbles on startup. You can add a marble by entering it's name to the text input and hit Add marble. Remove marbles will remove some of the marbles by each click. The last button will query the scene for all the meshe names on the scene and will print it out to the console.The methods are described above in the ##Vue page## section.

## WebWorkers

So we have a message drive scene?! You can easily move your BabylonJS scene to a WebWorker!! Or you can control your scene by external messages, for example a light sensors can deliver messages for controlling `light.intensity` on BabylonJS lights...

## Message flow logged in the console

Example of a `getMeshNames` message flow from the `SceneDirector` to `MarbleScene` and back to `SceneDirector` and finaly gets `console.logged` in `App.vue`

![](/img/resources/vue/vue-messages-19.png)

## Links

You can find a quick prototype using this technique running here https://babylonjs.nascor.tech/scene-director/

Source code repository using Vue3 is at https://github.com/RolandCsibrei/babylonjs-vue-messages-driven-scene

[All links from this tutorial at one place](/extensions/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_0/ "All links from this tutorial at one place")

[Part 1](/extensions/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_1/ "How to use BabylonJS with Vue") of this tutorial

[Part 2](/extensions/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_2/ "How to pass data between BabylonJS and Vue") of this tutorial

[Part 3](/extensions/Babylon.js+ExternalLibraries/BabylonJS_and_Vue/BabylonJS_and_Vue_3/ "BabylonJS and Vue - async scene methods") of this tutorial
