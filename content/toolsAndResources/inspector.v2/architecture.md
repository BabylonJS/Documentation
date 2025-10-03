---
title: Architecture
image:
description: An overview of the Inspector V2 architecture.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
    - title: Extensibility API
      url: /toolsAndResources/inspectorv2/extensibilityAPI
video-overview:
video-content:
---

The most important things to know about the Inspector architecture are:

1. It uses React for all the UI, and specifically uses React function components and React hooks.
2. It uses a modular architecture, meaning it is composed of a graph of loosely coupled "services."

You can add new "services" that consume other services to add new features. This allows for things like adding new panes alongside scene explorer and the properties pane, or adding new toolbar items. Each of these features are themselves a "service." This is what enables extensibility of Inspector.

## Service Definitions

A service is defined via the `ServiceDefinition` type. For example, an absolutely minimal service definition could look like this:

```ts
export MyServiceDefinition: ServiceDefinition<[], []> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The factory function is responsible for instantiating a service.
    factory: () => {
        console.log("My Service was instantiated!");
    },
};
```

This service can then be added to the Inspector via the options as a [static extension]():

```ts
ShowInspector(scene, {
    serviceDefinitions: [MyServiceDefinition],
});
```

When Inspector is shown, the service factory function is called and in the example above, a message is logged to the console.

A service factory function can return an object, and this object can optionally implement `IDisposable`. If it does, the `dispose` function will be called when the service is being removed. This would happen when the Inspector is hidden, but could also happen when a [dynamic extension]() is uninstalled. For example:

```ts
export MyServiceDefinition: ServiceDefinition<[], []> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The factory function is responsible for instantiating a service.
    factory: () => {
        console.log("My Service was instantiated!");
        return {
            dispose: () => console.log("My Service was disposed!"),
        };
    },
};
```

To do something more useful, a service will typically "consume" other services and interact with them. To understand how to consume a service, it's important to understand how a consumable service is implemented.

## Consuming Services

A service that is intended to be consumed by other services uses two concepts:

**Service Contracts** - these are types (typically interfaces) that some other service can consume (depend on). As an interface/type, it is a TypeScript compile time construct.

**Service Identity** - these are JavaScript `Symbol`s that represent a globally unique runtime identity for a service. They are needed to resolve dependencies (consume other services) at runtime.

From a typing standpoint (compile time), a Service Contract is associated with a Service Identity through the `IService` interface. For example:

```ts
export const OtherServiceIdentity = Symbol("Other Service");
export interface IOtherService extends IService<OtherServiceIdentity> {
    doSomethingAmazing(): void;
}
```

This allows for strong type checking at compile time to prevent mistakes where there are mismatches between service contracts (compile time) and service identities (runtime).

"Other Service" would have its own `ServiceDefintion` similar to the example above for "My Service." We can modify the "My Service" `ServiceDefinition` to consume "Other Service" as follows:

```ts
export MyServiceDefinition: ServiceDefinition<[], [IOtherService]> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The runtime identity of the consumed services.
    consumes: [OtherServiceIdentity],

    // The factory function is responsible for instantiating a service.
    factory: (otherService) => {
        console.log("My Service was instantiated!");
        otherService.doSomethingAmazing();
        return {
            dispose: () => console.log("My Service was disposed!"),
        };
    },
};
```

Notice the following from the example above:

1. `IOtherService` was added to the second tuple type parameter on the first line:
   `export MyServiceDefinition: ServiceDefinition<[], [IOtherService]>`
2. A `consumes` property was added with a tuple containing the runtime identity of "Other Service."
3. The "Other Service" instance was added as an parameter to the factory function.
4. The factory function uses the `otherService` argument to call the `doSomethingAmazing` function from "Other Service."

To consume multiple other services, the tuples simply have multiple entries and the factory function has multiple parameters. The orders must all match, and the `ServiceDefintion` will type check this. If there is a mistake, you will see a compile time error.

## Producing Services

When configuring a `ServiceDefinition`, in addition to consuming services, you can also *produce* services, which makes them available to be consumed by other services. A concrete example of this is Solution Explorer, which consumes the "shell service" to insert a side pane, and also produces a service that makes it possible for other services/extensions to insert additional sections into Scene Explorer.

We can add a new service contract and identity for "My Service," and then update its `ServiceDefintion` to produce this new service contract as follows:

```ts
export const MyServiceIdentity = Symbol("My Service");
export interface IMyService extends IService<MyServiceIdentity> {
    showAlert(message: string): void;
}

export MyServiceDefinition: ServiceDefinition<[IMyService], [IOtherService]> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The runtime identity of the consumed services.
    consumes: [OtherServiceIdentity],

    // The runtime identity of the produced services.
    produces: [MyServiceIdentity],

    // The factory function is responsible for instantiating a service.
    // Now this factory function must return an object that implements IMyService.
    factory: (otherService) => {
        console.log("My Service was instantiated!");
        otherService.doSomethingAmazing();
        return {
            showAlert: (message: string) => alert(message),
            dispose: () => console.log("My Service was disposed!"),
        };
    },
};
```

