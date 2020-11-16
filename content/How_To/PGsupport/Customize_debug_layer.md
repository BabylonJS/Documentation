---
title: Customizing The Inspector
image: 
description: Learn how to customize the inspector in Babylon.js.
keywords: babylon.js, tools, resources, inpsector, debug layer
further-reading:
    - title: The Inspector Features
      url: /toolsAndResources/tools/inspector
    - title: How To Use The Inspector in Projects
      url: /toolsAndResources/tools/inspector
video-overview:
video-content:
---

# Customize the Inspector

The Inspector is part of the Babylon.js repository and can be customized in the same way as Babylon.js can. 

Before following any of the steps below knowing how to customizing Babylon.js in general is required: 
[How to Start Contributing to Babylon.js](/divingDeeper/developWithBjs/howToStart)

# Setting the project

As all the code of the Inspector lies in Babylon.js repository, you have first to follow [this tutorial](/divingDeeper/developWithBjs/howToStart) to setting up your IDE.

# Compile the library
In a terminal, type : 
```
cd Tools/Gulp
npm install
gulp inspector
```

# Run the test task
Once this is done, run the test task (<kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd>) and type `test` then press <kbd>enter</kbd>.

Open the url : http://localhost:1338/inspector/index.html
You should be able to see the test file (see next) for the inspector.

# React

Babylon.js Inspector is based on a React. You may want to read more about React before updating the inspector: https://reactjs.org/