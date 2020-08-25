# Combine Babylon.js and Pixi.js


Pixi.js is a fast, lightweight, open source 2D library with full support for webGL with a very fast rendering speed. It is great to use as a UI in combination with Babylon.js, making a perfect duo for your web game world.


## Setup Pixi.js rendering
```javascript
var pixiRenderer = new PIXI.WebGLRenderer({
    context: engine._gl,
    view: engine.getRenderingCanvas(),
    clearBeforeRender: false,
    autoStart: false
});
```

## Add Pixi.js Sprites to Stage

```javascript
var stage = new PIXI.Container();
var sprite = PIXI.Sprite.from('https://i.imgur.com/1yLS2b8.jpg');
sprite.anchor.set(0.5);
sprite.position.set(canvas.width/2, canvas.height/2);
stage.addChild(sprite);

```
The *clearBeforeRender* and *autoStart* are two very important properties that must be used and set to *false*.

## Rendering Sequence
The render sequence of Babylon.js and Pixi.js is also very important, Babylon.js must be rendered first.

```
engine.runRenderLoop(function() {   
    scene.render();    	
    engine.wipeCaches(true);
  
    pixiRenderer.reset();
    pixiRenderer.render(stage);
});
```

[Working JSFiddle Example Pixi.js in Front](https://jsfiddle.net/y5q7Lb1v/40/)

It is possible to place a Pixi.js stage behind a Babylon.js scene provided you use

```
scene.autoClear = false;
```

to make the background of the scene transparent. In this case render Pixi.js before Babylon.js.

```
engine.runRenderLoop(function() {   
  pixiRenderer.reset();
  pixiRenderer.render(stage);
  
  scene.autoClear = false;
  scene.render();    	
  engine.wipeCaches(true);
   
});
```

It is also possible to combine these and have Pixi.js stages behind and in front of a Babylon.js scene.

```
engine.runRenderLoop(function() {   
  pixiRenderer.reset();
  pixiRenderer.render(stage);
  
  scene.autoClear = false;
  scene.render();    	
  engine.wipeCaches(true);
  
  pixiRenderer.reset();
  pixiRenderer.render(stage1);
 
});
```

[JSFiddle Example Multiple Pixi.js Stages](https://jsfiddle.net/y5q7Lb1v/42/)

## WebGL1 Problems


When your browser is running webGL1 then you need to reset the Pixi.js context first for each rendering as below.

```
engine.runRenderLoop(function() { 
    if(engine.webGLVersion === 1) {
        pixiRenderer.reset();
    }
    scene.render();    	
    engine.wipeCaches(true);
  
    pixiRenderer.reset();
    pixiRenderer.render(stage);
});
```


## Pixi.js Versions

Always use the [latest released version of Pixi.js](https://github.com/pixijs/pixi.js/releases)