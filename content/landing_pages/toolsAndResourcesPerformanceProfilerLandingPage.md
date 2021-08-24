---
title: The Performance Profiler
image: 
description: Learn all about the powerful Performance Profiling tool in Babylon.js.
keywords: babylon.js, tools, resources, performance profiler, profiler
further-reading:
video-overview:
video-content:
---

## What is it?

Introduced in Babylon.js 5.0, The Performance Profiler is a fantastic visual performance debugging tool. As you develop your Babylon experience, this new tool can help you easily identify performance issues and hiccups in your scene. added to the statistics tab of the inspector. 

<img src="/img/tools/performanceViewerStatisticsTab.png" title="Babylon.js Performance Viewer Statistics Tab"/>

Available in the statistics tab of the inspector, it allows you to visually see data charted over time rather than seeing the latest number at any one moment.

The Performance Profiler can collect and display 3 types of data: 1) all the data under the statistics tab, 2) user-defined data, and 3) user-defined events through code.

It has two modes for recording data:
 - Real-time graph mode.
 - Headless recording mode.

## Use Case

You would want to use this to debug any performance issues in your scene and figure out a potential cause. 
For example, you may notice that fps drops whenever you do a specific action in the scene, and that draws increase simultaneously. 

## How to use it

<img src="/img/tools/performanceViewerStatisticsTab.png" title="Babylon.js Performance Viewer Statistics Tab"/>

There are four buttons to choose from on this screen:
 - Open Realtime Perf Viewer
 - Load Perf viewer using CSV
 - Export Perf to CSV
 - Begin Recording

"Open Realtime Perf Viewer" will open the performance viewer popout in real-time graph mode. 
While "Load Perf viewer using CSV" will open the performance viewer popout in a view-only mode. 

<img src="/img/tools/performanceViewerPopout.png" title="Babylon.js Performance Viewer Popout"/>

The left sidebar in the popout holds the activated collection types. It allows the user to toggle visibility and change color through the checkbox and color picker, respectively. 

The right sidebar contains tickers showing the current value followed by "(min in view, max in view)." The tickers let you know what the topmost value and the bottom-most value mean. 

The center contains the graph, and you can hover at a particular timestamp to view all data values at the timestamp. 
<img src="/img/tools/performanceViewerTooltip.png" title="Babylon.js Performance Viewer Tooltip"/>


You can zoom in and out using the mouse wheel. 

You can pan the graph by dragging while clicking, taking the graph out of the live data stream. 

You can hover over a single line outside the live data stream to focus on it, fading out the other lines. 

A horizontal line shows where that point is relative to every other point on the focused line.
<img src="/img/tools/performanceViewerLineFocus.png" title="Babylon.js Performance Viewer Line Focus"/>

To return to the live data stream, you can either catch up to the live data stream or conveniently click the "Return" button.

**NOTE**: The information on the right sidebar may move to the left sidebar.

"Begin Recording" will only begin recording in headless recording mode. This button also will allow you to stop recording when it changes the text to "Stop recording."

"Export Perf to CSV" allows you to export the performance recording to a CSV. The CSV export provides for sharing of performance data and also importing at a later time.

"Begin Recording" and "Export Perf to CSV" are helpful for the mobile experience, as the popout will not work as intended in real-time graph mode while on mobile. You will have to export the recording and import it on a PC. However, these can also be used on the PC outright.

## Headless recording mode vs. Real-time graph mode.
Real-time graph mode opens up a popout and begins recording, while headless recording mode begins recording without the popout.

Therefore, real-time graph mode will allow you to see a graph updating once per frame with performance data.

Headless recording mode will have a lower performance impact and not rely on the popout, useful for mobile.

## Collection Strategies
A collections strategy is just a strategy defining how to collect the data and do clean up appropriately.

There are many collection strategies already defined for you in the PerfCollectionStrategy class.

We currently support these out of the box:
- FpsStrategy
- TotalMeshesStrategy
- ActiveMeshesStrategy
- ActiveIndiciesStrategy
- ActiveFacesStrategy
- ActiveBonesStrategy
- ActiveParticlesStrategy
- DrawCallsStrategy
- TotalLightsStrategy
- TotalVerticesStrategy
- TotalMaterialsStrategy
- TotalTexturesStrategy
- AbsoluteFpsStrategy
- MeshesSelectionStrategy
- RenderTargetsStrategy
- ParticlesStrategy
- SpritesStrategy
- AnimationsStrategy
- PhysicsStrategy
- RenderStrategy
- FrameTotalStrategy
- InterFrameStrategy
- GpuFrameTimeStrategy
- CpuStrategy

