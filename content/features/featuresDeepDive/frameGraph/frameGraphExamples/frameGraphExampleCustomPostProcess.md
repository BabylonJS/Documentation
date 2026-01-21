---
title: Create a custom post-process
image:
description: How to use the FrameGraphCustomPostProcessTask class to easily implement a post-process task
keywords: diving deeper, frame graph, post-process, examples,
---

## Introduction

You have two options if you want to create a custom post-processes task for use in a frame graph:
* Implement a frame graph task from scratch
* Use the wrapper class [FrameGraphCustomPostProcessTask](/typedoc/classes/babylon.framegraphcustompostprocesstask) around your post-process
<br/>
If you want to go the first route, you can draw inspiration from the many existing post-processing tasks (located in https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/FrameGraph/Tasks/PostProcesses).

However, in most cases, using `FrameGraphCustomPostProcessTask` should meet your needs, and we will see how to use it in the next section.

## Using the FrameGraphCustomPostProcessTask class

Creating a post-process task using `FrameGraphCustomPostProcessTask` is very simple.

Suppose you use this code to create your post-process in the traditional way:
```typescript
const edges = new BABYLON.PostProcess('edges', 'edge', ["escale", "threshold"], [], 1, camera);

edges.onApplyObservable.add((effect) => {
    effect.setFloat("escale", 3);
    effect.setFloat("threshold", 0.1);
});
```

You can create a task that can be used in a frame graph as follows:
```typescript
const task = new BABYLON.FrameGraphCustomPostProcessTask("edgeDetection", frameGraph, {
    fragmentShader: "edge",
    uniforms: ["escale", "threshold"],
});

task.onApplyObservable.add((effect) => {
    effect.setFloat("escale", 3);
    effect.setFloat("threshold", 0.1);
});
```
Note: Both examples assume that `BABYLON.Effect.ShadersStore["edgeFragmentShader"]` contains the post-process fragment shader.

In the case of a frame graph task, you can also provide the shader code directly via the **fragmentShader** parameter, but you must then set the `useShaderStore` parameter to `false`:
```typescript
const task = new BABYLON.FrameGraphCustomPostProcessTask("edgeDetection", frameGraph, {
    fragmentShader: "/** shader code */",
    uniforms: ["escale", "threshold"],
    useShaderStore: false,
});
```

Here is a simple PG that illustrates the two code paths (update line 21 to use the standard or frame graph path):

<Playground id="#F494TC" image="/img/playgroundsAndNMEs/pg-ZC3Y12-2.png" title="Custom post-process in frame graph" description="Using a custom post-process in frame graph with FrameGraphCustomPostProcessTask" isMain={true}/>

## Making the task available in NRGE

We can go even further and make this post-process usable in the Node Render Graph Editor (NRGE)!

As a general rule, to create a block that can be used in NRGE, you need to create a class that extends `NodeRenderGraphBlock`. However, in the case of post-processes, there is already a base class called `NodeRenderGraphBasePostProcessBlock` that simplifies the implementation of a node render graph block for this case.

First, we create a small wrapper class around the edge detection post-process:
```typescript
export class EdgeDetectionPostProcessTaskWrapper {
    public readonly task: BABYLON.FrameGraphCustomPostProcessTask;
    public escale = 3;
    public threshold = 0.1;

    constructor(frameGraph: BABYLON.FrameGraph) {
        this.task = new BABYLON.FrameGraphCustomPostProcessTask("edgeDetection", frameGraph, {
            fragmentShader: EdgeDetectionFragment,
            uniforms: ["escale", "threshold"],
            useShaderStore: false,
        });

        this.task.onApplyObservable.add((effect) => {
            effect.setFloat("escale", this.escale);
            effect.setFloat("threshold", this.threshold);
        });
    }
}
```
Note: **EdgeDetectionFragment** is the shader code of the post-process.

This is the same code as above, but it allows you to easily modify the **escale** and **threshold** properties.

As for the implementation of the node graph rendering block `NodeRenderGraphEdgePostProcessBlock`, it is quite simple thanks to the use of `NodeRenderGraphBaseWithPropertiesPostProcessBlock`:
* First, we declare a private variable to contain the wrapper class and initialize it in the constructor:
```typescript
export class NodeRenderGraphEdgePostProcessBlock extends BABYLON.NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected override _frameGraphTask: BABYLON.FrameGraphCustomPostProcessTask;

    public override get task() {
        return this._frameGraphTask;
    }

    private _wrapper: EdgeDetectionPostProcessTaskWrapper;

    public constructor(name: string, frameGraph: BABYLON.FrameGraph, scene: BABYLON.Scene) {
        super(name, frameGraph, scene);

        this._finalizeInputOutputRegistering();

        this._wrapper = new EdgeDetectionPostProcessTaskWrapper(frameGraph);
        this._frameGraphTask = this._wrapper.task;
    }
```
Note: `_finalizeInputOutputRegistering` is a method of the base class that adds the `dependencies` input and the `output` output to the block.

