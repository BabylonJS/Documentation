---
title: Babylon.js Viewer Templating System
image: 
description: Using and extending the viewer's simple integrated templating system.
keywords: extensions, babylon.js, viewer, template, templating system, templating
further-reading:
    - title: Babylon.js Viewer
      url: /extensions/The_Babylon_Viewer
    - title: Configuring the viewer
      url: /extensions/Configuring_the_viewer
    - title: Recreating the default configuration for the viewer
      url: /extensions/Recreating_the_default_configuration
    - title: Advanced usage
      url: /extensions/Advanced_usage
    - title: Babylon.js viewer examples
      url: /extensions/Viewer_examples
video-overview:
video-content:
---


The viewer has a simple integrated templating system for you to use and extend. Using the templating system you can decide how the viewer components, such as the navbar, the error screen, help screen and so on, look like.

The templating system is using [Handlebars.js](https://handlebarsjs.com/) to parse the HTML. We recommend understanding the basic concepts of Handelbars before making major changes to the HTML templates.

## Basics of the templating engine

### Configuration

As with the general configuration, the template configuration is based on a TypeScript interface for ease of usage. These are the interfaces:

```javascript
export interface ITemplateConfiguration {
    location?: string; // #template-id OR http://example.com/loading.html
    html?: string; // raw html string
    id?: string;
    params?: { [key: string]: string | number | boolean | object };
    events?: {
        // pointer events
        pointerdown?: boolean | { [id: string]: boolean },
        pointerup?: boolean | { [id: string]: boolean },
        pointermove?: boolean | { [id: string]: boolean },
        pointerover?: boolean | { [id: string]: boolean },
        pointerout?: boolean | { [id: string]: boolean },
        pointerenter?: boolean | { [id: string]: boolean },
        pointerleave?: boolean | { [id: string]: boolean },
        pointercancel?: boolean | { [id: string]: boolean },
        //click, just in case
        click?: boolean | { [id: string]: boolean },
        // drag and drop
        dragstart?: boolean | { [id: string]: boolean },
        drop?: boolean | { [id: string]: boolean },

        [key: string]: boolean | { [id: string]: boolean } | undefined, // allow injecting further events
    };
}
```

### Location vs. HTML

There are two ways of defining where the template is found. The location and the html parameters. One of them will have to be defined. if both are defined, the 'html' parameter will be used.

The location parameter define a URL where the HTML can be found, or an ID of a script tag with the type "text/x-babylon-viewer-template". For example, the HTML page can have somewhere in it the following HTML element:

```html
<script id="loading-screen" type="text/x-babylon-viewer-template">
    <img class="loading-image" src="{{loadingImage}}">
</script>
```

The configuration for using this would be:

```javascript
    ...,
    templates: {
        main: {
            html: "<viewer></viewer><loading-screen></loading-screen>"
        },
        loadingScreen: {
            location: '#loading-screen',
            params: {
                loadingImage: "data:image/png;base64,...."
            }
        },
        viewer: {
            html: '<canvas class="babylonjs-canvas"></canvas>',
        }
    }
```

The 'html' parameter simply contains the raw HTML of the template. For example:

```javascript
    ...,
    templates: {
        viewer: {
            html: '<canvas class="babylonjs-canvas"></canvas>',
        }
    }
```

When the template is a simple HTML file and no other configuration is needed, the template configuration can be a single string of the URL or #id where the template can be found.

So this:

```javascript
    .....,
    templates: {
        main: {
            location: "#main-template"
        }
    },
    ....
```

is equal to this:

```javascript
    .....,
    templates: {
        main: "#main-template"
    },
    ....
```

### Simple walkthrough

The templating engine will load all defined templates in the configuration and parse them. As part of the parsing process, it will look for tags that are defined in the template configuration and will inject them in the right place. The template that will be injected to the main component (the `<babylon>` HTML tag per default) is always called 'main'.

For example, if the templating configuration looks like this:

```javascript
    templates: {
        main: {
            html: "<viewer></viewer><loading-screen></loading-screen>"
        },
        loadingScreen: {
            html: '<img class="loading-image" src="{{loadingImage}}">',
            params: {
                loadingImage: "data:image/png;base64,...."
            }
        },
        viewer: {
            html: '<canvas class="babylonjs-canvas"></canvas>',
        }
    }
```

the final `<babylon>` tag will look like this:

```html
<babylon .....>
    <viewer>
        <canvas class="babylonjs-canvas"></canvas>
    </viewer>
    <loading-screen>
        <img class="loading-image" src="data:image/png;base64,...." />
    </loading-screen>
</babylon>
```

_Note that the html tag names are in kebab-case. The configuration (when in JSON format) uses camelCase_.

### Handlebasrs expressions

Going back to the configuration from the last section, you can see that the HTML template of the loading screen is:

```html
<img class="loading-image" src="{{loadingImage}}" />
```

Anything inside a `{{` and `}}` is considered to be a handlebars expression. This parameter can be defiend in the configuration file, as also seen in the last section:

```javascript
    templates: {
        ...,
        loadingScreen: {
            html: '<img class="loading-image" src="{{loadingImage}}">',
            params: {
                loadingImage: "data:image/png;base64,...."
            }
        }
    }
```

Using this method you can easily achieve internationalization, injecting the parameters using the configuration and not embedding them into the HTML.

### Event binding

Any template can have any native JavaScript event registered to it or to one of its children. The callback will be bound to the selected element, and will trigger a callback in the template, which can be used when registering the onEventTriggered observer of the template. But first, let's see how to simply bind events:

Let'S take a look at the following configuration (taken from the default configuration with a bit of changes):

```javascript
        navBar: {
            html: '<div class="button-container flex-container">  <div id="fullscreen-button" class="button"> <span>Full screen</span>> </div> </div>',
            events: {
                pointerdown: { 'fullscreen-button': true, 'some-other-id': true },
                drop: true
            }
        },
```

This events configuration will register two events:

1. pointerdown event that will be bound to the inner `#fullscreen-button` div
1. drop event that will be bound to the navbar element itself.

_If you are wondering why the event definition ({ 'fullscreen-button': true, 'some-other-id': true }) is a map and not an array of IDs - the template can also be configured using HTML, and HTML DOM elements don't support Arrays. This way the HTML can override the event by setting it to "false"._

The event callback will deliver the following object:

```javascript
export interface EventCallback {
    event: Event; // the native browser event
    template: Template; // the template on which is was executed
    selector: string; // the selector used (for example #fullscreen-button)
    payload?: any; // any extra payload. For future development, currently not being used.
}
```

To register for event listening, load the template using the template manager and add an observer to the `onEventTriggered` observable:

```javascript
// viewer is a viewer instance. See Advanced usage (//doc.babylonjs.com/extensions/Advanced_usage) for further details on how to get it.
let navbar = viewer.templateManager.getTemplate("navBar");
// let's be safe!
if (!navbar) return;

// register a new observer
navbar.onEventTriggered.add((data) => {
    switch (data.event.type) {
        case "pointerdown":
            switch (data.selector) {
                case "#fullscreen-button":
                    // let's go full screen!!
                    break;
                case "#some-other-id":
                    // just do something else please
                    break;
            }
            break;
        case "drop":
            // What shall we do with the dropped data?
            break;
    }
});
```

## The template manager

Any template-enabled viewer (the default viewer, for example) has its own template manager, which is in charge of loading and parsing the templates.

The template manager is a public member of the viewer and can be used to retrieve already-parsed templates:

```javascript
// not a part of this section, let's assume the viewer is being retrieved
let viewer = getViewer();

// We have previously defined a "canvas" element in the configuration. We can now retrieve it!
let canvasContainer = viewer.templateManager.getTemplate("canvasContainer");
```

### The template object

Any configured template is creating a new instance of the [Template class](https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/src/templateManager.ts#L148).

Here are the public variables we can access:

```javascript
public onInit: Observable<Template>;
public onLoaded: Observable<Template>;
public onAppended: Observable<Template>;
public onStateChange: Observable<Template>;
public onEventTriggered: Observable<EventCallback>;

public isLoaded: boolean; // is the template fully loaded

public parent: HTMLElement; // the HTML container of this template. In this case, the <canvas-container> element.
```

The Template class has also a few promise-based help functions for common tasks:

```javascript
public show(visibilityFunction?: (template: Template) => Promise<Template>): Promise<Template>;
public hide(visibilityFunction?: (template: Template) => Promise<Template>): Promise<Template>;
```

If calling those functions without any parameters, the `display`of this template will be set to `flex` or `none` respectively.

To define your own show or hide functions, simply provide the visibilityFuntion as the first parameter. The following is a real example from the default viewer:

```javascript
template.hide((template) => {
    // set the opacity to '0'. Opacity transition is set using CSS.
    template.parent.style.opacity = "0";
    // define a function for when the transition has ended:
    let onTransitionEnd = () => {
        template.parent.removeEventListener("transitionend", onTransitionEnd);
        // set display none when opacity is '0'
        template.parent.style.display = "none";
    };
    // add the transitionend event listener
    template.parent.addEventListener("transitionend", onTransitionEnd);
    // return immediately, don't wait for the transition to end
    return Promise.resolve(template);
});
```

## Templates of the default viewer

The default viewer comes with predefined templates that can be simply changed if needed.

The list of templates that are delivered:

-   main - the main template (must always be present)
-   viewer - containing the canvas
-   loading screen - a simple loading screen template
-   nav-bar - the bottom navigation bar
-   overlay - a container for overlays, such as error or help
-   error - an error screen
-   help - a help screen
-   share - a share screen

All templates can be found at the assets directory of the viewer - [https://github.com/BabylonJS/Babylon.js/tree/master/Viewer/assets/templates/default](https://github.com/BabylonJS/Babylon.js/tree/master/Viewer/assets/templates/default). The templates include CSS internally, and are self-contained.

### Changing an existing template:

If you want to change one of the templates, simply create a new HTML structure and set it in the viewer configuration. For example, if we want to change the loading screen so it will not show an image at all:

The new loadingScreen HTML injected in the page as `<script>` tag:

```html
<script id="loading-screen" type="text/x-babylon-viewer-template">
      <style>
        loading-screen {
            position: absolute;
            z-index: 100;
            opacity: 1;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            -webkit-transition: opacity 2s ease;
            -moz-transition: opacity 2s ease;
            transition: opacity 2s ease;
        }
    </style>

    <span> LOADING... </span>
</script>
```

This can be added to the configuration of the viewer element:

```html
<babylon templates.loading-screen.location="#loading-screen" templates.loading-screen.html="" model="...."></babylon>
```

### Extending an existing template

The nav bar, for example, can be extended to hold further buttons. The navbar default configuration is:

```javascript
navBar: {
    html: require("../../../assets/templates/default/navbar.html"),
    params: {
        buttons: [
            {
                id: 'fullscreen-button',
                altText: "Fullscreen",
                image: require('../../../assets/img/fullscreen.png')
            }
        ],
        visibilityTimeout: 2000
    },
    events: {
        pointerdown: { 'fullscreen-button': true }
    }
}
```

If you want, for example, to change the visibilityTimeout to 1 second, set it using your viewer configuration:

```html
<babylon templates.nav-bar.params.visibility-timeout="1000" model="...."></babylon>
```

## Creating your own templates

If you don't want to use the default templates and want to completely create your own, here are a few important notes.

### The main template

You should always have a template named "main", which will be the starting point of your template. Apart from "main", it is up to you to decide how to organize your templates. Main can technically contain everything, there is no actual need to create any other templates, unless you want to internally overwrite certain templates.

The main template can technically be a single canvas element, and that's about it.

### You need a canvas

Well, a canvas is needed, obviously. **and only one!** To avoid creating further unneeded configuration parameters, the first canvas found inside the parsed main template will be used as the canvas for Babylon.

## If help is needed

Look at the code or contact us, we will be more than happy to help!
