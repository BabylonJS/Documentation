# Getting Started - Working With Code
## Day to Night
One useful way to add a graphical user interface to a scene is the Babylon.js GUI. When working in virtual reality this GUI is necessary as it is designed to be within and part of the Babylon.js scene canvas rather than the HTML document. This GUI is pre-loaded into the playground but is an additional script to load in your own projects with

```html
<script>https://cdn.babylonjs.com/gui/babylon.gui.min.js</script>
```
For the village world we will a GUI stack panel to contain two GUI elements. A text block for the heading and a slider bar to change day to night and back by setting the intensity of the light.

The first thing we need to do is create a special texture, called an *AdvancedDynamicTexture*, on which the GUI elements will be drawn.

```javascript
const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
```

For our world the GUI will be one based on the full screen.

We create the container panel to hold the other elements in the bottom right corner of the screen. Then add it to the advanced dynamic texture.

```javascript
const panel = new BABYLON.GUI.StackPanel();
panel.width = "220px";
panel.top = "-50px";
panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
adt.addControl(panel);
```

Next create the text block and add it to the panel
```javascript
const header = new BABYLON.GUI.TextBlock();
header.text = "Night to Day";
header.height = "30px";
header.color = "white";
panel.addControl(header); 
```

We create and add the slider to the panel.
```javascript
const slider = new BABYLON.GUI.Slider();
slider.minimum = 0;
slider.maximum = 1;
slider.borderColor = "black";
slider.color = "#AAAAAA";
slider.background = "#white";
slider.value = 1;
slider.height = "20px";
slider.width = "200px";
panel.addControl(slider);
```

We need to add an observable event to the slider in order to change the light intensity.
```javascript
slider.onValueChangedObservable.add((value) => {
    if (light) {
        light.intensity = value;
    }
});
```

Now we can control the light in our village world.
https://www.babylonjs-playground.com/#KBS9I5#95

Where there is light there are shadows. In Babylon.js this is only true when you make it true.