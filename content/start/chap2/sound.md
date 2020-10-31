# Getting Started - Working with Code
# Making Music?

Adding sounds to your world is very easy.

For continuous sounds we use

```javascript
const sound = new BABYLON.Sound("name", "url to sound file", scene, null, { loop: true, autoplay: true });
```

https://www.babylonjs-playground.com/#SFCC74#3


To play a sound once we use

```javascript
const sound = new BABYLON.Sound("sound", "url to sound file", scene);
//Leave time for the sound file to load before playing it
sound.play();
```

To account for loading time, in the example below *setInterval* is used to play the sound every 3 seconds

https://www.babylonjs-playground.com/#SFCC74#4


Since you probably prefer listening to your own music as you work and oft repeated sound can get annoying the above playground examples are the only ones in Getting Started that load sounds. 

Now back to making our world and the developing our buildings. Buildings come in varied sizes, positions and orientations and this will be true for the world we are creating.