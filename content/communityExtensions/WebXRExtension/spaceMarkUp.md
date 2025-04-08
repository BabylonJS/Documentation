---
title: WebXR extension / Space markup
description: Space markup in immersive mode 
keywords: extensions, WebXR
further-reading:
  - title: Using slopes live demo
    url: https://webxr.projects.clickon.pro/#/about/slopes-overview
  - title: Using stairs live demo
    url: https://webxr.projects.clickon.pro/#/about/stairs  
video-overview: "https://youtu.be/ti8ViO6BcgI?si=VtVGBdXaUC_MTsFf"
video-content:
---

# Space markup

## Introduction
Space markup is used for quickly constructing simple XR simulators and helps
easily organize phantom objects in space. These objects can "interact" with the user,
emulating walls, slopes, curved surfaces, stairs, elevators, etc.

### Preparing the space
To enable functionality, we need to include the SPACE_MARKUP
feature in the configuration.

Useful types options and floor description: 
```typescript
type TSpaceMarkUpOptions = {
	// Minimum height difference recognized as a step or elevation change
	minStepValue: 0.15,
	
	// Maximum height difference the user can overcome in a "stepping" style
	maxStepValue: 0.45,
	
	// Duration of the step-up/step-down animation (default: 60 frames)
	stairStepAnimationDurationInFrames: 60,
	
	// If set, allows the user to move within this radius before being pulled back
	// to the last registered floor position. Works on x, z axes.
	// Essentially, how far the user can deviate from the boundary.
	borderOffset: 0.1,
	
	// When returning the user to a safe zone, this value determines the offset
	// away from the boundary to prevent triggering repeated floor boundary exits
	// due to minor jitter.
	returnOffset: 0.3,
	
	// Backward correction
	// The headset extends slightly forward relative to the user's center of mass.
	// This correction reduces desynchronization between the head and body position.
	//
	// [VR-P1-DEVICE]HEAD
	//                body
	//                body
	//         foot-P2-foot
	//
	// In the schematic, P1 represents the headset center,
	// while P2 is the correction point for XZ alignment (typically 0.1 - 0.22).
	realBodyXZCorrection: 0.17,
	
	// Default ray length for surface detection (shorter is better).
	// Can and should be adjusted dynamically using setRayLength().
	defaultRayLength: 3,

    //...
}

export type FloorDescription = {
	// The mesh representing the surface
	mesh: AbstractMesh;
	
	// If true, movement beyond this surface will be blocked
	lock?: boolean;
	
	// List of surfaces that can be transitioned to
	allowList?: AbstractMesh[];

    // Enables sliding logic	
	isSlope?: boolean;
	
	// Critical angle (in degrees) at which sliding starts
	criticalAngleDeg?: number;
};
```

In code of application:

```typescript

const options = <TXRServiceOptions>{
    mode:'immersive-vr',
    features:{
	    SPACE_MARKUP:{
		    nativeConfig:<TSpaceMarkUpOptions>{ /* ... */}
        }
    }
}

const xrService =   new XRService();
xrService.init(options);
await xrService.activateXR();

// Feature
const spaceMarkUp  =   await xrService.extractFeatureEnv('SPACE_MARKUP');

spaceMarkUp.addFloors(<FloorDescription[]>[
	{mesh:scene.getMeshById('MainFloor')!},
	{mesh:stair,},
    /* ... */
	{mesh:slope, isSlope:true, criticalAngleDeg:5}
]);

spaceMarkUp.run();
// Also is possible set pause
spaceMarkUp.pause();
```

Additionally, you can configure a special effect material that changes the
scene when the user approaches the boundary of the allowed area.
```typescript
export interface ISpaceMarkUpEnv {
	//...
	enableBorderVFX(active:boolean):void;
	setBorderVFXMaterial(material:NodeMaterial):void;
	// ...
}
```