The CPU strategy is more experimental as it uses the experimental computer pressure API. This strategy may not work as intended for all users.
You might have to enable experimental web features in chrome settings to enable this. This strategy allows you to know the utilization percentage of the CPU.

We only collect a few data sources by default, but you can add more of these predefined data sources.
Let's say we want to add the TotalLightsStrategy. To do this, we would do the following:

First, get the performance collector like so:
```javascript
const perfCollector = scene.getPerfCollector();
```

Then add the total lights strategy:
```javascript
perfCollector.addCollectionStrategies(BABYLON.PerfCollectionStrategy.TotalLightsStrategy);
```

## Adding a custom collection strategy

You may have custom data that you want to track that we do not support outside of the box. Don't worry, we've made this very easy to do.

To start, you must define a function that returns an object like so:
```javascript
// This variable would be updated somewhere else.
var someVariableToTrack;

const someStrategy = (scene) => {
    return {
        /**
        * The id of the strategy.
        */
        id: "some strategy id",
        /**
        * Function which gets the data for the strategy.
        */
        getData: () => someVariableToTrack,
        /**
        * Function which does any necessary clean-up. Called when performanceViewerCollector.dispose() is called.
        */
        dispose: () => {
            // do any clean up here.
        }
    }
};
```
When added to the performance collector, the collector passes the scene object as a parameter to the function (you can omit the scene parameter if you would like).
The function allows for any initialization of observers and other resources.

The id parameter is the name of the strategy. Make sure to have a unique id, or else there may be unintended side effects. The left sidebar will display the id defined.
The getData function in the object must return a number that cannot be NaN. It is called once per frame.
The dispose function in the object should do any clean-up of resources created in the initialization part of the function.

Here is an example of how we keep track of draw calls in the PerfCollectionStrategy class:
```typescript
public static DrawCallsStrategy(): PerfStrategyInitialization {
    return (scene) => {
        let drawCalls = 0;
        const onBeforeAnimationsObserver = scene.onBeforeAnimationsObservable.add(() => {
            scene.getEngine()._drawCalls.fetchNewFrame();
        });

        const onAfterRenderObserver = scene.onAfterRenderObservable.add(() => {
            drawCalls = scene.getEngine()._drawCalls.current;
        });

        return {
            id: "draw calls",
            getData: () => drawCalls,
            dispose: () => {
                scene.onBeforeAnimationsObservable.remove(onBeforeAnimationsObserver);
                scene.onAfterRenderObservable.remove(onAfterRenderObserver);
            },
        };
    };
}
```
In the function, we create two observers and update the value of draw calls in the onAfterRenderObservable.
We return the value of draw calls in getData.
We remove all observers inside the dispose function.

Now that you have a collection strategy, you have to add it to the performance collector.
First, get the performance collector like so:
```javascript
const perfCollector = scene.getPerfCollector();
```
Then add the strategy we defined earlier to the performance collector:
```javascript
perfCollector.addCollectionStrategies(someStrategy);
```

## Registering a custom event.
An event is a particular type of strategy that can measure the number of times it was called in a frame or track a named custom value (related to an event usually) once per frame.
To register an event you would do the following:
```javascript
const perfCollector = scene.getPerfCollector();
const event = perfCollector.registerEvent("someEvent");
```
The register event function returns an object containing the event passed in:
```javascript
{
   /**
    * The name of the event.
    */
   name: "",
}
```

If you want to count the number of times an event was called, you would want the following somewhere in the code:
```javascript
perfCollector.sendEvent(event);
```

If you want to track a custom value once per frame related to an event, try this:
```javascript
// somewhere in the code you want this
event.value = someValue;

// followed by this somewhere in the code
perfCollector.sendEvent(event);
```

**Note**: You shouldn't set the value property to undefined after selecting a value for it. Doing so may result in unexpected behavior (this will switch between counting the number of occurrences and tracking a custom value related to an event).
