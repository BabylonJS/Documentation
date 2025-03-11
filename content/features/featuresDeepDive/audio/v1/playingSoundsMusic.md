---
title: Audio
image:
description: Dive into everything you could want to know about using the Babylon.js sound engine for simple to advanced audio.
keywords: diving deeper, sound, audio, sound engine, audio engine
further-reading:
  - title: Sound
    url: /typedoc/classes/babylon.sound
  - title: SoundTrack
    url: /typedoc/classes/babylon.soundtrack
video-overview:
video-content:
---

## How To Play Sounds and Music

Babylon.js sound engine is based on the [**Web Audio specification**](http://webaudio.github.io/web-audio-api/). We decided not to offer a fallback on the audio tag or other mechanism. So, to use our sound engine, you need to use a Web Audio compatible browser. Still, if you’re using it on not compatible browser, it won’t break the rest of our engine, it will simply play no sound.

The sound engine offers **ambient** sound, **spatialized** sound and **directional** sound. It can be created by code or by loading a .babylon file. It follows the simple & powerful philosophy of the rest of the engine as you’re going to see.

The sound format supported is the one from the browser **.mp3**, **.ogg**, **.wav**, **.m4a**, **.mp4**. It’s usually at least **.mp3** and **.wav**.

**Note:** Other formats like **.aac** can be loaded as well as long as the browser supports them by passing `skipCodecCheck` to `true` in the `Sound` creation options.

**Note:** all music samples demonstrated in the playground has been composed by [**David Rousset**](https://soundcloud.com/david-rousset/)

## Creating an ambient sound or music

Here is the code to create a sound or music playing as ambient (not spatialized):

```javascript
// Load the sound and play it automatically once ready
const music = new BABYLON.Sound("Music", "music.wav", scene, null, {
  loop: true,
  autoplay: true,
});
```

- 1st parameter: the **name** of your sound.
- 2nd parameter: **URL** of the sound to load.
- 3rd parameter: **scene** to attach the sound to.
- 4th parameter: **function** being called-back once the sound is ready to be played, we’ll see that later.
- 5th parameter: a **JSON object** providing various options we’ll see in details. But you can already understand the goal of the 2 options provided.

You can test this first sample in our music playground example here:
<Playground id="#PCY1J" title="Simple Music Playback Example" description="A simple example of playing sounds or music in your scene." isMain={true} category="Audio"/>

## Handling the 'ready to play' callback function

Calling the `BABYLON.Sound()` constructor with a URL generates 2 phases:

1. the .wav or .mp3 file is loaded from your webserver using an async XHR
2. once loaded, the sound is being async decoded by web audio. If it succeeds, it raises the callback function you’ve provided.

Here is a sample code:

```javascript
const music = new BABYLON.Sound("Music", "music.wav", scene, function () {
  // Sound has been downloaded & decoded
  music.play();
});
```

This code loads the `music.wav` file from the web server, decode it and play it in the callback function only once using the `play()` function. The play function plays the sound immediately if no parameter is passed. You can provide a parameter of type number to play the sound after x seconds.

Test it in this playground: <Playground id="#PCY1J#1" title="Load and Play Sounds With A Callback" description="A simple example loading a sound and playing it once after the file has loaded."/>

## Playing a sound on mouse click or keydown

This sample code plays a gunshot sound if you’re left-clicking or pressing the spacebar:

```javascript
const gunshot = new BABYLON.Sound("gunshot", "sounds/gunshot.wav", scene);

window.addEventListener("mousedown", function (evt) {
  // left click to fire
  if (evt.button === 0) {
    gunshot.play();
  }
});

window.addEventListener("keydown", function (evt) {
  // Press space key to fire
  if (evt.keyCode === 32) {
    gunshot.play();
  }
});
```

Test it on this gunshot sound playground: <Playground id="#PCY1J#299" title="Playing Sounds With Interaction" description="A simple example playing a sound on user interaction." isMain={true} category="Audio"/>

## Some basic properties

You can set the volume of a sound via the options object or via the `setVolume()` function. You can set the play rate in the same manner.

You can also be notified when the sound has finished playing by registering yourself into the `onended` event.

Here is a simple sample code mixing all that:

```javascript
const volume = 0.1;
const playbackRate = 0.5;
const gunshot = new BABYLON.Sound("Gunshot", "./gunshot-1.wav", scene, null, {
  playbackRate: playbackRate,
  volume: volume,
});

gunshot.onended = function () {
  if (volume < 1) {
    volume += 0.1;
    gunshot.setVolume(volume);
  }
  playbackRate += 0.1;
  gunshot.setPlaybackRate(playbackRate);
};
```

The sound is first created with a `playbackRate` of 0.5 and a `volume` of 0.1. Everytime you will play the sound, at its end, the `onended` function will be called and the `volume` & `playbackRate` will increase.

Rather than setting the volume on a specific sound, you can also set the global volume of all sounds played by Babylon.js using the `setGlobalVolume()` function of the audio engine.

```javascript
BABYLON.Engine.audioEngine.setGlobalVolume(0.5);
```

## Handling autoplay & unlocking audio on first user interaction

Sometimes you want audio to autoplay on page load, e.g. Ambient background or theme music for a game.

Modern browsers blocks audio until the user have interacted with the webpage.

BabylonJs will supply a default "unmute" button which unlocks audio once clicked.

We can disable this default unmute button if wanted and create our own listener for a user interaction, e.g. any pointer click on the webpage.

```javascript
// Disable the default audio unlock button
BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

// Unlock audio on first user interaction.
window.addEventListener(
  "click",
  () => {
    if (!BABYLON.Engine.audioEngine.unlocked) {
      BABYLON.Engine.audioEngine.unlock();
    }
  },
  { once: true },
);
```

Test it in our playground here: <Playground id="#KBA3JY#4" title="Custom audio unlock & autoplay" description="A simple example unlocking audio on first user interaction" isMain={true} category="Audio"/>

## Playing a sound sprite

A sound sprite is a portion of a sound file. You can define a sound sprite when creating a sound by defining an offset and a length (in seconds):

```javascript
const soundSprite = new BABYLON.Sound("Violons", "/sounds/6sounds.mp3", scene, null, { loop: true, autoplay: true, length: 9.2, offset: 14.0 });
```

You can find examples here: <Playground id="#6LXPBX#12" title="Playing Sound Sprites 1" description="A simple example of playing a portion of a sound file using sound sprites."/>

and here: <Playground id="#PCY1J#190" title="Playing Sound Sprites 2" description="A simple example of playing a portion of a sound file using sound sprites."/>

## Playing several sounds simultaneously and synchronized

For that, you need to call the play method on all sounds only once you’re sure they are all ready to be played. You then need to work with the ready to play callback.

```javascript
const music1 = new BABYLON.Sound("Violons11", "sounds/violons11.wav", scene, soundReady, { loop: true });
const music2 = new BABYLON.Sound("Violons18", "sounds/violons18.wav", scene, soundReady, { loop: true });
const music3 = new BABYLON.Sound("Cellolong", "sounds/cellolong.wav", scene, soundReady, { loop: true });

const soundsReady = 0;

function soundReady() {
  soundsReady++;
  if (soundsReady === 3) {
    music1.play();
    music2.play();
    music3.play();
  }
}
```

Test it in our playground here: <Playground id="#PCY1J#6" title="Playing Sounds Together" description="A simple example playing sounds together and synchronized." isMain={true} category="Audio"/>

## Loading a sound from an ArrayBuffer

You can bypass the first phase (the embedded XHR request) if you’re calling the constructor with your own provided `ArrayBuffer`.

Here is a sample code demonstrating it:

```javascript
const gunshotFromAB;
loadArrayBufferFromURL("sounds/gunshot.wav");

function loadArrayBufferFromURL(urlToSound) {
  const request = new XMLHttpRequest();
  request.open("GET", urlToSound, true);
  request.responseType = "arraybuffer";
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        gunshotFromAB = new BABYLON.Sound("FromArrayBuffer", request.response, scene, soundReadyToBePlayed);
      }
    }
  };
  request.send(null);
}

function soundReadyToBePlayed() {
  gunshotFromAB.play();
}
```

Test it out in our playground: <Playground id="#PCY1J#2" title="Loading A Sound From an ArrayBuffer" description="A simple example of loading a sound from an ArrayBuffer."/>

Here is another example where we load the sound from the audio file: <Playground id="#PWY6NL" title="Loading A Sound From the Microphone" description="A simple example of loading a sound from the microphone."/>

## Loading a sound using the Assets Manager

The assets manager is pretty useful as it handles for you some great features such as a loading screen.

```javascript
let music1, music2, music3;

// Assets manager
const assetsManager = new BABYLON.AssetsManager(scene);

const binaryTask = assetsManager.addBinaryFileTask("Violons18 task", "sounds/violons18.wav");
binaryTask.onSuccess = function (task) {
  music1 = new BABYLON.Sound("Violons18", task.data, scene, soundReady, {
    loop: true,
  });
};

const binaryTask2 = assetsManager.addBinaryFileTask("Violons11 task", "sounds/violons11.wav");
binaryTask2.onSuccess = function (task) {
  music2 = new BABYLON.Sound("Violons11", task.data, scene, soundReady, {
    loop: true,
  });
};

const binaryTask3 = assetsManager.addBinaryFileTask("Cello task", "sounds/cellolong.wav");
binaryTask3.onSuccess = function (task) {
  music3 = new BABYLON.Sound("Cello", task.data, scene, soundReady, {
    loop: true,
  });
};

const soundsReady = 0;

function soundReady() {
  soundsReady++;
  if (soundsReady === 3) {
    music1.play();
    music2.play();
    music3.play();
  }
}

assetsManager.load();
```

Test it out in our playground: <Playground id="#PCY1J#8" title="Loading A Sound with the Asset Manager" description="A simple example of loading a sound with the asset manager."/>

## Creating a spatial 3D sound

To transform a sound into a spatial sound, you need to specify that via the options:

```javascript
const music = new BABYLON.Sound("music", "music.wav", scene, null, {
  loop: true,
  autoplay: true,
  spatialSound: true,
});
```

Default properties of a spatial sound are:

- **distanceModel** (the attenuation) is using a “**linear**” equation by default. Other options are “_inverse_” or “_exponential_”.
- **maxDistance** is set to **100**. This means that once the listener is farther than 100 units from the sound, the volume will be 0. You can’t hear the sound anymore
- **panningModel** is set to “_equalpower_”; the equal-power panning algorithm is generally regarded as simple and efficient. The other available option is “**HRTF**”. The specification says it’s: “_a higher quality spatialization algorithm using a convolution with measured impulse responses from human subjects. This panning method renders stereo output_”. This is the best algorithm when using a headphone.

**maxDistance** is only used when using the “_linear_” attenuation. Otherwise, you can tune the attenuation of the other models using the **rolloffFactor** and **refDistance** options. Both are set to 1 by default but you can change it of course.

For instance:

```javascript
const music = new BABYLON.Sound("music", "music.wav", scene, null, {
  loop: true,
  autoplay: true,
  spatialSound: true,
  distanceModel: "exponential",
  rolloffFactor: 2,
});
```

Default position of sound in the 3D world is `(0,0,0)`. To change that, use the `setPosition()` function:

```javascript
music.setPosition(new BABYLON.Vector3(100, 0, 0));
```

To have a better understanding, please have a look at this sample in our playground: <Playground id="#2AH4YH" title="3D Spatial Sound" description="A simple example of creating spatial sound in your scene." isMain={true} category="Audio"/>

Move into the scene using keyboard & mouse. Each sound is represented by a purple sphere. When you’re entering a sphere, you’ll start hearing one the music. The sound is louder at the center of the sphere and fall down to 0 when leaving the sphere.

## Attaching a sound to a mesh

This is probably the simplest way to handle 3D sounds in your scene. Simply create a `BABYLON.Sound`, attach it to an existing mesh and you’re done! If the mesh is moving, the sound will move with it. You have nothing to do.

Here’s the code to use:

```javascript
const music = new BABYLON.Sound("Violons", "sounds/violons11.wav", scene, null, {
  loop: true,
  autoplay: true,
});

// Sound will now follow the box mesh position
music.attachToMesh(box);
```

Calling the `attachToMesh()` function on a sound will transform it automatically into a spatial 3D sound. Using the above code, you’ll fall into default Babylon.js values: a `linear` attenuation with a `maxDistance` of 100 and a panning model of type `HRTF`.

Put your headphones on and launch this sample in our playground: <Playground id="#EDVU95" title="Sound Attached to a Mesh" description="A simple example of attaching sound to a mesh."/>

## Setting a position as the audio listener

By default, the "ears" of your scene - or the listener - is always the currently active camera. Sometimes, for example when making a 3rd person game, you may need to set another mesh as the listener - a characters head for example. This can be achieved by setting the `audioListenerPositionProvider` property on your scene.

The method you create has to return a valid `Vector3` object.

```javascript
// Returns a static position
scene.audioListenerPositionProvider = () => {
  return new BABYLON.Vector3(0, 0, 10);
};

// Returns the current position of a mesh
// !It is recommended to use the 'absolutePosition' property
// to reflect the position of the mesh in the world
scene.audioListenerPositionProvider = () => {
  // Returns a static position
  return myMesh.absolutePosition;
};
```

To switch back to using your camera as the listener, simply set the property to `null`.

## Creating a spatial directional 3D sound

By default, spatial sounds are omnidirectional. But you can have directional sounds if you’d like to.

**Note:** directional sounds only work for spatial sounds attached to a mesh.

Here is the code to use:

```javascript
const music = new BABYLON.Sound("Violons", "violons11.wav", scene, null, {
  loop: true,
  autoplay: true,
});
music.setDirectionalCone(90, 180, 0);
music.setLocalDirectionToMesh(new BABYLON.Vector3(1, 0, 0));
music.attachToMesh(box);
```

setDirectionalCone takes 3 parameters:

- **coneInnerAngle**: size of the inner cone in degree
- **coneOuterAngle**: size of the outer cone in degree
- **coneOuterGain**: volume of the sound when you’re outside the outer cone (between 0.0 and 1.0)

Outer angle of the cone must be superior or equal to the inner angle, otherwise an error will be logged and the directional sound won’t work.

`setLocalDirectionToMesh()` is simply the orientation of the cone related to the mesh you’re attached to. By default, it’s `(1,0,0)`.

You can play with this sample from our playground to better understand the output: <Playground id="#1BO0YS" title="Spatial Directional Sound" description="A simple example of spatial directional 3D sound."/>

Move into the 3D scene. If you’re inside the space defined by the grey cone, you should hear the music, if not you’ll not hear it as the `coneOuterGain` is set to 0.

## Creating your own custom attenuation function

If you want to manage the attenuation (or distance model in Web Audio) using a specific algorithm, you can by-pass the native Web Audio attenuation using Babylon.js custom attenuation function.

**Note:** Web Audio is _hardware accelerated_. It means it’s mainly handled by a dedicated audio chip on your device via native code (the browser). This then almost costs nothing on the performance side for 3D real-time rendering. Switching to custom attenuation will use Babylon.js distance computation based on JavaScript and will be slower.

Moreover, the custom attenuation will only works on spatial sounds (obviously) but also on sound connected to a Babylon.js mesh. That said, let’s now view the code to do that. First, you must specify it in the options:

```javascript
// Create and load the sound async
const music = new BABYLON.Sound("Music", "music.wav", scene, null, {
  loop: true,
  autoplay: true,
  useCustomAttenuation: true,
});
```

You’ll switch to internal Babylon.js math computations. The default custom attenuation function is a linear one.

To create your own logic, you need such code:

```javascript
// Creating custom attenuation function. Near the object, volume is almost 0.
// The farest, the louder
music.setAttenuationFunction(function (currentVolume, currentDistance, maxDistance, refDistance, rolloffFactor) {
  return (currentVolume * currentDistance) / maxDistance;
});
```

You can play with these 5 parameters and do whatever you’d like with it. Simply return a number that will be the volume applied to the sound.

In this example, the logic is a bit weird as the volume is louder the farther you are from the mesh. ;-)

Play with it in our Playground: <Playground id="#2AH4YH#2" title="Custom Attenuation Function" description="An example of creating a custom attenuation function."/>

Moreover, Firefox has currently a bug in their Web Audio implementation in handling properly linear attenuation. This can be fixed by using the Babylon.js default linear custom attenuation.

## Manipulating sound loaded from a .babylon file

Currently only our 3DS Max exporter can export sounds directly to _.babylon_.

To access to a sound loaded by the Babylon.js _.babylon_ fileloader, you need to use the `getSoundByName()` function on the scene object.

Here is a simple sample loading a _.babylon_ scene file embedding some sounds:

```javascript
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
BABYLON.SceneLoader.Load(
  "TestScene/",
  "testsound.babylon",
  engine,
  function (newScene) {
    newScene.executeWhenReady(function () {
      newScene.activeCamera.attachControl(canvas);

      const gunshotSound = newScene.getSoundByName("gunshot-1.wav");
      window.addEventListener("keydown", function (evt) {
        if (evt.keyCode === 32 && gunshotSound) {
          gunshotSound.play();
        }
      });

      engine.runRenderLoop(function () {
        newScene.render();
      });
    });
  },
  function (progress) {
    // To do: give progress feedback to user
  },
);
```

Pressing the spacebar will play the gunshot sound.

## Using Sound Tracks

It could be useful to isolate your music & sounds on several tracks to better manage volume on a grouped instance of sounds. It will be also used in a future release to apply effects on a specific track.

By default, Babylon.js is creating a `BABYLON.SoundTrack` object to act as its main track. Every time you’re creating a new `BABYLON.Sound`, it’s added for you into this main track.

```javascript
const soundTrack = new BABYLON.SoundTrack(scene);
soundTrack.addSound(cellolong);
soundTrack.addSound(violons11);
```

Using this code, the _cellolong_ and _violons11_ sounds will be moved from the main Babylon.js track to this specific sound track. This now means that you change the volume of this track, and thus of these 2 sounds, independently from the main track.

The `addSound()` function will move the sound from its original container (the main track or a specific track) to the new sound track specified. For instance, with this code:

```javascript
const soundTrack1 = new BABYLON.SoundTrack(scene);
soundTrack1.addSound(cellolong);
soundTrack1.addSound(violons11);

const soundTrack2 = new BABYLON.SoundTrack(scene);
soundTrack2.addSound(violons11);
```

The _violons11_ sound will finally live only in _soundTrack2_.

## Using the Analyser

You can easily analyze in real-time the audio frequencies.

The easiest code to understand how it works is this one:

```javascript
const myAnalyser = new BABYLON.Analyser(scene);
BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
myAnalyser.drawDebugCanvas();
```

This will connect to the global volume of the audio engine and will draw the frequencies of all sounds played together into a 2D canvas display on top of the screen.

You can change the position and size of the debug canvas and use an analyser on a sound track instead of the global audio engine:

```javascript
const myAnalyser = new BABYLON.Analyser(scene);
soundTrack1.connectToAnalyser(myAnalyser);
myAnalyser.DEBUGCANVASSIZE.width = 160;
myAnalyser.DEBUGCANVASSIZE.height = 100;
myAnalyser.DEBUGCANVASPOS.x = 40;
myAnalyser.DEBUGCANVASPOS.y = 30;
myAnalyser.drawDebugCanvas();
```

You can also call yourself the analyser functions to create your own usage of it.

Here is a full audio playground example to play with: <Playground id="#PTV7W#1" title="Full Audio Example" description="Full audio playground example." isMain={true} category="Audio"/>
