---
title: Realtime Multiplayer With Colyseus Framework
image: /img/resources/babylonjs_and_colyseus/gameplay.png
description: Realtime multiplayer applications with BabylonJS and Colyseus.
keywords: babylonJS, extension, external libraries, external, colyseus, multiplayer, server
further-reading:
video-overview:
video-content:
---

<iframe height="70%" width="70%" src="https://colyseus-babylon-demo.herokuapp.com/index.html"/>

This tutorial will help you to understand how to start building a multiplayer game
integrating Colyseus multiplayer framework with BabylonJS.
In this tutorial you will learn,
* How to setup the server.
* Matchmaking with the server.
* Client-server state synchronization.
* Client-server message exchanging.

We will cover these scenarios using TypeScript.

## Complete source code
* [BabylonJS client](https://github.com/lpsandaruwan/colyseus-baylon-demo)
* [Colyseus Server](https://github.com/lpsandaruwan/colyseus-babylon-demo-server)

## Let's Begin

### Creating the server

We will be making a basic server, hosted locally on your computer for keeping player states. Changes will be synchronized with clients accordingly.

To create a fresh new Colyseus server, run the following from your command-line:

```
npm init colyseus-app ./playcanvas-demo-server
```

Let's make sure you can run the server locally now, by running `npm start`:

```
cd playcanvas-demo-server
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

### Creating the client
First we create the basic TypeScript project with dependencies.
```shell
npm init
npm install --save-dev typescript webpack ts-loader webpack-cli
npm install --save babylonjs@preview babylonjs-loaders@preview babylonjs-gui@preview
```

Now we can create the webpack configuration file, `webpack.config.js`.
```javascript
// webpack.config.js
const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        app: "./src/app.ts"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', 'tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}
```
And also the TypeScript configurations, `tsconfig.json`.
```javascript
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./dist",
    "types": [
      "babylonjs",
      "babylonjs-gui",
      "babylonjs-materials",
      "node"
    ]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.js"
  ]
}
```

Now we can add scripts to build scripts to `package.json`.
```javascript
"scripts": {
    "build": "webpack",
    "watch": "webpack -w",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```
After that we can create the entrypoint `index.html` file.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Colyseus + Babylon.js Demo</title>
    <style>
        html,body {font-family: "Trajan Pro";overflow: hidden;width: 100%;height: 100%;margin: 0;padding: 0;}
        #renderCanvas {font-family:"Trajan Pro";width: 100%;height: 100%;touch-action: none;}
    </style>
</head>
<body>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <script src="./dist/app.js"></script>
</body>
</html>
```
All good now. We will create a `src` directory to write our code.
First we will create the `app.ts` file as the app logic script entrypoint, adding an event listener when the DOM loaded.
```typescript
import Menu from './menu'

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let menu = new Menu('renderCanvas');

    // Create the scene.
    menu.createMenu();
});
```

We will have the other scenes and logics separately.

Now we need to communicate with the Colyseus server. Hence, we add the Colyseus client library.
```shell
npm install --save colyseus.js@0.15.0-preview.2
```

### Establishing a Client-Server Connection
Now we can instantiate Colyseus `Client` instance and join a game from any script.
```typescript
import {Client, Room} from "colyseus.js";

export default class Menu {
    // ... code
    
    async joinGame(): Room {
        const client = new Client("ws://localhost:2567");
        return await this._colyseus.joinOrCreate("my_room");
    }
}
```
###### Note that we're using the local `ws://localhost:2567` endpoint here. You need to [deploy your server](https://docs.colyseus.io/arena/getting-started/create-application/) to the public internet in order to play with others online.

When you **"Launch"** your BabylonJS project now, your client is going to establish a connection with the server, and the server is going to create the room my_room on demand for you.

Notice that my_room is the default room identifier set by the barebones Colyseus server. You can and should change this identifier in the arena.config.ts file.

You will be seeing the following message in your server logs, which means a client successfully joined the room!
```shell
19U8WkmoK joined!
```
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

###### See more about the [Schema structures](https://docs.colyseus.io/colyseus/state/schema/).

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

Let's create a Plane with size `500` using textures.
```typescript
import * as BABYLON from 'babylonjs';

createGround(): void {
    //Creation of a plane
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", {size: 500}, this._scene);
    plane.position.y = -8;
    plane.rotation.x = Math.PI / 2;

    let floorPlane = new BABYLON.StandardMaterial('floorTexturePlane', this._scene);
    floorPlane.diffuseTexture = new BABYLON.Texture('./public/ground.jpg', this._scene);
    floorPlane.backFaceCulling = false; // Always show the front and the back of an element
    
    let materialPlane = new BABYLON.MultiMaterial('materialPlane', this._scene);
    materialPlane.subMaterials.push(floorPlane);

    plane.material = materialPlane;
}
```


## Listening for State Changes

After a connection with the room has been established, the client-side can start listening for state changes, and create a visual representation of the data in the server.

### Adding new players

As per [Room State and Schema](#room-state-and-schema) section, whenever the server accepts a new connection - the `onJoin()` method is creating a new Player instance within the state.

We're going to listen to this event on the client-side now:

For the visual representation, we need to create new mesh objects, and keep a local reference to the cloned object based on their `sessionId`, so we can operate on them later:

```typescript
export interface Player {
    entity: any,
    targetPosition: BABYLON.Vector3
}

export interface Players {
    [playerId: string]: Player;
}
```

### The "Current Player"

We can give the current player, color `#ff9900` and other players `grey`, by checking the `sessionId` against the connected `room.sessionId`:

```typescript
// ...
this._game.state.players.onAdd((player, sessionId) => {
  // ...
    sphereMaterial.emissiveColor = sessionId === this._game.sessionId ? BABYLON.Color3.FromHexString("#ff9900") : BABYLON.Color3.Gray();
  // ...
});
```

So finally, our logic is,

```typescript
// ...
private _game: Room<any>;
private _players: Players = {};
// ...
this._game.state.players.onAdd((player, sessionId) => {
    const sphere = BABYLON.MeshBuilder.CreateSphere(`player-${sessionId}`, {
        segments: 8,
        diameter: 16
    }, this._scene);
    // Set player mesh properties
    const sphereMaterial = new BABYLON.StandardMaterial(`playerMat-${sessionId}`, this._scene);
    sphereMaterial.emissiveColor = sessionId === this._game.sessionId ? BABYLON.Color3.FromHexString("#ff9900") : BABYLON.Color3.Gray();
    sphere.material = sphereMaterial;

    // Set player spawning position
    sphere.position.set(player.x, player.y, player.z);
    this._players[sessionId] = {
        entity: sphere,
        targetPosition: new BABYLON.Vector3(0, 0, 0)
    };
});
```

### Removing disconnected players

When a player is removed from the state (upon `onLeave()` in the server-side), we need to remove their visual representation as well.

```javascript
// ...
this._game.state.players.onRemove((player, playerId) => {
    this._players[playerId].entity.dispose();
    delete this._players[playerId];
});
// ...
```

## Moving the players

### Sending the new position to the server

We are going to allow the `Scene.onPointerDown` event; to determine the exact `Vector3` position the player should move towards, and then send it as a message to the server.

```typescript
this._scene.onPointerDown = function (event, pointer) {
    if (event.button == 0) {
        const targetPosition = pointer.pickedPoint.clone();

        // Position adjustments for the current play ground.
        // Prevent spheres from moving all around the screen other than on the ground mesh.
        targetPosition.y = -1;
        if(targetPosition.x > 245) targetPosition.x = 245;
        else if(targetPosition.x < -245) targetPosition.x = -245;
        if(targetPosition.z > 245) targetPosition.z = 245;
        else if(targetPosition.z < -245) targetPosition.z = -245;

        this._players[this._game.sessionId].targetPosition = targetPosition;
        this.move(this._players[this._game.sessionId]);

        // Send position update to the server
        this._game.send("updatePosition", {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
        });
    }
}.bind(this);
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
// ...
this._game.state.players.onAdd((player, sessionId) => {
    // ...
    player.onChange(() => {
        this._players[sessionId].targetPosition.set(player.x, player.y, player.z);
        this.move(this._players[sessionId]);
    })
    
    // Alternative, listening to individual properties:
    // player.listen("x", (newX, prevX) => console.log(newX, prevX));
    // player.listen("y", (newY, prevY) => console.log(newY, prevY));
    // player.listen("z", (newZ, prevZ) => console.log(newZ, prevZ));
});
// ...
```

###### Read [more about Schema callbacks](https://docs.colyseus.io/colyseus/state/schema/#client-side)

## Extra: Monitoring Rooms and Connections

Colyseus comes with an optional monitoring panel that can be helpful during the development of your game.

To view the monitor panel from your local server, go to http://localhost:2567/colyseus.

![monitor](/img/resources/babylonjs_and_colyseus/monitor.png)

You can see and interact with all spawned rooms and active client connections through this panel.

###### See [more information about the monitor panel](https://docs.colyseus.io/colyseus/tools/monitor/).


## More

We hope you found this tutorial useful, if you'd like to learn more about Colyseus please have a look at the [Colyseus documentation](https://docs.colyseus.io/), and join the [Colyseus Discord community](https://discord.gg/RY8rRS7).
