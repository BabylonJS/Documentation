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
// define the index as type integer, and also assign a default value to it. The 3rd variable is optional, and each type has its own default value
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
    if (array && index >= 0 && index < array.length) {
        // now populate the output with the right value
        this.value.setValue(array[index], context);
    } else {
        // optionally, we could also set it to null, because either the array is null or the index is out of bounds
        // this is important because we don't have exception handling here. The execution node taking this value will be able to trigger an error if it is null
        this.value.setValue(null, context);
    }
}
```

This call is cached - this function will be executed only once per execution ID, which updated on each frame. There is no need to worry about performance reduction due to consecutive calls.

### Execution block

An execution block is a bit more complex than a data block. There are a few decisions that needs to be made when implementing one:

1. Is the block asynchronous or synchronous?
2. What are my input signals? is `in` enough?
3. What are my output signals? is `out` enough?
4. Do I need to handle errors?
5. Are there signal-events I need to trigger?

The basic class that needs to be extended is `FlowGraphExecutionBlock`. This class has a few methods that need to be overridden, an `in` input signal and `error` output signal.

However, there are several other classes you can extend, depending on your needs:

- FlowGraphExecutionBlockWithOutSignal - adds an `out` output signal
- FlowGraphAsyncExecutionBlock - adds `done` to the `FlowGraphExecutionBlockWithOutSignal` class, and allows preparing an canceling an async task
- FlowGraphEventBlock - a special extension of `FlowGraphAsyncExecutionBlock` that can react to scene-based events (which we will discuss in the next section)

### FlowGraphExecutionBlock

Let's look at a simple example of `FlowGraphExecutionBlock`, the `FlowGraphBranchBlock`:

```javascript
/**
 * A block that evaluates a condition and activates one of two branches.
 */
export class FlowGraphBranchBlock extends FlowGraphExecutionBlock {
    /**
     * Input connection: The condition to evaluate.
     */
    public readonly condition: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: The branch to execute if the condition is true.
     */
    public readonly onTrue: FlowGraphSignalConnection;
    /**
     * Output connection: The branch to execute if the condition is false.
     */
    public readonly onFalse: FlowGraphSignalConnection;

    constructor(config?: IFlowGraphBlockConfiguration) {
        super(config);

        this.condition = this.registerDataInput("condition", RichTypeBoolean);

        this.onTrue = this._registerSignalOutput("onTrue");
        this.onFalse = this._registerSignalOutput("onFalse");
    }

    public _execute(context: FlowGraphContext): void {
        if (this.condition.getValue(context)) {
            this.onTrue._activateSignal(context);
        } else {
            this.onFalse._activateSignal(context);
        }
    }

    /**
     * @returns class name of the block.
     */
    public override getClassName(): string {
        return FlowGraphBlockNames.Branch;
    }
}
```

Let's break down the code:

First, we define the inputs and outputs of this block:

```javascript
public readonly condition: FlowGraphDataConnection<boolean>;
public readonly onTrue: FlowGraphSignalConnection;
public readonly onFalse: FlowGraphSignalConnection;
```

The first, the condition, is a data input. The other two are signal outputs, which are used to trigger the next block in the graph.

The constructor is similar to the data block:

```javascript
this.condition = this.registerDataInput("condition", RichTypeBoolean);
// signal output don't need any type, as they hold no value
this.onTrue = this._registerSignalOutput("onTrue");
this.onFalse = this._registerSignalOutput("onFalse");
```

Now, the important part. When any input signal is triggered on any execution block, the `_execute` method is called. This is where the logic of the block is defined:

```javascript
public _execute(context: FlowGraphContext), _callingSignal?: FlowGraphSignalConnection: void {
    // get the value of condition
    if (this.condition.getValue(context)) {
        // if it is true - execute the onTrue signal
        this.onTrue._activateSignal(context);
    } else {
        // otherwise execute the onFalse trigger
        this.onFalse._activateSignal(context);
    }
}
```

The second variable of this function is an optional trigger - this is the input signal that has triggered this execution. We can use it this way (but this is not needed in this case):

```javascript
public _execute(context: FlowGraphContext, callingSignal?: FlowGraphSignalConnection): void {
    if (callingSignal === this.in) {
        // do something
    }
}
```

This is helpful we have have more than one input signals (for example - a reset signal).

#### FlowGraphAsyncExecutionBlock

An async block needs a bit more functions implemented to get it to work correctly. Let's look at the SetDelay block (removing any unrelated code for readability):

```javascript
/**
 * Block that sets a delay in seconds before activating the output signal.
 */
