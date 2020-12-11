---
title: Babylon.js Wordpress Integration
image: 
description: This section shows you nifty extensions that allow you to add Babylon.js to WordPress.
keywords: extensions, babylon.js, CMS system, wordpress
further-reading:
video-overview:
video-content:
---

This section shows you nifty extensions that allow you to add Babylon.js to WordPress.

![Wordpress](https://s.w.org/style/images/about/WordPress-logotype-simplified.png)


#Babylon.js and Wordpress 

Currently there are 2 implementations of Babylon.js into Wordpress: **Babylon Viewer 3D Wordpress** plugin and **BabylonPress 3D Wordpress** plugin. One of the main task of these plugins – to make the web publishing of a 3D content much more easier than ever before.

Babylon Viewer 3D Wordpress plugin is based on Babylon Viewer extension. It is intended mainly for simple cases like 3D model demonstration with the help of the shortcode. You will find more detailed info about Babylon Viewer 3D Wordpress plugin in its section below or [just download it from GitHub](https://github.com/eldinor/babylon-wordpress-plugin "download  from GitHub") with included readme.md file.

The second plugin, BabylonPress 3D Wordpress,  allows to publish the examples from [Babylon.js PlayGround](https://playground.babylonjs.com/ "Babylon.js PlayGround") at your Wordpress website. 

It is more complicated but it has more options and gives more freedom to developers and 3D artists, who are able now to easily publish their 3D content at Wordpress-driven site. 

Basically the process is just copy-paste the code from Babylon JS PlayGround, and choose several options. Surely, one can use not only PlayGround but any environment to produce necessary .js code.

BabylonPress 3D Wordpress plugin is in active development stage; the first alpha release is planned at January 2021 and will be published at GitHub as open source project.

You may see BabylonPress 3D Wordpress plugin in action at demo site at https://babylonpress.org/ 

More detailed info will follow.

##Babylon Viewer 3D Wordpress Plugin

Babylon Viewer 3D Wordpress plugin automatically provides a default viewing experience for 3D models. All aspects of this experience are configurable. 

It allows to display 3D models and 3D scenes with the help of shortcode 

`[babylon]URL-OF-3D-FILE[/babylon] `

to use the 3D Viewer in Wordpress posts and pages, Woocommerce products, Elementor blocks etc. 

Just load 3D model (or use external one), put its URL into the shortcode and save your post or page – that's all!

Supports GLTF, GLB, STL, OBJ+MTL and BABYLON files upload and demonstration.

If you need more control, you may use 

`<babylon></babylon>`

tag in any Wordpress HTML block and configure all needed parameters (light, camera position, camera behaviour, rotating etc). See [Configuring Babylon.js Viewer](https://doc.babylonjs.com/extensions/babylonViewer/configuringViewer "Configuring Babylon.js Viewer") for more information on customizing the viewing experience.

There are possible another options and configurations (like load a model from .json file). For all questions regarding Babylon Viewer configuration please refer to the corresponding sections of the [Viewer documentation](https://doc.babylonjs.com/extensions/babylonViewer "Viewer documentation").

Babylon Viewer 3D Wordpress plugin designed to be as straight and minimal as possible just to allow for Babylon Viewer extension to work. It doesn’t save any  data in Wordpress database. All settings are configured in DOM exactly as if you would use original Babylon Viewer extension.

If you have problems with Babylon Viewer 3D Wordpress plugin, please make an issue at [GitHub project page ](https://github.com/eldinor/babylon-wordpress-plugin "GitHub project page ")or ask advice in [forum thread](https://forum.babylonjs.com/t/babylon-viewer-3d-wordpress-plugin-version-0-3-major-update/15004 "forum thread").

