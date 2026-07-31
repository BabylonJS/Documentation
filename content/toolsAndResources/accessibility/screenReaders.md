---
title: Accessibility Scene Tree for Screen Readers
image:
description: Babylon.js extension that renders a scene tree to be read by screen readers
keywords: babylon.js, tools, resources, accessibility, a11y
further-reading:
video-overview:
video-content:
---

## What is a Screen Reader?

A [screen reader](https://en.wikipedia.org/wiki/Screen_reader) is an assistive technology that helps blind or low-vision people interact with digital content. Users with blindness or low vision cannot rely entirely on visual interfaces. Depending on the degree of visual impairment, some do not use a monitor or mouse when using computers. These users rely on screen-reading software to translate what is displayed on the screen into speech or braille output. They use a keyboard to tell the screen reader what to read and to interact with the computer. Here is an example video showing a user using a screen reader: [Screen Reader Demo - YouTube](https://www.youtube.com/watch?v=q_ATY9gimOM&ab_channel=SLCCUniversalAccess).

Users can choose from different screen reader applications, including OS built-in screen readers such as Windows "Narrator", macOS and iOS "VoiceOver", Android "TalkBack", and third-party screen readers such as JAWS and NVDA.

Nowadays, 2D pages on the web generally provide good accessibility support for screen reader users because screen readers can understand different HTML elements. However, 3D applications such as WebGL applications do not. This is because objects in WebGL applications are rendered inside a `<canvas>` element. When a screen reader reads the page, it will only read "_Image_" and cannot interpret any objects inside the scene. If we do not handle this correctly, blind or low-vision users will have difficulty using the application.

The **Accessibility Package** provides a way to create HTML twin elements for objects in the scene that should be accessible. Here is an example of a simple scene with three boxes using the Accessibility Package. If you turn on a screen reader to read the page, it will say "A big box in the middle of the scene. A small box on the left of the big box. A small box on the right of the big box".

<Playground id="#C9GZTF#11" title="Boxes with accessible description" description="Simple example of boxes with accessible descriptions." />

## How to Use the Accessibility Package to Support Screen Readers and Keyboard Navigation

### IAccessibilityTag

Blind or low-vision users listen to content and use a keyboard to interact, so we need to add descriptions to Babylon.js content that can be read by a screen reader. You can add descriptions to your Nodes or Controls that should be accessible by using **IAccessibilityTag**.

```javascript
let egg = BABYLON.MeshBuilder.CreateSphere("Egg", { diameterX: 0.62, diameterY: 0.8, diameterZ: 0.6 }, scene);
egg.accessibilityTag = {
  description: "An easter egg",
};
```

Not all content in the scene should be accessible. For example, decorative trees or the background image on a UI panel do not need to be exposed. Only add IAccessibilityTag to the content that is important to the user experience.

By default, all Controls (GUI) are considered "important" for accessibility and will have HTML twins with their own information, such as the text shown on a button, even if you have not assigned an IAccessibilityTag. However, if you define an IAccessibilityTag, it can override the default metadata. For example, assigning `IAccessibilityTag.description` will override the text shown on a button. By default, Node-type objects are not considered "important" unless you assign an IAccessibilityTag to them.

### HTMLTwinRenderer.Render()

The accessibility package generates HTML elements for your scene based on the metadata (IAccessibilityTag) you added to your scene content. The screen reader can then read those HTML elements. To generate them for your scene:

```javascript
ACCESSIBILITY.HTMLTwinRenderer.Render(scene);
```

This will generate a `<div id="accessibility-host">` HTML element right after the Babylon.js scene's canvas element. Inside this div element, the renderer generates HTML twin elements for each accessible piece of content in the scene. These HTML twin elements are internally connected to Babylon.js objects, so screen reader users can also interact with the Babylon.js objects through their HTML twins.

### Interaction

Some content in your scene might be interactive (for example, clickable). For Node-type objects, if you use Babylon.js's [ActionManager](https://doc.babylonjs.com/divingDeeper/events/actions) to define the interaction, the Accessibility package can automatically detect it and apply it to the generated HTML twin elements. This lets the user use the keyboard to trigger events such as click or right-click on the HTML twin elements, which in turn triggers the corresponding action on the Babylon.js objects. Only ACTION_OnPickTrigger, ACTION_OnLeftPickTrigger, and ACTION_OnRightPickTrigger are supported. For Control-type objects, if you define an observer for onPointerClickObservable, the Accessibility package can also automatically detect it and apply it to the generated HTML twin element.

If you want to customize the interaction, use the eventHandler field of IAccessibilityTag:

```javascript
let egg = BABYLON.MeshBuilder.CreateSphere("Egg", { diameterX: 0.62, diameterY: 0.8, diameterZ: 0.6 }, scene);
egg.accessibilityTag = {
  description: "An easter egg",
  eventHandler: {
    onclick: yourFunction,
  },
};
```

<Playground id="#C9GZTF#12" title="Custom event handling" description="Accessible scene with custom event handling." />

### When Are HTML Twins Updated?

Your scene might not be static, and you may want to update HTML twins when it changes. The HTML twins will automatically update when:

- A Node (Mesh or TransformNode) is added/removed in a scene;
- A Node (Mesh or TransformNode)'s enabled status is changed;
- A Control is added/removed from a Container;
- A Control's isVisible status is changed;
- A Node or Control's IAccessibilityTag is assigned or re-assigned;

<Playground id="#C9GZTF#13" title="Update Accessibility Tree" description="Demo scene that shows situations where the accessibility tree is automatically updated" />

### Customize HTML Twin with ARIA Attributes

If you are experienced with web accessibility and know what you are doing, you can use IAccessibilityTag.role and IAccessibilityTag.aria to assign different [Role and ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) to this object's HTML twin.

```javascript
yourObject.accessibilityTag = {
    description: "An demo customized progressbar",
    role: "progressbar",
    aria: {
      "aria-valuemin": "0",
      "aria-valuemax": "100"
      "aria-valuenow": "0"
    }
}
```

Note that using ARIA attributes incorrectly can introduce errors in your webpage. While ARIA is designed to make web pages more accessible, if used incorrectly, it can do more harm than good. If you choose to use ARIA, you are responsible for mimicking the equivalent browser behavior in script.
