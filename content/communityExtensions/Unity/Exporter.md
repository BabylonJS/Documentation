---
title: Scene Exporter
image: 
description: The features of the  Unity Toolkit scene exporter.
keywords: babylon.js, exporter, unity, scene 
further-reading:
video-overview:
video-content:
---

**Note:** The scene exporter panel is the primary toolkit interface. It must be opened or docked to enable the toolkit features during project development.

![Scene Exporter](/img/exporters/unity/exporter.jpg)

## Global Export Options

* Project Bin Path        - Specifies the exported project binary path.

* Project Build Path      - Specifies the exported project build path.

* Project Scene Path      - Specifies the exported project scene path.

* Project Script Path     - Specifies the exported project script path.

* Project Index Page      - Specifies the exported project index page.

## Default Engine Options

![Engine Options](/img/exporters/unity/engine.jpg)

* Enable Physics Engine   - Enables or disables the built-in physics engine.

* Default Physics Engine  - Specifies the default physics engine for the project.

* Set Engine Antialias    - Enables or disables the engine anti alias option.

* Adaptive Device Ratio   - Sets the engine to adapt to device ratio.

* Set Image Encoding      - Enables or disables default image encoding options.

* Default Texture Format  - Specifies the default image encoding format.

* Set Texture Quality     - Sets the default texture image quality.

* Set Mesh Vertex Limit   - Enables or disables the static mesh vertex limit (65000).

## Terrain Builder Options

![Terrain Options](/img/exporters/unity/terrain.jpg)

* Terrain Scale Factor    - Sets the shader texture scale factor for all terrain splatmaps.

* Texture Atlas Size      - Sets the terrain splatmap texture atlas maximum size.

* Texture Image Scaling   - Sets the mode when scaling tile images to point or bilinear.

* Shadow Lightmap Index   - Sets the lightmap index channel. Must be 0 or 1.

## Collision System Options

![Collision Options](/img/exporters/unity/collision.jpg)

* Enable Collisions       - Enable built-in collision mesh system.

* Generate Colliders      - Auto generate collision meshes for each collider component.

* Collision Visibilty     - Sets the default collision mesh visibilty level for debugging.

* Show Debug Colliders    - Show all collider component collision meshes for debugging.

* Show Debug Sockets      - Show all socket component collision meshes for debugging.

* Socket Collider Size    - Sets the size of the socket component collision mesh for debugging.

* Default Collider Detail - Set the collision mesh goemetry detail level for all generated mesh colliders.

## Lightmap Baking Options

![Lightmap Options](/img/exporters/unity/lightmap.jpg)

* Export Lightmaps        - Enable built-in shadow lightmap baking system.

* Bake Iterative Maps     - Enable built-in final lightmap gather and bake option.

* Coordinates Index       - Sets the default texture coordinate index for lightmaps.

* Use Material Instance   - Enables or disables material instances for shared material lightmaps.

* Area Baking Lights      - Include or exclude lightmap area baking lights into exported scene.

## Project Compiler Options

![Compiler Options](/img/exporters/unity/compilers.jpg)

* Build Typescript Files  - Enables or disables optional runtime script compiler.

* Typescript Compiler     - Specifies the default TypeScript compiler location.

* Node Runtime System     - Specifies the default Node runtime system location.

## Windows Platform Options

![Windows Options](/img/exporters/unity/windows.jpg)

* Launching Mode          - Specifies UWP Application initial window state.

* Run App Protocol        - Enables and specifies the UWP Application protocol.

* Xbox Live Services      - Enables the toolkit managed Xbox Live Service API.

* Xbox Live Plugin        - Launches the toolkit managed Xbox Live Service API NuGet install info.

* Switch Windows Sandbox  - Launches the toolkit local Windows Sandbox Switcher amdinistrative tool.

## Toolkit Exporter Options

![Export Options](/img/exporters/unity/export.jpg)

* Attach Unity Editor     - Enables the built-in toolkit play to build and preview features.

* Host Preview Server     - Toggle internal and external web server hosting options for project.

* Default Server Port     - Specifies the default web server host port for previewing scene.

* Remote Server Path      - Specifies the remote server host address for external server option.

* Show Render Stats       - Toggle debug rendering stats default page options for project.

* Set Default Scene       - Set the index page default scene name option for project.

* Enable Main Menu        - Toggle html project main menu page options for project.

* Truevision Graphics     - Toggle the native TARGA image file support options for project.

* Embed Html Pages        - Toggle internal embed html pages into makrup store options for project.

* Export Http Module      - Enables the web server http scene content management module.

* Export Web Assembly     - Enables or disables the exported wasm content option.

* Export Unity Metadata   - Enables or disables the default scene object metadata information.

* Precompress Contents    - Enables or disables the exported precompressed content option.

* Minify Project Scripts  - Enables or disables the exported script minification option.

* Debug Exporter Output   - Enables or disables pretty print json and compiler source maps.

## Scene Builder Options

![Builder Options](/img/exporters/unity/builder.jpg)

* Compile Script          - Compiles the projects typescript files only with no previewing

* Export Scene File       - Exports scene only content with no compiling or previewing.

* Build And Preview       - Exports a full scene build with compiling and optional previewing.

* Rebuild Editor Project  - Rebuilds the native Unity Editor project source code.

* Launch Preview Window   - Launches the current preview build in browser.


## Output Window

![Output Window](/img/exporters/unity/output.jpg)

The output window traces the toolkit export progress for every build. Any exported camera, light or mesh detail information will appear in this window. The output window can be docked to the editor during game development for easy access.

.