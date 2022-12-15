---
title: Network Physical Synchronization (based on ammojs + colyseus)
image: /img/resources/networking/colyseus_ammojs/d1.gif
description: Learn to develop Network Physical Synchronization by colyseus
keywords: colyseus, multiplayer, networking, ammojs, server
further-reading:
video-overview:
video-content:
---

![Wireframe](/img/resources/networking/colyseus_ammojs/d1.gif)

This guide will help you realize the synchronization of network physical effects based on colyseus. This is a very simple demonstration. It does not include any server verification. Collision and detection only occur on the player's client. The server is responsible for synchronizing the data of physical effects and allocating the permissions of physical calculation;

We use ammojs as the physical engine for this demonstration, and you can also replace it with other physical engines;

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

To be able to build the client application, you'll need to enter in the folder,
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

The red mesh calculates the physical effects locally of the current user, and the green mesh calculates the physical effects on the clients of other players, and then synchronizes them through colyseus.

the sphere represents the player character, and the cube represents the interactive objects in the scene.

The first player to enter the scene is responsible for the physical calculation of the cube, and other players are responsible for receiving data and rendering. When other players collide with the cube, the physical calculation of the cube is transferred to the collided players. You can distinguish these changes by color, just like the difference between green and red mentioned above

Yes, that's it

## Code implementation demonstration

#### Character control and network synchronization

First, we create a box and ground, and add physics to it,the ground represents the scene, and the box represents the interactive objects in the scene (such as a football played by many people)

```javascript
scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new AmmoJSPlugin(true, Ammo));
var ground = BABYLON.Mesh.CreateGround("ground1", 160, 160, 2, scene);
ground.position.y = -5;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
box.position.y = 1;
box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
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

Physical control of player characters through keyboard keys

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
  playerViews[sessionId].physicsImpostor.setLinearVelocity(new BABYLON.Vector3(keyboard.x, 0, keyboard.y));
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

  playerViews[sessionId].physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
});
```

In runrenderloop, the rotation and position data of each frame of the player are sent to the server

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

Broadcast the position and rotation data submitted by players in the server

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

Update the position and rotation of other players through the broadcast rotation data;

Note: to prevent jitter caused by linear speed, position will be directly used to lock the position when the target is close enough to the broadcast position.

```javascript
player.position.onChange = () => {
  if (key != room.sessionId) {
    if (Math.abs(playerViews[key].position.x) < 0.2 && Math.abs(playerViews[key].position.y) < 0.5 && Math.abs(playerViews[key].position.x) < 0.2) {
      playerViews[key].position = new BABYLON.Vector3(player.position.x, player.position.y, player.position.z);
    } else {
      playerViews[key].physicsImpostor.setLinearVelocity(new BABYLON.Vector3((player.position.x - playerViews[key].position.x) * 10, (player.position.y - playerViews[key].position.y) * 10, (player.position.z - playerViews[key].position.z) * 10));

      playerViews[key].rotationQuaternion = BABYLON.Quaternion.Slerp(playerViews[key].rotationQuaternion, new BABYLON.Quaternion(player.quaternion.x, player.quaternion.y, player.quaternion.z, player.quaternion.w), 0.4);
    }
  }
};
```

Now, the control of our players' characters and network synchronization are completed. Next, we will continue to realize the interaction of scene objects;

#### Physical interaction of scene objects(Multiplayer football)

We are in 'GameRoom.ts' create a variable "boxData" in the file to save the position and rotation data of the box, where "targetId" represents the "sessionId" of the player responsible for the physical calculation and hosting of the box; at the same time, you need to receive the box data sent by the player client and broadcast it to other players.

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

We declare a variable "isUpdateBox" to record whether the local player character is responsible for the physical collision of the box. If the targetid value broadcast by the server is null or the targetid is equal to the sessionid of the local player, the local player will immediately take over the physical collision. Otherwise, the position and rotation of the box will use the data broadcast by the server

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

If other players collide with the box, the targetid will be replaced by the sessionid of other players. Correspondingly, the physical collision permission will also be transferred to other players.

```javascript
if (key === room.sessionId) {
  //...
  box.physicsImpostor.registerOnPhysicsCollide(playerViews[sessionId].physicsImpostor, function (main, collided) {
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

![Wireframe](/img/resources/networking/colyseus_ammojs/d2.gif)

## Homework

There is a small bug in this demo, that is, when the player responsible for the physical operation of the box quits the game, the box is suspended in the air due to the loss of the computing console. In this case, you need to switch the console of the box to other players. Please try to implement this function in the case code.
