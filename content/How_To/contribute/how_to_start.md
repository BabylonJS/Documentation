---
title: How to Contribute To Babylon.js
image:
description: How to contribute to Babylon.js.
keywords: diving deeper, contribution, contribute, open-source, oss, develop
further-reading:
video-overview:
video-content:
---

## Guidance

Before embarking on editing or adding to Babylon.js please make sure you are familiar with the [contribution guidelines](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md).

Pull Requests are checked on submission. Checks include

- comments to your code as described [here](/contributeToAPI);
- readability, maintainability, and functionality using TSLint
- a statement about the change in the **dist/preview release/what's new.md** page

You can raise issues in the Babyon.js repository or ask on the forum.

## Editing

Edit Babylon.js with your favorite IDE, for example VSCode. After editing and saving your changes should be staged with git add. Any changes during the build to files in the `dist` folder should be deleted before commiting.

Using VSCode there is a `Debug` tab on the menu. To use it with Babylon.js you need to install the chrome debugger extension, find out more from [Debugger for Chrome](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code).


## Testing and Dependencies

In order to carry out testing the distribution files have to be compiled and a server set up to carry out the tests. This requires the Typescript compiler and Gulp build tools. The folder to run the build is `Babylon.js/Tools/Gulp`

### The Build

In your command line interface make sure your are in the directory `Babylon.js/Tools/Gulp` and enter

```bash
npm install
npm run build
```

During the build the `dist` folder continuously gets updated and its files changed. These modified files should not be committed so they they are not changed by a pull request. To ignore these files you can run the following in your CLI:

```bash
git update-index --assume-unchanged "Playground/babylon.d.txt"
git update-index --assume-unchanged "dist/preview release/babylon.d.ts"
git update-index --assume-unchanged "dist/preview release/babylon.js"
git update-index --assume-unchanged "dist/preview release/babylon.max.js"
git update-index --assume-unchanged "dist/preview release/customConfigurations/minimalGLTFViewer/babylon.d.ts"
git update-index --assume-unchanged "dist/preview release/customConfigurations/minimalGLTFViewer/babylon.js"
git update-index --assume-unchanged "dist/preview release/customConfigurations/minimalGLTFViewer/babylon.max.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylon.glTF2FileLoader.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylon.glTF2FileLoader.min.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylon.glTFFileLoader.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylon.glTFFileLoader.min.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylonjs.loaders.js"
git update-index --assume-unchanged "dist/preview release/loaders/babylonjs.loaders.min.js"
git update-index --assume-unchanged "dist/preview release/typedocValidationBaseline.json"
git update-index --assume-unchanged "dist/preview release/viewer/babylon.viewer.js"
git update-index --assume-unchanged "dist/preview release/viewer/babylon.viewer.max.js"
```

The `npm run build` builds everything you need to test.

If you get an error

```jsx
fatal: Unable to mark file Tools/Gulp/dist/preview release/viewer/babylon.viewer.js
fatal: Unable to mark file Tools/Gulp/dist/preview release/viewer/babylon.viewer.max.js
```

that's because you didn't build the project yet. Reissue the last two git commands after you've succesfully built the project or run the whole batch after the build.

Once the task is run the links below provide the main entry points in Babylon.js:

