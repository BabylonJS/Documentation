---
title: Flow Graph Advanced Usage
image:
description: Learn about advanced concepts of the Flow Graph system.
keywords: diving deeper, flow graph, interactive scenes, action editor, getting started, basic concepts
---

## Flow Graph Advanced Usage

### Logging and debugging

You can enable a very verbose logger on your context. Each context has a way to log each action it does. Note that this is very verbose, as each connection value is also logged.

To enable logging, set the `enableLogging` variable to true:

```javascript
const ctx = graph.createContext();
ctx.enableLogging = true;
```

The logger will then be available on the context:

```javascript
ctx.logger !== undefined
```

The logger is adding its logs to an array of actions in the logger object. It is also logging to the console per default, but this can be disabled by setting the `logToConsole` variable to false.

```javascript
ctx.logger.logToConsole = false;

// the array of actions
console.log(ctx.logger.log);
```
