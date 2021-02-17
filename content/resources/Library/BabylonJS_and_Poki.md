---
title: BabylonJS and Poki
image:
description: Using babylon.js to create a game for Poki.
keywords: babylon.js, extension, external libraries, external, Poki
further-reading:
video-overview:
video-content:
---

Poki.com is a curated discovery platform for free, high-quality online games. You can reach millions of players around the globe and get a revenue share from advertising when your game is played.

This documentation explains how to transform an existing Babylon.js game to make it available on Poki.com

## Useful links

- [Poki.com](https://poki.com/)
- [Poki developers page](https://developers.poki.com/)
- [Poki SDK documentation](https://sdk.poki.com/)

## Some Babylon.js games on Poki

- [Minecraft Classic - By Mojan](https://poki.com/en/g/minecraft-classic)
- [Temple Run 2 - By Imangi Studios](https://poki.com/en/g/temple-run-2)
- [Tunnel Rush - By Deer Cat](https://poki.com/en/g/tunnel-rush)
- [Shell Shockers - By Blue Wizard Digital](https://poki.com/en/g/shell-shockers)

## The process

### 1) Include the Poki Javascript SDK

Add the following HTML within the `<head>` tags of your game HTML:

```html
<script src="//game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>
```

### 2) Initialize the SDK

At the start of your game, initialize the SDK with the following JavaScript:

```javascript
PokiSDK.init()
  .then(() => {
    console.log("Poki SDK successfully initialized");
    // your code to continue to game
    continueToGame();
  })
  .catch(() => {
    console.log("Initialized, but the user likely has adblock");
    // your code to continue to game
    continueToGame();
  });
```

### 3) Integrate the Poki API into your game

Use the gameplayStart() event to describe when users are playing your game and the gameplayStop() event every time the gameplay halts, like in the case of a level finish, game over or when going back to a menu, pausing the game etc.
Use commercialBreak() to display video ads. It should be triggered on natural breaks in your game.
Use rewardedBreak() to allow for a user to choose to watch a rewarded video ad in exchange for a certain benefit in the game (e.g. more coins, etc.).

You'll find more details on the [Poki SDK Implementation guide for HTML5](https://sdk.poki.com/html5/).

### 4) Submit your game on Poki

On the [Developers page of Poki](https://developers.poki.com/), you can get in touch with Poki team or directly submit your game.
