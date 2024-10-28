---
title: Babylon.js and heyVR.io
image:
description: heyVR integration for Babylon.js games
keywords: babylon.js, extension, external libraries, external, heyVR, heyVR.io, WebXR
further-reading:
video-overview:
video-content:
---

heyVR.io is a publishing platform for WebXR games, giving you access to a global audience of hundreds of thousands of players across multiple devices.

It offers a wide range of ready-to-use gameplay features to enhance your players' experience and enable you to start earning from your game through in-game content sales and advertisements.

## Useful Links
- [heyVR.io](https://heyvr.io)
- [heyVR Developer Area](https://developer.heyvr.io)
- [heyVR Documentations](https://docs.heyvr.io)

## Publishing Flow
heyVR.io is free to use, both for players and game developers.
Developers can create an account on the [Developer Area](https://developer.heyvr.io) and publish their games free of charge.
To read more about how the process works, please refer to the documentation on [Publishing Flow](https://docs.heyvr.io/en/developer-area/publish-a-game).

## SDK Implementation
While implementing the heyVR SDK in your games is completely optional, It's highly recommended that you take advantage of the SDK to further enhance your game and make use of features such as save games, leaderboards, inventory etc. to provide better user experience.

heyVR offers 2 different ways to integrate the SDK into your Babylon.js game. Based on your development environment, you can proceed with either of these.

### 1) Built-in SDK
Every game submitted on heyVR has the option to enable the built-in SDK. This will inject the SDk into the game at runtime. 

#### 1.1) Installation
The built-in SDK does not require any installation. 
To enable the built-in SDK, all you need to do is to choose an SDK version for your build before uploading it. 
You can read more about this on the [documentation website](https://docs.heyvr.io/en/developer-area/publish-a-game#game-files).

> If you're using TypeScript, you can install the type definition package for the built-in SDK. Simply run:
> `npm i @heyvr/sdk-types -D` in your project's root directory.

#### 1.2) Basic Usage
Since the SDK loads asynchronously, it's important to make sure it's been loaded before making calls.
To do so, you can listen to the event that's dispatched by the SDK on load:

```javascript
const doStuff= () => 'Executed on SDK load'

window.heyVR ?
  doStuff() :
  window.addEventListener( 'heyVR.SDKLoaded', doStuff );
```

Once the SDK is loaded, all the methods are available via the `window.heyVR` object.
Here's a simple example of checking a user's authentication status:

```javascript
window.heyVR.user.isLoggedIn()
    .then( () => console.log( 'User is authenticated!' ) )
    .catch( () => console.warn( 'User is not logged in.' ) );
```

The SDK offers extensive methods and functionalities, including a sandbox version that allows your game to use the SDK features locally. 
To read about how to use these features, please consult the [SDk Documentation](https://docs.heyvr.io/game-development/sdk/gameplay).

### 2) NPM Package
You might be using NPM to manage your game's dependencies.
In that case, you can take advantage of the NPM package that heyVR provides. 

#### 2.1) Installation
You can install the package by running the following command in your project:

```bash
npm i @heyvr/sdk-gameplay
```
The package already includes the type definitions, in case you're using TypeScript.

#### 2.2) Basic Usage
The package's signature is extremely similar to the built-in SDk. 
You can start by importing the pieces that you need. 
Let's replicate the previous example.

```javascript
import {User} from "@heyvr/sdk-gameplay/dist";

User.isLoggedIn()
    .then( () => console.log( 'User is authenticated!' ) )
    .catch( () => console.warn( 'User is not logged in.' ) );
```

The package also includes a sandbox version. 
For detailed instructions on how to use the package, check out the documentation on [NPM Package](https://docs.heyvr.io/en/game-development/sdk/gameplay/npm-package).
