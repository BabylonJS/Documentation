---
title: Flow Graph Advanced Usage
image:
description: Learn about advanced concepts of the Flow Graph system.
keywords: diving deeper, flow graph, interactive scenes, action editor, getting started, basic concepts
---

# Flow Graph Advanced Usage

## Logging and debugging

You can enable a very verbose logger on your context. Each context has a way to log each action it does. Note that this is very verbose, as each connection value is also logged.

To enable logging, set the `enableLogging` variable to true:

```javascript
const ctx = graph.createContext();
ctx.enableLogging = true;
```

The logger will then be available on the context:

```javascript
ctx.logger !== undefined;
```

The logger is adding its logs to an array of actions in the logger object. It is also logging to the console per default, but this can be disabled by setting the `logToConsole` variable to false.

```javascript
ctx.logger.logToConsole = false;

// the array of actions
console.log(ctx.logger.log);
```

## Create your own block

When creating your first block you first need to decide whether it is a data block or an execution block. Most blocks are probably data block (i.e. - providing passive data), unless the block needs to react to an event or a signal input.

<Alert type='info'>
    If you want your block to work as part of serialization and deserialization, you will also need to add the block to the block creation factory. This section comes later in this document.
</Alert>

### Data block

To create a data block you just need to extend the `FlowGraphBlock` class and implement the `_updateOutputs` method. The `_updateOutputs` method is called when one of the block's outputs is requested by another block.

Let's take a look at a very simple block as an example - the ArrayIndexBlock (removing the imports for readability):

```javascript
/**
 * This simple Util block takes an array as input and selects a single element from it.
 */
export class FlowGraphArrayIndexBlock<T = any> extends FlowGraphBlock {
    /**
     * Input connection: The array to select from.
     */
    public readonly array: FlowGraphDataConnection<T[]>;

    /**
     * Input connection: The index to select.
     */
    public readonly index: FlowGraphDataConnection<FlowGraphInteger>;

    /**
     * Output connection: The selected element.
     */
    public readonly value: FlowGraphDataConnection<T>;

    /**
     * Construct a FlowGraphArrayIndexBlock.
     * @param config construction parameters
     */
    constructor(public override config: IFlowGraphBlockConfiguration) {
        super(config);

        this.array = this.registerDataInput("array", RichTypeAny);
        this.index = this.registerDataInput("index", RichTypeFlowGraphInteger, new FlowGraphInteger(-1));
        this.value = this.registerDataOutput("value", RichTypeAny);
    }

    /**
     * @internal
     */
    public override _updateOutputs(context: FlowGraphContext): void {
        const array = this.array.getValue(context);
        const index = getNumericValue(this.index.getValue(context));
        if (array && index >= 0 && index < array.length) {
            this.value.setValue(array[index], context);
        }
    }

    /**
     * Serializes this block (override if needed)
     * @param serializationObject the object to serialize to
     */
    public override serialize(serializationObject?: any): void {
        super.serialize(serializationObject);
    }

    public override getClassName(): string {
        return FlowGraphBlockNames.ArrayIndex;
    }
}

// register the class in the type registry of the framework
RegisterClass(FlowGraphBlockNames.ArrayIndex, FlowGraphArrayIndexBlock);
```

Let's break down the code:

First, we define the inputs and outputs of this block:

```javascript
public readonly array: FlowGraphDataConnection<any[]>;
public readonly index: FlowGraphDataConnection<FlowGraphInteger>;
public readonly value: FlowGraphDataConnection<any>;
```

They are being created in the constructor:

```javascript
this.array = this.registerDataInput("array", RichTypeAny);
this.index = this.registerDataInput("index", RichTypeFlowGraphInteger, new FlowGraphInteger(-1));
this.value = this.registerDataOutput("value", RichTypeAny);
```

Notice how each is defined whether as input or output, and has a type. The type is important if we want to have proper default values. For example, the default value of a number is 0, a boolean is true, and so on. This information can be found in `flowGraphRichTypes.ts`.

Now we have the data inputs and the data outputs, and we need to write the logic to update them, when requested by another block. This is done in the `_updateOutputs` method:

```javascript
public override _updateOutputs(context: FlowGraphContext): void {
    // get the array from the data input. If this is connected to another block, the other block's logic will be executed to get the array
    const array = this.array.getValue(context);
    // get the index from the data input.
    const index = this.index.getValue(context).value; // this is a flow graph integer, this is why we have `.value`
    // now populate the output with the right value
    if (array && index >= 0 && index < array.length) {
        this.value.setValue(array[index], context);
    }
}
```

This call is cached - this function will be executed only once per execution ID, which updated on each frame. There is no need to worry about performance reduction due to consecutive calls.

### Execution block

### Event block

### Block factory

The block factory is used when a graph is being deserialized. It holds the list of available blocks including custom added blocks, and returns the class needed to create the block.
If you are implementing a block in the framework, you can simply add it to the blockFactory function in `flowGraphBlockFactory.ts`:

```javascript
export function blockFactory(blockName: FlowGraphBlockNames | string): () => Promise<typeof FlowGraphBlock> {
  switch (blockName) {
    case FlowGraphBlockNames.PlayAnimation:
      return async () => (await import("./Execution/Animation/flowGraphPlayAnimationBlock")).FlowGraphPlayAnimationBlock;
    // ...
    // add this before the last default case
    case FlowGraphBlockNames.MyNewBlock:
      // async-return the right file and the right class
      return async () => (await import("./MyNewBlock")).FlowGraphMyNewBlock;
    //...
    default:
    //...
  }
}
```

The block factory is async-oriented to allow for lazy loading of blocks. This is important when an implementation only wants to load the blocks it needs, and not all of them.

If you are implementing an external custom block - wonderful! You can add a custom block to the block factory using the exposed `addToBlockFactory` function:

```javascript
/**
 * If you want to add a new block to the block factory, you should use this function.
 * Please be sure to choose a unique name and define the responsible module.
 * @param module the name of the module that is responsible for the block
 * @param blockName the name of the block. This should be unique.
 * @param factory an async factory function to generate the block
 */
export function addToBlockFactory(module: string, blockName: string, factory: () => Promise<typeof FlowGraphBlock>): void {
    customBlocks[`${module}/${blockName}`] = factory;
}
```

This function requires you to define the module the block exists in. This is your decision and is only there for the sake of structure:

```javascript
const module = "MyModuleBlocks";

// add the block to the factory
addToBlockFactory(module, "ColorChangerBlock", async () => (await import("./MyNewBlock")).ColorChangerBlock);
```

Now the block will be available when deserialization requests the block named `MyModuleBlocks/ColorChangerBlock`.
