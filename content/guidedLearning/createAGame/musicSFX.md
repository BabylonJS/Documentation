---
title: Music & Sound FX
image:
description: Dive into some deeper game creation methods and techniques.
keywords: guided learning, create a game, game, music, sounds
further-reading:
video-overview:
video-content:
---

## Summary

Although I would have liked to mess around with audio for the game, I don't really have any experience with making music, so instead I just found some that I thought fit the style of the game.

## Loading Sounds

Sounds are really easy to get started with, and I mostly referenced [Playing Sounds and Music](/features/featuresDeepDive/audio/playingSoundsMusic).

The thing about sounds is that they have to be attached to a single scene, so I loaded sounds based on where they'd need to be used:

- **app.ts**
  1. In goToStart, I loaded the two sounds for the scene (music and selection SFX).
  2. I created a \_loadSounds function for the game scene that just loaded the game and ending music. Then I made sure to load them along with the other assets in \_setUpGame.
- **ui.ts**
  For the GUI-related sounds, I created a \_loadSounds function and called it in the constructor.
- **characterController.ts**
  All of the character-related SFX was loaded when we called \_loadSounds in the Player constructor.

## Playing Sounds

Playing music is really simple, but when it comes to SFX that are short, played during scene switching and paused states, it can get kind of tricky.

I spent a bit of time debugging sound issues, and here are some of the tips I have:

1. Don't use .ogg sound files. Safari does not support .ogg!
2. Sounds played when transitioning between scenes will need time to play. Since sounds are attached to a scene, if you instantly switch scenes, there's a chance that the sound won't play at all. I was able to work around this since I included a fade transition post-process. It gave just enough time for the sfx to play before switching scenes.
3. Be careful when using both looping and non-looping sounds. It's great to be able to play many sounds at once, but that also comes with the need for strict sound management since we don't have separate SFX and music channels that let us stop everything in one channel without affecting the other.

## Sound Usage

Aside from just playing background music and simple SFX, I had two pretty involved sound sections.

1. Warning SFX for the sparkler
   - I gave the sparkler a looping warning sound that started when the energy was at the second-to-last bar. Since this was tied to the animation, I had to make sure that if the animation didn't actually complete (the player was able to reset the sparkler before it reached empty), the sound would still stop. I did this by making sure that I stopped the sound every time _startSparklerTimer_ was called.
     ```javascript
     if (!this.gamePaused) {
       if (this._sparklerLife.cellId < 10) {
         this._sparklerLife.cellId++;
       }
       if (this._sparklerLife.cellId == 9) {
         this._sparkWarningSfx.play();
       }
       if (this._sparklerLife.cellId == 10) {
         this.stopSpark = true;
         clearInterval(this._handle);
         //sfx
         this._sparkWarningSfx.stop();
       }
     }
     ```
   - Additionally, if the game were to pause while the sound was playing, we'd need to pause this as well, which is why the intervals for the sparkler animations check for _gamePaused_.
     ```javascript
     else { // if the game is paused, also pause the warning SFX
         this._sparkWarningSfx.pause();
     }
     ```
2. The character SFX
   The character had a couple of different sounds, but the most difficult one to manage was the looping run SFX. I had to create an observable to know when the character was running, which would determine when to play or stop the sound.
   ```javascript
   this.onRun.add((play) => {
     if (play && !this._walkingSfx.isPlaying) {
       this._walkingSfx.play();
     } else if (!play && this._walkingSfx.isPlaying) {
       this._walkingSfx.stop();
       this._walkingSfx.isPlaying = false; // make sure that walkingsfx.stop is called only once
     }
   });
   ```
   As an extra safety measure, I made sure that .stop() would not be called more than once because Safari had a lot of audio issues when working with sounds.
   In [\_animatePlayer](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L247) we notify the onRun observable by passing in a boolean of whether to play or not.

## Resources

**Files Used:**

- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
- [ui.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/ui.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)
