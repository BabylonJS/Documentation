---
title: Loading Particle Systems from JSON File
image: 
description: Learn how to load and parse particle systems from a local json file.
keywords: diving deeper, particles, particle system, json, loading
further-reading:
video-overview:
video-content:
---

## Particle System JSON Files
When using the [particle system editor](/legacy/inspector/particleEditor) there is an option to save the particle system as a local json file that can be loaded and used in any Babylon.js scene. This is useful in sharing particle systems between different scenes as well as updating a particle system quickly. Changing the parameters for a particle system stored locally as a json file allows any scene using that particle system to be updated immediately without the need to manage the snippet ID referenced by any scene.

## Loading the JSON file
The [Asset Manager](/features/featuresDeepDive/importers/assetManager) offers flexibility and power in loading the multiple files needed for particle systems - such as particle textures and particle system JSON files - at once. Simply add a new [TextFileAssetTask](/features/featuresDeepDive/importers/assetManager#textfileassettask) for each particle system file that needs to be loaded.

```javascript
const assetsManager = new BABYLON.AssetsManager(scene);
const particleFile = assetsManager.addTextFileTask("my particle system", "particleSystem.json");

// load all tasks
assetsManager.load();


```
Create a new `TextFileTask` for each particle system that needs to be loaded. The great thing about the Asset Manager is that it will load each file in sequence and then send a callback once all of the loading is done. Since most effects are made up of several particle systems, the Asset Manager will help quickly and efficiently load each file before parsing. 

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

- **json**: The json file to parse.
- **scene**: The scene or engine within which to create the particle system.
- **rootURL**: The root URL to load dependencies like the particle texture.
- **doNotStart**: Boolean to determine if the particle system should automatically start. This overrides the autostart parameter contained in the particle system JSON.
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

live example: <Playground id="#9Y10LR" title="Loading particle system from file" description="Simple example using Asset Manager to load a particle system and texture before parsing it" isMain={true} category="Particles"/>

