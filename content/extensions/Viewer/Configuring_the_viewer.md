---
title: Configuring the Babylon.js Viewer  (Extension) 
image: 
description: How to configure the Babylon.js viewer.
keywords: extensions, babylon.js, viewer, modify, configure
further-reading:
    - title: Babylon.js Viewer
      url: /toolsAndResources/babylonViewer
    - title: The templating system
      url: /toolsAndResources/babylonViewer/viewerTemplatingSystem
    - title: Recreating the default configuration for the viewer
      url: /toolsAndResources/babylonViewer/defaultViewerConfig
    - title: Advanced usage
      url: /toolsAndResources/babylonViewer/advancedViewerUsage
    - title: Babylon.js viewer examples
      url: /toolsAndResources/babylonViewer/viewerExamples
video-overview:
video-content:
---

## Configuring the viewer

(Almost) every aspect of the viewer can be configured. The configuration is expressed using a TypeScript interface that is a JSON-like object describing the data that can be provided.

## The default configuration

The viewer currently defines two types of configurations:

1. The default configuration (`default`), including HTML templates for a navigation bar, layouts for help and error pages, a skybox, ground, shadows, and more. It is defined at [https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/types/default.ts](https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/types/default.ts)
2. The minimal configuration (`minimal`), with only the basics needed to show a model. It is defined at [https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/types/minimal.ts](https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/types/minimal.ts)

The default configuration will be loaded per default, unless other configuration type will be forced on the viewer by the developer. To force a different type of configuration, add the DOM attribute `extends` to the HTML element. For example:

```html
<babylon extends="minimal" model="https://playground.babylonjs.com/scenes/Rabbit.babylon"></babylon>
```

To understand the default configuration in more detail and learn how to recreate it using HTML see [Recreating the default configuration for the viewer](/toolsAndResources/babylonViewer/defaultViewerConfig) 

## Extending and changing the default configurations

The default configuration types can be overwritten using many methods described below. As the configuration object never contains Array, any attribute in it can be references using a string, and can therefore be overwritten. 

The order in which the configuration is loaded is :

1. The DOM configuration
1. (optional) The extra configuration file provided using the `configuration` keyword.
1. The `extends` configuration (for example `default` or `minimal`). This is being merged with the DOM configuration, giving the DOM configuration priority

To explain this further, let's look at a simple example:

```html
<babylon extends="minimal" scene.debug="true" engine.antialiasing="false" model="https://playground.babylonjs.com/scenes/Rabbit.babylon" configuration="http://example.com/viewerConfig.json"></babylon>
```

At first, the configuration of the DOM element will be read (represented as JSON for better understanding):

```javascript
{
    extends: "minimal",
    scene: {
        debug: true
    },
    engine: {
        antialiasing: false
    },
    model: "https://playground.babylonjs.com/scenes/Rabbit.babylon",
    configuration="http://example.com/viewerConfig.json"
}
```

Next, the `minimal`configuration will be loaded and appended to the existing configuration:

```javascript
{
    extends: "minimal",
    scene: {
        debug: true
    },
    engine: {
        antialiasing: false 
    },
    model: "https://playground.babylonjs.com/scenes/Rabbit.babylon",
    configuration="http://example.com/viewerConfig.json",
    version: "0.1",
    templates: {
        main: {
            html: "<div>.........</div>"
        },
        loadingScreen: {
            html: "<div>.........</div>",
            params: {
                backgroundColor: "#000000",
                loadingImage: "data:image/png;base64....."
            }
        },
        viewer: {
            html: "<div>.........</div>",
        },
        overlay: {
            html: "<div>.........</div>",
            params: {
                closeImage: "data:image/png;base64.....",
                closeText: 'Close'
            }
        },
        error: {
            html: "<div>.........</div>"
        }

    },
}
```

Notice that thou the minimal configuration define antialiasing to be `true`, the configuration provided by the user will be used. It is only extending and not overwriting.