1. [Sandbox]("http://localhost:1338/sandbox/public/index-local.html"): [http://localhost:1338/sandbox/public/index-local.html](http://localhost:1338/sandbox/public/index-local.html)
2. [Playground]("http://localhost:1338/Playground/index-local.html"): [http://localhost:1338/Playground/index-local.html](http://localhost:1338/Playground/index-local.html)
3. [Materials Library]("http://localhost:1338/materialsLibrary/index.html"): [http://localhost:1338/materialsLibrary/index.html](http://localhost:1338/materialsLibrary/index.html)
4. [Post Process Library]("http://localhost:1338/postProcessLibrary/index.html"): [http://localhost:1338/postProcessLibrary/index.html](http://localhost:1338/postProcessLibrary/index.html)
5. [Procedural Textures Library]("http://localhost:1338/proceduralTexturesLibrary/index.html"): [http://localhost:1338/proceduralTexturesLibrary/index.html](http://localhost:1338/proceduralTexturesLibrary/index.html)
6. [Inspector]("http://localhost:1338/inspector/index.html"): [http://localhost:1338/inspector/index.html](http://localhost:1338/inspector/index.html)
7. [Local Dev]("http://localhost:1338/localDev/index.html"): [http://localhost:1338/localDev/index.html](http://localhost:1338/localDev/index.html)
8. [Build validation]("http://localhost:1338/tests/validation/index.html"): [http://localhost:1338/tests/validation/index.html](http://localhost:1338/tests/validation/index.html)

All of those allow debugging the source code of bjs directly from typescript.

![debug](/img/how_to/howToStart/debug.png)

If you wish to test the fully compiled version instead of independent files simply append ?dist=true in the different urls.

You could also test against the minified version by choosing ?dist=min. this will work on all the referenced URLs.

### Edit Code

Once the test task (npm run start) has been launched, any saved changes in the Typescript or shader files will automatically rebuild the associated Javascript files. Simply refresh your browser to see the changes in effect and begin to debug your new code.

_Hint_: You may need to refresh the code before adding back a new breakpoint.

### Local Dev with the Playground

A quick way to test if your code works is to open the [local playground](http://localhost:1338/Playground/index-local.html) and write code that calls on the classes you have created.

It is also possible by creating an `index.js` file in the `/localDev/src/` folder and copying and pasting playground code into this `index.js` file. The entire `/localDev/src` folder is git ignored and is meant to be your local test folder.

You launch this code through: [http://localhost:1338/localDev/index.html](http://localhost:1338/localDev/index.html)

From there you can easily add a breakpoint in your playground code or the Typescipt files for debugging.

Adding in the url ?dist=true or ?dist=min will help testing against the built files.

As using only one test file is annoying, feel free to number the files index.1.js, index.2.js... and so on. In VSCode, copy pasting the file in the same folder results in creating the next available slot in the folder e.g. copy pasting index.1.js will create index.2.js.

To launch index.{number}.js simply append in the url sample={number} so for launching index.3.js against the unminified released files, use: http://localhost:1338/localDev/index.html?dist=true&sample=3

This should help playing and debugging locally.

### Validate changes

As part of your testing process, it is highly recommended to launch the build validator: [http://localhost:1338/tests/validation/index.html](http://localhost:1338/tests/validation/index.html).
It will run several scenes against a reference image to detect any visual changes.

There's an [advanced page](/contribute/howToStart/validationTests) for validation tests, but you should not need it, simply launching [http://localhost:1338/tests/validation/index.html](http://localhost:1338/tests/validation/index.html) and making sure all tests are ok should be enough.

### Guidelines

A reminder to read the [contribution guidelines](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md).

## Pull-Request

Pull Requests are automatically validated. One check is for styling and you can check that quickly with `gulp tsLint`. If you are unsure, you can validate everything with a full build:

```bash
npm run build
```

When you are happy that all testing has been validated, guidelines followed, and only necessary files committed then push your local master to your Github repository and open a Pull Request.

If some of your commits are behind the Babylon.js:master

![fail](/img/contribute/pr2.jpg)

then you will need to pull from the Babylon.js:master and then push into your repository again.

## Check for Success

Once your `pull-request` has been issued then it needs to be checked, reviewed, approved and merged.

Some checks are carried out automatically and this can be found in the mainBabylon.js/Babylon.js repository

Find your pull-request from the list and check for any errors.

![check 2](/img/contribute/pr5.jpg)

In the above image you can see that this pull-request failed in `WhatsNewUpdate`. Probably because no entry was made in **dist/preview release/what's new.md**. It has passed the `DocumentationCheck` since all the comments have been entered as describe in [the formatting of comments for the API](/contributeToAPI#format-of-comments).

For any failures re-edit your local files, commit and push to your repository. The alterations will automatically added to your pull-request and it will be re-checked.

# Its Live

Once your pull-request has been merged it will become live once any changes have been deployed into the `Preview Release` usually overnight but sometimes delayed a couple of days.

## Gulp Tasks

All the following tasks are available:

- `gulp run` launches all the watchers and a web server.
- `gulp webserver` launches the webserver only.
- `gulp watch` launches the watchers only.
- `gulp typescript-all` generates all the distribution files in the dist/preview release folder
- `gulp typescript` generates the BJS distribution files.
- `gulp typescript-libraries` generates all the library (materials, procedural textures...) files in the dist/preview release folder.
- `gulp loaders` generates all the loaders files in the dist/preview release folder.
- `gulp serializers` generates all the serializers files in the dist/preview release folder.
- `gulp materialsLibrary` generates all the materials files in the dist/preview release folder.
- `gulp proceduralTexturesLibrary` generates all the procedural textures files in the dist/preview release folder.
- `gulp postProcessesLibrary` generates all the post processes files in the dist/preview release folder.
- `gulp inspector` generates the inspector files in the dist/preview release folder.

Most of those tasks should be launch by authorizing node to consume more memory than default by relying on the argument: `--max-old-space-size=8192`

