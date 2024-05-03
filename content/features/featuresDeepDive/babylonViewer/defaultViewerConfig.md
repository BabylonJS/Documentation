---
title: Modify the Babylon.js Viewer
image:
description: Modifying the Babylon.js viewer using HTML.
keywords: extensions, babylon.js, viewer, modify, configure
further-reading:
  - title: Babylon.js Viewer
    url: /features/featuresDeepDive/babylonViewer
  - title: Configuring the viewer
    url: /features/featuresDeepDive/babylonViewer/configuringViewer
  - title: The templating system
    url: /features/featuresDeepDive/babylonViewer/viewerTemplatingSystem
  - title: Advanced usage
    url: /features/featuresDeepDive/babylonViewer/advancedViewerUsage
  - title: Babylon.js viewer examples
    url: /features/featuresDeepDive/babylonViewer/viewerExamples
video-overview:
video-content:
---

This tutorial is meant to show the advanced usage of the viewer's configuration only. It is meant as an explanation of what can be done and how you can modify the viewer to your needs using HTML only.

The default configuration is already implemented and can be used very easily, by adding `extends="default"` to your HTML element. In code, it is a JSON that looks roughly like this (without the HTML and image content):

```javascript
{
    templates: {
        main: {
            html: defaultTemplate,
            params: {
                babylonFont: babylonFont,
                noEscape: true
            }
        },
        fillContainer: {
            html: fillContainer,
            params: {
                disable: false
            }
        },
        loadingScreen: {
            html: loadingScreen,
            params: {
                backgroundColor: "#000000",
                loadingImage: images.loading
            }
        },
        viewer: {
            html: defaultViewer,
            params: {
                enableDragAndDrop: false
            }
        },
        navBar: {
            html: navbar,
            params: {
                speedList: {
                    "0.5x": "0.5",
                    "1.0x": "1.0",
                    "1.5x": "1.5",
                    "2.0x": "2.0",
                },
                logoImage: images.babylonLogo,
                logoText: 'BabylonJS',
                logoLink: 'https://babylonjs.com',
                hideHelp: true,
                hideHd: true,
                hideVr: true,
                disableOnFullscreen: false,
                text: {
                    hdButton: "Toggle HD",
                    fullscreenButton: "Fullscreen",
                    helpButton: "Help",
                    vrButton: "Toggle VR"
                }
            },
            events: {
                pointerdown: {
                    '.navbar-control': true,
                    '.help-button': true
                },
                input: {
                    '.progress-wrapper': true
                },
                pointerup: {
                    '.progress-wrapper': true
                }
            }
        }
    },
    camera: {
        behaviors: {
            autoRotate: {
                type: 0
            },
            framing: {
                type: 2,
                zoomOnBoundingInfo: true,
                zoomStopsAnimation: false
            },
            bouncing: {
                type: 1
            }
        }
    },
    skybox: {
    },
    ground: {
        receiveShadows: true
    },
    engine: {
        antialiasing: true
    }
}
```

## HTML element and viewer script

As a first step we will need to create our basic HTML page and include the viewer script. Since I am creating my own configuration, I will use `extends="none"` so that no configuration will be included at construction time.

```html
<html>
  <head>
    <title>Recreating the default configuration for Babylon.js viewer</title>
    <style>
      /* Force the viewer to have a specific size. This can be changed, of course. */
      babylon {
        width: 800px;
        height: 500px;
      }
    </style>
  </head>
  <body>
    <babylon extends="none"> </babylon>

    <script src="https://preview.babylonjs.com/viewer/babylon.viewer.js"></script>
  </body>
</html>
```

This is the basic foundation of the entire tutorial. From this point I will show only content in the `<body>` tag.

## Engine and camera configuration

To add the engine configuration (adding antialiasing for better image quality) I will add the engine HTML tag to the babylon tag:

```html
<babylon extends="none">
  <!-- enable antialiasing -->
  <engine antialiasing="true"></engine>
</babylon>
```

The camera configuration is added afterwards, using the camera HTML tag:

```html
<babylon extends="none">
  <!-- enable antialiasing -->
  <engine antialiasing="true"></engine>
  <!-- camera configuration -->
  <camera>
    <!-- add camera behaviors -->
    <behaviors>
      <!-- enable default auto-rotate behavior -->
      <auto-rotate type="0"></auto-rotate>
      <!-- enable and configure the framing behavior -->
      <framing type="2" zoom-on-bounding-info="true" zoom-stops-animation="false"></framing>
      <!-- enable default bouncing behavior -->
      <bouncing type="1"></bouncing>
    </behaviors>
  </camera>
</babylon>
```

The camera configuration includes camera behaviors' configuration, which are a native Babylon.js feature. You can read about it in [Camera behaviors](/features/featuresDeepDive/babylonViewer/configuringViewer)

## Adding environment

To add the environment we will need to enable the ground and the skybox. There are two options to do that. THe first is to enable them in the `<babylon>` tag. I use it when I don't want to further configure the element I am extending. For example:

```html
<babylon skybox="true" ground="true"> </babylon>
```