We now add the code to modify the **escale** and **threshold** properties:
```typescript
@BABYLON.editableInPropertyPage("Edge scale", BABYLON.PropertyTypeForEdition.Float, "PROPERTIES", { min: 0, max: 30 })
public get escale(): number {
    return this._wrapper.escale;
}

public set escale(value: number) {
    this._wrapper.escale = value;
}

@BABYLON.editableInPropertyPage("Threshold", BABYLON.PropertyTypeForEdition.Float, "PROPERTIES", { min: 0, max: 1 })
public get threshold(): number {
    return this._wrapper.threshold;
}

public set threshold(value: number) {
    this._wrapper.threshold = value;
}
```
Thanks to the use of decorators, implementation is very simple, as you can see above: just write a getter/setter for each property and you're done!

The last step is to implement code generation, serialization, and parsing:
```typescript
protected override _dumpPropertiesCode() {
    const codes: string[] = [];
    codes.push(`${this._codeVariableName}.escale = ${this.escale};`);
    codes.push(`${this._codeVariableName}.threshold = ${this.threshold};`);
    return super._dumpPropertiesCode() + codes.join("\n");
}

public override serialize(): any {
    const serializationObject = super.serialize();
    serializationObject.escale = this.escale;
    serializationObject.threshold = this.threshold;
    return serializationObject;
}

public override _deserialize(serializationObject: any) {
    super._deserialize(serializationObject);
    this.escale = serializationObject.escale;
    this.threshold = serializationObject.threshold;
}
```
Note: Implementing `serialize` and `_deserialize` is mandatory for the block to work in NRGE (unlike `_dumpPropertiesCode` - but if you don't implement this method, the "Generate Code" button won't work as expected)!

Once again, the code is very simple, just serialize/parse the properties used by the post-process.

You must register this class in Babylon's class system:
```typescript
BABYLON.RegisterClass("BABYLON.NodeRenderGraphEdgePostProcessBlock", NodeRenderGraphEdgePostProcessBlock);
```

In order for your block to be discoverable by NRGE, you must add it to `NodeRenderGraph.CustomBlockDescriptions`:
```typescript
if (!BABYLON.NodeRenderGraph.CustomBlockDescriptions.find((desc) => desc.name === "Edge_Detection")) {
    BABYLON.NodeRenderGraph.CustomBlockDescriptions.push({
        name: "Edge_Detection",
        description: "Edge detection post-process",
        menu: "Post_Processes",
        factory: (frameGraph: BABYLON.FrameGraph, scene: BABYLON.Scene) => new NodeRenderGraphEdgePostProcessBlock("Edge detection", frameGraph, scene),
    });
}
```
Note: Since a playground can be launched multiple times, we first check whether the block has already been added to the array during a previous execution. In a real project, this check is probably unnecessary, as you would refresh the page after updating your code.

You can use this PG to test it:

<Playground id="#ZC3Y12#8" image="/img/playgroundsAndNMEs/pg-ZC3Y12-4.png" title="Custom post-process in NRGE" description="Making a custom post-process available in NRGE" isMain={true}/>

The scene is displayed normally. To use a frame graph with the edge detection post-process, proceed as follows:
* Open the inspector
* Right-click on the "Frame Graphs" container, and choose "Add new Frame Graph"
* Edit the frame graph
* In NRGE, add an "Edge Detection" post-process between the **Main rendering** block and the **Output** block.
* To see the change in the Playground, go back to the inspector and set this frame graph as the scene's frame graph
<br/>
The scene will now use the frame graph for rendering, and you should see the edge detection post-process in action!

![Final scene with edge rendering](/img/frameGraph/example_custompp_scene_edge.jpg)

Note that you can save the frame graph to the snippet server and reload it with a few lines of code:
```typescript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("XQF0ML", scene);

nrg.build();

scene.frameGraph = nrg.frameGraph;

await nrg.whenReadyAsync();
```

<Playground id="#ZC3Y12#10" image="/img/playgroundsAndNMEs/pg-ZC3Y12-2.png" title="Load node render graph with custom post-process" description="Loading a node render graph from the snippet server with custom post-process" isMain={true}/>

**Important**: editing the node render graph with the [standalone NRGE](https://nrge.babylonjs.com) will not work!

This means that this URL will not work: https://nrge.babylonjs.com/#XQF0ML. The edge detection block cannot be created by NRGE because it does not know it.

This is because the implementation of the block node for the edge detection post-process is not available in the standalone version of NRGE. You must edit the graph by first opening the playground where the class is defined and access it through the inspector.

Note that you can also open NRGE using this code:
```typescript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("XQF0ML", scene);

nrg.build();
nrg.edit();
```

