---
title: WebXR extension / Hands Animation
description: Hands Animations. Recording and playback
keywords: extensions, WebXR, Hand tracking
further-reading:
video-overview: "https://youtu.be/-vC6TPvXMiE?si=XH0_buuws7jAP8c3"
video-content:
---

# Hands animation

## Introduction
A good practice is to show a pre-recorded hand animation to familiarize users with the correct way to perform each gesture. Pre-recorded gesture animations can also be useful for tutorials.

### Capturing

For capture, we use the capabilities of the HandTracking wrapper.

```typescript
export interface IHandTrackingXRFeatEnv extends IXRFeatEnv<WebXRHandTracking> {

captureHandsAnimation(
	frames:number,
	mode:TRecordMode,
	delayMS?:number
):Promise<THandsAnimationData | undefined>;
	
// ... other functions
}
````
Example of capturing
``` typescript
// 1. Create service
// 2. Init service
// 3. Go immersive

// 4. Extract feature Env
const ftHandEnv =   xrService.extractFeatureEnv('HAND_TRACKING');

// Recording will start after a 2s pause at 360 frames.
const animation =  await ftHandEnv(360, 'both', 2000);
```
!!! A great idea is to use binary packaging for the captured data, 
but this is not an extension feature. 
Even a short recording can take up 200-300 KB, so it's 
important to be mindful of animation file sizes.

### Playback

For playback there is a special class AnimatedHand:
```typescript
export interface IAnimatedHand {
	readonly isReady:boolean;
	readonly isPaused:boolean;
	readonly isPlayed:boolean;
	readonly root:TransformNode;
	readonly mesh:AbstractMesh;
	
	init(handDesc:Partial<TAnimatedHandDescription>):void;
	loadModelFromFile(url:string):Promise<boolean>;
	setPosition(position:Vector3):void;
	setRotation(rotation:Quaternion):void;
	setScaling(scaling:number):void;
	setEnabled(val:boolean):void;
	
	play(
		data:THandsAnimationData,
		loop?:boolean,
		onFrame?:(frameNumber:number)=>void,
		onStarted?:()=>void,
		onEnded?:()=>void
	):Promise<void>;
	
	material:Nullable<Material>;
	
	stop():void;
	goto(frame:number):void;
	pause(val:boolean):void;
	
	readonly isDisposed:boolean;
	dispose(disposeMaterialAndTextures?:boolean):void;
}
```
This class allows you to load the required hand model, assign a material,
and set its position and orientation in space. 
You can implement all this logic yourself using a class specifically
designed for playback. We'll demonstrate both approaches:

Example 1: Playback with AnimatedHand
```typescript
// 1. Upload a data file or get the data in another way
const animationData = animationDataProvider.get('conduct_an_orchestra');

// 2. Create an AnimatedHand instance (or two if we have animation for both hands)
const handR = new AnimatedHand('right', scene);

// 3. Here setup the instance (set material, mesh, positions, etc)

// 4. Start playback
// It possible use it in async-await or in callback style
await handR.play(
    animationData,
    true,
    showProgressFunction
)

```

Example 2: Playing the animation at a lower level
```typescript
export interface IAnimatedHandsPlayer {
	init(scene:Scene):void;
	readonly isPlayed: boolean;
	readonly isPaused: boolean;
	
	play(
		hand:XRHandedness,
		positions:number[][],
		rotations:number[][],
		skeleton:Skeleton,
		loop?:boolean,
		onFrame?:(frameNumber:number)=>void
	):Promise<void>;
	
	goto(frame:number):void;
	stop():void;
	pause(val:boolean):void;
	dispose(): void;
}

// 1. Upload a data file or get the data in another way
const animationData = animationDataProvider.get('conduct_an_orchestra');

// Parsing animation data here

// 2. Init player
const player = new AnimatedHandsPlayer();
player.init(scene);

// 3. Start playback
await player.play(
	'right',
	// Bones positions from animationData
	positions,
	// Bones quaternions
	rotations,
	// Skeleton,
	skeleton,
	false
);

```

Useful links:
- [Animation example file](https://webxr.projects.clickon.pro/assets/gestures/animations/activate.json)
* Attention: To use it as JSON, you need to add a 0 before numbers starting with '.' or '-.'
- [Playback demo page](https://webxr.projects.clickon.pro/#/about/animation-hands-playback)
- [Animation capture utility](https://webxr.projects.clickon.pro/#/anima-hands)