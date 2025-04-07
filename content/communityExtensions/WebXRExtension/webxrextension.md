---
title: WebXR extension package and utility
image: /img/extensions/WebXRExtension/thumb150.png
imageUrl: /img/extensions/WebXRExtension/thumb150.png
description: The library and utility are designed to simplify the creation of applications using hand gesture recognition. They also include other useful features for working with virtual reality headsets.
keywords: extensions, WebXR, Hand tracking
further-reading:
video-overview:
video-content:
---
# WebXR Extension

## Introduction
The package provides a set of various features for working with hand gestures and organizing spaces in immersive mode.

## Installation
just install the package: @clickon/xr-extension (for npm):
```shell
npm i @clickon/xr-extension
```

## Using

### Initiation and exit
Now you can initialize and use the service provided by the package. The service utilizes the standard WebXRDefaultExperience and does not interfere with its operation. This means you can continue using any standard WebXR features provided by BabylonJS.
```typescript
const xrService = new XRService();
await xrService.init(scene, options);
```

The service will be initialized with the options you provide.

```typescript
export type TXRServiceOptions = {
	mode: 'immersive-vr' | 'immersive-ar';
	features?: TXRFeaturesConfig;
	needBabylonUIEnterButton?: boolean;
	floors?: string[];
	enableColliding?: boolean;
	debugConfig?: TClickLoggerOptions & {
		outSlotName: string;
		isLoggerDeactivated?: boolean;
	};
};
```
Some of these values will be passed to the standard BabylonJS functions that handle XR,
while others will configure the XRService itself.

The *IXRService* and *TXRFeaturesConfig* defines the capabilities of the service.

Example of entering and exiting immersive mode after initialization:
```typescript
isOk = await xrService.activateXR();
// do some
xrService.exitFromXR();
```

### Access to features
Primarily, _XRService_ is used to access XR feature wrappers or the features 
themselves and work with them. The set of features and their initial configuration 
are defined by the _features?:TXRFeaturesConfig_ field in _TXRServiceOptions_.

```typescript
const handTrackingFeatureEnv = xrService.extractFeatureEnv('HAND_TRACKING');
if(handTrackingFeatureEnv){
    // interract with feature wrapper
}
```
All feature wrappers implement the _IXRFeatEnv_ and provide access to native xr-features of Babylon.js.
Please prefer the functions and attributes of the wrappers in all cases when they are provided.
All functions and attributes are described by corresponding interfaces for each wrapper.
```typescript
export interface IXRFeatEnv<NATIVE_FEAT_TYPE extends IWebXRFeature = IWebXRFeature>{
	//...
	readonly nativeFeature: NATIVE_FEAT_TYPE | undefined;
	//...
}
```

Useful links with descriptions of approaches, examples, and videos:
- [Article](https://medium.com/@drblax/gesture-recognition-babylonjs-webxr-a5d286c62c8f)
- [YouTube playlist](https://youtube.com/playlist?list=PLlta-b8CW53-4mmBGVYV7lwftqy-FcYFN&si=LUuI9YqANYsVwrem)
- [Live demos and utility](https://webxr.projects.clickon.pro)


  
