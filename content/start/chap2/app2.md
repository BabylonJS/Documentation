# Getting Started - Working with Models
## Vary Web App Layout
Whilst you probably want your game or app to take up most of the page you might want some space for instructions as an example. Just place your *&lt;canvas&gt;* element in a *&lt;div&gt;* and arrange the elements as you need.

```html
<div id = "holder">
        <canvas id="renderCanvas" touch-action="none"></canvas> <!-- touch-action="none" for best results from PEP -->
</div>
<div id = "instructions">
    <br>
    <h2>Instructions</h2>
    <br>
    Instructions Instructions Instructions Instructions Instructions 
    Instructions Instructions Instructions Instructions Instructions 
</div>
```
with additional styles
```html
<style>
    #holder {
        width: 80%;
        height: 100%;
        float: left;
    }

    #instructions {
        width: 20%;
        height: 100%;
        float: left;
        background-color: grey;
    }
</style>
```

[Example App and Instructions](/webpages/app3.html) importing the model village

You could of course still build your scene completely from code

[Example App and Instructions](/webpages/app4.html) building the village from code

During the next stage in developing the world we are going to add movement by animating a very basic car. A car needs wheels that turn independently of the car body. To see how this is achieved we need to look at parenting the wheels to the body. 