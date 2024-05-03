---
title: Open A URL On An Event
image: 
description: Helpful code snippet for opening a url on an event in Babylon.js.
keywords: babylon.js, tools, resources, utilities, interaction, url, open
further-reading:
video-overview:
video-content:
---

## Open a URL with Action Manager

Since any Javascript can be called when executing code action with the action manager it is straight forward to open a new web page using 

```javascript
window.open(URL)
```
to open a new window or

```javascript
window.location = URL
```
to replace the content of the current window.

<Playground id="#INB624#1" title="Open URL On Single Mesh Click" description=""/>
<Playground id="#INB624#2" title="Open URL On Mesh Click Of Multiple Meshes" description=""/>
