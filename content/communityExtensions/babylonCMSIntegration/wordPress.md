---
title: Babylon.js WordPress Integration
image: 
description: This section shows you nifty extensions that allow you to add Babylon.js to WordPress.
keywords: extensions, babylon.js, CMS system, wordpress
further-reading:
video-overview:
video-content:
---

This section shows you nifty extensions that allow you to add Babylon.js to WordPress.

![WordPress](https://s.w.org/style/images/about/WordPress-logotype-simplified.png)


## Babylon.js and WordPress

Currently, there are two Babylon.js implementations for WordPress: the **Babylon Viewer 3D WordPress** plugin and the **BabylonPress 3D WordPress** plugin. One of the main goals of these plugins is to make web publishing of 3D content much easier than ever before.

The Babylon Viewer 3D WordPress plugin is based on the Babylon Viewer extension. It is intended mainly for simple cases such as 3D model demonstrations with the help of a shortcode. You will find more detailed information about the Babylon Viewer 3D WordPress plugin in its section below, or you can [download it from GitHub](https://github.com/eldinor/babylon-wordpress-plugin "download  from GitHub") with the included readme.md file.

The second plugin, BabylonPress 3D WordPress, allows you to publish examples from [Babylon.js PlayGround](https://playground.babylonjs.com/ "Babylon.js PlayGround") on your WordPress website.

It is more complicated, but it has more options and gives more freedom to developers and 3D artists, who can now easily publish their 3D content on a WordPress-driven site.

Basically, the process is as simple as copying and pasting code from a Babylon.js PlayGround and choosing several options. You can use not only the PlayGround but also any environment that produces the necessary .js code.

The BabylonPress 3D WordPress plugin is in active development; the first alpha release is planned for January 2021 and will be published on GitHub as an open source project.

You can see the BabylonPress 3D WordPress plugin in action at the demo site: https://babylonpress.org/

More detailed information will follow.

### Babylon Viewer 3D WordPress Plugin

The Babylon Viewer 3D WordPress plugin automatically provides a default viewing experience for 3D models. All aspects of this experience are configurable.

It allows you to display 3D models and 3D scenes with the help of the shortcode

`[babylon]URL-OF-3D-FILE[/babylon] `

to use the 3D Viewer in WordPress posts and pages, WooCommerce products, Elementor blocks, etc.

Just load a 3D model (or use an external one), put its URL into the shortcode, and save your post or page—that's all!

Supports uploading and displaying GLTF, GLB, STL, OBJ+MTL, and BABYLON files.

If you need more control, you may use the:

`<babylon></babylon>`

tag in any WordPress HTML block and configure all needed parameters (light, camera position, camera behavior, rotation, etc.). See [Configuring Babylon.js Viewer](https://doc.babylonjs.com/extensions/babylonViewer/configuringViewer "Configuring Babylon.js Viewer") for more information on customizing the viewing experience.

There are other possible options and configurations (such as loading a model from a .json file). For all questions regarding Babylon Viewer configuration, please refer to the corresponding sections of the [Viewer documentation](https://doc.babylonjs.com/extensions/babylonViewer "Viewer documentation").

The Babylon Viewer 3D WordPress plugin is designed to be as straightforward and minimal as possible, simply allowing the Babylon Viewer extension to work. It doesn’t save any data in the WordPress database. All settings are configured in the DOM exactly as if you were using the original Babylon Viewer extension.

If you have problems with the Babylon Viewer 3D WordPress plugin, please create an issue on the [GitHub project page ](https://github.com/eldinor/babylon-wordpress-plugin "GitHub project page ") or ask for advice in the [forum thread](https://forum.babylonjs.com/t/babylon-viewer-3d-wordpress-plugin-version-0-3-major-update/15004 "forum thread").
