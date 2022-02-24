---
title: Real-time Multiplayer with Colyseus
image: /img/resources/networking/colyseus/gameplay.png
description: Learn to develop multiplayer experiences with Colyseus
keywords: colyseus, multiplayer, networking, authoritative, server
further-reading:
video-overview:
video-content:
---


<!-- [ ![](/img/resources/networking/colyseus/gameplay.png) ](https://playground.babylonjs.com/#RAG7FE) -->

This guide you will show you how you can build a multiplayer experience with Colyseus Multiplayer Framework and Babylon.js.

<iframe height="70%" width="70%" src="https://colyseus-babylon-demo.herokuapp.com/index.html" />

**By the end of this guide, you will:**

- Set-up your first authoritative server with Colyseus
- Synchronize shared state data between server and client
- Exchange messages between client and server
- Match-make clients into game sessions (rooms)

## Full source code

* [Babylon.js Project (Client-side)][1]
* [Colyseus Node.js/TypeScrippt Project (Server-side)](https://github.com/lpsandaruwan/colyseus-babylon-demo-server)

## Before you start

What is Colyseus? Colyseus is an open-source Node.js Framework for making multiplayer experiences.

### Prior Knowledge Expected

- Basic Babylon.js knowledge ([See Getting Started with Babylon.js](https://doc.babylonjs.com/start))
- Basic knowledge of Node.js ([See Introduction to Node.js](https://nodejs.dev/learn/))

### Software Requirements

- [Download Node.js LTS](https://nodejs.org/en/download/)

## Creating the server

We will be making a basic server, hosted locally on your computer for keeping player states. Changes will be synchronized with clients accordingly.

To create a fresh new Colyseus server, run the following from your command-line:

```
npm init colyseus-app ./babylonjs-multiplayer-server
```

Let's make sure you can run the server locally now, by running `npm start`:

```
cd babylonjs-multiplayer-server
npm start
```

If successful, the output should look like this in your command-line:

```
> my-app@1.0.0 start
> ts-node-dev --respawn --transpile-only src/index.ts

✅ development.env loaded.
✅ Express initialized
🏟 Your Colyseus App
⚔️ Listening on ws://localhost:2567
```

### Including the Colyseus JavaScript SDK

For simplicy sake, the examples on this guide are using the [Babylon.js Playground](https://doc.babylonjs.com/toolsAndResources/tools/playground). Although the full source-code available for download uses [NPM + Webpack](https://doc.babylonjs.com/divingDeeper/developWithBjs/npmSupport).

In the Playground, we inject the Colyseus JavaScript SDK manually through a `<script>` tag created via code, as described in [_"Using External Assets In The Playground"_ → _"Javascript files"_](https://doc.babylonjs.com/toolsAndResources/tools/playground/externalPGAssets#javascript-files).

_(This is not recommended in a real-world scenario)_

```typescript
// Load Colyseus SDK (asynchronously)
var scriptUrl = "https://unpkg.com/colyseus.js@^0.15.0-preview.2/dist/colyseus.js";
var externalScript = document.createElement("script");
externalScript.src = scriptUrl;
document.head.appendChild(externalScript);
```

In a real-world scenario, please follow the [official Colyseus documentation](https://docs.colyseus.io/colyseus/getting-started/javascript-client/) on how to include the Colyseus JavaScript SDK.

<Playground id="#ZRZS5F#1" title="Loading the SDK Example" description="This example only loads the Colyseus JavaScript SDK" image="/img/resources/networking/colyseus/playground-load-sdk.png"/>

### Establishing a Client-Server Connection

Now we can instantiate Colyseus `Client` instance and join a game from any script.

```typescript
var createScene = function() {
  // (...)

  //
  // Create the Colyseus Client.
  //
  var colyseusSDK = new Colyseus.Client("ws://localhost:2567");

  //
  // Connect with Colyseus server
  //
  colyseusSDK.joinOrCreate("my_room").then(function(room) {
    console.log("Connected to roomId: " + room.roomId);

  }).catch(function(error) {
    console.log("Couldn't connect.");
  });

  // (...)
}
```

> Note that we're using the local `ws://localhost:2567` endpoint here. You need to [deploy your server](https://docs.colyseus.io/arena/getting-started/create-application/) to the public internet in order to play with others online.

> If you happen to see `net::ERR_BLOCKED_BY_CLIENT` error in the console, make sure to disable ad-block or shields due to untrusted origin.

When you run your BabylonJS project now, your client is going to establish a connection with the server, and the server is going to create the room `my_room` on demand for you.

Notice that `my_room` is the default room identifier set by the barebones Colyseus server. You can and should change this identifier in the `arena.config.ts` file.

You will be seeing the following message in your server logs, which means a client successfully joined the room!

```shell
19U8WkmoK joined!
```

<Playground id="#3K64VU#2" title="Room connection Example" description="This example loads the Colyseus SDK and connects into a room." image="/img/resources/networking/colyseus/playground-room-connection.png"/>

## Room State and Schema

In Colyseus, we define shared data through its `Schema` structures.

> `Schema` is a special data type from Colyseus that is capable of encoding its changes/mutations _incrementally_. The encoding and decoding process happens internally by the framework and its SDK.

The state synchronization loop looks like this:

1. State changes (mutations) are synchronized automatically from Server → Clients
2. Clients, by attaching callbacks to their local _read-only_ `Schema` structures, can observe for state mutations and react to it.
3. Clients can send arbitrary messages to the server - which decides what to do with it - and may mutate the state (Go back to step **1.**)

---

Let's go back to editing the Server code, and define our Room State in the Server.

We need to handle multiple `Player` instances, and each `Player` will have `x`, `y` and `z` coordinates:

```typescript
// MyRoomState.ts
import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}
```

> See more about the [Schema structures](https://docs.colyseus.io/colyseus/state/schema/).

Now, still in the server-side, let's modify our `onJoin()` method to create a `Player` instance whenever a new connection is established with the room.

```typescript
// MyRoom.ts
// ...
    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");

        // create Player instance
        const player = new Player();

        // place Player at a random position
        const FLOOR_SIZE = 500;
        player.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
        player.y = -1;
        player.z = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);

        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
    }
// ...
}
```

Also, when the client disconnects, let's remove the player from the map of players:

```typescript
// MyRoom.ts
// ...
    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
    }
// ...
```

The state mutations we've done in the server-side **can be observed** in the client-side, and that's what we're going to do in the next section.

## Setting up the Scene for Synchronization

For this demo, we need to create two objects in our Scene:

- A Plane, mesh object to represent the floor
- A Sphere, mesh object to represent the players, which we will initiate for each new player joining the room.

### Creating the Plane

Let's create a Plane with size `500`.

```typescript
// Create the ground
var ground = BABYLON.MeshBuilder.CreatePlane("ground", {size: 500}, scene);
ground.position.y = -15;
ground.rotation.x = Math.PI / 2;
```

## Listening for State Changes

After a connection with the room has been established, the client-side can start listening for state changes, and create a visual representation of the data in the server.

### Adding new players

As per [Room State and Schema](#room-state-and-schema) section, whenever the server accepts a new connection - the `onJoin()` method is creating a new Player instance within the state.

We're going to listen to this event on the client-side now:

```typescript
// (...)

// connect with the room
colyseusSDK.joinOrCreate("my_room").then(function(room) {

  // listen for new players
  room.state.players.onAdd((player, sessionId) => {
    //
    // A player has joined!
    //
    console.log("A player has joined! Their unique session id is", sessionId);
  });
});

// (...)
```

When playing the scene, you should see a message in the browser's console whenever a new client joins the room.

For the visual representation, we need to clone the "Player" object, and keep a local reference to the cloned object based on their `sessionId`, so we can operate on them later:

```typescript
// (...)

// we will assign each player visual representation here
// by their `sessionId`
var playerEntities = {};

colyseusSDK.joinOrCreate("my_room").then(function(room) {

  // listen for new players
  room.state.players.onAdd(function (player, sessionId) {
    // create player Sphere
    var sphere = BABYLON.MeshBuilder.CreateSphere(`player-${sessionId}`, {
        segments: 8,
        diameter: 40
    });

    // set player spawning position
    sphere.position.set(player.x, player.y, player.z);
  });
});

// (...)
```

<Playground id="#W613VP#1" title="Adding players Example" description="This example connects into a room, and display the players who joined the room" image="/img/resources/networking/colyseus/playground-onadd.png"/>

### The "Current Player"

We can give the current player, color `#ff9900` and other players `grey`, by checking the `sessionId` against the connected `room.sessionId`:

```typescript
// (...)

room.state.players.onAdd((player, sessionId) => {
  var isCurrentPlayer = (sessionId === room.sessionId);

  // (...)

  // set material to differentiate CURRENT player and OTHER players
  sphere.material = new BABYLON.StandardMaterial(`player-material-${sessionId}`);
  sphere.material.emissiveColor = (isCurrentPlayer) ? BABYLON.Color3.FromHexString("#ff9900") : BABYLON.Color3.Gray();

  // (...)
});

// (...)
```

### Removing disconnected players

When a player is removed from the state (upon `onLeave()` in the server-side), we need to remove their visual representation as well.

```javascript
// ...
room.state.players.onRemove(function (player, sessionId) {
    playerEntities[sessionId].dispose();
    delete playerEntities[sessionId];
});
// ...
```

<Playground id="#CB3LF6" title="Current player color Example" description="This example connects into a room, and set different color for current player." image="/img/resources/networking/colyseus/playground-onadd-onremove.png" />

## Moving the players

### Sending the new position to the server

We are going to allow the `Scene.onPointerDown` event; to determine the exact `Vector3` position the player should move towards, and then send it as a message to the server.

```typescript
scene.onPointerDown = function (event, pointer) {
  if (event.button == 0) {
    const targetPosition = pointer.pickedPoint.clone();

    // Position adjustments for the current play ground.
    // Prevent spheres from moving all around the screen other than on the ground mesh.
    targetPosition.y = -1;
    if(targetPosition.x > 245) targetPosition.x = 245;
    else if(targetPosition.x < -245) targetPosition.x = -245;
    if(targetPosition.z > 245) targetPosition.z = 245;
    else if(targetPosition.z < -245) targetPosition.z = -245;

    // Send position update to the server
    room.send("updatePosition", {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    });
  }
};
```

### Receiving the message from the server

Whenever the `"updatePosition"` message is received in the server, we're going to mutate the player that sent the message through its `sessionId`.

```typescript
// MyRoom.ts
// ...
  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("updatePosition", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x = data.x;
      player.y = data.y;
      player.z = data.z;
    });
  }
// ...
```

### Updating Player's visual representation

Having the mutation on the server, we can detect it on the client-side via `player.onChange()`, or `player.listen()`.

- `player.onChange()` is triggered **per schema instance**
- `player.listen(prop)` is triggered **per property** change

We are going to use `.onChange()` since we need all the new coordinates at once, no matter if just one has changed individually.

```typescript
// (...)

room.state.players.onAdd(function (player, sessionId) {
    // (...)
    player.onChange(function () {
        playerEntities[sessionId].position.set(player.x, player.y, player.z);
    });

    // Alternative, listening to individual properties:
    // player.listen("x", (newX, prevX) => console.log(newX, prevX));
    // player.listen("y", (newY, prevY) => console.log(newY, prevY));
    // player.listen("z", (newZ, prevZ) => console.log(newZ, prevZ));
});

// (...)
```

> Read [more about Schema callbacks](https://docs.colyseus.io/colyseus/state/schema/#client-side)

<Playground id="#JMA5FE" title="Updating player's position Example" description="This example update players positions without interpolation" image="/img/resources/networking/colyseus/playground.png"/>

### Interpolating the player's position instead of a "sudden" position change.

> TODO:

<Playground id="#RAG7FE#26" title="Full example with player interpolation" description="Full example with player position position interpolation" image="/img/resources/networking/colyseus/playground.png"/>

## Extra: Monitoring Rooms and Connections

Colyseus comes with an optional monitoring panel that can be helpful during the development of your game.

To view the monitor panel from your local server, go to http://localhost:2567/colyseus.

![monitor](/img/resources/networking/colyseus/monitor.png)

You can see and interact with all spawned rooms and active client connections through this panel.

> See [more information about the monitor panel](https://docs.colyseus.io/colyseus/tools/monitor/).


## More

We hope you found this tutorial useful, if you'd like to learn more about Colyseus please have a look at the [Colyseus documentation](https://docs.colyseus.io/), and join the [Colyseus Discord community](https://discord.gg/RY8rRS7).


[1]: https://github.com/lpsandaruwan/colyseus-baylon-demo