Next, the configuration object will be inspected. If it contains a configuration URL, it will be loaded. In our case, the (non-existing) [http://example.com/viewerConfig.json](http://example.com/viewerConfig.json) will be downloaded and appended to the configuration already provided. Notice that this configuration object will overwrite definitions in the current configuration object. So if the JSON file looks like this:

```json
{
    "scene": {
        "debug": false
    }
}
```

The `scene.debug` in the configuration object that will be provided to the viewer will have debug set to false.

### Configuring using the DOM element

The viewer will read each attribute on the `<babylon>` DOM element(s) provided and will create a JSON element out of them.
So, if the DOM element looks like this:

```html
<babylon scene.debug="true" camera.behaviors.auto-rotate="0" model.url="https://playground.babylonjs.com/scenes/Rabbit.babylon" configuration="http://example.com/viewerConfig.json"></babylon>
```

The configuration will look like this:

```javascript
{
    scene: {
        debug: true
    },
    camera: {
        behaviors: {
            autoRotate: 0
        }
    },
    model: {
        url: "https://playground.babylonjs.com/scenes/Rabbit.babylon"
    }
}
```

A few things to notice:

#### camel-case vs. kebab case

DOM attributes are usually written in kebab-case ('looks-like-this`), mainly since some browsers convert attributes to lower-case. Those attributes will be automatically converted to camelCase ('looksLikeThis').

#### Value conversions

Attribute-values are converted to their corresponding types in JSON. If the value can be converted to a number ("1" for example), it will be converted to a number. If the value is "true" or "false", it will be converted to a boolean.

#### Nested attributes

Nested attributes can be separated using ".". So `scene.debug="true"` will nest `debug` into `scene` and set its value to true.

#### Unidirectional definition

The DOM is read once, and is not being continuously processed, Changing a value of an attribute after the viewer was initialized will not influence the viewer.

### Configuring using nested DOM elements

Another way of using the DOM to configure the viewer is to use nested DOM elements inside the main element. A basic example:

```html
<babylon extends="minimal">
    <model url="https://ugcorigin.s-microsoft.com/12/2e77b8e3-0000-0000-7a48-6505db2f0ef9/952/1508427934473.gltf">
    </model>
    <camera>
        <behaviors>
            <auto-rotate type="0"></auto-rotate>
        </behaviors>
    </camera>
    <lights>
        <light1 type="1" shadow-enabled="true">
        </light1>
    </lights>
</babylon>
```

This is more human-readable and is easier for web-developers to understand. This example is technically the same as:

```html
<babylon extends="minimal" model.url="https://ugcorigin.s-microsoft.com/12/2e77b8e3-0000-0000-7a48-6505db2f0ef9/952/1508427934473.gltf" camera.behaviors.auto-rotate.type="0" lights.light1.type="2" lights.light1.shadow-enabled="true"></babylon>
```

A few things to consider:

#### Extending and using the DOM element configuration

Everything written regarding the DOM element configuration is extended here. The values are converted, kebab-case should be used, and nested attributes will still be correctly read. For example, this is also a valid configuration (notice the `<camera>` HTML tag):

```html
<babylon extends="minimal">
    <model url="https://ugcorigin.s-microsoft.com/12/2e77b8e3-0000-0000-7a48-6505db2f0ef9/952/1508427934473.gltf">
    </model>
    <camera behaviors.auto-rotate.type="0">
    </camera>
    <lights>
        <light1 type="1" shadow-enabled="true">
        </light1>
    </lights>
</babylon>
```

And it is the same as the example above.

### Configuring using external JSON

As previously explained, the viewer configuration has a `configuration` member, that can contain an external JSON file that will be loaded and merged with the selected configuration.

If the following is defined:

```html
<babylon scene.debug="true" camera.behaviors.auto-rotate="0" model.url="https://playground.babylonjs.com/scenes/Rabbit.babylon" configuration="http://example.com/viewerConfig.json"></babylon>
```

the file `http://example.com/viewerConfig.json` will be loaded into the configuration object. This is a great way of creating a general / global configuration  for a website, while providing the details model data using HTML.

### Configuring using JavaScript

Further discussed in [Advanced usage](//doc.babylonjs.com/toolsAndResources/Advanced_usage), JavaScript can be used to initialize a viewer. When initializing a viewer using JavaScript, you can provide the initial configuration that will be used with this viewer:

```javascript

let domElement = document.getElementById('my-amazing-element');

let viewer = new BabylonViewer.DefaultViewer(domElement, {
    scene: {
        debug: true
    },
    camera: {
        behaviors: {
            autoRotate: 0
        }
    },
    model: {
        url: "https://playground.babylonjs.com/scenes/Rabbit.babylon"
    }
});

```

In this case, the HTML attributes will be ignored(!) and the DOM element will simply serve as the container of the Babylon scene.

### Registering your own configuration parser using the mapper manager

As shown, the Babylon viewer has 3 types of configuration parsers for you to choose from - "html", "dom", and "json". Those mappers are registered in the mapper manager, exposed in the BabylonViewer namespace.

The mapper manager can be extended. If you have your own type of configuration, or want to support further file types, you can create your own mapper and register it with the mapper. Later on, you can define the type of mapper the configuration will be read with, using the configuration.type variable in the viewer's configuration. 

Let's build a pseudo YAML loader and register it:

First, we implement the IMapper interface:

```javascript

// In TypeScript
class YAMLMapper implements IMapper {
    map(yaml: YAMLThing): ViewerConfiguration {
        return this.convertToYaml(yaml);
    }

    // so, this needs to be actually implemented...
    convertYamlToJson(yaml) {}
}

// in JavaScript

let yamlMapper = {
    map : function(yaml) {
        return yaml.toJson();
    }
}
```

Afterwards, we need to register it with the mapperManager:

```javascript
BabylonViewer.mapperManager.registerMapper('yaml', yamlMapper);
```

And finally, we need to tell the manager which mapper to use:

```html
<babylon extends="minimal" scene.debug="true" engine.antialiasing="false" model="https://playground.babylonjs.com/scenes/Rabbit.babylon" configuration.url="http://example.com/viewerConfig.yaml" configuration.mapper="yaml"></babylon>
```

### Using your own payload without downloading a file

The configuration attribute of your html element can contain a url as previously shown, or a payload of type any - in case you already have the configuration in your own format loaded in the page.

This is useful if you want to be responsible to the download or if the data is simply already provided. As best practice you will need to:

1. Create your own mapper
1. Register the mapper
1. Set the payload and mapper

For example, let's say we have a predefined JSON configuration loaded in the page already. We could load it this way (notice configuration.payload):

```html
<babylon configuration.payload='{"scene": {"debug": true}}' model.title="Damaged Helmet" model.subtitle="BabylonJS" model.thumbnail="https://www.babylonjs.com/img/favicon/apple-icon-144x144.png"
            model.url="https://www.babylonjs.com/Assets/DamagedHelmet/glTF/DamagedHelmet.gltf" camera.behaviors.auto-rotate="0"
            templates.nav-bar.params.disable-on-fullscreen="true"></babylon>
```

This will work as the default mapper converts a JSON string to a configuration object. If you input a different style of configuration, you could set the mapper's type (after registering it):

```html
<babylon configuration.payload="scene.debug=true&engine.antialiasing=true" configuration.mapper="form" model.title="Damaged Helmet" model.subtitle="BabylonJS" model.thumbnail="https://www.babylonjs.com/img/favicon/apple-icon-144x144.png"
            model.url="https://www.babylonjs.com/Assets/DamagedHelmet/glTF/DamagedHelmet.gltf" camera.behaviors.auto-rotate="0"
            templates.nav-bar.params.disable-on-fullscreen="true"></babylon>
```

This will use the preregistered "form" mapper (which doesn't exist in reality - you should implement it) to read the payload and adjust the configuration.

## The full configuration interface

Please check the configuration on github, as it is constantly updated:
[https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/configuration.ts](https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/configuration/configuration.ts)