Notice the following from the example above:

1. A unique runtime service identity symbol (`MyServiceIdentity`) was added and exported.
2. An interface (`IMyService`) for "My Service" was added that exposes one function.
3. `IMyService` was added to the first tuple type parameter on the first line: `export MyServiceDefinition: ServiceDefinition<[IMyService], [IOtherService]>`
4. A `produces` property was added with a tuple containing the runtime identity of "My Service."
5. The factory function now returns an object that implements the `IMyService` interface, and the `ServiceDefintion` will type check this. If the returned object does not implement *all* produced service contracts, you will see a compile time error.

## Anonymous Objects vs. Classes

In the example above, the service instance returned from the service factory function is an anonymous object defined inline in the factory function. If you prefer (for example, when the service logic becomes more complex), you can also use a class. This is done by using the `ConstructorFactory` helper function. For example, if we wanted to make "My Service" a class, we could do so as follows:

```ts
export const MyServiceIdentity = Symbol("My Service");
export interface IMyService extends IService<MyServiceIdentity> {
    showAlert(message: string): void;
}

class MyService implements IMyService, IDisposable {
    public constructor(otherService: IOtherService) {
        console.log("My Service was instantiated!");
        otherService.doSomethingAmazing();
    }

    public showAlert(message: string) {
        alert(message);
    }

    public dispose() {
        console.log("My Service was disposed!");
    }
}

export MyServiceDefinition: ServiceDefinition<[IMyService], [IOtherService]> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The runtime identity of the consumed services.
    consumes: [OtherServiceIdentity],

    // The runtime identity of the produced services.
    produces: [MyServiceIdentity],

    // The factory function is responsible for instantiating a service.
    // Now this factory function must return an object that implements IMyService.
    factory: ConstructorFactory(MyService),
};
```

And again, this is all type checked. If anything is incorrect with the constructor parameters or the interfaces implemented by the class, you will see a compile time error.

## Static Extensions

As previously described, `ServiceDefinition`s can be passed directly to the `ShowInspector` function, e.g.:

```ts
ShowInspector(scene, {
    serviceDefinitions: [MyServiceDefinition],
});
```

This `ServiceDefinition`'s factory function will immediately be called, and the service will be instantiated. If it is injecting extra UI (side panes, toolbar items, etc.), they will immediately be visible. This is called a "static extension."

## Dynamic Extensions

Unlike "static extensions," "dynamic extensions" must be explicitly installed by the user from the extensions dialog before they are instantiated (and potentially visible in the UI). "Dynamic extensions" are preferred over "static extensions" when:

- The extension adds scenario specific UI that is not useful in all cases and would otherwise contribute to making the UI overwhelming.
- The extension is large (either directly, or in that it pulls in a lot of dependencies) and it is preferable to defer downloading it until the user opts into it.

The simplest way to add dynamic extensions is to use the `BuiltInsExtensionFeed`, which allows dynamically importing extensions so they can be code split into separate chunks by your bundler and only downloaded the first time they are installed. Continuing with our previous example, we'd first move "My Service" into a separate file/module so it can by dynamically imported:

```ts
export const MyServiceIdentity = Symbol("My Service");
export interface IMyService extends IService<MyServiceIdentity> {
    showAlert(message: string): void;
}

MyServiceDefinition: ServiceDefinition<[IMyService], [IOtherService]> = {
    // Helpful for debugging, and sometimes used in UI.
    friendlyName: "My Service",

    // The runtime identity of the consumed services.
    consumes: [OtherServiceIdentity],

    // The runtime identity of the produced services.
    produces: [MyServiceIdentity],

    // The factory function is responsible for instantiating a service.
    // Now this factory function must return an object that implements IMyService.
    factory: (otherService) => {
        console.log("My Service was instantiated!");
        otherService.doSomethingAmazing();
        return {
            showAlert: (message: string) => alert(message),
            dispose: () => console.log("My Service was disposed!"),
        };
    },
};

// The module should have a default export that provides a collection of ServiceDefinitions.
export default {
    // Just one ServiceDefinition for this example, but this could be a set of services that collectively compose the "extension."
    serviceDefinitions: [MyServiceDefinition],
} as const;
```

Notice the new default export at the very bottom of the file/module.

Now we can setup our `BuiltInsExtensionFeed` that will dynamically import this module:

```ts
ShowInspector(scene, {
    // Just one additional extension feed, but you can add as many feeds as you want.
    extensionFeeds: [
        // Here we use BuiltInsExtensionFeed as a simple way of introducing a dynamic extension.
        new BuiltInsExtensionFeed("My Extension Feed", [
            {
                name: "My Service",
                description: "Does something nifty.",
                keywords: ["something", "nifty"],
                getExtensionModuleAsync: async () => await import("./myService"),
            },
        ]),
    ],
});
```

Now when the user presses the extensions button in the Inspector, the extensions dialog will show this new "My Service" extension and allow it to be dynamically installed.
