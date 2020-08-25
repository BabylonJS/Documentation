# How to Display and use The Inspector

## Invocation

You can display the Inspector by calling:

```javascript
scene.debugLayer.show();
```

The `show` function will return a promise that you can use to know when the Inspector is loaded and visible.

## Loading

**Provided** your project is running on a **server** the Inspector is automatically loaded from the BabylonJS server **when** it is called as above. 

The latest version of the inspector can be pulled from: `https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js`

You can update this URL by setting the variable:

```javascript
BABYLON.DebugLayer.InspectorURL = 'http://myurl/babylon.inspector.bundle.js';
```

To use the Inspector when your project is stored and run **locally** with an **internet connection** then you need to load the Inspector directly

```html
<script src=https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js></script>
```

To use the Inspector **locally** with no internet connection you will need to obtain a copy of the file from

https://github.com/BabylonJS/Babylon.js/blob/master/dist/inspector/babylon.inspector.bundle.js


## Control

A `config` object can be given to the `show` method in order to control the following parameters of the Inspector : 
* `overlay`: boolean - Should the Inspector opens by default in overlay mode? False by default
* `enablePopup`: boolean - Should the Inspector allows the panes to popup? True by default
* `globalRoot`: HTMLElement - The HTML element where the Inspector should be created - null by default (will be created alongside the canvas)
* `showExplorer`: boolean - Should the Inspector opens the scene explorer pane? True by default
* `showInspector`: boolean - Should the Inspector opens the inspector pane? True by default
* `embedMode`: boolean - Should the Inspector opens in embedded mode (only one pane)? False by default
* `handleResize`: boolean - Should the Inspector resize the Babylon.js engine associated with the scene when the canvas is resized due to user moving the panes? False by default
* `explorerExtensibility`: See below

Example:
```javascript
scene.debugLayer.show({
    overlay:false, 
    globalRoot:document.getElementById('mydiv')
});
```

## Observable

It is possible to attach an `Observer` to an `Observable` called when a property is modified in the Inspector.
You can call it like this :
```javascript
scene.debugLayer.onPropertyChangedObservable.add((result) => {});
```

The result object contains :
* `object` : BABYLON.Node - The object modified. It can be a scene, a mesh, a light or any other element that can be modified in the Inspector
* `property` : string - The modified property name.
* `value` : any - The new value.
* `initialValue` : any - The old value, before the modification.

You can also register an `Observer` when the selection changes with
```javascript
scene.debugLayer.onSelectionChangedObservable.add((result) => {});
```

The result object will be the new selected object.

## Highlighting a specific entity

By calling the following code, you can make sure to select a specific entity and highlight a specific portion of its property grid:

```
scene.debugLayer.show().then((layer) => {
    layer.select(pbrmaterial, "ANISOTROPIC");
});
```

## Extensibility

We know that it would be impossible to provide a tool that will target every single need that a Babylon.js may have. This is why the new inspector supports an extensibility API.

### Explorer

You can use the `explorerExtensibility` property of the config object to define an array of predicates that will add new options to scene explorer actions.:

```javascript
BABYLON.Inspector.Show(scene, {
    explorerExtensibility: [
        {
            predicate: entity => entity.getClassName && entity.getClassName().indexOf("Material") !== -1,
            entries: [
                {
                    label: "Say hello",
                    action: (entity) => alert("hello " + entity.name)
                },
                {
                    label: "Do something fun with materials",
                    action: (entity) => alert("hello " + entity.name)
                }]
        },
        {
            predicate: entity => entity.getClassName && entity.getClassName().indexOf("Texture") !== -1,
            entries: [
                {
                    label: "Say hello textures!",
                    action: (entity) => alert("hello " + entity.name)
                }]
        },
        {
            predicate: entity => entity.getClassName && entity.getClassName().indexOf("Mesh") !== -1,
            entries: [
                {
                    label: "Say hello",
                    action: (entity) => alert("hello " + entity.name)
                }]
        }
    ]
});
```

Each predicate will be evaluated with all entites displayed in the scene explorer. If the predicate returns true, then the entries will be added to the entity's actions:

![explorer extensibility](/img/features/debuglayer/exploreraddons.png)

### Inspector

You can also decide to add your own property controls to any property grid. To do so you can declare an array of inspectable properties:

```
var mesh = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

mesh.myProperty = BABYLON.Color3.Red();

mesh.inspectableCustomProperties = [
    {
        label: "My property",
        propertyName: "myProperty",
        type: BABYLON.InspectableType.Color3
    }
]
```

The `inspectableCustomProperties` property can be found on:
- Nodes
- Materials
- Textures
- Skeletons

You can set it up to an array of `IInspectable` which are defined by:
- a label
- a property name 
- a type which could be 
  - BABYLON.InspectableType.Checkbox
  - BABYLON.InspectableType.Slider
  - BABYLON.InspectableType.Color3
  - BABYLON.InspectableType.Vector3
  - BABYLON.InspectableType.Quaternion
  - BABYLON.InspectableType.String
- For sliders, you can specify `min`, `max` and `step`


# Further Reading

[The Inspector Features](/features/playground_debuglayer)  
[How To Customize the Inspector](/How_To/customize_debug_layer)  
