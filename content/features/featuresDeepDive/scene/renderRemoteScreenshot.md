---
title: Rendering Scenes On A Remote Server
image: 
description: Learn how to render scenes on a remote server and take screenshots.
keywords: diving deeper, scene, remote, rendering, remote render
further-reading:
video-overview:
video-content:
---

## Render a scene and take a screenshot on a remote server

Capturing images of a Babylon scene (eg. GLTF model) from the server side can be useful for scenarios such as:
- Remote rendering of a scene to display on a device that does not support a browser
- Server side testing
- Creating a catalog of 3D model images

To get started follow the steps below:

## Setup a Babylon scene you would like to render

Create a local server hosting the scene or use a playground eg. <Playground id="#PN1NNI#1" title="Initial Setup" description="Simple example showing how to set up youur scene."/>

## Using Puppeteer
[Puppeteer](https://github.com/GoogleChrome/puppeteer) is an npm package that can be used to run and interact with a headless version of chrome. This way the same code written with Babylon to run in the browser should run the same way with puppeteer.

Create a browser instance and load a webpage
```
const browser = await puppeteer.launch({});
const page = await browser.newPage();
await page.goto("https://playground.babylonjs.com/frame.html#PN1NNI#1"); 
```

Inject JS into the webpage
```
page.evaluate("BABYLON.Engine.LastCreatedScene.activeCamera.alpha = 1.4;");
```

Take a screenshot of the webpage
```
await page.screenshot({path: './public/example.png'});
```
## Configuring to use the GPU
Typical server virtual machines do not provide access to a GPU and when they do provide access, setting up the proper drivers can be difficult to grant access to puppeteer. One method that has worked was using an [Azure NV virtual machine running Windows and installing grid drivers](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/n-series-driver-setup#nvidia-grid-drivers).

Once the VM is setup puppeteer must be configured to run in non-headless mode so that it utilizes the GPU renderer.
```
// Don't disable the gpu
var args = puppeteer.defaultArgs().filter(arg => arg !== '--disable-gpu');
// Run in non-headless mode
args = args.filter(arg => arg !== '--headless');
// Use desktop graphics
args.push("--use-gl=desktop")
// Lanch pupeteer with custom arguments
const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: true,
    args
});
```
After this initial setup, follow the same steps as described above

## Example
An example project can be found [here](https://github.com/TrevorDev/babylonServer)