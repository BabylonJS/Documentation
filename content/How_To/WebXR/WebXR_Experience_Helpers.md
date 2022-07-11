---
title: WebXR Experience Helpers
image: 
description: Learn about WebXR experience helpers in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR
further-reading:
video-overview:
video-content:
---


## Introduction

In order to simplify development for WebXR we offer a WebXR helper that will initialize WebXR environment automatically. This environment allows you to develop your AR and VR experiences in a easy to use, flexible and fully configurable manner. 

We recommend using the [Default Experience Helper](#the-webxr-default-experience-helper) for ease of use, as it offers a full XR experience, including: UI, teleportation and more. In contrast, the basic set of functionalities is offered via [Basic Experience Helper](#the-webxr-basic-experience-helper), it offers more controll when it comes to configuring the specifics that better fit your use-case.

*Note that you are not forced to use these experience helpers in any way. You can always use your own implementation instead.*

## The WebXR (Basic) Experience Helper

The basic experience helper will:

* Initialize the XR scene;
* Create an XR Camera;
* Initialize the features manager;
* Offers help functions to enter and exit the XR session.

The basic experience helper offers direct access to the following:

* An initialized [Session Manager](/divingDeeper/webXR/webXRSessionManagers);
* A configured [XR Camera](/divingDeeper/webXR/webXRCamera) that will have the non-VR camera's position when entering XR;
* Initialized [Features Manager](/divingDeeper/webXR/webXRFeaturesManager).

### Usage

The experience helper is promise-based, which technically means its help-functions are mostly asynchronous.

To use the WebXR Experience Helper, first Create one using the static factory:

``` javascript
const xrHelper = await WebXRExperienceHelper.CreateAsync(scene);
```

If the browser does not support XR an exception will be thrown and will you will need to catch it:

``` javascript
try {
    const xrHelper = await WebXRExperienceHelper.CreateAsync(scene);
} catch (e) {
    // no XR support
}

// or:
WebXRExperienceHelper.CreateAsync(scene).then((xrHelper) => {
    // great success
}, (error) => {
    // no xr...
})
```

### Entering XR

After initializing the XR helper, it is possible to enter an XR session, for example in immersive VR mode:

``` javascript
const sessionManager = await xrHelper.enterXRAsync("immersive-vr", "local-floor" /*, optionalRenderTarget */ );
```

To read more about session modes ( `immersive-vr` in this example), and reference type modes ( `local-floor` ), please read the [WebXR specs](https://immersive-web.github.io/webxr/). The most common scenario is VR in local floor mode, which is the one we are showing here.

If there is an error while creating the experience helper, the console will show it.

### Exiting XR

To exit, simply call the exitXRAsync function:

``` javascript
await xrHelper.exitXRAsync();
```

### Observables

#### The state observable

In this example, the session manager will be initialized if the XR session is ready to use. Alternatively, you can ignore the `await` and use the **state observable** of the xr helper:

``` javascript
xrHelper.onStateChangedObservable.add((state) => {
    switch (state) {
        case WebXRState.IN_XR:
            // XR is initialized and already submitted one frame
        case WebXRState.ENTERING_XR:
            // xr is being initialized, enter XR request was made
        case WebXRState.EXITING_XR:
            // xr exit request was made. not yet done.
        case WebXRState.NOT_IN_XR:
            // self explanatory - either out or not yet in XR
    }
})
```

#### Pose initialized observable

The `onInitialXRPoseSetObservable` will trigger all observers when the pose of the camera was set and before the first frame was rendered.

It can be used to define, for example, a height offset (if the ground is not at 0, or if the user starts in a different level):

``` javascript
xrBasicHelper.onInitialXRPoseSetObservable.add((xrCamera) => {
    // floor is at y === 2
    xrCamera.y = 2;
});
```

# The WebXR Default Experience Helper

The default experience helper will:

* Create a [Basic WebXR Experience Helper](#the-webxr-basic-experience-helper) and initialize it;
* Create an HTML UI button to enter XR;
* Init the input source class which will initialize controllers;
* Enable the pointer selection and teleportation features.

## Usage

The simplest way to use the default experience is calling the help function of `scene` :

``` javascript
var defaultXRExperience = await scene.createDefaultXRExperienceAsync( /* optional configuration options */ );
```

This is equivalent to:

``` javascript
var defaultXRExperience = await WebXRDefaultExperience.CreateAsync(scene, /* optional configuration options */ )
```

After calling this and assuming the browser supports XR, you will see the Enter-XR GUI on the bottom right of the screen unless the browser **does not support XR**. The GUI will not be displayed. To check if the default experience initialized correctly, make sure the `baseExperience` variable was created:

``` javascript
var defaultXRExperience = await scene.createDefaultXRExperienceAsync( /* optional configuration options */ );
if (!defaultXRExperience.baseExperience) {
    // no xr support
} else {
    // all good, ready to go
}
```

### Configuration options

The default xr experience helper takes an options map for configuration. Everything, including the options itself is optional:

``` javascript
class WebXRDefaultExperienceOptions {
    /**
     * Floor meshes that will be used for teleporting
     */
    public floorMeshes ? : Array < AbstractMesh > ;

    /**
     * Enable or disable default UI to enter XR
     */
    public disableDefaultUI ? : boolean;

    /**
     * optional configuration for the output canvas
     */
    public outputCanvasOptions ? : WebXRManagedOutputCanvasOptions;

    /**
     * optional UI options. This can be used among other to change session mode and reference space type
     */
    public uiOptions ? : WebXREnterExitUIOptions;

    /**
     * Disable the controller mesh-loading. Can be used if you want to load your own meshes
     */
    public inputOptions ? : IWebXRInputOptions;

    /**
     * Should teleportation not initialize. defaults to false.
     */
    public disableTeleportation ? : boolean;
}
```

Check the code documentation for further details.

### Pointer selection and teleportation

The default experience initializes both pointer selection (laser pointer and interaction with the meshes in the scene) and teleportation features automatically. If floor meshes are provided in the options, the teleportation will include it when created. If not you can add meshes later or disable it.

To read more about both features, check the [Features Manager](/divingDeeper/webXR/webXRFeaturesManager)

To enable / disable the teleport and pointer selection:

``` javascript
// assuming xrHelper initialized correctly!

// disable:
defaultXRExperience.teleportation.detach();
defaultXRExperience.pointerSelection.detach();

// (re)enable:
defaultXRExperience.teleportation.attach();
defaultXRExperience.pointerSelection.attach();
```

### Configuring the GUI

The GUI is the right way to enter and exit the XR experience. Otherwise you can directly use the method, offered by [Basic Experience Helper](#the-webxr-basic-experience-helper), to enter and exit XR as mentioned [above](#entering-xr). It defaults to a VR immersive session in local-floor reference space.

You can change the `uiOptions` to setup the **AR** session instead of the **VR** session:

``` javascript
var defaultXRExperience = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
        sessionMode: 'immersive-ar'
    }
});
```

### Available Observables

Apart from those you can find in the [Basic Experience Helper](#the-webxr-basic-experience-helper) the [Default Experience Helper](#the-webxr-default-experience-helper) does not offer any observables.

### Further features

The default experience offers direct access to the following:

* `input` - initialized [WebXRInputSource]()
* `enterExitUI` - initialized [GUI]()
* `renderTarget` - The default WebXR render target
