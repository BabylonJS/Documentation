---
title: Mixamo to Blender to Babylon.js
image:
description: The workflow for exporting from Mixamo to Babylon.js via Blender.
keywords: babylon.js, exporter, export, extension, workflow, Mixamo, Blender
further-reading:
video-overview:
video-content:
---

Interested in getting Adobe Mixamo characters into Babylon.js? Here's a handy guide to do just that!

Start by downloading and installing the [Blender to Babylon.js exporter](https://github.com/BabylonJS/BlenderExporter). Here are the [Installation instructions](/extensions/Exporters/Blender#installation).

From [Mixamo](https://www.mixamo.com), under Characters, select Y Bot. Download Y Bot with the following settings:

![image1](/img/exporters/mixamo/1.png)

Rename this file to ybot.fbx

In Mixamo, under Animations, choose the animations that you want to export (for this guide I chose punch and kick). Download the animations with the following settings:

![image2](/img/exporters/mixamo/2.png)

Rename these files to ybot@animation.fbx, e.g. ybot@punch.fbx and ybot@kick.fbx.

Open a new Blender 2.8+ scene, and delete all 3 default objects (cube, camera, and light).

In the Blender top menu, click File → Import → FBX (.fbx). In Operator Presets on the right, check Manual Orientation and Automatic Bone Orientation. Select ybot.fbx and then click Import FBX.

![image3](/img/exporters/mixamo/3.png)

Import ybot@punch.fbx and ybot@kick.fbx into Blender the same way you did ybot.fbx.

![image4](/img/exporters/mixamo/4.png)

Rename Armature to Character, and rename all animations, as shown in the image below (bordered red):

![image5](/img/exporters/mixamo/5.png)

Delete Armature.001 and Armature.002.

As shown in the image below (bordered red), select Character (top right), click in the center of the circle (bottom right) and drag up to create a new sub-window. Select Dope Sheet (bottom left) and Action Editor (next to it), and select an animation (middle), e.g. Kick. Click play (bottom middle) to play animation. If your character is not animating, maybe you didn't select Character (top right bordered in red). Also, make sure you're in Object Mode.

![image6](/img/exporters/mixamo/6a.png)

Change animation back to TPose from Kick. In Blender, press N, which opens the Transform tab. Note that Rotation is not all 0° and Scale is all 0.010 instead of 1.

![image7](/img/exporters/mixamo/7a.png)

As shown in the image below (bordered red), in Object Mode, press A to select all. Press S to scale. Type 100 to scale from 0.010 to 1.

![image8](/img/exporters/mixamo/8.png)

As shown in the image below (bordered red), press Ctrl + A to open the Apply menu. Click All Transforms. Location should all be set to 0, Rotation all to 0, and Scale all to 1.

![image9](/img/exporters/mixamo/9.png)

[Possibly useful resource](https://blender.stackexchange.com/questions/24839/how-do-i-resize-an-armature-without-ruining-its-poses)

We need to change the two materials, as shown in the image below. Something about them is incompatible with .babylon format.

![image10](/img/exporters/mixamo/10.png)

Click Alpha_Joints_MAT. As shown in the image below (bordered red), click Material Properties (bottom most), Browse Materials (slightly above), and select Material (slightly above). Do the same for Alpha_Body_MAT.

![image11](/img/exporters/mixamo/11.png)

You should be able to add custom colors and other material properties to Material.

In Blender top menu, click File → Export → Babylon.js ver 6.2.3. Click Export Babylon.js scene.

![image11b](/img/exporters/mixamo/11b.png)

Open your .babylon file in Notepad. Scroll to bottom, and paste the following text:

```
"autoAnimate": true,"autoAnimateFrom": 1,"autoAnimateTo": 152,"autoAnimateLoop": true,
```

before "instances":[]. Save your .babylon file.

![image12](/img/exporters/mixamo/12.png)

Go to [Babylon.js Sandbox](https://sandbox.babylonjs.com/). Drag your .babylon file into the browser.

autoAnimate lets your model animate automatically when dragged into the Babylon.js Sandbox. Why autoAnimateTo frame 152? According to the Sandbox animation and the image of the .babylon file below, all 3 animations (Kick, Punch, and TPose) take a total of 152 frames.

![image12a](/img/exporters/mixamo/12a.png)

So how do you trigger these animations in Babylon.js code? Check out PG: <Playground id="#BCU1XR#0" title="Animation Blending" description="Triggering Mixamo animations." isMain={true} category="Animation"/>

![image12c](/img/exporters/mixamo/12c.png)

Click the image below to see the final result!

[![finalVideo](https://img.youtube.com/vi/_f4z--WKsU4/0.jpg)](https://www.youtube.com/watch?v=_f4z--WKsU4)

Check out this Babylon.js Demo: [Dancers](https://www.babylonjs.com/demos/dancers/). In this demo, a .babylon model of the dancer is loaded just once! Its mesh and skeleton are cloned many times. The dance animation can be applied to each cloned skeleton separately whenever we choose!

All .fbx, .blend, and .babylon files are included in files/.
