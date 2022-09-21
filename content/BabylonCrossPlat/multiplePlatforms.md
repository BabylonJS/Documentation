---
title: Multiple Platforms
image:
description: Learn all using Babylon.js on multiple platforms.
keywords: diving deeper, cross-platform, platform
further-reading:
video-overview:
video-content:
---

Babylon.js can be used to build experiences on many different platforms for
all kinds of devices, and even provides
[ways to target multiple platforms simultaneously](/toolsAndResources/templateRepositories#the-template-repository-workflow)!
So, what are you making?

## Web App

The Web is Babylon's native habitat, and Babylon.js can be integrated into
just about any Web development workflow. Here are just a few of the
available recommended ways to build a Web app with Babylon.js.

- You could use the
  [Template Repository Workflow](/toolsAndResources/templateRepositories#the-template-repository-workflow)
  to develop your Babylon.js experience as a portable NPM package which
  could then be incorporated into all sorts of other projects.
- You could build a single-repo project focused specifically on
  Babylon.js, as exemplified by
  [this repo](https://github.com/RaananW/babylonjs-webpack-es6).
- You could package and deploy your Web app using
  [Ionic](https://ionicframework.com/), which will also allow you to
  target PWA and mobile app platforms. The
  [_Fruit Fallin'_ Dev Story](/guidedLearning/devStories/fruitFalling)
  illustrates a way to do this using the Template Repository Workflow.
- You could incorporate your experience into a larger pre-existing Web app
  built with technologies like
  [WordPress](https://wordpress.com/)
  and
  [React.js](https://reactjs.org/).
  The
  ["Vaporwear" Custom Experience Dev Story](/guidedLearning/devStories/vaporwearConfigurator)
  illustrates a way to do this using the Template Repository Workflow.

...just to name a few. If you'd like to discuss or have questions about a
particular option, we'd love to hear from you on
[the forum](https://forum.babylonjs.com/c/questions/)!

## Mobile App

There are several excellent ways to ship your Babylon.js experience in a
mobile app for Android or iOS. The following are a few of the best:

- [Ionic](https://ionicframework.com/), as mentioned above, is a great
  choice for targeting Web, PWA, and mobile platforms at the same time.
  The
  [_Fruit Fallin'_ Dev Story](/guidedLearning/devStories/fruitFalling)
  illustrates a way to do this using the
  [Template Repository Workflow](/toolsAndResources/templateRepositories#the-template-repository-workflow).
- For
  [React Native](https://reactnative.dev/)
  developers,
  [Babylon React Native](https://github.com/BabylonJS/BabylonReactNative)
  is specifically designed to make it as simple as possible to
  incorporate Babylon.js functionality directly into your React Native
  app. It's also possible to embed Web-targeting code into a WebView
  inside a React Native app.
- For developers who really need to get down to the metal,
  [Babylon Native](https://github.com/BabylonJS/BabylonNative) supports
  mobile platforms and allows the use of Babylon.js inside your entirely
  custom native applications, allowing for complete control of the
  app's entire technology stack.

If you're considering Babylon Native or Babylon React Native, you might
be interested in
[Babylon Native's own more detailed documentation](https://github.com/BabylonJS/BabylonNative/blob/master/Documentation/WhenToUseBabylonNative.md);
and, of course, any and all questions are welcome on
[the forum](https://forum.babylonjs.com/c/questions/).

## Desktop App

- Though it doesn't provide a native target for desktops,
  [Ionic](https://ionicframework.com/)
  still allows for the creation of apps "installable" on desktops in the
  form of PWAs, making this an excellent choice if you want to target
  everything at once. The
  [_Fruit Fallin'_ Dev Story](/guidedLearning/devStories/fruitFalling)
  illustrates a way to do this using the
  [Template Repository Workflow](/toolsAndResources/templateRepositories#the-template-repository-workflow).
- [Electron](https://www.electronjs.org/)
  is a great option for natively targeting desktop platforms in a similar
  way to how Ionic and React Native are great options for mobile
  platforms. Since Electron uses NPM, it also works well with the
  Template Repository Workflow.
- Developers who need full platform access or are trying to integrate
  Babylon.js into existing native applications may be best served by
  [Babylon Native](https://github.com/BabylonJS/BabylonNative),
  which supports all major desktop platforms and gives the developer
  complete control of the technology stack.

As mentioned above, you might be interested in
[Babylon Native's own more detailed documentation](https://github.com/BabylonJS/BabylonNative/blob/master/Documentation/WhenToUseBabylonNative.md)
if you're considering either Babylon Native or Babylon React Native;
and, as always, please don't hesitate to bring any questions you have to
[the forum](https://forum.babylonjs.com/c/questions/).

## ... and More

Of course, this list isn't comprehensive and these aren't the only kinds
of apps: there are
[VR apps](/divingDeeper/webXR),
[server-side apps](/advanced_topics/serverSide),
[multi-device apps](/guidedLearning/multiplayer/Colyseus),
and so many more possibilities that we could never hope to enumerate
them. Cross-platform support is a key objective for Babylon; so
no matter which or how many platforms your app needs to run on, we'd love
to hear about it and help make sure Babylon provides the tools you need
to succeed. Thanks for considering Babylon.js!