This will enable the default skybox and ground. Another way, which is the one I will be using is to add the HTML elements:

```html
<babylon extends="none">
  <!-- Ground that receives shadows -->
  <ground receive-shadows="true"></ground>
  <!-- Default skybox -->
  <skybox></skybox>

  <!-- enable antialiasing -->
  <engine antialiasing="true"></engine>
  <!-- camera configuration -->
  <camera>
    <!-- add camera behaviors -->
    <behaviors>
      <!-- enable default auto-rotate behavior -->
      <auto-rotate type="0"></auto-rotate>
      <!-- enable and configure the framing behavior -->
      <framing type="2" zoom-on-bounding-info="true" zoom-stops-animation="false"></framing>
      <!-- enable default bouncing behavior -->
      <bouncing type="1"></bouncing>
    </behaviors>
  </camera>
</babylon>
```

The reasons I choose the 2nd way are:

- It is readable and easy to understand
- it is extendible. If I want to change the skybox's configuration, I need to change the tag and not add a new one.

## Templates - Main template

An important part of the viewer is the templating system - it takes predefined HTML elements, adds them where needed and attaches Babylon to the created canvas element and the buttons in the navigation bar. To read about it, visit [The templating system](/features/featuresDeepDive/babylonViewer/viewerTemplatingSystem).

The default viewer, which is the viewer we are using when using the `<babylon>` tag, expects certain templates to have specific elements (like a full screen button in the navigation bar, or a loading screen). If specific templates aren't included, the viewer will fail silently and will continue rendering the 3D element. The only obligatory template is the main template. Without a main template (which can be a single canvas and that's it) the viewer will fail.

### Adding a new template

To add a new template using HTML, I will add each template I want to add inside a `<script id="name-of-template" type="text/x-babylon-viewer-template">`. This template can later be referenced in the viewer configuration using the defined ID.

For example, this is the main template (copied from https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/viewer/assets/templates/default/defaultTemplate.html):

```html
<script id="main-template" type="text/x-babylon-viewer-template">
  <style>
      @font-face {
          font-family: 'babylon';
          src: url('{{babylonFont}}') format('woff');
          font-weight: normal;
          font-style: normal;
      }

      .icon {
          font-family: "babylon";
      }
  </style>

  {{#if fillScreen}}
  <style>
      html,
      body {
          width: 100%;
          height: 100%;

          margin: 0;
          padding: 0;
      }
  </style>
  {{/if}}

  <fill-container></fill-container>
</script>
```

