---
title: Extensibility API
image:
description: Hight level information about the Inspector V2 extensibility API.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
    - title: Examples
      url: /toolsAndResources/inspectorv2/examples
video-overview:
video-content:
---

This document is intended to provide a high level overview of the different types of APIs that can be leveraged to extend Inspector with additional features. It is not exhaustive, but is representative to help get a good sense of what is involved in extending Inspector.

## Showing and Hiding Inspector

There are a few module level functions that can be used to show/hide Inspector.

| API                  | Description                                                                                                                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ShowInspector`      | Attaches Inspector to the given Babylon scene and makes it visible. Pass in options to further configure Inspector, including defining new [static](/toolsAndResources/inspectorv2/architecture#static-extensions) or [dynamic](/toolsAndResources/inspectorv2/architecture#dynamic-extensions). |
| `HideInspector`      | Hides Inspector if it is currently visible. This tears down all the Inspector resources.                                                                                                                                                                                                         |
| `IsInspectorVisible` | Used to determine whether Inspector is currently visible.                                                                                                                                                                                                                                        |

## Core Services

There are several core services that provide the main extensibility points.

| API                     | Description                                                                                                                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IShellService`         | Allows adding new left/right side panes and toolbar items.                                                                                                                                                                                                       |
| `ISceneExplorerService` | Allows adding new sections to Scene Explorer (which itself uses `IShellService` to add a side pane), or commands to existing entity types (e.g. Meshes, Textures, etc.) that are displayed in the tree view.                                                     |
| `IPropertiesService`    | Allows adding content to sections of the properties pane (which itself uses `IShellService` to add a side pane). You can add whole new sections, or add entries to existing sections, and you can target the specific entity type (e.g. Meshes, Textures, etc.). |
| `IDebugService`         | Allows adding content to sections of the debug pane (which itself uses `IShellService` to add a side pane).                                                                                                                                                      |
| `IStatsService`         | Allows adding content to sections of the stats pane (which itself uses `IShellService` to add a side pane).                                                                                                                                                      |
| `ISettingsService`      | Allows adding content to sections of the settings pane (which itself uses `IShellService` to add a side pane).                                                                                                                                                   |
| `IToolsService`         | Allows adding content to sections of the tools pane (which itself uses `IShellService` to add a side pane).                                                                                                                                                      |
| `ISceneContext`         | Provides access to the scene that Inspector is attached to.                                                                                                                                                                                                      |
| `ISelectionService`     | Provides access to the currently selected entity, and allows changing the currently selected entity. The selected entity is for example what is shown as selected in Scene Explorer, for the properties shown in the properties pane, etc.                       |
| `ISettingsContext`      | Provides access to the default Inspector settings that are configured in the settings pane.                                                                                                                                                                      |

## Custom Services (Extensions)

There are a number of types used when defining new features/services/extensions.

| Type                    | Description                                                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `IService`              | This interface must be implemented by any "service" that provides extension points (e.g. an extensible extension).                                                                                                                                                                                     |
| `ServiceDefinition`     | This type is used to define a "service." It includes a friendly name for the service, specifies other services that this service consumes (depends on), service contracts that this service produces (including its own extensibility points), and the factory function that instantiates the service. |
| `BuiltInsExtensionFeed` | This class can be used to inject "dynamic" extensions when calling `ShowInspector` (extensions that the user optionally but explicitly installs through the extensions dialog).                                                                                                                        |

## React Components

There are a number of React components that can be used to simplify extension implementation and ensure UX consistency with the default Inspector features.

| Component                                         | Description                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BoundProperty`                                   | This is a wrapper component that can be used with the components listed below but takes care of "binding" to a property of an entity (meaning it observes changes to that property in real time). Use this whenever you can for side panes like the properties pane, the deubg pane, etc. Internally `BoundProperty` uses the [`useProperty` hook](#react-hooks) described later. |
| `Vector3PropertyLine`, `SwitchPropertyLine`, etc. | Any component that is suffixed with `PropertyLine` is intended to be used in the properties pane, debug pane, etc., and can be wrapped in `BoundProperty`.                                                                                                                                                                                                                        |
| `ButtonLine`, `FileUploadLine`, etc.              | Any component that is suffixed with just `Line` is intended to be used in the properties pane, debug pane, etc., but is used standalone (not wrapped in `BoundProperty`).                                                                                                                                                                                                         |
| `Button`, `Switch`, `DropDown`, etc.              | There are many other "primitive" components that can be used for building UI that is more custom than what is seen in the properties pane (and other similar panes).                                                                                                                                                                                                              |

## React Hooks

There are a number of React hooks that make it easy to re-use much of the behavior you might see in the core Inspector features.

| Hook                                            | Description                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useProperty`                                   | Can be used to ensure the containing React component re-renders when a property of an object changes, even if it doesn't have a corresponding `Observable`. This hook is built on top of the `useInterceptObservable` and `useObservableState` hooks described later in this section.                                                                      |
| `useVector3Property`, `useColor4Property`, etc. | These hooks target specific property types that have nested properties and internally use multiple `useProperty` hooks.                                                                                                                                                                                                                                    |
| `useInterceptObservable`                        | "Intercepts" a property mutation or function call on an object, which is useful when the property/function does not have a corresponding `Observable` in the underlying Babylon API. The returned `Observable` can be used in conjunction with `useObservableState`. This hook is built on top of the instrumentation [helpers](#helpers) described later. |
| `usePollingObservable`                          | This hook simply creates an `Observable` that fires at a polling rate, which can be used in conjunction with `useObservableState`. Use this sparingly as it causes work to happen even when nothing in the scene is changing.                                                                                                                              |
| `useObservableState`                            | Causes the containing React component to re-render and a value to be recomputed when any of the specified `Observable`s fire.                                                                                                                                                                                                                              |
| `useResource`, `useAsyncResource`               | These hooks help manage the lifetime of an `IDisposable` within a React component, ensuring the resource is disposed at the right time.                                                                                                                                                                                                                    |
| `useAngleConverters`                            | Consume `ISettingsService` in your own service and pass it to this hook to convert angles based on user's preferred angle unit (degrees or radians) as specified in the Inspector settings UI.                                                                                                                                                             |

## Helpers

There are a number of helper functions that also make it easy o re-use much of the behavior you might see in the core Inspector features.

| Function            | Description                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `InterceptProperty` | This function enables light weight transient "instrumentation" of a property of an object. You can provide callbacks for property mutation lifecycle points, such as after the property value changes. It returns an `IDisposable` that must be disposed to "uninstrument" the object and restore it to its original state.                    |
| `InterceptFunction` | This function enables light weight transient "instrumentation" of a property of an object that is a function. You can provide callbacks for function invocation lifecycle points, such as after the function is called. It returns an `IDisposable` that must be disposed to "uninstrument" the function and restore it to its original state. |
