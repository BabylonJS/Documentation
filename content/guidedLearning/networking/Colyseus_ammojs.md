---
title: Network Physical Synchronization (based on ammojs + colyseus)
image: /img/resources/networking/colyseus_ammojs/d1.webp
description: Learn to develop network physical synchronization with Colyseus
keywords: colyseus, multiplayer, networking, ammojs, server
further-reading:
video-overview:
video-content:
---

![Wireframe](/img/resources/networking/colyseus_ammojs/d1.webp)

This guide will help you implement networked physics synchronization with Colyseus. This is a very simple demonstration. It does not include server-side verification. Collision detection occurs only on the player's client. The server is responsible for synchronizing physics-effect data and assigning physics-calculation authority.

We use ammojs as the physics engine for this demonstration, and you can replace it with other physics engines.

## Full source code

- [colyseus-babylonjs-ammojs](https://github.com/renjianfeng/colyseus-babylonjs-ammojs)

## Before you start

#### Prior Knowledge Expected

- ([Using A Physics Engine](https://doc.babylonjs.com/divingDeeper/physics/usingPhysicsEngine))
- ([Real-time Multiplayer with Colyseus](https://doc.babylonjs.com/guidedLearning/multiplayer/Colyseus))

## Quick demo

Please clone this project and follow the instructions to install and start the project:
[colyseus-babylonjs-ammojs](https://github.com/renjianfeng/colyseus-babylonjs-ammojs)

#### Client application

To be able to build the client application, you'll need to enter the folder,
and install its dependencies first.

```
cd client/
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn the `webpack-dev-server`, listening on [http://localhost:8080](http://localhost:8080).

#### Server application

For the server, the steps are exactly the same. Install the dependencies:

```
cd server/
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn a web socket server, listening on [ws://localhost:2657](ws://localhost:2657).

## Explanation of overall implementation logic

The red mesh calculates the local player's physics effects, while the green mesh calculates the physics effects on other players' clients and then synchronizes them through Colyseus.

The sphere represents the player character, and the cube represents the interactive objects in the scene.

The first player to enter the scene is responsible for the cube's physics calculation, and the other players are responsible for receiving data and rendering. When other players collide with the cube, responsibility for the cube's physics calculation is transferred to those players. You can distinguish these changes by color, just like the difference between green and red mentioned above.

Yes, that's it.

## Code implementation demonstration

#### Character control and network synchronization

First, we create a box and ground, and add physics to them. The ground represents the scene, and the box represents the interactive objects in the scene (such as a football used by many players).

```javascript
scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.HavokPlugin(true, havokInstance));
var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 160, height: 160, subdivisions: 2 }, scene);
ground.position.y = -5;
const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
box.position.y = 1;
const boxAggregate = new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 1, restitution: 0.9 }, scene);
box.material = new BABYLON.StandardMaterial("s-mat", scene);
box.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
box.material.emissiveTexture = new BABYLON.Texture("./src/grass.png", scene);
```

Players and other players, we will create character grid after they join the room

```javascript
client.joinOrCreate <
  StateHandler >
  "game".then((room) => {
    const playerViews: { [id: string]: BABYLON.Mesh } = {};

    room.state.players.onAdd = function (player, key) {
      // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
      playerViews[key] = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
    };
  });
```

Controlling player characters physically with keyboard input

```javascript
// Keyboard listeners
const keyboard = { x: 0, y: 0 };
window.addEventListener("keydown", function (e) {
  if (e.which === Keycode.LEFT) {
    keyboard.x = -10;
  } else if (e.which === Keycode.RIGHT) {
    keyboard.x = 10;
  } else if (e.which === Keycode.UP) {
    keyboard.y = 10;
  } else if (e.which === Keycode.DOWN) {
    keyboard.y = -10;
  }
  playerViews[sessionId].physics.body.setLinearVelocity(new BABYLON.Vector3(keyboard.x, 0, keyboard.y));
});

window.addEventListener("keyup", function (e) {
  if (e.which === Keycode.LEFT) {
    keyboard.x = 0;
  } else if (e.which === Keycode.RIGHT) {
    keyboard.x = 0;
  } else if (e.which === Keycode.UP) {
    keyboard.y = 0;
  } else if (e.which === Keycode.DOWN) {
    keyboard.y = 0;
  }

  playerViews[sessionId].physics.body.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
});
```

In the render loop, the player's rotation and position data for each frame are sent to the server.

```javascript
engine.runRenderLoop(function () {
  if (room && playerViews[sessionId]) {
    room.send("playData", {
      position: {
        x: playerViews[sessionId].position.x,
        y: playerViews[sessionId].position.y,
        z: playerViews[sessionId].position.z,
      },
      quaternion: {
        x: playerViews[sessionId].rotationQuaternion.x,
        y: playerViews[sessionId].rotationQuaternion.y,
        z: playerViews[sessionId].rotationQuaternion.z,
        w: playerViews[sessionId].rotationQuaternion.w,
      },
    });
  }
});
```

The server broadcasts the position and rotation data submitted by players.

```javascript
  onCreate (options) {
   //...
    this.onMessage("playData", (client, message) => {
        this.state.players.get(client.sessionId).playerData = message;
    });
   //...
  }
  onUpdate () {
    //...
    this.state.players.forEach((player, sessionId) => {
        player.position.x = player.playerData.position.x
        player.position.y = player.playerData.position.y
        player.position.z = player.playerData.position.z

        player.quaternion.x = player.playerData.quaternion.x
        player.quaternion.y = player.playerData.quaternion.y
        player.quaternion.z = player.playerData.quaternion.z
        player.quaternion.w = player.playerData.quaternion.w
    });
      //...
  }
```

Update the position and rotation of other players using the broadcast rotation data.

Note: to prevent jitter caused by linear speed, the position is used directly to lock the target when it is close enough to the broadcast position.

```javascript
player.position.onChange = () => {
  if (key != room.sessionId) {
    if (Math.abs(playerViews[key].position.x) < 0.2 && Math.abs(playerViews[key].position.y) < 0.5 && Math.abs(playerViews[key].position.x) < 0.2) {
      playerViews[key].position = new BABYLON.Vector3(player.position.x, player.position.y, player.position.z);
    } else {
      playerViews[key].physics.body.setLinearVelocity(new BABYLON.Vector3((player.position.x - playerViews[key].position.x) * 10, (player.position.y - playerViews[key].position.y) * 10, (player.position.z - playerViews[key].position.z) * 10));

      playerViews[key].rotationQuaternion = BABYLON.Quaternion.Slerp(playerViews[key].rotationQuaternion, new BABYLON.Quaternion(player.quaternion.x, player.quaternion.y, player.quaternion.z, player.quaternion.w), 0.4);
    }
  }
};
```

Now, our player-character controls and network synchronization are complete. Next, we will continue implementing scene-object interactions.

#### Physical interaction of scene objects (multiplayer football)

In `GameRoom.ts`, create a variable called "boxData" to store the box's position and rotation data, where "targetId" represents the "sessionId" of the player responsible for the box's physics calculation and ownership. At the same time, you need to receive the box data sent by the player client and broadcast it to the other players.

```javascript
export class GameRoom extends Room {
  maxClients = 8;
  boxData = {
    targetId: null,
    position: null,
    quaternion: null,
  };
  //...
  onCreate(options) {
    //...
    this.onMessage("boxUpdate", (client, message) => {
      this.boxData = message;
    });
  }
  onUpdate() {
    this.broadcast("boxUpdate", this.boxData);
    //...
  }
}
```

We declare a variable called "isUpdateBox" to record whether the local player character is responsible for the box's physical collision. If the targetid value broadcast by the server is null or equal to the local player's sessionid, the local player will immediately take over the physical collision. Otherwise, the box's position and rotation will use the data broadcast by the server.

```javascript
let isUpdateBox=false;

 room.onMessage("boxUpdate", (message) => {
    if(message.targetId==null||message.targetId==sessionId){
        isUpdateBox=true
        box.material.diffuseColor. = new BABYLON.Color3(1, 0, 0);
    }else{
        isUpdateBox=false
        box.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        box.position= BABYLON.Vector3.Lerp(
          box.position,
          new BABYLON.Vector3(
            message.position.x,
            message.position.y,
            message.position.z
          ),
          0.5)
        box.rotationQuaternion=BABYLON.Quaternion.Slerp(
          box.rotationQuaternion,
          new BABYLON.Quaternion(
            message.quaternion.x,
            message.quaternion.y,
            message.quaternion.z,
            message.quaternion.w
          ),
          0.4)
    }
});

 engine.runRenderLoop(function() {
    if(room&&playerViews[sessionId]){
        // ...
        if(isUpdateBox){
            room.send('boxUpdate', {
                targetId:sessionId,
                position:{
                  x: box.position.x,
                  y: box.position.y,
                  z:box.position.z
                },
                quaternion:{
                  x:box.rotationQuaternion.x,
                  y:box.rotationQuaternion.y,
                  z:box.rotationQuaternion.z,
                  w:box.rotationQuaternion.w
                }
            });
        }
    }
});
```

If other players collide with the box, the targetid will be replaced by the sessionid of those players. Correspondingly, the physical-collision authority will also be transferred to them.

```javascript
if (key === room.sessionId) {
  //...
  boxAggregate.body.setCollisionCallbackEnabled(true);
  boxAggregate.body.getCollisionObservable().add((event) => {
    room.send("boxUpdate", {
      targetId: sessionId,
      position: { x: box.position.x, y: box.position.y, z: box.position.z },
      quaternion: { x: box.rotationQuaternion.x, y: box.rotationQuaternion.y, z: box.rotationQuaternion.z, w: box.rotationQuaternion.w },
    });
  });
} else {
  //...
}
```

Now, we have completed all the functions!!!

## Please enjoy the final effect

![Wireframe](/img/resources/networking/colyseus_ammojs/d2.webp)

## Homework

There is a small bug in this demo: when the player responsible for the box's physics leaves the game, the box remains suspended in the air because it loses its computing host. In that case, you need to transfer control of the box to another player. Please try to implement this in the sample code.
