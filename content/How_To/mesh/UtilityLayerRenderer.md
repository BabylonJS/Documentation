# UtilityLayerRenderer

The UtilityLayerRenderer class overlays objects in a scene without modifying the existing scene. It can be used to enable custom overlays or [Gizmos](/How_To/Gizmo).

Default utilityLayerRenderers are available with the following

```
UtilityLayerRenderer.DefaultUtilityLayer // for overlays like position/scale gizmos
UtilityLayerRenderer.DefaultKeepDepthUtilityLayer // for occluded gizmos like bounding box)
```

but utility layers can be created manually with the following

```
var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
```
The UtilityLayerRenderer contains references to both the utility layer's scene as well as the original scene.
```
utilLayer.originalScene;
utilLayer.utilityLayerScene;
```
Once created meshes can be added to the utility layer's scene

```
 // Create an overlay box
var overlayBox = BABYLON.Mesh.CreateBox("box", 1, utilLayer.utilityLayerScene);
overlayBox.position.z = 0.5
overlayBox.position.y = 3.5;
// Create a different light for the overlay scene
var overlayLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 1), utilLayer.utilityLayerScene);
overlayLight.intensity = 0.7;
```

# Controls
By default, the overlaid scene will be drawn on top of the existing scene ignoring the depth buffer. Of objects in the utility scene are desired to be occluded by the main scene, autoClearDepthAndStencil should be set to false
```
utilLayer.utilityLayerScene.autoClearDepthAndStencil=false;
```
Note: When this is set to false, transparent meshes will always be occluded by objects drawn to the utility layer
By default, the utility layer's scene will be drawn following every draw of the original scene. To disable this behavior, the shouldRender property can be set to false. If set to false, the utility layer can be rendered manually via the render function.
```
utilLayer.shouldRender=false;
utilLayer.render();
```

# Pointer events
Since the utility layer is rendered on top of the existing scene there are a couple options to control how pointer interactions with the scenes work.
By default, the utility layer fires the pointerUp, pointerDown and pointerMove events as usual but pointer down events are only passed to the utility layer's scene if the pointer event contacts it first.

To disable other events if the pointer event does not contact the utility layer first, the following can be used.
```
utilLayer.onlyCheckPointerDownEvents=false;
```

To enable all events beyond up, down and move (eg. mouse wheel). processAllEvents can be set.
```
utilLayer.processAllEvents=true;
```

The UtilityLayerRenderer fires an onPointerOutObservable event when the pointer leaves the utility layer back to the original scene.
```
utilLayer.onPointerOutObservable.add(function(pointerId){

});
```
# Examples

 - [Overlay scene example](https://www.babylonjs-playground.com/#DEYAQ5#41)
 - [Gizmo example](https://www.babylonjs-playground.com/#31M2AP#9)