Everything inside the script tag will be sent to [handlebars](https://handlebarsjs.com/). Since we are using handlebars you can parameterize or use conditions inside your templates. Looking at the main template, you can see that there are two parameters that the template expects:

- A link to a font file (that includes the icons we will later use in the navigation bar)
- a flag, `fillScreen` that will add specific style definition if we want the viewer to fill the entire screen

You can also notice that the main template holds a tag called `fill-container`. The fill container tag will be populated using a template with the same name that I will define later. Using custom HTML tags are the way you can define your own templating tree and configure a specific part of the viewer without editing the rest of the elements.

### Adding the template to the viewer

The add the main template to the viewer, we will add the main tag to the babylon tag:

```html
<babylon extends="none">
  <templates>
    <main location="#main-template">
      <params no-escape="true" babylon-font="https://viewer.babylonjs.com/babylon.woff"></params>
    </main>
  </templates>

  <!-- Ground that receives shadows -->
  <ground receive-shadows="true"></ground>
  <!-- Default skybox -->
  <skybox></skybox>

  <!-- enable antialiasing -->
  <engine antialiasing="true"></engine>
  <!-- camera configuration -->
  <camera>
    <!-- add camera behaviors -->
    <behaviors>
      <!-- enable default auto-rotate behavior -->
      <auto-rotate type="0"></auto-rotate>
      <!-- enable and configure the framing behavior -->
      <framing type="2" zoom-on-bounding-info="true" zoom-stops-animation="false"></framing>
      <!-- enable default bouncing behavior -->
      <bouncing type="1"></bouncing>
    </behaviors>
  </camera>
</babylon>
```

I'll dissect the templates tag to explain how it is configured.

#### Location parameter

```html
<main location="#main-template"></main>
```

This line adds a new template called "main" to the template manager. It will find its HTML source in the script template tag with the id `main-template` (which is the one we defined before). Location could also be a URL, from which the HTML will be downloaded and parsed. For example:

```html
<main location="https://example.com/templates/main.html"></main>
```

#### params element

To pass variables to the template when compiled (using handlebars), I pass variables in the params HTML tag. The following tag:

```html
<params no-escape="true" babylon-font="https://viewer.babylonjs.com/babylon.woff"></params>
```

will configure handlebars to not escape input (noEscape, https://handlebarsjs.com/reference.html) and will pass `babylonFont` to the template. It will then populate this in the line `src: url('{{babylonFont}}') format('woff');` of the main template I previously defined. We could also add the `fillScreen`flag to allow fullscreen viewer:

```html
<params no-escape="true" babylon-font="https://viewer.babylonjs.com/babylon.woff" fill-screen="true"></params>
```

## Further templates

I continue adding the templates as I added the main template. I will show here two more templates that are important. The one holding the canvas, and the navigation bar - to show how to enable events.

### The template holding the canvas

A canvas is needed for babylon to work correctly. We will need to add one (and only one!) canvas element in one of the included templates.

```html
<script id="viewer-template" type="text/x-babylon-viewer-template">
  <style>
      viewer {
          position: relative;
          overflow: hidden;
          /* Start stage */
          z-index: 1;
          justify-content: center;
          align-items: center;

          width: 100%;
          height: 100%;
      }

      .babylonjs-canvas {
          flex: 1;
          width: 100%;
          height: 100%;
          /* enable cross-browser pointer events */
          touch-action: none;
      }
  </style>

  <canvas class="babylonjs-canvas" touch-action="none"></canvas>

  <nav-bar></nav-bar>
</script>
```

In order to get the pointer input work in all browsers - including iOS devices - I add the touch-action parameter to both the canvas element and the CSS definition of the canvas. This is very important. Otherwise certain browsers will not except user input.

### The navigation bar

In the case of navigation bar I want to show how to add the navbar's template and enable js-events on specific elements of it. The navbar's html code can be found here - https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/viewer/assets/templates/default/navbar.html .

This is the full `templates` object, with comments on the navbar definition

```html
<babylon extends="none">

    <templates>
        <main location="#main-template">
            <params no-escape="true" babylon-font="https://viewer.babylonjs.com/babylon.woff"></params>
        </main>
        <fill-container location="#fill-container-template">
            <params disable="false"></params>
        </fill-container>
        <loading-screen location="#loading-screen-template">
            <params background-color="#000000" loading-image="https://blogs.windows.com/uploads/mswbprod/sites/3/2018/05/b58474ab97a2708346422fe7ce30c15e.png"></params>
        </loading-screen>
        <viewer location="#viewer-template">
            <params enable-drag-and-drop="false"></params>
        </viewer>
        <nav-bar location="#nav-bar-template">
            <!-- Configuring the navbar's parameters - hide certain buttons, set the main button's text, link and image -->
            <params logo-image="https://blogs.windows.com/uploads/mswbprod/sites/3/2018/05/b58474ab97a2708346422fe7ce30c15e.png" logo-text="BabylonJS"
                logo-link="https://babylonjs.com" hide-help="true" hide-hd="true" hide-vr="true" disable-on-fullscreen="false">
                <!-- define the list of speeds to be shown when a model has animations -->
                <speed-list "0.5x"="0.5" "1.0x"="1.0" "2.0x"="2.0"></speed-list>
                <!-- I18n -->
                <text hd-button="Toggle HD" fullscreen-button="Fullscreen"></text>
            </params>
            <!-- enable events - pointerdown, pointerup and input events will have callbacks if triggered on the navbar element -->
            <events pointerdown="true" pointerup="true" input="true"></events>
        </nav-bar>
    </templates>

    <!-- Ground that receives shadows -->
    <ground receive-shadows="true"></ground>
    <!-- Default skybox -->
    <skybox></skybox>

    <!-- enable antialiasing -->
    <engine antialiasing="true"></engine>
    <!-- camera configuration -->
    <camera>
        <!-- add camera behaviors -->
        <behaviors>
            <!-- enable default auto-rotate behavior -->
            <auto-rotate type="0"></auto-rotate>
            <!-- enable and configure the framing behavior -->
            <framing type="2" zoom-on-bounding-info="true" zoom-stops-animation="false"></framing>
            <!-- enable default bouncing behavior -->
            <bouncing type="1"></bouncing>
        </behaviors>
        <!-- The 3D model to be viewed -->
        <model url="https://models.babylonjs.com/shark.glb"></model>
    </camera>
</babylon>
```

## Viewing a model

Once the Babylon.js viewer if fully configured, you can specify which 3D model you want to view.

There are two ways to specify a 3D model

1. Add a `model` attribute on the `<babylon>` tag which can point to a 3D model file.

   ```html
   <babylon extends="none" model="https://models.babylonjs.com/shark.glb"></babylon>
   ```

2. Add a `<model>` HTML tag and set its `url` attribute to a 3D model file.
   `html <babylon extends="none"> <model url="https://models.babylonjs.com/shark.glb"></model> </babylon> `
   The examples point to a sample [shark glTF model](https://github.com/BabylonJS/MeshesLibrary/blob/master/shark.glb). You can also load other formats including `.glTF`, `.babylon`, `.obj`, and `.stl`. Note that the model won't be displayed till the entire configuration is added to the viewer.

## The full example

<p data-height="550" data-theme-id="light" data-slug-hash="KBXVdw" data-default-tab="html,result" data-user="BabylonJS" data-pen-title="[Babylon.js Viewer] Recreating default configuration" class="codepen">See the Pen <a href="https://codepen.io/BabylonJS/pen/KBXVdw/">[Babylon.js Viewer] Recreating default configuration</a> by Babylon.js (<a href="https://codepen.io/BabylonJS">@BabylonJS</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
