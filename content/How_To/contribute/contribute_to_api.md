---
title: Contribute To The API
image: 
description: Learn how to contribute to the Babylon.js API.
keywords: diving deeper, contribution, contribute, open-source, oss, API, develope
further-reading:
video-overview:
video-content:
---

## Need for Contribution

Many people have asked for the API documentation to be improved. This is a major task with lots of files needing comments added. Comments are very useful for future development and maintenance of the code but now they are even more useful since in the correct format they can be read by “TYPEDOC” and produce the API documentation for the classes, properties and methods used by Babylon.js. The core team has worked to make this happen as you can see by the new API documentation. Volunteers are needed to add comments so even if you only have time to do a couple of files then please do volunteer.

## How to Contribute

You need to add appropriate comments according to the formats given below. Check the comments for errors and submit a PR when everything is validated.

1. Fork and clone [Babylon.js](https://github.com/BabylonJS/Babylon.js) from github;
2. In the folder **Tools/Gulp** install npm with `npm install` and then gulp with `npm install -g gulp@4.0.0`;
3. Edit files from within the **src** folder by adding comments;
4. Execute `gulp typedoc-check` to validate the comments;
5. Do NOT COMMIT any changes to the file **babylon.d.ts**. Use `discard` to remove changes;
6. When validated submit a PR.

Whilst the above steps will validate the comments it will not allow you to see the results. Since you do not want to affect anything within your local clone of Babylon.js you will need to create a new folder **outside** the Babylon.js folder. You can then follow these steps to produce viewable results of your comments.

After editing and validating files within the **src** folder and before the PR:

7. In the new folder install typedoc using `$ npm install typedoc`;
8. Copy the **src** folder into the new folder;
9. Copy the **tsconfig.json** file from the **src** folder into the new folder;
10. Create a folder called documents in the new folder;
11. In the new folder use `$ typedoc --out documents src` to create the documents from the src
12. In the **documents** folder find and open index.html to check results. Note that these will not appear exactly the same as the Babylon.js API documentation web pages but close enough to check.

## Format of Comments

Below are descriptions of the format of comment for the various code entities with examples.

Comments go immediately in front of the entity and have the form of plain comments

```
/**
* comment
* more comments
*/
```

or comments plus key @words

| @word    | followed by                                                   |
| -------- | ------------------------------------------------------------- |
| @param   | parameter name then parameter description                     |
| @returns | description of what a function returns                        |
| @see     | URL when it is useful to link to another site or page add one |
| @ignore  | reason why it is ignored                                      |

## Enum

**Defines a set of named constants**

Plain comments to describe the purpose of the ENUM and the constants it defines

```javascript
/**
* Defines the list of states available for a task inside an AssetsManager
*/
export enum AssetTaskState {
    /**
     * Initialization
     */
    INIT,
    /**
     * Running
     */
    RUNNING,
    /**
     * Done
     */
    DONE,
    /**
     * Error
     */
    ERROR
}
```

```javascript
/**
* Specifies the level of max blur that should be applied when using the depth of field effect
*/
export enum DepthOfFieldEffectBlurLevel {
    /**
     * Subtle blur
     */
    Low,
    /**
     * Medium blur
     */
    Medium,
    /**
     * Large blur
     */
    High
};
```

## Class

**Template containing the constructor along with the public, private and protected properties and methods defining an object**

A defines comment to describe the purpose of the CLASS

```javascript
/**
 * Defines a HemisphericLight object that simulates the ambient environment light
 * so the passed direction is the light reflection direction, not the incoming direction
 */
export class HemisphericLight extends Light {
  //All the parts defining the class in here
}
```

```javascript
/**
 * Define an abstract asset task used with a {BABYLON.AssetsManager} class to load assets into a scene
 */
 export abstract class AbstractAssetTask {
     //All the parts defining the class in here
}
```

## Constructor

**This creates an instance of the class**

# No Parameters

A creates comment to describe the CONSTRUCTOR

```javascript
export class MapperManager {
  //class properties

  /**
   * Creates a new MapperManager object to manage the different implemented mappers
   */
  constructor() {
    this._mappers = {
      html: new HTMLMapper(),
      json: new JSONMapper(),
      dom: new DOMMapper()
    };
  }
}
```

## With Parameters

A creates comment to describe the CONSTRUCTOR and use @param for each parameter. The first item after @param must be the parameter name then a further comment. In addition should any members of the constructor be declared as public the comment should be repeated before the member in the parameters list.

### No Public Parameters

Create and @param comments for constructor.

```javascript
/**
 * Create a new Model loader
 * @param _viewer the viewer using this model loader
 */
constructor(private _viewer: AbstractViewer) {
    this._loaders = [];
    this._loadId = 0;
}
```

```javascript
/**
 * Creates a Solid Particle object
 * Don't create particles manually, use instead the Solid Particle System internal tools like _addParticle()
 * @param particleIndex is the particle index in the Solid Particle System pool. It's also the particle identifier
 * @param positionIndex is the starting index of the particle vertices in the SPS "positions" array
 * @param indiceIndex is the starting index of the particle indices in the SPS "indices" array
 * @param model is a reference to the model shape on what the particle is designed.
 * @param shapeId is the model shape identifier in the SPS
 * @param idxInShape is the index of the particle in the current model (ex: the 10th box of addShape(box, 30))
 * @param modelBoundingInfo is the reference to the model BoundingInfo used for intersection computations
 */
constructor(particleIndex: number, positionIndex: number, indiceIndex: number, model: Nullable<ModelShape>, shapeId: number, idxInShape: number, sps: SolidParticleSystem, modelBoundingInfo: Nullable<BoundingInfo> = null) {
    this.idx = particleIndex;
    this._pos = positionIndex;
    this._ind = indiceIndex;
    this._model = <ModelShape>model;
    this.shapeId = shapeId;
    this.idxInShape = idxInShape;
    this._sps = sps;
    if (modelBoundingInfo) {
        this._modelBoundingInfo = modelBoundingInfo;
        this._boundingInfo = new BoundingInfo(modelBoundingInfo.minimum, modelBoundingInfo.maximum);
    }
}
```

### With Public Parameters

Create and @param comments for constructor and copied comments before any public parameter in list

```javascript
/**
 * Creates a new Action
 * @param triggerOptions the trigger, with or without parameters, for the action
 * @param condition an optional determinant of action
 */
constructor(

    /**
     * The trigger, with or without parameters, for the action
     */
    public triggerOptions: any,

    condition?: Condition) {

    if (triggerOptions.parameter) {
                this.trigger = triggerOptions.trigger;
                this._triggerParameter = triggerOptions.parameter;
            } else {
                this.trigger = triggerOptions;
            }

            this._nextActiveAction = this;
            this._condition = condition;
}
```

```javascript
/**
 * Creates a new instance ConeParticleEmitter
 * @param radius the radius of the emission cone (1 by default)
 * @param angles the cone base angle (PI by default)
 * @param directionRandomizer defines how much to randomize the particle direction [0-1]
 */
constructor(
    radius = 1,
    /**
     * The cone base angle (PI by default)
     */
    public angle = Math.PI,

    /**
     * Defines how much to randomize the particle direction [0-1]
     */
    public directionRandomizer = 0) {

    this.radius = radius;
}
```

## Property of Class, Constructor, Function

### Public with public variable

Plain comments to describe the PROPERTY

```javascript
/**
 * The groundColor is the light in the opposite direction to the one specified during creation
 * You can think of the diffuse and specular light as coming from the centre of the object in the given direction and the groundColor light in the opposite direction
 */
public groundColor = new Color3(0.0, 0.0, 0.0);

/**
 * The light reflection direction, not the incoming direction
 */
public direction: Vector3

```

### Public with private variable

There are occasions when a variable should be public for the use of the code but private from a user. Such variables start with an underscore. Plain comments are useful for development but the variable should be ignored when building the API documentation. Hence the use of @ignore

```javascript
/**
 * Internal only - manager for action
 * @ignore
 */
public _actionManager: ActionManager;
```

### Private or Protected

These will be ignored automatically when building the API documentation and comments are optional.

```javascript
private _worldMatrix: Matrix;

protected _background: string;
```

## Method of Class, Constructor or Function

### Public with public name

### No Parameters

#### No Return Value

Plain comments to describe the FUNCTION

```javascript
/**
 * Clears the texture
 */
public clear(): void {
    var size = this.getSize();
    this._context.fillRect(0, 0, size.width, size.height);
}
```

```javascript
/**
 * Skips to next active action
 */
public skipToNextActiveAction(): void {
    if (this._nextActiveAction._child) {

if (!this._nextActiveAction._child._actionManager) {
    this._nextActiveAction._child._actionManager = this._actionManager;
}

this._nextActiveAction = this._nextActiveAction._child;
    } else {
this._nextActiveAction = this;
    }
}
```

```javascript
/**
 * Observable called when all tasks are processed
 */
public onTaskSuccessObservable = new Observable<AbstractAssetTask>();
```

#### With Return Value

Comments to describe the FUNCTION and use @returns

```javascript
/**
 * Gets the context of the canvas used by the texture
 * @returns the canvas context of the dynamic texture
 */
public getContext(): CanvasRenderingContext2D {
    return this._context;
}
```

```javascript
 /**
 * Serializes the current light into a Serialization object
 * @returns the serialized object
 */
public serialize(): any {
    var serializationObject = SerializationHelper.Serialize(this);

    // Internal working here

    return serializationObject;
}
```

```javascript
/**
 * @returns the current error object (if task is in error)
 */
public get errorObject(): { message?: string; exception?: any; } {
    return this._errorObject;
}
```

### With Parameters

#### No Return Value

Comments to describe the FUNCTION and use @param for each parameter. The first item after @param must be the parameter name then a further comment

```javascript
/**
 * Execute the current task
 * @param scene defines the scene where you want your assets to be loaded
 * @param onSuccess is a callback called when the task is successfully executed
 * @param onError is a callback called if an error occurs
 */
public run(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void) {
    this._taskState = AssetTaskState.RUNNING;
    this.runTask(scene, () => {
this.onDoneCallback(onSuccess, onError);
    }, (msg, exception) => {
this.onErrorCallback(onError, msg, exception);
    });
}
```

```javascript
/**
 * Draws text onto the texture
 * @param text defines the text to be drawn
 * @param x defines the placement of the text from the left
 * @param y defines the placement of the text from the top when invertY is true and from the bottom when false
 * @param font defines the font to be used with font-style, font-size, font-name
 * @param color defines the color used for the text
 * @param clearColor defines the color for the canvas, use null to not overwrite canvas
 * @param invertY defines the direction for the Y axis (default is true - y increases downwards)
 * @param update defines whether texture is immediately update (default is true)
 */
public drawText(text: string, x: number, y: number, font: string, color: string, clearColor: string, invertY?: boolean, update = true) {
    var size = this.getSize();
    if (clearColor) {
this._context.fillStyle = clearColor;
this._context.fillRect(0, 0, size.width, size.height);
    }

    this._context.font = font;
    if (x === null || x === undefined) {
var textSize = this._context.measureText(text);
x = (size.width - textSize.width) / 2;
    }
    if (y === null || y === undefined) {
var fontSize = parseInt((font.replace(/\D/g, '')));;
y = (size.height / 2) + (fontSize / 3.65);
    }

    this._context.fillStyle = color;
    this._context.fillText(text, x, y);

    if (update) {
this.update(invertY);
    }
}

```

#### With Return Value

Comments to describe the FUNCTION and use @param for each parameter and @returns to describe what the function returns. The first item after @param must be the parameter name then a further comment.

```javascript
/**
 * Add a TextFileAssetTask to the list of active tasks
 * @param taskName defines the name of the new task
 * @param url defines the url of the file to load
 * @returns a new TextFileAssetTask object
 */
public addTextFileTask(taskName: string, url: string): TextFileAssetTask {
var task = new TextFileAssetTask(taskName, url);
    this._tasks.push(task);

    return task;
}
```

```javascript
 /**
 * Sets the passed Effect object with the HemisphericLight normalized direction and color and the passed name (string).
 * @param effect The effect to update
 * @param lightIndex The index of the light in the effect to update
 * @returns The hemispheric light
 */
public transferToEffect(effect: Effect, lightIndex: string): HemisphericLight {
    var normalizeDirection = Vector3.Normalize(this.direction);
    this._uniformBuffer.updateFloat4("vLightData",
normalizeDirection.x,
normalizeDirection.y,
normalizeDirection.z,
0.0,
lightIndex);
    this._uniformBuffer.updateColor3("vLightGround", this.groundColor.scale(this.intensity), lightIndex);
    return this;
}
```

## Public with private name

There are occasions when a function should be public for the use of the code but private from a user. Such names start with an underscore. Plain comments are useful for development but the variable should be ignored when building the API documentation. Hence the use of @ignore

```javascript
/**
 * @ignore internal use only
 */
public _getWorldMatrix(): Matrix {
    if (!this._worldMatrix) {
this._worldMatrix = Matrix.Identity();
    }
    return this._worldMatrix;
}
```

```javascript
/**
 * @ignore internal use only
 */
public _onPointerEnter(target: Control): boolean {
    if (!super._onPointerEnter(target)) {
return false;
    }

    if (this.pointerEnterAnimation) {
this.pointerEnterAnimation();
    }

    return true;
}
```

## Private or Protected

These will be ignored automatically when building the API documentation and comments are optional.

```javascript
protected _buildUniformLayout(): void {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 3);
    this._uniformBuffer.addUniform("vLightGround", 3);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
}
```

```javascript
private follow(): void {
    if (!this.target) {
        return;
    }
    this._cartesianCoordinates.x = this.radius * Math.cos(this.alpha) * Math.cos(this.beta);
    this._cartesianCoordinates.y = this.radius * Math.sin(this.beta);
    this._cartesianCoordinates.z = this.radius * Math.sin(this.alpha) * Math.cos(this.beta);

    var targetPosition = this.target.getAbsolutePosition();
    this.position = targetPosition.add(this._cartesianCoordinates);
    this.setTarget(targetPosition);
}
```

```javascript
private _drawRoundedRect(context: CanvasRenderingContext2D, offset: number = 0): void {
    var x = this._currentMeasure.left + offset;
    var y = this._currentMeasure.top + offset;
    var width = this._currentMeasure.width - offset * 2;
    var height = this._currentMeasure.height - offset * 2;

    var radius = Math.min(height / 2 - 2, Math.min(width / 2 - 2, this._cornerRadius));

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}
```
