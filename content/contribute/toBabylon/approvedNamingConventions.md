---
title: Approved Naming Conventions
image:
description: Learn about standard approved naming conventions in Babylon.js.
keywords: diving deeper, contribution, contribute, open-source, oss, naming conventions
further-reading:
video-overview:
video-content:
---

If you want to contribute to babylon.js (What an _excellent_ idea!), you should attempt to align your code with the following naming conventions:

- Private variables are named starting with \_ : `_myVariable`
- Camel casing is used for non static properties/functions/variables: `var myUberUsefulVariable`
- Pascal casing must be used for "static" functions: `BABYLON.Vector3.Project`
- Braces ({}) must be used for every block, even when there is only one line:

```
if (condition) {
    this.doSomething();
}
```

- Braces start on the same line and end on the next one
- Each new file must contain only one class

You have to use **TypeScript** to submit a pull request.

Please, do not forget to update the [documentation](https://github.com/BabylonJS/Documentation).
