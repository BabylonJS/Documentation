---
title: Babylon.js and Facebook Instant Games
image:
description: Using babylon.js to create a game for Facebook.
keywords: babylon.js, extension, external libraries, external, facebook
further-reading:
video-overview:
video-content:
---

An Instant Game is a game that can be played directly in the Facebook Messenger application, and from Babylon.js version 3.1 you can use your favorite framework to create a game that can be deployed on this platform.

This documentation will explain how to transform an existing Babylon.js game to an Instant Game.

## Useful links

- [Instant Games documentation](https://developers.facebook.com/docs/games/instant-games)

- [Instant Games SDK documentation](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.2)

## The process

1. Create an Instant Game app : [Facebook Dashboard](https://developers.facebook.com/docs/games/instant-games/)

2. Include the Facebook SDK URL in your game HTML page:

   ```html
   <script src="https://connect.facebook.net/en_US/fbinstant.6.2.js"></script>
   ```

3. Then you have to initialize the instant game with the method `FBInstant.initializeAsync`. In the game example, I created a file `main.ts` that will create the game once the framework is initialized:

   ```javascript
   FBInstant.initializeAsync()
     .then(() => {
       // Many properties will be null until the initialization completes.
       // This is a good place to fetch them:
       let locale = FBInstant.getLocale(); // 'en_US' 'fr_FR'...
       let platform = FBInstant.getPlatform(); // 'IOS', 'ANDROID' or 'WEB'
       let sdkVersion = FBInstant.getSDKVersion(); // '3.0'
       let playerID = FBInstant.player.getID();

       console.log(locale, platform, sdkVersion, playerID);

       // The game is created here
       new Game("gameCanvas");
     })
     .catch((e) => {
       console.log(e);
     });
   ```

   Then you can load your assets and start your game.

4. Update the Facebook loading screen : by using an Asset Manager, you can use the exposed property 'onProgress' to update the loading screen

   ```javascript
   loader.onProgress = (remaining: number, totalCount: number) => {
     FBInstant.setLoadingProgress(100 - remaining / totalCount);
   };
   ```

5. Remove the loading screen and start the game : once your scene is ready, use `FBInstant.startGameAsync` to start your instant game.

```javascript
this.scene.executeWhenReady(() => {
  FBInstant.startGameAsync().then(() => {
    // Game initialization
    this._initGame();

    // Run render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  });
});
```

6. Once your game is ready, you can upload it via Facebook Instant Games Dashboard, and run it. The configuration is done!

## Example

An example game can be found here: [SIMON3D](https://github.com/Temechon/simon3d)

This game is not finished at all, but show how to configure a very simple Babylon.js demo-game and make it run as an Instant Game.
