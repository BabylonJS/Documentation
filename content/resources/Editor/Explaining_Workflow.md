---
title: Babylon.js Editor Workflow Boilerplate
image: 
description: A short guide to the recommended workflow for Babylon.js Editor.
keywords: welcome, babylon.js, editor
further-reading:
video-overview:
video-content:
---

![image](https://user-images.githubusercontent.com/954596/59084404-b697a280-88c0-11e9-959a-336c0b8d15e2.png)

> ** **
> - Author: *Jesse Harlin* (info[at]simiancraft.com)
> - Author Twitter: [*@5imian*](https://twitter.com/5imian)
> - Author Site: [jesseharlin.net](http://jesseharlin.net/)
> ** **


One of the most important things in working in the BabylonJs Editor system is a reliable and stable workflow. The purpose of this short guide is to jumpstart anyone with the BabylonJs Editor and adopt the recommended workflow.

Over the course of the next steps, we will be creating a project that can be run on the web where multiple scenes might exist. This is the sort of setup one might encounter if they are, for instance, making a video game with multiple levels or if they are working on a team where different folks might work on the art and the assets from the folks that are working on the code. However, even if you are responsible for every aspect of a project, or if your project doesn't have multiple scenes, this is still the ideal approach to structuring a project so that you can work comfortably with an editor.

In short here are our goals:

1. Create a scene, and demonstrate how to modify and save that scene.
2. Reopen that scene, make changes and resave.
3. Add another scene, and describe the process for managing more than one scene.
4. Use the editor to scaffold a web project and provision it to handle our scenes.
5. Be able to make changes to the scenes, and to the web project and maintain a proper sequence of events so that no work is lost and the workflow is comfortable.

The git repository of the boiletplate is available on GitHub here: https://github.com/simiancraft/BabylonJs-Editor-Workflow-Boilerplate

---

- [Babylon JS Editor Workflow Boilerplate](#babylon-js-editor-workflow-boilerplate)
  - [1. Create Your First Scene](#1-create-your-first-scene)
      - [Your First Clicks](#your-first-clicks)
      - [Set Up Folders](#set-up-folders)
      - [Small Change in the Mesh Inspector](#small-change-in-the-mesh-inspector)
      - [Checking Your Work](#checking-your-work)
      - [SideQuest: Make a Movie](#sidequest-make-a-movie)
      - [Save It!](#save-it)
  - [2. Iterate on that Scene.](#2-iterate-on-that-scene)
      - [Remove Documentation Plane and The Graph Tab](#remove-documentation-plane-and-the-graph-tab)
      - [Manipulate Orbs with the `Preview` Controls](#manipulate-orbs-with-the-preview-controls)
      - [Resave.](#resave)
  - [3. Make another new scene.](#3-make-another-new-scene)
      - [Add Skybox](#add-skybox)
      - [Save Your Work Thusfar](#save-your-work-thusfar)
      - [Put a Bird on it (adding a mesh)](#put-a-bird-on-it-adding-a-mesh)
      - [Verify Work Thus Far.](#verify-work-thus-far)
  - [4. Scaffold and provision a web project](#4-scaffold-and-provision-a-web-project)
      - [Scaffold basic project](#scaffold-basic-project)
      - [Verify basic project scaffold](#verify-basic-project-scaffold)
      - [Provision Multiscene Project](#provision-multiscene-project)
  - [5. The Final Workflow](#5-the-final-workflow)
      - [Workflow Tips](#workflow-tips)
      - [For Next time: What wasn't covered (but might come in the future)](#for-next-time-what-wasnt-covered-but-might-come-in-the-future)

---

## 1. Create Your First Scene

After Installing the BabylonJsEditor on your particular platform, open the editor.
![image](https://user-images.githubusercontent.com/954596/59078070-05364400-88a3-11e9-82d4-f05da127312c.png)

#### Your First Clicks

You should see something like the image above. This is the editor in a default state. If at any point you're concerned your editor is not in a default state, a handy tool is the reset button in the `edit` menu. You can click this now, or anytime you need to reset the editor into a default, 'vanilla' state.

![image](https://user-images.githubusercontent.com/954596/59078164-7118ac80-88a3-11e9-9933-5efb71480333.png)

The first thing we will do before we go very far is clicking the button to use the `Dark Theme`, which is also in the `Edit` menu, just above the reset button.

![image](https://user-images.githubusercontent.com/954596/59078304-1d5a9300-88a4-11e9-95e9-7df9f241cc5c.png)

This is just an aesthetic decision, but aren't you glad you did that? Dark Themes are awesome.

> ---
>
> **My Advice:** You can always bring up the debugger in an electron app with `CTRL + ALT + I`. Sometimes things break. You can try resetting the editor, reloading the scene, and opening the debugger to see what is happening. Also, don't [forget the helpful people in the Babylon forums as well!](https://forum.babylonjs.com)
>
> ---

#### Set Up Folders

Now we want to make some changes to this project, so we can be sure we're saving and loading the project correctly. Let's prepare the working directory.

1. First, make a folder in a place where you want to put your work. I made a folder called "`my-babylonjs-workflow-demo`". This is where we will be saving our entire project.
2. Inside of this folder, make another folder called `editor-projects`. This is where we are going to save the BabylonJs Editor Projects. This is the place the person or persons who work on the art and the scenes will be working iteratively.

Your folder structure thus far will look like this.
![image](https://user-images.githubusercontent.com/954596/59078492-ffd9f900-88a4-11e9-9bc3-2834b8ef1d23.png)

#### Small Change in the Mesh Inspector

Now let's make some trivial changes to the default project. I am going to assign new materials to each mesh in the scene for now. I can start this process by clicking the first sphere in the default project. When you do, you'll see a new menu open on the left. This is the `Inspector`. Now is a good time to briefly describe what this is.

![image](https://user-images.githubusercontent.com/954596/59078641-a6be9500-88a5-11e9-830b-6abb9498f5ba.png)

Here you can see, in the properties tab all the general properties of this mesh, such as its assigned material, Position, Rotation, Scaling and so on. The other tabs, expectedly control other aspects of this mesh. In the `Physics` you can configure things, such as collisions and in this case, the third tab says `StandardMaterial`, but in any case, this is the place where you can have a way to edit the underlying material that is on this mesh. Be aware this affects this material everywhere, and not just for this specific mesh. It is here for convenience, it is no different than going into the `Materials Viewer` and selecting a material there, which will be discussed later.

So for now, just click each sphere, and change the material to something. You can play with the other properties as well if you want to experiment. Here is my scene after doing this:

![image](https://user-images.githubusercontent.com/954596/59078888-c2766b00-88a6-11e9-813a-adc6a01c9ded.png)

I just changed the spheres to `Ground`. So they all look the same.

#### Checking Your Work

Let's say I wanted to do a quick test of this scene before I decide to save. No problem. Just click the `Play` Button at the top.

![image](https://user-images.githubusercontent.com/954596/59078933-fe113500-88a6-11e9-8853-8ada29c50d9d.png)

When you do, you'll see a window appear that plays the current scene. This is the `Game` Tab

![image](https://user-images.githubusercontent.com/954596/59079912-96111d80-88ab-11e9-92c9-7d11897e7f06.png)

You can see your scene now without the labels, and some basic information in a window, such as the current FPS and the size of the game window. You can use `WASD` and your mouse to fly around with the camera. This is how we think the scene will look.

#### SideQuest: Make a Movie

The `Game` tab has a cool feature. You can record a short scene with the camera, by clicking the record button that appeared.

![smallest-gif](https://user-images.githubusercontent.com/954596/59079773-e176fc00-88aa-11e9-98f9-f8822c662279.gif)

You can save this short video we made.
Click `Save Record`, which is a new option that appears next to the `Record` button.

![image](https://user-images.githubusercontent.com/954596/59079567-f901b500-88a9-11e9-8958-e30eb3b8bd0e.png)

Doing so you will output a nice quality .webm video that you can save locally.

[![image](https://user-images.githubusercontent.com/954596/59082997-2c990b00-88bb-11e9-917b-d24fd6d03371.png)](https://i.imgur.com/V0H8SpK.mp4)
[You can see the output of this little example here](https://i.imgur.com/V0H8SpK.mp4) (Hosted on Imgur)

#### Save It!

So far we've opened the editor. We've made a very tiny change to the meshes by reassigning some materials and we want to save our work. Let's decide to call this scene `Rainy-Day`. I will now make a folder inside of the `editor-projects` folder called `Rainy-Day`. So far, this seems excessively nested, but the reasoning will be clear as you read.

![image](https://user-images.githubusercontent.com/954596/59080066-69a9d100-88ac-11e9-8a51-19b27efe75e7.png)

Now you need to go to the Project Menu and click `Save Project As...`
![image](https://user-images.githubusercontent.com/954596/59080083-87773600-88ac-11e9-90e3-3f9ceff85fc1.png)

Make sure you select your newly created `Rainy-Day` folder and proceed. You should now have a folder structure like this

```bash
📁editor-projects
    📁Rainy-Day
        📁scene
        |   |📄 albedo.png
        |   |📄 amiga.jpg
        |   |📄 documentation.png
        |   |📄 environment.dds
        |   |📄 flake.bmp
        |   |📄 flare.png
        |   |📄 mahogfloor_ao.jpg
        |   |📄 mahogfloor_basecolor.png
        |   |📄 mahogfloor_normal.jpg
        |   |📄 rain.jpg
        |   |📄 reflectivity.png
        |   |📄 rustediron2_basecolor.png
        |   |📄 rustediron2_metallic.png
        |   |📄 rustediron2_normal.png
        |   |📄 rustediron2_roughness.png
        |   `📜 scene.babylon
        `📜 scene.editorproject

3 directories, 17 files
```

Inside of the `Rainy-Day` directory, there's the `scene` folder with the art and assets, and just above that is `scene.editorproject`.

![image](https://user-images.githubusercontent.com/954596/59080127-d1f8b280-88ac-11e9-8dd5-920a92263117.png)

Of special note are two files

1. 📜 `scene.babylon` - this is a simple JSON file that contains all the information about your scene, such as the meshes, cameras, lights and so on. This goes right alongside the assets, like the textures. As you manipulate the meshes and things in your scene, you're basically manipulating the contents of this file.

2. 📜 `scene.editorproject` - this is also a JSON file, and it contains information used by the _editor itself_. For instance, the manifest of the materials, not just what is in your scene, but everything you've provided to the editor thus far is in here. Similarly, the files list, global editor configurations, and the current state of the tools, such as what is open or closed, what theme you have and things like that. As you're clicking about in the editor, you're thusly manipulating the contents of this file.

I encourage you to open them both in your favorite editor (VS Code) and take a look.

## 2. Iterate on that Scene.

Close the editor.

Imagine you're another person working on the project. Or you're you later in the day after lunch. Time passes. We iterate.

Its time to reopen. Doubleclick the `scene.editorproject` file now!

![image](https://user-images.githubusercontent.com/954596/59081066-d1aee600-88b1-11e9-9d5f-eaf6cd4ee4ea.png)

The editor will reopen the scene, as expected.

![image](https://user-images.githubusercontent.com/954596/59080330-c2c63480-88ad-11e9-90a5-0d17e27592f6.png)

Voila! Just like you've left it!

Now we can make more small changes. I will

1. remove the documentation plane.
2. move and scale some of the orbs

#### Remove Documentation Plane and The Graph Tab

One way you can select something is to select it in the preview pane. Another way to do it is in the `Graph` Tab as well. Select the Documentation and hit `Delete`. Boom! it is gone.

![graph-optimized](https://user-images.githubusercontent.com/954596/59080871-b2638900-88b0-11e9-9a06-fc554037b05f.gif)

The graph tab seems less useful at this time with so few things, but it can be a really good way to find meshes with the search box and also to avoid any awkwardness with clicking around in the `Preview` Tab too.

As your scene grows, so does the utility of this tab.

#### Manipulate Orbs with the `Preview` Controls

One way to manipulate the qualities, such as position, scale. and rotation of assets in the scene is to select the item by clicking in it, or in the `Graph` Tab and then go to the corresponding property in the `Inspector` and just type in or select what you like. This is how we changed the Material on these spheres. There's another way to do it with the controls atop the preview.

I don't think there's much to say here, except this is exactly how any other 3d program behaves, such as Unity or Blender. Go ahead and modify these meshes and also notice the values change in the `Inspector` Tab as you do.

![preview-controls-optimized](https://user-images.githubusercontent.com/954596/59081276-dcb64600-88b2-11e9-889e-2c6de7da65ef.gif)

#### Resave.

You can, in this case, just click `Save Project` or CTRL+ S. However, when we begin to export to the web project as well as work in these scenes it might be a good idea to always use the `Save Project As ...` Option, so that you always explicitly target the correct folder and never accidentally stomp over the wrong project accidentally.

Great. This is the core iterative loop for working on a single scene. We took some time to look at some aspects of the editor in this part of the workflow tutorial because; thus far, the workflow is very simple. It only consists of our one single project.

1. Open Project: Double click the `scene.editorproject` file.
2. Do stuff: Make Changes.
3. Save: Project > `Save Project As ...`, in your named folder.
4. Repeat

Next, we will add another scene, before we explore how the process will be modified in the context of a web application that relies on this editor.

## 3. Make another new scene.

To make the pattern for scene management in a larger project more clear, it makes sense to also make a second scene, we can also cover some simple editor features.

This time we'll start with a totally new scene.

![image](https://user-images.githubusercontent.com/954596/59134808-2ef27800-8942-11e9-8fbb-35f47ca6ee69.png)

Select 'Yes'

![image](https://user-images.githubusercontent.com/954596/59134825-429dde80-8942-11e9-9f3c-6c21abe97b95.png)

The editor is in a completely blank state now, and looks like this:

![image](https://user-images.githubusercontent.com/954596/59134856-5fd2ad00-8942-11e9-9a25-b93d6f2ced38.png)

Let us add some stuff. Since we are in a completely "blank state", it might be useful to cover the ground and the sky, since many scenes use that.

#### Add Skybox

If you looked in the default scene beforehand, you might have noticed that the skybox was a special sort of Material and the file used has a `.dds` extension. The type of material is based on Physically Based Rendering (PBR), which is a really cool and powerful feature of BabylonJs. The full scope of this is outside the scope of this editor and workflow tutorial, but

You can also see a demo of the underlying material PBR Material type [here.](<[![image](https://user-images.githubusercontent.com/954596/59141279-63c8f400-896f-11e9-9f2a-177b451f069f.png)](https://www.babylonjs.com/demos/pbrglossy/)>)
[![image](https://user-images.githubusercontent.com/954596/59141279-63c8f400-896f-11e9-9f2a-177b451f069f.png)](https://www.babylonjs.com/demos/pbrglossy/)

Also, you can read more in the documentation here: https://doc.babylonjs.com/how_to/physically_based_rendering

Do you see all the reflections in the helmet and the materials and the added sense of realism? This is the power of PBR. In addition to that fancy helmet mesh, physical based modelling is great for Skyboxes.

I won't go into great detail about how to make or generate this file, but the short version is that you need a skybox and then you need a way to convert that skybox to the `.dds` format for consumption by BabylonJs. Skyboxes are plentiful on the internet, and one great tool that I used for this tutorial is the Spacescape software by Alex Peterson. Its basically a really cool (and free) piece of software specifically for making space-themed skyboxes.

[![space-thing](https://user-images.githubusercontent.com/954596/59141452-de474300-8972-11e9-9655-8dc7d3ef5700.gif)](http://alexcpeterson.com/spacescape/)

You can download this [here if you'd like to try it for yourself](http://alexcpeterson.com/spacescape/), or just get a skybox yourself somehow. Spacescape exports directly to .dds format, so it is great for testing out this workflow. The mode you need to pick on this particular tool is:

![image](https://user-images.githubusercontent.com/954596/59141888-7e549a80-897a-11e9-9cc7-3381cc2bc4d0.png)

1. pick a name
2. Single DDs Cube Map (\*.dds)
3. 512 is perfectly fine for this to demo, and 1024 looks even nicer!
4. pick SOURCE, the other formats seem to rearrange the faces of the skybox.

> ---
>
> **My Advice:** For now, avoid those really high-resolution texture outputs. The raw skybox is a big file, and we're just covering the workflow. Optimizing this asset, such as converting to a .env file is outside the scope of this tutorial. If you're still wanting to know this right now, read more here in the documentation:
>
> [Use a HDR environment (for PBR)](https://doc.babylonjs.com/how_to/use_hdr_environment),
> in particular the section [What is a .env (Tech Deep Dive)](https://doc.babylonjs.com/how_to/use_hdr_environment#what-is-a-env-tech-deep-dive)
>
> ---

Now we need to get this up and running. in your new scene, drag the file (mine is `space.dds`) into the `Texture Viewer` tab. When it appears in the list, you'll want to change the Texture 'Coordinates Mode' to `SKYBOX_MODE`

![image](https://user-images.githubusercontent.com/954596/59141965-c4f6c480-897b-11e9-8b00-fd77b03f1a49.png)

Now you will see your skybox projected onto a sphere in the editor. It should be seamless

![texture-viewer](https://user-images.githubusercontent.com/954596/59141974-f96a8080-897b-11e9-96e9-70a3698d9f44.gif)

Now we want to put this texture onto a Material. We will go to the Materials Viewer Tab and click the `+ Add...` Button that is right under the tab name.

![image](https://user-images.githubusercontent.com/954596/59142002-7dbd0380-897c-11e9-80a8-5bc81f92dd43.png)

When you do this a windows pops up and make sure to select PBRMaterial.

![image](https://user-images.githubusercontent.com/954596/59141995-6da52400-897c-11e9-83f1-64810e293129.png)

When you have the Material, change a couple of properties. Click the new Material and the Inspector Window will be open.

1. Rename the Material to something useful, like `SpaceBox`

   ![image](https://user-images.githubusercontent.com/954596/59149092-d1f4d180-89d6-11e9-9b37-10d3630bc798.png)
   You need this to be readable, so you can find it in other places, like when assigning it to a Mesh.

2. We need to Turn Off `Back Face Culling`.

   ![image](https://user-images.githubusercontent.com/954596/59149117-25671f80-89d7-11e9-8930-2c1881bed257.png)
   This is what makes the material visible on the inside of the cube, when its surrounding you, so its a very important thing. At the very bottom of the Inspector, there's a checkbox in the Options accordion menu

3. Assign the actual texture!

   ![image](https://user-images.githubusercontent.com/954596/59149120-3879ef80-89d7-11e9-892e-eac22e6d26f0.png)
   Just select the `.dds` file you added in the `Reflection Texture` property in the `Reflection` accordion menu of the `Inspector`.

Now, Just as it was with the `Texture Viewer`, you should see your sphere in the `Materials Viewer` showing the right texture.

Congratulations. This is basically the process for making materials in the editor.

1. Import Textures
2. Add a Material
3. Configure both; especially assign the right texture to the material.

We're almost done with a skybox. We need to add a new Cube to the scene. Click `+ Add` in the top menu and when the flyout menu appears, select `Cube Mesh`.

![image](https://user-images.githubusercontent.com/954596/59149014-a32a2b80-89d5-11e9-9762-2d9725e02888.png)

At this point, you now should see a small gray cube in the scene and two materials in the `Materials Viewer`. The material called `default material` was added alongside the cube.

Next, we need to make this cube much larger to house the scene. In the Inspector window for the cube, look in the Properties tab. Inside there you want to change the scaling to something large, like 500 x 500 x500.

![image](https://user-images.githubusercontent.com/954596/59149061-7296c180-89d6-11e9-8891-97bc9da77cf7.png)

At this point, you will simply have a large gray cube all around you. We need to take small additional steps to make it look like a Skybox. Select the Cube in either the `Graph` tab or just in your `Preview` tab. Now in its inspector:

1. give it a sensible name. I named mine `SkyboxSpacescape`
2. Assign the `SpaceBox` Material to the cube.

![image](https://user-images.githubusercontent.com/954596/59150535-d1fecc80-89ea-11e9-9edb-1cb40a5b2ecf.png)

Now you should see the skybox all around you! run the game preview tab and take a look! It looks nice!

![space-scape](https://user-images.githubusercontent.com/954596/59150588-7bde5900-89eb-11e9-8006-6c1eb931087a.gif)

#### Save Your Work Thusfar

We have a simple scene with only one skybox, and its a good time to save this scene. Just as before, Save this into its own folder, with a sensible name in the folder called `editor-projects`. I just called mine `Space-Scene`. Your entire project directory structure thus far will look (probably) like this:

```bash

`📁 editor-projects
    📁 Rainy-Day
    |   📁 scene
    |   |   |📄 albedo.png
    |   |   |📄 amiga.jpg
    |   |   |📄 documentation.png
    |   |   |📄 environment.dds
    |   |   |📄 flake.bmp
    |   |   |📄 flare.png
    |   |   |📄 mahogfloor_ao.jpg
    |   |   |📄 mahogfloor_basecolor.png
    |   |   |📄 mahogfloor_normal.jpg
    |   |   |📄  rain.jpg
    |   |   |📄 reflectivity.png
    |   |   |📄 rustediron2_basecolor.png
    |   |   |📄 rustediron2_metallic.png
    |   |   |📄 rustediron2_normal.png
    |   |   |📄 rustediron2_roughness.png
    |   |   `📜 scene.babylon
    |   `📜 scene.editorproject
    📁 Space-Scene
        |-- scene
        |   |📜 scene.babylon
        |   `📄 space.dds
        `📜 scene.editorproject

```

As you add more projects, they file in just like this in this editor-projects directory. You can just double click the `scene.editorprojet` icons here to flip-flop back and forth between the scene you're working on.

> ---
>
> **My Advice:** As you are switching between these projects, at the time of writing this tutorial I want to remind you to pay special attention to always use the `Export Project As ...` option. Be very careful not to write over the wrong project. This will be even more important when we start exporting our scenes for the web application to consume. Just be explicit each time, and no tears will be shed.
>
> ---

#### Put a Bird on it (adding a mesh)

Since our second scene is literally only a skybox, I think its probably a good idea to add just one more thing into the scene before we start to go into the workflow related to managing scenes in the context of a web project you plan to publish.

The folks working on Babylon have provided some really nice meshes that are basically ready-to-go that we can experiment with. Since this tutorial is more about workflow and less about making your own custom meshes, we can just use one of these.

The easiest way to get the meshes is to look at the CDN and just download it. That CDN is `https://models.babylonjs.com/`, and it holds meshes in a variety of formats (including .babylon). You can read more about Mesh type support [here](https://doc.babylonjs.com/how_to/load_from_any_file_type) when you feel like you need to know more. There is a page that lists every mesh that's available to work with

- [https://doc.babylonjs.com/resources/meshes_to_load](https://doc.babylonjs.com/resources/meshes_to_load)

Also, if you already work in a program for mesh creation, such as Blender, 3ds Max, Cheetah 3d and so on, there's probably an exporter you can install to make this very easy for you. There's a bunch of articles on this in the [Resources](https://doc.babylonjs.com/resources/) section of the BabylonJs Docs.

[![image](https://user-images.githubusercontent.com/954596/59151226-12fbde80-89f5-11e9-8e12-fd25c8d7b032.png)](https://github.com/BabylonJS/Exporters)
The short version is, look in [this repo](https://github.com/BabylonJS/Exporters) to see if there's an exporter for your favorite mesh editor. It is probably supported.

> ---
>
> **My Advice:** The editor supports many types of textures, but after working with it for some time, the only format I am recommending you use (in the short term) is the `.babylon` format. You can see more [in this thread](https://forum.babylonjs.com/t/babylonjs-editor-importing-meshes-working-lifecycle/3770). This is fine if you are going to be using `.babylon` exporters in your mesh editor of choice
>
> ---

We have a space-scene, so let us add a space-dude. In order to do this, you will need the `.babylon` file, which is a JSON file describing the mesh as well as all the textures. Here is an example of this mesh in a Babylon playground.

- PG: <Playground id="#NA2WKW" title="Head from the Playground" description="Example of asset" image=""/>

Here are all the assets you need, download them all somewhere.

**Dude.babylon**

- Mesh: https://www.babylonjs-playground.com/scenes/Dude/Dude.babylon
- Asset: https://www.babylonjs-playground.com/scenes/Dude/0.jpg
- Asset: https://www.babylonjs-playground.com/scenes/Dude/1.jpg
- Asset: https://www.babylonjs-playground.com/scenes/Dude/2.jpg
- Asset: https://www.babylonjs-playground.com/scenes/Dude/3.jpg

I would put them all in a folder called 'Dude' on your computer. Like this:
![image](https://user-images.githubusercontent.com/954596/59163223-b6b3c000-8ac3-11e9-875c-96f5e788eec0.png)

Here comes the hard part. After you download the file and the assets.. you drag them all into the editor and click `yes` on the prompt.
![dragdude-2](https://user-images.githubusercontent.com/954596/59163281-69841e00-8ac4-11e9-9046-abe766eef6f2.gif)

- There are a lot more Textures in the `Texture viewer`!
  ![image](https://user-images.githubusercontent.com/954596/59163440-f4feae80-8ac6-11e9-9489-ca185c3facd9.png)
- Same with the `Material Viewer`
  ![image](https://user-images.githubusercontent.com/954596/59163433-d26c9580-8ac6-11e9-9a9c-a3873da9c43b.png)
- There's a new node in the `Graph`
- They might be extra cameras in the `Graph`, you can delete them. You want something like this:
  ![image](https://user-images.githubusercontent.com/954596/59163410-79046680-8ac6-11e9-8fdb-f2aecacfd21f.png)
- There's a Mesh in the `Preview` tab.

Test this with the `play` button, and save it as we have been.
![fly-dude](https://user-images.githubusercontent.com/954596/59163473-5888dc00-8ac7-11e9-8b6b-00a103e9bd71.gif)

#### Verify Work Thus Far.

- Open and close both projects
- Review your folder structure, it should be like this

```bash
📁 editor-projects
    📁 Rainy-Day
    |   📁 scene
    |   |   |-- albedo.png
    |   |   |-- amiga.jpg
    |   |   |-- documentation.png
    |   |   |-- environment.dds
    |   |   |-- flake.bmp
    |   |   |-- flare.png
    |   |   |-- mahogfloor_ao.jpg
    |   |   |-- mahogfloor_basecolor.png
    |   |   |-- mahogfloor_normal.jpg
    |   |   |-- rain.jpg
    |   |   |-- reflectivity.png
    |   |   |-- rustediron2_basecolor.png
    |   |   |-- rustediron2_metallic.png
    |   |   |-- rustediron2_normal.png
    |   |   |-- rustediron2_roughness.png
    |   |   `📜 scene.babylon
    |   `📜 scene.editorproject
    `📁 Space-Scene
        📁 scene
        |   |-- 0.jpg
        |   |-- 1.jpg
        |   |-- 2.jpg
        |   |-- 3.jpg
        |   📜  Dude.babylon
        |   📜 scene.babylon
        |   `-- space.dds
        `📜 scene.editorproject
```

## 4. Scaffold and provision a web project

Now we want to establish the other half of our project, the part that will run in the context of a web application.

#### Scaffold basic project

Make a folder at the root of the project called `web-project` this is where all this work will go.

![image](https://user-images.githubusercontent.com/954596/59164660-a0aefb00-8ad5-11e9-9950-1c80636c0229.png)

Currently, this folder is empty. We need to scaffold the initial project that will go in here. Open the first project in the `Rainy-Day` folder. your scene should load right up as where you had left it. This time we will select a different menu option in the `Project` menu than before.

![image](https://user-images.githubusercontent.com/954596/59164670-dc49c500-8ad5-11e9-92ae-c19c760e7fdc.png)

1. Click `Export Project Template...`
2. select `.babylon` format, and hit `Ok`
3. navigate to the `web-project` fold you just created

Your folder structure will look like this now:

```bash
.
📁 editor-projects
|   📁 Rainy-Day
|   |   📁 scene
|   |   |   | (... assets)
|   |   |   `-- scene.babylon
|   |   `📜 scene.editorproject
|   `📁 Space-Scene
|       📁 scene
|       |   | (... assets)
|       |   `-- space.dds
|       `📜  scene.editorproject
📁  web-project
    |-- README.md
    |-- index.html
    |-- package.json
    📁  scene
    |   |-- albedo.png
    |   |-- amiga.jpg
    |   |-- documentation.png
    |   |-- environment.dds
    |   |-- flake.bmp
    |   |-- flare.png
    |   |-- mahogfloor_ao.jpg
    |   |-- mahogfloor_basecolor.png
    |   |-- mahogfloor_normal.jpg
    |   |📜 project.editorproject
    |   |-- rain.jpg
    |   |-- reflectivity.png
    |   |-- rustediron2_basecolor.png
    |   |-- rustediron2_metallic.png
    |   |-- rustediron2_normal.png
    |   |-- rustediron2_roughness.png
    |   `📜 scene.babylon
    📁 src
    |   `📜  game.ts
    `📜 tsconfig.json
```

Do you see that there's now a lot of new material sitting in the `web-project` folder? Additionally, there is a folder called `scene` that has dumped all the files from the `Rainy-Day` scene into here. There are some things to point out

- the `scene.babylon` is the same as the one in the `Rainy-Day`.
- there is no `scene.editorproject` file at all! There will never be one in this part of the file structure
- there is a new `project.editorproject` file that is not in the `editor-projects` folder. there will always be one of these in each scene in the `web-project` section and **not** in the `editor-projects` section of this whole big project.

This new `project.editorproject` holds some metadata that will be used in the web app that is not used in the editor. Its a different file for a different purpose, despite the fact the extension is the same extension.

#### Verify basic project scaffold

As it stands, this scaffold is not completely done and structured the way it will need to be structured to support multiple projects. Nonetheless, we can still run a quick test to make sure our work is correct thus far!

In the root of the `web-project` is where we will open a terminal. for the purposes of this tutorial, I am assuming a few things

1. you already have some familiarity with a javascript web project. You understand what a `package.json` is and what `node_modules` are. If you don't, spend some time to read up on that. The web is very full of good resources about this, and that's out of the scope of this tutorial.
2. your environment is already provisioned to run `node` and either `yarn` or `npm`. For this tutorial I am using `yarn`, but `npm` works just as well!

In the `web-project` directory run this command in a proper terminal:

```bash
yarn install && yarn build && yarn run webserver
```

This command will do the following:

1. `yarn install` - install your dependencies into the `node_modules` directory, as you'd expect
2. `yarn build` - create a distributable build of the _typescript files only_ in the `build` folder. This means it does not copy assets, just makes the javascript.
3. `yarn run webserver` - start up a static webserver on port `1338`. You can now see your project running on [`localhost:1338`](http://localhost:1338/).

![localhost-optimized](https://user-images.githubusercontent.com/954596/59164861-7f9bd980-8ad8-11e9-97b3-36d5cd648480.gif)
Check [`localhost:1338`](http://localhost:1338/), you should see your scene working.

#### Provision Multiscene Project

We are getting close to establishing our final workflow for a web project with multiple scenes. Now we need to provision our project to support multiple scenes.

1.  simply delete `web-project/scene`. We are going to replace this.
2.  In its places add a new empty folder called `scenes`.
3.  Inside of scenes, make two empty folders that mirror the contents of `editor-projects` Don't just copy the folders over, we need to make two actually empty folders.
    - make `web-project/scenes/Rainy-Day`
    - make `web-project/scenes/Space-Scene`

Now our project is basically laid out correctly, but we need to actually put the needed scene assets and files in these projects. We are going to open them and export them one at a time. Now if your editor is open, just close it so you're starting in the same state as this tutorial.

1. navigate to `editor-project/Rainy-Day` and double-click the `scene.editorproject` to open this in the BabylonJs Editor as we have in the past.
2. Visually verify you're in the right scene:

![image](https://user-images.githubusercontent.com/954596/59164964-ed94d080-8ad9-11e9-9e0b-389fe87b1c88.png)

3. From the Menu click `Scene` > `Export Final Scene And Assets ...`

![image](https://user-images.githubusercontent.com/954596/59164967-ff767380-8ad9-11e9-95ff-448b1eebe673.png)

4. Select the `.babylon` format, and click `OK`

5. carefully navigate into `web-project/scenes` and choose the `Rainy-Day` folder and Click `Select Folder`

![image](https://user-images.githubusercontent.com/954596/59164991-4e240d80-8ada-11e9-939e-8a51e2add9f6.png)

6. Verify the scene was exported. Your `web-project` will look like this:

```bash
|-- README.md
|📁 build
|   `-- src
|       |-- game.js
|       `-- game.js.map
|-📁 declaration
|   `-- src
|       `-- game.d.ts
|-- index.html
|📁 node_modules
|-- package.json
|📁 scenes
|   📁 Rainy-Day
|   |   |-- albedo.png
|   |   |-- amiga.jpg
|   |   |-- documentation.png
|   |   |-- environment.dds
|   |   |-- flake.bmp
|   |   |-- flare.png
|   |   |-- mahogfloor_ao.jpg
|   |   |-- mahogfloor_basecolor.png
|   |   |-- mahogfloor_normal.jpg
|   |   |📜 project.editorproject
|   |   |-- rain.jpg
|   |   |-- reflectivity.png
|   |   |-- rustediron2_basecolor.png
|   |   |-- rustediron2_metallic.png
|   |   |-- rustediron2_normal.png
|   |   |-- rustediron2_roughness.png
|   |   `-📜 scene.babylon
|   `📁 Space-Scene
|-📁 src
|   `-- game.ts
|-- tsconfig.json
`-- yarn.lock
```

Do this exact same process again for `Space-Scene`. Be careful to navigate to the correct directory.

Notice the `scenes` folder is a little different from the ones in `editor-projects`?

The nesting is a little different.
Your project needs to resemble this:

```bash
📁 editor-projects
|   📂 Rainy-Day
|   |   📂 scene
|   |   |   |-- (assets)
|   |   |   `-📜 scene.babylon
|   |   `-📜 scene.editorproject
|   `📂 Space-Scene
|       📂 scene
|       |   |-- (assets)
|       |   `-📜 scene.babylon
|       `-📜 scene.editorproject
`📁 web-project
    📁 build
    📁 declaration
    |   `-- src
    |       `-- game.d.ts
    |-- index.html
    📁 node_modules
    📁 package.json
    📁 scenes
    |   📂 Rainy-Day
    |   |   |-- (assets)
    |   |   |📜 project.editorproject
    |   |   `📜 scene.babylon
    |   `📂 Space-Scene
    |       |-- (assets)
    |       |📜 project.editorproject
    |       `📜 scene.babylon
    📁 src
    |   `-- game.ts
    |-- tsconfig.json
    `-- yarn.lock
```

- In the editor Projects: The Scenes have a `scene.editorproject` at the root, all assets in a `scene` folder.
- In the web project scenes: The structure is flat, and there is instead a `project.editorproject`.

Now that this is done, we need to make changes to our `game.ts` to handle the new structure.

Right, before making any changes now your `game.ts` looks like this:

```ts
import {
  Engine,
  Scene,
  SceneLoader,
  Tools,
  Vector3,
  CannonJSPlugin
} from "babylonjs";

import { Extensions } from "babylonjs-editor";

export default class Game {
  // Public members
  public engine: Engine;
  public canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("renderCanvas")
  );

  public scene: Scene = null;

  /**
   * Constructor
   */
  constructor() {
    // Create engine
    this.engine = new Engine(this.canvas, true, {
      // Options
    });

    // Events
    window.addEventListener("resize", () => this.engine.resize());
  }

  /**
   * Runs the game
   */
  public run(): void {
    // Load Scene
    SceneLoader.Load(
      "./scene/",
      "scene.babylon",
      this.engine,
      (scene: Scene) => {
        this.scene = scene;

        // No camera?
        if (!this.scene.activeCamera) {
          this.scene.createDefaultCamera(false, true, true);
        }

        // Attach camera
        this.scene.activeCamera.attachControl(this.canvas, true);

        // Load extensions
        Tools.LoadFile("./scene/project.editorproject", (data: string) => {
          // Apply extensions (such as custom code, custom materials etc.)
          Extensions.RoolUrl = "./scene/";
          Extensions.ApplyExtensions(this.scene, JSON.parse(data));

          // Run render loop
          this.engine.runRenderLoop(() => {
            this.scene.render();
          });
        });
      }
    );
  }
}
```

I want to draw attention to a couple of particular spots, to understand this file a little more than the comments explain.

```ts
  constructor() {
    // Create engine
    this.engine = new Engine(this.canvas, true, {
      // Options
    });

    // Events
    window.addEventListener("resize", () => this.engine.resize());
  }
```

This is the constructor, and there's not much to it, except it creates the engine and also makes the engine work with resizing the window.

```ts
SceneLoader.Load(
  "./scene/",
  "scene.babylon",
  this.engine,
  (scene: Scene) => {
    this.scene = scene;
  }

  //..other stuff
);
```

In this closure, we essentially run the scene when the Game is done with the constructor. Right now, you can see this is clearly pointing to the wrong place, its pointing to the way the folders looked before we changed things. When this works this will be responsible for things like

- meshes
- cameras
- lights
- scaling, positioning
- locations of assets, like textures, etc.

```ts
// No camera?
if (!this.scene.activeCamera) {
  this.scene.createDefaultCamera(false, true, true);
}

// Attach camera
this.scene.activeCamera.attachControl(this.canvas, true);
```

This is just some code to make sure the camera is there and works. If for some reason you saved a scene without an active camera it will make one for you.

```ts
Tools.LoadFile("./scene/project.editorproject", (data: string) => {
  // Apply extensions (such as custom code, custom materials etc.)
  Extensions.RoolUrl = "./scene/";
  Extensions.ApplyExtensions(this.scene, JSON.parse(data));

  // Run render loop
  this.engine.runRenderLoop(() => {
    this.scene.render();
  });
});
```

After the scene is loaded, this is the second async event in the boilerplate. We then need to load that `project.editorproject` file, and then it basically decorates the scene with some additional information in this file. This file is responsible for things like

- particles
- prefabs
- post processing
- metadata about the scene

finally, after these two sequential file loads, we can begin to render.

So basically the process is to

1. initialize the engine
2. load the scene THEN
3. handle 'mistakes'/ default stuff for a scene
4. load the .editorproject meta-data
5. decorate the scene with metadata
6. actually begin rendering

Replace your `game.ts` with this:

```ts
import {
  CannonJSPlugin,
  Engine,
  Scene,
  SceneLoader,
  Tools,
  Vector3
} from "babylonjs";

import { Extensions } from "babylonjs-editor";

export default class Game {
  public engine: Engine;
  public canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("renderCanvas")
  );

  public scene: Scene = null;
  constructor() {
    this.engine = new Engine(this.canvas, true, {});
    window.addEventListener("resize", () => this.engine.resize());
  }

  public run(): void {
    const rainyDay = `./scenes/Rainy-Day/`;
    const spaceScene = `./scenes/Space-Scene/`;
    let currentScene = rainyDay;

    SceneLoader.Load(
      `${currentScene}`,
      "scene.babylon",
      this.engine,
      (scene: Scene) => {
        this.scene = scene;

        if (!this.scene.activeCamera) {
          this.scene.createDefaultCamera(false, true, true);
        }

        this.scene.activeCamera.attachControl(this.canvas, true);

        Tools.LoadFile(
          `${currentScene}/project.editorproject`,
          (data: string) => {
            Extensions.RoolUrl = currentScene;
            Extensions.ApplyExtensions(this.scene, JSON.parse(data));
            this.engine.runRenderLoop(() => {
              this.scene.render();
            });
          }
        );
      }
    );
  }
}
```

This is quite similar to before with a small change. We added the correct path to the two scenes. If your webserver was running, end it and run `yarn build && yarn run webserver` to rebuild and check the new paths.

Go ahead and check, Rainy-Day should load.

![image](https://user-images.githubusercontent.com/954596/59168147-2b095600-8afa-11e9-8e39-fb453339f4e8.png)

Stop the server. Now change `currentScene` to the `Space-Scene`. `yarn build && yarn run webserver`

```ts
const rainyDay = `./scenes/Rainy-Day/`;
const spaceScene = `./scenes/Space-Scene/`;
let currentScene = spaceScene;
```

Check the Space Scene. Use `F12` to open the inspector. If you get the same scene from before check a few things

- make sure the build script is actually cleaning out the right folder with `rimraf`
- make sure to disable caching in the inspector
  ![image](https://user-images.githubusercontent.com/954596/59168991-f3041200-8afd-11e9-8b0c-928b7186c8de.png)

## 5. The Final Workflow

Now, henceforth, you should follow this workflow carefully.

1. To open a scene, always double click the `scene.editorproject` in the right scene folder in the `editor-projects`
2. Also, start up the webserver from the `web-project` directory.
3. Make whatever changes you wish in the editor. When it looks right in the editor
   - carefully use `Project` > `Save Project As...` and navigate to the Scene folder in `editor-projects`
   - use `Scene` > `Export Final Scene and Assets...` and navigate to the Scene folder in `web-project`

#### Workflow Tips

- _Never_ try to load from the files in the `web-project`
- the files in the `web-project` are effectively are _output only_. It is essentially no different than a build folder.
- If the artists wish to keep multiple versions of scenes, then it is their responsibility to make the right folders in the `editor-projects`.
- Exporting to the `web-project` will show changes in the web-app right away, but if you close the editor before you saved in `editor projects` your changes might be gone. If you like what you see, carefully export to both.
- Honestly? Don't use `CTRL + S` if you are switching between projects, or if you are working in the editor project and periodically exporting to the web-project. The GUI/path always remembers whatever was used last. You might stomp over a project, that or accidentally save your editor-project stuff in the web-project. Just Always use `Save As...` until this is changes.

#### For Next time: What wasn't covered (but might come in the future)

- How to access and manipulate things in the scene.babylon from the game.ts (code-first).
- How to change scenes, like in a video game.
