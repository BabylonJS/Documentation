---
title: Going Cross-Platform
image: 
description: Dive into some deeper game creation methods and techniques.
keywords: welcome, babylon.js, guided learning, create a game, game, cross platform, touch
further-reading:
video-overview:
video-content:
---

## Summary
We have an awesome game now, but how do we get it on mobile?!

Making our game cross platform is made really simple with babylon!
## Inputs
The first thing that we need to do is start detecting our touch inputs.
1. In index.html, add this to the body
```javascript
<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
```
Now, whenever we're using pointerEvents, it will account for touch inputs as well!

## Controls
## GUI
Now that we're no longer using key presses for our character, we need another way to get them moving around. This is where it gets a little tricky. The joystick class works really well if the main mechanic of the game is to only use the joystick. The joystick class creates an overlay canvas that ends up blocking any other inputs that may be on the screen. Since we need buttons to also jump and dash, I had to find a different way to get player movement. The end layout looked like this:

![mobile controls](/img/how_to/create-a-game/mobilecontrols.png)

Since these controls are only visible in the game state, I added them to the [Hud](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L207). Since we only want to see these buttons if we're on mobile, we need to have a check to tell us whether the device is a mobile device.
```javascript
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //make mobile controls
}
```
The [layout for controls](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/ui.ts#L214) took some experimentation, but I ended up creating grids to hold the buttons depending on which side of the screen they were on.
1. Create Rectangles to hold our buttons
2. Create Grids to manage button placement
```javascript
const actionGrid = new Grid();
actionGrid.addColumnDefinition(.5); //create a column that's 50% the width of the grid
actionGrid.addColumnDefinition(.5);
actionGrid.addRowDefinition(.5);
actionGrid.addRowDefinition(.5);
actionContainer.addControl(actionGrid);
```
When you make a grid, you add columns separately and pass in a size to give them. 
3. Add the buttons to a grid position
```javascript
actionGrid.addControl(dashBtn, 0, 1);
actionGrid.addControl(jumpBtn, 1, 0);
```
If you look at this code above, you can actually see the grid placement of the buttons based off of the location of 0s and 1s (of course this only works for this case since there's just two buttons). But this is how you get the effect of them being stacked and opposite sides of each other!

![grid](/img/how_to/create-a-game/gridbuttons.png)

## Movement
Now that we've made the new gui elements for our character movement, we just need to hook this up to our current input system.

In **inputController.ts**, there's a function [_setUpMobile](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/inputController.ts#L116) that creates pointer observables for each of the new character movement buttons. These will set flags for whether the button was pressed (similar to how we're storing keyboard inputs in our inputMap).

Then all we need to do is add the mobile equivalent of our keypresses to the existing structure in _updateFromKeyboard. For example, dashing would be:
```javascript
//dash
if ((this.inputMap["Shift"] || this._mobileDash)) {
    this.dashing = true;
} else {
    this.dashing = false;
}
```

We have our character moving! But wait, the running animations don't work? If we return to the [_animatePlayer](/how_to/page12#animate-player) function from the Animation tutorial, you'll see that we were looking at our inputMap for movement detection. We just need to add our mobile inputs to this as well.

![mobile gameplay](/img/how_to/create-a-game/mobilegameplay.gif)

Now we have a cross-platform game! Wasn't that easy?

## Extra Features
Because the game is on a web browser, we need to make sure that the player knows that the intended orientation is landscape mode. Not all browsers or devices allow for fullscreen mode, so I decided to create a notification that told the player to rotate the device for to get the best experience.

This followed a similar structure to how we set up the mobile controls for the game state by first checking whether we were on a mobile device in [_goToStart](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/app.ts#L224). It was just a simple image, text, and button.

![image of notification](/img/how_to/create-a-game/rotatedevice.png)

## Resources
**Files Used:**  
- [index.html](https://github.com/BabylonJS/SummerFestival/blob/master/public/index.html)
- [ui.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/ui.ts)
- [inputController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/inputController.ts)  
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)