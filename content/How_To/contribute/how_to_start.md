---
title: Start Contributing to Babylon.js
image: 
description: Learn how to start contributing to Babylon.js.
keywords: welcome, babylon.js, diving deeper, contribution, contribute, open-source, oss, develope
further-reading:
video-overview:
video-content:
---

## Introduction

Babylon.js is maintained on Github, a web-based hosting service for version control using Git. This page will introduce these and everything that is needed to make changes or additions to Babylon.js, from tools installation to testing, plus a brief description of why they are necessary. The steps are intended to be OS agnostic, allowing users to develop the same way on Windows, Mac and Linux.

## Pre-Requisites

- Reading the [contribution guidelines](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md).
- An ability to code in Typescript. Babylon.js is written in Typescript then compiled and distributed in JavaScript.
- Know how to use a Command Line Interpreter (CLI), used to issue Git commands.

## Install Git

A quick way for Windows and Mac is from the [Git Home Page](https://git-scm.com/) and for all three operating systems from the [Git Book](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

You then need configure the installation to your details using a CLI. You can use the CLI built into your computer or one of many specialist ones for Git [(Git Clients)](https://git-scm.com/downloads/guis/). If you use Visual Studio Code then the Terminal is a built in CLI and can be opened with _Ctrl + '_.

In your CLI configure git globally with your user name and email:

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

## Install Firefox

In order to run the Babylon.js tests you will need to have Firefox installed.

Download it from the [Firefox Home Page](https://www.mozilla.org/en-US/firefox/).

## Fork from Github

If you do not have one already open a Github account with your email address and still signed in go to the [Babylon.js repository](https://github.com/BabylonJS/Babylon.js) and fork with button at the top.

![Fork](/img/contribute/fork.jpg);

## Clone to Local

Now in your Babylon.js repository use the Clone or Download Button to find **your** repository address

![Clone](/img/contribute/clone.jpg)

If the CLI you are using accepts a `paste` then use the copy icon to the right of the address. This will save a lot of typing.

In the CLI enter

```bash
git clone _**your repository address**_
```

![gitclone](/img/contribute/gitclone.jpg)

The cloning may take some time.

Now you have a local repository and a remote repository on Github.

From the folder where you cloned Babylon.js into you can simply change your directory to the local repository using

```bash
cd babylon.js
```

and then find the name of your remote repository with

```bash
git remote -v
```

![remote address](/img/contribute/remote1.jpg)

You should find it is called `origin` since it is the origin of the cloned local version. The local version is called the `master` since it is your master version of your Babylon.js.
When the time comes this will allow you push changes in your local repository to your Github repository using

```bash
git push origin master
```

## Keeping The Local Version Up To Date

When it comes time for you to request that your changes be pulled into the Babylon.js then the only difference between your version of Babylon.js and it should be the changes you have made. Of course other people are making changes as well so you need to keep your master, the local version, up to date with the main version. The main version, often termed the upstream version, is another remote version to your local repository that it can link to

To do this you add the main version as a remote with the name upstream, making sure that your CLI is at the babylon.js directory

```bash
git remote add upstream https://github.com/BabylonJS/Babylon.js.git
```

Using

```bash
git remote -v
```

you can check all remotes are active.

![Added Remote](/img/contribute/remote2.jpg)

Now before pushing your fully committed master to your origin you can pull the upstream (main) version into your master with

```bash
git pull upstream master
```

You can pull from upstream at any time provided any changes you have made are committed.

## Editing, Testing and Guidelines

Before embarking on editing or adding to Babylon.js please make sure you are familiar with the [contribution guidelines](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md).

Please note that some of these are checked on submission automatically by software, including

- The addition of comments to your code as described [here](/divingDeeper/developWithBjs/contributeToAPI);
- Adding a statement about the change in the **dist/preview release/what's new.md** page

## Editing with Visual Studio Code

Visual Studio Code is a straight forward IDE with Git integration and is available for all three operating systems. It is worth a try though you may already have a favorite or recommended IDE.

You can install VSCode from their site: [https://code.visualstudio.com/](https://code.visualstudio.com/)

Once you are sure you have met the guidelines and have thoroughly tested all your changes you need to commit your changes.

[More on using VSCode with babylon.js](/divingDeeper/developWithBjs/vsCode)

## Adding files

When in doubt about where your files should be referenced then raise an issue in the Babyon.js repository or ask on the forum.

## Commit

This can be done in Visual Studio Code using the _source control icon_ on the left toolbar or with (Ctrl + Shift + G). After testing some files other than those you have added or edited will appear in the source control section of VSCode. For example changes to files in the `dist` folder. These should not be committed. Once you are ready to push to your repository these changes should be discarded. Only files you have actually changed or added should be in the commit.

![Discard](/img/contribute/discard.jpg)

When using a Git Client you should also check that you are only committing those file you have added or edited and not those produced in any testing build.

When using a CLI you need to add any files you have added or editing before committing them. So only add those files you have changed. The full path to the files from the current directory has to be used.

For example in the top directory

```bash
git add path to file/file1.ts path to file/file2.ts path to file/file3.ts
git commit path to file/file1.ts path to file/file2.ts path to file/file3.ts -m "Description of Changes"
```

![Commit top Folder](/img/contribute/commit1.jpg)

and in the directory containing file1.ts, file2.ts, file3.ts

```bash
git add file1.ts file2.ts file3.ts
git commit file1.ts file2.ts file3.ts -m "Description of Changes"
```

![Commit in Folder](/img/contribute/commit2.jpg)

[An alternative way](#do-not-commit) of ignoring the files changed during the testing build can also be found on this page.

## Testing and Dependencies

In order to carry out the testing the distribution Javascript files have to be compiled and a server set up to carry out the tests. This requires the Typescript compiler and Gulp build tools. These are installed using npm, the package manager of Node.js. Installing Node.js also installs npm.

### Install Node.js and NPM

Node.js and npm can be installed from the [Node.js home page](https://nodejs.org/en/).

The package manager npm is updated regularly and often to test Babylon.js you will need the latest version. To update to the latest version in you CLI

```bash
npm install -g npm@latest
```

the `g` installs npm globally so you can use it in any folder

### Install Typescript and Gulp

Install these using your CLI

```bash
npm install -g typescript
npm install -g gulp@4.0.0
```

At the time of writing the version of Gulp needed was 4.0.0. The current [What's New](//doc.babylonjs.com/whats-new) should indicate if there have been any changes of version. You can also look in the Babylon.js repository for `package.json` in `Tools/Publisher` which will give the version number for Gulp and Typescript.

### The Build

This only needs to be done once for a current version of Babylon.js, updates to npm or Gulp in later versions of Babylon.js may require you to update npm and Gulp on your local computer. After it is done any changes you make will be picked up automatically. Installing the npm applications in the directory takes quite a while and the Gulp build even longer so while Gulp is running is a good time to get a coffee or beverage of choice.

Any error messages that fail the build should be corrected.

In your CLI make sure your are in the directory `Babylon.js/Tools/Gulp` and enter

```bash
npm install
npm run build
```

The `npm install` places a number of files in the current directory (This is different to `npm -g install` which makes npm available in any folder)

The `npm run build` builds everything you need to test.

### Do Not Commit

During the build the `dist` folder continuously gets updated and its files changed. These modified files should not be committed by Git so they they are not pulled during a pull request. To ignore these files you can run the following in your CLI:

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

### Test and Debug

Should you be using VSCode then you can open the `Command Palette` either from the `View` menu or with (Ctrl + Shift + P) then begin to type `run` this takes you to the `Tasks:run` options, choose `Tasks:run` and type `run` in the box that opens up. Alternatively press (Ctrl + ') to open the terminal which is a CLI.

In any CLI make sure you are in the `Tools/Gulp` directory and type

```bash
npm run start
```

You can kill the task with (Ctrl + C)

When using VSCode you can also kill the task by opening the the `Command Palette` either from the `View` menu or with (Ctrl + Shift + P) begin to type `terminate` and choose the `Tasks: Terminate Task` option.

Also using VSCode there is a `Debug` tab on the menu. To use it with Babylon.js you need to install the chrome debugger extension, find out more from [Debugger for Chrome](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code).

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

As part of your testing process, it is highly recommended to launch the build validator: http://localhost:1338/tests/validation/index.html.
It will run several scenes against a reference image to detect any visual changes.

### Guidelines

A reminder to read the [contribution guidelines](https://github.com/BabylonJS/Babylon.js/blob/master/contributing.md).

## Pull-Request

Pull Requests are automatically validated. One check is for styling and you can check that quickly with `gulp tsLint`. If you are unsure, you can validate everything with a full build:

```bash
npm run build
```

When you are happy that all testing has been validated, guidelines followed, and only necessary files committed then push your local master to your origin github repository with your Git Client or from the CLI with

```bash
git push origin master
```

Once this has succeeded visit your Babylon.js repository

If all your commits are ahead of the upstream Babylon.js:master you can issue a pull request using the button shown below and follow the steps.

![Success](/img/contribute/pr1.jpg)

If some of your commits are behind the upstream Babylon.js:master

![fail](/img/contribute/pr2.jpg)

then you will need to to do a

```bash
git pull upstream master
```

and then push into your repository again.

## Check for Success

Once your `pull-request` has been issued then it needs to be checked, reviewed, approved and merged.

Some checks are carried out automatically and this can be found in the main BabylonJS/Babylon.js repository

Find your pull-request from the list and open it.

![check 1](/img/contribute/pr3.jpg)

Scroll down to the review panel

![check 1](/img/contribute/pr4.jpg)

Should there be any then a red cross indicates the area of failure. Click on details for more information.

Scroll down to the Stage 1 section

![check 2](/img/contribute/pr5.jpg)

In the above image you can see that this pull-request failed in `WhatsNewUpdate`. Probably because no entry was made in **dist/preview release/what's new.md**. It has passed the `DocumentationCheck` since all the comments have been entered as describe in [the formatting of comments for the API](/divingDeeper/developWithBjs/contributeToAPI#format-of-comments).

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

## Summary

### App Install

Node.js and Git

### Fork and Clone

![Fork and Clone](/img/contribute/summary1.jpg)

### Name Remotes and Pull

![Remotes](/img/contribute/summary2.jpg)

### Global Install

```bash
npm install -g typescript
npm install -g gulp@4.0.0
```

### Local Install

Babylon.js/Tools/Gulp folder

```bash
npm install
```

### Local Build

Babylon.js/Tools/Gulp folder

```bash
npm run build
```

### Webserver

Babylon.js/Tools/Gulp folder

```bash
npm run start
```

[Open Playground](http://localhost:1338/Playground/index-local.html)

## Repeat

### Edit

Change and save files including comments

### Test

Check if your code can be used in the local playground

## Success

Update `/dist/preview release/what's new.md` file.  
Commit files you have added or edited but not those built with npm run start

## Push Pull-Request Check

![Pull-Request](/img/contribute/summary3.jpg)
