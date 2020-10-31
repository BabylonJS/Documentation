# How To Use Multi Views

Babylon.js is able to render multi views of the same scene.

# Active cameras

Basically, a scene has a `scene.activeCamera` property to define the point of view. But you can also define many active cameras with the following code:

```javascript
scene.activeCameras.push(camera);
scene.activeCameras.push(camera2);
```

# Viewports

If you want to use many cameras, you will need to specify a viewport for each camera:

```javascript
camera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1.0);
camera2.viewport = new BABYLON.Viewport(0, 0, 0.5, 1.0);
```

A viewport is defined by the following constructor:

```javascript
BABYLON.Viewport = function (x, y, width, height);
```

where x, y, are the lower left hand corner of the viewport followed by its width and height. Values for x, y, width and height are given as a number between 0 and 1 representing a fraction of the screen width and height respectively.

- [Playground Example Viewport](https://www.babylonjs-playground.com/pg/E9IRIF)
