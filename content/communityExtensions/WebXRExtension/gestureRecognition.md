---
title: WebXR extension / Gesture recognition
description: Gestures and combinations recognition 
keywords: extensions, WebXR, Hand tracking, gestures
further-reading:
video-overview: "https://youtu.be/brveNlSEnns?si=EG7FZV2LAFRrrn4a"
video-content:
---

# Hands tracking
The capabilities of the wrapper over WebXRHandTracking:

## Introduction
User hand gesture recognition can make an application feel more
native and allows for controller-free interaction.
To enable recognition, gestures need to be captured and prepared
in advance, and later recognized within the application.

## Typical usage

### Capturing

To capture handshapes, you can use the _captureGestureTemplate_ and _captureWristsAngles_
function after entering immersion mode.

But in most cases, capturing and configuring gestures is more convenient using the utility:
[WebXR utility](https://webxr.projects.clickon.pro)

Nevertheless, it is possible to use functions to capture gesture templates from _IHandTrackingXRFeatEnv_.

### Recognition

After capturing shapes and constructing combinations, you can use JSON files to describe them.
For this, the functions of the _IHandTrackingXRFeatEnv_ interface are useful.

```typescript
export interface IHandTrackingXRFeatEnv extends IXRFeatEnv<WebXRHandTracking> {
	
	// Repository of gestures (Handshapes)
	readonly gesturesRepo:IGesturesRepo;
	
	// Repository of combinations
	readonly combinationsReposMap:Map<string, ICombinationsRepo>;
	
	// Combinations flow
	readonly combinations$:Observable<TCombinationInfo>;
	
	// Start \ stop recognition
	startRecognize(combinationsRepoName?:string):void;
	stopRecognize(combinationsRepoName?:string):TFigureRecognizeReport | undefined;
	
	// Options setters
	setRecognizeOptions(options:Partial<TGestureMatchOptions>):void;
	
	// ... other functions
}
```
Example code for recognition with using template files:
```typescript

const options:TXRServiceOptions = {
	mode:'immersive-vr',
	features:{
		HAND_TRACKING:<HandsTrackingConfig>{/* config here */},
    }
} 

const xrService =   new XRService();
xrService.init(options);

const isActive  =   await this._xrService.activateXR();
if (!isActive) throw ('somthing went wrong');

const ftHandEnv =   xrService.extractFeatureEnv('HAND_TRACKING');

// Loading templates
const jLoader       =   new JsonLoader();
const fistTemplate  =   await jLoader.load('/figures/fist-outside.json');
const palmTemplate  =   await jLoader.load('/figures/palm-out.json');

// Add templates to repository
if(
    fistTemplate
    && palmTemplate
){
    // Add to feature
    ftHandEnv.gesturesRepo.set('fist-outside', fistTemplate);
    ftHandEnv.gesturesRepo.set('palm-out', palmTemplate);
}

// Combination
const activateComb  =   await jLoader.load('/combinations/activate.json');

const activateCombRepo  =   new CombinationsRepo();
activateCombRepo.set('activate', activateComb as TGestureCombination);

// Add to feature
ftHandEnv.combinationsReposMap.set('activate-deactivate', activateCombRepo);

// Start listening
ftHandEnv.combinations$.subscribe((comb)=>{
    if(
        (comb.type           ==  'COMBINATION')
        && (comb.repoName    ==  'activate-deactivate')
    ){
        if(comb.descriptor.combinationName == 'activate'){
            // ACTIVATE SOME
        }
    }
});

// Start recognition
ftHandEnv.startRecognize('activate-deactivate');

```

Useful links:
- [PalmOut gesture JSON example file](https://webxr.projects.clickon.pro/assets/gestures/figures/palm-out.json)
- [Fist outside gesture JSON example file](https://webxr.projects.clickon.pro/assets/gestures/figures/fist-outside.json)
- [Activate combination JSON example file](https://webxr.projects.clickon.pro/assets/gestures/combinations/activate.json)
- [Recognitions live demo page](https://webxr.projects.clickon.pro/#/about/gesture-recognizer)
