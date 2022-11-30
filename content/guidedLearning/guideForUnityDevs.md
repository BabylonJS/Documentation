---
title: Getting started with Babylon React Native, a guide for Unity Developers
image:
description: This guide is meant to provide a starting point for Unity Developers looking into Babylon.js, specifically Babylon.js for React Native.
keywords: babylon.js, unity, react, native
further-reading:
video-overview:
video-content:
---

# Intro

BabylonJS is underrated and I want more people to know about it. To keep a long story short, for compatibility reasons I've jumped from Unity, into the world of web technologies to make 3D applications. I'm currently working with react-native, which is a technology based on web technologies, to make native applications. Amazing. Since this is what I'm currently using, this is what this article will focus on.

It's certainly been an interesting journey, and when I went through it all I found it surprising that there weren't more resources for people like me who were just starting out. There's tons of articles and tutorials, but they all assume a certain amount of knowledge already. I don't know where you are with your web knowledge, but I started off not knowing what the 'node_modules' folder was. So I wanted to make this article for people in that situation. If you are curious about the world of web technologies but have no idea where to start, this is the place for you! The purpose of this article is to give you a place to get started with all this, to explain some of the lingo to help you get started.

# A very brief history of Babylon

Looking into the 'Babylonian' history, this project was thought up by two Microsoft employees (David Catuhe and David Rousset) and originally released in 2013. Meaning that, unofficially, this project is backed by Microsoft. It's not just a Microsoft party though, there's loads of other dedicated community members contributing as well. It's been made as a web 3D engine, but more recently they've made a native side to it. This is an actual native implementation, with almost the same javascript/typescript interface as its web counterpart. Which means, before you tackle a big native project, you can just roughly test out your idea on the online playground (https://playground.babylonjs.com/) and copy over that code into the native project.
Currently, there's three repositories to keep an eye on:

- https://github.com/BabylonJS/Babylon.js
- https://github.com/BabylonJS/BabylonNative
- https://github.com/BabylonJS/BabylonReactNative

# Why Babylon is amazing

So, to me, Babylon is wild. It's all open-source and maintained by some very talented people. The documentation is great (it can lag a bit behind the actual implementations though), the responses on the forum are just unreasonably quick (https://forum.babylonjs.com/), and I've been lucky enough that the developers will take time to answer any and all questions I've had about Babylon React Native. Compare that to the current state of Unity, where you can still build great stuff with it, but let's be honest, Unity is a big untouchable impersonal monolith. I don't feel like the developers working for Unity have a lot of personal investment in the work they do. And that's inevitable, but the charm of Babylon is that it's not this big monolith. It's a bunch of people invested in the work they do, happy to get you started with it.

Also, it's free. Basically no strings attached (make sure to check the licenses though), you can just straight up use it. So to come back to my point at the beginning of this paragraph. Babylon is wild. But where do you begin?

# Where do you begin

This was honestly a lot harder than I think it should be. I've found that there's a lot of prior knowledge assumed with every tutorial. First of all assuming you have a MacBook without actually stating that. The reason being that if you want to release iOS apps, you have to have some kind of Apple computer. If you're trying this on a windows computer, you may run into issues.

So to get you up to speed enough for you to have some grasp on the concepts. Here's what I think is the most important:

- NPM/Node.js/NPX/NVM
- node_modules
- package.json and package-lock.json
- The `android` and `ios` folders

What's also important but not going to be discussed in this article:
Eslint or linting in general (https://eslint.org/docs/about/)
Rollup or other bundling technologies (https://rollupjs.org/guide/en/#overview)

So let's quickly go over these first ones.

# NPM/Node.js/NPX/NVM

I've found the line between these sort of blurred, so here's the difference between them:

- Node.js (https://nodejs.org/en/) is an open-source runtime environment. So this is where your JavaScript runs in.
- NPM (https://www.npmjs.com/) is the Node Package Manager, so just like you have a package manager in Unity, this is the one for JavaScript and TypeScript. And since it depends on Node.js you first need to get that before you can install libraries in your project. It's possible to globally install libraries, but typically you would have them in the same folder as your project.
- NPX is a package runner, very similar to NPM. Instead of focussing on the managing of packages, it focuses on running packages instead without you having to worry too much on the versions (a better explanation: https://stackoverflow.com/a/52018825/2497085).
- NVM is the Node Version Manager, this helps you when you need to switch Node versions.

So to start, you need to install NVM (https://github.com/nvm-sh/nvm#installing-and-updating) Once you have that setup, you can install Node.js by running: `nvm install node` in the Terminal. The version of Node that you use can be very specific depending on your environment or if you're working with an existing app. If you're working with an existing app it's a good idea to ask which version of Node.js you need. Installing Node.js also gives us access to NPM, since that's included. So after installing Node.js you're done setting up for now.

# The node_modules folder

Now that we have Node.js and npm set up, we can talk about the node_modules folder. I wanted to highlight this, since it can seem like a random folder, but this is where all the libraries are that you install through npm, and the libraries that those libraries need. You can also update libraries through npm and this will change the content of the node_modules folder. The reason I mention this, is because you basically never want to change the contents in this folder, since it will be overwritten in the future.

# package.json and package-lock.json

These are the config files for what is in the project, and at what exact versions. You can add a library here, for example to add Babylon to the project you can do add `"@babylonjs/core": "5.0.0-alpha.65"`, in `dependencies: {}`. Now, the next time you run `npm i` in the folder where the package.json file is, it will install that library. You can also add it to the file automatically by running `npm i @babylonjs/core@5.0.0-alpha.65` in the terminal in the folder where your package.json file is. Now, this blindly adding of libraries can be a bit risky if you don't know what exactly you're adding. So it's always a good idea to dig into a library you want to use, go to the GitHub page and see if it's still active, and if there's no new weird issues there. The number of stars on the project is also a good indication on whether it's good to use and actively maintained. There's also other things you can add to your project that scan all the libraries for issues (https://snyk.io/ for example) but that's a bit beyond the scope of this article. The package-lock.json file is what keeps track of all the actual versions you've installed previously. So if you've got `"@babylonjs/core": "^5.0.0-alpha.65",` in your package.json file this means your project uses that version or higher. But in your package-lock.json file the actual version you've been using is noted and used when you delete your node_modules folder and reinstall for example.

# The Android and iOS folders

Now that's we've covered the node_modules folder, you'll notice the android and iOS folders. This is where the native part of the project is, there's a whole android project in the android folder, and a whole iOS project in the iOS folder. To get your React Native code to run on a device, you first have to build one of these projects to that device. After that, it can connect and run the javascript in your project. Unless you add new native libraries to the project, you should only have to do this once during development. After that, you can just open the app and continue on your app.

# Creating a new Babylon React Native project

Thankfully there's a Babylon React Native Sample project that we can use as a starting point. You can find that here: https://github.com/BabylonJS/BabylonReactNativeSample.

# Now what?

This is where you fly off into this new world! To give you some sense of where to go, here's a few links:
The starting point of the BabylonJS documentation: https://doc.babylonjs.com/journey
Again, the starting project for Babylon React Native: https://github.com/BabylonJS/BabylonReactNativeSample you can just clone this and run it.
Or, literally just start on web: https://playground.babylonjs.com/

I hope this was helpful to you and gave you some idea on how to get started with BabylonJS.
