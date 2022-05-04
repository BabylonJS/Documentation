---
toc-levels: 0
---

# What's new

## 5.0.0

### Major updates

- Infinite Morph Targets: When supported (WebGL2+) you are no more limited to 4 morph targets per mesh ([Deltakosh](https://github.com/deltakosh))
- Added Animation Curve Editor to allow easy animation creation and update ([Deltakosh](https://github.com/deltakosh))
- Added support for ConditionalBlock for NodeMaterial ([Deltakosh](https://github.com/deltakosh))
- Improved performance when using the shadow / cascacaded shadow generator ([Popov72](https://github.com/Popov72))
- Add support for up to 6 uv sets in the standard, PBR and node materials ([Popov72](https://github.com/Popov72))
- Added GUI Editor to easily build GUI controls ([msDestiny14](https://github.com/msDestiny14)) ([darraghjburke](https://github.com/darraghjburke))
- Added support for Order Independent Transparency on simple scenes. `scene.useOrderIndependentTransparency = true` now makes transparent meshes shade correctly when stacked onto each other. ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added vertex animation textures with `BakedVertexAnimationManager` ([brunobg](https://github.com/brunobg), [Popov72](https://github.com/Popov72), [raggar](https://github.com/raggar))
- Added `MaterialPluginManager` ([brunobg](https://github.com/brunobg), [Popov72](https://github.com/Popov72))
- Official support of WebGPU ([Popov72](https://github.com/Popov72))
- Added Performance Profiler to allow tracking of Performance metrics ([carolhmj](https://github.com/carolhmj))

### Updates

- Add Geodesic and Goldberg Polyhedra ([JohnK](https://github.com/BabylonJSGuide/))

#### General

- Added `getTextureByName` to `Scene` ([BlakeOne](https://github.com/BlakeOne))
- Added `getControlsByType` to `AdvancedDynamicTexture` ([BlakeOne](https://github.com/BlakeOne))
- Added `zoomToMouseLocation` on `ArcRotateCamera` ([lovettchris](https://github.com/lovettchris))
- Added static CenterToRef for vectors 2/3/4 ([aWeirdo](https://github.com/aWeirdo))
- Added ability to view images (ktx2, png, jpg) to the sandbox. ([bghgary](https://github.com/bghgary))
- Added optional smoothed normals for extruded procedural polygons. ([snagy](https://github.com/snagy))
- Added support for infinite perspective cameras ([Deltakosh](https://github.com/deltakosh))
- Added ability to enable/disable `ArcRotateCamera` zoom on multiTouch event ([NicolasBuecher](https://github.com/NicolasBuecher))
- Moving button to shared uI folder.([msDestiny14](https://github.com/msDestiny14))
- Added `collisionRetryCount` to improved collision detection ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added color/instance color differenciation in shaders for thin instances ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added sleepBody support for ammojs ([CedricGuillemet](https://github.com/CedricGuillemet)
- Moved sharedUI component to shared UI folder. ([msDestiny14](https://github.com/msDestiny14))
- Added `encapsulate` and `encapsulateBoundingInfo` methods to `BoundingInfo`. ([Tolo789](https://github.com/Tolo789))
- Added `onLoadObservable` to the `TextureDome` class(es) ([RaananW](https://github.com/RaananW))
- Modified `InputManager` to use `DeviceSourceManager` ([PolygonalSun](https://github.com/PolygonalSun))
- Added a [helper class](https://doc.babylonjs.com/typedoc/classes/babylon.debug.directionallightfrustumviewer) to display the frustum of a directional light ([Popov72](https://github.com/Popov72))
- Improved collision detection performance ([ottoville](https://github.com/ottoville/))
- Added new helper functions for `Quaternion.FromLookDirection` and `Matrix.LookDirection` ([Alex-MSFT](https://github.com/Alex-MSFT))
- Added support for clip planes to the edge renderer ([#10053](https://github.com/BabylonJS/Babylon.js/issues/10053)) ([Popov72](https://github.com/Popov72))
- Added support for [cannon-es](https://github.com/pmndrs/cannon-es) to the cannonJSPlugin. ([frankieali](https://github.com/frankieali))
- Added check for duplicates in `ShadowGenerator.addShadowCaster` ([ivankoleda](https://github.com/ivankoleda))
- Added observable for `PointerDragBehavior` enable state ([cedricguillemet](https://github.com/cedricguillemet))
- Added `targetHost` to query and set targeted mesh with `ArcRotateCamera` ([cedricguillemet](https://github.com/cedricguillemet))
- Added optional `preserveScalingSign` to `addChild` and `setParent` to keep scaling sign ([cedricguillemet](https://github.com/cedricguillemet))
- Spelling of function/variables `xxxByID` renamed to `xxxById` to be consistent over the project. Old `xxxByID` reamain as deprecated that forward to the corresponding `xxxById` ([barroij](https://github.com/barroij))
- Added new reflector tool that enable remote inspection of scenes. ([bghgary](https://github.com/bghgary))
- Update `createPickingRay` and `createPickingRayToRef` matrix parameter to be nullable. ([jlivak](https://github.com/jlivak))
- Improved scene picking precision with huge values in world matrices when `Mesh.EnableDistantPicking` flag is true ([CedricGuillemet](https://github.com/CedricGuillemet)
- Added `applyVerticalCorrection` and `projectionPlaneTilt` to perspective cameras to correct perspective projections ([CraigFeldspar](https://github.com/CraigFeldspar))
- Support rotation keys in universal camera ([Sebavan](https://github.com/sebavan))
- Added flag to allow users to swap between rotation and movement for single touch on FreeCameraTouchInput ([PolygonalSun](https://github.com/PolygonalSun))
- Added the ability to load a fullscreen GUI from the snippet server ([PirateJC](https://github.com/piratejc))
- Added `ArcThru3Points` to `Curve3` ([JohnK](https://github.com/BabylonJSGuide/))
- Updated the gravity parameter in `Scene.enablePhysics()` as optional to fit the current behaviour ([Faber](https://https://github.com/Faber-smythe))
- Allow the possibility to override the radius delta calculation for mouse wheel event ([RaananW](https://github.com/RaananW))
- Modified behavior for FreeCamera and ArcRotateCamera so that default mouse dragging movements now account for what button was used to initiate it ([PolygonalSun](https://github.com/PolygonalSun))
- Added coroutine capabilities to `Observable`s ([syntheticmagus](https://github.com/syntheticmagus))
- Added an `Observable.FromPromise` utility method ([Symbitic](https://github.com/Symbitic))
- Added a global OnTextureLoadErrorObservable to handle texture loading errors during model load ([RaananW](https://github.com/RaananW))
- Add support to encode and decode .env environment textures using WebP instead of PNG ([simonihmig](https://github.com/simonihmig))
- Added a new stereoscopic screen rig camera ([RaananW](https://github.com/RaananW))
- Extended functionality for pointer move with scene pointerMoveTrianglePredicate ([phaselock](https://github.com/lockphase))
- Added the ability to load a GUI from the snippet server and project it onto a mesh ([PirateJC](https://github.com/piratejc))
- Added `mapPanning` on `ArcRotateCamera` ([Hypnosss](https://github.com/Hypnosss))
- Added resetLastInteractionTime() to the auto rotate behavior ([RaananW](https://github.com/RaananW))
- Update `addContainerTask` and `addMeshTask` signatures on `AssetsManager` to allow receiving a File as the sceneFilename argument. ([carolhmj](https://github.com/carolhmj))
- Added `onCreateCustomMeshImpostor` handler for creating custom mesh impostors to support Ammo.btSmoothTriangleMesh. ([MackeyK24](https://github.com/MackeyK24))
- Added `onCreateCustomMeshImpostor` handler for creating mesh impostors with custom vertex data. ([MackeyK24](https://github.com/MackeyK24))
- Added `onCreateCustomConvexHullImpostor` handler for creating convex hull imposters with custom vertex data. ([MackeyK24](https://github.com/MackeyK24))
- Modified touch in `WebDeviceInputSystem` to no longer delete touch points after pointer up. ([PolygonalSun](https://github.com/PolygonalSun))
- Added support for DualSense controllers to DeviceInputSystem. ([PolygonalSun](https://github.com/PolygonalSun))
- Added `getCreationOptions` on `ThinEngine`. ([carolhmj](https://github.com/carolhmj))
- Added `CompatibilityOptions.UseOpenGLOrientationForUV` to define if the system should use OpenGL convention for UVs when creating geometry or loading .babylon files (false by default) ([Deltakosh](https://github.com/deltakosh))
- Added RuntimeError and errorCodes for runtime errors. ([jp833](https://github.com/jp833))
- Added `AutoReleaseWorkerPool` which will automatically terminate idle workers after a specified amount of time and use them in KTX2 and Draco decoders. ([bghgary](https://github.com/bghgary))

#### Engine

- Moved all instance data from `Geometry` to `Mesh` such that the same `Geometry` object can be used by many meshes with instancing. Reduces memory consumption on CPU/GPU. ([breakin](https://github.com/breakin)
- Added `NativeEngine` configuration object parameter. ([drigax](https://github.com/drigax))
- Added `NativeEngine` support for signed byte and unsigned short vertex buffer attribute types ([Alex-MSFT](https://github.com/Alex-MSFT))
- Added support for sRGB buffers, native in WebGL2 / WebGPU and through the `EXT_sRGB` extension in WebGL1. There's a new parameter to the `Texture` constructor that enables this feature ([Popov72](https://github.com/Popov72))
- Added `IAudioEngineOptions` interface to provide the audio engine with a pre-defined Audio Context and audio destination node. ([Vandy](https://github.com/svanderbeck11))
- Added support for cannon-es method `world.removeBody()`. Falls back to cannon method `remove()`. ([Faber](https://https://github.com/Faber-smythe))
- Added support for ZOffset Unit as we currently only supported factor. ([Sebavan](https://github.com/sebavan/)
- Added the option to force the state of sRGB Buffer support ([RaananW](https://github.com/RaananW))

#### Loaders

- Added support for `EXT_meshopt_compression` for glTF loader. ([zeux](https://github.com/zeux))
- Increased `KHR_materials_transmission` render target texture default size. ([Drigax](https://github.com/drigax))
- Changed glTF loader to remove empty animation groups if there are no animation channels loaded with the given options. ([bghgary](https://github.com/bghgary))
- Update glTF validator to `2.0.0-dev.3.3`. ([bghgary](https://github.com/bghgary))
- Added support for `KHR_xmp_json_ld` for glTF loader. ([Sebavan](https://github.com/sebavan/), [bghgary](https://github.com/bghgary))
- Added a `OptimizeNormals` option to the OBJ loader to smooth lighting ([Popov72](https://github.com/Popov72))
- Added a `Prefiltered` option to the `CubeTextureAssetTask` ([MackeyK24](https://github.com/MackeyK24))
- Added support for more uv sets to glTF loader. ([bghgary](https://github.com/bghgary))
- Added support for `KHR_materials_volume` for glTF loader. ([MiiBond](https://github.com/MiiBond/))
- Added support for custom timeout in `WebRequest`. ([jamidwyer](https://github.com/jamidwyer/))
- Added support for direct loading [base64 data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) for all loader ([CoPrez](https://github.com/CoPrez))
- Added `DO_NOT_ALTER_FILE_COORDINATES` flag to STL loader ([AlbertoPa](https://github.com/AlbertoPa))
- Added support for pure geometry files to OBJ loader ([Deltakosh](https://github.com/deltakosh))
- Added an observable for when loader state changed. ([bghgary](https://github.com/bghgary))
- Fixed an issue where errors for loading certain assets (e.g. &lt;20-byte GLBs) are not catchable. ([bghgary](https://github.com/bghgary))
- Added support for `KHR_materials_emissive_strength` for glTF loader. ([sebavan](https://github.com/sebavan))
- Added support for normalized attributes ([#11685](https://github.com/BabylonJS/Babylon.js/issues/11685)) ([RaananW](https://github.com/RaananW))
- Added fallback error logging on mesh loading tasks if no error handler is defined. ([carolhmj](https://github.com/carolhmj))
- Updated the glTF loader to place the skinned mesh as a sibling of the skeleton root node instead of using `skeleton.overrideMesh`. ([bghgary](https://github.com/bghgary))
- Added support for `--bm` bump multiplier to OBJ loader ([brianzinn](https://github.com/brianzinn))

#### Navigation

- Added support for thin instances in navigation mesh creation ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added recast.d.ts definition file for recast.js ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added obstacle support ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added `onReachTargetObservable` observer to notify when agent reaches destination ([CedricGuillemet](https://github.com/CedricGuillemet))

#### Materials

- Added property `useMaxLine` to `GridMaterial`, which affects the brightness of line intersections. ([BlakeOne](https://github.com/BlakeOne))
- Added an `OcclusionMaterial` to simplify depth-only rendering of geometry ([rgerd](https://github.com/rgerd))
- PrePass can now be used in `RenderTargets` speeding up effects like SSAO2 or MotionBlur ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added support for morph targets to `ShaderMaterial` ([Popov72](https://github.com/Popov72))
- Added support for clip planes to the `ShaderMaterial` ([Popov72](https://github.com/Popov72))
- Added support for local cube map to refraction cube texture ([Popov72](https://github.com/Popov72))
- Added the `cullBackFaces` property to `Material` ([Popov72](https://github.com/Popov72))
- Added the `stencil` object property to `Material` ([Popov72](https://github.com/Popov72))
- Set the `metadata` property on `Material` to be serializable, so that it can be properly loaded from .babylon files ([jlivak](https://github.com/jlivak))
- Add `mesh.visibility` support to grid material ([bghgary](https://github.com/bghgary))
- Transform `getAlphaFromRGB` in a property and dirty the materials that use it when it's changed ([carolhmj](https://github.com/carolhmj))
- When `scene.markAllMaterialsAsDirty` is called on `BaseTexture`, only dirty the materials related to that specific texture. ([carolhmj](https://github.com/carolhmj))

#### Meshes

- Added public version of `AbstractMesh` function _getPositionData. ([BlakeOne](https://github.com/BlakeOne))
- Added default options parameter to Create functions. ([BlakeOne](https://github.com/BlakeOne))
- `LineMesh` now allows assigning custom material via `material` setter. ([FullStackForger](https://github.com/FullStackForger)
- `InstancedMesh` can now be sorted from back to front before rendering if the material is transparent ([Popov72](https://github.com/Popov72))
- Add option to decompose the `newWorldMatrix` when passed into `TransformNode.freezeWorldMatrix`. ([bghgary](https://github.com/bghgary))
- Added `mesh.onMeshReadyObservable` to get notified when a mesh is ready ([RaananW](https://github.com/RaananW))
- Added support for morph targets to the mesh `BoundingInfo` refresh. ([EricBeetsOfficial-Opuscope](https://github.com/EricBeetsOfficial-Opuscope))
- Added support for screen coverage in addition to distance for LOds. ([CraigFeldspar](https://github.com/CraigFeldspar))
- Decreased memory usage and improved performance of `Mesh.MergeMeshes`. ([ryantrem](https://github.com/ryantrem))

#### Inspector

- Added support for parsing files saved from ACE to `Animation.ParseFromFileAsync` ([BlakeOne](https://github.com/BlakeOne))
- Increased float precision to 4 ([msDestiny14](https://github.com/msDestiny14))
- Added support for sounds in the inspector ([Deltakosh](https://github.com/deltakosh))
- Added a debug option to show the frustum of a directional light ([Popov72](https://github.com/Popov72))
- Added support for the material stencil properties ([Popov72](https://github.com/Popov72))
- Added space + LMB panning to texture inspector to improve accessibility ([darraghjburke](https://github.com/darraghjburke))
- Add support to export .env environment textures using WebP ([simonihmig](https://github.com/simonihmig))
- ACE usability improvements and addition of new Step Tangent interpolation. ([carolhmj](https://github.com/carolhmj))
- When user hits the "New Key" button on ACE but a key already exists on that frame, update existing frame's values instead of creating a new one. ([carolhmj](https://github.com/carolhmj))
- Added live connection to GUI editor ([darraghjburke](https://github.com/darraghjburke))
- Add `getAlphaFromRGB` checkbox on Texture view ([carolhmj](https://github.com/carolhmj))
- Make sure popups are closed when page refreshes ([RaananW](https://github.com/RaananW))

#### Playground

- Start render loop before creating scene to make stopping it more convenient ([BlakeOne](https://github.com/BlakeOne))
- Added tooltips for menubar buttons ([darraghjburke](https://github.com/darraghjburke))
- Fixed squiggles not working for deprecated members ([sailro](https://github.com/sailro))
- Removed legacy code for formatting deprecated members display ([sailro](https://github.com/sailro))
- Fixed deprecated members info display ([sailro](https://github.com/sailro))
- Added support for experimental/beta members ([sailro](https://github.com/sailro))

#### NME

- Added a `MaterialAlpha` block to read material's alpha value ([Deltakosh](https://github.com/Deltakosh))
- Added a `CloudBLock` block to create noise based cloud data ([Deltakosh](https://github.com/Deltakosh))
- Updated the VectorMerger and ColorMerger blocks to support swizzling ([Deltakosh](https://github.com/Deltakosh))
- Added a `ImageSource` block to factorize access to texture data ([Deltakosh](https://github.com/Deltakosh))
- Increased float precision to 4 ([msDestiny14](https://github.com/msDestiny14))
- Added ability to make input node's properties visible in the properties of a custom frame ([msDestiny14](https://github.com/msDestiny14))
- NME `TextureBlock`: add an output for the texture level and a switch to disable the internal multiplication (level * texture) ([#10192](https://github.com/BabylonJS/Babylon.js/pull/10192)) ([rassie](https://github.com/rassie))
- Added support for parallax / parallax occlusion to the `PerturbNormal` block ([Popov72](https://github.com/Popov72))
- Added a `SceneDepth` block to access the scene depth buffer ([Popov72](https://github.com/Popov72))
- Added support for custom blocks ([BlakeOne](https://github.com/BlakeOne), [Popov72](https://github.com/Popov72))
- Added a `ClipPlanes` block to support scene clip planes ([Popov72](https://github.com/Popov72))
- Added `ElbowBlock` to let users control the graph organization ([Deltakosh](https://github.com/Deltakosh))

#### GUI

- Added moving GUI controls to a non-overlapping position function called `moveToNonOverlappedPosition` in `AdvancedDynamicTexture`([RolandCsibrei](https://github.com/RolandCsibrei))
- Allow Chrome to copy the GUI snippet id to the clipboard ([BlakeOne](https://github.com/BlakeOne))
- Added a `FocusableButton` gui control to simplify creating menus with keyboard navigation ([Flux159](https://github.com/Flux159))
- Added `focus()` and `blur()` functions for controls that implement `IFocusableControl` ([Flux159](https://github.com/Flux159))
- Added `ToggleButton` GUI control ([kintz09](https://github.com/kintz09))
- Added shorthand methods which set all padding values at once, named `setPadding` and `setPaddingInPixels`, to the control class ([kintz09](https://github.com/kintz09))
- Added two touch-enabled GUI controls, `TouchMeshButton3D` and `TouchHolographicButton`. `TouchMeshButton3D`'s near interaction mesh can be customized with the `collisionMesh` property ([rickfromwork](https://github.com/rickfromwork), [satyapoojasama](https://github.com/satyapoojasama))
- Added `imageWidth()` and `imageHeight()` to access the source image dimensions of `Image` ([Queatz](https://github.com/Queatz))
- Added a `FluentButtonMaterial` to give the `TouchHolographicButton` the same look and feel as the HoloLens 2 shell ([rgerd](https://github.com/rgerd))
- Added property `renderToIntermediateTexture` to `Container` which when set to true, will render children to an intermediate texture rather than direct to host allowing for DOM style alpha blending ([BlindingHues](https://github.com/blindinghues))
- Added `HolographicSlate` GUI control ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `HolographicBackplate` to serve as a flexible panel in GUI controls using the MRTK design language ([rgerd](https://github.com/rgerd))
- Added `NearMenu` GUI control ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `HandMenu`, a simple menu that uses `HandConstraintBehavior` ([CraigFeldspar](https://github.com/CraigFeldspar))
- `VolumeBasedPanel`'s constructor now accepts a name parameter, similar to other controls ([rickfromwork](https://github.com/rickfromwork))
- Added `loadLayoutAsync` in the `XmlLoader`. Now the layouts can be loaded asynchronously rather than providing a callback.
- Introduced a new opt-in property to `Gui3DManager`, `useRealisticScaling`, that will automatically scale 3D GUI components like buttons to MRTK standards for better sizing in XR experiences. ([rickfromwork](https://github.com/rickfromwork))
- Added support for full screen UI and rig cameras ([#11544](https://github.com/BabylonJS/Babylon.js/issues/11544)) ([RaananW](https://github.com/RaananW))
- Added ValueAndUnit change observable and Grid to listen for changes ([brianzinn](https://github.com/brianzinn))
- Added `closeShape` and `closePath` as extra options parameters in `ExtrudeShape` and `ExtrudeShapeCustom` ([JohnK](https://github.com/BabylonJSGuide))
- Added `markAsDirty` and `markAllAsDirty` public functions on `Control` ([carolhmj](https://github.com/carolhmj))

#### Behaviors

- Added `onTargetFramingAnimationEndObservable` to `FramingBehavior` ([BlakeOne](https://github.com/BlakeOne))
- Added `FollowBehavior`, a behavior that makes the assigned mesh hover around a camera, while facing it ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `SurfaceMagnetismBehavior`, a behavior that makes the assigned mesh stick on surfaces of other meshes ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `DefaultBehavior`, a behavior that will be common to several 3D GUI controls, orchestrating `SixDoFDragBehavior`, `FollowBehavior` and `SurfaceMagnetismBehavior` ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `draggableMeshes` property in `SixDoFDragBehavior` list in order to have only a subset of descendant meshes take pointer events into account ([CraigFeldspar](https://github.com/CraigFeldspar))
- `SixDoFDragBehavior` can now handle multiple pointers at the same time to scale/rotate the owner mesh ([CraigFeldspar](https://github.com/CraigFeldspar))
- Added `HandConstraintBehavior`, to make the assigned mesh follow the hand pose. This behavior requires to be linked to a XR experience with the `HandTracking` feature activated. ([CraigFeldspar](https://github.com/CraigFeldspar))
- Updated `SixDofDragBehavior` and `PointerDragBehavior` to respond to grabs made with the `WebXRNearInteraction` feature ([rickfromwork](https://github.com/rickfromwork))
- Updated `SixDofDragBehavior` to support XR motion controller specific rotation options when one is used, allowing for 1:1 mesh rotation with controllers ([rickfromwork](https://github.com/rickfromwork))
- Added `TextWrapping.WordWrapEllipsis` mode to textblock ([mysunnytime](https://github.com/mysunnytime))

#### WebXR

- A browser error preventing the emulator to render scene is now correctly dealt with ([RaananW](https://github.com/RaananW))
- Added a way to extend the XRSessionInit Object from inside of a feature ([RaananW](https://github.com/RaananW))
- Added image tracking feature ([RaananW](https://github.com/RaananW))
- Pointer Events of WebXR controllers have pointerType `xr` ([RaananW](https://github.com/RaananW))
- better support for custom hand meshes ([RaananW](https://github.com/RaananW))
- Allow disabling of the `WebXRControllerPointerSelection` feature as part of the WebXR Default Experience ([rgerd](https://github.com/rgerd))
- Added two touch-enabled GUI controls, `TouchMeshButton3D` and `TouchHolographicButton`, added option on the WebXR hand tracking feature for enabling touch collisions ([rickfromwork](https://github.com/rickfromwork), [satyapoojasama](https://github.com/satyapoojasama))
- Added initial support for the `sessiongranted` event ([#9860](https://github.com/BabylonJS/Babylon.js/issues/9860)) ([RaananW](https://github.com/RaananW))
- Remove the warning for input source not found when in (touch)screen mode ([#9938](https://github.com/BabylonJS/Babylon.js/issues/9938)) ([RaananW](https://github.com/RaananW))
- Fixed an issue with resources disposal when exiting XR ([#10012](https://github.com/BabylonJS/Babylon.js/issues/10012)) ([RaananW](https://github.com/RaananW))
- Added observable to target mesh position update for teleportation ([#9402](https://github.com/BabylonJS/Babylon.js/issues/9402)) ([RaananW](https://github.com/RaananW))
- Prevent the XR render target texture from rescaling when using the scene optimizer ([#10135](https://github.com/BabylonJS/Babylon.js/issues/10135)) ([RaananW](https://github.com/RaananW))
- Force https when using WebXR except for when hostname is localhost ([#10154](https://github.com/BabylonJS/Babylon.js/issues/10154)) ([RaananW](https://github.com/RaananW))
- Use the newly-introduced physics velocities of controllers/headset where available ([#10118](https://github.com/BabylonJS/Babylon.js/issues/10118)) ([RaananW](https://github.com/RaananW))
- Added support for `xr-dom-overlay` ([#8996](https://github.com/BabylonJS/Babylon.js/issues/8996)) ([brianzinn](https://github.com/brianzinn))
- Added near interaction events (hover, grab, and near-pick) ([satyapoojasama](https://github.com/satyapoojasama))
- Added XR Movement Controller feature for ([#7442](https://github.com/BabylonJS/Babylon.js/issues/7442)) ([brianzinn](https://github.com/brianzinn))
- Added initial support for `light-estimation` ([#8904](https://github.com/BabylonJS/Babylon.js/issues/8904)) ([brianzinn](https://github.com/brianzinn)) ([RaananW](https://github.com/RaananW))
- Fixed an issue with superfluous reloading of the hand tracking models ([#10453](https://github.com/BabylonJS/Babylon.js/issues/10453)) ([rgerd](https://github.com/rgerd))
- Added support for XRFrame.fillPoses and XRFrame.fillJointRadii ([#10454](https://github.com/BabylonJS/Babylon.js/issues/10454)) ([rgerd](https://github.com/rgerd))
- Improved functionality of `WebXRNearInteraction` and updated coverage to be enabled on Behaviors and Gizmos ([rickfromwork](https://github.com/rickfromwork))
- Introduced framework support for XR-based eye tracking. XR eye tracking is not yet supported in webXR, but is supported in BabylonNative using OpenXR. ([rickfromwork](https://github.com/rickfromwork))
- Introduced spectator mode for desktop VR experiences and fixed an issue with XR camera in the activeCameras array ([#10560](https://github.com/BabylonJS/Babylon.js/issues/10560)) ([RaananW](https://github.com/RaananW))
- Initial support for WebXR camera parenting ([#10593](https://github.com/BabylonJS/Babylon.js/issues/10593)) ([RaananW](https://github.com/RaananW))
- Fix ReflectionProbe for WebXR ([#10390](https://github.com/BabylonJS/Babylon.js/issues/10390)) ([RaananW](https://github.com/RaananW))
- Fix error on XR dispose due to undefined sepectator camera ([Alex-MSFT](https://github.com/Alex-MSFT))
- Support for WebXR Foveated rendering ([#8920](https://github.com/BabylonJS/Babylon.js/issues/8920)) ([RaananW](https://github.com/RaananW))
- Support WebXR framerate update ([#10912](https://github.com/BabylonJS/Babylon.js/issues/10912)) ([RaananW](https://github.com/RaananW))
- Detach the non-vr camera from the canvas when entering XR and re-attach when leaving ([RaananW](https://github.com/RaananW))
- New experimental walking locomotion feature for VR sessions ([syntheticmagus](https://github.com/syntheticmagus))
- Updated `SixDofDragBehavior` to support XR motion controller specific rotation options when one is used, allowing for 1:1 mesh rotation with controllers ([rickfromwork](https://github.com/rickfromwork))
- Allow customizing the selection and laser point meshes of the pointer selection feature ([#11487](https://github.com/BabylonJS/Babylon.js/issues/11487)) ([RaananW](https://github.com/RaananW))
- Add the `WebXRLayers` feature to support rendering to an `XRProjectionLayer` ([#10588](https://github.com/BabylonJS/Babylon.js/issues/10588)) ([rgerd](https://github.com/rgerd))
- Introduced a new opt-in property to `Gui3DManager`, `useRealisticScaling`, that will automatically scale 3D GUI components like buttons to MRTK standards for better sizing in XR experiences. ([rickfromwork](https://github.com/rickfromwork))
- Add `NativeXRPlugin` and `NativeXRFrame` to improve XR performance on BabylonNative ([rgerd](https://github.com/rgerd))
- Reset XR Camera's orientation when entering an AR session for consistent experience ([RaananW](https://github.com/RaananW))
- Enable multiview rendering to `XRProjectionLayer` with texture type "texture-array" ([#10767](https://github.com/BabylonJS/Babylon.js/issues/10767)) ([rgerd](https://github.com/rgerd))

#### Gizmos

- Exposed `scaleDragSpeed` and added `axisFactor` for `BoundingBoxGizmo` ([CedricGuillemet](https://github.com/CedricGuillemet))
- Provide additional attribute `customRotationQuaternion` to customize the posture of the gizmo ([ecojust](https://github.com/ecojust))
- Exposed `scaleRatio` for `GizmoManager` ([CedricGuillemet](https://github.com/CedricGuillemet))
- Added constructor parameters to customize colors for rotation gizmos on `RotationGizmo` ([jekelija](https://github.com/jekelija))
- Added constructor parameters to allow turning off `updateScale` on RotationGizmo ([jekelija](https://github.com/jekelija))
- Dispose `_dragPlane` when detaching in `PointerDragBehavior` ([CedricGuillemet](https://github.com/CedricGuillemet))
- Log warning when trying to attach a node to a `LightGizmo` ([CedricGuillemet](https://github.com/CedricGuillemet))
- Inspector autopicking is in sync with `GimoManager` autopicking ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fixed wrong matrix with nodes having pivot point ([CedricGuillemet](https://github.com/CedricGuillemet))
- `validateDrag` support added to `AxisDragGizmo` ([CedricGuillemet](https://github.com/CedricGuillemet))
- Gizmos that have draggable components now support near interactions via `WebXRNearInteraction` ([rickfromwork](https://github.com/rickfromwork))

#### Viewer

- Fixed an issue with dual callback binding in case of a forced redraw ([#9608](https://github.com/BabylonJS/Babylon.js/issues/9608)) ([RaananW](https://github.com/RaananW))

#### Math

- Faster scalar's WithinEpsilon with Math.abs ([nekochanoide](https://github.com/nekochanoide))
- Added `decomposeToTransformNode` ([RaananW](https://github.com/RaananW))

#### Serializers

- Serialize and parse isEnabled property for lights and cameras  ([andreasplesch](https://github.com/andreasplesch))
- Added the `exportUnusedUVs` property to the `IExportOptions` interface that will prevent any unused vertex uv attributes from being stripped during the glTF export. ([ericbroberic](https://github.com/ericbroberic))
- glTF serializer now supports `KHR_materials_clearcoat` ([drigax](https://github.com/drigax))
- Fixed bug where characters that didn't fit into a single UTF-16 code point were not correctly encoded in .glb exports ([darraghjburke](https://github.com/darraghjburke))
- Serialize and parse now use unique IDs for materials, so duplicate names won't cause problems. Still supports parsing id for back compat ([darraghjburke](https://github.com/darraghjburke))
- glTF exporter now supports camera export ([daoshengmu](https://github.com/daoshengmu))

### Bugs

- Fix `WaterMaterial`’s constructor to use `this.getScene()` instead of `scene` parameter ([BlakeOne](https://github.com/BlakeOne))
- Add missing param `point` to the callback function's type for the methods `registerOnPhysicsCollide` and `unregisterOnPhysicsCollide` of the `PhysicsImpostor` class. ([BlakeOne](https://github.com/BlakeOne))
- Fix serialization and parsing of `textBlock` and `image` for `Button` class ([BlakeOne](https://github.com/BlakeOne))
- Fix for `AdvancedTimer` ignoring `timeout` option ([BlakeOne](https://github.com/BlakeOne))
- Fix issue when `AssetContainer` is added to `Scene` multiple times ([BlakeOne](https://github.com/BlakeOne))
- Fix issue when `ParticleSystem` is disposed before `_subEmitters` is created ([BlakeOne](https://github.com/BlakeOne))
- Fix incorrect GUI.TextBlock width when resizeToFit is true & fontStyle is italic ([Kalkut](https://github.com/Kalkut))
- Fix CubeTexture extension detection when rootUrl has a query string ([civa86](https://github.com/civa86))
- Fix issue with the Promise polyfill where a return value was expected from resolve() ([Deltakosh](https://github.com/deltakosh))
- Fix ArcRotateCamera panning with axis decomposition ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix negative scale support for physics impostors ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix `deltaPosition` with ammoJS ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix an issue with keyboard control (re)attachment. ([#9411](https://github.com/BabylonJS/Babylon.js/issues/9411)) ([RaananW](https://github.com/RaananW))
- Fix issue when scaling is reapplied with BoundingBoxGizmo and GizmoManager ([CedricGuillemet](https://github.com/CedricGuillemet)
- Fix direct loading of a glTF string that has base64-encoded URI. ([bghgary](https://github.com/bghgary))
- Fix capsule impostor size computation for ammojs ([CedricGuillemet](https://github.com/CedricGuillemet)
- Fix passing rootUrl when loading NodeMaterial and nested asset URL ([CedricGuillemet](https://github.com/CedricGuillemet)
- Fix compound shapes for CannonJS plugin ([cedricguillemet](https://github.com/cedricguillemet))
- Fix crash of some node materials using instances on iOS ([Popov72](https://github.com/Popov72))
- Fix the code generated for the NME gradient block ([Popov72](https://github.com/Popov72))
- Fix ssao2RenderingPipeline for orthographic cameras ([Kesshi](https://github.com/Kesshi))
- Fix mipmaps creation in the KTX2 decoder for non square textures ([Popov72](https://github.com/Popov72))
- Fix detail map not working in WebGL1 ([Popov72](https://github.com/Popov72))
- Fix ArcRotateCamera behaviour when panning is disabled on multiTouch event ([NicolasBuecher](https://github.com/NicolasBuecher))
- Fix vertically interlaced stereoscopic rendering (`RIG_MODE_STEREOSCOPIC_INTERLACED`) not working (follow-up [#7425](https://github.com/BabylonJS/Babylon.js/issues/7425), [#8000](https://github.com/BabylonJS/Babylon.js/issues/8000)) ([foxxyz](https://github.com/foxxyz))
- Fix accessibility of BaseCameraMouseWheelInput and BaseCameraPointersInput. They appear in documentation but were not available for include. ([mrdunk](https://github.com/mrdunk))
- Fix function creation inside regularly called freeCameraMouseWheelInput method leading to excessive GC load. ([mrdunk](https://github.com/mrdunk))
- Fix clip plane not reset to the rigth value when using mirrors ([Popov72](https://github.com/Popov72))
- Fix lens flares not working in right handed system ([Popov72](https://github.com/Popov72))
- Fix canvas not resized correctly in a multi-canvas scenario ([Popov72](https://github.com/Popov72))
- Fix NaN values returned by `GetAngleBetweenVectors` when vectors are the same or directly opposite ([Popov72](https://github.com/Popov72))
- Fix 404 occurring on some pictures in some cases when using particle systems ([Popov72](https://github.com/Popov72))
- Fix PrePass bugs with transparency ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix PrePass bugs with layers ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix SSAO2 with PrePass sometimes causing colors brighter than they should be ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix PostProcess sharing between cameras/renderTargets, that would create/destroy a texture on every frame ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix for DualSense gamepads being incorrectly read as DualShock gamepads ([PolygonalSun](https://github.com/PolygonalSun))
- Fix for warning in chrome about passive wheel events ([#9777](https://github.com/BabylonJS/Babylon.js/pull/9777)) ([kaliatech](https://github.com/kaliatech))
- Fix crash when cloning material in `AssetContainer.instantiateModelsToScene` when mesh is an instanced mesh ([Popov72](https://github.com/Popov72))
- Fix Normalized quaternion when updating the node components ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix update absolute position before use in PointerDragBehavior ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix issue with NinePatch displaying half pixel gaps between slices on Firefox browsers. ([Pryme8](https://github.com/Pryme8))
- Fix issue when canvas loses focus while holding a pointer button ([PolygonalSun](https://github.com/PolygonalSun))
- Fix issue where camera controls stay detached if PointerDragBehavior is disabled prematurely ([PolygonalSun](https://github.com/PolygonalSun))
- Fix uncatchable exception that could be thrown when initializing the environment textures ([CoPrez](https://github.com/CoPrez))
- Fix the triplanar material when the position of the mesh it is applied to is not (0,0,0) ([Popov72](https://github.com/Popov72))
- Fix bones serialization to include their ids. This allows to retrieve bones (animation groups, etc.) once the scene has been re-serialized ([julien-moreau](https://github.com/julien-moreau))
- Fix an issue with hand-detachment when using hand tracking in WebXR ([#9882](https://github.com/BabylonJS/Babylon.js/issues/9882)) ([RaananW](https://github.com/RaananW))
- Fix issue with cursor and 'doNotHandleCursors' on GUI ([msDestiny14](https://github.com/msDestiny14))
- Fix issue with multi-views when using a transparent scene clear color ([Popov72](https://github.com/Popov72))
- Fix issue with multi-views when using a hardware scaling level different from 1 ([Popov72](https://github.com/Popov72))
- Fix matrix update for `PointerDragBehavior` and mesh with pivot ([cedricguillemet](https://github.com/cedricguillemet))
- Fix thin instances + animated bones not rendered in the depth renderer ([Popov72](https://github.com/Popov72))
- Fix issue with WebXR teleportation logic which would cause positional headlocking on teleporation frames ([syntheticmagus](https://github.com/syntheticmagus))
- Fix for GUI renderAtIdealSize ([msDestiny14](https://github.com/msDestiny14))
- Fix the strength input parameter of the NME `PerturbNormal` block that was handled as a 1/strength value ([Popov72](https://github.com/Popov72))
- Fix an issue with audio engine not being garbage-collected when engine is disposed ([RaananW](https://github.com/RaananW))
- Fix deprecated audio methods setPosition/setOrientation with new position/orientation values ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix the NME `NormalBlend` block ([Popov72](https://github.com/Popov72))
- Fix Compatibility with NPM 7 ([Sebavan](https://github.com/sebavan))
- Fix for cloning meshes for 3D GUIs ([msDestiny14](https://github.com/msDestiny14))
- Fix computation of min/max values in glTF loader when using normalized integers ([#10112](https://github.com/BabylonJS/Babylon.js/issues/10112)) ([Popov72](https://github.com/Popov72))
- Fix instance picking when in billboard mode ([Popov72](https://github.com/Popov72))
- Fix NME generation code missing `target` and `visibleInInspector` properties ([Popov72](https://github.com/Popov72))
- Fix transmission mask being accidently used in glTF volume materials ([MiiBond](https://github.com/MiiBond/))
- Fix `Scene.getPointerOverMesh` returning disposed mesh ([Popov72](https://github.com/Popov72))
- Fix NME `TextureBlock` to use correct transformed UV coordinates when reading from the texture ([#10176](https://github.com/BabylonJS/Babylon.js/issues/10176)) ([Popov72](https://github.com/Popov72))
- Fix context lost handling ([#10163](https://github.com/BabylonJS/Babylon.js/issues/10163)) ([Popov72](https://github.com/Popov72))
- Fix for GUI slider step values greater than one ([msDestiny14](https://github.com/msDestiny14))
- Fix Instances wrongly rendered with motion blur ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix for wrongly rendered GUI rectangle on resize with adaptWidthToChildren ([msDestiny14](https://github.com/msDestiny14))
- Fix glTF loader promise stuck when runs on non-json data ([mrlika](https://github.com/mrlika))
- Fix for namepsace sharing in .scss files; PropertyTab, SceneExplorer ([msDestiny14](https://github.com/msDestiny14))
- Fix sprites not displayed in certain cases ([Popov72](https://github.com/Popov72))
- Fix undefined camera pose in WebXR in Babylon Native ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix some different behaviours between `ParticleSystem` and `GPUParticleSystem` when using the cylinder emitter. Also added `WebGL2ParticleSystem` (for WebGL2 support) and `ComputeShaderParticleSystem` (for WebGPU support) ([Popov72](https://github.com/Popov72))
- Fix the `StandardMaterial` not using the tangent attribute when available ([Popov72](https://github.com/Popov72))
- Fix code for handling getting DeviceType/DeviceSlot in DeviceInputSystem to work better with MouseEvents ([PolygonalSun](https://github.com/PolygonalSun))
- Fix vector2/3/4 and quaternion toString formatting ([rgerd](https://github.com/rgerd))
- Fix non initialized matrix when setting orientation for bones ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fix cloning skeleton when mesh is an instanced mesh ([Popov72](https://github.com/Popov72))
- Fix a bug where pointer up/move events were not sent to 3D controls when no mesh in the `UtilityLayerRenderer` is hit by the picking ray. ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix issue with DeviceInputSystem where Mouse was being deregistered on Safari/MacOS ([PolygonalSun](https://github.com/PolygonalSun))
- Fix for disabledColor not working for Button ([msDestiny14](https://github.com/msDestiny14))
- Fix NativeEngine not setting default depth test function to LEQUAL ([rgerd](https://github.com/rgerd))
- Fix an exception where loading a very small STL file could result in attempting to read outside the files range ([CoPrez](https://github.com/CoPrez))
- Fix support of `useReverseDepthBuffer` throughout the engine ([Popov72](https://github.com/Popov72))
- Fix issue with handling of negative Pointer IDs in DeviceInputSystem ([PolygonalSun](https://github.com/PolygonalSun))
- Fix `WebXRNearInteraction` feature's cursor positioning on meshes ([rickfromwork](https://github.com/rickfromwork))
- Fix scaling discrepancy between `TouchHolographicButton` and other 3D controls ([rickfromwork](https://github.com/rickfromwork))
- Fix for triggering interactions on nearby meshes when performing a near interaction grab ([rickfromwork](https://github.com/rickfromwork))
- Fix for near interaction failing when multiple utility layers are present ([rickfromwork](https://github.com/rickfromwork))
- Fix handling of events to support multiple canvas scenarios DeviceInputSystem ([PolygonalSun](https://github.com/PolygonalSun))
- Fix undisposed textures in PrePass effects that would cause the scene to have more textures than expected ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix postprocess autoclear when enabling/disabling an effect in PrePass ([CraigFeldspar](https://github.com/CraigFeldspar))
- Fix ThinEngine isMobile to detect changes when window is resized to allow for proper emulator evaluation ([PolygonalSun](https://github.com/PolygonalSun))
- Fix discrete animation not looping correctly ([#10694](https://github.com/BabylonJS/Babylon.js/issues/10694)) ([Popov72](https://github.com/Popov72))
- Fix support for camera output render targets ([Popov72](https://github.com/Popov72)) and ([RaananW](https://github.com/RaananW))
- Fix `bakeTransformIntoVertices` not working when using `rotationQuaternion` + sometimes inverting winding ([Popov72](https://github.com/Popov72))
- Fix error handling in basis texture loading ([RaananW](https://github.com/RaananW))
- Fix issue with deadzones for gamepads being negatively affected by sensibility values ([PolygonalSun](https://github.com/PolygonalSun))
- Fix parsing of particle systems sub emitters ([#10882](https://github.com/BabylonJS/Babylon.js/issues/10882)) ([Popov72](https://github.com/Popov72))
- Fix bug in NME where a link could not be recreated after being deleted ([Popov72](https://github.com/Popov72))
- Fix small typo in transformNode getDirectionToRef method definition. ([PirateJC](https://github.com/piratejc))
- Fix textures not properly inverting along the vertical axis when using ImageBitmaps ([nmrugg](https://github.com/nmrugg))
- Fix for SkyMaterial sun position not working with non-default azimuth  ([AdversInc](https://github.com/adversinc))
- Fix issue where default free camera rotation didn't work during pointer lock ([PolygonalSun](https://github.com/PolygonalSun))
- Fix issue with wrong definition of a returned BASIS format ([RaananW](https://github.com/RaananW))
- Fix glTF exporter exports unused materials from excluded meshes ([daoshengmu](https://github.com/daoshengmu))
- Fix glTFLoader 2.0 when dealing with glTF files that contain no meshes ([simonihmig](https://github.com/simonihmig))
- Fix issue with setParent and meshes with a pivot ([RaananW](https://github.com/RaananW))
- Fix Button3D, HolographicButton, TouchHolographicButton and HolographicSlate content when scene is right-handed ([carolhmj](https://github.com/carolhmj))
- Fix get attachedNode always return null for `PositionGizmo` ([jtcheng](https://github.com/jtcheng))
- Fix Screen Space Reflections for right-handed scenes ([carolhmj](https://github.com/carolhmj))
- Fix camera collisions for right-handed scenes ([carolhmj](https://github.com/carolhmj))
- Add a null check when setting `imageSrc` on HolographicSlate([carolhmj](https://github.com/carolhmj))
- Fix issue with physics impostors'unique ID not set correctly if an impostor was disposed ([RaananW](https://github.com/RaananW))
- Fix memory leak and incorrect data copy in KTX2 ([bghgary](https://github.com/bghgary))
- Fix keypoint selection in ACE ([carolhmj](https://github.com/carolhmj))
- Fix keypoint drag in ACE ([carolhmj](https://github.com/carolhmj))
- Fix spherical harmonics computation ([Meakk](https://github.com/Meakk))
- Fix KTX and DDS loading with baked mipmaps ([Meakk](https://github.com/Meakk))
- Fix text rendering speed when `TextWrapping.Ellipsis` is used ([carolhmj](https://github.com/carolhmj))
- Fix caching of parented node ([carolhmj](https://github.com/carolhmj))
- Fix glTF exporter when exporting meshes with no material specified. ([bghgary](https://github.com/bghgary))
- Fix InputPassword serialization ([carolhmj](https://github.com/carolhmj))

### Breaking changes

- When a seven character hex string is passed to `Color4.FromHexString`, the alpha component will default to 1 instead of defaulting all components (r, g, b, and a) to 0. ([BlakeOne](https://github.com/BlakeOne))
- [List of breaking changes introduced by our compatibility with WebGPU](https://doc.babylonjs.com/advanced_topics/webGPU/webGPUBreakingChanges)
  - [ReadPixels and ProceduralTexture.getContent are now async](https://doc.babylonjs.com/advanced_topics/webGPU/webGPUBreakingChanges#readpixels-is-now-asynchronous)
  - [Shader support differences](https://doc.babylonjs.com/advanced_topics/webGPU/webGPUBreakingChanges#shader-code-differences)
- Use both `mesh.visibility` and `material.alpha` values to compute the global alpha value used by the soft transparent shadow rendering code. Formerly was only using `mesh.visibility` ([Popov72](https://github.com/Popov72))
- Depth renderer: don't render mesh if `infiniteDistance = true` or if `material.disableDepthWrite = true` ([Popov72](https://github.com/Popov72))
- `Mesh.createInstance` no longer make a unique `Geometry` for the Mesh so updating one `Geometry` can affect more meshes than before. Use `Mesh.makeUniqueGeometry` for old behaviour. ([breakin](https://github.com/breakin))
- Ammo.js needs to be initialized before creating the plugin with `await Ammo();` since Ammo introduced an async init in their library. ([sebavan](https://github.com/sebavan))
- Recast.js needs to be initialized before creating the plugin with `await Recast();` since Recast introduced an async init in their library. ([CedricGuillemet](https://github.com/CedricGuillemet))
- Custom shaders using instancing must use `instanceColor` instead of `color` so mesh vertex colors can be used with instancing. ([CedricGuillemet](https://github.com/CedricGuillemet))
- Fixed spelling of `EventState.initialize` ([seritools](https://github.com/seritools))
- `SkeletonViewer` is now enabled by default ([Deltakosh](https://github.com/deltakosh))
- `BindEyePosition` has been moved from `Material` to `Scene` to avoid a circular dependency problem and is now a non-static method (`bindEyePosition`) ([Popov72](https://github.com/Popov72))
- The depth renderer was not generating correct values for orthographic cameras when **storeNonLinearDepth = false** ([Popov72](https://github.com/Popov72))
- `dataBuffer.ts` has been moved from `Meshes/` to `Buffers/` ([Popov72](https://github.com/Popov72))
- By default, the glTF loader now uses sRGB buffers for gamma encoded textures (when supported by the GPU), which is more accurate than using regular buffers. However, it can lead to small visual differences. You can disable usage of sRGB buffers by setting `glTFFileLoader.useSRGBBuffers` to `false` ([Popov72](https://github.com/Popov72))
- 4th (`isAnimationSheetEnabled`) and 5th (`customEffect`) parameters of `GPUParticleSystem` constructor have been inverted to match `ParticleSystem` constructor ([Popov72](https://github.com/Popov72))
- `PBRSubSurfaceConfiguration.useGltfStyleThicknessTexture` has been renamed to `PBRSubSurfaceConfiguration.useGltfStyleTextures` ([Popov72](https://github.com/Popov72))
- Properties in `IWebXRHandTrackingOptions` related to hand and joint meshes have been moved into `jointMeshes` and `handMeshes` members, respectively ([rgerd](https://github.com/rgerd))
- `IWebXRHandTrackingOptions.jointMeshes.onHandJointMeshGenerated()` provides a `hand` instead of a `controllerId` in the parameters, since the tracked joint meshes are pre-generated ([rgerd](https://github.com/rgerd))
- You should now access joint meshes from `WebXRHand` through the `getJointMesh()` function ([rgerd](https://github.com/rgerd))
- Rework of the inner working of render targets. Those are mostly internal changes. From the end user standpoint, the most visible change is that the `PostProcess` class is now dealing with `RenderTargetWrapper` instead of `InternalTexture` objects. So, if you are directly updating the `inputTexture` property with a render target texture that you previously rendered, you will need to pass a `RenderTargetWrapper` instead of an `InternalTexture`: you will get it by doing `rtt.renderTarget`, where `rtt` is the instance of your `RenderTargetTexture`. ([Popov72](https://github.com/Popov72))
- `ShaderMaterial` is now storing the effect on submeshes by default. It may be a breaking change in some special cases where one creates a `ShaderMaterial` not to be used as the material property of a mesh but instead to handle it "by hand" by calling `ShaderMaterial.isReady` / `ShaderMaterial.bind` directly. If you are doing that, you may want to pass `false` as the 5th parameter of the `ShaderMaterial` constructor to disable storing the effect on submeshes.
- The `glTFLoader.rootBabylonMesh` getter now has a nullable return type (glTF files without mesh data) ([simonihmig](https://github.com/simonihmig))
- When updating the `m` array of the `Matrix` class directly, you must call `markAsUpdated()` explicitly or the matrix changes may not take effect ([Popov72](https://github.com/Popov72), [Deltakosh](https://github.com/deltakosh), [bghgary](https://github.com/bghgary), [Sebavan](https://github.com/sebavan))
- Loading glTF assets with skins now places skinned meshes as siblings of the corresponding skeleton root nodes instead of using `skeleton.overrideMesh`. ([bghgary](https://github.com/bghgary))
- The `overrideMesh` of the `Skeleton` class has been removed. ([bghgary](https://github.com/bghgary))
- Cloning a mesh now assigns the `skeleton` property to the source skeleton. ([bghgary](https://github.com/bghgary))
- Cloning and creating instances of a mesh now refreshes the bounding box applying skins and morph targets. ([bghgary](https://github.com/bghgary))
- `KeyboardInfoPre.skipOnPointerObservable` is now correctly renamed to `KeyboardInfoPre.skipOnKeyboardObservable`. ([bghgary](https://github.com/bghgary))
- GLTF Animations are loaded at 60 FPS by default. ([carolhmj](https://github.com/carolhmj))
- `currentState` and `previousState` have been removed from use in `onInputChangedObservable` in the `DeviceSourceManager` ([PolygonalSun](https://github.com/PolygonalSun))
- `PointerInput` movement enums are no longer being used in any movement event handling in the `DeviceInputSystem` and `InputManager` ([PolygonalSun](https://github.com/PolygonalSun))
- Shadow generators now use the `Material.alphaCutOff` value instead of a hard-coded 0.4 value. ([Popov72](https://github.com/Popov72))

## 4.2.0 (November 12th 2020)

### Major updates

-   Added particle editor to the Inspector ([Deltakosh](https://github.com/deltakosh))
-   Added sprite editor to the Inspector ([Deltakosh](https://github.com/deltakosh))
-   Updated skeleton viewer in the Inspector ([Pryme8](https://github.com/Pryme8))
-   Added texture inspection in the Inspector ([DarraghBurkeMS](https://github.com/DarraghBurkeMS))
-   Added PBR support in the node material editor ([Popov72](https://github.com/Popov72))
-   Added new node material editor modes: procedural textures, post processes, particle shaders ([Popov72](https://github.com/Popov72) and [Deltakosh](https://github.com/deltakosh))
-   Added customizable frames in the node material editor ([Pamela W](https://github.com/msDestiny14))
-   Added support for code templates in the playground ([sailro](https://github.com/sailro))
-   Added HDR texture filtering tools to the sandbox. [Doc](https://medium.com/@babylonjs/real-time-pbr-filtering-is-coming-to-babylon-cb0e81159d79) ([Sebavan](https://github.com/sebavan/))
-   Revamped documentation ([RaananW](https://github.com/RaananW), [John King](https://github.com/BabylonJSGuide), [Patrick Ryan](https://github.com/PatrickRyanMS), [PiratJC](https://github.com/PirateJC))
-   Added KTX + BasisU support ([Popov72](https://github.com/Popov72))
-   Updated WebXR Support ([RaananW](https://github.com/RaananW))
-   Added support for thin instances for faster mesh instances. [Doc](/features/divingDeeper/mesh/copies/thinInstances) ([Popov72](https://github.com/Popov72))
-   Added support in `ShadowGenerator` for soft transparent shadows ([Popov72](https://github.com/Popov72))
-   Added PBR Next features: Reflection probes for accurate shading and Sub Surface Scattering ([CraigFeldpsar](https://github.com/craigfeldspar) and [Sebavan](https://github.com/sebavan/))
-   Added support for latest glTF extensions: KHR_materials_clearcoat, KHR_materials_sheen, KHR_materials_transmission, KHR_texture_basisu ([Sebavan](https://github.com/sebavan/) and [Popov72](https://github.com/Popov72))
-   Added support for 3D Commerce glTF extension: KHR_materials_variants ([Sebavan](https://github.com/sebavan/) and [Deltakosh](https://github.com/deltakosh))

### Updates

#### General

-   Added the `ShadowDepthWrapper` class to support accurate shadow generation for custom as well as node material shaders. [Doc](/features/divingDeeper/lights/shadows#custom-shadow-map-shaders) ([Popov72](https://github.com/Popov72))
-   Added support for postproces serialization ([Deltakosh](https://github.com/deltakosh))
-   Added support for querystrings on KTX file URLs ([abogartz](https://github.com/abogartz))
-   Refactored React refs from old string API to React.createRef() API ([belfortk](https://github.com/belfortk))
-   Scale on one axis for `BoundingBoxGizmo` ([cedricguillemet](https://github.com/cedricguillemet))
-   Camera gizmo ([cedricguillemet](https://github.com/cedricguillemet))
-   Upgraded gizmo meshes ([davesauce14](https://github.com/davesauce14))
-   Gizmo isHovered boolean ([cedricguillemet](https://github.com/cedricguillemet))
-   Node support (Transform, Bone) for gizmos ([cedricguillemet](https://github.com/cedricguillemet))
-   Simplified code contributions by fully automating the dev setup with gitpod ([nisarhassan12](https://github.com/nisarhassan12))
-   Added a `CascadedShadowMap.IsSupported` method and log an error instead of throwing an exception when CSM is not supported ([Popov72](https://github.com/Popov72))
-   Added initial code for DeviceInputSystem ([PolygonalSun](https://github.com/PolygonalSun))
-   Added support for `material.disableColorWrite` ([Deltakosh](https://github.com/deltakosh))
-   The Mesh Asset Task also accepts File as sceneInput ([RaananW](https://github.com/RaananW))
-   Gizmo axis thickness ([cedricguillemet](https://github.com/cedricguillemet))
-   When no submesh can be picked(pointcloud), falls back to bbox intersection ([cedricguillemet](https://github.com/cedricguillemet))
-   Added support preserving vert colors for CSG objects ([PirateJC](https://github.com/PirateJC))
-   Added `boundingBoxRenderer.onBeforeBoxRenderingObservable` and `boundingBoxRenderer.onAfterBoxRenderingObservable` ([Deltakosh](https://github.com/deltakosh))
-   Better plane handling for PointerDragBehavior when camera direction colinear to axis ([cedricguillemet](https://github.com/cedricguillemet))
-   Added initial code for user facing DeviceSourceManager ([PolygonalSun](https://github.com/PolygonalSun))
-   Added a Simple and advanced timer, based on observables ([RaananW](https://github.com/RaananW))
-   Don't log a message in `CustomProceduralTexture` if the `texturePath` is not a JSON path ([Popov72](https://github.com/Popov72))
-   Added an alternate option to the mesh edge renderer to generate edges faster / more accurately for unusual geometries (like the ones generated by CSG) ([Popov72](https://github.com/Popov72))
-   Added an option when creating the engine to switch matrix computation to 64 bits ([Popov72](https://github.com/Popov72))
-   Added support for the alpha component to the SSR post-process ([Popov72](https://github.com/Popov72))
-   Force compute world matrix of the newly-attached mesh of a ray helper ([RaananW](https://github.com/RaananW))
-   Allow 180 monoscopic videos on top of the video dome ([#8575](https://github.com/BabylonJS/Babylon.js/issues/8575)) ([RaananW](https://github.com/RaananW))
-   Added `AssetContainerTask` support to `AssetsManager` class ([MackeyK24](https://github.com/MackeyK24))
-   Added `fixedDragMeshBoundsSize` for boundingbox gizmo to size anchors from bounds size ([cedricguillemet](https://github.com/cedricguillemet))
-   Changed DeviceSourceManager getInput contract to no longer return nullable values ([Drigax](https://github.com/drigax))
-   Photo Dome and Video Dome now use the same abstract class and support the same parameters ([#8771](https://github.com/BabylonJS/Babylon.js/issues/8771)) ([RaananW](https://github.com/RaananW))
-   Added `getTransformNodesByTags` support to `Scene` class ([MackeyK24](https://github.com/MackeyK24))
-   Added support for multi-pointer mesh selection and pointer over/out triggers ([#8820](https://github.com/BabylonJS/Babylon.js/issues/8820)) ([RaananW](https://github.com/RaananW))
-   Changed DeviceSourceManager getInput contract to no longer return nullable values for reals this time. Also added proper cleanup for DeviceSourceManager observables ([Drigax](https://github.com/drigax))
-   Default Loading screen supports any image size and ratio ([#8845](https://github.com/BabylonJS/Babylon.js/issues/8845)) ([RaananW](https://github.com/RaananW))
-   Added optional success and error callbacks for freezeActiveMeshes ([RaananW](https://github.com/RaananW))
-   Allow cross-eye mode in photo and video dome ([#8897](https://github.com/BabylonJS/Babylon.js/issues/8897)) ([RaananW](https://github.com/RaananW))
-   Added noMipMap option to the photo dome construction process ([#8972](https://github.com/BabylonJS/Babylon.js/issues/8972)) ([RaananW](https://github.com/RaananW))
-   Added a `disableBoundingBoxesFromEffectLayer` property to the `EffectLayer` class to render the bounding boxes unaffected by the effect ([Popov72](https://github.com/Popov72))
-   Removed all references to HTML element from cameras' attach and detach control functions ([RaananW](https://github.com/RaananW))
-   Added `boundingBoxRenderer.onResourcesReadyObservable` ([aWeirdo](https://github.com/aWeirdo))
-   Added `copyTools.GenerateBase64StringFromTexture` ([aWeirdo](https://github.com/aWeirdo))
-   Updated `axisScaleGizmo` to follow pointer on drag ([aWeirdo](https://github.com/aWeirdo))
-   Added manual input for sliders on NME and inspector ([msDestiny14](https://github.com/msDestiny14))

#### Engine

-   Improved world matrix caching engine by using dirty mechanism on vector3 and quaternion ([Deltakosh](https://github.com/deltakosh))
-   Allow logging of shader code when a compilation error occurs ([Popov72](https://github.com/Popov72))
-   Added back support for selecting textures based on engine capabilities ([bghgary](https://github.com/bghgary))
-   Fixed Draco decoder when running on IE11 ([bghgary](https://github.com/bghgary))
-   Change default camera calculations to only include visible and enabled meshes ([bghgary](https://github.com/bghgary))
-   Optimized frozen instances ([Deltakosh](https://github.com/deltakosh))
-   Added support for detail maps in both the standard and PBR materials ([Popov72](https://github.com/Popov72))
-   Added abstractMesh method to get all particle systems that use the mesh as an emitter ([PirateJC](https://github.com/PirateJC))
-   Added customization options to VirtualJoystick ([#7398](https://github.com/BabylonJS/Babylon.js/issues/7398)) ([Rockwell15](https://github.com/Rockwell15))
-   Handle meshes with LODs in render target textures (meaning in glow/highlight layers, shadow generators, depth renderer, etc) ([Popov72](https://github.com/Popov72))

#### NME

-   Frames are now resizable from the corners ([belfortk](https://github.com/belfortk))
-   Can now rename and re-order frame inputs and outputs ([belfortk](https://github.com/belfortk))
-   Can now edit Node port names ([belfortk](https://github.com/belfortk))
-   Updated which node ports are shown on frames by default so that only node ports connected to outside nodes are by default exposed on the frame ([belfortk](https://github.com/belfortk))
-   Added a modulo block ([ageneau](https://github.com/ageneau))
-   Fix bug where frame port labels would be the names of incorrect nodes ([belfortk](https://github.com/belfortk))
-   Fix bug where long comments on collapsed frames broke port alignment ([belfortk](https://github.com/belfortk))
-   Add the `FragCoord` and `ScreenSize` blocks ([Popov72](https://github.com/Popov72))
-   Particle systems: add the `ParticlePositionWorld` block ([Popov72](https://github.com/Popov72))
-   Add isExposedOnFrame property to connection points ([belfortk](https://github.com/belfortk))
-   Add support for exporting frames ([belfortk](https://github.com/belfortk))
-   Add support for importing frames and their nodes (unconnected) and exposed frame ports ([belfortk](https://github.com/belfortk))
-   Add the `rgba` and `a` outputs to the `ReflectionTexture` block ([Popov72](https://github.com/Popov72))
-   Add custom frames to be uploaded into NME for reuse ([msDestiny14](https://github.com/msDestiny14))
-   Node ports are now serialized for custom frames ([msDestiny14](https://github.com/msDestiny14))
-   Deleting a collapsed frame will delete all nodes inside it ([msDestiny14](https://github.com/msDestiny14))

#### Inspector

-   Added support for follow cameras ([Deltakosh](https://github.com/deltakosh))
-   New delta tool used to apply delta changes to a scene ([Deltakosh](https://github.com/deltakosh))
-   Handle PBR colors as colors in linear space ([Popov72](https://github.com/Popov72))
-   Allow removing textures ([Popov72](https://github.com/Popov72))
-   Edit all textures (anisotropic, clear coat, sheen, ...) for the PBR materials ([Popov72](https://github.com/Popov72))
-   Added right click options to create PBR and Standard Materials ([Deltakosh](https://github.com/deltakosh))
-   Added support for recording GIF ([Deltakosh](https://github.com/deltakosh))
-   Popup Window available (To be used in Curve Editor) ([pixelspace](https://github.com/devpixelspace))
-   Added support to update inspector when switching to a new scene ([belfortk](https://github.com/belfortk))
-   Hex Component for Hex inputs on layer masks. ([msDestiny14](https://github.com/msDestiny14))
-   View & edit textures in pop out inspector using tools such as brush and floodfill. Supports region selection, individual channel editing, mipmap previews, and resizing. ([DarraghBurkeMS](https://github.com/DarraghBurkeMS))
-   Added mesh debug tools to display bone influence weights and bone indices maps. ([Pryme8](https://github.com/Pryme8))
-   Added more functionality and options to the skeleton debug panel. ([Pryme8](https://github.com/Pryme8))
-   Along with bone index it is now possible to select a bone using its name when viewing bone weights ([#9117](https://github.com/BabylonJS/Babylon.js/issues/9117)) ([RaananW](https://github.com/RaananW))
-   Gradient nodes from NME can now be set to be visible in the inspector ([msDestiny14](https://github.com/msDestiny14))

#### Cameras

-   Fixed up vector not correctly handled with stereoscopic rig ([cedricguillemet](https://github.com/cedricguillemet))
-   Handle reattachment of panning button for `ArcRotateCamera` ([cedricguillemet](https://github.com/cedricguillemet))
-   Unattach previous control in `scene.InputManager` when attaching a new one ([cedricguillemet](https://github.com/cedricguillemet))
-   Added flag to TargetCamera to invert rotation direction and multiplier to adjust speed ([Exolun](https://github.com/Exolun))
-   Added upwards and downwards keyboard input to `FreeCamera` ([Pheater](https://github.com/pheater))
-   Handle scales in camera matrices ([Popov72](https://github.com/Popov72))
-   Added mouse wheel controls to FreeCamera. ([mrdunk](https://github.com/mrdunk))

#### Debug

-   Added new view modes to the `SkeletonViewer` class. ([Pryme8](https://github.com/Pryme8))
-   Added static methods to create debug shaders materials for a mesh with a skeleton. ([Pryme8](https://github.com/Pryme8))
-   Added ability to view local rotation axes of bones using new `displayOptions`: `showLocalAxes` and `localAxesSize` ([reimund](https://github.com/reimund))

#### Sprites

-   Added support for 'sprite.useAlphaForPicking` to enable precise picking using sprite alpha ([Deltakosh](https://github.com/deltakosh))
-   Improved rendering engine by using instancing when available ([Deltakosh](https://github.com/deltakosh))

#### Physics

-   Fixed time steps or delta time with sub time step for Oimo.js and Cannon.js ([cedricguillemet](https://github.com/cedricguillemet))
-   Ammo.js collision group and mask supported by impostor parameters ([cedricguillemet](https://github.com/cedricguillemet))
-   Contact point parameter in registerOnPhysicsCollide callback ([cedricguillemet](https://github.com/cedricguillemet))
-   `collisionResponse` flag to disable response but still get onCollide events ([cedricguillemet](https://github.com/cedricguillemet))
-   Ammo.js IDL exposed property update and raycast vehicle stablization support ([MackeyK24](https://github.com/MackeyK24))
-   Recast.js plugin nav mesh and crowd agent to ref performance optimizations. ([MackeyK24](https://github.com/MackeyK24))
-   Added `scene.physicsEnabled` boolean ([Deltakosh](https://github.com/deltakosh))
-   Fixed an issue with transformation set after physics body was created using Cannon.js (excluding height and plane) ([#7928](https://github.com/BabylonJS/Babylon.js/issues/7928)) ([RaananW](https://github.com/RaananW))
-   Fixed an issue with compound creation and scaling preset ([#8888](https://github.com/BabylonJS/Babylon.js/issues/8888)) ([RaananW](https://github.com/RaananW))

#### Loaders

-   Added support for glTF mesh instancing extension ([#7521](https://github.com/BabylonJS/Babylon.js/issues/7521)) ([drigax](https://github.com/Drigax))
-   Get the list of cameras retrieved from a gLTF file when loaded through the asset container ([Popov72](https://github.com/Popov72))
-   Fixed SceneLoader.ImportAnimations. Now targets nodes based on "targetProperty" ([#7931](https://github.com/BabylonJS/Babylon.js/issues/7931)) ([phenry20](https://github.com/phenry20))
-   Renamed KHR_mesh_instancing extension to EXT_mesh_gpu_instancing ([#7945](https://github.com/BabylonJS/Babylon.js/issues/7945)) ([drigax](https://github.com/Drigax))
-   Added support for KHR_materials_ior for glTF loader. ([Sebavan](https://github.com/sebavan/))
-   Added support for KHR_materials_specular for glTF loader. ([Sebavan](https://github.com/sebavan/))
-   Added support for KHR_materials_variants for glTF loader. ([MiiBond](https://github.com/MiiBond/))
-   Added support for KHR_materials_transmission for glTF loader. ([MiiBond](https://github.com/MiiBond/))
-   Improved progress handling in glTF loader. ([bghgary](https://github.com/bghgary))
-   Use min/max values from position accessors (when available) to set the bounding box of meshes ([Popov72](https://github.com/Popov72))
-   Added missing "pluginExtension" parameter to SceneLoader.ImportAnimations. ([phenry20](https://github.com/phenry20))
-   Added support for .glb file loading through a base64 encoded filename ([Popov72](https://github.com/Popov72))
-   Fixed issue with loading screen hiding too early when loading multiple assets concurrently. ([bghgary](https://github.com/bghgary))
-   Added the `loadAllMaterials` property to the gLTF loader to load materials even if not used by any mesh ([Popov72](https://github.com/Popov72))
-   Added transmission prerender pass when using KHR_materials_transmission ([MiiBond](https://github.com/MiiBond/))
-   Fixed a bug when loading glTF with interleaved animation data. ([bghgary](https://github.com/bghgary))
-   Added support for KHR_materials_translucency for glTF loader. ([MiiBond](https://github.com/MiiBond/))

#### Serializers

-   Added support for KHR_materials_unlit to glTF serializer ([Popov72](https://github.com/Popov72))
-   Added support for glTF Skins to glTF serializer ([Drigax](https://github.com/Drigax))
-   Added support for glTF Morph Target serialization ([Drigax](https://github.com/Drigax))
-   Fixed several bugs in stlSerializer ([aWeirdo](https://github.com/aWeirdo))
-   Added param `doNotBakeTransform` to `stlSerializer.CreateSTL` ([aWeirdo](https://github.com/aWeirdo))

#### Navigation

-   export/load prebuilt binary navigation mesh ([cedricguillemet](https://github.com/cedricguillemet))
-   get next path step point for an agent ([cedricguillemet](https://github.com/cedricguillemet))

#### Materials

-   Added the `roughness` and `albedoScaling` parameters to PBR sheen ([Popov72](https://github.com/Popov72))
-   Updated the energy conservation factor for the clear coat layer in PBR materials ([Popov72](https://github.com/Popov72))
-   Added the `transparencyMode` property to the `StandardMaterial` class ([Popov72](https://github.com/Popov72))
-   Added to `FresnelParameters` constructor options and equals method ([brianzinn](https://github.com/brianzinn))
-   Added `AddAttribute` to `CustomMaterial` and `PBRCustomMaterial` ([Popov72](https://github.com/Popov72))
-   `setTexture` and `setTextureArray` from `ShaderMaterial` take now a `BaseTexture` as input instead of a `Texture`, allowing to pass a `CubeTexture` ([Popov72](https://github.com/Popov72))
-   Allow parenthesis usage in `#if` expressions in shader code ([Popov72](https://github.com/Popov72))
-   Added to `StandardMaterial` RGBD ReflectionTexture, RefractionTexture and LightmapTexture support. ([MackeyK24](https://github.com/MackeyK24))
-   Allow using the single comment syntax `// comment` in a `#if` construct in shader code ([Popov72](https://github.com/Popov72))
-   Added the possibility to update the shader code before being compiled ([Popov72](https://github.com/Popov72))
-   Added the `shadowOnly` property to the `BackgroundMaterial` class ([Popov72](https://github.com/Popov72))
-   Added support for lightmaps in unlit PBR materials ([Popov72](https://github.com/Popov72))
-   Added `muted` setting to `VideoTexture`, Fixed autoplay in Chrome ([simonihmig](https://github.com/simonihmig))
-   Added `waveCount` to `WaterMaterial` used to adjust waves count according to the ground's size where the material is applied on ([julien-moreau](https://github.com/julien-moreau))
-   Alpha test `transparencyMode` no-longer requires a diffuse/albedo texture if `opacityTexture` is present ([metaobjects](https://github.com/metaobjects))
-   Added `hasTexture` override in `MultiMaterial` ([Vampiro](https://github.com/vampiro))

#### Meshes

-   Added `MeshBuilder.CreateCapsule` and `Mesh.CreateCapsule` for creation of a capsule shape mesh and VertexBuffers. ([Pryme8](https://github.com/Pryme8))

#### WebXR

-   Added optional ray and mesh selection predicates to `WebXRControllerPointerSelection` ([Exolun](https://github.com/Exolun))
-   Implemented the new WebXR HitTest API ([#7364](https://github.com/BabylonJS/Babylon.js/issues/7364)) ([RaananW](https://github.com/RaananW))
-   Playground doesn't update FPS when in XR in main and frame ([#7875](https://github.com/BabylonJS/Babylon.js/issues/7875)) ([RaananW](https://github.com/RaananW))
-   Added support for teleportation using pointer events ([RaananW](https://github.com/RaananW))
-   AR reference space type recommendation changed to 'unbounded' ([#7959](https://github.com/BabylonJS/Babylon.js/issues/7959)) ([RaananW](https://github.com/RaananW))
-   Teleportation plugin doesn't use the touched to finish teleportation ([#7916](https://github.com/BabylonJS/Babylon.js/issues/7916)) ([RaananW](https://github.com/RaananW))
-   Support for pointer selection and teleportation in right handed systems ([#7967](https://github.com/BabylonJS/Babylon.js/issues/7967)) ([RaananW](https://github.com/RaananW))
-   Pointer Selection feature now uses `selectstart` and `selectend` events when gamepad and motion controller are not present ([#7989](https://github.com/BabylonJS/Babylon.js/issues/7989)) ([RaananW](https://github.com/RaananW))
-   Removed forced `autoClear` = false settings ([RaananW](https://github.com/RaananW))
-   Added a warning that WebXR can only be served over HTTPS ([RaananW](https://github.com/RaananW))
-   Default (XR-global) rendering group ID can be defined when initializing a default experience ([RaananW](https://github.com/RaananW))
-   Added support for (experimental) haptic actuators ([#8068](https://github.com/BabylonJS/Babylon.js/issues/8068)) ([RaananW](https://github.com/RaananW))
-   It is now possible to enable experimental (AR) features using the options of the default xr helper ([RaananW](https://github.com/RaananW))
-   Full support for right handed scenes ([#8132](https://github.com/BabylonJS/Babylon.js/issues/8132)) ([RaananW](https://github.com/RaananW))
-   WebXR anchors feature implemented ([#7917](https://github.com/BabylonJS/Babylon.js/issues/7917)) ([RaananW](https://github.com/RaananW))
-   Canvas is being resized when entering XR ([RaananW](https://github.com/RaananW))
-   All camera view matrices are now calculated by Babylon to support left and right handed systems ([RaananW](https://github.com/RaananW))
-   WebXR Features Manager now has the ability to check if a feature can be enabled, and set native features optional or required ([RaananW](https://github.com/RaananW))
-   Optional camera gaze mode added to the pointer selection feature ([RaananW](https://github.com/RaananW))
-   Exposing feature points when running on top of BabylonNative ([Alex-MSFT](https://github.com/Alex-MSFT))
-   WebXR hit test can now define different entity type for the results ([#8687](https://github.com/BabylonJS/Babylon.js/issues/8687)) ([RaananW](https://github.com/RaananW))
-   Fixed an issue with stencil not enabled per default ([#8720](https://github.com/BabylonJS/Babylon.js/issues/8720)) ([RaananW](https://github.com/RaananW))
-   Expose the overlay to which the XR Enter/Exit buttons are added to ([#8754](https://github.com/BabylonJS/Babylon.js/issues/8754)) ([RaananW](https://github.com/RaananW))
-   WebXR hand-tracking module is available, able to track hand-joints on selected devices including optional physics interactions ([RaananW](https://github.com/RaananW))
-   Fixed an issue with moving backwards in XR ([#8854](https://github.com/BabylonJS/Babylon.js/issues/8854)) ([RaananW](https://github.com/RaananW))
-   Hit-Test results can be an empty array ([#8887](https://github.com/BabylonJS/Babylon.js/issues/8887)) ([RaananW](https://github.com/RaananW))
-   XR's main camera uses the first eye's projection matrix ([#8944](https://github.com/BabylonJS/Babylon.js/issues/8944)) ([RaananW](https://github.com/RaananW))
-   pointerX and pointerY of the scene are now updated when using the pointer selection feature ([#8879](https://github.com/BabylonJS/Babylon.js/issues/8879)) ([RaananW](https://github.com/RaananW))
-   XR tracking state was added to the camera ([#9076](https://github.com/BabylonJS/Babylon.js/issues/9076)) ([RaananW](https://github.com/RaananW))
-   Individual post processing can be applied to the XR rig cameras ([#9038](https://github.com/BabylonJS/Babylon.js/issues/9038)) ([RaananW](https://github.com/RaananW))
-   Pointer selection improvements - single/dual hand selection, max ray distance and more ([#7974](https://github.com/BabylonJS/Babylon.js/issues/7974)) ([RaananW](https://github.com/RaananW))
-   Updated Plane Detection API ([RaananW](https://github.com/RaananW))
-   Updated anchor system's promise resolution and API ([#9258](https://github.com/BabylonJS/Babylon.js/issues/9258)) ([RaananW](https://github.com/RaananW))
-   Fixed an issue with teleportation re-attachment ([#9273](https://github.com/BabylonJS/Babylon.js/issues/9273)) ([RaananW](https://github.com/RaananW))

#### Collisions

-   Added an option to optimize collision detection performance ([jsdream](https://github.com/jsdream)) - [PR](https://github.com/BabylonJS/Babylon.js/pull/7810)
-   Added support for collisions with unindexed meshes ([#9267](https://github.com/BabylonJS/Babylon.js/issues/9267))([Popov72](https://github.com/Popov72))

#### Animation

-   Added support for Additive Animation Blending. Existing animations can be converted to additive using the new MakeAnimationAdditive method for Skeletons, AnimationGroups and Animations. Animations can be played additively using the new isAdditive input parameter to the begin animation methods. ([c-morten](https://github.com/c-morten))
-   Sort events by frame in ascending order in `Animation#addEvent()` ([ycw](https://github.com/ycw))

#### Maths

-   Added `Vector3.projectOnPlaneToRef` ([Deltakosh](https://github.com/deltakosh))

#### Particles

-   Added local space support for GPU particles ([CraigFeldpsar](https://github.com/craigfeldspar))
-   Added ability to update also colors and uvs of solid particle vertices ([jerome](https://github.com/jbousquie))

#### Textures

-   .HDR environment files will now give accurate PBR reflections ([CraigFeldpsar](https://github.com/craigfeldspar))
-   Added a `homogeneousRotationInUVTransform` property in the `Texture` to avoid deformations when rotating the texture with non-uniform scaling ([Popov72](https://github.com/Popov72))
-   Added `Texture.ForceSerializeBuffers` ([aWeirdo](https://github.com/aWeirdo))

#### Audio

-   Added support of `metadata` in `Sound` class. ([julien-moreau](https://github.com/julien-moreau))
-   Added `currentTime` property to the `Sound` class. ([jocravio](https://github.com/jocravio))

#### Build

-   Fixed an issue with gulp webpack, webpack stream and the viewer ([RaananW](https://github.com/RaananW))

#### Playground

-   Added support for code templates in the playground ([sailro](https://www.github.com/sailro))
-   If createEngine fails, a default engine will be created ([#8084](https://github.com/BabylonJS/Babylon.js/issues/8084)) ([RaananW](https://github.com/RaananW))

#### GUI

-   Added support for custom word splitting function for `TextBlock` ([Popov72](https://github.com/Popov72))
-   Added the `fixedRatio` property to the `Control` class ([Popov72](https://github.com/Popov72))
-   Clip multilines by camera near plane when point is attached to a mesh ([cedricguillemet](https://github.com/cedricguillemet))

#### Post Processes

-   SSAO 2, motion blur and screen space reflections are now using the brand new `PrePassRenderer` to avoid rendering the scene twice ([CraigFeldpsar](https://github.com/craigfeldspar)
-   Added Screen Space Curvature post process: [Doc](/features/divingDeeper/postProcesses/usePostProcesses#screen-space-curvature) ([Popov72](https://github.com/Popov72) and [Sebavan](https://github.com/sebavan/))

### Bugs

-   Fixed infinite loop in `GlowLayer.unReferenceMeshFromUsingItsOwnMaterial` ([Popov72](https://github.com/Popov72))
-   Fixed picking issue in the Solid Particle System when MultiMaterial is enabled ([jerome](https://github.com/jbousquie))
-   Fixed picking issue in the Solid Particle System when expandable ([jerome](https://github.com/jbousquie))
-   Fixed use of skeleton override matrix in mesh ray intersection ([cedricguillemet](https://github.com/cedricguillemet))
-   `QuadraticErrorSimplification` was not exported ([RaananW](https://github.com/Raananw))
-   Fixed NME Frames bug where collapsing and moving a frame removed the nodes inside ([belfortk](https://github.com/belfortk))
-   Fixed moving / disappearing controls when freezing/unfreezing the ScrollViewer ([Popov72](https://github.com/Popov72))
-   Fix: when using instances, master mesh (if displayed) does not have correct instance buffer values ([Popov72](https://github.com/Popov72))
-   Exit XR will only trigger only if state is IN_XR ([RaananW](https://github.com/RaananW))
-   Fixed improper baking of transformed textures in `KHR_texture_transform` serializer. ([drigax](https://github.com/Drigax))
-   Fixed NME codegen: missing common properties for float-value input block. ([ycw](https://github.com/ycw))
-   Fixed missing options for MeshBuilder.CreateBox. ([ycw](https://github.com/ycw))
-   Fixed bug in `Plane.transform` when matrix passed in is not a pure rotation ([Popov72](https://github.com/Popov72))
-   Fixed bug in PBR when anisotropy is enabled and no bump texture is provided ([Popov72](https://github.com/Popov72))
-   Fixed horizon occlusion in PBR materials ([Popov72](https://github.com/Popov72))
-   Fixed wrong relative position in applyImpulse/applyForce for ammojs plugin ([cedricguillemet](https://github.com/cedricguillemet))
-   Fixed delay calculation in Animatable.goToFrame when speedRatio != 1 ([Reimund Järnfors](https://github.com/reimund))
-   Fixed bug in PBR when translucency is enabled and an irradiance texture is provided ([Popov72](https://github.com/Popov72))
-   Fixed bug in PBR with translucency when irradiance texture is 2D ([Popov72](https://github.com/Popov72))
-   Fixed parenting and enabled state of cloned lights ([cedricguillemet](https://github.com/cedricguillemet))
-   Fixed bug in PBR when specific combinations of parameters are used ([Popov72](https://github.com/Popov72))
-   Fixed texture being inverted on the Y axis by default when using TextureAsset or AssetManager ([broederj](https://github.com/broederj))
-   Fixed `TexturePacker` cross-origin image requests, Fixed falsy default options ([ludevik](https://github.com/ludevik))
-   Fixed freeze (infinite loop) when disposing a scene that loaded some specific gLTF files ([Popov72](https://github.com/Popov72))
-   Fixed submesh recreation when it should not ([Popov72](https://github.com/Popov72))
-   Fixed `CustomMaterial` and `PBRCustomMaterial` not setting uniforms / samplers / attributes ([Popov72](https://github.com/Popov72))
-   Fixed bug in NME where deleting a node from a frame would not remove its ports on the outside of a frame
-   Fixed mesh winding order inversion when merging meshes with overridden side orientation ([drigax](https://github.com/Drigax))
-   Fixed a rendering issue with GearVR in WebXR mode ([RaananW](https://github.com/RaananW))
-   Fixed error when downloading async createScene function in playground ([#7926](https://github.com/BabylonJS/Babylon.js/issues/7926)) ([RaananW](https://github.com/RaananW))
-   Fixed issue where ThinEngine.prototype.createDynamicEngine is undefined when using VideoTexture with es6 packages ([rvadhavk](https://github.com/rvadhavk))
-   Fixed [issue](https://forum.babylonjs.com/t/virtualjoystick-needs-to-set-style-touch-action-none-explicitly/9562) that canvas for `VirtualJoystick` does not have `touch-action: "none"` set by default ([joergplewe](https://github.com/joergplewe))
-   Fixed [issue](https://github.com/BabylonJS/Babylon.js/issues/7943) that prevented user from re-loading custom meshes ([belfortk](https://github.com/belfortk))
-   Fixed bug in NME where collapsed frames didn't redraw output links to outside nodes ([belfortk](https://github.com/belfortk))
-   Fixed bug in NME where links were not redrawn after moving frame port ([belfortk](https://github.com/belfortk))
-   Fixed bugs in NME that were causing inconsistent behavior displaying Move Node Up and Down buttons on frame ports ([belfortk](https://github.com/belfortk))
-   Fixed bug in `ShaderMaterial` when using morph targets ([Popov72](https://github.com/Popov72))
-   Fixed bug in playground where child NME windows would not close before page unload events ([belfortk](https://github.com/belfortk))
-   Fixed an issue with stereoscopic rendering ([#8000](https://github.com/BabylonJS/Babylon.js/issues/8000)) ([RaananW](https://github.com/RaananW))
-   Fixed bug with multiple scenes when resizing the screen and there's a glow or highlight layer active ([Popov72](https://github.com/Popov72))
-   Fixed an error when compiling with the closure compiler ([ageneau](https://github.com/ageneau/))
-   Fixed an error in applying texture to sides of `extrudePolygon` using faceUV\[1\] ([JohnK](https://github.com/BabylonJSGuide/))
-   Playground didn't work if query params were added to the URL ([RaananW](https://github.com/RaananW))
-   Fixed Path3D `_distances` / length computation ([Poolminer](https://github.com/Poolminer))
-   Make sure bone matrices are up to date when calling `TransformNode.attachToBone` ([Popov72](https://github.com/Popov72))
-   Fixed display problem with transparent objects and SSAO2 pipeline (bug in the `GeometryBufferRenderer`) ([Popov72](https://github.com/Popov72))
-   Fixed `Sound` not accepting a `TransformNode` as a source for spatial sound ([Poolminer](https://github.com/Poolminer))
-   Fixed bug when using `ShadowOnlyMaterial` with Cascaded Shadow Map and `autoCalcDepthBounds` is `true` ([Popov72](https://github.com/Popov72))
-   Fixed OBJ serializer default scene scene handedness causing [OBJ Mirror export](https://forum.babylonjs.com/t/obj-export-mirrored/10835/10)
-   Fixed bug when using shadows + instances + transparent meshes + `transparencyShadow = false` ([Popov72](https://github.com/Popov72))
-   Incorrect initialization when reattaching XR pointer selection ([#8227](https://github.com/BabylonJS/Babylon.js/issues/8227)) ([RaananW](https://github.com/RaananW))
-   Fixed `DracoCompression` to not load empty data into attributes ([bghgary](https://github.com/bghgary))
-   Fixed `Mesh.subdivide` where one face could be lost depending on the number of subdivision ([Popov72](https://github.com/Popov72))
-   Fixed `AssetContainer.instantiateModelsToScene` with cloneMaterials=true and MultiMaterials to properly set the cloned submaterials ([ghempton](https://github.com/ghempton))
-   Fixed MSAA fail on MultiRenderTarget textures ([CraigFeldpsar](https://github.com/craigfeldspar)
-   Fixed wrong display when setting `DefaultRenderingPipeline.imageProcessingEnabled` to `false` ([Popov72](https://github.com/Popov72))
-   Fixed crash when loading a .obj file with vertex colors ([Popov72](https://github.com/Popov72))
-   Fixed skeleton viewer still visible when `isEnabled = false` ([Popov72](https://github.com/Popov72))
-   Fixed crash with CSG when no uvs defined ([Popov72](https://github.com/Popov72))
-   Fixed an issue causing views to render blank when scene rendering is skipped for a given iteration of the render loop ([elInfidel](https://github.com/elInfidel))
-   Fixed docs Matrix.RotationYawPitchRoll and Matrix.RotationYawPitchRollToRef ([VSerain](https://github.com/VSerain))
-   Fixed issue in `GLTFLoader._updateBoneMatrices()` where bone rest position was not set. ([drigax](https://github.com/drigax))
-   Fixed the bounding box of instances that does not match the instance position / rotation / scaling ([Popov72](https://github.com/Popov72))
-   Fixed an issue with sound updateOptions not updating the underlying sound buffer/html element ([RaananW](https://github.com/RaananW))
-   Fixed bug in sphereBuilder where top and bottom segments added 6 indices per triangle instead of 3. (use option dedupTopBottomIndices to enable it) ([aWeirdo](https://github.com/aWeirdo))
-   Fixed issue with Babylon scene export of loaded glTF meshes.([Drigax]/(https://github.com/drigax))
-   Fixed an issue with text block wrap and unicode strings (not working in IE11) ([#8822](https://github.com/BabylonJS/Babylon.js/issues/8822)) ([RaananW](https://github.com/RaananW))
-   Fixed an issue with input text and input password and unicode strings (not working in IE11) ([#9242](https://github.com/BabylonJS/Babylon.js/issues/9242)) ([Popov72](https://github.com/Popov72))
-   Fixed an issue with compound initialization that has rotation ([#8744](https://github.com/BabylonJS/Babylon.js/issues/8744)) ([RaananW](https://github.com/RaananW))
-   Fixed an issue in `DeviceSourceManager.getDeviceSources()` where null devices are returned ([Drigax](https://github.com/drigax))
-   Fixed issue in glTF2 `_Exporter.createSkinsAsync()` that exported an incorrect joint indexing list ([drigax](https://github.com/drigax))
-   Fixed gltf2 Morph Target export code style, Added additional test case for non-animation group created morph targets ([drigax](https://github.com/drigax))
-   Fixed "Uncaught ReferenceError: name is not defined" ([outermeasure](https://github.com/outermeasure))
-   Fixed wrong winding when applying a transform matrix on VertexData ([Popov72](https://github.com/Popov72))
-   Fixed exporting vertex color of mesh with `StandardMaterial` when exporting to glTF ([Drigax](https://github.com/drigax))
-   Changed use of mousemove to pointermove in freeCameraMouseInput and flyCameraMouseInput to Fixed issue with Firefox ([PolygonalSun](https://github.com/PolygonalSun))
-   Fixed `TriPlanarMaterial` to compute the right world normals ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `SkeletonViewer` to use utillity layer with custom lighting to improve debug mesh visibility ([Drigax](https://github.com/drigax))
-   Fixed same sub mesh being rendered multiple times in the shadow map ([Popov72](https://github.com/Popov72))
-   Fixed incorrect shadows on the master mesh when using a lod mesh ([Popov72](https://github.com/Popov72))
-   Take first gamepad connected when attaching camera (and not only XBOX gamepads) ([#9136](https://github.com/BabylonJS/Babylon.js/issues/9136)) ([RaananW](https://github.com/RaananW))
-   Fixed bug in `Mesh.IncreaseVertices` assuming null value if a property didn't exist. ([aWeirdo](https://github.com/aWeirdo))
-   Fixed issue when taking a screenshot with multi-cameras using method `CreateScreenshotUsingRenderTarget` ([#9201](https://github.com/BabylonJS/Babylon.js/issues/9201)) ([gabrielheming](https://github.com/gabrielheming))
-   Fixed inTangent in animationGroup ([dad72](https://github.com/dad72))
-   Fixed bug in `QuadraticErrorSimplification` not correctly optimizing mesh. ([aWeirdo](https://github.com/aWeirdo))
-   Fixed bug in `ArcRotateCamera` where setting the position would recalculate the alpha value to a value outside the current limits. ([nilss0n](https://github.com/nilss0n))

### Breaking changes

-   `FollowCamera.target` was renamed to `FollowCamera.meshTarget` to not be in conflict with `TargetCamera.target` ([Deltakosh](https://github.com/deltakosh))
-   `EffectRenderer.render` now takes a `RenderTargetTexture` or an `InternalTexture` as the output texture and only a single `EffectWrapper` for its first argument ([Popov72](https://github.com/Popov72))
-   Sound's `updateOptions` takes `options.length` and `options.offset` as seconds and not milliseconds ([RaananW](https://github.com/RaananW))
-   HDRCubeTexture default rotation is now similar to the industry one. You might need to Added a rotation on y of 90 degrees if you scene changes ([Sebavan](https://github.com/sebavan/))
-   PBRMaterial index of refraction is now defined as index of refraction and not the inverse of it ([Sebavan](https://github.com/sebavan/))
-   `SceneLoaderProgress` class is now `ISceneLoaderProgress` interface ([bghgary](https://github.com/bghgary))
-   Rendering of transparent meshes: stencil state is now set to the value registered in the engine (when calling `engine.setStencilBuffer(value)`) instead of being set to `false` unconditionally. This change may affect the highlight layer when using transparent meshes. If you are impacted, you may need to exclude the transparent mesh(es) from the layer ([Popov72](https://github.com/Popov72))
-   Fixed width/height GUI container computation to take into account paddings when `adaptWithToChildren = true` ([Popov72](https://github.com/Popov72))
-   `smoothstep` in NME is now taking any type of parameters for its `value` input. If you use generated code from the NME ("Generate code" button), you may have to move the smoothstep output connection AFTER the input connections ([Popov72](https://github.com/Popov72))
-   `SoundTrack.RemoveSound` and `SoundTrack.AddSound` were renamed to `SoundTrack.removeSound` and `SoundTrack.addSound` ([Deltakosh](https://github.com/deltakosh))
-   `PolygonPoints.add` no longer filters out points that are close to the first point ([bghgary](https://github.com/bghgary))
-   `Material` created with matching names now have auto-incrementing IDs ([Drigax](https://github.com/drigax))

## 4.1.0 (February 27th 2020)

### Major updates

-   Node Material and Node material editor [Doc](/features/divingDeeper/materials/node_material/nodeMaterial) ([Deltakosh](https://github.com/deltakosh/) / [TrevorDev](https://github.com/TrevorDev))
-   WebGPU preliminary support [Doc](/features/advanced_topics/webGPU) ([Sebavan](https://github.com/sebavan/))
-   Added the "Cascaded Shadow Mapping" (CSM) shadow rendering technique ([Popov72](https://github.com/Popov72) (initiated by [lockphase](https://github.com/lockphase/)))
-   .basis texture file format support [Doc](/features/divingDeeper/materials/advanced/#basis-file-format) ([TrevorDev](https://github.com/TrevorDev))
-   Navigation mesh and crowd of moving agents [Doc](/toolsAndResources/crowdNavigation/createNavMesh) ([CedricGuillemet](https://github.com/CedricGuillemet))
-   Added Points Cloud Particle System [Doc](/features/divingDeeper/particles/point_cloud_system/pcs_intro) ([JohnK](https://github.com/BabylonJSGuide/))
-   Classes decoupling ending up with smaller bundle sizes [Blog](https://medium.com/@babylonjs/size-matters-e0e94dad01a7) ([Deltakosh](https://github.com/deltakosh/))
-   Babylon.js controls [Doc](/features/divingDeeper/controls) ([Sebavan](https://github.com/sebavan/) / [Deltakosh](https://github.com/deltakosh/))
-   Massive WebXR updates (See below) ([RaananW](https://github.com/RaananW/) / [TrevorDev](https://github.com/TrevorDev))
-   Added support for Offscreen canvas [Doc](/features/divingDeeper/scene/offscreenCanvas) ([Deltakosh](https://github.com/deltakosh/))
-   Added support for multiple canvases with one engine [Doc](/features/divingDeeper/scene/multiCanvas) ([Deltakosh](https://github.com/deltakosh/))
-   Added useReverseDepthBuffer to Engine which can provide greater z depth for distant objects without the cost of a logarithmic depth buffer ([BenAdams](https://github.com/benaadams/))
-   Screen space reflections post-process [Doc](/features/divingDeeper/postProcesses/screenSpaceReflectionsPostProcess) ([julien-moreau](https://github.com/julien-moreau))

### Updates

#### General

-   Add two new clip planes (5 and 6) to get a clip cube ([MickPastor](https://github.com/mickPASTOR))
-   Added support for dual shock gamepads ([Deltakosh](https://github.com/deltakosh/))
-   Support Vive Focus 3Dof controller ([TrevorDev](https://github.com/TrevorDev))
-   Planar positioning support for GizmoManager ([Balupg](https://github.com/balupg))
-   ScaleGizmo and AxisScaleGizmo sensitivity factor ([CedricGuillemet](https://github.com/CedricGuillemet))
-   Individual gizmos can now be enabled/disabled ([Balupg](https://github.com/balupg))
-   Unify preparation of instance attributes. Added `MaterialHelper.PushAttributesForInstances` ([MarkusBillharz](https://github.com/MarkusBillharz))
-   Added support for PBR [irradiance map](/features/divingDeeper/materials/using/masterPBR#irradiance-map)
-   Added ability to set render camera on utility layer instead of using the latest active camera ([TrevorDev](https://github.com/TrevorDev))
-   Move normalizeToUnitCube to transformNode instead of abstract mesh and add predicate to exclude sub objects when scaling ([TrevorDev](https://github.com/TrevorDev))
-   Method to check if device orientation is available ([TrevorDev](https://github.com/TrevorDev))
-   Added support for sound sprites [Doc](/features/divingDeeper/audio/playingSoundsMusic#playing-a-sound-sprite) ([Deltakosh](https://github.com/deltakosh/))
-   Display Oculus Quest controller when using a Quest in WebVR ([TrevorDev](https://github.com/TrevorDev))
-   Added startAndReleaseDragOnPointerEvents property to pointerDragBehavior which can be set to false for custom drag triggering ([TrevorDev](https://github.com/TrevorDev))
-   Added optional picking predicate to pointerDragBehavior for filtering affected meshes ([Exolun](https://github.com/Exolun))
-   Added accessor functions for `PointerDragBehavior._options` ([Popov72](https://github.com/Popov72))
-   Effect renderer to render one or multiple shader effects to a texture ([TrevorDev](https://github.com/TrevorDev))
-   Added url parameters to web request modifiers ([PierreLeBlond](https://github.com/PierreLeBlond))
-   Added `VRExperienceHelper.exitVROnDoubleTap` ([Deltakosh](https://github.com/deltakosh/))
-   Added `Scene.getTextureByUniqueID` ([aWeirdo](https://github.com/aWeirdo/))
-   Added support for 180 VR videos in `VideoDome` ([RaananW](https://github.com/RaananW/))
-   Added optional parameter to use Euler angles in planeRotationGizmo ([CedricGuillemet](https://github.com/CedricGuillemet))
-   Added `AnimationGroup.onAnimationGroupLoopObservable` ([Deltakosh](https://github.com/deltakosh/))
-   Supports custom materials to generate glow through `referenceMeshToUseItsOwnMaterial` in the `GlowLayer` ([sebavan](https://github.com/sebavan))
-   Added `RawTexture2DArray` to enable use of WebGL2 2D array textures by custom shaders ([atg](https://github.com/atg))
-   Added multiview support for the shader material (and the line-mesh class) ([RaananW](https://github.com/RaananW/))
-   Added various (interpolation) functions to Path3D, also `alignTangentsWithPath`, `slice`, `getClosestPositionTo` ([Poolminer](https://github.com/Poolminer/))
-   Allow setting of `BABYLON.Basis.JSModuleURL` and `BABYLON.Basis.WasmModuleURL`, for hosting the Basis transcoder locally ([JasonAyre](https://github.com/jasonyre))
-   PNG support for browsers not supporting SVG ([RaananW](https://github.com/RaananW/))
-   Device orientation event permissions for iOS 13+ ([RaananW](https://github.com/RaananW/))
-   Added `DirectionalLight.autoCalcShadowZBounds` to automatically compute the `shadowMinZ` and `shadowMaxZ` values ([Popov72](https://github.com/Popov72))
-   Added `CascadedShadowGenerator.autoCalcDepthBounds` to improve the shadow quality rendering ([Popov72](https://github.com/Popov72))
-   Improved cascade blending in CSM shadow technique ([Popov72](https://github.com/Popov72))
-   Speed optimization when cascade blending is not used in CSM shadow technique ([Popov72](https://github.com/Popov72))
-   Added `RenderTargetTexture.getCustomRenderList` to overload the render list at rendering time (and possibly for each layer (2DArray) / face (Cube)) ([Popov72](https://github.com/Popov72))
-   Make sure all properties of CascadedShadowMap class are serialized/parsed ([Popov72](https://github.com/Popov72))
-   Added `textures/opacity.png` file to the Playground ([Popov72](https://github.com/Popov72))
-   Refactored the shadow generators code ([Popov72](https://github.com/Popov72))
-   Supports clip planes with shadows ([sebavan](https://github.com/sebavan))
-   Added Workbench color scheme for VSCode ([drigax](https://github.com/drigax) & [Patrick Ryan](https://github.com/PatrickRyanMS))
-   Playground switch buttons are more intuitive ([#7601](https://github.com/BabylonJS/Babylon.js/issues/7601)) ([RaananW](https://github.com/RaananW/))
-   Added support of screen based motion blur in `MotionBlurPostProcess` (default mode is object based) to be used as a fallback to save performances on large scenes ([julien-moreau](https://github.com/julien-moreau))

#### Engine

-   Improved instanceMesh with user defined custom buffers [Doc](/features/divingDeeper/mesh/copies/instances#custom-buffers) ([Deltakosh](https://github.com/deltakosh/))
-   Morph targets now can morph UV channel as well ([Deltakosh](https://github.com/deltakosh/))
-   Added MorphTarget support to the DepthRenderer, GeometryBufferRenderer and OutlineRenderer ([MarkusBillharz](https://github.com/MarkusBillharz))
-   Added preprocessors for shaders to improve how shaders are compiled for WebGL1/2 or WebGPU ([Deltakosh](https://github.com/deltakosh/))
-   Added enterPointerlock and exitPointerlock (Separated from enterFullscreen) ([aWeirdo](https://github.com/aWeirdo/))
-   Added support for `vertexSource` and `fragmentSource` parameters to `ShaderMaterial` ([Deltakosh](https://github.com/deltakosh/))

#### Inspector

-   Added support for Euler edition only for angles (can be turned off in the new inspector settings) ([Deltakosh](https://github.com/deltakosh/))
-   Added an option to ignore backfaces for picking (can be turned on and off in the new inspector settings) ([Deltakosh](https://github.com/deltakosh/))
-   Added support for `ShadowGenerator` ([Deltakosh](https://github.com/deltakosh/))
-   Added support for scene normalization ([Deltakosh](https://github.com/deltakosh/))
-   Added support for morph targets ([Deltakosh](https://github.com/deltakosh/))
-   Added context menu to add `SSAORenderingPipeline` and `SSAO2RenderingPipeline` ([Deltakosh](https://github.com/deltakosh/))
-   Added support for texture creation and assignments per material ([Deltakosh](https://github.com/deltakosh/))
-   Added support for occlusion properties ([Deltakosh](https://github.com/deltakosh/))
-   Texture channels are now displayed in grayscale ([Deltakosh](https://github.com/deltakosh/))
-   Ambiant and metallic maps are displayed correctly on PBR material even when using ORM packed texture ([Deltakosh](https://github.com/deltakosh/))
-   Added support for inspectable strings ([Deltakosh](https://github.com/deltakosh/))
-   Added support for CreateScreenshotUsingRenderTarget ([13djwright](https://github.com/13djwright/))
-   Added support for `Material.depthFunction` property ([Popov72](https://github.com/Popov72))
-   Added an optional config option `initialTab` ([ycw](https://github.com/ycw/))
-   Added support for ImportAnimations ([noalak](https://github.com/noalak/))
-   Added support for Cascaded Shadow Maps ([Popov72](https://github.com/Popov72))
-   Added context menu to add `NodeMaterial` ([Deltakosh](https://github.com/deltakosh/))
-   Added option to switch material per mesh ([Deltakosh](https://github.com/deltakosh/))

#### Tools

-   Added `Tools.CreateScreenshotAsync` and `Tools.CreateScreenshotUsingRenderTargetAsync` ([mehmetoguzderin](https://github.com/mehmetoguzderin/))
-   Added `Color3.toHSV()`, `Color3.toHSVToRef()` and `Color3.HSVtoRGBToRef()` ([Deltakosh](https://github.com/deltakosh/))
-   Added `ShadowGenerator.onAfterShadowMapRenderObservable` and `ShadowGenerator.onAfterShadowMapMeshRenderObservable` ([Deltakosh](https://github.com/deltakosh/))
-   Added support for side by side and top bottom images in the `PhotoDome` ([Deltakosh](https://github.com/deltakosh/))
-   Added playground ts-local (TypeScript support for local playground) ([pjoe](https://github.com/pjoe/))
-   Added RGBD Texture tools [Sebavan](https://github.com/sebavan/)
-   Bumped Monaco Editor to 0.18.1 and improved TypeScript compilation pipeline in the playground ([sailro](https://github.com/sailro))
-   Added support for clickable errors in the playground ([sailro](https://github.com/sailro))
-   Added a color picker and previewer for BABYLON.ColorX invocations in the playground ([sailro](https://github.com/sailro))
-   Added support for diffing snippets in the playground ([sailro](https://github.com/sailro))
-   Added diff navigator in the playground ([sailro](https://github.com/sailro))
-   Added custom filter to remove internals from the completion in the playground ([sailro](https://github.com/sailro))
-   Added support for tagging deprecated members (both in editor and for completion) in the playground ([sailro](https://github.com/sailro))
-   Added preview area pop up for NME ([Kyle Belfort](https://github.com/belfortk))
-   Added comments to frames in NME ([Kyle Belfort](https://github.com/belfortk))
-   Make frames resizable in NME ([Kyle Belfort](https://github.com/belfortk))
-   Implement NME Preview Area Redesign ([Kyle Belfort](https://github.com/belfortk))

#### Meshes

-   Added `TransformNode.instantiateHierarchy()` which try to instantiate (or clone) a node and its entire hiearchy ([Deltakosh](https://github.com/deltakosh/))
-   Added new CreateTiledPlane and CreateTiledBox ([JohnK](https://github.com/BabylonJSGuide/))
-   Added absolute scaling and rotation getters ([haroldma](https://github.com/haroldma))
-   Added `BILLBOARDMODE_USE_POSITION` flag to billboards allowing use of camera positioning instead of orientation for mesh rotation ([delaneyj](https://github.com/delaneyj))
-   Added accessor functions for `SubMesh._materialDefines` ([Popov72](https://github.com/Popov72))
-   Generator type used in `TrailMesh` constructor is now `TransformNode` instead of `AbstrachMesh` ([Popov72](https://github.com/Popov72))
-   Added the `useVertexAlpha` options to `MeshBuilder.CreateDashedLines` ([Popov72](https://github.com/Popov72))

#### Physics

-   Update Ammo.js library to support global collision contact callbacks ([MackeyK24](https://github.com/MackeyK24/))
-   Update Ammo.js library to allow native capsule shape impostors ([MackeyK24](https://github.com/MackeyK24/))
-   Update Ammo.js library to allow your own broadphase overlapping pair cache ([MackeyK24](https://github.com/MackeyK24/))
-   Update Ammo.js library for custom impostor shapes. PhysicsImpostor.CustomImposter type and AmmoJSPlugin.OnCreateCustomShape factoty function ([MackeyK24](https://github.com/MackeyK24/))
-   Update Ammo.js library and AmmoJS plugin to support ellipsoid ([CedricGuillemet](https://github.com/CedricGuillemet/))
-   Physics update substeps ([CedricGuillemet](https://github.com/CedricGuillemet))

#### Loaders

-   Added support for non-float accessors in animation data for glTF loader. ([bghgary](https://github.com/bghgary))
-   Support loading cube data in the .basis loader ([TrevorDev](https://github.com/TrevorDev))
-   Load glTF extras into BJS metadata ([pjoe](https://github.com/pjoe))
-   Added support for morph target names via `mesh.extras.targetNames` when loading a glTF ([zeux](https://github.com/zeux))
-   Added support for using HTTP range requests when loading `MSFT_lod` extension from a glTF binary. ([bghgary](https://github.com/bghgary))
-   Added a flag to enable/disable creation of instances for glTF loader. ([bghgary](https://github.com/bghgary))
-   Added an order property to glTF loader extensions to support reordering. ([bghgary](https://github.com/bghgary))
-   Added support for GLTF clearcoat extension [Sebavan](https://github.com/sebavan/)
-   Added support for GLTF specular extension [Sebavan](https://github.com/sebavan/)
-   Added support for GLTF sheen extension [Sebavan](https://github.com/sebavan/)
-   Added support for GLTF mesh quantization extension ([zeux](https://github.com/zeux))
-   Added support for 8 bone influences to glTF loader ([zeux](https://github.com/zeux))
-   Added support for animations import from separate files ([noalak](https://github.com/noalak/))
-   Use web workers to validate glTF to avoid blocking the main thread. ([bghgary](https://github.com/bghgary))
-   Update glTF validator to 2.0.0-dev.3.1. ([bghgary](https://github.com/bghgary))
-   Fix an issue with disposing materials and textures too aggressively in MSFT_lod loader extension. ([bghgary](https://github.com/bghgary))
-   Added experimental support for loading KTX2 files and `KHR_texture_basisu` glTF extension. ([bghgary](https://github.com/bghgary))

#### Materials

-   Added `ShaderMaterial.setColor4Array` ([JonathanTron](https://github.com/JonathanTron/))
-   Added `ShaderMaterial.setArray4` ([JonathanTron](https://github.com/JonathanTron/))
-   Added get/set accessors for `ShaderMaterial._shaderPath` ([Popov72](https://github.com/Popov72))
-   Added `scene.environmentIntensity` to control the IBL strength overall in a scene ([Sebavan](https://github.com/sebavan/))
-   Added support of image processing for `WaterMaterial` ([julien-moreau](https://github.com/julien-moreau))
-   Added `pbrBRDFConfiguration.useSpecularGlossinessInputEnergyConservation` to allow Specular-Workflow energy conservation to be turned off ([ColorDigital-PS](https://github.com/ColorDigital-PS)).
-   Added support for the `freeze` / `unfreeze` functions in `ShaderMaterial` ([Popov72](https://github.com/Popov72))
-   Added `depthFunction` new property to `Material` base class ([Popov72](https://github.com/Popov72))
-   Added `setCompressedTextureExclusions` method to `Engine` to allow for skipping compressed textures on certain files ([abogartz](https://github.com/abogartz))

#### ScreenshotTools

-   Added interface for argument `size` of screenshot methods ([Dok11](https://github.com/Dok11/))
-   Implementation usage of precision in combination height and width params ([Dok11](https://github.com/Dok11/))
-   Added a parameter to `CreateScreenshotUsingRenderTarget` to render sprites ([Popov72](https://github.com/Popov72))

#### Sounds

-   Added `ISoundOptions.skipCodecCheck` to make `Sound` more flexible with URLs ([nbduke](https://github.com/nbduke))
-   Added `Scene.audioListenerPositionProvider` property, to enable setting custom position of audio listener ([Foxhoundn](https://github.com/foxhoundn))

#### Sprites

-   SpritePackedManager extends SpriteManager so that a sprite sheet with different size sprites can be used ([JohnK](https://github.com/BabylonJSGuide))
-   MultiPickSprite and multiPickSpriteWithRay added to sprites ([JohnK](https://github.com/BabylonJSGuide))
-   SpritePackedManager support for JSON Objects that where not stringified, of with the frames parameter accepting Objects and Arrays ([Pryme8](https://github.com/Pryme8))
-   Added `SpriteMap` for creation of grid-based dynamically animated sprite atlas rendering (Beta) ([Pryme8](https://github.com/Pryme8))
-   Add `SpriteManager.disableDepthWrite` property ([Popov72](https://github.com/Popov72))

#### WebXR / WebVR

-   WebXR webVR parity helpers (Vive, WMR, Oculus Rift) ([TrevorDev](https://github.com/TrevorDev))
-   Compliance with the mozilla WebXR emulator for chrome and firefox ([RaananW](https://github.com/RaananW/))
-   Use the same icon as in VR ([RaananW](https://github.com/RaananW/))
-   Gamepad object is now exposed in the WebXRController class ([RaananW](https://github.com/RaananW/))
-   If canvas does not have WebXR support the scene will still render (mainly Firefox) ([RaananW](https://github.com/RaananW/))
-   Added support for foveated rendering in Oculus Quest ([Deltakosh](https://github.com/deltakosh/))
-   Added option to configure the output canvas ([RaananW](https://github.com/RaananW/))
-   Supporting multisampled multiview rendering using the oculus multiview extension ([RaananW](https://github.com/RaananW/))
-   Preparing to deprecate supportsSession in favor of isSupportedSession ([RaananW](https://github.com/RaananW/))
-   Added onControllerModelLoaded observable for WebXR ([RaananW](https://github.com/RaananW/))
-   UI Button has options to set different session mode and reference type ([RaananW](https://github.com/RaananW/))
-   Added option to change the teleportation duration in the VRExperienceHelper class ([https://github.com/LeoRodz](https://github.com/LeoRodz))
-   Added support to teleport the camera at constant speed in the VRExperienceHelper class ([https://github.com/LeoRodz](https://github.com/LeoRodz))
-   VRExperienceHelper has now an XR fallback to force XR usage (beta) ([RaananW](https://github.com/RaananW/))
-   Added option to change the teleportation easing function in the VRExperienceHelper class ([https://github.com/LeoRodz](https://github.com/LeoRodz))
-   Windows motion controller mapping corrected to XR (xr-standard) ([RaananW](https://github.com/RaananW/))
-   Pointer-Event simulation for screen target ray mode ([RaananW](https://github.com/RaananW/))
-   New observable that triggers when a session was initialized ([RaananW](https://github.com/RaananW/))
-   WebXR teleportation can now be disabled after initialized or before created ([RaananW](https://github.com/RaananW/))
-   New Features Manager for WebXR features ([RaananW](https://github.com/RaananW/))
-   New features - Plane detection, Hit test, Background remover ([RaananW](https://github.com/RaananW/))
-   XR Camera's API is Babylon-conform (position, rotationQuaternion, world matrix, direction etc') ([#7239](https://github.com/BabylonJS/Babylon.js/issues/7239)) ([RaananW](https://github.com/RaananW/))
-   XR Input now using standard profiles and completely separated from the gamepad class ([#7348](https://github.com/BabylonJS/Babylon.js/issues/7348)) ([RaananW](https://github.com/RaananW/))
-   Teleportation and controller selection are now WebXR features. ([#7290](https://github.com/BabylonJS/Babylon.js/issues/7290)) ([RaananW](https://github.com/RaananW/))
-   Teleportation allows selecting direction before teleporting when using thumbstick / touchpad. ([#7290](https://github.com/BabylonJS/Babylon.js/issues/7290)) ([RaananW](https://github.com/RaananW/))
-   It is now possible to force a certain profile type for the controllers ([#7348](https://github.com/BabylonJS/Babylon.js/issues/7375)) ([RaananW](https://github.com/RaananW/))
-   WebXR camera is initialized on the first frame, including copying transformation from native camera (except for in AR) ([#7389](https://github.com/BabylonJS/Babylon.js/issues/7389)) ([RaananW](https://github.com/RaananW/))
-   Selection has gaze mode (which can be forced) and touch-screen support ([#7395](https://github.com/BabylonJS/Babylon.js/issues/7395)) ([RaananW](https://github.com/RaananW/))
-   Laser pointers can be excluded from lighting influence so that they are always visible in WebXR / WebVR ([#7323](https://github.com/BabylonJS/Babylon.js/issues/7323)) ([RaananW](https://github.com/RaananW/))
-   Full support for the online motion controller repository ([#7323](https://github.com/BabylonJS/Babylon.js/issues/7323)) ([RaananW](https://github.com/RaananW/))
-   New XR feature - XR Controller physics impostor for motion controllers / XR Input sources ([RaananW](https://github.com/RaananW/))
-   Teleportation between different ground levels in WebXR is enabled ([RaananW](https://github.com/RaananW/))
-   Utility Meshes for XR (teleportation ring, selection rays) can now be rendered using a utility layer ([#7563](https://github.com/BabylonJS/Babylon.js/issues/7563)) ([RaananW](https://github.com/RaananW/))
-   Teleportation supports snap-to (anchor) points ([#7441](https://github.com/BabylonJS/Babylon.js/issues/7441)) ([RaananW](https://github.com/RaananW/))

#### Ray

-   Added `Ray.intersectsAxis` to translate screen to axis coordinates without checking collisions ([horusscope](https://github.com/horusscope))

#### GUI

-   Added `xmlLoader` to load GUI layouts from XML ([null0924](https://github.com/null0924))
-   Added `disableMobilePrompt` option to InputText for OculusQuest(and other android base VR devices) ([shinyoshiaki](https://github.com/shinyoshiaki))
-   Added `Button.delegatePickingToChildren` to let buttons delegate hit testing to embedded controls ([Deltakosh](https://github.com/deltakosh/))
-   Added `Container.maxLayoutCycle` and `Container.logLayoutCycleErrors` to get more control over layout cycles ([Deltakosh](https://github.com/deltakosh/))
-   Added `StackPanel.ignoreLayoutWarnings` to disable console warnings when controls with percentage size are added to a StackPanel ([Deltakosh](https://github.com/deltakosh/))
-   Added `_getSVGAttribs` functionality for loading multiple svg icons from an external svg file via icon id. Fixed bug for Chrome. Strip icon id from image url for firefox. ([lockphase](https://github.com/lockphase/))
-   Scroll Viewer extended to include the use of images in the scroll bars([JohnK](https://github.com/BabylonJSGuide/))
-   Added `ScrollViewer.freezeControls` property to speed up rendering ([Popov72](https://github.com/Popov72))
-   Added `ImageScrollBar.num90RotationInVerticalMode` property to let the user rotate the pictures when in vertical mode ([Popov72](https://github.com/Popov72))
-   Modified isPointerBlocker to block mouse wheel scroll events. ScrollViewer mouse scroll no longer dependent on scene. ([lockphase](https://github.com/lockphase/))

#### Particles

-   Added `particleSystem.isLocal` for CPU particles to let the particles live in emitter local space. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#local-space) ([Deltakosh](https://github.com/deltakosh/))
-   Added the feature `expandable` to the Solid Particle System ([jerome](https://github.com/jbousquie/))
-   Added the feature `removeParticles()` to the Solid Particle System ([jerome](https://github.com/jbousquie/))
-   Added the feature "storable particles" and `insertParticlesFromArray()` to the Solid Particle System ([jerome](https://github.com/jbousquie/))
-   Added the support for MultiMaterials to the Solid Particle System ([jerome](https://github.com/jbousquie/))
-   Added support for `CustomParticleEmitter`. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#custom-emitter) ([Deltakosh](https://github.com/deltakosh/))
-   Added support for `MeshParticleEmitter`. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#mesh-emitter) ([Deltakosh](https://github.com/deltakosh/))

#### Navigation Mesh

-   Added moveAlong function to cast a segment on mavmesh ([CedricGuillemet](https://github.com/CedricGuillemet/))

#### Node Material

-   Added Light intensity output to LightInformationBlock ([Drigax](https://github.com/drigax))

#### Serializers

-   Added support for `AnimationGroup` serialization ([Drigax](https://github.com/drigax/))
-   Expanded animation group serialization to include all targeted TransformNodes ([Drigax](https://github.com/drigax/))

#### Texture Packer

-   Added TexturePacker Class ([Pryme8](https://github.com/Pryme8))
-   Added TexturePackerLoader Class ([Pryme8](https://github.com/Pryme8))

#### Documentation

-   Added a note on shallow bounding of getBoundingInfo ([tibotiber](https://github.com/tibotiber))
-   Added a typo fix to the ArcRotateCamera setPosition method description ([schm-dt](https://github.com/schm-dt))

### Bug fixes

-   Fixed Textblock line spacing evaluation when linespacing > 0 ([Deltakosh](https://github.com/deltakosh/))
-   Fixed Xbox One gamepad controller button schemes ([MackeyK24](https://github.com/MackeyK24/))
-   Removing `assetContainer` from scene will also remove gui layers ([TrevorDev](https://github.com/TrevorDev))
-   A scene's input manager not adding key listeners when the canvas is already focused ([Poolminer](https://github.com/Poolminer))
-   Runtime animation `goToFrame` when going back in time now correctly triggers future events when reached ([zakhenry](https://github.com/zakhenry))
-   Fixed bug in `Ray.intersectsTriangle` where the barycentric coordinates `bu` and `bv` being returned is actually `bv` and `bw`. ([bghgary](https://github.com/bghgary))
-   Do not call `onError` when creating a texture when falling back to another loader ([TrevorDev](https://github.com/TrevorDev))
-   Context loss should not cause PBR materials to render black or instances to stop rendering ([TrevorDev](https://github.com/TrevorDev))
-   Only cast pointer ray input when pointer is locked in WebVR ([TrevorDev](https://github.com/TrevorDev))
-   Fix Right Hand coordinates with directional lights and shadows, hemispheric lights and spot lights ([CedricGuillemet](https://github.com/CedricGuillemet))
-   Avoid using default utility layer in gizmo manager to support multiple scenes ([TrevorDev](https://github.com/TrevorDev))
-   Fix bug when adding and removing observers in quick succession ([sable](https://github.com/thscott))
-   Cannon and Ammo forceUpdate will no longer cause an unexpected exception ([TrevorDev](https://github.com/TrevorDev))
-   Loading the same multi-material twice and disposing one should not impact the other ([TrevorDev](https://github.com/TrevorDev))
-   GLTF exporter should no longer duplicate exported texture data ([Drigax](https://github.com/Drigax))
-   Avoid exception when disposing of Ammo cloth physics ([TrevorDev](https://github.com/TrevorDev))
-   Make planeDragGizmo usable on its own ([TrevorDev](https://github.com/TrevorDev))
-   Fix useObjectOrienationForDragging for pointerDragBehavior when using a single axis drag ([TrevorDev](https://github.com/TrevorDev))
-   Fix VR button not positioning correctly in canvas ([haroldma](https://github.com/haroldma))
-   Fix check for material needing alpha blending in OutlineRenderer ([mkmc](https://github.com/mkmc))
-   Fixed: scene's input manager's detachControl doesn't remove a wheel event listener ([RamilKadyrov](https://github.com/RamilKadyrov))
-   Fixed Solid Particle System particle's idx and idxInShape initialization ([RamilKadyrov](https://github.com/RamilKadyrov))
-   Added in ArcRotateCamera.storeState to save targetScreenOffset, in restoreState to restore it ([RamilKadyrov](https://github.com/RamilKadyrov))
-   Fixed `CubeTexture` to keep custom `filesList` when serializing/parsing ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `StandardRenderingPipeline` to properly dispose post-processes from attached cameras ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `VolumetricLightScattering` post-process to use a custom vertex shader instead of the depth vertex shader. ([julien-moreau](https://github.com/julien-moreau))
-   Fixed missing check in sceneTreeItemComponent resulting in gizmo to not end drag ([CedricGuillemet](https://github.com/CedricGuillemet))
-   Added missing callback triggers within texture loaders ([PierreLeBlond](https://github.com/PierreLeBlond))
-   Fixed `TextureLinkLineComponent` to no longer invert inspector-loaded textures ([Drigax](https://github.com/drigax))
-   Fixed a single frame drop after leaving webxr on some devices ([RaananW](https://github.com/RaananW/))
-   Fixed bug where vignette aspect ratio would be wrong when rendering direct to canvas
-   Fixed Path2 length computation ([Poolminer](https://github.com/Poolminer/))
-   Cloning of `ShaderMaterial` also clone `shaderPath` and `options` properties ([Popov72](https://github.com/Popov72))
-   Prevent an infinite loop when calling `engine.dispose()` in a scene with multiple `SoundTracks` defined ([kirbysayshi](https://github.com/kirbysayshi))
-   Fixed missing properties in serialization / parsing of `coneParticleEmitter` ([Popov72](https://github.com/Popov72))
-   Fix a bug with exit VR and Edge ([RaananW](https://github.com/RaananW/))
-   Fixed an issue with size of texture in multiview ([RaananW](https://github.com/RaananW/))
-   Fixed Path3D (bi)normals computation for specific edge cases ([Poolminer](https://github.com/Poolminer/))
-   WebXR UI BUtton will only change to "In XR" after XR Session started ([RaananW](https://github.com/RaananW/))
-   Fix bug when we call `Mesh.render` twice and the material is still not ready on the second call ([barroij](https://github.com/barroij/))
-   Fixed an issue with pose input in webxr ([RaananW](https://github.com/RaananW/))
-   Fixed bug when parsing animation group without 'to' value ([noalak](https://github.com/noalak/))
-   isRightCamera and isLeftCamera were not set in WebXR ([RaananW](https://github.com/RaananW/))
-   Sandbox will now load assets relatively path-ed to same folder ([Kyle Belfort](https://github.com/belfortk))
-   Playground will now render the returned scene from createScene() when there are multiple scenes added to engine ([Kyle Belfort](https://github.com/belfortk))
-   Fixed bug so Playground will now download .env texture files to ./textures in .zip ([Kyle Belfort](https://github.com/belfortk))
-   It was not possible to change the gaze and laser color in VR ([#7323](https://github.com/BabylonJS/Babylon.js/issues/7323)) ([RaananW](https://github.com/RaananW/))
-   Fixed issue where textures exported using Safari web browser are Y mirrored. ([#7352](https://github.com/BabylonJS/Babylon.js/issues/7352)) ([Drigax](https://github.com/drigax))
-   Fix a bug when resizing a MRT ([Popov72](https://github.com/Popov72))
-   Fixed an infinite clone recursion bug in `InstancedMesh` due to `DeepCopier.DeepCopy` cloning `parent` ([Poolminer](https://github.com/Poolminer/))
-   Fixed an issue with multiview textures ([RaananW](https://github.com/RaananW/))
-   Screenshot height and width is now forced to be integers to prevent mismatch with openGL context ([jekelija](https://github.com/jekelija))
-   Fix shadow bound calculation in CSM shadow technique ([Popov72](https://github.com/Popov72))
-   Disposing of the depthReducer used in CSM ([Popov72](https://github.com/Popov72))
-   Fixed an issue with teleportation detach and attach ([#7419](https://github.com/BabylonJS/Babylon.js/issues/7419)) ([RaananW](https://github.com/RaananW/))
-   Physics compound calculations were incorrect ([#7407](https://github.com/BabylonJS/Babylon.js/issues/7407)) ([RaananW](https://github.com/RaananW/))
-   Fix bug NME bug where preview area crashes on pop up when NME is opened from playground ([Kyle Belfort](https://github.com/belfortk))
-   Fixed an issue with isSessionSupported return value being ignored ([#7501](https://github.com/BabylonJS/Babylon.js/issues/7501)) ([RaananW](https://github.com/RaananW/))
-   Added isRigCamera to rig cameras so they can be detected. Used to fix a bug with utility layer and WebXR ([#7517](https://github.com/BabylonJS/Babylon.js/issues/7517)) ([RaananW](https://github.com/RaananW/))
-   Fixed bug in the `ScrollViewer` GUI class when setting a `idealWidth` or `idealHeight` on the ADT ([Popov72](https://github.com/Popov72))
-   Fixed bug in the `Image` GUI class where some properties were lost after a rotation by n x 90° ([Popov72](https://github.com/Popov72))
-   Fixed bug in the `Image` GUI class when rotating a SVG picture ([Popov72](https://github.com/Popov72))
-   Fix for bug where NME would crash if frames did not have comments ([Kyle Belfort](https://github.com/belfortk))
-   Fix wrong import of \_TimeToken ([Sebavan](https://github.com/sebavan/)
-   Fix shadows not rendered correctly when using point lights ([Popov72](https://github.com/Popov72))
-   Prevent depth buffer clear in shadow maps ([Sebavan](https://github.com/sebavan/)
-   Fix for bug where the light gizmo causes lights to flip orientation ([#7603](https://github.com/BabylonJS/Babylon.js/issues/7603)) ([drigax](https://github.com/drigax))
-   Fix for bug where directional lights are inverted when using a right handed scene coordinate system. ([drigax](https://github.com/drigax))
-   Fix subSurface parameters not copied in the PBR clone methods ([Popov72](https://github.com/Popov72))
-   Fix for bug where round-tripped glTF imported scenes are encapsulated in a second root node ([#6349](https://github.com/BabylonJS/Babylon.js/issues/6349))([drigax](https://github.com/drigax) & [noalak](https://github.com/noalak))
-   Fix `HDRCubeTexture` construction, `generateHarmonics` was not properly taken into account ([Popov72](https://github.com/Popov72))
-   VideoTexture poster respects invertY ([Sebavan](https://github.com/sebavan/)
-   Fix for bug where round-tripped glTF imported scenes have incorrect light orientation, and duplicated parent nodes ([#7377](https://github.com/BabylonJS/Babylon.js/issues/7377))([drigax](https://github.com/drigax))
-   Fix bug in PBR sheen where the sheen effect could be a little darker than expected when using direct lighting ([Popov72](https://github.com/Popov72)
-   Fix bug in PBR shader when `reflectionTexture.linearSpecularLOD` is `true` ([Popov72](https://github.com/Popov72))
-   Fix for bug where resizing the bottom of a frame at times will not work for any frame in the graph ([#7377](https://github.com/BabylonJS/Babylon.js/issues/7672))([Kyle Belfort](https://github.com/belfortk))
-   Fix bug in PBR sheen when used with clear coat and no env texture provided ([Popov72](https://github.com/Popov72))
-   Fix for bug where Preview Area pop up does not change background color across windows ([#7377](https://github.com/BabylonJS/Babylon.js/issues/7684))([Kyle Belfort](https://github.com/belfortk))
-   Fix for bug where comments would break out of frames and break resizing of frames ([Kyle Belfort](https://github.com/belfortk))
-   Fix for bug where frames without comments would display undefined at the bottom right corner ([Kyle Belfort](https://github.com/belfortk))

### Breaking changes

-   Setting mesh.scaling to a new vector will no longer automatically call forceUpdate (this should be done manually when needed) ([TrevorDev](https://github.com/TrevorDev))
-   `Tools.ExtractMinAndMaxIndexed` and `Tools.ExtractMinAndMax` are now ambiant functions (available on `BABYLON.extractMinAndMaxIndexed` and `BABYLON.extractMinAndMax`) ([Deltakosh](https://github.com/deltakosh/))
-   `Tools.QueueNewFrame` was removed in favor of `Engine.QueueNewFrame` ([Deltakosh](https://github.com/deltakosh/))
-   Removed external data from Engine (`addExternalData`, `getExternalData`, `getOrAddExternalDataWithFactory`, `removeExternalData`) ([Deltakosh](https://github.com/deltakosh/))
-   The glTF loader extensions that map to glTF 2.0 extensions will now be disabled if the extension is not present in `extensionsUsed`. ([bghgary](https://github.com/bghgary))
-   The STL loader does not create light or camera automatically, please use `scene.createDefaultCameraOrLight();` in your code [Sebavan](https://github.com/sebavan/)
-   The glTF2 exporter extension no longer ignores childless empty nodes.([drigax](https://github.com/drigax))
-   Default culling strategy changed to CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY ([Deltakosh](https://github.com/deltakosh/))
-   `MaterialHelper.BindLight` and `MaterialHelper.BindLights` do not need the usePhysicalLight anymore ([Sebavan](https://github.com/sebavan/))
-   `Mesh.bakeTransformIntoVertices` now preserves child world-space transforms([drigax](https://github.com/drigax))
-   Removed `setTexturesToUse` and `setCompressedTextureExclusions` from Engine. ([bghgary](https://github.com/bghgary))

## 4.0.0 (May 1st 2019)

Associated release: https://github.com/BabylonJS/Babylon.js/releases/tag/4.0.3

### Major updates

-   New [fancy forum](https://forum.babylonjs.com)! ([Deltakosh](https://github.com/deltakosh))
-   [Inspector v2.0](/toolsAndResources/tools/inspector). [Dev log](https://medium.com/@babylonjs/dev-log-creating-the-new-inspector-b15c50900205) ([Deltakosh](https://github.com/deltakosh))
-   Added support for [parallel shader compilation](https://www.khronos.org/registry/webgl/toolsAndResources/KHR_parallel_shader_compile/) ([Deltakosh](https://github.com/deltakosh))
-   Added [Object Based Motion Blur](http://doc.babylonjs.com/how_to/using_motionblurpostprocess) post-process ([julien-moreau](https://github.com/julien-moreau))
-   Added [support for ammo.js](/features/divingDeeper/physics/usingPhysicsEngine) as a physics plugin (Composite objects, motors, joints) ([TrevorDev](https://github.com/TrevorDev))
    -   Added [support for soft bodies](/features/divingDeeper/physics/softBodies), which are 3D softbody, 2D cloth and 1D rope, in ammo.js physics plugin ([JohnK](https://github.com/BabylonJSGuide))
    -   Added support for [Convex Hull Impostor](https://github.com/kripken/ammo.js/blob/master/bullet/src/BulletCollision/CollisionShapes/btConvexHullShape.h) using ammo.js plugin ([MackeyK24](https://github.com/mackeyk24))
    -   Added `AmmoJSPlugin` scene file loader ([MackeyK24](https://github.com/mackeyk24))
-   Added support for [WebXR](/features/divingDeeper/webXR/introToWebXR) ([TrevorDev](https://github.com/TrevorDev))
    -   Added `customAnimationFrameRequester` to allow sessions to hook into engine's render loop ([TrevorDev](https://github.com/TrevorDev))
    -   Added `Camera customDefaultRenderTarget` to allow cameras to render to a custom render target (e.g., XR framebuffer) instead of the canvas ([TrevorDev](https://github.com/TrevorDev))
    -   Added webXR camera which can be updated by a `webXRSession` ([TrevorDev](https://github.com/TrevorDev))
    -   Added `webXRSessionManager` to bridge `xrSession` to babylon's camera/engine ([TrevorDev](https://github.com/TrevorDev))
    -   Added `webXRExperienceHelper` to setup a default XR experience ([TrevorDev](https://github.com/TrevorDev))
    -   Added `WebXREnterExitUI` and `WebXRManagedOutputCanvas` classes to configure the XR experience ([TrevorDev](https://github.com/TrevorDev))
    -   Added `WebXRInput` to manage controllers for the XR experience ([TrevorDev](https://github.com/TrevorDev))
    -   Control WebXR camera rotation using parent container ([TrevorDev](https://github.com/TrevorDev))
-   GUI:
    -   Added `control.useBitmapCache` to optimize re-rendering of complex controls by keeping a cached version ([Deltakosh](https://github.com/deltakosh))
    -   Added new [ImageBasedSlider](http://doc.babylonjs.com/how_to/gui#imagebasedslider) to let users customize sliders using images ([Deltakosh](https://github.com/deltakosh))
    -   Added support for clipboard events to let users perform `cut`, `copy` and `paste` events ([Saket Saurabh](https://github.com/ssaket))
    -   Added new [ScrollViewer](/features/divingDeeper/gui/scrollViewer) with mouse wheel scrolling for larger containers to be viewed using Sliders ([JohnK](https://github.com/BabylonJSGuide/) and [Deltakosh](https://github.com/deltakosh))
    -   Moved to a measure/draw mechanism ([Deltakosh](https://github.com/deltakosh))
    -   Added support for [nine patch stretch](https://www.babylonjs-playground.com/#G5H9IN#2) mode for images. ([Deltakosh](https://github.com/deltakosh))
    -   Added invalidateRect to [AdvancedDynamicTexture](/typedoc/classes/babylon.gui.advanceddynamictexture) to improve perf for heavily populated GUIs, works with shadows ([TrevorDev](https://github.com/TrevorDev))
-   Migrated the code to modules and deploy [ES6 npm packages](/workflow/packages/treeShaking) ([Sebavan](https://github.com/Sebavan))
-   Added [TrailMesh](/features/divingDeeper/mesh/trailMesh) class. Credit to furcatomasz ([danjpar](https://github.com/danjpar))
-   Support rendering to a multiview outputRenderTargetTexture with multiview engine component to improve performance for XR scenarios ([TrevorDev](https://github.com/TrevorDev))
-   PBR ([Sebavan](https://github.com/Sebavan)):
    -   Added [clear coat](/features/divingDeeper/materials/using/masterPBR#clear-coat)
    -   Added [anisotropy](/features/divingDeeper/materials/using/masterPBR#anisotropy)
    -   Added [sheen](/features/divingDeeper/materials/using/masterPBR#sheen)
    -   Added [sub-surface](/features/divingDeeper/materials/using/masterPBR#sub-surface)
    -   Added [energy conservation through multiscattering BRDF](/features/divingDeeper/materials/using/masterPBR#energy-conservation)
    -   Added [Inspector Debug Mode](/features/divingDeeper/materials/using/masterPBR#how-to-debug)
    -   Added Smith Height Correlated Visibility term ([white paper](http://jcgt.org/published/0003/02/03/))
    -   Added [SH Harmonics](/features/divingDeeper/materials/using/masterPBR#spherical-harmonics)
-   Added STL exporter ([pryme8](https://github.com/pryme8))

### Optimizations

-   Added an engine creation option to compile all shaders with medium precision ([Deltakosh](https://github.com/deltakosh))
-   Optimized effect reused for shadow maps ([Deltakosh](https://github.com/deltakosh))
-   Added support for scissor testing ([Deltakosh](https://github.com/deltakosh))
-   Improved shader precision detection ([Deltakosh](https://github.com/deltakosh))
-   Added support for bone matrix texture, allowing skeletons to use a texture instead of uniforms when possible ([Deltakosh](https://github.com/deltakosh))
-   Refactored of the SolidParticleSystem code for performance and code quality improvement ([barroij](https://github.com/barroij))
-   Added per solid particle culling possibility: `solidParticle.isInFrustum()` ([jerome](https://github.com/jbousquie))
-   Performance-oriented changes ([barroij](https://github.com/barroij)):
    -   Prevented avoidable matrix inversion or square root computation.
    -   Enabled constant-time removal from the `transformNodes` array and `materials` array of the `Scene`. As a consequence, the order of the element within these arrays might change during a removal.
    -   Enabled constant-time removal from the `instances` array of a `Mesh`. As a consequence, the order of the element within this array might change during a removal.
    -   Stopped calling `Array.splice` on the `scene.meshes` array and on the `engine._uniformBuffer` when removing an element. As a consequence, the order of the element within these arrays might change during a removal.
    -   Added an option `useGeometryUniqueIdsMap` in the `Scene` constructor options. When set to true, each `Scene` isntance will have and will keep up-to-date a map of geometry per `uniqueId`. This is to avoid browsing all the geometries of the scene when a new one is being pushed. It also enables a removal of geometry in constant time. Disabled by default.
    -   Added an option `useMaterialMeshMap` in the `Scene` constructor options. When set to true, each `Material` isntance will have and will keep up-to-date a map of its bound meshes. This is to avoid browsing all the meshes of the scene to retrieve the ones bound to the current material when disposing the Material. Disabled by default.
    -   Added an option `useClonedMeshhMap` in the `Scene` constructor options. When set to true, each `Mesh` will have and will keep up-to-date a map of cloned meshes. This is to avoid browsing all the meshes of the scene to retrieve the ones that have the current mesh as source mesh. Disabled by default.
    -   Added `blockfreeActiveMeshesAndRenderingGroups` property in the `Scene`, following the same model as `blockMaterialDirtyMechanism`. This is to avoid calling `Scene.freeActiveMeshes` and `Scene.freeRenderingGroups` for each disposed mesh when we dispose several meshes in a row. Enable by setting `blockfreeActiveMeshesAndRenderingGroups` to `true` just before disposing the meshes, then set it back to `false` just after.
    -   Prevented code from doing useless and possible time consuming computation when disposing the `ShaderMaterial` of a `LinesMesh`.
    -   Make a better use of the `isIdentity` cached value within a `Matrix`.
    -   Make sure we browse all the submeshes only once in `Material.markAsDirty` function.
    -   Added an `Vector3.UnprojectRayToRef` static function to avoid computing and inverting the projection matrix twice when updating a Ray.
-   Added per mesh culling strategy ([jerome](https://github.com/jbousquie))

### Updates

#### GUI

-   Added `inputText.onKeyboardEventProcessedObservable` ([Deltakosh](https://github.com/deltakosh))
-   Added `button.image` and `button.textBlock` to simplify access to button internal parts ([Deltakosh](https://github.com/deltakosh))
-   Added `slider.displayThumb` to show/hide slider's thumb ([Deltakosh](https://github.com/deltakosh))
-   Added `grid.rowCount`, `grid.columnCount` and `grid.getChildrenAt()` ([Deltakosh](https://github.com/deltakosh))
-   Added `Control.AllowAlphaInheritance` to let users control the way alpha is used (inherited or not) ([Deltakosh](https://github.com/deltakosh))
-   Added support for performing operations like select all, text highlight, delete selected in `inputText` ([Saket Saurabh](https://github.com/ssaket))
-   Added `inputText.onTextCopyObservable`, `inputText.onTextCutObservable` and `inputText.onTextPasteObservable` to inputText ([Saket Saurabh](https://github.com/ssaket))
-   Added `AdvancedDynamicTexture.onClipboardObservable` to observe for clipboard events in AdvancedDynamicTexture([Saket Saurabh](https://github.com/ssaket))
-   Added `inputText.onFocusSelectAll` to allow complete selection of text on focus event.([Saket Saurabh](https://github.com/ssaket))
-   Added mouse drag to highlight text in `inputText` ([Saket Saurabh](https://github.com/ssaket))

#### Core Engine

-   Added `reflectionMatrix` support for more `coordinatesMode`'s ([Dennis Dervisis](https://github.com/ddervisis))
-   Added new `WebRequest` class to centralize all network requests. Can be used to configure headers of all network requests ([Deltakosh](https://github.com/deltakosh))
-   Added `WebRequest.CustomRequestHeaders`, `WebRequest.UseCustomRequestHeaders` to send Custom Request Headers alongside XMLHttpRequest's i.e. when loading files (Tools.Loadfile) from resources requiring special headers like 'Authorization' ([susares](https://github.com/susares))
-   Added support for user clip planes to LineMeshes ([Deltakosh](https://github.com/deltakosh))
-   Added `shadowGenerator.onBeforeShadowMapRenderMeshObservable` ([Deltakosh](https://github.com/deltakosh))
-   Added support for `scene.customLODSelector` to let users define their own LOD rules ([Deltakosh](https://github.com/deltakosh))
-   Added `animatable.onAnimationLoopObservable` ([Deltakosh](https://github.com/deltakosh))
-   Added `animationGroup.onAnimationLoopObservable` ([Deltakosh](https://github.com/deltakosh))
-   Added FlyCamera for free navigation in 3D space, with a limited set of settings ([Phuein](https://github.com/phuein))
-   Added `Engine.onNewSceneAddedObservable` ([Deltakosh](https://github.com/deltakosh))
-   Added new `PassCubePostProcess` to render cube map content ([Deltakosh](https://github.com/deltakosh))
-   Added support for utility layer for SkeletonViewer ([Deltakosh](https://github.com/deltakosh))
-   Added utility function `Tools.BuildArray` for array initialisation ([barroij](https://github.com/barroij))
-   Introduced a new `IOfflineSupport` interface to hide IndexedDB ([Deltakosh](https://github.com/deltakosh))
-   `PBRMaterial` and `StandardMaterial` now use hot swapping feature for shaders, allowing them to keep using a previous shader while a new one is being compiled ([Deltakosh](https://github.com/deltakosh))
-   Aligned `BoundingBox` and `BoundingSphere` API and behavior for clarity and simplicity, removing `BoundingBox`'s method `setWorldMatrix` and disallowing modification of the underlying world matrix except by calling `reConstruct` or `update` ([barroij](https://github.com/barroij))
-   Make sure that `Material.markAsDirty` and all the `markXXXDirty` methods early out when `scene.blockMaterialDirtyMechanism` is true. ([barroij](https://github.com/barroij))
-   Add updateUpVectorFromRotation to target camera to allow the up vector to be computed from rotation ([TrevorDev](https://github.com/TrevorDev))
-   Added `wrap` boolean parameter to `CreateBox` options to orientate images vertically on box sides ([JohnK](https://github.com/BabylonJSGuide))
-   Added opacity texture support to `GridMaterial` ([Deltakosh](https://github.com/deltakosh))
-   Added support for deserializing morph target animations in animation groups
-   AssetContainer dispose method ([TrevorDev](https://github.com/TrevorDev))
-   Loading texture with KTX will fallback to non-KTX loader if KTX loader fails ([TrevorDev](https://github.com/TrevorDev))
-   `Layer` are now supported in `RenderTargetTexture` ([Sebavan](https://github.com/Sebavan))
-   Made onscreen joystick's canvas public ([TrevorDev](https://github.com/TrevorDev))
-   Added `.serialize` and `.Parse` functions in `ReflectionProbe` to retrieve reflection probes when parsing a previously serialized material ([julien-moreau](https://github.com/julien-moreau))
-   Added `clearGizmoOnEmptyPointerEvent` options and `onAttachedToMeshObservable` event to GizmoManager ([TrevorDev](https://github.com/TrevorDev))
-   Added support for overriding the mesh used for the world matrix for a mesh with a skeleton ([bghgary](https://github.com/bghgary))
-   Added support for linking a bone to a transform node ([bghgary](https://github.com/bghgary))
-   Factored out `setDirection` function from `lookAt` for transform node ([bghgary](https://github.com/bghgary))
-   Added support for setting renderingGroupId and creating instances to `AxesViewer` ([bghgary](https://github.com/bghgary))
-   Added vScale inversion of compressed KTX textures as they are inverted in the file and `UNPACK_FLIP_Y_WEBGL` is not supported by KTX ([TrevorDev](https://github.com/TrevorDev))
-   Enabled dragging in `boundingBoxGizmo` without needing a parent ([TrevorDev](https://github.com/TrevorDev))
-   Added `InputsManager` and keyboard bindings for `FollowCamera` ([mrdunk](https://github.com))
-   Fixed typo in `FollowCamera InputsManager` when limiting rotation to 360 degrees ([mrdunk](https://github.com))
-   In `FollowCamera InputsManager`, allowed choice of modifier key (Alt, Ctrl and/or Shift) for each camera movement axis ([mrdunk](https://github.com))
-   Added `MouseWheel` bindings for `FollowCamera` ([mrdunk](https://github.com))
-   Tweaked `MouseWheel` bindings for `FollowCamera` orientations ([mrdunk](https://github.com))
-   Added maximum and minimum limits for `FollowCamera` parameters ([mrdunk](https://github.com))
-   Converted `ArcRotateCamera` to use new `BaseCameraPointersInput` ([mrdunk](https://github.com))
-   Added transparency support to `GlowLayer` ([Sebavan](https://github.com/Sebavan))
-   Added option `forceDisposeChildren` to `multiMaterial.dispose` ([danjpar](https://github.com/danjpar))
-   Added `Pointer` bindings for `FollowCamera` ([mrdunk](https://github.com))
-   Added Inspector light gizmo with icons ([TrevorDev](https://github.com/TrevorDev))
-   Added option `multiMultiMaterials` to `mesh.mergeMeshes` ([danjpar](https://github.com/danjpar))
-   Exposed fallback camera distortion metrics option in `vrExperienceHelper` ([TrevorDev](https://github.com/TrevorDev))
-   Added `OnAfterEnteringVRObservable` to `webVRHelper` ([TrevorDev](https://github.com/TrevorDev))
-   Added support for side by side and top/bottom VR videos in the [video dome](/features/divingDeeper/environment/360VideoDome#video-types) ([Sebavan](https://github.com/Sebavan))
-   Added unit tests for `BaseCameraPointersInput` and `ArcRotateCameraPointersInput` ([mrdunk](https://github.com))
-   Prevented `onActiveCameraChanged` from being fired when rendering rig cameras ([TrevorDev](https://github.com/TrevorDev))
-   Added `MeshExploder` class ([danjpar](https://github.com/danjpar))
-   Enabled `Observable`s to make observers top or bottom priority ([TrevorDev](https://github.com/TrevorDev))
-   Prevented mesh outline from being shown through the mesh when it's transparent ([TrevorDev](https://github.com/TrevorDev))
-   Prevented `DeviceOrientationCamera` from being modified by mouse input when the orientation sensor is active ([TrevorDev](https://github.com/TrevorDev))
-   Added `LoadScriptAsync` tools helper function [MackeyK24](https://github.com/mackeyk24))
-   Added `customShaderNameResolve` to `PBRMaterialBase` to allow subclasses to specify custom shader information [MackeyK24](https://github.com/mackeyk24))
-   Added `PBRCustomMaterial` to material library to allow easy subclassing of PBR materials [MackeyK24](https://github.com/mackeyk24))
-   Added custom defines for roughness and microsurface in `PBRCustomMaterial` [Lockphase](https://github.com/lockphase))
-   Added auto-exposure support in `StandardRenderingPipeline` when HDR is enabled ([julien-moreau](https://github.com/julien-moreau))
-   Added `EquiRectangularCubeTexture` class to enable the usage of browser-canvas supported images as `CubeTexture`s ([Dennis Dervisis](https://github.com/ddervisis))
-   Added `EquiRectangularCubeTextureAssetTask` to be able to load `EquiRectangularCubeTexture`s via Asset Manager ([Dennis Dervisis](https://github.com/ddervisis))
-   Added `Matrix.RotationAlignToRef` method to obtain rotation matrix from one vector to another ([sable](https://github.com/thscott))
-   `ArcRotateCamera` will now cache the necessary matrices when modifying its upVector, instead of calculating them each time they're needed ([sable](https://github.com/thscott))
-   Updated `DracoCompression` to use web workers ([bghgary](https://github.com/bghgary))
-   Added `LOD Babylon Mesh Entities` to support to babylonFileLoader.ts ([MackeyK24](https://github.com/mackeyk24))

#### OBJ Loader

-   Added color vertex support (not part of standard) ([brianzinn](https://github.com/brianzinn))
-   Added option for silently failing when materials fail to load ([brianzinn](https://github.com/brianzinn))
-   Added option to skip loading materials ([brianzinn](https://github.com/brianzinn))

#### glTF Loader

-   Added support for mesh instancing for improved performance when multiple nodes point to the same mesh ([bghgary](https://github.com/bghgary))
-   Switched to create `TransformNode` objects instead of `Mesh` objects for glTF nodes without geometry ([bghgary](https://github.com/bghgary))
-   Added glTF JSON pointers to metadata of nodes, materials, and textures ([bghgary](https://github.com/bghgary))
-   Enabled loading KTX textures in the gltf2 loader when textureFormat is set on engine ([TrevorDev](https://github.com/TrevorDev))
-   Fixed skinned meshes to behave as intended by glTF ([bghgary](https://github.com/bghgary))
    -   Set an override mesh on skinned meshes instead of reparenting to the `__root__` transform node
    -   Linked loaded bones to the transform node created for the corresponding glTF node
-   Improved load performance by blocking material dirtying during load ([bghgary](https://github.com/bghgary))
-   Added animation group target override to support custom animation targets ([MackeyK24](https://github.com/mackeyk24))
-   Added `loadMeshPrimitiveAsync` extension support ([MackeyK24](https://github.com/mackeyk24))

#### glTF Serializer

-   Added support for exporting `KHR_lights_punctual`
-   Prevented mesh normals from being flipped when exporting a glTF from a Babylon scene with right-handed coordinate system ([Nicholas Barlow](https://github.com/drigax))

#### Post-Processes Library

-   Added the [Ocean](/features/divingDeeper/materials/using/materialsLibrary/waterMat) post-process ([julien-moreau](https://github.com/julien-moreau))

#### Materials Library

-   Added the `cameraOffset` vector property in the `SkyMaterial` to get an offset according to the horizon ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `GradientMaterial` to consider disableLighting working as emissive ([julien-moreau](https://github.com/julien-moreau))
-   Fixed fresnel term computation in `WaterMaterial` ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `TerrainMaterial.isReadyForSubMesh` to remove WebGL warnings ([julien-moreau](https://github.com/julien-moreau))
-   Fixed `MixMaterial.isReadyForSubMesh` to remove WebGL warnings ([dad72](https://github.com/dad72))

#### Infrastructure

-   Migrated CI to Azure DevOps pipelines ([Sebavan](https://github.com/Sebavan))
-   Created test suites for both WebGL1 and WebGL2 ([Sebavan](https://github.com/Sebavan))

### Bug fixes

-   Fixed `ArcRotateCamera.setTarget` (position was sometimes wrong) ([Deltakosh](https://github.com/deltakosh))
-   Fixed `TransformNode.setDirection` (orientation was wrong) ([Deltakosh](https://github.com/deltakosh))
-   Fixed `ArcRotateCamera` control when `upVector` was modified ([Deltakosh](https://github.com/deltakosh))
-   Fixed `anaglyph` mode for Free and Universal cameras ([Deltakosh](https://github.com/deltakosh))
-   Fixed `FileLoader`'s loading of a skybox and added a parsed value for whether to create with PBR or STDMaterial ([Palmer-JC](https://github.com/Palmer-JC))
-   Removed bones from rootNodes where they should never have been ([Deltakosh](https://github.com/deltakosh))
-   Refocusing on input gui with pointer events ([TrevorDev](https://github.com/TrevorDev))
-   Gizmo scaling not consistent when camera is parented ([TrevorDev](https://github.com/TrevorDev))
-   Context loss causing unexpected results with dynamic textures, geometries with the same name and reflectionTextures ([TrevorDev](https://github.com/TrevorDev))
-   `CreateScreenshotUsingRenderTarget` stretches mirror textures when setting both width and height ([TrevorDev](https://github.com/TrevorDev))
-   VR helper only updating VR cameras position when entering VR, rotation was missing, laser distance stopped working ([TrevorDev](https://github.com/TrevorDev))
-   Fixed VR controllers after `gltfLoader` `transformNode` was changed ([TrevorDev](https://github.com/TrevorDev))
-   Bounding Box `fixedDragMeshScreenSize` stopped working and allow rotating through bounding box ([TrevorDev](https://github.com/TrevorDev))
-   VR helper would rotate non-VR camera while in VR ([TrevorDev](https://github.com/TrevorDev))
-   `PointerDragBahavior` using `Mesh` as base type, causing type-checking problems with `AbstractMesh` ([Poolminer](https://github.com/Poolminer/))
-   `TransformNode` `lookAt` not working in world space when node's parent has rotation ([TrevorDev](https://github.com/TrevorDev))
-   `MakeNotPickableAndWrapInBoundingBox` had unexpected behavior when input had scaling of 0 on an axis ([TrevorDev](https://github.com/TrevorDev))
-   Fixed an issue with loading base64 encoded images in the glTF loader ([bghgary](https://github.com/bghgary))
-   In multi-camera scenes the Inspector would cause the camera's interaction events to get detached ([TrevorDev](https://github.com/TrevorDev))
-   Fixed delete highlighted text after keyboard input, beat delay after double click event in `InputText` ([Saket Saurabh](https://github.com/ssaket))
-   Fixed `SixDofDragBehavior` when the camera is parented ([TrevorDev](https://github.com/TrevorDev))
-   Deactivate WebVR lasers when not in VR ([TrevorDev](https://github.com/TrevorDev))
-   Update physics position using `absolutePosition` instead of `pivotPosition` ([TrevorDev](https://github.com/TrevorDev))
-   Disabled camera arrow key controls when the command key is pressed on Mac OS ([kcoley](https://github.com/kcoley))
-   Viewer should not set `receiveShadows` on an instanced mesh ([TrevorDev](https://github.com/TrevorDev))
-   Rotation/scaling snapping not working in the negative direction ([TrevorDev](https://github.com/TrevorDev))
-   Updated comment in `TransformNode.rotationQuaternion` to include undefined as one of the potential return values ([nathankmiller](https://github.com/nathankmiller))
-   Cannon.js ignores `connectedPivot` joint parameter ([TrevorDev](https://github.com/TrevorDev))
-   Fixed case sensitive paths ([mrdunk](https://github.com))
-   Fixed more case sensitive paths ([mrdunk](https://github.com))
-   Attaching a `BoundingBoxGizmo` on a child node shouldn't remove its parent, rotation gizmo should work on object with parent ([TrevorDev](https://github.com/TrevorDev))
-   ammo.js fix including issue caused after modules update and use world contact point to be consistent with Oimo and Cannon ([TrevorDev](https://github.com/TrevorDev))
-   Warn of motor with `maxForce` in Oimo plugin and set default force to be consistent with others, Cannon.js support no impostor, Cannon.js cylinder axis, ammo.js wake up impostor when apply force/impulse ([TrevorDev](https://github.com/TrevorDev))
-   Utility layer should render on last active camera ([TrevorDev](https://github.com/TrevorDev))
-   `PointerDragBehavior` should not let the drag plane get out of sync when rotating the object during dragging ([TrevorDev](https://github.com/TrevorDev))
-   Do not crash the application if WebVR `submitFrame` fails ([TrevorDev](https://github.com/TrevorDev))
-   Fix pinch action on `FollowCameraPointersInput` ([mrdunk](https://github.com))
-   `Tools.CreateScreenshot` stopped working ([TrevorDev](https://github.com/TrevorDev))
-   Inspector showing duplicate nodes when attached to gizmo ([TrevorDev](https://github.com/TrevorDev))
-   Added missing dependencies for files to support including them from a direct path (eg. `import "@babylonjs/core/Helpers/sceneHelpers";`) ([TrevorDev](https://github.com/TrevorDev))
-   `AssetContainer` should not dispose objects it doesn't contain. Support for environmentTexture add/remove ([TrevorDev](https://github.com/TrevorDev))
-   Fixed `mesh.visibility` not working properly when certain material properties are set that changes the interpretation of alpha (e.g. refraction, specular over alpha, etc.) ([bghgary](https://github.com/bghgary))
-   Fixed material and texture leak when loading/removing GLTF/obj/babylon files with `AssetContainer` ([TrevorDev](https://github.com/TrevorDev))
-   Avoid exception when removing impostor during cannon world step ([TrevorDev](https://github.com/TrevorDev))
-   Fixed `ArcRotateCamera` divide by zero error (when looking along up axis) in `rebuildAnglesAndRadius` ([sable](https://github.com/thscott))
-   Fixed `ArcRotateCamera` `rebuildAnglesAndRadius` when `upVector` modified ([sable](https://github.com/thscott))
-   Fixed code branch, that does not try to (re)load an `EquiRectangularCubeTexture`/`HDRCubeTexture` when the caching returns an empty or corrupt `InternalTexture` ([Dennis Dervisis](https://github.com/ddervisis))
-   Added error event listener (bubbling up the `onError` callback chain) in case an `EquiRectangularCubeTexture` cannot be loaded, because of a wrong path or IO problems ([Dennis Dervisis](https://github.com/ddervisis))
-   3D GUI buttons no longer will scale up when pressing with a multitouch device ([TrevorDev](https://github.com/TrevorDev))
-   2D GUI elements will use the last clicked controller instead of only the right controller when dual VR controllers are interacting with an element ([TrevorDev](https://github.com/TrevorDev))
-   Virtual keyboard not showing up when made visible ([TrevorDev](https://github.com/TrevorDev))

#### Core Engine

-   Fixed a bug with `mesh.alwaysSelectAsActiveMesh` preventing layerMask to be taken in account ([Deltakosh](https://github.com/deltakosh))
-   Fixed a bug with pointer up being fire twice ([Deltakosh](https://github.com/deltakosh))
-   Fixed a bug with particle systems being update once per camera instead of once per frame ([Deltakosh](https://github.com/deltakosh))
-   Properly handled the `LinesMesh` `intersectionThreshold` by using its value directly when the intersection against a `Ray` is checked instead of extending the `BoundingInfo` accordingly ([barroij](https://github.com/barroij))
-   Added an `InstancesLinesMesh` class used to create instance of `LinesMesh` so that each instance can have its own `intersectionThreshold` value ([barroij](https://github.com/barroij))
-   Fixed the `LineEdgesRenderer` used for edge rendering of `LinesMesh` to properly handle `LinesMesh`s made of disconnected lines and made it work for instance of `LinesMesh` ([barroij](https://github.com/barroij))
-   Fixed `Matrix.toNormalMatrix` function ([barroij](https://github.com/barroij))
-   Added missing effect layer to asset container ([TrevorDev](https://github.com/TrevorDev))
-   Fixed effect layer compatibility with multi materials ([Sebavan](https://github.com/Sebavan))
-   Added a `DeepImmutable<T>` type to specifiy that a referenced object should be considered recursively immutable, meaning that all its properties are `readonly` and that if a property is a reference to an object, this object is also recursively immutable. ([barroij](https://github.com/barroij))
-   Fixed `VideoTexture` poster property when autoplay is turned off.
-   Fixed position and rotation of plane mesh created by `MeshBuilder.CreatePlane` when specifying a source plane ([sable](https://github.com/thscott), [bghgary](https://github.com/bghgary))
-   Fixed inspector dynamic loading ([Sebavan](https://github.com/Sebavan))
-   Fixed `infiniteDistance` not working anymore ([Sebavan](https://github.com/Sebavan))
-   Fixed bug in `SolidParticle` `BoundingSphere` update within the `SolidParticleSystem` ([barroij](https://github.com/barroij))
-   Updated picking so that when the picked Mesh is a `LinesMesh`, the index of the picked line is returned in the `faceId` property of the `PickingInfo`, as we do with face index the picked `Mesh` is made of triangle faces ([barroij](https://github.com/barroij))
-   Fixed unintentional cloning of mesh observables ([Sebavan](https://github.com/Sebavan))
-   Fixed Inspector resolution with AMD loader ([Sebavan](https://github.com/Sebavan))
-   Fixed a bug when a call to `updateIndices` leads to changing the size of the index buffer by recreating the subMeshes in that case ([barroij](https://github.com/barroij))
-   Added option to disable gazeTracker color changes in vrExperienceHelper ([TrevorDev](https://github.com/TrevorDev))
-   Added `PointerDragBehavior` `validateDrag` predicate to stop dragging to specific points ([TrevorDev](https://github.com/TrevorDev))
-   Added Auto Update Touch Action [#5674](https://github.com/BabylonJS/Babylon.js/issues/5674)([Sebavan](https://github.com/Sebavan))
-   Added hemispheric lighting to gizmos to avoid flat look ([TrevorDev](https://github.com/TrevorDev))
-   Fixed a bug causing `WebRequest.open` to crash if `WebRequest.CustomRequestHeaders` are set [#6055](https://github.com/BabylonJS/Babylon.js/issues/6055)([susares](https://github.com/susares))
-   Fixed a bug causing `Mesh.clone` to crash if no physicsEngineComponent is used ([barroij](https://github.com/barroij))
-   Fixed zoom inertia making it difficult to zoom out with ArcRotateCamera ([TrevorDev](https://github.com/TrevorDev))
-   Added option for `isInFrustum` to check `rigCameras` so that `viewMatrix` updates for `rigCameras` can notify their parent ([TrevorDev](https://github.com/TrevorDev))
-   Properly handled unindexed `LinesMesh` (rendering and picking) ([barroij](https://github.com/barroij))

#### Loaders

-   Added missing `loadedAnimationGroups` to `MeshAssetTask` ([bghgary](https://github.com/bghgary))
-   Added missing `linkTransformNode` to `BabylonFileLoader` ([MackeyK24](https://github.com/mackeyk24))

### Breaking changes

-   Replaced all references to XmlHttpRequest with `WebRequest` (which provides the same signatures) ([Deltakosh](https://github.com/deltakosh))
-   Set `Database.IDBStorageEnabled` to false by default ([Deltakosh](https://github.com/deltakosh))
-   Renamed `Database.openAsync` to `Database.open` ([Deltakosh](https://github.com/deltakosh))
-   Renamed `scene.database` to `scene.offlineProvider` ([Deltakosh](https://github.com/deltakosh))
-   Removed `BoundingBox.setWorldMatrix` and changed `BoundingBox.getWorldMatrix` to return a `DeepImmutable<Matrix>` ([barroij](https://github.com/barroij))
-   Changed `Matrix`'s accessor `m` and methods `toArray` and `asArray` to return a `DeepImmutable<Float32Array>` as the underlying array is not supposed to be modified manually from the outside of the class ([barroij](https://github.com/barroij))
-   Removed some deprecated (flagged since 3.0) properties and functions, all of which are superceded by the `SceneInstrumentation` class unless otherwise specified ([Deltakosh](https://github.com/deltakosh))
    -   `scene.getInterFramePerfCounter()`
    -   `scene.interFramePerfCounter`
    -   `scene.getLastFrameDuration()`
    -   `scene.lastFramePerfCounter`
    -   `scene.getEvaluateActiveMeshesDuration()`
    -   `scene.evaluateActiveMeshesDurationPerfCounter`
    -   `scene.getRenderTargetsDuration()`
    -   `scene.getRenderDuration()`
    -   `scene.renderDurationPerfCounter`
    -   `scene.getParticlesDuration()`
    -   `scene.particlesDurationPerfCounter`
    -   `scene.getSpritesDuration()`
    -   `scene.spriteDuractionPerfCounter`
    -   `engine.drawCalls`
    -   `engine.drawCallsPerfCounter`
    -   `shadowGenerator.useVarianceShadowMap` (superceded by `useExponentialShadowMap`)
    -   `shadowGenerator.useBlurVarianceShadowMap` (superceded by `useBlurExponentialShadowMap`)
-   The glTF loader now creates `InstancedMesh` objects when two nodes point to the same mesh ([bghgary](https://github.com/bghgary))
-   The glTF loader now creates `TransformNode` objects instead of `Mesh` objects for glTF nodes without geometry ([bghgary](https://github.com/bghgary))
    -   _Note: The root node is still a `Mesh` object and is still the first in the returned list of meshes_
    -   `TransformNode` objects are excluded from the returned list of meshes when importing mesh
    -   `TransformNode` objects do not raise `onMeshLoaded` events
-   Renamed `xAxisMesh`, `yAxisMesh`, and `zAxisMesh` of `AxesViewer` to `xAxis`, `yAxis`, and `zAxis` respectively and changed return to a `TransformNode` to represent the parent node of the cylinder and line of the arrow ([bghgary](https://github.com/bghgary))
-   Disallowed passing the engine into `Viewport.toglobal` to prevent circular dependency ([Sebavan](https://github.com/Sebavan))
-   Moved `Vector3.UnprojectRayToRef` to `Ray.unprojectRayToRef` instance method to decrease class coupling ([Sebavan](https://github.com/Sebavan))
-   Moved `Material.ParseMultiMaterial` to `MultiMaterial.ParseMultiMaterial` to decrease class coupling ([Sebavan](https://github.com/Sebavan))
-   Removed `babylon.no-module.max.js` javascript version has the Webpack UMD bundle covers both ([Sebavan]
    (https://github.com/Sebavan))
-   Removed `es6.js` javascript as it is now available as a true es6 NPM package ([Sebavan](https://github.com/Sebavan))
-   Removed `babylon.worker.js` javascript following the lack of usage from the feature ([Sebavan]
    (https://github.com/Sebavan))
-   Removed `Primitive Geometries` as they were not in use since 2.0 ([Sebavan](https://github.com/Sebavan))
-   Changed `shouldExportTransformNode` callback in glTF serializer options to `shouldExportNode` ([kcoley](https://github.com/kcoley))
-   Changed `PhysicsHelper` method parameters for event calls ([bobalazek](https://github.com/bobalazek))

## 3.3.0

### Major updates

-   Documentation
    -   Entire codebase is now documented. [API documentation](/typedoc)
-   GUI
    -   New GUI 3D controls toolset. [Complete doc + demos](//doc.babylonjs.com/how_to/gui3d) ([Deltakosh](https://github.com/deltakosh))
    -   New GUI control: [Grid](//doc.babylonjs.com/how_to/gui#grid) ([Deltakosh](https://github.com/deltakosh))
    -   New GUI control: [InputPassword](/features/divingDeeper/gui/gui#inputpassword) ([theom](https://github.com/theom))
    -   New GUI container [SelectionPanel](//doc.babylonjs.com/how_to/selector) ([JohnK](https://github.com/BabylonJSGuide))
-   Gizmo Support ([TrevorDev](https://github.com/TrevorDev))
    -   Gizmo and GizmoManager classes used to manipulate meshes in a scene. Gizmo types include: position, scale, rotation and bounding box [Doc](//doc.babylonjs.com/how_to/gizmo) ([TrevorDev](https://github.com/TrevorDev))
    -   New behaviors: PointerDragBehavior, SixDofDragBehavior and MultiPointerScaleBehavior to enable smooth drag and drop/scaling with mouse or 6dof controller on a mesh [Doc](//doc.babylonjs.com/how_to/meshbehavior) ([TrevorDev](https://github.com/TrevorDev))
    -   Added attachToBoxBehavior to attach UI to a bounding box ([TrevorDev](https://github.com/TrevorDev))
    -   Gizmo manager's internal gizmos are now public ([TrevorDev](https://github.com/TrevorDev))
    -   Ability to customize meshes on gizmos ([TrevorDev](https://github.com/TrevorDev))
    -   Added ignoreChildren field to bounding box to save performance when using heavily nested meshes ([TrevorDev](https://github.com/TrevorDev))
    -   Add uniform scaling drag support to the scale gizmo ([TrevorDev](https://github.com/TrevorDev))
    -   Support interacting with child elements ([TrevorDev](https://github.com/TrevorDev))
    -   BoundingBox gizmo support for including/excluding descendants when computing the bounding box ([TrevorDev](https://github.com/TrevorDev))
    -   Drag start and stop events for all gizmos ([TrevorDev](https://github.com/TrevorDev))
-   Particle system improvements ([Deltakosh](https://github.com/deltakosh))
    -   Added a ParticleHelper class to create some pre-configured particle systems in a one-liner method style. [Doc](/features/divingDeeper/particles/particle_system/particleHelper) ([Deltakosh](https://github.com/deltakosh)) / ([DevChris](https://github.com/yovanoc))
    -   Improved CPU particles rendering performance (up to x2 on low end devices)
    -   Added support for `isBillboardBased`. [Doc](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#alignment)
    -   Added support for billboard mode. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#alignment)
    -   Added support for `minScaleX`, `minScaleY`, `maxScaleX`, `maxScaleY`. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#size)
    -   Added support for `radiusRange` for sphere emitter. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#sphere-emitter)
    -   Added support for `radiusRange` and `heightRange` for cone emitter. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#cone-emitter)
    -   Added new point emitter. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#point-emitter)
    -   Added new hemispheric emitter. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#hemispheric-emitter)
    -   Added support for `ParticleSystem.BLENDMODE_ADD` alpha mode. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#particle-blending)
    -   Added support for color gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#particle-colors)
    -   Added support for pre-warming. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#pre-warming)
    -   Added support for `minInitialRotation` and `maxInitialRotation`. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#rotation)
    -   Added support for size gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#size)
    -   Added support for life time gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#lifetime)
    -   Added support for angular speed gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#rotation)
    -   Added support for velocity gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#velocity-over-time)
    -   Added support for limit velocity gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#limit-velocity-over-time)
    -   Added support for drag gradients. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#drag-factor)
    -   Added support for noise textures. [Doc](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#noise-texture)
    -   Added support for emit rate gradients. [Doc](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#emit-rate-over-time)
    -   Added support for ramp gradients. [Doc](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#ramp-gradients)
    -   Start size gradient support for particles. [Doc](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#start-size-over-time) ([TrevorDev](https://github.com/TrevorDev))
    -   Attached sub emitters. [Doc](//doc.babylonjs.com/how_to/sub_emitters) ([TrevorDev](https://github.com/TrevorDev))
    -   Cylinder particle emitter and constructor in baseParticle [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#cylinder-emitter) ([TrevorDev](https://github.com/TrevorDev))
    -   Added support for cylinder particle emitter. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#cylinder-emitter) ([TrevorDev](https://github.com/TrevorDev))
    -   Added startDelay to support delaying system start of sub emitters. [Doc](/features/divingDeeper/particles/particle_system/particle_system_intro#creating-the-particles) ([TrevorDev](https://github.com/TrevorDev))
    -   Added support for random start cell when using animated sprite sheets. [Doc](//doc.babylonjs.com/how_to/animate)
-   Added SceneComponent to help decoupling Scene from its components. ([sebavan](https://github.com/sebavan))
-   Added [Environment Texture Tools](/features/divingDeeper/materials/using/introToPBR#creating-a-compressed-environment-texture) to reduce the size of the usual .DDS file ([sebavan](https://github.com/sebavan))
-   Playground can now be used with TypeScript directly! [Demo](https://www.babylonjs-playground.com/ts.html) ([Deltakosh](https://github.com/deltakosh), [NasimiAsl](https://github.com/NasimiAsl))
-   GUI and Inspector are now ES-Modules ([RaananW](https://github.com/RaananW))
-   Added support for noise procedural textures. [Doc](//doc.babylonjs.com/features/divingDeeper/materials/using/proceduralTextures#noise-procedural-texture) ([Deltakosh](https://github.com/deltakosh))
-   Added new `PhotoDome` object to display 360 photos. [Demo](https://www.babylonjs-playground.com/#14KRGG#0) ([SzeyinLee](https://github.com/SzeyinLee))
-   Added Video Recorder. [Doc](/features/divingDeeper/scene/renderToVideo) ([sebavan](https://github.com/sebavan))

### Updates

-   Updated TypeScript version to new major 3.0.1 ([christopherstock](https://github.com/christopherstock))
-   All NPM packages have `latest` and `preview` streams ([RaananW](https://github.com/RaananW))
-   Added New Tools Tab in the inspector (env texture and screenshot tools so far) ([sebavan](https://github.com/sebavan))
-   Moved to gulp 4, updated dependencies to latest ([RaananW](https://github.com/RaananW))

#### GUI

-   Added dead key support and before key add observable to InputText. [Doc](/features/divingDeeper/gui/gui#using-onbeforekeyaddobservable-for-extended-keyboard-layouts-and-input-masks) ([theom](https://github.com/theom))
-   Added `TextBlock.computeExpectedHeight`, added `TextWrapping.Ellipsis` as `TextBlock.wordWrapping` possible value ([adrientetar](https://github.com/adrientetar))
-   New vertical mode for sliders in 2D GUI. [Demo](https://www.babylonjs-playground.com/#U9AC0N#53) ([Saket Saurabh](https://github.com/ssaket))
-   Added `isEnabled` and `disabledColor` property to Gui Control ([barteq100](https://github.com/barteq100))
-   Added support for connecting multiple InputText controls to VirtualKeyboard and can disconnect individual InputTexts. ([brian Zinn](https://github.com/brianzinn))

#### Core Engine

-   Improved the way world matrices were computed ([Deltakosh](https://github.com/deltakosh))
-   Added `scene.rootNodes` to track root nodes (ie. nodes with no parent) ([Deltakosh](https://github.com/deltakosh))
-   Added `scene.pickSpriteWithRay` function ([Deltakosh](https://github.com/deltakosh))
-   Added support for multiple clip planes. [Demo](https://www.babylonjs-playground.com/#Y6W087) ([Deltakosh](https://github.com/deltakosh))
-   Added new `MixMaterial` to the Materials Library allowing to mix up to 8 textures ([julien-moreau](https://github.com/julien-moreau))
-   Added new `BoundingInfo.scale()` function to let users control the size of the bounding info ([Deltakosh](https://github.com/deltakosh))
-   Added new `Animatable.waitAsync` function to use Promises with animations. [Demo](https://www.babylonjs-playground.com/#HZBCXR) ([Deltakosh](https://github.com/deltakosh))
-   Added the choice of [forming a closed loop](//doc.babylonjs.com/how_to/how_to_use_curve3#catmull-rom-spline) to the catmull-rom-spline curve3 ([johnk](https://github.com/babylonjsguide))
-   Added support for specifying the center of rotation to textures ([bghgary](https://github.com/bghgary))
-   Added webVR support for Oculus Go ([TrevorDev](https://github.com/TrevorDev))
-   Added ability to not generate polynomials harmonics upon prefiltered texture creation ([sebavan](https://github.com/sebavan))
-   Added predicate function to customize the list of mesh included in the computation of bounding vectors in the `getHierarchyBoundingVectors` method ([sebavan](https://github.com/sebavan))
-   Added webVR constructor options: disable laser pointer toggle, teleportation floor meshes ([TrevorDev](https://github.com/TrevorDev))
-   Get a root mesh from an asset container, load a mesh from a file with a single string url ([TrevorDev](https://github.com/TrevorDev))
-   UtilityLayer class used to render another scene as a layer on top of an existing scene ([TrevorDev](https://github.com/TrevorDev))
-   AnimationGroup has now onAnimationGroupEnd observable ([RaananW](https://github.com/RaananW))
-   New `serialize` and `Parse` functions to serialize and parse all procedural textures from the Procedural Textures Library ([julien-moreau](https://github.com/julien-moreau))
-   Added a new `mesh.ignoreNonUniformScaling` to turn off non uniform scaling compensation ([Deltakosh](https://github.com/deltakosh))
-   AssetsManager tasks will only run when their state is INIT. It is now possible to remove a task from the assets manager ([RaananW](https://github.com/RaananW))
-   Added sprite isVisible field ([TrevorDev](https://github.com/TrevorDev))
-   EnvironmentHelper will recreate ground and skybox meshes if force-disposed ([RaananW](https://github.com/RaananW))
-   Added viewport caching mechanism in engine ([sebavan](https://github.com/sebavan))
-   Added unpackFlipY caching mechanism in engine ([sebavan](https://github.com/sebavan))
-   Added rebind optimization of video texture ([sebavan](https://github.com/sebavan))
-   Fix Background Material effect caching ([sebavan](https://github.com/sebavan))
-   Prevent texture `getSize` to generate garbage collection ([sebavan](https://github.com/sebavan))
-   Prevent `lodGenerationScale` and `lodGenerationOffset` to force rebind ([sebavan](https://github.com/sebavan))
-   Added poster property on VideoTexture ([sebavan](https://github.com/sebavan))
-   Added `onUserActionRequestedObservable` to workaround and detect autoplay video policy restriction on VideoTexture ([sebavan](https://github.com/sebavan))
-   `Sound` now accepts `MediaStream` as source to enable easier WebAudio and WebRTC integrations ([menduz](https://github.com/menduz))
-   Vector x, y and z constructor parameters are now optional and default to 0 ([TrevorDev](https://github.com/TrevorDev))
-   Added and removed camera methods in the default pipeline ([TrevorDev](https://github.com/TrevorDev))
-   Added internal texture `format` support for RenderTargetCubeTexture ([PeapBoy](https://github.com/NicolasBuecher))
-   Added canvas toBlob polyfill in tools ([sebavan](https://github.com/sebavan))
-   Added `RawCubeTexture` class with RGBD and mipmap support ([bghgary](https://github.com/bghgary))
-   Added effect layer per rendering group addressing ([sebavan](https://github.com/sebavan))
-   Added predicate function `targetMask` argument to `scene.beginWeightedAnimation`, `scene.beginAnimation`, `scene.stopAnimation`, and `animatable.stop` to allow for selective application of animations. ([fmmoret](https://github.com/fmmoret))
-   Oculus GO and GearVR 3dof controllers will now rotate with the user's head if they turn around in their room ([TrevorDev](https://github.com/TrevorDev))
-   Added onPoseUpdatedFromDeviceObservable to webVRCamera to detect when the camera's pose has been updated ([TrevorDev](https://github.com/TrevorDev))
-   Added gltf light falloff ([sebavan](https://github.com/sebavan))
-   Added falloff type per light to prevent material only inconsistencies ([sebavan](https://github.com/sebavan))
-   Added WeightedSound; selects one from many Sounds with random weight for playback. ([najadojo](https://github.com/najadojo))
-   Added HDR support to ReflectionProbe ([Deltakosh](https://github.com/deltakosh))
-   Added ACES ToneMapping to the image processing to help getting more parity with other engines ([sebavan](https://github.com/sebavan))
-   Added Image Processing to the particle system to allow consistency in one pass forward rendering scenes ([sebavan](https://github.com/sebavan))
-   Added support for main WebGL2 texture formats ([PeapBoy](https://github.com/NicolasBuecher))
-   Added fadeInOutBehavior and tooltipText for holographic buttons ([TrevorDev](https://github.com/TrevorDev))
-   StartDrag method added to pointerDragBehavior used to simulate the start of a drag ([TrevorDev](https://github.com/TrevorDev))
-   Added EdgesLineRenderer to address [#4919](https://github.com/BabylonJS/Babylon.js/pull/4919) ([barteq100](https://github.com/barteq100))
-   Added `ambientTextureImpactOnAnalyticalLights` in PBRMaterial to allow fine grained control of the AmbientTexture on the analytical diffuse light ([sebavan](https://github.com/sebavan))
-   BoundingBoxGizmo scalePivot field that can be used to always scale objects from the bottom ([TrevorDev](https://github.com/TrevorDev))
-   Improved \_isSyncronized performance and reduced GC in TransformNode.computeWorldMatrix by directly reading property ([Bolloxim](https://github.com/Bolloxim))
-   Added supports for reflectionMatrix in Skybox Mode Cube Texture allowing offsetting the world center or rotating the matrix ([sebavan](https://github.com/sebavan))
-   Improved performance of cached nodes but ensuring parent always updates cache. This removes failed isSynchronized test that meant computeWorldMatrix would always have to rebuild. On large scenes this could double framerate. ([Bolloxim](https://github.com/Bolloxim))
-   Added FXAA and MSAA support to the StandardRenderingPipeline ([julien-moreau](https://github.com/julien-moreau))
-   Make teleportCamera public in VR experience helper ([TrevorDev](https://github.com/TrevorDev))
-   Added optional alphaFilter parameter to `CreateGroundFromHeightMap` to allow for heightmaps to be created that ignore any transparent data ([Postman-nz](https://github.com/Postman-nz))
-   Fixed renormalization of mesh weights to in cleanMatrixWeights function. ([Bolloxim](https://github.com/Bolloxim))
-   Added a validationSkin function to report out any errors on skinned meshes. ([Bolloxim](https://github.com/Bolloxim))

#### glTF Loader

-   Added support for KHR_texture_transform ([bghgary](https://github.com/bghgary))
-   Added `onNodeLODsLoadedObservable` and `onMaterialLODsLoadedObservable` to MSFT_lod loader extension ([bghgary](https://github.com/bghgary))
-   Added glTF loader settings to the GLTF tab in the debug layer ([bghgary](https://github.com/bghgary))
-   Added debug logging and performance counters ([bghgary](https://github.com/bghgary))
-   Added support for EXT_lights_imageBased ([bghgary](https://github.com/bghgary))
-   Added support for MSFT_audio_emitter ([najadojo](https://github.com/najadojo))
-   Added support for custom loader extensions ([bghgary](https://github.com/bghgary))
-   Added support for validating assets using [glTF-Validator](https://github.com/KhronosGroup/glTF-Validator) ([bghgary](https://github.com/bghgary))
-   Added automatically renormalizes skinweights when loading geometry. Calls core mesh functions to do this ([Bolloxim](https://github.com/Bolloxim))

#### glTF Serializer

-   Added support for exporting the scale, rotation and offset texture properties ([kcoley](https://github.com/kcoley))

#### Viewer

-   No fullscreen button on small devices ([RaananW](https://github.com/RaananW))
-   Nav-Bar is now displayed on fullscreen per default ([RaananW](https://github.com/RaananW))
-   Viewer configuration supports deprecated values using the new configurationCompatibility processor ([RaananW](https://github.com/RaananW))
-   Shadows will only render while models are entering the scene or animating ([RaananW](https://github.com/RaananW))
-   Support for model drag and drop onto the canvas ([RaananW](https://github.com/RaananW))
-   New lab feature - global light rotation ([RaananW](https://github.com/RaananW))
-   New NPM package - babylonjs-viewer-assets, to separate the binary assets and the code of the viewer ([RaananW](https://github.com/RaananW))
-   A new HD-Toggler button allows setting a better hardware scaling rate ([RaananW](https://github.com/RaananW))
-   An initial support for WebVR is implemented ([RaananW](https://github.com/RaananW))
-   It is now possible to choose the element that goes fullscreen in the default viewer ([RaananW](https://github.com/RaananW))
-   The default viewer has a plugin system with which new buttons can be added externally ([RaananW](https://github.com/RaananW))
-   The extended configuration is now the default when not providing the "extended" parameter ([RaananW](https://github.com/RaananW))
-   viewer.updateConfiguration also accepts a URL to download configuration remotely ([RaananW](https://github.com/RaananW))
-   Viewer supports 3D printing on windows 10 ([RaananW](https://github.com/RaananW))
-   The viewer's environment map is using the new .env feature ([RaananW](https://github.com/RaananW))

#### Materials Library

-   Added `unlit` mode to lava material ([sebavan](https://github.com/sebavan))

### Bug fixes

-   VR experience helper will now fire pointer events even when no mesh is currently hit ([TrevorDev](https://github.com/TrevorDev))
-   RawTexture.CreateAlphaTexture no longer fails to create a usable texture ([TrevorDev](https://github.com/TrevorDev))
-   SceneSerializer.SerializeMesh now serializes all materials kinds (not only StandardMaterial) ([julien-moreau](https://github.com/julien-moreau))
-   WindowsMotionController's trackpad field will be updated prior to it's onTrackpadChangedObservable event ([TrevorDev](https://github.com/TrevorDev))
-   VR experience helper's controllers will not fire pointer events when laser's are disabled, instead the camera ray pointer event will be used ([TrevorDev](https://github.com/TrevorDev))
-   Node's setParent(node.parent) will no longer throw an exception when parent is undefined and will behave the same as setParent(null) ([TrevorDev](https://github.com/TrevorDev))
-   Mesh.MergeMeshes flips triangles on meshes with negative scaling ([SvenFrankson](http://svenfrankson.com))
-   Avoid firing button events multiple times when calling vrController.attachMesh() ([TrevorDev](https://github.com/TrevorDev))
-   Parse geometry when load binary mesh ([SinhNQ](https://github.com/quocsinh))
-   Removing observers during observable notify should not skip over valid observers ([TrevorDev](https://github.com/TrevorDev))
-   Initializing gamepadManager should register the gamepad update events ([TrevorDev](https://github.com/TrevorDev))
-   Do not generate mipmaps for RawCubeTexture if OES_texture_float_linear and/or EXT_color_buffer_float extensions are not supported ([PeapBoy](https://github.com/NicolasBuecher))
-   Do not modify passed camera array parameter when creating a default pipeline ([TrevorDev](https://github.com/TrevorDev))
-   Fixed issue where gaze trackers were appearing even after leaving VR ([atulyar](https://github.com/atulyar))
-   AdvancedDynamicTexture should not overwrite skipOnPointerObservable to false ([TrevorDev](https://github.com/TrevorDev))
-   Fixed issue where VRExperienceHelper.onExitingVR observable was being fired twice ([atulyar](https://github.com/atulyar))
-   Avoid firing onExitingVR observable multiple times when calling exitVR() and add observables to Viewer that can be used instead of the ones in VRExperienceHelper ([atulyar](https://github.com/atulyar))
-   GizmoManager should hide existing gizmos if a non-attachable mesh is selected ([TrevorDev](https://github.com/TrevorDev))
-   Ignore isPickable = false for vr ray casting if the mesh's name matches the specified floorMeshName to maintain backwards compatability ([TrevorDev](https://github.com/TrevorDev))
-   Fix File Loading if hosted from `file:`-Protocol ([ltetzlaff](https://github.com/ltetzlaff))
-   Do not throw error when updating a controller with no left stick ([TrevorDev](https://github.com/TrevorDev))
-   Exiting VR can result in messed up view ([TrevorDev](https://github.com/TrevorDev))
-   Dispose existing gazeTrackers when setting a new one ([TrevorDev](https://github.com/TrevorDev))
-   Set missing parentId in Mesh.serialize() for instances ([julien-moreau](https://github.com/julien-moreau))
-   Do not modify pivot point when using bounding box gizmo or behaviors ([TrevorDev](https://github.com/TrevorDev))
-   GPUParticleSystem does not get stuck in burst loop when stopped and started ([TrevorDev](https://github.com/TrevorDev))
-   trackPosition:false not working in webVRCamera/controllers ([TrevorDev](https://github.com/TrevorDev))
-   Spring Joint could not be removed ([TrevorDev](https://github.com/TrevorDev))
-   Sometimes duplicate controller models are loaded in VR ([TrevorDev](https://github.com/TrevorDev))
-   Particle emit rate and start size over time do not reset on every particle system start ([TrevorDev](https://github.com/TrevorDev))

#### Core Engine

-   Fixed `shadowEnabled` property on lights. Shadows are not visible anymore when disabled ([sebavan](https://github.com/sebavan))
-   Physics `unregisterOnPhysicsCollide` didn't remove callback correctly ([RaananW](https://github.com/RaananW))
-   Added missing getter and setter for global exposure in ColorCurves ([RaananW](https://github.com/RaananW))
-   Fixed an issue with view matrix when `ArcRotateCamera` was used with collisions ([Deltakosh](https://github.com/deltakosh))
-   Fixed a bug with setting `unlit` on `PBRMaterial` after the material is ready (Wrong dirty flags) ([bghgary](https://github.com/bghgary))
-   Fixed `HighlightLayer` support on browsers not supporting HalfFloat ([sebavan](https://github.com/sebavan))
-   Fixed support for R and RG texture formats ([sebavan](https://github.com/sebavan))
-   Fixed `updatable` parameter setting in the SPS ([jerome](https://github.com/jbousquie))
-   Angular and linear velocity were using the wrong method to copy values to the physics engine ([RaananW](https://github.com/RaananW))
-   Fixed env texture generation in Byte Mode ([sebavan](https://github.com/sebavan))
-   Oimo.js now receives quaternion and not euler when a body is being constructed ([RaananW](https://github.com/RaananW))
-   Improving visual quality on SSAO2 shader ([CraigFeldspar](https://github.com/CraigFeldspar))
-   Fixed a bug where changing the sample count on `PostProcess` would not update the WebGL Texture ([CraigFeldspar](https://github.com/CraigFeldspar))
-   Fixed multi camera support in defaultRenderingPipeline depth of field ([sebavan](https://github.com/sebavan))

#### Viewer

-   Fix Navbar Interaction on Mozilla/Firefox ([SzeyinLee](https://github.com/SzeyinLee))
-   Fix Animation Slider Interaction on Mozilla/Firefox ([sebavan](https://github.com/sebavan))
-   Fix Animation Slider Clickable area size Cross Plat ([sebavan](https://github.com/sebavan))
-   Ground material didn't take the default main color is no material definition was provided ([RaananW](https://github.com/RaananW))
-   Model configuration was not extended correctly if loaded more than one model ([RaananW](https://github.com/RaananW))
-   It wasn't possible to disable camera behavior(s) using configuration ([RaananW](https://github.com/RaananW))
-   Animation blending was always set to true, ignoring configuration ([RaananW](https://github.com/RaananW))
-   Animation navbar now updates correctly when a new model is loaded ([RaananW](https://github.com/RaananW))
-   Non-normalized meshes didn't center and focus correctly ([RaananW](https://github.com/RaananW))
-   Meshes with skeletons could have incorrect animations ([RaananW](https://github.com/RaananW))
-   Removed element IDs from viewer's templates to allow muitiple viewers in a single page ([RaananW](https://github.com/RaananW))
-   Viewer is not using Engine.LastCreatedScene anymore, to support multiple viewers in a single page ([RaananW](https://github.com/RaananW))
-   Template location was ignored if html was defined ([RaananW](https://github.com/RaananW))
-   Drag and Drop only worked if a model was already loaded before ([RaananW](https://github.com/RaananW))
-   It was not possible to add new custom optimizers, only use existing ones ([RaananW](https://github.com/RaananW))
-   Button texts were truncated incorrectly ([RaananW](https://github.com/RaananW))
-   Animation names with more than one word didn't work correctly ([RaananW](https://github.com/RaananW))

#### Loaders

-   STL Loader only supported binary downloads and no data: urls ([RaananW](https://github.com/RaananW))
-   OBJ Loader is now an async loader ([RaananW](https://github.com/RaananW))
-   GLTF Loader does not have texture conflicts on subsequent loads anymore ([sebavan](https://github.com/sebavan))

### Breaking changes

-   Fixing support for R and RG texture formats made us remove TextureFormat_R32F and TextureFormat_RG32F as they were mixing formats and types. Please, use the respective TextureFormat_R and TextureFormat_RG with the Float types ([sebavan](https://github.com/sebavan))
-   Replacing `scene.onRenderingGroupObservable` by `onBeforeRenderingGroupObservable` and `onAfterRenderingGroupObservable` to prevent the stage check ([sebavan](https://github.com/sebavan))
-   Replacing `IActiveMeshCandidateProvider` and the according scene setter by a set of custom predicates `scene.getActiveMeshCandidates`, `scene.getActiveSubMeshCandidates`, `scene.getIntersectingSubMeshCandidates` and `scene.getCollidingSubMeshCandidates` ([sebavan](https://github.com/sebavan)). This helps opening more customization to everybody.

## 3.2.0

### Major updates

-   Support for [GPU particles](/features/divingDeeper/particles/particle_system/particle_system_intro#gpu-particles). Demo [here](https://www.babylonjs-playground.com/frame.html#PU4WYI#14) ([deltakosh](https://github.com/deltakosh))
-   Improved building process: We now run a full visual validation test for each pull request. Furthermore, code comments and what's new updates are now mandatory ([sebavan](https://github.com/sebavan))
-   Babylon.js now uses Promises in addition to callbacks. We created several `xxxAsync` functions all over the framework (`SceneLoader.AppendAsync` for instance, which returns a Promise). A polyfill is also integrated to support older browsers ([deltakosh](https://github.com/deltakosh))
-   Introduced texture binding atlas. This optimization allows the engine to reuse texture bindings instead of rebinding textures when they are not on constant sampler indexes ([deltakosh](https://github.com/deltakosh))
-   New [AnimationGroup class](//doc.babylonjs.com/how_to/group) to control simultaneously multiple animations with different targets ([deltakosh](https://github.com/deltakosh))
-   `WebVRCamera`: added basic support for Daydream and Gear VR ([brianzinn](https://github.com/brianzinn))
-   Introduced [Projection Texture on SpotLight](//doc.babylonjs.com/babylon101/lights#projection-texture). Demo [here](https://www.babylonjs-playground.com/frame.html#CQNGRK) ([lostink](https://github.com/lostink))
-   Introduced support for [local cubemaps](//doc.babylonjs.com/how_to/reflect#using-local-cubemap-mode). Demo [here](https://www.babylonjs-playground.com/frame.html#RNASML#4) ([deltakosh](https://github.com/deltakosh))
-   Added [VideoDome](//doc.babylonjs.com/features/divingDeeper/environment/360VideoDome) class to easily support 360 videos. Demo [here](https://www.babylonjs-playground.com/frame.html#1E9JQ8#7) ([DavidHGillen](https://github.com/DavidHGillen))
-   Added [GlowLayer](/features/divingDeeper/mesh/glowLayer) to easily support glow from emissive materials. Demo [here](https://www.babylonjs.com/demos/GlowLayer/) ([sebavan](https://github.com/sebavan))
-   New [AssetContainer](//doc.babylonjs.com/how_to/how_to_use_assetcontainer) class and loading methods ([trevordev](https://github.com/trevordev))
-   Added [depth of field](https://www.babylonjs-playground.com/frame.html#8F5HYV#9), [MSAA, sharpening, chromatic aberration and grain effect](https://www.babylonjs-playground.com/#Y3C0HQ#146) to the default pipeline ([trevordev](https://github.com/trevordev))
-   Added support for [animation weights](//doc.babylonjs.com/features/divingDeeper/animation/animation_introduction#animation-weights). Demo [here](https://www.babylonjs-playground.com/#LL5BIQ) ([deltakosh](https://github.com/deltakosh))
-   Added [sub emitters for particle system](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#sub-emitters) which will spawn new particle systems when particles die. Demo [here](https://www.babylonjs-playground.com/frame.html#9NHBCC#1) ([IbraheemOsama](https://github.com/IbraheemOsama))
-   New [Babylon.js](//doc.babylonjs.com/workflow/wfDeeper/Exporters/Maya) and [glTF](//doc.babylonjs.com/workflow/wfDeeper/Exporters/Maya_to_glTF) exporter for Autodesk Maya ([Noalak](https://github.com/Noalak))
-   New [glTF exporter](//doc.babylonjs.com/workflow/wfDeeper/Exporters/3DSMax_to_glTF) for Autodesk 3dsmax ([Noalak](https://github.com/Noalak))
-   New glTF [serializer](//doc.babylonjs.com/toolsAndResources/gltfexporter). You can now export glTF or glb files directly from a Babylon scene ([kcoley](https://github.com/kcoley))
-   Physics - Latest production version of Oimo.js is being used - 1.0.9 ([RaananW](https://github.com/RaananW))
-   Introduces [PCF](/features/divingDeeper/lights/shadows#percentage-closer-filtering-webgl2-only) and [PCSS](/features/divingDeeper/lights/shadows#contact-hardening-shadow-webgl2-only) shadow support in WebGL 2 ([sebavan](https://github.com/sebavan)))
-   Introduces [PBR Specular Anti Aliasing support](/features/divingDeeper/materials/using/masterPBR#specular-aliasing). Demo [here](https://www.babylonjs-playground.com/#1XJD4C) ([sebavan](https://github.com/sebavan)))

### Documentation

-   Tons of functions and classes received the code comments they deserved (All the community with a special thanks to [John King](https://github.com/BabylonJSGuide))
-   Moved the class API documentation to Typedoc ([deltakosh](https://github.com/deltakosh))

### Updates

-   Improved [animation blending](https://www.babylonjs-playground.com/#DMLMIP#1) ([deltakosh](https://github.com/deltakosh))
-   New [particle system emitter shapes](//doc.babylonjs.com/features/divingDeeper/particles/particle_system/particle_system_intro#shape-emitters): cone and sphere ([IbraheemOsama](https://github.com/IbraheemOsama))
-   Added support for 16bits TGA ([deltakosh](https://github.com/deltakosh))
-   New `AnimationPropertiesOverride` class used to simplify setting animation properties on child animations. [Documentation](//doc.babylonjs.com/features/divingDeeper/animation/animation_introduction#overriding-properties) ([deltakosh](https://github.com/deltakosh))
-   New `Texture.UseSerializedUrlIfAny` static property to let textures serialize complete URL instead of using side by side loading ([deltakosh](https://github.com/deltakosh))
-   Added `particleSystem.reset()` to clear a particle system ([deltakosh](https://github.com/deltakosh))
-   Added support for all RGBA orders (BGR, RGB, etc..) for the DDS loader ([deltakosh](https://github.com/deltakosh))
-   Improved [SceneOptimizer](//doc.babylonjs.com/how_to/how_to_use_sceneoptimizer) to provide better adaptability ([deltakosh](https://github.com/deltakosh))
-   Improved `scene.isReady()` function which now takes in account shadows and LOD ([deltakosh](https://github.com/deltakosh))
-   Added new draw modes to engine (points, lines, linesloop, linestrip, trianglestrip, trianglefan) ([benaadams](https://github.com/benaadams))
-   Added GUI `Textblock.lineSpacing` setter and getter to configure vertical space between lines in pixels or percentage values when working with text wrapping ([carloslanderas](https://github.com/carloslanderas))
-   WebVR:
    -   `VRExperienceHelper` will create an empty controller model so that controller interactions can be used while the actual model is still loading ([trevordev](https://github.com/trevordev))
    -   VRHelper now has `onSelectedMeshUnselected` observable that will notify observers when the current selected mesh gets unselected
        ([carloslanderas](https://github.com/carloslanderas))
    -   VRHelper now has `onBeforeCameraTeleport` and `onAfterCameraTeleport` observables that will be notified before and after camera teleportation is triggered.
        ([carloslanderas](https://github.com/carloslanderas))
    -   VRHelper now has the public property `teleportationEnabled` to enable / disable camera teleportation.
        ([carloslanderas](https://github.com/carloslanderas))
    -   VRHelper now exposes `onNewMeshPicked` observable that will notify a PickingInfo object after meshSelectionPredicate evaluation
        ([carloslanderas](https://github.com/carloslanderas))
    -   VRHelper will notify now `onSelectedMeshUnselected` observable to subscribers when the applied ray selection predicate does not produce a hit and a mesh compliant with the meshSelectionPredicate was previously selected ([carloslanderas](https://github.com/carloslanderas))
    -   Support multiple simultaneous WebVR controller GUI interactions in `VRExperienceHelper` ([trevordev](https://github.com/trevordev))
    -   Ability to set a mesh to customize the WebVR gaze tracker ([trevordev](https://github.com/trevordev))
-   `AssetsManager` will now clear its `tasks` list from all successfully loaded tasks ([deltakosh](https://github.com/deltakosh))
-   Added documentation to `WebVRCamera` and `VRExperienceHelper` ([trevordev](https://github.com/trevordev))
-   Introduced `isStroke` on `HighlightLayerOptions` which makes the highlight solid ([PixelsCommander](https://github.com/pixelscommander))
-   The observables can now notify observers using promise-based callback chain ([RaananW](https://github.com/RaananW))
-   Added base64 helper functions to `Tools` ([bghgary](https://github.com/bghgary))
-   Added `createDefaultCamera` and `createDefaultLight` functions to `Scene` ([bghgary](https://github.com/bghgary))
-   Viewer:
    -   `initScene` and `initEngine` can now be extended. `onProgress` during model loading is implemented as observable ([RaananW](https://github.com/RaananW))
    -   There is now an option to paste payload instead of a URL for configuration ([RaananW](https://github.com/RaananW))
    -   Models can be loaded asynchronously using JavaScript ([RaananW](https://github.com/RaananW))
    -   Scene Optimizer integrated in viewer ([RaananW](https://github.com/RaananW))
    -   The viewer supports custom shaders in the configuration ([RaananW](https://github.com/RaananW))
    -   Introducing the viewer labs - testing new features ([RaananW](https://github.com/RaananW))
    -   Model can be normalized using configuration, camera is dynamically configured ([RaananW](https://github.com/RaananW))
    -   It is now possible to update parts of the configuration without recreating the objects ([RaananW](https://github.com/RaananW))
    -   Viewer supports model animations and multi-model loading ([RaananW](https://github.com/RaananW))
    -   Viewer's declaration file automatically generated ([RaananW](https://github.com/RaananW))
-   Build process:
    -   New watcher configuration for VSCode. Now the task only compiles changed files ([sebavan](https://github.com/sebavan))
    -   Gulp process now supports multiple outputs when using webpack. ([RaananW](https://github.com/RaananW))
    -   Extra/external declarations can be prepended to final declarations during build. ([RaananW](https://github.com/RaananW))
    -   Extra/external declarations can be prepended to final NPM declarations during build. ([RaananW](https://github.com/RaananW))
    -   NPM package now has a dependency system, updated during build. ([RaananW](https://github.com/RaananW))
-   SPS internal storage of each solid particle rotation matrix ([jbousquie](https://github.com/jbousquie))
-   SPS particle parenting feature ([jbousquie](https://github.com/jbousquie))
-   KeepAssets class and AssetContainer.moveAllFromScene ([HoloLite](https://www.html5gamedevs.com/profile/28694-hololite/) [trevordev](https://github.com/trevordev))
-   GUI.Line can have its world position set from one end or the other ([SvenFrankson](https://github.com/SvenFrankson))
-   Added FOV system to background material for zoom effects in skyboxes without adjusting camera FOV ([DavidHGillen](https://github.com/DavidHGillen))
-   glTF loader:
    -   glTF loader now supports the KHR_lights extension ([MiiBond](https://github.com/MiiBond))
    -   Improved glTF loader by using promises for asynchronous operations ([bghgary](https://github.com/bghgary)]
    -   Improved glTF loader performance by compiling materials in parallel with downloading external resources ([bghgary](https://github.com/bghgary)]
    -   Added unit tests for the glTF 2.0 loader ([bghgary](https://github.com/bghgary)]
    -   Added support for primitive modes to glTF 2.0 loader ([bghgary](https://github.com/bghgary)]
    -   Add support for sparse accessors to glTF 2.0 loader ([bghgary](https://github.com/bghgary))
    -   Add support for cameras to glTF 2.0 loader ([bghgary](https://github.com/bghgary)]
    -   Add support for preprocessing urls to glTF 2.0 loader ([bghgary](https://github.com/bghgary)]
    -   Added Draco mesh compression support to glTF 2.0 loader. ([bghgary](https://github.com/bghgary))
    -   Added unlit material extension support to glTF 2.0 loader. ([bghgary](https://github.com/bghgary))
-   Added promise-based async functions to the SceneLoader, Scene.whenReadyAsync, and material.forceCompilationAsync. ([bghgary](https://github.com/bghgary)]
-   Added checks to VertexData.merge to ensure data is valid before merging. ([bghgary](https://github.com/bghgary)]
-   Added promise-based async functions for `initWebVRAsync` and `useStandingMatrixAsync` ([trevordev](https://github.com/trevordev))
-   Add stroke (outline) options on GUI text control ([SvenFrankson](https://github.com/SvenFrankson))
-   Add isThumbClamped option on GUI slider control ([JeanPhilippeKernel](https://github.com/JeanPhilippeKernel))
-   Add floating point texture support for RenderTargetCubeTexture ([PeapBoy](https://github.com/NicolasBuecher))
-   Support for mutli-touch when interacting with multiple gui elements simultaneously ([trevordev](https://github.com/trevordev))
-   Added `Tools.WorkerPool` class for web worker management. ([bghgary](https://github.com/bghgary))
-   Support depth maps for multiple active cameras for post processes like depth of field ([trevordev](https://github.com/trevordev))
-   Integrates depth texture support in the engine ([sebavan](https://github.com/sebavan))
-   Default fragment shader will clamp negative values to avoid underflow, webVR post processing will render to eye texture size ([trevordev](https://github.com/trevordev))
-   Supports Environment Drag and Drop in Sandbox ([sebavan](https://github.com/sebavan))
-   EnvironmentHelper has no an `onError` observable to handle errors when loading the textures ([RaananW](https://github.com/RaananW))
-   Tests for sharpen, chromatic aberration, default pipeline and enable/disable post processes ([trevordev](https://github.com/trevordev))
-   onPointer\* callbacks have now the event type as a 3rd variable ([RaananW](https://github.com/RaananW))
-   Lightmap texture in PBR material follow the gammaSpace Flag of the texture ([sebavan](https://github.com/sebavan))
-   Added setTextureFromPostProcessOutput to bind the output of a postprocess into an effect ([trevordev](https://github.com/trevordev))
-   Updated bloom effect to only bloom areas of the image above a luminance threshold ([trevordev](https://github.com/trevordev))
-   Cannon and Oimo are optional dependencies ([RaananW](https://github.com/RaananW))
-   Shadows - Introduces [Normal Bias](/features/divingDeeper/lights/shadows#normal-bias-since-32) ([sebavan](https://github.com/sebavan)))
-   Earcut is an external, optional dependency. ([RaananW](https://github.com/RaananW))
-   Return animation groups when calling `SceneLoader.ImportMesh`. ([bghgary](https://github.com/bghgary)]
-   Add support for normalized and non-float data to `Buffer` and `VertexBuffer`. ([bghgary](https://github.com/bghgary)]
-   New serialize and parse functions for effect layers (Highlight and Glow layers) ([julien-moreau](https://github.com/julien-moreau))
-   GUI: Introduced `MultiLine` which will draw lines between any number of meshes, controls and points. [Documentation](//doc.babylonjs.com/how_to/gui#multiline) ([royibernthal](https://github.com/royibernthal))
-   Added `alphaCutOff` support for StandardMaterial ([deltakosh](https://github.com/deltakosh))
-   New `serialize` and `Parse` functions for SSAO2 Rendering Pipeline ([julien-moreau](https://github.com/julien-moreau))
-   Added `furOcclusion` property to FurMaterial to control the occlusion strength ([julien-moreau](https://github.com/julien-moreau))

### Bug fixes

-   `setPivotMatrix` was not setting pivot correctly. This is now fixed. We also introduced a new `setPreTransformMatrix` to reproduce the sometimes-needed behavior of the previous `setPivotMatrix` function ([deltakosh](https://github.com/deltakosh))
-   SPS solid particle `.pivot` property now also behaves like the standard mesh pivot. Former behavior (particle translation) can be kept with the particle property `.translateFromPivot` set to true ([jbousquie](https://github.com/jbousquie))
-   Texture extension detection in `Engine.CreateTexture` ([sebavan](https://github.com/sebavan))
-   SPS uses internal temporary Vector3 instead of Tmp.Vector3 to avoid possible concurrent uses ([jbousquie](https://github.com/jbousquie))
-   Fixed a bug when calling load on an empty assets manager - [#3739](https://github.com/BabylonJS/Babylon.js/issues/3739) ([RaananW](https://github.com/RaananW))
-   Enabling teleportation in the vr helper class caused a redundant post process to be added ([trevordev](https://github.com/trevordev))
-   (Viewer) Fixed a bug where loading another mesh positioned it incorrectly ([RaananW](https://github.com/RaananW))
-   (Viewer) Disabling templates now work correctly ([RaananW](https://github.com/RaananW))
-   Scale vr controllers by deviceScale when it is set in VRExperienceHelper ([trevordev](https://github.com/trevordev))
-   AMD "define" declaration is no longer anonymous ([RaananW](https://github.com/RaananW))
-   Collision worker didn't initialize instanced meshes correctly - [#3819](https://github.com/BabylonJS/Babylon.js/issues/3819) ([RaananW](https://github.com/RaananW))
-   `postMessage` calls in webworkers were fixed ([RaananW](https://github.com/RaananW))
-   Fixed WebCam Texture on Firefox and Edge - [#3825](https://github.com/BabylonJS/Babylon.js/issues/3825) ([sebavan](https://github.com/sebavan))
-   Add `onLoadObservable` on VideoTexture - [#3845](https://github.com/BabylonJS/Babylon.js/issues/3845) ([sebavan](https://github.com/sebavan))
-   `beforeRender` is now triggered after the camera updated its state - [#3873](https://github.com/BabylonJS/Babylon.js/issues/3873) ([RaananW](https://github.com/RaananW))
-   Reflection and refraction no longer apply a toLinear conversion twice when applying image processing as a post process - [#4060](https://github.com/BabylonJS/Babylon.js/issues/4060) ([trevordev](https://github.com/trevordev))
-   Fix ember.js compatibility in `PostProcessRenderEffect` ([sebavan](https://github.com/sebavan))
-   Fix ember.js compatibility in `BloomEffect` and `Camera` ([kaysabelle](https://github.com/kaysabelle))
-   Fix bug with glTF animation when animating bone scale. ([bghgary](https://github.com/bghgary)]

### Breaking changes

-   Removed the unused `PostProcessRenderPass` class and extended `postProcessingRenderingEffect` to support multiple PostProcesses ([trevordev](https://github.com/trevordev))
-   `VertexData.merge` no longer supports merging of data that do not have the same set of attributes. ([bghgary](https://github.com/bghgary)]
-   glTF 2.0 loader now creates a mesh for each primitive instead of merging the primitives together into one mesh. If a mesh only has one primitive, the behavior is the same as before. This change only affects meshes that have multiple primitives. ([bghgary](https://github.com/bghgary)]
-   Engine's `onCanvasPointerOutObservable` will now return a PointerEvent instead of the Engine. ([trevordev](https://github.com/trevordev))
-   Removed public references to default rendering pipeline's internal post process ([trevordev](https://github.com/trevordev))
-   `Bone.setScale` does not support scaleChildren property anymore. You can use `Bone.scale` to achieve the same effect ([deltakosh](https://github.com/deltakosh))
-   Vector3 &amp; Vector4:
    -   `MinimizeInPlace` has been renamed to `minimizeInPlace`
    -   `MaximizeInPlace` has been renamed to `maximizeInPlace`

## 3.1.0

### Major updates

-   Added VRExperienceHelper to create WebVR experience with 2 lines of code. [Documentation](//doc.babylonjs.com/how_to/webvr_helper) ([davrous](https://github.com/davrous), [TrevorDev](https://github.com/TrevorDev))
-   Added BackgroundMaterial. [Documentation](/features/divingDeeper/environment/backgroundMaterial) ([sebavan](https://github.com/sebavan))
-   Added EnvironmentHelper. [Documentation](/features/divingDeeper/environment/environment_introduction#skybox-and-ground) ([sebavan](https://github.com/sebavan))
-   Added support for WebGL context lost and restored events. [Documentation](//doc.babylonjs.com/tutorials/optimizing_your_scene#handling-webgl-context-lost) ([deltakosh](https://github.com/deltakosh))
-   Added support for non-pow2 textures when in WebGL2 mode ([deltakosh](https://github.com/deltakosh))
-   Engine can now be initialized with an existing WebGL context ([deltakosh](https://github.com/deltakosh))
-   Introduced behaviors. [Documentation](//doc.babylonjs.com/features/behaviour) ([deltakosh](https://github.com/deltakosh))
-   Added support for WebGL Occlusion queries. [Documentation](//doc.babylonjs.com/features/occlusionquery) ([Ibraheem Osama](https://github.com/IbraheemOsama))
-   New behaviors for ArcRotateCamera. [Documentation](//doc.babylonjs.com/features/behaviour)
    -   AutoRotation ([deltakosh](https://github.com/deltakosh))
    -   Framing ([deltakosh](https://github.com/deltakosh))
    -   Bouncing ([deltakosh](https://github.com/deltakosh))
-   New InputText for Babylon.GUI. [Documentation](//doc.babylonjs.com/how_to/gui#inputtext) ([deltakosh](https://github.com/deltakosh))
-   New VirtualKeyboard for Babylon.GUI. [Documentation](//doc.babylonjs.com/how_to/gui#virtualkeyboard) ([deltakosh](https://github.com/deltakosh) / [adam](https://github.com/abow))
-   Added support for depth pre-pass rendering. [Documentation](//doc.babylonjs.com/tutorials/transparency_and_how_meshes_are_rendered#depth-pre-pass-meshes) ([deltakosh](https://github.com/deltakosh))
-   Added support for `material.separateCullingPass`. [Documentation](//doc.babylonjs.com/tutorials/transparency_and_how_meshes_are_rendered#things-to-do-and-not-to-do) ([sebavan](https://github.com/sebavan))
-   Added support for Windows Motion Controllers ([Lewis Weaver](https://github.com/leweaver))
-   Added support for Particle animation in ParticleSystem. [Documentation](//doc.babylonjs.com/tutorials/particles#particle-animation) ([Ibraheem Osama](https://github.com/IbraheemOsama))
-   More robust TypeScript code with _strictNullChecks_, _noImplicitAny_, _noImplicitThis_ and _noImplicitReturns_ compiler options ([deltakosh](https://github.com/deltakosh) and [RaananW](https://github.com/RaananW))
-   Introduced `NullEngine` which can be used to use Babylon.js in headless mode. [Documentation](//doc.babylonjs.com/generals/nullengine) ([deltakosh](https://github.com/deltakosh))
-   New instrumentations tools. [Documentation](//doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation) ([deltakosh](https://github.com/deltakosh))
-   Complete rework of Unity3D exporter. [Documentation](//doc.babylonjs.com/resources/intro) ([MackeyK24](https://github.com/MackeyK24))
-   Introducing theBabylon.js viewer, an HTML-based 3D/model viewer, with Babylon at its core. [Documentation](//doc.babylonjs.com/toolsAndResources/the_babylon_viewer) ([RaananW](https://github.com/RaananW))
-   Full NPM support forBabylon.js and its modules, based on UMD and including Typings. [BabylonJS on npm](https://www.npmjs.com/~babylonjs) ([RaananW](https://github.com/RaananW))

### Updates

-   Introduced `TransformNode` class as a parent of `AbstractMesh`. This class was extensively asked by the community to hold only transformation for a node ([deltakosh](https://github.com/deltakosh))
-   Collider object is now exposed on meshes. It can be used to get precise information about mesh to mesh collisions (used with mesh.moveWithCollisions function) ([deltakosh](https://github.com/deltakosh))
-   Added `boundingInfo.centerOn` to recreate the bounding info to be centered around a specific point given a specific extend ([deltakosh](https://github.com/deltakosh))
-   Added `mesh.normalizeToUnitCube` to uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units) ([deltakosh](https://github.com/deltakosh))
-   Added `scene.onDataLoadedObservable` which is raised when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed ([deltakosh](https://github.com/deltakosh))
-   Support for adaptiveKernelBlur on MirrorTexture ([deltakosh](https://github.com/deltakosh))
-   Support for non-uniform scaling. Normals are now correctly computed ([deltakosh](https://github.com/deltakosh))
-   Added `MultiObserver`. [Documentation](/features/divingDeeper/events/observables) ([deltakosh](https://github.com/deltakosh))
-   Added `shadowGenerator.addShadowCaster` and `shadowGenerator.removeShadowCaster` helper functions ([deltakosh](https://github.com/deltakosh))
-   Several inspector improvements ([temechon](https://github.com/temechon))
-   New observables for actions: `onBeforeExecuteObservable` for all actions and `onInterpolationDoneObservable` for `InterpolateValueAction` ([deltakosh](https://github.com/deltakosh))
-   New observables for gamepads: `onButtonDownObservable`, `onButtonUpObservable`, `onPadDownObservable`, `onPadUpObservable` ([deltakosh](https://github.com/deltakosh))
-   New `camera.storeState()` and `camera.restoreState()` functions to store / restore cameras position / rotation / fov. [Documentation](//doc.babylonjs.com/tutorials/cameras#state) ([deltakosh](https://github.com/deltakosh))
-   POW2 textures rescale is now done by shaders (It was previously done using canvas) ([deltakosh](https://github.com/deltakosh))
-   Added `SceneLoader.CleanBoneMatrixWeights` to force the loader to normalize matrix weights when loading bones (off by default) ([deltakosh](https://github.com/deltakosh))
-   Added `camera.onViewMatrixChangedObservable` and `camera.onProjectionMatrixChangedObservable` ([deltakosh](https://github.com/deltakosh))
-   Added support for folders when drag'n'dropping into the sandbox ([deltakosh](https://github.com/deltakosh))
-   Better serialization support ([deltakosh](https://github.com/deltakosh))
-   Introduced `performanceMonitor` class to get better FPS analysis ([deltakosh](https://github.com/deltakosh))
-   GUI: Added support for pointer move events on projected UI ([deltakosh](https://github.com/deltakosh))
-   Normals are generated automatically by StandardMaterial if meshes do not have normals ([deltakosh](https://github.com/deltakosh))
-   Added `mesh.onMaterialChangedObservable` to notify when a new material is set ([deltakosh](https://github.com/deltakosh))
-   Improved the SPS perfs for dead or invisible solid particles ([jerome](https://github.com/jbousquie))
-   Added `enableDepthSort` parameter to the SPS in order to sort the particles from the camera position ([jerome](https://github.com/jbousquie))
-   Added `pivot` property to the SPS solid particles ([jerome](https://github.com/jbousquie))
-   Added the mesh facet depth sort to FacetData ([jerome](https://github.com/jbousquie))
-   Added `LineSystem` and `LineMesh` per point colors ([jerome](https://github.com/jbousquie))
-   Added `AdvancedDynamicTexture.renderScale` to allow users to render at higher DPI ([deltakosh](https://github.com/deltakosh))
-   WaterMaterial works on VR ([RaananW](https://github.com/RaananW))
-   Playground has an optional createEngine function to replace the default engine. [Example](https://www.babylonjs-playground.com/#5CAP01#5) ([RaananW](https://github.com/RaananW))
-   Error handling in the Assets Manager was revamped and now also includes a message and an exception (if provided). [Documentation](//doc.babylonjs.com/features/divingDeeper/importers/assetManager#task-state-and-error-handling) ([RaananW](https://github.com/RaananW))
-   Asset Task has a state (INIT, RUNNING, DONE and ERROR). [Documentation](//doc.babylonjs.com/features/divingDeeper/importers/assetManager#task-state-and-error-handling) ([RaananW](https://github.com/RaananW))
-   Added new options to the physics impostor constructor - ignoreParent and diableBidirectionalTransformation. [Documentation](//doc.babylonjs.com/features/divingDeeper/physics/usingPhysicsEngine#impostors) ([RaananW](https://github.com/RaananW))
-   It is now possible to define which loader to use when loading assets using the SceneLoader. [Commit](https://github.com/BabylonJS/Babylon.js/commit/91bffeaafc668980be0f9cf83df69b8eb2e2ba5f) ([RaananW](https://github.com/RaananW))
-   Added scope option to Observerable ([adam](https://github.com/abow))
-   Added shadowBlur, shadowOffsetX, shadowOffsetY, shadowColor to GUI Controls ([adam](https://github.com/abow))
-   Added alignWithNormal to AbstractMesh ([adam](https://github.com/abow))

### Bug fixes

-   Fixed a bug with ellipsoid offset not being taking in account on cameras ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with ellipsoid offset badly taking in account on meshes ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with PBR on iOS ([sebavan](https://github.com/sebavan))
-   MTLLoader didn't parse values correctly ([RaananW](https://github.com/RaananW))
-   Fixed an error with child positions of parents in the physics engine ([RaananW](https://github.com/RaananW))
-   Fixed a bug with error while executing onSuccess callbacks in the Assets manager. ([RaananW](https://github.com/RaananW))
-   Fixed a bug with the Heightmap impostor when the heightmap is scaled or rotated. [Commit](https://github.com/BabylonJS/Babylon.js/commit/e898c4f26512a5466b5b594aecf4711f1dfd50e0) ([RaananW](https://github.com/RaananW))
-   Fixed an error with deterministic step. ([RaananW](https://github.com/RaananW))
-   Fixed a bug with controller jitter when in VR. ([RaananW](https://github.com/RaananW))
-   Fixed a bug with impostor jitter when in VR. ([RaananW](https://github.com/RaananW))
-   Fixed a bug with GUI Slider not working correctly when rotated ([adam](https://github.com/abow))
-   Fixed IE11 "spacebar" bug with GUI InputText ([adam](https://github.com/abow))

### Breaking changes

-   `Gamepads` was removed in favor of `scene.gamepadManager`
-   `DynamicFloatArray`, `MapTexture` and `RectPakingMap` were removed because there were not used anymore
-   `IAssetTask` was removed in favor of `AbstractAssetTask` class
-   WebVR 1.0 support removed.

## 3.0.0

### Major updates

-   WebGL2 context support. WebGL2 is now used instead of WebGL 1 when available. [More info here](//doc.babylonjs.com/features/webgl2) ([deltakosh](https://github.com/deltakosh))
-   Complete WebVR 1.1 support including controllers for HTC Vive and Oculus. [More info here](//doc.babylonjs.com/how_to/webvr_camera) ([raanan](https://github.com/raananw) & [davrous](https://github.com/davrous))
-   Complete rewrite of PBRMaterial. Introduced two new helper materials: `pbrMetallicRoughnessMaterial` and `pbrSpecularGlossinessMaterial`. [Demo](https://www.babylonjs.com/demos/pbrglossy/) - [More info here](//doc.babylonjs.com/features/divingDeeper/materials/using/introToPBR) ([Sebastien Vandenberghe](https://github.com/sebavan))
-   Support for Morph Targets. [More info here](//doc.babylonjs.com/How_To/how_to_use_morphtargets) ([deltakosh](https://github.com/deltakosh))
-   New Babylon.GUI to create user interface (compatible with WebVR). [More info here](//doc.babylonjs.com/features/Gui) ([deltakosh](https://github.com/deltakosh))
-   Added support for Exponential Shadow maps to replace Variance Shadow maps. [more info here](https://www.babylonjs-playground.com/debug.html#1CXNXC#3) [Demo#1](https://www.babylonjs.com/Demos/AdvancedShadows/) [Demo#2](https://www.babylonjs-playground.com/#1CXNXC#4) ([deltakosh](https://github.com/deltakosh))
-   Support for [Vertex Array Objects](https://www.opengl.org/registry/specs/ARB/vertex_array_object.txt) ([deltakosh](https://github.com/deltakosh))
-   Support for [Uniform Buffer Objects](https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.16) ([CraigFeldspar](https://github.com/CraigFeldspar))
-   New [SSAO](https://en.wikipedia.org/wiki/Screen_space_ambient_occlusion) technique, using [MultiRenderTargets](https://en.wikipedia.org/wiki/Multiple_Render_Targets) ([CraigFeldspar](https://github.com/CraigFeldspar))
-   Support for multisample render targets. [Demo](https://www.babylonjs-playground.com/#12MKMN) ([deltakosh](https://github.com/deltakosh))
-   New DebugLayer. [Doc](//doc.babylonjs.com/how_to/customize_debug_layer) ([temechon](https://github.com/temechon))
-   New `VideoTexture.CreateFromWebCam` to generate video texture using WebRTC. [Demo](https://www.babylonjs-playground.com#1R77YT#11) ([Sebastien Vandenberghe](https://github.com/sebavan)) / ([deltakosh](https://github.com/deltakosh))
-   New Facet Data feature ([jerome](https://github.com/jbousquie))
-   babylon.fontTexture.ts was moved from babylon.js to canvas2D ([nockawa](https://github.com/nockawa))
-   Multi-platform Compressed Textures for Desktops & Mobile Devices with fall back. Batch (dos) scripts to convert entire directories of .jpg's & .png's [Doc](//doc.babylonjs.com/features/divingDeeper/materials/advanced/) ([jcpalmer](https://github.com/Palmer-JC))
-   All deprecated functions and properties were removed ([deltakosh](https://github.com/deltakosh))
-   New build system based on workloads. [More info here](//doc.babylonjs.com/generals/how_to_start#custom-builds) ([deltakosh](https://github.com/deltakosh))
-   New `Cell Shading` material added into `Materials Library` [Demo](https://www.babylonjs.com/Demos/CellShading/) ([Julien Moreau-Mathis](https://github.com/julien-moreau))
-   New kernel based blur. [Demo](https://www.babylonjs-playground.com/#FBH4J7#1) ([deltakosh](https://github.com/deltakosh))
-   New highlights postprocess ([deltakosh](https://github.com/deltakosh))
-   New DefaultRenderingPipeline to enable image processing effect. [Demo](https://www.babylonjs-playground.com/#5XB8YT#1) ([deltakosh](https://github.com/deltakosh))
-   New image processing postprocess. [Doc here](//doc.babylonjs.com/features/divingDeeper/postProcesses/usePostProcesses#imageprocessing) ([deltakosh](https://github.com/deltakosh))
-   Spector.js New WebGL debugger: [more info here](http://spector.babylonjs.com) ([Sebastien Vandenberghe](https://github.com/sebavan))
-   New blur mode for mirrors. [Demo](https://www.babylonjs-playground.com/#9I6NX1) ([deltakosh](https://github.com/deltakosh))

### Updates

-   Added `syncBoneWithImpostor()` and `syncImpostorWithBone()` to PhysicsImpostor to help with creating ragdoll effects. [Demo](https://playground.babylonjs.com/#PM5MFS#5) ([abow](https://github.com/abow))
-   New automatic creation mode for skybox. [Doc here](/features/divingDeeper/environment/environment_introduction#automatic-creation) ([deltakosh](https://github.com/deltakosh))
-   New way to force compilation of materials. [Doc here](//doc.babylonjs.com/resources/How_materials_work) ([deltakosh](https://github.com/deltakosh))
-   Added a Physics tab to the inspector ([abow](https://github.com/abow))
-   New Debug.PhysicsViewer class for viewing PhysicsImpostors. [Demo](https://www.babylonjs-playground.com/#CA51CM#2) ([abow](https://github.com/abow))
-   New ColorPicker for GUI. [Demo](https://www.babylonjs-playground.com/#91I2RE#1) ([abow](https://github.com/abow))
-   Added slerp and limits to BoneLookController. [Demo](https://www.babylonjs-playground.com/#1YEPX6#11) ([abow](https://github.com/abow))
-   new `Texture.readPixels()` function to read texture content ([deltakosh](https://github.com/deltakosh))
-   New helpers to use ExtrudePolygon. [Demo](https://www.babylonjs-playground.com/#RNCYVM#10) ([Cubees](https://github.com/Cubees))
-   PostProcess can now use alpha blending and share outputs ([deltakosh](https://github.com/deltakosh))
-   Added `ArcRotateCamera.panningInertia` to decouple inertia from panning inertia ([deltakosh](https://github.com/deltakosh))
-   Added `FIXED_EQUIRECTANGULAR_MIRRORED_MODE` mode for reflection texture. [Demo here](https://www.babylonjs-playground.com/#11GAIH#22) ([deltakosh](https://github.com/deltakosh))
-   Introduced `boundingBox.centerWorld` and `boundingBox.extendSizeWorld` ([deltakosh](https://github.com/deltakosh))
-   Improved FXAA post-process ([deltakosh](https://github.com/deltakosh))
-   Added `Light.customProjectionMatrixBuilder` to allow developers to define their own projection matrix for shadows ([deltakosh](https://github.com/deltakosh))
-   Added `set()` function to all basic types ([deltakosh](https://github.com/deltakosh))
-   Added `HDRCubeTextureAssetTask` to AssetManager ([deltakosh](https://github.com/deltakosh))
-   Engine now uses range based fog ([deltakosh](https://github.com/deltakosh))
-   `VertexBuffer.updatable` is now serialized ([deltakosh](https://github.com/deltakosh))
-   Added `intersectsMeshes()` to Ray ([abow](https://github.com/abow))
-   New RayHelper class for easily viewing and attaching a ray to a mesh. [Demo](https://www.babylonjs-playground.com/#ZHDBJ#35) [abow](https://github.com/abow))
-   `Mesh.applyDisplacementMap` now accepts uvScale and uvOffset parameter ([deltakosh](https://github.com/deltakosh))
-   Added `addChild()`, `removeChild()`, `setParent()` to AbstractMesh ([abow](https://github.com/abow))
-   `Effect.getVertexShaderSource()` and `Effect.getFragmentShaderSource()` now returns the effective shader code (including evaluation of #define) ([deltakosh](https://github.com/deltakosh))
-   GroundMesh : `getHeightAtCoordinates()`, `getNormalAtCoordinates()` and `getNormalAtCoordinatesToRef()` can now work with rotated grounds ([jerome](https://github.com/jbousquie))
-   `GroundMesh`, `facetData` and `SolidParticleSystem` improvement in normal computations ([jerome](https://github.com/jbousquie))
-   Added `AbstractMesh.addRotation()` ([jerome](https://github.com/jbousquie))
-   Added `Quaternion.RotationQuaternionFromAxis()` and `Quaternion.RotationQuaternionFromAxisToRef()` ([jerome](https://github.com/jbousquie), thanks to [abow](https://github.com/abow))
-   Added parameters `uvs` and `colors` to `MeshBuilder.CreateRibbon()` ([jerome](https://github.com/jbousquie))
-   Added parameters `frontUVs` and `backUVs` to all the methods `MeshBuilder.CreateXXX()` supporting `sideOrientation` ([jerome](https://github.com/jbousquie))
-   Added `Curve3.CreateCatmullRomSpline()` ([jerome](https://github.com/jbousquie) and [BitOfGold](https://github.com/BitOfGold))
-   Added the optional parameter`colorFilter` to `CreateGroundFromHeightMap()` ([jerome](https://github.com/jbousquie))
-   Improved the internal code of `Vector3.RotationFromAxisToRef()` ([jerome](https://github.com/jbousquie), thanks to [abow](https://github.com/abow))
-   GroundMeshes are now serialized correctly ([deltakosh](https://github.com/deltakosh))
-   Added `mesh.markVerticesDataAsUpdatable()` to allow a specific vertexbuffer to become updatable ([deltakosh](https://github.com/deltakosh))
-   Added `POINTERTAP` and `POINTERDOUBLETAP` PointerEventTypes to register new Observer mask. [Demo here](https://www.babylonjs-playground.com/#C245A1) ([yuccai](https://github.com/yuccai))
-   Added OnDoublePickTrigger for ActionManager ([yuccai](https://github.com/yuccai))
-   Added Scene.DoubleClickDelay to set the timing within a double click event like PointerEventTypes.POINTERDOUBLETAP or ActionManager.OnDoublePickTrigger has to be processed ([yuccai](https://github.com/yuccai))
-   New material: `ShadowOnlyMaterial` to display shadows on transparent surfaces ([deltakosh](https://github.com/deltakosh))
-   Added `VertexBuffer.TangentKind` to specify tangents in place of shader-calculated tangents ([dewadswo](https://github.com/dewadswo), [bghgary](https://github.com/bghgary))
-   Added `material.twoSidedLighting` to PBRMaterial and StandardMaterial to enable flipping normals when backfaceCulling is false ([BeardedGnome](https://github.com/BeardedGnome), [bghgary](https://github.com/bghgary))
-   Added a [HTML page](https://github.com/BabylonJS/Babylon.js/blob/master/Tools/Gulp/profiling.html) with embedded directions to improve the custom build process. ([jcpalmer](https://github.com/Palmer-JC))
-   Added glTF 2.0 loader with versioning support ([bghgary](https://github.com/bghgary), thanks to [BeardedGnome](https://github.com/BeardedGnome) for animation updates)
-   New `Motion Blur` effect added into `StandardRenderingPipeline` [Demo](https://www.babylonjs.com/Demos/MotionBlur/) ([Julien Moreau-Mathis](https://github.com/julien-moreau))
-   Allow the BlackAndWhite post process to adjust the degree in subsequent frames, for `Welcome to Wonderland` types of animation ([jcpalmer](https://github.com/Palmer-JC))
-   New `BABYLON.TextureTools.CreateResizedCopy` function to create a copy of a texture and chage its size ([deltakosh](https://github.com/deltakosh))

### Bug fixes

-   Fixed issue with FPS not decreasing when reflections are disabled ([abow](https://github.com/abow))
-   Fixed disappearing BoneAxesViewer ([abow](https://github.com/abow))
-   Fixed disappearing SkeletonViewer ([abow](https://github.com/abow))
-   Fixed billboarding for parented meshes ([abow](https://github.com/abow))
-   Fixed issue with BoneIKController and left-handed coordinate systems ([abow](https://github.com/abow))
-   Fixed a bug with spotlight direction ([deltakosh](https://github.com/deltakosh))
-   Fixed an issue with Mesh.attachToBone when a mesh is moving and an animation is changed ([abow](https://github.com/abow))
-   Fixed an issue withaspect ratio when using CreateScreenshot ([deltakosh](https://github.com/deltakosh))
-   Fixed SPS particle initial status when used as updatable with a `positionFunction` in `addShape()` ([jerome](https://github.com/jbousquie))
-   Fixed SPS particle access `start` index when used with `setParticles(start, end)` ([jerome](https://github.com/jbousquie))
-   Fixed SPS billboard mode when used with a parented camera ([jerome](https://github.com/jbousquie))

### API Documentation

-   File `abstractMesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `mesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `groundMesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `instancedMesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `lineMesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `vertexData.ts` documented ([jerome](https://github.com/jbousquie))
-   File `subMesh.ts` documented ([jerome](https://github.com/jbousquie))
-   File `vertexBuffer.ts` documented ([jerome](https://github.com/jbousquie))
-   File `math.ts` documented ([jerome](https://github.com/jbousquie))
-   File `light.ts` documented ([jerome](https://github.com/jbousquie))
-   File `directionalLight.ts` documented ([jerome](https://github.com/jbousquie))
-   File `hemisphericLight.ts` documented ([jerome](https://github.com/jbousquie))
-   File `pointLight.ts` documented ([jerome](https://github.com/jbousquie))
-   File `spotLight.ts` documented ([jerome](https://github.com/jbousquie))
-   File `shadowGenerator.ts` documented ([jerome](https://github.com/jbousquie))

### Breaking changes

-   WebVRCamera:
    -   `requestVRFullscreen` has been removed. Call `attachControl()` inside a user-interaction callback to start sending frames to the VR display
    -   `setPositionOffset` has been used to change the position offset. it is now done using `camera.position`
-   Ray :
    -   `show` has been removed. Use new `RayHelper.show()` instead
    -   `hide` has been removed. Use new `RayHelper.hide()` instead
-   AbstractMesh:
    -   `onPhysicsCollide` has been removed. Use `mesh.physicsImpostor.registerOnPhysicsCollide()` instead
    -   `setPhysicsState` has been removed. Use `new PhysicsImpostor()` instead
    -   `getPhysicsMass` has been removed. Use `mesh.physicsImpostor.getParam("mass")` instead
    -   `getPhysicsFriction` has been removed. Use `mesh.physicsImpostor.getParam("friction")` instead
    -   `getPhysicsRestitution` has been removed. Use `mesh.physicsImpostor.getParam("restitution")` instead
    -   `updatePhysicsBodyPosition` has been removed. Changes are synchronized automatically now
-   Mesh:
    -   `updateVerticesDataDirectly` has been removed. Use `mesh.updateVerticesData()` instead
-   SsaoRenderingPipeline:
    -   `getBlurHPostProcess` has been removed. Blur post-process is no more required
    -   `getBlurVPostProcess` has been removed. Blur post-process is no more required
-   Scene:
    -   `setGravity` has been removed. Use `scene.getPhysicsEngine().setGravity()` instead
    -   `createCompoundImpostor` has been removed. Use PhysicsImpostor parent/child instead
-   ActionManager:
    -   `LongPressDelay` and `DragMovementThreshold` are now respectively Scene.LongPressDelay and Scene.DragMovementThreshold
-   HDRRenderingPipeline:
    -   `HDRRenderingPipeline` has been removed because it is deprecated. It is now replaced by `StandardRenderingPipeline` which is more advanced. See [documentation](//doc.babylonjs.com/How_To/using_standard_rendering_pipeline)
-   PBRMaterial:
    -   Fixed several bugs which could lead to visual changes. [More info here](https://www.html5gamedevs.com/topic/30754-pbr-breaking-changes/)
    -   Removed all overloadedXXX properties
    -   Removed all fresnelXXX properties
    -   Removed .babylon.hdr textures: We now use DDS files.

## 2.5.0

### Core Engine

#### Major updates

-   New `StandardRenderingPipeline` effect to support screen space lens flare and depth of field. [Demo](https://www.babylonjs.com/Demos/StandardRenderingPipeline/) - ([Julien Moreau-Mathis](https://github.com/julien-moreau))
-   New `HighlightLayer` object to enable highlights rendering. [Demo](https://www.babylonjs.com/Demos/Highlights/) - ([sebavan](https://github.com/sebavan))
-   Babylon.js now supports right handed system with `scene.useRightHandedSystem = true` ([deltakosh](https://github.com/deltakosh))
-   Babylon.js is now compiled with [optimize-js](https://github.com/nolanlawson/optimize-js) to get faster initial load ([deltakosh](https://github.com/deltakosh))
-   New BoneIKController [Demo](https://www.babylonjs-playground.com/#1EVNNB#15) ([abow](https://github.com/abow))
-   New BoneLookController [Demo](https://www.babylonjs-playground.com/#1B1PUZ#15) ([abow](https://github.com/abow))
-   You can now build your own version of babylon.js with `gulp build-custom` [Doc](//doc.babylonjs.com/generals/how_to_start) ([deltakosh](https://github.com/deltakosh))

#### Updates

-   Added `node.doNotSerialize` to prevent specific nodes to be serialized by `SceneSerializer` ([deltakosh](https://github.com/deltakosh))
-   Added `scene.multiPick` and `scene.multiPickWithRay` to return an array of pickedMesh objects ([deltakosh](https://github.com/deltakosh))
-   Added `Effect.GetVertexShaderSource()` and `Effect.GetFragmentShaderSource()` ([deltakosh](https://github.com/deltakosh))
-   New `Texture.LoadFromDataString()` to help loading base64 encoded textures ([deltakosh](https://github.com/deltakosh))
-   Added Engine detection of the compresed texture formats supported by Hw / browser. You can specify those formats you have files for using `Engine.setTextureFormatToUse()`, and an appropriate one will be chosen. ([Palmer-JC](https://github.com/Palmer-JC/))
-   Added Ray.intersectsMesh, Ray.show, Ray.hide ([abow](https://github.com/abow))
-   Added AbstractMesh.setPivotPoint, AbstractMesh.getPivotPoint, AbstractMesh.getAbsolutePivotPoint ([abow](https://github.com/abow))
-   Added Debug.AxesViewer and Debug.BoneAxesViewer ([abow](https://github.com/abow))
-   Added Bone.getAbsolutePositionFromLocal and getLocalPositionFromAbsolute ([abow](https://github.com/abow))
-   Added Bone.setRotation, Bone.getRotation, Bone.setRotationQuaternion, Bone.getRotationQuaternion ([abow](https://github.com/abow))
-   Added Bone.getAbsolutePosition and Bone.getAbsolutePositionToRef ([abow](https://github.com/abow))
-   Added Bone.translate, Bone.setPosition, Bone.setAbsolutePosition ([abow](https://github.com/abow))
-   Added Bone.setYawPitchRoll, Bone.setRotationMatrix, Bone.setScale, Bone.setAxisAngle ([abow](https://github.com/abow))
-   Added Bone.rotate ([abow](https://github.com/abow))
-   Added Bone.scale ([abow](https://github.com/abow))
-   Added Camera.getDirection, AbstractMesh.getDirection, Bone.getDirection ([abow](https://github.com/abow))
-   Added subdivisionsX, subdivisionsY option to GroundMesh ([abow](https://github.com/abow))
-   New `Tools.CreateScreenshot` function will capture all canvas data. Previous implementation is now called `CreateScreenshotUsingRenderTarget` ([deltakosh](https://github.com/deltakosh))
-   Cube textures are now cached by texture cache ([deltakosh](https://github.com/deltakosh))
-   Added onAnimationEnd callback for `sprite.playAnimation` ([deltakosh](https://github.com/deltakosh))
-   Added support for non square textures for sprites ([deltakosh](https://github.com/deltakosh))
-   Added support for texture arrays ([deltakosh](https://github.com/deltakosh))
-   Added `camera.isInFrustum` and `camera.isCompletelyInFrustum`. Can be used with meshes, submeshes and boundingInfo ([deltakosh](https://github.com/deltakosh))
-   Several memory allocation reduction ([benaadams](https://github.com/benaadams))
-   Several GPU state change reduction ([benaadams](https://github.com/benaadams))
-   MapTexture: add `supersample` mode to double font quality. ([nockawa](https://github.com/nockawa))
-   New SPS feature : solid particle intersection with other solid particle or with any mesh `particle.intersectsMesh()` ([jerome](https://github.com/jbousquie))
-   New `invertUV` parameter an all ribbon based shapes : ribbon, tube, lathe, basic and custom extrusion ([jerome](https://github.com/jbousquie))
-   PerfCounter class added to monitor time/counter and expose min/max/average/lastSecondAverage/current metrics. Updated engine/scene current counter to use this class, exposing new properties as well to access the PerfCounter object ([nockawa](https://github.com/nockawa))
-   Better keyboard event handling which is now done at canvas level and not at window level ([deltakosh](https://github.com/deltakosh))
-   New `scene.hoverCursor` property to define a custom cursor when moving mouse over meshes ([deltakosh](https://github.com/deltakosh))
-   WebVR Camera was updated to be conform with the current specs. ([RaananW](https://github.com/RaananW))
-   New "CubeTextureTask" function will allow you to load a CubeTexture in the assetsManager. ([agallouin](https://github.com/AGallouin))
-   Scene.stopAnimation has now an optional second parameter, the name of the animation to kill. Usefull if a mesh has multiple animations. ([agallouin](https://github.com/AGallouin))

#### Bug fixes

-   Fixed issue with SkeletonViewer not displaying correctly with meshes that have a PoseMatrix ([abow](https://github.com/abow))
-   Fixed issue with Quaternion.toEulerAnglesToRef ([abow](https://github.com/abow))
-   Fixed issue with Animatable.goToFrame ([abow](https://github.com/abow))
-   Fixed issue with instancse and viewports ([deltakosh](https://github.com/deltakosh))
-   Fixed issue with FreeCamera not working in fullscreen or when pointer locked ([abow](https://github.com/abow))
-   MapTexture: Font Characters are now correctly aligned on Chrome ([nockawa](https://github.com/nockawa))
-   Fixed some missing parameter default values in `MeshBuilder.CreateGroundFromHeightMap()` and `MeshBuilder.CreateTiledGround()` ([jerome](https://github.com/jbousquie))
-   Fixed cross vector calculation in `_computeHeightQuads()` that affected all the `GroundMesh.getHeightAtCoordinates()` and `GroundMesh.getNormalAtCoordinates()` methods ([jerome](https://github.com/jbousquie))
-   Fixed `Mesh.CreateDashedLines()` missing `instance` parameter on update ([jerome](https://github.com/jbousquie))
-   Added BBox update on each ribbon based shape (ribbon, tube, extrusion, etc) on dynamic updates ([jerome](https://github.com/jbousquie))
-   Fixed model shape initial red vertex color set to zero not formerly being taken in account in the `SolidParticleSystem` ([jerome](https://github.com/jbousquie))
-   Fixed billboard when the SPS mesh is parented in the `SolidParticleSystem` ([jerome](https://github.com/jbousquie))
-   Fixed RenderTargetTexture meshes selection ([deltakosh](https://github.com/deltakosh))
-   Fixed camera speed computation ([deltakosh](https://github.com/deltakosh))
-   Fixed bug with instances, LOD and edgesRendering ([deltakosh](https://github.com/deltakosh))

#### Breaking changes

-   FollowCamera.target was renamed to FollowCamera.lockedTarget to avoid conflicts ([deltakosh](https://github.com/deltakosh))
-   Removed legacy shaders support ([deltakosh](https://github.com/deltakosh))

## 2.4.0

### Core Engine

#### Major updates

-   New refraction channel for Standard material (including fresnel support). Refraction texture can be provided by a reflection probe or a refraction texture. [See demo here](https://www.babylonjs.com/Demos/refraction/) ([deltakosh](https://github.com/deltakosh))
-   Added support for HDR cubemaps. [demo here](https://www.babylonjs-playground.com/#19JGPR#4) ([sebavan](https://github.com/sebavan))
-   Support for shaders includes ([deltakosh](https://github.com/deltakosh))
-   New mesh type : `LineSystem`. [Demo here](https://www.babylonjs-playground.com/#2K1IS4#5) ([jerome](https://github.com/jbousquie))
-   SerializationHelper for complex classes using TypeScript decorators ([deltakosh](https://github.com/deltakosh))
-   StandardMaterial now supports Parallax and Parallax Occlusion Mapping ([tutorial](//doc.babylonjs.com/How_To/Using_parallax_mapping)) ([nockawa](https://github.com/nockawa))
-   Animations blending. See [demo here](https://www.babylonjs-playground.com/#2BLI9T#3). More [info here](//doc.babylonjs.com/features/divingDeeper/animation/animation_introduction#animation-blending) ([deltakosh](https://github.com/deltakosh))
-   New debuger tool: SkeletonViewer. See [demo here](https://www.babylonjs-playground.com/#1BZJVJ#8) (Adam & [deltakosh](https://github.com/deltakosh))
-   Added Camera Inputs Manager to manage camera inputs (mouse, touch, keyboard, gamepad, ...) in a composable way, without relying on class inheritance. [Documentation here](//doc.babylonjs.com/How_To/Customizing_Camera_Inputs) ([gleborgne](https://github.com/gleborgne))
-   Introduced new observable system to handle events. [Documentation here](/features/divingDeeper/events/observables) ([nockawa](https://github.com/nockawa), [deltakosh](https://github.com/deltakosh))
-   Added a new VR camera : VRDeviceOrientationArcRotateCamera ([temechon](https://github.com/Temechon))
-   Moved PBR Material to core ([deltakosh](https://github.com/deltakosh))
-   StandardMaterial.maxSimultaneousLights can define how many dynamic lights the material can handle. [Demo here](https://www.babylonjs-playground.com/#IRVAX#10) ([deltakosh](https://github.com/deltakosh))
-   Introduced Canvas2D feature: a 2D engine to render primitives, sprites in 2D, text. Canvas2D can be displayed in Screen Space (above the 3D scene) or in World Space to be a part of the Scene. ([nockawa](https://github.com/nockawa))
-   Added two new types of Texture: FontTexture and MapTexture ([quick doc](https://www.html5gamedevs.com/topic/22565-two-new-texture-types-fonttexture-and-maptexture/)) ([nockawa](https://github.com/nockawa))
-   Added a dynamic [2D Bin Packing Algorithm](http://stackoverflow.com/questions/8762569/how-is-2d-bin-packing-achieved-programmatically), ([more info here](https://www.html5gamedevs.com/topic/22565-two-new-texture-types-fonttexture-and-maptexture/)) ([nockawa](https://github.com/nockawa))
-   Physics engine was completely rewritten, including both plugins for Oimo.js and Cannon.js. [feature](//doc.babylonjs.com/features/divingDeeper/physics/usingPhysicsEngine) ([RaananW](https://github.com/RaananW))
-   Interleaved buffers are now directly supported. Create a `Buffer` object and then use `buffer.createVertexBuffer` to specify the vertex buffers ([benaadams](https://github.com/benaadams))
-   Vertex buffers can be marked as instanced to allow custom instancing attributes ([benaadams](https://github.com/benaadams))
-   Mesh can have `overridenInstanceCount` set to specify the number of meshes to draw when custom instancing is used ([benaadams](https://github.com/benaadams))
-   Now supporting the [Earcut](https://github.com/mapbox/earcut) polygon triangulation library as part of babylon.js library. (Look for the `Earcut` module). The `PolygonMeshBuilder` class now relies on Earcut. ([nockawa](https://github.com/nockawa))

#### Updates

-   Added `renderTargetTexture.useCameraPostProcesses` to control postprocesses for render targets ([deltakosh](https://github.com/deltakosh))
-   Added `mesh.toLefthanded()` to convert a mesh from right handed system ([kesshi](https://github.com/Kesshi))
-   Renderlists can now also be defined using predicates ([deltakosh](https://github.com/deltakosh))
-   Added support for various normal maps conventions ([deltakosh](https://github.com/deltakosh))
-   Added postprocess.enablePixelPerfectMode to avoid texture scaling/stretching when dealing with non-power of 2 resolutions. cannot be used on post-processes chain ([deltakosh](https://github.com/deltakosh))
-   Enabled other post processes to be used when also using a 3D Rig ([jcpalmer](https://github.com/Palmer-JC))
-   Got Skeleton.copyAminationRange scaling better for different bone lengths ([jcpalmer](https://github.com/Palmer-JC))
-   Added skeleton.getBoneIndexByName(boneName: string) ([dad72](https://github.com/dad72))
-   Added `node._children` to track children hierarchy ([deltakosh](https://github.com/deltakosh))
-   Added Camera.ForceAttachControlToAlwaysPreventDefault to help embedding Babylon.js in iFrames ([deltakosh](https://github.com/deltakosh))
-   Support for Layer.alphaTest ([deltakosh](https://github.com/deltakosh))
-   New scene.pointerDownPredicate, scene.pointerMovePredicate, scene.pointerUpPredicate to define your own predicates for meshes picking selection ([deltakosh](https://github.com/deltakosh))
-   New OnPickTrigger support for spritesManager ([deltakosh](https://github.com/deltakosh))
-   New SPS method `digest()` ([jerome](https://github.com/jbousquie))
-   New SPS property `computeBoundingBox` ([jerome](https://github.com/jbousquie))
-   New SPS particle property `isVisible` ([jerome](https://github.com/jbousquie))
-   Added a new OnPickOut trigger fired when you release the pointer button outside of a mesh or sprite. ([deltakosh](https://github.com/deltakosh))
-   Added support for OnPointerOver and OnPointerOut for sprites. ([deltakosh](https://github.com/deltakosh))
-   Added an optional predicate on Node.getDescendants, Node.getChildren to filter out Nodes based on a callback execution. ([nockawa](https://github.com/nockawa))
-   Added Ray.intersectionPlane & intersectionSegment. ([nockawa](https://github.com/nockawa))
-   LinesMesh class now supports Intersection. Added the intersectionThreshold property to set a tolerance margin during intersection with wire lines. ([nockawa](https://github.com/nockawa))
-   Geometry.boundingBias property to enlarge the boundingInfo objects ([nockawa](https://github.com/nockawa))
-   Tools.ExtractMinAndMax & ExtractMinAndMaxIndexed now supports an optional Bias for Extent computation.
-   Added `StringDictionary<T>` class to implement an efficient generic typed string dictionary based on Javascript associative array. ([quick doc](https://www.html5gamedevs.com/topic/22566-be-efficient-my-friend-use-stringdictionary/)) ([nockawa](https://github.com/nockawa))
-   Added RectanglePackingMap class to fit several rectangles in a big map in the most optimal way, dynamically. ([nockawa](https://github.com/nockawa))
-   Added DynamicFloatArray class to store float32 based elements of a given size (stride) into one big Float32Array, with allocation/free/pack operations to then access an optimal buffer that can be used to update a WebGLBuffer dynamically.([quick doc](https://www.html5gamedevs.com/topic/22567-dynamicfloatarray-to-the-rescue-for-efficient-instanced-array/)) ([nockawa](https://github.com/nockawa))
-   Scene.onPointerObservable property added to enable a unique Observable event for user input (see ArcRotateCamera inputs for examples) ([nockawa](https://github.com/nockawa))
-   Oimo.js updated to the latest version ([RaananW](https://github.com/RaananW))
-   Added PhysicsImpostor and PhysicsJoint classes ([RaananW](https://github.com/RaananW))
-   LensFlareSystem now has both ID and name ([RaananW](https://github.com/RaananW))
-   TargetCamera has now a rotationQuaternion variable to can be used to set the camera's rotation ([RaananW](https://github.com/RaananW))
-   SSAORenderingPipeline now uses bilateral blur post-processes instead of standard blur post-process, in order to remove more efficiently the "textile effect"
-   `Engine.updateDynamicVertexBuffer` now has optional count as well as offset to allow partial updates ([benaadams](https://github.com/benaadams))
-   vertex attributes are only disabled if they aren't going to be reeabled by the next draw, to reduce gpu state changes ([benaadams](https://github.com/benaadams))

#### Bug fixes

-   Fixed bug with billboards and parenting ([deltakosh](https://github.com/deltakosh))
-   Fixed bug with ArcRotateCamera.setTarget ([deltakosh](https://github.com/deltakosh))
-   Fixed bug with OBJ Loader - All meshes were concatenated with the previous one ([Temechon](https://github.com/Temechon))
-   Fixed the device orientation cameras (both VR and non-VR cameras) ([RaananW](https://github.com/RaananW))
-   Fixed the WebVR implementation ([RaananW](https://github.com/RaananW))
-   `DynamicTexture.clone()` now preserves height in addition to width ([dahlbyk](https://github.com/dahlbyk))
-   Fixed missing some parameter default values in `MeshBuilder.CreateGroundFromHeightMap()` and `MeshBuilder.CreateTiledGround()` ([jerome](https://github.com/jbousquie))
-   Fixed model shape initial red vertex color set to zero not formerly being taken in account in the `SolidParticleSystem` ([jerome](https://github.com/jbousquie))

#### Breaking changes

-   `VertexData.CreateLines()` removed as `MeshBuilder.CreateLines()` now calls `MeshBuilder.CreateLineSystem()`
-   `scene.onNewXXXAdded` and `scene.onXXXRemoved` callbacks were removed and replaced by `scene.onNewXXXAddedObservable` and `scene.onXXXRemovedObservable`
-   `Material.dispose` does not dispose textures by default. You have to call `material.dispose(false, true)` to get the previous behavior.
-   `SSAORenderingPipeline.getBlurHPostProcess` and `SSAORenderingPipeline.getBlurVPostProcess`. The SSAO rendering pipeline doesn't use standard blur post-process anymore. A bilateral blur post-process is used instead.
-   `Engine.bindBuffers` is now `Engine.bindBuffersDirectly` ([benaadams](https://github.com/benaadams))
-   `Engine.bindMultiBuffers` is now `Engine.bindBuffers` and strongly typed `{ [key: string]: VertexBuffer; }` of buffers ([benaadams](https://github.com/benaadams))
-   `Engine.createDynamicVertexBuffer` takes vertices rather than capacity, creating and initalizing in one gpu instruction ([benaadams](https://github.com/benaadams))
-   Internally new `Engine.bindBuffer` is used rather than `gl.bindBuffer` which only binds when the bound buffer is changing ([benaadams](https://github.com/benaadams))
-   `DynamicTexture` no longer forces height/width to exponents of 2 if MIP maps are disabled ([dahlbyk](https://github.com/dahlbyk))

### Exporters

-   Unity3D exporter: Added support for lightmaps ([davrous](https://github.com/davrous), [deltakosh](https://github.com/deltakosh))
-   Unity3D exporter: Added support for export and run (local webserver) ([davrous](https://github.com/davrous), [deltakosh](https://github.com/deltakosh))
-   Unity exporter now support skeletons ([sebavan](https://github.com/sebavan))
-   Support for 3dsmax 2017 ([deltakosh](https://github.com/deltakosh))
-   Added support for up to 8 bones influences per vertex for 3dsmax exporter ([deltakosh](https://github.com/deltakosh))
-   Added console logging for .babylon file loading & depreciated SceneLoader.Load() in favor of Append() ([jcpalmer](https://github.com/Palmer-JC))

### API doc

-   class `SolidParticleSystem` documented ([jerome](https://github.com/jbousquie))
-   class `MeshBuilder` documented ([jerome](https://github.com/jbousquie))
-   class `Mesh` documented ([jerome](https://github.com/jbousquie))

## 2.3.0

### Core Engine

#### Major updates

-   [Sponza demo](https://www.babylonjs.com/Demos/Sponza/)
-   Support for procedural cube textures [Demo here](https://www.babylonjs.com/Demos/planet/) ([deltakosh](https://github.com/deltakosh))
-   New UniversalCamera which support keyboard, mouse, touch and gamepad ([davrous](https://github.com/davrous))
-   Point lights shadow mapping. [Demo here](https://www.babylonjs-playground.com/#XDNVAY#0) ([deltakosh](https://github.com/deltakosh))
-   Introducing [Materials Library](https://github.com/BabylonJS/Babylon.js/tree/master/materialsLibrary) ([deltakosh](https://github.com/deltakosh))
    -   Water material: //doc.babylonjs.com/features/divingDeeper/materials/using/materialsLibrary/waterMat. [Demo here](https://www.babylonjs.com/Demos/WaterMaterial/) ([julien-moreau](https://github.com/julien-moreau))
    -   Fire material: //doc.babylonjs.com/toolsAndResources/fire. [Demo here](https://www.babylonjs.com/Demos/FireMaterial/) ([julien-moreau](https://github.com/julien-moreau))
    -   Normal material: //doc.babylonjs.com/toolsAndResources/normal ([temechon](https://github.com/temechon))
    -   Lava Material: //doc.babylonjs.com/toolsAndResources/lava ([temechon](https://github.com/temechon))
    -   PBR Material: //doc.babylonjs.com/toolsAndResources/pbr ([deltakosh](https://github.com/deltakosh))
    -   Fur Material: //doc.babylonjs.com/toolsAndResources/Fur. [Demo here](https://www.babylonjs.com/Demos/Fur/) ([julien-moreau](https://github.com/julien-moreau))
-   Introducing [Procedural textures Library](https://github.com/BabylonJS/Babylon.js/tree/master/proceduralTexturesLibrary) ([meulta](https://github.com/meulta)
-   New cache mechanism for StandardMaterial ([deltakosh](https://github.com/deltakosh))
-   New Solid Particle System [Demo here](https://www.babylonjs.com/Demos/SPS/) ([jerome](https://github.com/jbousquie))
-   New `StandardMaterial.lightmapTexture` which can be controlled with `StandardMaterial.useLightmapAsShadowMap` ([deltakosh](https://github.com/deltakosh))
-   Support for reflection probes. [See documentation here](//doc.babylonjs.com/How_To/How_to_use_Reflection_probes) ([deltakosh](https://github.com/deltakosh))
-   New serializers [folder](https://github.com/BabylonJS/Babylon.js/serializers) to host .babylon serializers ([deltakosh](https://github.com/deltakosh))
    -   New .obj serializer ([BitOfGold](https://github.com/BitOfGold))
-   Sprites now can be [picked](https://www.babylonjs-playground.com/#1XMVZW#4) and can use [actions](https://www.babylonjs-playground.com/#9RUHH#4) ([deltakosh](https://github.com/deltakosh))
-   New `Mesh.CreatePolyhedron()` method ([jerome](https://github.com/jbousquie))
-   New `Mesh.CreateIcoSphere()` method [Demo here](https://www.babylonjs-playground.com/#24DUYD) (G'kar)
-   Introducing [babylon.core.js](//doc.babylonjs.com/resources/Framework_versions) ([deltakosh](https://github.com/deltakosh))
-   Introducing AnimationRanges for Skeletons and Animations ([deltakosh](https://github.com/deltakosh))
    -   Added parsing / serialization, copying between similar skeletons & better deletion ([Palmer-JC](https://github.com/Palmer-JC))
    -   Expanded AnimationRanges for Nodes (Mesh, Lights, Cameras) ([Palmer-JC](https://github.com/Palmer-JC))
    -   Support for added to Blender Exporter ([Palmer-JC](https://github.com/Palmer-JC))
-   Support for glTF files [loader](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview release/loaders) ([julien-moreau](https://github.com/julien-moreau))

#### Updates

-   Audio files are now saved for offline access ([davrous](https://github.com/davrous))
-   New `CubeTexture.CreateFromImages()` ([deltakosh](https://github.com/deltakosh))
-   Bounding info can be locked and updated (`bb.isLocked` and `bb.update()`) ([deltakosh](https://github.com/deltakosh))
-   2D layers now have a scale and offset properties ([deltakosh](https://github.com/deltakosh))
-   TouchCamera can now fallback to regular mouse/keyboard controls ([deltakosh](https://github.com/deltakosh))
-   Added ability to skip current prepared Action to next active Action (chained by Action.then(Action)) ([vouskprod](https://github.com/vousk))
-   Added new event triggers `ActionManager.OnLongPressTrigger` and `ActionManager.OnPickDownTrigger` ([vouskprod](https://github.com/vousk))
-   new `Mesh.convertToUnIndexedMesh()` to create meshes with no indices (which could be faster when vertex reuse is low and vertex structure is small) ([deltakosh](https://github.com/deltakosh))
-   Unity3D exporter will recognise instances of prefabs ([ozRocker](https://github.com/punkoffice))
-   New parse mechanism (for loading .babylon file) ([deltakosh](https://github.com/deltakosh))
-   New button to log the camera position in the debug layer ([temechon](https://github.com/temechon))
-   Shader files (fragment and vertex) can now be specified via direct URL ([vouskprod](https://github.com/vousk))
-   Added `Animatable.goToFrame()` ([deltakosh](https://github.com/deltakosh))
-   Fixed behavior or `Animation.CreateAndStartAnimation` and added `Animation.CreateMergeAndStartAnimation` to reproduce previous behavior ([deltakosh](https://github.com/deltakosh))
-   Adding `StandardMaterial.linkEmissiveWithDiffuse` to, well, link emissive with diffuse value. (With)[ https://www.babylonjs-playground.com/#2FPUCS#2] and (without)[ https://www.babylonjs-playground.com/#2FPUCS#1] ([deltakosh](https://github.com/deltakosh))
-   Adding support for equi-rectangular mapping. See [demo here](https://www.babylonjs-playground.com/#27FN5R#12) ([deltakosh](https://github.com/deltakosh))
-   Sprites and particles scheduler updated to be resolved before transparent objects ([deltakosh](https://github.com/deltakosh))
-   Added ability to deactivate ArcRotateCamera panning mechanism (by setting panningSensibility to 0) ([vouskprod](https://github.com/vousk))
-   Added `DirectionalLight.autoUpdateExtends` to prevent directional lights to adapt to scene extends ([deltakosh](https://github.com/deltakosh))
-   Added a new parameter to `debugLayer.show()` to define root element to use ([deltakosh](https://github.com/deltakosh))
-   New `MeshBuilder` class used to create all kind of mesh shapes ([deltakosh](https://github.com/deltakosh))
-   Added `Scene.constantlyUpdateMeshUnderPointer` to improve performance when moving mouse ([deltakosh](https://github.com/deltakosh))
-   Added `StandardMaterial.disableLighting` ([deltakosh](https://github.com/deltakosh))
-   Improved reflection shader performance ([deltakosh](https://github.com/deltakosh))
-   New `Material.sideOrientation` property to define clockwise or counter-clockwise faces selection. [Demo here](https://www.babylonjs-playground.com/#1TZJQY) ([deltakosh](https://github.com/deltakosh))
-   It is now possible to create a custom loading screen. [PR](https://github.com/BabylonJS/Babylon.js/pull/700) ([RaananW](https://github.com/RaananW))
-   Per face color and texture feature in `MeshBuilder.CreateCylinder()` ([jerome](https://github.com/jbousquie))
-   _Arc_ feature in `CreateCylinder`, `CreateSphere`, `CreateTube`, `CreateDisc` and `CreateLathe` ([jerome](https://github.com/jbousquie))
-   _Slice_ feature in `MeshBuilder.CreateSphere()` ([jerome](https://github.com/jbousquie))
-   `closed` parameter in `MeshBuilder.CreateLathe()` ([jerome](https://github.com/jbousquie))
-   `cap` parameter in `MeshBuilder.CreateLathe()` ([jerome](https://github.com/jbousquie))
-   `diameter`, `hasRings`, `enclose` parameters in `MeshBuilder.CreateCreateCylinder()` ([jerome](https://github.com/jbousquie))
-   added `getNormalAtCoordinates()` and `getNormalAtCoordinatesToRef()` methods in `MeshBuilder.CreateLathe()` ([jerome](https://github.com/jbousquie))
-   `Material.dispose()` now removes disposed material from meshes ([deltakosh](https://github.com/deltakosh))
-   New `Material.getBindedMeshes()` function ([deltakosh](https://github.com/deltakosh))
-   OimoJS Plugin now uses Quaternions exclusively and calculates body rotations correctly. [PR](https://github.com/BabylonJS/Babylon.js/pull/761) ([RaananW](https://github.com/RaananW))
-   It is now possible to get the physics engine's body and wolrd objects using the physics engine. [PR](https://github.com/BabylonJS/Babylon.js/pull/761) ([RaananW](https://github.com/RaananW))
-   new Heightmap Impostor for Cannon.js physics engine. [PR](https://github.com/BabylonJS/Babylon.js/pull/78), [Demo] ( https://www.babylonjs-playground.com/#D3LQD#3) ([RaananW](https://github.com/RaananW))
-   A plane mesh can be created with a source plane (math). [PR](https://github.com/BabylonJS/Babylon.js/pull/779) ([RaananW](https://github.com/RaananW))
-   AbstractMesh.onPhysicsCollide will be triggered when a physics-enabled mesh collides against another. [PR](https://github.com/BabylonJS/Babylon.js/pull/806) ([RaananW](https://github.com/RaananW))
-   Added scene onPointerMove public callback. [PR](https://github.com/BabylonJS/Babylon.js/pull/810) ([RaananW](https://github.com/RaananW))
-   Added streaming support for BABYLON.Sound ([davrous](https://github.com/davrous))
-   Added collisionsEnabled and workerCollisions for serialization [PR](https://github.com/BabylonJS/Babylon.js/pull/830) ([Dad72](https://github.com/dad72))
-   Changed from a fixed maximum of bone influencers, 4, to variable, 1-8 ([Palmer-JC](https://github.com/Palmer-JC))
    -   Support for added to Blender Exporter ([Palmer-JC](https://github.com/Palmer-JC))
-   Float32Arrays can now directly be specified for vertex data attributes, `Mesh.updateVerticesDataDirectly` deprecated ([Palmer-JC](https://github.com/Palmer-JC))
-   Added panning axis to the ArcRotateCamera [PR](https://github.com/BabylonJS/Babylon.js/pull/913) ([mstdokumaci](https://github.com/mstdokumaci), [RaananW](https://github.com/RaananW))
-   Added `Tmp` class for internal use in order to improvement the memory management, [jerome](https://github.com/jbousquie))
-   Added `Scene.swithActiveCamera(newCamera, attachControl)` to go from one camera active to another. ([dad72](https://github.com/dad72)) [PR](https://github.com/BabylonJS/Babylon.js/pull/928)

#### Bug fixes

-   Fixed IDB for offline support ([davrous](https://github.com/davrous))
-   Fixed a bug with spherical mapping ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with clone and createInstance which was forcing the recomputation of bounding boxes ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with CSG when submeshes are kept ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with texture coordinates matrices ([deltakosh](https://github.com/deltakosh))
-   Fixed Sphere texture coordinates generation ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with `Mesh.attachToBone` when bone's matrix has a negative determinant ([deltakosh](https://github.com/deltakosh))
-   Fixed a possible but with the active camera while taking a screenshot. [PR](https://github.com/BabylonJS/Babylon.js/pull/701) ([RaananW](https://github.com/RaananW))
-   Fixed a bug with worker-collisions and instances. [PR](https://github.com/BabylonJS/Babylon.js/pull/705) ([RaananW](https://github.com/RaananW))
-   Fixed a bug with removed meshes and geometries from the worker-cache. [PR](https://github.com/BabylonJS/Babylon.js/pull/711) ([RaananW](https://github.com/RaananW))
-   Fixed `getHeightAtCoordinates()` : brand new ultra fast algorithm, can be used for many objects at once in the render loop now ([jerome](https://github.com/jbousquie))
-   Fixed `closePath` and `closeArray` ribbon parameter now working back together ([jerome](https://github.com/jbousquie))
-   Fixed morphing on capped tubes ([jerome](https://github.com/jbousquie))
-   Fixed morphing on extruded shapes ([jerome](https://github.com/jbousquie))
-   Fixed tube and extruded shape cap light artifact ([jerome](https://github.com/jbousquie))
-   Fixed lathe light artifact with dedicated new geometry ([jerome](https://github.com/jbousquie))
-   Fixed a bug calculating velocity during collision with gravity enabled. [PR](https://github.com/BabylonJS/Babylon.js/pull/738) ([RaananW](https://github.com/RaananW))
-   Fixed a bug in instance serialization. [PR](https://github.com/BabylonJS/Babylon.js/pull/726) ([RaananW](https://github.com/RaananW))
-   Fixed a memory leak with textures ([deltakosh](https://github.com/deltakosh))

#### Breaking changes

-   `ActionManager.OnPickTrigger` now acts as a single click/tap and is not raised on drag or swipe anymore. To get the old behavior, `ActionManager.OnPickDownTrigger` should be used instead ([vouskprod](https://github.com/vousk))
-   `VertexData.CreateCylinder()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateRibbon()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateBox()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateSphere)` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateTorus()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateTorusKnot()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreatePlane()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateDisc()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateLines()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateDashedLines()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateGround()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateTiledGround()` now supports only the single _options_ parameter ([jerome](https://github.com/jbousquie))
-   `VertexData.CreateGroundFromHeightMap()` now supports only the single _options_ parameter ([deltakosh](https://github.com/deltakosh))
-   `Tools.IsExponantOfTwo()` renamed to `Tools.IsExponentOfTwo()` ([deltakosh](https://github.com/deltakosh))
-   `Tools.GetExponantOfTwo()` renamed to `Tools.GetExponentOfTwo()` ([deltakosh](https://github.com/deltakosh))
-   Updated Cannon.js plugin to the newest version (0.6.2). New cannon.js must be used. [PR](https://github.com/BabylonJS/Babylon.js/pull/755) ([RaananW](https://github.com/RaananW))

## 2.2.0

### Core Engine

#### Major updates

-   Blender can now bake Procedural textures & Cycles materials. Plus more. See [documentation here](https://github.com/BabylonJS/Babylon.js/tree/master/Exporters/Blender) ([Palmer-JC](https://github.com/Palmer-JC))
-   Meshes can now be attached to bones. See [documentation here](//doc.babylonjs.com/How_To/How_to_use_Bones_and_Skeletons) and [sample here](https://www.babylonjs-playground.com/#11BH6Z#18) ([deltakosh](https://github.com/deltakosh))
-   HDR Rendering pipeline. See [demo here](https://www.babylonjs-playground.com/#2EGN4U#2) ([julien-moreau](https://github.com/julien-moreau))
-   New rewored StandardMaterial.isReady for better memory usage and performance ([deltakosh](https://github.com/deltakosh))
-   Revamping of FBX exporter. Now supports animations and bones ([simonferquel](https://github.com/simonferquel), [deltakosh](https://github.com/deltakosh))
-   StandardMaterial.useGlossinessFromSpecularMapAlpha to use specular map alpha as glossiness level ([deltakosh](https://github.com/deltakosh))
-   Added support for StandardMaterial.roughness. See [demo here](https://www.babylonjs-playground.com/#RNBKQ#8) ([deltakosh](https://github.com/deltakosh))
-   OBJ loader. See [demo here](https://www.babylonjs-playground.com/#28YUR5) ([Temechon](https://github.com/Temechon))
-   EdgesRenderer. See [demo here](https://www.babylonjs-playground.com/#TYAHX#10) ([deltakosh](https://github.com/deltakosh))
-   Actions Builder tool for 3dsmax exporter. More info [here](https://medium.com/babylon-js/actions-builder-b05e72aa541a) ([julien-moreau](https://github.com/julien-moreau))

#### Updates

-   Adding layerMask to lensFlareSystem, spritesManager, particleSystem ([deltakosh](https://github.com/deltakosh))
-   Adding emissiveAsIllumination and reflectionFresnelFromSpecular for StandardMaterial ([deltakosh](https://github.com/deltakosh))
-   Adding isEnabled for ProceduralTexture ([deltakosh](https://github.com/deltakosh))
-   Compression supported for raw textures ([deltakosh](https://github.com/deltakosh))
-   New TonemapPostProcess. See [demo here](https://www.babylonjs-playground.com/#ELTGD) ([deltakosh](https://github.com/deltakosh))
-   New options parameters for Box, Sphere, Plane and Ground. See [demo here](https://www.html5gamedevs.com/topic/17044-evolution-for-out-of-the-box-meshes-creation/) ([deltakosh](https://github.com/deltakosh))
-   Added per face UV and Colors options for `CreateBox` ([jerome](https://github.com/jbousquie))
-   Added darkness support for soft shadows ([deltakosh](https://github.com/deltakosh))
-   Added scene.getLensFlareSystemByName() ([deltakosh](https://github.com/deltakosh))
-   Added LensFlareSystem.setEmitter() ([deltakosh](https://github.com/deltakosh))
-   Added Color3.FromHexString() and Color3.toHexString() ([deltakosh](https://github.com/deltakosh))
-   Added Color4.FromHexString() and Color4.toHexString() ([deltakosh](https://github.com/deltakosh))
-   Added mesh.computeBonesUsingShaders to allow developers to disable HW skinning for low end devices ([deltakosh](https://github.com/deltakosh))
-   Added material.disableDepthWrite (default is off) ([deltakosh](https://github.com/deltakosh))
-   Added material.alphaMode (default is BABYLON.Engine.ALPHA_COMBINE, can be set to BABYLON.Engine.ALPHA_ADD, _\_SUBTRACT, _\_MULTIPLY or \*\_MAXIMIZED ) ([deltakosh](https://github.com/deltakosh), [jahow](https://github.com/jahow))
-   Added Animatable.reset() function ([deltakosh](https://github.com/deltakosh))
-   New parameter for ArcRotateCamera.zoomOn to preserve maxZ ([deltakosh](https://github.com/deltakosh))
-   PickingInfo.getNormal can now use either vertices normals or vertices positions ([deltakosh](https://github.com/deltakosh))
-   Meshes can now support uv2, uv4, uv5 and uv6 for ShaderMaterials ([deltakosh](https://github.com/deltakosh))
-   Panning support for ArcRotateCamera ([julien-moreau](https://github.com/julien-moreau))
-   Vertex color and diffuse color can now be mixed ([deltakosh](https://github.com/deltakosh))
-   Depth-of-field improvements [PR](https://github.com/BabylonJS/Babylon.js/pull/567) ([jahow](https://github.com/jahow))
-   Engine now initialize WebGL with preserveDrawingBuffer = false by default ([deltakosh](https://github.com/deltakosh))
-   withEpsilon with a user defined epsilon [PR](https://github.com/BabylonJS/Babylon.js/pull/573) ([RaananW](https://github.com/RaananW))
-   Adding onAfterRender function in BABYLON.PostProcess [PR](https://github.com/BabylonJS/Babylon.js/pull/572) ([julien-moreau](https://github.com/julien-moreau))
-   Improved shaders optimizer to remove specular code when not needed ([deltakosh](https://github.com/deltakosh))
-   Added some utility functions to Vector2/3/4 [PR](https://github.com/BabylonJS/Babylon.js/pull/578) ([jahow](https://github.com/jahow))
-   Added split angularSensibiliy into X and Y for arcRotateCamera [PR](https://github.com/BabylonJS/Babylon.js/pull/683) ([Remwrath](https://github.com/Remwrath))
-   Added function getFrontPosition(distance) for Camera [PR](https://github.com/BabylonJS/Babylon.js/pull/681) ([dad72](https://github.com/dad72))
-   New rawTexture.update function ([robgdl](https://github.com/robgdl))
-   Changes to meshes transform baking and added flipFaces [PR](https://github.com/BabylonJS/Babylon.js/pull/579) ([jahow](https://github.com/jahow))
-   SerializeMesh serializes a mesh or array of meshes to be imported with the loader's ImportMesh optionally including their children and/or parents. [PR](https://github.com/BabylonJS/Babylon.js/pull/583) [PR2](https://github.com/BabylonJS/Babylon.js/pull/609) ([RaananW](https://github.com/RaananW))
-   onCollide callback for meshes calling moveWithCollisions. [PR](https://github.com/BabylonJS/Babylon.js/pull/585) ([RaananW](https://github.com/RaananW))
-   Unity Exporter now uses game object name as the Babylon.js mesh name, instead of mesh name which is not unique when dealing with primitive objects (cubes, spheres, planes, etc..) ([ozRocker](https://github.com/punkoffice))
-   Path3D construction : new _raw_ parameter, if true returns a non-normalized Path3D object ([jerome](https://github.com/jbousquie))
-   Added `Vector3.RotationFromAxisToRef()` : same as `RotationFromAxis()` but assigns a reference ([jerome](https://github.com/jbousquie))
-   `ComputeNormals` optimization : less object allocation and normal array initialization ([jerome](https://github.com/jbousquie))
-   Ribbon : _closePath_ parameter now creates a smooth seam ([jerome](https://github.com/jbousquie))

#### Bug fixes

-   Fixing bug with rig cameras positioning ([deltakosh](https://github.com/deltakosh))
-   Instance meshes' geometry ID is now serialized correctly. [PR](https://github.com/BabylonJS/Babylon.js/pull/607) ([RaananW](https://github.com/RaananW))
-   Bug fix at set numberOfBricksWidth [PR](https://github.com/BabylonJS/Babylon.js/pull/684) ([Polatouche](https://github.com/Polatouche))

#### Breaking changes

-   In LensRenderingPipeline: parameter `dof_focus_depth` (range 0..1) is deprecated, use `dof_focus_distance` (range 0..infinity) instead ([jahow](https://github.com/jahow))
-   Cylinder Mesh complete reimplementation for better normals ([jerome](https://github.com/jbousquie))
-   `RotationFromAxis()` : fixed the dot product case outside the range [-1, 1] ([jerome](https://github.com/jbousquie))
-   Path3D : fix wrong normal/binormal due to normalization approximations ([jerome](https://github.com/jbousquie))

## 2.1.0

### Core Engine

#### Major updates

-   Collisions can now be offloaded on webworkers ([raananw](https://github.com/raananw))
-   SIMD.js support for math library. See [demo](https://www.babylonjs.com/scenes/simd.html) ([deltakosh](https://github.com/deltakosh))
-   Unity 5 scene exporter. More info [here](https://github.com/BabylonJS/Babylon.js/tree/master/Exporters/Unity%205) ([davrous](https://github.com/davrous), [deltakosh](https://github.com/deltakosh))
-   New `Mesh.CreateDecal()` function to create decals. See [demo](https://www.babylonjs.com/?DECALS). More info [here](//doc.babylonjs.com/how_to/decals) ([deltakosh](https://github.com/deltakosh))
-   New tool for debugLayer: You can now dump renderTargets to see their content ([deltakosh](https://github.com/deltakosh))
-   Complete shadows code rework: New bias property for ShadowGenerator, new orthogonal shadows for directional shadows, automatic projection size for directional lights, new BlurVarianceShadowMap filter. See [demo](https://www.babylonjs.com/?SOFTSHADOWS). Documentation updated [here](//doc.babylonjs.com/features/divingDeeper/lights/shadows) ([deltakosh](https://github.com/deltakosh))
-   New lens effects rendering pipeline. More info [here](//doc.babylonjs.com/how_to/using_standard_rendering_pipeline) ([jahow](https://github.com/jahow))
-   New basic mesh type: Ribbons. See [demo](https://www.babylonjs.com/?RIBBONS). More info [here](//doc.babylonjs.com/how_to/legacy_param#ribbon) ([jbousquie](https://github.com/jbousquie))
-   New `BABYLON.Mesh.ExtrudeShape` and `BABYLON.Mesh.ExtrudeShapeCustom`. More info [here](//doc.babylonjs.com/how_to/legacy_param) ([jbousquie](https://github.com/jbousquie))
-   New Loaders folder with a first additionnal plugin: [STL](//doc.babylonjs.com/how_to/stl) ([raananw](https://github.com/raananw), [deltakosh](https://github.com/deltakosh))
-   Gulp building process revamped, updated and simplified and now includes a config.json ([raananw](https://github.com/raananw))

#### Updates

-   Better beta angle support for ArcRotateCamera ([raananw](https://github.com/raananw))
-   Better video textures support ([deltakosh](https://github.com/deltakosh))
-   Cameras hierarchy rework ([deltakosh](https://github.com/deltakosh))
-   New `Camera.setCameraRigMode` to control 3D rendering of any camera (Anaglyph, Stereo, VR) ([Palmer-JC](https://github.com/Palmer-JC), [vousk](https://github.com/vousk))
-   VR cameras can disable distortion postprocess to get more performance ([deltakosh](https://github.com/deltakosh))
-   New cameras: AnaglyphGamepadCamera, StereoscopicFreeCamera, StereoscopicArcRotateCamera, StereoscopicGamepadCamera ([deltakosh](https://github.com/deltakosh))
-   New `MultiMaterial.clone()` function ([deltakosh](https://github.com/deltakosh))
-   Faster `mesh.computeNormals()` function ([jbousquie](https://github.com/jbousquie))
-   Added the ability [to dynamically update or to morph](//doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh) an mesh instance ([jbousquie](https://github.com/jbousquie))
-   Allow static Mesh.MergeMeshes to work with clones & Mesh subclasses ([Palmer-JC](https://github.com/Palmer-JC))
-   Added mesh.freezeWorldMatrix() for static meshes ([deltakosh](https://github.com/deltakosh))
-   Added mesh.freezeNormals() for parametric mesh updates ([jbousquie](https://github.com/jbousquie))
-   Added Vector3.RotationFromAxis() to get Euler rotation angles from a target system ([jbousquie](https://github.com/jbousquie))
-   Added mesh.alwaysSelectAsActiveMesh to disable frustum clipping for a specific mesh ([deltakosh](https://github.com/deltakosh))
-   Added updateMeshPositions method ([jbousquie](https://github.com/jbousquie))
-   Callbacks for geometry changes ([raananw](https://github.com/raananw))
-   Allow Engine to run for CocoonJS with standard html, including devices where the hardware scaling != 1 ([Palmer-JC](https://github.com/Palmer-JC))
-   Material onBind callback improvement ([jahow](https://github.com/jahow))
-   New front/back/double side feature for meshes ([jbousquie](https://github.com/jbousquie))
-   New basic mesh type: Disc ([jbousquie](https://github.com/jbousquie))
-   New basic mesh type : Dashed Lines ([jbousquie](https://github.com/jbousquie))
-   New basic mesh type : Lathe ([jbousquie](https://github.com/jbousquie))
-   New basic mesh type: Tube. More info [here](//doc.babylonjs.com/how_to/legacy_param) ([jbousquie](https://github.com/jbousquie))
-   Allow ComputeNormals to work with Typed Arrays & the Typescript Level ([Palmer-JC](https://github.com/Palmer-JC))
-   Added uniqueId for nodes ([raananw](https://github.com/raananw))
-   Added `Mesh.onLODLevelSelection(distance: number, mesh: Mesh, selectedLevel: Mesh)` callback ([deltakosh](https://github.com/deltakosh))
-   Added `Material.zOffset` to help reducing z-fighting ([deltakosh](https://github.com/deltakosh))
-   Added excludeWithLayerMask to lights ([Palmer-JC](https://github.com/Palmer-JC))
-   Added includeOnlyWithLayerMask for filtering meshes ([Palmer-JC](https://github.com/Palmer-JC))
-   Mesh Default layerMask changed to allow more "special cameras filtering" ([Palmer-JC](https://github.com/Palmer-JC))
-   Sprite can now have .width and .height properties ([deltakosh](https://github.com/deltakosh))
-   Ability to register events based on mesh/camera/light addition and deletion ([raananw](https://github.com/raananw))
-   New `Curve` object ([jbousquie](https://github.com/jbousquie)) More info [here](//doc.babylonjs.com/snippets/path3d)
-   New `Path3D` object ([jbousquie](https://github.com/jbousquie)) More info [here](//doc.babylonjs.com/how_to/how_to_use_path3d)
-   New 'color correction' post process ([jahow](https://github.com/jahow))
-   Added sampling mode as a parameter for SpriteManager ([jahow](https://github.com/jahow))
-   RenderTexture can now be saved to a file ([deltakosh](https://github.com/deltakosh))
-   Better attributes management ([deltakosh](https://github.com/deltakosh))
-   Source conform to typescript 1.4 ([raananw](https://github.com/raananw))
-   Adding subMeshId property in PickingInfo structure ([deltakosh](https://github.com/deltakosh))
-   No more error when a manifest is not found ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Initial quaternion fix for OIMO plugin ([raananw](https://github.com/raananw))
-   ArcRotateCamera pinch zoom debug ([vousk](https://github.com/vousk))
-   Fixing animatable bug when animation is over ([temechon](https://github.com/temechon))
-   useCameraPostProcess whenever there is a special camera in use ([m0ppers](https://github.com/m0ppers))
-   delta in BoundingBox's intersectsPoint is now calculated correctly ([raananw](https://github.com/raananw))
-   textures cache fixed ([deltakosh](https://github.com/deltakosh))
-   ImportMesh now imports referenced geometries of selected meshes ([raananw](https://github.com/raananw))
-   CSG toMesh() and FromMesh() now support meshes without quaternion ([raananw](https://github.com/raananw))

##### Breaking changes

-   OculusCamera was removed ([deltakosh](https://github.com/deltakosh))
-   VRDeviceOrientationCamera was renamed to VRDeviceOrientationFreeCamera ([deltakosh](https://github.com/deltakosh))
-   WebVRCamera was renamed to WebVRFreeCamera ([deltakosh](https://github.com/deltakosh))
-   VideoTexture does not require a size parameter anymore. The new constructor is: `constructor(name: string, urls: string[], scene: Scene, generateMipMaps = false, invertY = false, samplingMode: number = Texture.TRILINEAR_SAMPLINGMODE)` ([deltakosh](https://github.com/deltakosh))

## 2.0.0

### Core Engine

#### Major updates

-   Support for WebAudio. More info [here](/typedoc/classes/babylon.audioengine) ([davrous](https://github.com/davrous))
-   Support for Procedural Texture with standard usable samples and custom support. More info [here](//doc.babylonjs.com/how_to/dynamictexture) ([meulta](https://github.com/meulta))
-   Support for OES_element_index_uint extension in order to support 32 bits indices and then meshes with more than 65536 vertices ([deltakosh](https://github.com/deltakosh))
-   Support for levels of detail (LOD) for meshes. More info [here](//doc.babylonjs.com/how_to/how_to_use_lod) ([deltakosh](https://github.com/deltakosh))
-   New Scene Optimizer tool. More [here](//doc.babylonjs.com/how_to/how_to_use_sceneoptimizer) ([deltakosh](https://github.com/deltakosh))
-   Support for [user marks](http://blogs.msdn.com/b/eternalcoding/archive/2015/02/02/using-user-mark-to-analyze-performance-of-your-javascript-code.aspx) ([deltakosh](https://github.com/deltakosh))
-   Using High Resolution Time for performance and FPS measurement ([deltakosh](https://github.com/deltakosh))
-   Easing functions for animations. More info [here](//doc.babylonjs.com//features/divingDeeper/animation/animation_introduction#easing-functions) ([mimetis](https://github.com/mimetis))
-   New debug layer than can be used to display debug informations. More info [here](//doc.babylonjs.com/toolsAndResources/tools/inspector) ([deltakosh](https://github.com/deltakosh))
-   New `PolygonMeshBuilder` object used to create mesh from [polygons](https://www.babylonjs-playground.com/#10IOII%231) ([ElemarJR](https://github.com/ElemarJR))
-   New `Mesh.simplify()` function to automatically simplify meshes. More info [here](//doc.babylonjs.com/how_to/in-browser_mesh_simplification) ([raananw](https://github.com/raananw))
-   New `scene.enableDepthRenderer()` to register depth texture rendering. More info [here](//doc.babylonjs.com/how_to/how_to_use_depthrenderer_to_get_depth_values) ([deltakosh](https://github.com/deltakosh))
-   New `SSAORenderingPipeline` to apply screen space ambient occlusion. More info [here](//doc.babylonjs.com/how_to/using_the_ssao_rendering_pipeline) ([julien-moreau](https://github.com/julien-moreau))
-   New `VolumetricLightScatteringPostProcess` to simulate volumetric light scattering. More info [here](//doc.babylonjs.com/how_to/using_the_volumetric_lightscattering_post-process) ([julien-moreau](https://github.com/julien-moreau))
-   3dsMax exporter can now generate binary format files ([deltakosh](https://github.com/deltakosh))

#### Updates

-   Moving of cloning into Mesh constructor ([Palmer-JC](https://github.com/Palmer-JC))
-   Camera types support in 3dsmax exporter ([deltakosh](https://github.com/deltakosh))
-   Babylon.Math is now a fluid API ([deltakosh](https://github.com/deltakosh))
-   Added FOV mode setting to cameras ([jahow](https://github.com/jahow))
-   You can now define if OnIntersectionEnterTrigger and OnIntersectionExitTrigger may use precise intersections. More info [here](//doc.babylonjs.com/features/divingDeeper/events/actions#triggers) ([deltakosh](https://github.com/deltakosh))
-   New `scene.createDefaultCameraOrLight()` function ([deltakosh](https://github.com/deltakosh))
-   Added POV movement & rotation ([Palmer-JC](https://github.com/Palmer-JC))
-   Starting documenting public API ([raananw](https://github.com/raananw))
-   Added render target type (unsigned or floating point) ([julien-moreau](https://github.com/julien-moreau))
-   Decomposition and interpolation methods for matrices ([kpko](https://github.com/kpko))
-   Spot lights can now cast [shadows](https://www.babylonjs-playground.com/#IFYDRS) ([deltakosh](https://github.com/deltakosh))
-   Adding `clear()` function to DynamicTexture ([deltakosh](https://github.com/deltakosh))
-   New `RawTexture` object to create texture from arraybuffer with specific format (luminance, luminance and alpha, alpha, rgb, rgba) ([deltakosh](https://github.com/deltakosh))
-   Animation's key can now be functions ([deltakosh](https://github.com/deltakosh))
-   Bones and instances can be used together ([deltakosh](https://github.com/deltakosh))
-   Engine can now accept more than one render loop ([deltakosh](https://github.com/deltakosh))
-   New `ParticleSystem.updateFunction` to define custom behavior for particles ([deltakosh](https://github.com/deltakosh))
-   New `mesh.renderOverlay` and `mesh.overlayColor` ([deltakosh](https://github.com/deltakosh))
-   New "Automatically launch animations" option for Blender 3D ([deltakosh](https://github.com/deltakosh))
-   Support for vertex color and vertex alpha function ([deltakosh](https://github.com/deltakosh))
-   Adding stride size attributes to `Mesh.setVerticesData` function ([deltakosh](https://github.com/deltakosh))
-   New `Texture.CreateFromBase64String` function ([deltakosh](https://github.com/deltakosh))
-   Extending the Ray class functionality to support ray's length ([raananw](https://github.com/raananw))
-   New `Effect.onBind` callback ([deltakosh](https://github.com/deltakosh))
-   Added support for point rendering ([FreeFrags](https://github.com/freefrags) [deltakosh](https://github.com/deltakosh))
-   Robust Euler->Quaternion->Euler conversions ([MavenRain](https://github.com/MavenRain))
-   new `mesh.isCompletelyInFrustum(camera)` function ([deltakosh](https://github.com/deltakosh))
-   Added the possibility to disable fog for a specific material ([demonixis](https://github.com/demonixis))
-   Added the possibility to disable fog for a specific sprite manager ([deltakosh](https://github.com/deltakosh))
-   Added a property to ArcRotateCamera that moves the screen position of the target ([daner](https://github.com/daner))

#### Breaking changes

-   `Tools.GetFps()` and `Tools.GetDeltaTime()` are now functions hosted by the engine: `engine.getFps()` and `engine.getDeltaTime()` [deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Insane amount of fixes for 3dsmax and blender exporters ([deltakosh](https://github.com/deltakosh))
-   Fixed nearest texture filters ([deltakosh](https://github.com/deltakosh))
-   Fixed mesh loading when url has a query string ([dlajarretie](https://github.com/dlajarretie))
-   Fixed a bug with pause/restart on animations ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with CSG and transformations ([deltakosh](https://github.com/deltakosh))

## 1.14.0

### Core Engine

#### Major updates

-   New VRDeviceOrientionCamera for cardboard like systems ([demonixis](https://github.com/demonixis))
-   New WebVRCamera for WebVR compatible systems ([demonixis](https://github.com/demonixis))
-   All shaders now use high precision profile to address iOS8 compatibility ([deltakosh](https://github.com/deltakosh))
-   New camera: `BABYLON.FollowCamera` used to smoothly follow a given target [abogartz](https://github.com/abogartz)
-   New `BABYLON.AssetsManager` used to handle [assets loading](https://github.com/BabylonJS/Babylon.js/wiki/Using-AssetsManager) alongside loading screen display ([deltakosh](https://github.com/deltakosh))
-   New `Engine.displayLoadingUI()`, `Engine.hideLoadingUI()`, `Engine.loadingUiText`. See [more here](https://github.com/BabylonJS/Babylon.js/wiki/Using-AssetsManager) ([deltakosh](https://github.com/deltakosh))
-   New cache engine (Based on state objects) ([deltakosh](https://github.com/deltakosh))
-   Fresnel support for diffuse, emissive, opacity and reflection on `StandardMaterial`. See [demo here](https://www.babylonjs.com/?FRESNEL) and [wiki here](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-FresnelParameters%3F) ([deltakosh](https://github.com/deltakosh))
-   TypeScript declaration file is now available ([deltakosh](https://github.com/deltakosh))
-   Binary file format supported. You can use online converter [here](https://www.babylonjs.com/binary) ([r2d2Proton](https://github.com/r2d2Proton))

#### Updates

-   New `mesh.updateVerticesDataDirectly(kind, float32array)` to update mesh data directly ([deltakosh](https://github.com/deltakosh))
-   Sandbox & IndexedDB layer are now supporting TGA & DDS textures ([davrous](https://github.com/davrous))
-   Integrating lights animations, cameras type and animations for Blender exporter ([Palmer-JC](https://github.com/Palmer-JC))
-   New "Get zip" option for CYOS ([deltakosh](https://github.com/deltakosh))
-   Add pinch and zoom for iOS and Android on ArcRotateCamera ([Eucly2](https://github.com/Eucly2))
-   New `camera.projectToScreen()` function to transform a vector3 into a screen pixel ([deltakosh](https://github.com/deltakosh))
-   New `effect` parameter to define custom shader for `BABYLON.ParticleSystem` constructor. See [demo here](https://www.babylonjs.com/?PARTICLES2) and [wiki here](https://github.com/BabylonJS/Babylon.js/wiki/12-Particles) ([deltakosh](https://github.com/deltakosh))
-   Added toEulerAnglesToRef and CopyFromFloats to Quaternion ([Demonixis](https://github.com/demonixis))
-   Added function to calculate the inverse of a quaternion ([Daner](https://github.com/daner))
-   New `StandardMaterial.useSpecularOverAlpha` to define if you want specular to appear even on top of transparent surfaces ([deltakosh](https://github.com/deltakosh))
-   New `SceneLoader.Append` function to append a babylon.js file to an existing scene ([Palmer-JC](https://github.com/Palmer-JC))
-   New `LinesMesh.alpha` property ([deltakosh](https://github.com/deltakosh))
-   Adding instances exportation support for 3DSMax exporter ([deltakosh](https://github.com/deltakosh))
-   New `Mesh.applyDisplacementMap` and `Mesh.applyDisplacementMapFromBuffer` ([deltakosh](https://github.com/deltakosh))
-   New `Mesh.renderOutline` property to render outlines around a mesh (used with `Mesh.outlineColor` and `Mesh.outlineWidth`) ([deltakosh](https://github.com/deltakosh))
-   New `Light.includedOnlyMeshes` array to define explicitely which mesh is affected by a light ([deltakosh](https://github.com/deltakosh))
-   Added multiply and divide functions to Vector2 ([daner](https://github.com/daner))
-   New feature demo for [custom render target texture](https://www.babylonjs.com/?CUSTOMRENDERTARGET) ([deltakosh](https://github.com/deltakosh))
-   RenderTargetTexture can now specify a camera to use ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Fixing tons of bugs with PostProcessRenderPipeline. Wiki updated. ([deltakosh](https://github.com/deltakosh))

## 1.13.0

### Core Engine

#### Major updates

-   TypeScript port finished ([davrous](https://github.com/davrous) & [deltakosh](https://github.com/deltakosh))
-   Physics engine: new OIMO plugin ([temechon](https://github.com/temechon))
-   New demo: [V8 engine](https://www.babylonjs.com/index.html?V8) (Michel Rousseau)

#### Updates

-   Fixed ray creation when the devicePixelRatio is not equals to 1 ([demonixis](https://github.com/demonixis))
-   New `mesh.registerAfterRender` and `mesh.unregisterAfterRender` functions ([deltakosh](https://github.com/deltakosh))
-   New `fragmentElement` parameter to define custom shader for `BABYLON.ParticleSystem` constructor ([deltakosh](https://github.com/deltakosh))
-   New `OnKeyDown` and `OnKeyUp` triggers. See [actions wiki](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-Actions) for more info ([deltakosh](https://github.com/deltakosh))
-   ArcRotateCamera can now check collisions [wiki](https://github.com/BabylonJS/Babylon.js/wiki/09-Cameras-collisions) ([deltakosh](https://github.com/deltakosh))
-   New `Engine.Version` property which returns a string with the current version ([deltakosh](https://github.com/deltakosh))
-   New "Export and Run" feature for Max2Babylon ([deltakosh](https://github.com/deltakosh))
-   Animations delta time is now capped between Scene.MinDeltaTime and Scene.MaxDeltaTime ([deltakosh](https://github.com/deltakosh))
-   Non-squared DDS are now supported ([deltakosh](https://github.com/deltakosh))
-   New triggers: `BABYLON.ActionManager.OnIntersectionEnterTrigger`, `BABYLON.ActionManager.OnIntersectionExitTrigger`. [Documentation](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-Actions) updated ([deltakosh](https://github.com/deltakosh))
-   New mesh type: `BABYLON.LinesMesh`. You can find a [demo here](https://www.babylonjs.com/?LINES) ([deltakosh](https://github.com/deltakosh))
-   New `mesh.moveWithCollisions` function. Used with `mesh.ellipsoid` and '''mesh.ellipsoidOffset```, this function can be used to move a mesh and use an ellipsoid around it to [check collisions](https://github.com/BabylonJS/Babylon.js/wiki/09-Collisions-by-gravity) ([deltakosh](https://github.com/deltakosh))
-   New feature demo: [How to do drag'n'drop](https://www.babylonjs-playground.com/#UZ23UH#0) ([deltakosh](https://github.com/deltakosh))
-   New `BABYLON.PickingInfo.getTextureCoordinates()` function ([deltakosh](https://github.com/deltakosh))
-   New `BABYLON.Scene.cameraToUseForPointers` property that defines this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position ([deltakosh](https://github.com/deltakosh))
-   `BABYLON.OculusOrientedCamera` was replaced by `BABYLON.OculusCamera` for better integration into camera system ([deltakosh](https://github.com/deltakosh))
-   New `Mesh.CreateTiledGround()` function ([kostar111](https://github.com/kostar111))
-   Shadow Poisson Sampling ([clementlevasseur](https://github.com/clementlevasseur))

#### Bug fixes

-   Fixing a bug when instances are used with a mesh with submeshes.length > 1 ([deltakosh](https://github.com/deltakosh))
-   CreateCylinder() : add subdivisions parameter and fix normals bug ([kostar111](https://github.com/kostar111))

## 1.12.0

### Core Engine

#### Major updates

-   Babylon.js is now entirely developed using TypeScript ([deltakosh](https://github.com/deltakosh), [davrous](https://github.com/davrous))
-   Physics plugins: You can add your own physics engine to Babylon.js. More info [here](https://github.com/BabylonJS/Babylon.js/wiki/Adding-your-own-physics-engine-plugin-to-Babylon.js). Cannon.js is the first supported plugin ([deltakosh](https://github.com/deltakosh))
-   `BABYLON.Action`: You can now create a complex system of interactions. More info [here](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-Actions) ([deltakosh](https://github.com/deltakosh))
-   Babylon.js Playground: Experiment and learn Babylon.js using the [playground](https://www.babylonjs.com/playground) ([deltakosh](https://github.com/deltakosh))
-   Geometry system ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   Support for TGA textures based on [Vincent Thibault](http://blog.robrowser.com/javascript-tga-loader.html) work ([deltakosh](https://github.com/deltakosh))
-   `BABYLON.Gamepads` & `BABYLON.Gamepad`: Support for Gamepad API (Xbox 360 Pad & Generic Pads) ([davrous](https://github.com/davrous))
-   `BABYLON.GamepadCamera`: use a FPS-like camera controlled by your gamepad using 1 line of code ([davrous](https://github.com/davrous))
-   Hardware accelerated instances used to render identical meshes. More info [here](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-instances) ([deltakosh](https://github.com/deltakosh))
-   New `BABYLON.GroundMesh` created by `BABYLON.Mesh.Createground` and `BABYLON.Mesh.CreateGroundFromHeightMap`. This object is optimized for collisions and rendering of grounds (!!!). A first feature is also included `GroundMesh.getHeightAtCoordinates` ([deltakosh](https://github.com/deltakosh))
-   Beta: New [exporter for 3ds Max 2013+](https://github.com/BabylonJS/Babylon.js/tree/master/Exporters/3ds%20Max) ([deltakosh](https://github.com/deltakosh))

#### Updates

-   DDS: Support for RGB, Luminance and cube file format ([deltakosh](https://github.com/deltakosh))
-   New LensFlareSystem.isEnabled property ([deltakosh](https://github.com/deltakosh))
-   New `samplingMode` parameter when creating textures ([deltakosh](https://github.com/deltakosh))
-   Blender: changed object.isVisible to reflect the corresponding param in Blender ([vousk](https://github.com/vousk))
-   New properties: `scene.meshUnderPointer`, `scene.pointerX`, `scene.pointerY` ([deltakosh](https://github.com/deltakosh))
-   Added "layerMask" property to meshes and cameras ([marcolebdech](https://github.com/marcolebdech))
-   New `Mesh.showSubMeshesBoundingBox` to display sbumeshes bounding boxes ([deltakosh](https://github.com/deltakosh))
-   Octree are now more generics and used to optimize rendering, collisions and picking. [More info](https://github.com/BabylonJS/Babylon.js/wiki/Optimizing-performances-with-octrees) ([deltakosh](https://github.com/deltakosh))
-   Shadows now support alpha testing ([deltakosh](https://github.com/deltakosh))
-   New feature demo: [particles](https://www.babylon.com/?PARTICLES) ([deltakosh](https://github.com/deltakosh))
-   New `renderTargetTexture.refreshRate` property to define the refresh rate of RenderTargetTexture: Use 0 to render just once, 1 to render on every frame, 2 to render every two frames and so on... ([deltakosh](https://github.com/deltakosh))
-   New `scene.beforeCameraRender` and `scene.afterCameraRender` callbacks ([deltakosh](https://github.com/deltakosh))
-   New custom functions for ParticleSystem: `startDirectionFunction` and `startPositionFunction` ([deltakosh](https://github.com/deltakosh))
-   `useAlphaFromDiffuseTexture` option for standard material to use 8-it alpha channel from the diffuse texture instead of using it as an alpha test value ([Platane](https://github.com/Platane))
-   New `Tools.Log, Tools.Warn, Tools.Error` functions. Filter can be applied using `Tools.CurrentLoglevel` ([MaxenceBrasselet](https://github.com/MaxenceBrasselet), [deltakosh](https://github.com/deltakosh))
-   Using grunt-contrib-uglify to reduce babylon.js size (from 500KB to 384KB) ([deltakosh](https://github.com/deltakosh))
-   `setDirectionToTarget` function added to SpotLight, HemisphericLight and DirectionalLight ([Wingnutt](https://github.com/Wingnutt))
-   Picking now takes viewport in account ([deltakosh](https://github.com/deltakosh))
-   Point lights and spot lights now have a range ([deltakosh](https://github.com/deltakosh))
-   Color3 interpolator for animations ([deltakosh](https://github.com/deltakosh))
-   New function: `VertexData.CreateGroundFromHeightMap`([deltakosh](https://github.com/deltakosh))
-   New function: `Tools.CreateScreenshot`([nicolas-obre](https://github.com/nicolas-obre))

#### Bug fixes

-   Fixing `ArcRotateCamera.setPosition()` ([Celian](https://github.com/kostar111))
-   RenderTarget crashed when used with incremental engine ([deltakosh](https://github.com/deltakosh))
-   Depth clear is now more controlled (Mainly for Ejecta) ([deltakosh](https://github.com/deltakosh))
-   Fixed a bug with ratio when using RenderTargetTexture [deltakosh](https://github.com/deltakosh))
-   Fixed a bug in the sandbox tool ([davrous](https://github.com/davrous))
-   Fixed a bug with skybox seams [holcombj](https://github.com/holcombj))
-   Moved mousewheel event from window to canvas [deltakosh](https://github.com/deltakosh))
-   Fixed matricesIndices serialization ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   Bug fix and GC optimisation on CSG ([clementlevasseur](https://github.com/clementlevasseur))

#### Breaking changes

-   `Mesh.setVerticesData` signature is now: (kind, values, updatable) instead of (values, kind, updatable) in order to be consistent with `Mesh.updateVerticesData` [deltakosh](https://github.com/deltakosh))

## 1.11.0

### Core Engine

#### Major updates

-   New option for mesh: `mesh.showBoundingBox` to display mesh's bounding box. You can configure back and front color using `scene.getBoundingBoxRenderer()`. This function returns a `BABYLON.BoundingBoxRenderer` where you can define `backColor`, `frontColor` and `showBackLines` ([deltakosh](https://github.com/deltakosh))
-   New basic mesh: `BABYLON.Mesh.CreateTorusKnot` ([deltakosh](https://github.com/deltakosh))
-   New `BABYLON.AnaglyphArcRotateCamera` and `BABYLON.AnaglyphFreeCamera` ([michael-korbas](https://github.com/michael-korbas)), ([deltakosh](https://github.com/deltakosh))
-   Tags system ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   New render pipeline system for post-processes. See documentation [here](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-PostProcessRenderPipeline) ([michael-korbas](https://github.com/michael-korbas))

#### Updates

-   Added parameters to enable or disable a type of texture on all `BABYLON.StandardMaterial` ([demonixis](https://github.com/demonixis))
-   New `BABYLON.VertexData.ExtractFromMesh` function ([deltakosh](https://github.com/deltakosh))
-   Cameras can now have sub-cameras (see `BABYLON.AnaglyphArcRotateCamera` for example) ([deltakosh](https://github.com/deltakosh))
-   New `BABYLON.Engine.runEvenInBackground` property. True by default. It allows you to stop rendering when the browser is not the foreground application. ([deltakosh](https://github.com/deltakosh))
-   Darkness of a shadow + shadow on transparent meshes ([clementlevasseur](https://github.com/clementlevasseur))
-   New event for materials: `onCompiled` and `onError` ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Fixed a bug with collisions cache
-   Fixed a bug with mesh.dispose when called twice ([deltakosh](https://github.com/deltakosh))
-   Fixed an issue with Internet Explorer while rendering a RenderTargetTexture outside the engine renderLoop ([nicolas-obre](https://github.com/nicolas-obre))

#### New demos

-   [CYOS](https://www.babylonjs.com/cyos)

## 1.10.0

### Core Engine

#### Major updates

-   Virtual joysticks canera ([davrous](https://github.com/davrous))
-   Oculus Rift support ([davrous](https://github.com/davrous)), ([simonferquel](https://github.com/simonferquel)), ([deltakosh](https://github.com/deltakosh))
-   Support for DDS textures ([deltakosh](https://github.com/deltakosh))
-   Constructive solid geometries ([CraigFeldspar](https://github.com/CraigFeldspar))
-   Importer plugin system ([deltakosh](https://github.com/deltakosh))
-   Filter postprocess ([deltakosh](https://github.com/deltakosh))
-   Convolution postprocess ([deltakosh](https://github.com/deltakosh))
-   Added Cheetah3d exporter ([Calebsem](https://github.com/Calebsem))
-   New `BABYLON.ShaderMaterial` object to simply create custom shaders ([deltakosh](https://github.com/deltakosh)) - See [Custom shader - cell shading](https://www.babylonjs.com/index.html?CUSTOMSHADER)
-   New `BABYLON.VertexData` object to easily manipulates vertex attributes ([deltakosh](https://github.com/deltakosh)) - See [VertexData](https://www.babylonjs.com/index.html?CLOUDS)

#### Updates

-   Shaders can be loaded from DOM element alongside .fx files ([deltakosh](https://github.com/deltakosh))
-   Adding arcRotateCamera.wheelPrecision ([deltakosh](https://github.com/deltakosh))
-   Support for DOMMouseScroll ([nicolas-obre](https://github.com/nicolas-obre))
-   Adding BABYLON.PickingInfo.prototype.getNormal ([deltakosh](https://github.com/deltakosh))
-   Adding a new noMipmap parameter to `BABYLON.CubeTexture` constructor ([deltakosh](https://github.com/deltakosh))
-   Adding `BABYLON.Color3.FromInts()` and `BABYLON.Color4.FromInts()` ([deltakosh](https://github.com/deltakosh))
-   Adding invertY parameter to `BABYLON.VideoTexture` constructor ([deltakosh](https://github.com/deltakosh))
-   Adding new `BABYLON.Scene.getCameraByID` function ([deltakosh](https://github.com/deltakosh))
-   Adding new `BABYLON.Scene.setActiveCameraByName()` function ([deltakosh](https://github.com/deltakosh))
-   Renaming `BABYLON.Scene.activeCameraByID()` to `BABYLON.Scene.setActiveCameraByID()` ([deltakosh](https://github.com/deltakosh))
-   Adding texture wrapping support to Blender exporter ([vousk](https://github.com/vousk))
-   Add Gulp for buiding babylon cross platform ([SideraX](https://github.com/SideraX))
-   Shadow map improvement on pack method ([clementlevasseur](https://github.com/clementlevasseur))

#### Bug fixes

-   Fixing multimat naming convention in Blender ([deltakosh](https://github.com/deltakosh))
-   Fixing mesh.clone ([temechon](https://github.com/temechon))
-   Fixing camera rotation export in blender ([khmm12](https://github.com/khmm12))
-   Fixing opacity map bug ([deltakosh](https://github.com/deltakosh))
-   Fixing physics objects disposal ([deltakosh](https://github.com/deltakosh))
-   Using the hardware scaling when creating a ray ([demonixis](https://github.com/demonixis))
-   \*_New demos_
-   [Hill Valley](https://www.babylonjs.com/index.html?HILLVALLEY)
-   [Custom shader - cell shading](https://www.babylonjs.com/index.html?CUSTOMSHADER)
-   [Constructive solid geometries](https://www.babylonjs.com/index.html?CSG)
-   [Postprocess - Convolution](https://www.babylonjs.com/index.html?PPCONVOLUTION)
-   [VertexData](https://www.babylonjs.com/index.html?CLOUDS)

## 1.9.0

### Core Engine

#### Major updates

-   Beta support for scene serialization with `BABYLON.SceneSerializer.Serialize` function ([deltakosh](https://github.com/deltakosh))
-   Blender exporter now supports 32 bits indices ([deltakosh](https://github.com/deltakosh))
-   Flat shading support (From Blender and with ``mesh.convertToFlatShadedMesh()`) ([deltakosh](https://github.com/deltakosh))

#### Updates

-   New `mesh.rotate` and `mesh.translate` functions to rotate and translate mesh both locally and globally ([deltakosh](https://github.com/deltakosh))
-   New feature for particles: `ParticleSystem.forceDepthWrite` ([deltakosh](https://github.com/deltakosh))
-   Adding a new parameter to pick in order to be able to pick even on multi views ([deltakosh](https://github.com/deltakosh))
-   New `mesh.lookAt` function ([professorF](https://github.com/professorF))
-   New postprocess system (independent from cameras) ([michael-korbas](https://github.com/michael-korbas))
-   New `mesh.setAbsolutePosition` function ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))

#### Bug fixes

-   Fixing issue with `mesh.infiniteDistance` ([deltakosh](https://github.com/deltakosh))
-   Fixing issue with camera caches ([deltakosh](https://github.com/deltakosh))
-   Fixing issue with aspect ratio ([deltakosh](https://github.com/deltakosh))
-   Fixing arcRotateCamera angle limitations ([deltakosh](https://github.com/deltakosh))
-   Fixing a bug with multi-views: depth buffer was not clear between different passes ([deltakosh](https://github.com/deltakosh))

## 1.8.5

### Core Engine

#### Major updates

-   Visual Studio 2013 templates for Windows 8.1 and nuget packages ([pierlag](https://github.com/pierlag))

#### Updates

-   New `matrix.multiply` function (up to 50% faster) ([deltakosh](https://github.com/deltakosh))
-   New matrices cache system for camera (view and projection matrices) ([juliengobin](https://github.com/juliengobin))
-   New physics impostor: compound and mesh (still really slow) ([deltakosh](https://github.com/deltakosh))
-   Set crossOrigin flag for support CORS ([vbouzon](https://github.com/vbouzon))
-   XNA importer: Changes for Right-Left Coordinate Systems & Prefixed Mesh Parts with Mesh Name ([professorF](https://github.com/professorF))
-   Fixing getPivotMatrix ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   New geometry functions: getLocalTranslation, setPositionWithLocalVector, getPositionExpressedInLocalSpace,locallyTranslate ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   Adding multi mesh import from same file([nicolas-obre](https://github.com/nicolas-obre))

#### Bug fixes

-   Fixing issue when disposing a parent and not its children ([deltakosh](https://github.com/deltakosh))
-   Fixing .obj importer ([deltakosh](https://github.com/deltakosh))
-   Added guardband checks for impostors' size ([deltakosh](https://github.com/deltakosh))

## 1.8.0

### Core Engine

#### Major updates

-   Support for [physics engine](https://www.babylonjs.com/index.html?PHYSICS) thanks to cannon.js ([deltakosh](https://github.com/deltakosh))
-   New [sandbox tool](https://www.babylonjs.com/sandbox/) ([davrous](https://github.com/davrous))

#### Updates

-   New `animation.currentFrame` property to get current animation frame ([deltakosh](https://github.com/deltakosh))
-   New `animation.floatInterpolateFunction` property to define custom float interpolation function ([deltakosh](https://github.com/deltakosh))
-   New `animation.vector3InterpolateFunction` property to define custom vector3 interpolation function ([deltakosh](https://github.com/deltakosh))
-   New `animation.quaternionInterpolateFunction` property to define custom quaternion interpolation function ([deltakosh](https://github.com/deltakosh))

## 1.7.3

### Core Engine

#### Updates

-   Support for "file://" moniker ([davrous](https://github.com/davrous))
-   Support for DAE (COLLADA) file format ([gwenael-hagenmuller](https://github.com/gwenael-hagenmuller))
-   Support for "empty" object type in Blender exporter ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   "use strict" is no more included in minified version ([deltakosh](https://github.com/deltakosh))
-   Fixing a bug with MSGesture with IE11 on Windows 7 ([deltakosh](https://github.com/deltakosh))

## 1.7.0

### Core Engine

#### Major updates

-   Support for [lens flares](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-lens-flares) ([deltakosh](https://github.com/deltakosh))
-   Support for [multi-views](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-multi-views) ([deltakosh](https://github.com/deltakosh))

#### Updates

-   New `light.excludedMeshes` property to exclude specific meshes from light computation ([deltakosh](https://github.com/deltakosh))
-   New `texture.anisotropicFilteringLevel` property to define the anisotropic level of a texture ([deltakosh](https://github.com/deltakosh))
-   New `mesh.infiniteDistance` property to make a mesh static from the point of view of the camera ([deltakosh](https://github.com/deltakosh))
-   New `scene.customRenderTargets` property to add our own renderTargetTexture ([deltakosh](https://github.com/deltakosh))
-   Transparent meshes are sorted back to front ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Fixing a bug when cloning mirrorTexture ([deltakosh](https://github.com/deltakosh))

## 1.6.0

### Core Engine

#### Major updates

-   Support for [postprocesses](https://github.com/BabylonJS/Babylon.js/wiki/How-to-use-postprocesses) ([deltakosh](https://github.com/deltakosh))
-   New builtin postprocesses: Pass, Refraction, Blur, Black and White, Convolution ([deltakosh](https://github.com/deltakosh))
-   New builtin postprocess: FXAA ([simonferquel](https://github.com/simonferquel))
-   Online [assets converter](https://www.babylonjs.com/converter.html) ([pierlag](https://github.com/pierlag))

#### Updates

-   New features demos: [POSTPROCESS - REFRACTION](https://www.babylonjs.com/index.html?PPPREF) and [POSTPROCESS - BLOOM](https://www.babylonjs.com/index.html?PPBLOOM)
-   Removing the unused depth buffer for postprocesses chains ([simonferquel](https://github.com/simonferquel))

#### Bug fixes

-   Fixing a memory leak when releasing textures ([simonferquel](https://github.com/simonferquel))

## 1.5.3

### Core Engine

#### Updates

-   New `lockedTarget` for freeCamera in order to allow cameras to track moving targets ([deltakosh](https://github.com/deltakosh))
-   Cameras now supports animations (see https://www.babylonjs.com/index.html?TRAIN) ([deltakosh](https://github.com/deltakosh))
-   New `angularSensibility` property for cameras ([deltakosh](https://github.com/deltakosh))
-   New `upVector` property for cameras. Cameras are now not limited to a (0, 1, 0) up vector ([deltakosh](https://github.com/deltakosh))
-   New `parent` property for cameras and lights: Lights, cameras and meshes can be related. For instance a camera can now be attached to a mesh as child and vice versa ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Fixing a bug when exporting materials from Blender ([deltakosh](https://github.com/deltakosh))
-   Fixing an issue with IE11 for RT ([deltakosh](https://github.com/deltakosh))
-   Fixing an issue with looping animations ([deltakosh](https://github.com/deltakosh))

## 1.5.2

### Core Engine

#### Updates

-   New `renderingGroupId` for SpriteManager ([deltakosh](https://github.com/deltakosh))
-   `BoundingBox` and `BoundingSphere` are prepared with an identity matrix during construction ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   Fixing a bug preventing wireframe to be displayed ([deltakosh](https://github.com/deltakosh))
-   Fixing an issue with last IE update ([deltakosh](https://github.com/deltakosh))

## 1.5.1

### Core Engine

#### Updates

-   Massive update of typescript files ([jroblak](https://github.com/jroblak))

#### Bug fixes

-   Fixing an issue with `SceneLoader.ImportMesh` ([nicolas-obre](https://github.com/nicolas-obre))
-   Fixing an issue with sprites rendering when no mesh is present ([deltakosh](https://github.com/deltakosh))

## 1.5.0

### Core Engine

#### Major updates

-   New `DeviceOrientationCamera` that supports W3C DeviceOrientations events ([deltakosh](https://github.com/deltakosh))
-   Incremental loading support for meshes and textures ([deltakosh](https://github.com/deltakosh))
-   New API online page to convert .babylon files to .incremental.babylon files ([pierlag](https://github.com/pierlag))
-   New `mesh.renderingGroupId` and `particleSystem.renderingGroupId` properties to support rendering layers ([deltakosh](https://github.com/deltakosh))

#### Updates

-   New `predicate` parameter for `scene.pick` function in order to be able to select pickable meshes ([deltakosh](https://github.com/deltakosh))
-   New `mesh.refreshBoundingInfo()` method ([deltakosh](https://github.com/deltakosh))
-   New `onAnimationEnd` parameter for animations ([deltakosh](https://github.com/deltakosh))

## 1.4.3

### Core Engine

#### Updates

-   New `mesh.setLocalTranslation` and `mesh.getLocalTranslation` functions ([deltakosh](https://github.com/deltakosh))
-   New `matrix.setTranslation` function ([deltakosh](https://github.com/deltakosh))
-   `mesh.rotation` and `mesh.rotationQuaternion` are now two separated functions ([deltakosh](https://github.com/deltakosh))

## 1.4.2

### Core Engine

#### Bug fixes

-   Fixing an issue with scene.executeWhenReady ([deltakosh](https://github.com/deltakosh))

## 1.4.1

### Bug fixes

-   Support for Safari ([deltakosh](https://github.com/deltakosh))
-   Adding local transformations to Blender exporter ([deltakosh](https://github.com/deltakosh))
-   IndexedDB code refactoring to support simultaneous calls ([davrous](https://github.com/davrous))
-   Hardware scaling fix ([Gwenaël Hagenmuller](https://github.com/gwenael-hagenmuller))
-   Fixing a bug with sprites dynamic buffers ([deltakosh](https://github.com/deltakosh))

## 1.4.0

### Core Engine

#### Major features

-   Bones support ([deltakosh](https://github.com/deltakosh)). Bones and animated bones are now supported. They can cast shadows. Bones can be exported from Blender or from FBX
-   Offline support ([davrous](https://github.com/davrous). You can specify to offline assets (scene and textures) to a local IndexedDB. Assets are then loaded once until you change the version on a server-side manifest
-   N-Level octrees ([deltakosh](https://github.com/deltakosh)):

#### Updates

-   Adding `dispose()` function and a `disposeWhenFinishedAnimating` property to sprites ([Cyle](https://github.com/CYle/))
-   Adding a `applyTransform()` function to meshes in order to bake a specific transformation into vertices ([deltakosh](https://github.com/deltakosh))
-   Adding `setPivotMatrix()` and `getPivotMatrix()` to meshes to define pivot matrix ([deltakosh](https://github.com/deltakosh))
-   `Mesh.CreateCylinder` now takes two diameters as parameters to be able to create cone ([deltakosh](https://github.com/deltakosh))
-   New `material.Clone` function ([deltakosh](https://github.com/deltakosh))

#### Bug fixes

-   `scene.IsReady()` is more robust now and can be used to detect when the scene is EFFECTIVELY ready :) ([deltakosh](https://github.com/deltakosh))
-   Fixing animations timing. Animations should be in sync now ([deltakosh](https://github.com/deltakosh))
-   Fixing a bug with orthographic camera ([deltakosh](https://github.com/deltakosh))
-   Fixing a bug with `attachControl()` function ([deltakosh](https://github.com/deltakosh))
-   Fixing a bug with `scene.pick()` function ([deltakosh](https://github.com/deltakosh))

## 1.3.2

### Core Engine

-   Fixing a bug with camera.detachControl

## 1.3.0

### Core Engine

-   Selection octrees
-   Breaking changes: Meshes now use multi vertex buffers (one for each attribute) instead of a big one. This is for more flexibility. The .babylon file format has changed accordingly (no more .vertices property on meshes but .positions, .normals, .colors, .uvs, .uvs2)

## 1.2.1

### Core Engine

-   Support for PointerLock ()
-   StandardMaterial now supports per-vertex color
-   Blender exporter supports per-vertex color

## 1.2.0

### Core Engine

-   Major rework of the API to remove GC pressure.
-   FreeCamera: Support for QWERTY keyboards
-   New 3D charting demo

## 1.1.0

### Core Engine

-   Shadow Maps and Variance Shadow Maps
-   Shadows Maps and animations are now exported from Blender
-   Hand.js is no longer required for ArcRotateCamera
-   ArcRotateCamera support pinch/zoom gesture on IE

## 1.0.10

### Core Engine

-   Using typed arrays for Matrix
-   Improving IE11 support
-   Support for new mesh primitives : Torus and cylinder

## 1.0.9

### Core Engine

-   Orthographic camera

## 1.0.8

### Core Engine

-   Adding keyboard support to ArcRotateCamera
-   Starting to use git tag

## 1.0.7

### Core Engine

-   New demo: Worldmonger
-   Improved IE shaders

## 1.0.6

### Core Engine

-   Dynamic meshes
-   Skybox
-   Support for high-DPI displays
-   Height maps

## 1.0.5

### Core Engine

-   Adding color tint for sprites and layers

## 1.0.4

### Core Engine

-   Various optimizations
-   Fog
-   TypeScript support

## 1.0.3

### Core Engine

-   Video textures
-   Normal map (bump)

## 1.0.2

### Core Engine

-   Spot lights
-   Hemispheric lights
