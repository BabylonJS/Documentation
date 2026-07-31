---
title: Debug Scenes Remotely Using the Reflector
image: 
description: Debug scenes remotely by reflecting the scene over the network.
keywords: babylon.js, tools, resources, debug layer, inspector, remote debugging
further-reading:
video-overview:
video-content:
---

_This feature is a work in progress._

## Using the Reflector

### Step 1 - Start the reflector bridge

Clone the Babylon.js repo and launch the reflector bridge from the command line.

The default port is 1234. Specify a different port by adding `--port=<port>` to the command line.

![bridge](/img/features/reflector/bridge.webp)

### Step 2 - Start the reflector debugging session
Open https://sandbox.babylonjs.com/?reflector=true.

The default hostname and port are `localhost` and `1234`. Specify a different hostname or port by adding `&hostname=<hostname>&port=<port>` to the URL. The hostname and port must match the host and port where the reflector bridge is running.

![debug session](/img/features/reflector/debugSession.webp)

### Step 3 - Connect to the reflector debugging session from the client

The reflector is supported in environments that run Babylon.js with WebSocket support (e.g. a web page running Babylon.js in a browser or a Babylon React Native application). To enable the connection, create a [reflector](/typedoc/classes/babylon.reflector) instance. Here is an example in JavaScript:

```javascript
const reflector = new BABYLON.Reflector(scene, "localhost", 1234);

// ...

reflector.close();
```

The inspector UI in the Tools pane has this code built in. For example, if you load a glTF model in the sandbox on an Android device connected to a desktop over USB with port forwarding enabled, you can use the inspector to connect to the remote debugging session.

![connect to reflector](/img/features/reflector/connectToReflector.webp)

After transferring the scene, the reflector debugging session will reflect the scene from the device:

![debug session with scene](/img/features/reflector/debugSessionWithScene.webp)

Happy remote debugging!

## Known Issues

* Some states are not correctly reflected across the remote connection.
* Large scenes may exceed the limits of how much can be transferred through WebSockets.
* The WebSockets are currently not secure, which can cause issues with HTTPS connections.
