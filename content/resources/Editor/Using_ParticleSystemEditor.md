# Introduction
Introduced in the version 3.1.0, a new tool is available to edit custom particle system sets.
More informations about particle systems set here: [https://doc.babylonjs.com/how_to/particlehelper#particlesystemset](https://doc.babylonjs.com/how_to/particlehelper#particlesystemset).

A set of particle systems is done to handle a collection of systems that can be played all together according to their properties (start time, end time etc.).
The Editor provides a tool named **Particle System Creator** that allows to create sets and add / edit / remove systems from these sets.

The workflow tends to:
* create a set
* add / edit / remove systems in set
* preview
* modify
* preview
* modify
* preview
* etc. until the set fits the wanted result

# Demo
Here is a live demo using the Particle System Creator tool:

<iframe width="560" height="315" src="https://www.youtube.com/embed/FyCGTVNchQU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

# Creating a new set
To add a new set you'll edit using the **Particle System Creator** tool, you first have to add a new set in the assets library.
In the assets panel, a tab named **Particles** shows you all the available particle system sets in the current project.

To add a new set, just click the button **Add** and give it a name. Once confirmed, a new set is available.

Example, a set named **maki**:
![AddingNewSet](/img/extensions/Editor/CreatingParticleSystemSet/AddingNewSet.png)

To load the **Particle System Creator**, just double-click on the asset and the tool will open and load the selected particle system set.
![OpeningSet](/img/extensions/Editor/CreatingParticleSystemSet/OpeningSet.png)

# Using the timeline
The tool is set of two panels:
* The timeline
* The realtime preview

The timeline is used to visualize easily when systems will be started (in milliseconds) once the set has been started.
For each system in the timeline, you can drag'n'drop horizontally to change the delay (in milliseconds) until the system starts once the set has been started.

The overall timeline can also be drag'n'dropped to translate its content by drag'n'dropping the timeline's background.
Using the mouse scroll, you can zoom/unzoom the time scale of the timeline.

Example drag'n'dropping the **New Particle System** system to 2 seconds (2000 ms):
![UsingTimeline](/img/extensions/Editor/CreatingParticleSystemSet/UsingTimeline.png)

# Editing a system
Still using the timeline, when you click a system, the Editor's Inspector will be updated to show the selected particle system's properties.
When you modify a property, the result is applied in the realtime preview panel of the tool.

The set is saved automatically.

# Adding a new system to the set
By default, a new set is composed of a default system. Fortunately, you can add new systems to the set.
To add a new system, just click the tool's toolbar **Add System...**. A dialog will appear to ask the new system's name. Once confirmed, the timeline is updated and a new row is created with the new system.

You can now edit the new system.

Example by adding a new system named **awesome system**:
![AddNewSystem](/img/extensions/Editor/CreatingParticleSystemSet/AddNewSystem.png)

# Removing a system from the set
Hopefully, you can also remove a system from the set. Just right-click on the system in the timeline and select **Remove** in the context menu.

**Note: Undo/Redo is not yet supported in the tool, be careful before removing any system.**

![RemovingSystem](/img/extensions/Editor/CreatingParticleSystemSet/RemovingSystem.png)

# Previewing the set
Once you are happy with the current configuration of the set, you can preview the result by clicking on the tool's toolbar **Reset**.
This will stop all the active systems and restart the set.

Once started, the timeline's cursor (reading head) will show the current progress in time of the set. Each time a system is started, the system in timeline will be animated to visually notify that it started.

# Exporting a set
The current set being edited can be exported. It is typically useful to re-use later in other projects or to populate a collection of particle system sets.

To export a set and sanve on the local file system, just click the tool's toolbar **Export As...**.

![ExportAsToolbar](/img/extensions/Editor/CreatingParticleSystemSet/ExportAsToolbar.png)

A dialog will appear to ask if the exported set should embed the textures content:
* If yes, the set will consist of a `.json` file containing te set's configuration and the textures data embedded as base64
* If no, the set will consist of a `.json` file containing the set's configuration and a `textures` folder containing the textures.

Embedding textures means that the `.json` file will grow faster than separating to multiple files while separating to multiple files allows incremental loading that can be useful in some cases.

![ExportAs](/img/extensions/Editor/CreatingParticleSystemSet/ExportAs.png)

# Importing from a set
In case of you have already exported a set, it is possible to import systems from a saved set to the current set being modified in the **Particle System Creator** tool.
To import a set, just click the tool's toolbar **Import From...**. A dialog will appear to select the set's `.json` file to import.

![ImportFromToolbar](/img/extensions/Editor/CreatingParticleSystemSet/ImportFromToolbar.png)

Once confirmed, all the systems and textures will be imported to the current set.

# Loading from a preset
BabylonJS provides a list of already built sets: [https://doc.babylonjs.com/how_to/particlehelper#available-effects](https://doc.babylonjs.com/how_to/particlehelper#available-effects).
It's useful to start from these presets as they are also good examples to understand how to build a cool particle system set.

**Note: an internet connection is required to load the following presets.**

The **Particle System Creator** allows to download these presets using the tool's toolbar **Presets**. Once clicked, let's choose the wanted preset.
A dialog will appear to ask if you want to override the current set:
* Clicking "Yes" means that the current set will be cleared to add only the preset.
* Clicking "No" will just close the dialog and will not apply the preset.

![PresetOverride](/img/extensions/Editor/CreatingParticleSystemSet/PresetOverride.png)

Example with the explosion preset: [https://www.babylonjs-playground.com/#X37LS1#3](https://www.babylonjs-playground.com/#X37LS1#3)

![ExplosionPreset](/img/extensions/Editor/CreatingParticleSystemSet/ExplosionPreset.png)

# Adding a set to the current scene
Once the set is finalized, you can instantiate the set in the scene.
To instantiate a set in the scene, just drag'n'drop the asset from the assets panel to the scene preview. The set will be created with:
* An empty mesh containing all the particle systems. The mesh will have the set's name.
* All particle systems as children of the empty mesh.

**Note: editing a set using the tool will not edit the systems already instanced in the scene.**

