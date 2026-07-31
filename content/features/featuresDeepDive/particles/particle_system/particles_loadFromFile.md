---
title: Loading Particle Systems from a JSON File
image: 
description: Learn how to load and parse particle systems from a local JSON file.
keywords: diving deeper, particles, particle system, json, loading
further-reading:
video-overview:
video-content:
---

## Particle System JSON Files

When you use the [particle system editor](/legacy/inspector/particleEditor), you can save the particle system as a local JSON file that can be loaded and used in any Babylon.js scene. This is useful for sharing particle systems between different scenes and for updating a particle system quickly. Changing the parameters in a locally stored JSON file lets any scene that uses that particle system pick up the update immediately, without needing to manage a referenced snippet ID.

## Loading the JSON file

The [Asset Manager](/features/featuresDeepDive/importers/assetManager) offers flexibility and power in loading the multiple files needed for particle systems — such as particle textures and particle system JSON files — at once. Simply add a new [TextFileAssetTask](/features/featuresDeepDive/importers/assetManager#textfileassettask) for each particle system file that needs to be loaded.

```javascript
const assetsManager = new BABYLON.AssetsManager(scene);
const particleFile = assetsManager.addTextFileTask("my particle system", "particleSystem.json");

// load all tasks
assetsManager.load();
```

Create a new `TextFileTask` for each particle system that needs to be loaded. The Asset Manager loads each file in sequence and then invokes a callback once all loading is complete. Since most effects are made up of several particle systems, the Asset Manager helps load each file quickly and efficiently before parsing.

```javascript
assetsManager.onFinish = function (task) {
    console.log("task successful", task);

    // prepare to parse particle system files
}
```

## Parsing the Text File as JSON

Once the files are loaded as text, they need to be parsed as JSON objects before they can be used. Simply add a `JSON.parse` for each loaded text file.

```javascript
assetsManager.onFinish = function (task) {
    console.log("task successful", task);

    // prepare to parse particle system files
    const particleJSON = JSON.parse(particleFile.text);
}
```

## Using the JSON with BABYLON.ParticleSystem

The final step is to convert the JSON into a `BABYLON.ParticleSystem` using another parse operation. However, this parse operation has several components worth exploring.

```javascript
const myParticleSystem = BABYLON.ParticleSystem.Parse(json, scene, rootURL, doNotStart, capacity);
```

- **json**: The JSON file to parse.
- **scene**: The scene or engine within which to create the particle system.
- **rootURL**: The root URL to load dependencies like the particle texture.
- **doNotStart**: Boolean that determines whether the particle system should automatically start. This overrides the autostart parameter contained in the particle system JSON.
- **capacity**: The capacity limit of particles for this system. This is the only way to change the capacity of a particle system created from JSON. If this parameter is undefined or null, the capacity parameter in the JSON will be used.

Adding this last step to our Asset Manager completes the loading and creation of our particle system.

```javascript
assetsManager.onFinish = function (task) {
    console.log("task successful", task);

    // prepare to parse particle system files
    const particleJSON = JSON.parse(particleFile.text);
    const myParticleSystem = BABYLON.ParticleSystem.Parse(particleJSON, scene, "", false, 1000);
}
```

Live example: <Playground id="#9Y10LR" title="Loading Particle System From File" description="Simple example using the Asset Manager to load a particle system and texture before parsing it." isMain={true} category="Particles"/>
