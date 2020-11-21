---
title: Game GUI
image:
description: Dive into some deeper game creation methods and techniques.
keywords: welcome, babylon.js, guided learning, create a game, game, gui, hud
further-reading:
video-overview:
video-content:
---

## Summary

By the end of this section, the topics we've gone over should have well equipped you with knowledge on how to implement core mechanics for a game! The next few sections will go over adding more to the game in terms of features you can use to enhance the visuals of the game (including animation & sounds).

The Babylon GUI has a ton to offer, and the babylonjs [gui](/divingDeeper/gui/gui) documentation is extremely thorough in explaining how to use the different controls and components. For this tutorial, I'll just be going over features that were specific to my game or involved a little bit of logic to accompany it.

## Game UI

The most important use of the GUI for my game had to be the [Hud class](https://github.com/BabylonJS/SummerFestival/blob/master/src/ui.ts). This was actually the first thing that I focused on when I started working with the GUI library. What I learned from working with this alone, I applied to all of my other states!

![gameui](/img/how_to/create-a-game/guitimerspark.gif)

### HUD

The ui.ts file contains everything necessary for the game state's UI. Just like how we set up an AdvancedDynamicTexture in goToGame for our [state machine setup](/guidedLearning/createAGame/stateMachine#gotogame), we want to start with this as the foundation of our Hud class.

In goToGame:

1. Create a Hud

```javascript
const ui = new Hud(scene);
this._ui = ui;
```

This will replace the default UI setup we had.

2. Add the ui to our PlayerInput class

```javascript
this._input = new PlayerInput(scene, this._ui);
```

This is important for when we add controls for mobile.

The first thing I set out to do was to set up:

1. The game timer
2. The sparkler timer

Each of these timers would need to have some sort of display form. I decided to go with text for the game timer and sprite animation for the sparkler timer (however, I did of course start off with text in order to test out the timing).

### Game Timer

The game timer is just a simple TextBlock called [_clockTime_](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L89) that's updated in [updateHud](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L310):

```javascript
if (!this._stopTimer && this._startTime != null) {
    let curTime = Math.floor((new Date().getTime() - this._startTime) / 1000) + this._prevTime;
    this.time = curTime;
    this._clockTime.text = this._formatTime(curTime);
}
```

What this does is:

1. Calculates the amount of time in milliseconds that has passed since the start time, then divides by 1000 to convert it into seconds. Then adds whatever _\_prevTime_ is.
    - _\_prevTime_ is initialized to 0 and only ever updates if the game is paused and when the game resumes
    - _\_startTime_ is updated to the current time so that the next time **updateHud** is called, we account for the time we spent paused (the difference in time will be the same as it left off).
2. Stores the total time elapsed in seconds
3. Formats the time to match our game's world time

#### Format Time

The [formatting](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L332) of the time is: **4 minutes of real time = 1 hour game time**

```javascript
let minsPassed = Math.floor(time / 60);
let secPassed = time % 240; // goes back to 0 after 4mins/240sec
// 4sec = 1min game time
if (secPassed % 4 == 0) {
    this._mString = Math.floor(minsPassed / 4) + 11;
    this._sString = (secPassed / 4 < 10 ? "0" : "") + secPassed / 4;
}
let day = this._mString == 11 ? " PM" : " AM";
return this._mString + ":" + this._sString + day;
```

The game's time starts at 11:00PM and goes until 12:00AM. We want to convert our time into minutes and seconds so that we can calculate the hours & minutes of the game.  
 - _\_mString_ will really only update if 4 minutes have passed, otherwise it will always be 11 - _\_sString_ updates every 4 seconds.

#### Start/Stop

Now that we know how to update the timer, how do we start and stop it?

```javascript
//---- Game Timer ----
public startTimer(): void {
    this._startTime = new Date().getTime(); //get the time when we started
    this._stopTimer = false;
}
public stopTimer(): void {
    this._stopTimer = true; //controls the update of our timer
}
```

#### Using the Game Timer

1. Start the game timer AFTER the [scene is ready](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/src/app.ts#L634) in app.ts.

```javascript
this._ui.startTimer();
```

2. In \_initializeGameAsync:

```javascript
scene.onBeforeRenderObservable.add(() => {
    // when the game isn't paused, update the timer
    if (!this._ui.gamePaused) {
        this._ui.updateHud();
    }
});
```

We start setting up the game loop.  
3. In main's **State.Game**:

```javascript
// once the timer 240seconds, take us to the lose state
if (this._ui.time >= 240 && !this._player.win) {
    this._goToLose();
    this._ui.stopTimer();
}
```

We can go ahead and remove the [temporary button](/guidedLearning/createAGame/stateMachine#gotogame) we had that went to the lose state since now we have an actual condition that takes us there.

Now we have a complete game timer! Once the game starts, the timer will begin and update until 4 minutes have passed, then it will take the player to the lose state.

### Sparkler Timer

#### Start Sparkler Timer

[startSparklerTimer](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L347) takes a different approach to timing since it's hooked up to an animation. The way I went about doing this was by setting intervals for both the time-related animation & the visual effect animation once the sparkler starts.

```javascript
this.stopSpark = false;
this._sparklerLife.cellId = 0;
this._spark.cellId = 0;
if (this._handle) {
    clearInterval(this._handle);
}
if (this._sparkhandle) {
    clearInterval(this._sparkhandle);
}
```

Everytime we start the sparkler, we want to make sure everything is reset, including the previous intervals if any.

```javascript
this._scene.getLightByName("sparklight").intensity = 35;
```

Have the actual sparkler object's light visible again by increasing its intensity.

```javascript
this._handle = setInterval(() => {
    if (!this.gamePaused) {
        if (this._sparklerLife.cellId < 10) {
            this._sparklerLife.cellId++;
        }
        if (this._sparklerLife.cellId == 10) {
            this.stopSpark = true;
            clearInterval(this._handle);
        }
    }
}, 2000);
```

This interval controls the actual sparkler's lifetime. The sparkler has 10 energy bars, and every 2 seconds we update the animation. Once we reach the last frame, we stop the spark & clear the interval.

![sparklerBar](/img/how_to/create-a-game/sparklerLife.gif)

```javascript
this._sparkhandle = setInterval(() => {
    if (!this.gamePaused) {
        if (this._sparklerLife.cellId < 10 && this._spark.cellId < 5) {
            this._spark.cellId++;
        } else if (this._sparklerLife.cellId < 10 && this._spark.cellId >= 5) {
            this._spark.cellId = 0;
        } else {
            this._spark.cellId = 0;
            clearInterval(this._sparkhandle);
        }
    }
}, 185);
```

This interval controls the little spark animation for the sparkler part of the bar. It will just keep looping for as long as the sparkler still has energy.

![spark](/img/how_to/create-a-game/spark.gif)

Both of these are affected by whether the game is paused.

#### Stop Sparkler Timer

When we [stop the sparkler](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L403), we decrease the intensity of the light to 0 so that it's not visible.

```javascript
this.stopSpark = true;
this._scene.getLightByName("sparklight").intensity = 0;
```

#### Using the Sparkler Timer

1. Just like how we did with the game timer, we need to start the timer AFTER the [scene is ready](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/src/app.ts#L635) in app.ts.

```javascript
this._ui.startSparklerTimer();
```

**Note: the sparkler timers in the file links actually pass in a particle system, but since we haven't gone over how to make those yet, you can just ignore that part**

Now that the start & stop functions are set up, how do we know when to use them?

In the [game loop](#using-the-game-timer), we want to be checking:

```javascript
//reset the sparkler timer
if (this._player.sparkReset) {
    this._ui.startSparklerTimer();
    this._player.sparkReset = false;
}
//stop the sparkler timer after 20 seconds
else if (this._ui.stopSpark && this._player.sparkLit) {
    this._ui.stopSparklerTimer();
    this._player.sparkLit = false;
}
```

Recall that we set **sparkReset** and **sparkLit** to true on [collision with a lantern](/guidedLearning/createAGame/lanterns#collisions).

## Cutscene Animation

The cutscene is the last GUI implementation that I focused on since it was more of a polish element to give the game a backstory and the player instructions on what to do. Ideally, the animation portion would be a single animation file, but because of procreate limitations, I had to break it up into different portions and sequence them together.

Things I noticed during this process:

1. I had to make sure that all of these image files were loaded before starting the animation or else you'd only see the files that managed to load fast enough.
2. The files take a while to load since they're pretty large even after exporting for the web so a loading screen and condition before displaying the scene was necessary.

### Animation

In order to achieve the cutscene that I ended up with: animation + dialogue, I had to:

1. Keep track of when all the animation files were loaded.
   I created a variable **anims_loaded** to keep track of how many animations have loaded. Then, for each image animation I added an `onImageLoadedObservable`, for example:

```javascript
beginning_anim.onImageLoadedObservable.add(() => {
    anims_loaded++;
});
```

2. Start the interval timers for the animation once [everything was loaded](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/src/app.ts#L450).
   I used a switch statement to help with transitioning to the next animation since I thought it would be the best way to manage all of the different parts. It is a bit hardcoded since there isn't a consistent number of frames for the animations. Additionally, I had to separate it into two different intervals to get the timing to be better because at some parts I wanted the animations to last a bit longer which is why you'll see an **animTimer** and **anim2Timer**.

### Dialogue

The dialogue text doesn't automatically progress, but instead waits for an input from the player. When the player presses the [next](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/src/app.ts#L533) button, we use **transition** to keep track of what dialogue we're on, then progress the dialogue to the next frame.

```javascript
next.onPointerUpObservable.add(() => {
    if (transition == 8) {
        //once we reach the last dialogue frame, goToGame
        this._cutScene.detachControl();
        this._engine.displayLoadingUI(); //if the game hasn't loaded yet, we'll see a loading screen
        transition = 0; //since we only want to go through this block once
        canplay = true; //signals that we can progress to the game since we've completed the dialogue sequence
    } else if (transition < 8) {
        // 8 frames of dialogue
        transition++;
        dialogue.cellId++;
    }
});
```

In addition, the dialogue has a background animation that just keeps looping:

```javascript
let dialogueTimer = setInterval(() => {
    if (finished_anim && dialogueBg.cellId < 3) {
        dialogueBg.cellId++;
    } else {
        dialogueBg.cellId = 0;
    }
}, 250);
```

## Menu Popup

### Pause Menu

I used a [popup menu](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L413) for my pause state that included a page for controls. In order to keep all of the elements together in case of screen resizing, I placed everything in a `Rectangle` control.

```javascript
pauseBtn.onPointerDownObservable.add(() => {
    this._pauseMenu.isVisible = true;
    playerUI.addControl(this._pauseMenu);
    this.pauseBtn.isHitTestVisible = false;

    //when game is paused, make sure that the next start time is the time it was when paused
    this.gamePaused = true;
    this._prevTime = this.time;
});
```

There are a few things to consider when implementing this:

1. When you pause the game the menu needs to become visible
2. You need to add control to the menu.
3. You need to set the pause button to not detect any pointer events. This is specifically because I had a resume button rather than using the pause button to toggle the menu on/off.

Similarly, you need to make sure that you do the opposite when you press the resume button.

```javascript
resumeBtn.onPointerDownObservable.add(() => {
    this._pauseMenu.isVisible = false;
    this._playerUI.removeControl(pauseMenu);
    this.pauseBtn.isHitTestVisible = true;

    //game unpaused, our time is now reset
    this.gamePaused = false;
    this._startTime = new Date().getTime();
});
```

### Controls Menu

The controls menu uses the same structure as the pause menu. It's a `Rectangle` control with an image. In order to toggle between the two, all you need to do is swap the visibility of the menus like so:

```javascript
//open controls screen
this._controls.isVisible = true;
this._pauseMenu.isVisible = false;
```

## Pausing the Game

Another important topic I think that's worth mentioning is the process of pausing the game. Because the pause "state" is not it's own scene, I had to approach this by having a variable, _gamePaused_, keep track of whether we were paused or not. This flag is used throughout the game and even used for more than just showing the pause menu.

When the game is paused we:

1. Don't update the game timer and animations associated with the sparkler. (app.ts)
2. Don't allow for player movement. (inputController.ts)

When I got to actually implementing this, it so happened that the different files needed to know about _\_ui.gamePaused_. However, it was useful to have this since I could also use this to stop movements when in the "win" state. The win state would then essentially lock the player in a position where they'd be able to see the fireworks.

Now, we have a timed 3D platformer that takes you to the lose state when 4 minutes have passed and has an animated cutscene in the beginning!

## Resources

**Files Used:**

-   [ui.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/ui.ts)
-   [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
-   [inputController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/inputController.ts)

**Follow Along:**

-   [ui.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/gui/ui.ts)
-   [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/gui/app.ts)
-   [all necessary images](https://github.com/BabylonJS/SummerFestival/tree/master/public/sprites)