export class FlowGraphSetDelayBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * The maximum number of parallel delays that can be set per node.
     */
    public static MaxParallelDelayCount = 100;
    /**
     * Input signal: If activated the delayed activations set by this block will be canceled.
     */
    public readonly cancel: FlowGraphSignalConnection;

    /**
     * Input connection: The duration of the delay in seconds.
     */
    public readonly duration: FlowGraphDataConnection<number>;

    /**
     * Output connection: The last delay index that was set.
     */
    public readonly lastDelayIndex: FlowGraphDataConnection<number>;

    constructor(config?: IFlowGraphBlockConfiguration) {
        super(config);
        this.cancel = this._registerSignalInput("cancel");
        this.duration = this.registerDataInput("duration", RichTypeNumber);
        this.lastDelayIndex = this.registerDataOutput("lastDelayIndex", RichTypeNumber, -1);
    }

    public _preparePendingTasks(context: FlowGraphContext): void {
        const duration = this.duration.getValue(context);
        if (duration < 0 || isNaN(duration) || !isFinite(duration)) {
            this.error.payload = { message: "Invalid duration" };
            return this.error._activateSignal(context);
        }

        // active delays are global to the context
        const activeDelays: number = context._getGlobalContextVariable("activeDelays", 0);
        if (activeDelays >= FlowGraphSetDelayBlock.MaxParallelDelayCount) {
            this.error.payload = { message: "Max parallel delays reached" };
            return this.error._activateSignal(context);
        }
        // get the last global delay index
        const lastDelayIndex: number = context._getGlobalContextVariable("lastDelayIndex", -1);

        // these are block-specific and not global
        const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
        const scene = context.configuration.scene;
        const timer: AdvancedTimer = new AdvancedTimer({
            timeout: duration * 1000, // duration is in seconds
            contextObservable: scene.onBeforeRenderObservable,
            onEnded: () => this._onEnded(timer, context),
        });
        timer.start();
        const newIndex = lastDelayIndex + 1;
        this.lastDelayIndex.setValue(newIndex, context);
        context._setGlobalContextVariable("lastDelayIndex", newIndex);

        timers[newIndex] = timer;
        context._setExecutionVariable(this, "pendingDelays", timers);
    }

    public _cancelPendingTasks(context: FlowGraphContext): void {
        const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
        for (const timer of timers) {
            timer?.dispose();
        }
        context._deleteExecutionVariable(this, "pendingDelays");
        this.lastDelayIndex.setValue(-1, context);
    }

    public _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void {
        if (callingSignal === this.cancel) {
            this._cancelPendingTasks(context);
            return;
        } else {
            this._preparePendingTasks(context);
            this.out._activateSignal(context);
        }
    }

    private _onEnded(timer: AdvancedTimer, context: FlowGraphContext) {
        const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
        const index = timers.indexOf(timer);
        if (index !== -1) {
            timers.splice(index, 1);
        } else {
            Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list");
        }
        context._removePendingBlock(this);
        this.done._activateSignal(context);
    }
}
```

Let's ive into the code. I will skip the first stake (defining the inputs and outputs) and go straight to the `_execute` method:

```javascript
public _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void {
    if (callingSignal === this.cancel) {
        this._cancelPendingTasks(context);
        return;
    } else {
        this._preparePendingTasks(context);
        // trigger out to act as proxy. This is important for chaining! Further nodes can be executed on the same frame right after this one.
        this.out._activateSignal(context);
    }
}
```

We can see that the execute function is still important in async execution as well. What we are doing is calling the `_preparePendingTasks` method, which is where we define the logic of the block. Any async execution should allow canceling it, and this is done by checking if the `cancel` signal was triggered. If it was, we call the `_cancelPendingTasks` method.

Let's look at the `_preparePendingTasks` method and code-doc it thoroughly:

```javascript
public _preparePendingTasks(context: FlowGraphContext): void {
    // get the value of duration
    const duration = this.duration.getValue(context);
    // validate the value and make sure we can create a delay based on this value
    if (duration < 0 || isNaN(duration) || !isFinite(duration)) {
        // set the error payload, in case the handling block wants to know what happened
        this.error.payload = { message: "Invalid duration" };
        // trigger the error signal and don't continue
        return this.error._activateSignal(context);
    }

    // active delays are global to the context
    // remember, the global context is where we can set variables that are accessed by all blocks
    const activeDelays: number = context._getGlobalContextVariable("activeDelays", 0);
    // too many active delays?
    if (activeDelays >= FlowGraphSetDelayBlock.MaxParallelDelayCount) {
        // set the error payload, in case the handling block wants to know what happened
        this.error.payload = { message: "Max parallel delays reached" };
        // trigger the error signal and don't continue
        return this.error._activateSignal(context);
    }
    // get the last global delay index
    const lastDelayIndex: number = context._getGlobalContextVariable("lastDelayIndex", -1);

    // these are block-specific and not global
    const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
    const scene = context.configuration.scene;
    // create a new timer
    const timer: AdvancedTimer = new AdvancedTimer({
        timeout: duration * 1000, // duration is in seconds
        contextObservable: scene.onBeforeRenderObservable,
        onEnded: () => this._onEnded(timer, context),
    });
    timer.start();
    const newIndex = lastDelayIndex + 1;
    this.lastDelayIndex.setValue(newIndex, context);
    // update the global context variable
    context._setGlobalContextVariable("lastDelayIndex", newIndex);

    timers[newIndex] = timer;
    // update the block-specific variable
    context._setExecutionVariable(this, "pendingDelays", timers);
}
```

This function will start the timer and store it in the context for a future time when it is needed. Now let's look at the `_cancelPendingTasks` method:

```javascript
public _cancelPendingTasks(context: FlowGraphContext): void {
    // get the timers from the context
    const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
    // cancel each timer
    for (const timer of timers) {
        timer?.dispose();
    }
    // delete the timers from the context
    context._deleteExecutionVariable(this, "pendingDelays");
    // set the last delay index to -1
    this.lastDelayIndex.setValue(-1, context);
}
```

This method will cancel all timers that were created by this block. This is important because we don't want to have any pending timers when the block is disposed.

And finally, the function that will be triggered when the timer ends:

```javascript
private _onEnded(timer: AdvancedTimer, context: FlowGraphContext) {
    // get the timers from the context
    const timers = context._getExecutionVariable(this, "pendingDelays", [] as AdvancedTimer[]);
    // get the index of the timer that ended
    const index = timers.indexOf(timer);
    // remove it from the list
    if (index !== -1) {
        timers.splice(index, 1);
    } else {
        Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list");
    }
    // remove the block from the pending blocks
    context._removePendingBlock(this);
    // trigger done signal
    this.done._activateSignal(context);
}
```

This method will remove the timer from the list of timers and trigger the `done` signal. this is the most important step - we need to trigger the `done` signal so that the next block in the graph can be executed.

Overriding the `_executeOnTick` method is optional. This method is called on each frame, and can be used to update the block's logic. For example, if you want to update the block's logic based on the current frame, you can do it here.

```javascript
public override _executeOnTick(_context: FlowGraphContext): void {
    // this function is called on each frame, and can be used to update the block's logic
}
```

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
