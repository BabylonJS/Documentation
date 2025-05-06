---
title: Adding Major Changes to the Documentation
image:
description: Learn how to contribute to the Babylon.js Documentation.
keywords: diving deeper, contribution, contribute, open-source, oss, Documentation, docs, develop
further-reading:
  - title: Improve API Documentation
    url: /contribute/toBabylon/contributeToAPI
  - title: Mastering Markdown
    url: https://guides.github.com/features/mastering-markdown/
video-overview:
video-content:
---

## Major Changes

When a simple page edit is not enough, for example you want to add new pages or to run the documentation locally on your computer before pushing online, just to be sure nothing is broken then there are a number of steps to complete.

Requirements:

- [Github](https://github.com) account
- [git](https://www.git-scm.com/downloads)
- [Github Desktop](https://desktop.github.com/) (optional, but makes local git repositories easier to use)
- [node.js](https://nodejs.org/en/), we support node 16 and up.
- IDE such as VSCode

You will need know how to Fork the [Documentation](https://github.com/BabylonJS/Documentation) repository and Clone it onto your local system.

### Running and editing the doc locally

Using a CLI at the location of your local Documentation folder Run:

`npm install`

This will install the dependencies needed for the project. You can now Run:

`npm run dev`

This will launch the dev server on http://localhost:3000

Open the project using your favorite code editor. This can be done also from Github Desktop:

![visual studio](/img/contribute/documentation/further-visual-studio.png)

(_you may have_ Open in Atom _rather than_ Open in Visual Studio _, that's not a big deal_)

You can finally start to update the markdown files!

![visual studio](/img/contribute/documentation/further-editing.png)

### Adding new images

In case you have to create new illustrations, you need to send them on the Github repo into a specific folder: [`Documentation/public/img/`](https://github.com/BabylonJS/Documentation/tree/master/public/img).

So on your local fork, go to this `img` folder. You can see there are already a lot of folders, so try to use existing folders to put your new images if possible.

Let says you just create a new page, linked on `https://doc.babylonjs.com/features/divingDeeper/my_very_great_page`.

Here, you can create a `my_very_great_page` folder into the `/img/features/divingDeeper/` one, and put `my-wonderful-image.jpg` into it.

Then, on your markdown page, use this link pattern:

```markdown
![quick description (for accessibility)](/img/features/divingDeeper/my_very_great_page/my-wonderful-image.jpg)
```

Of course, try to keep the image size as small as you can (while keeping a good visual quality). Our build system will do its best to optimize the image nonetheless.

### Adding new pages

#### Page structure

Now that everything is working well, you may want to add new content. To do so, please open `/configuration/structure.json`.

This file is a catalog where you can reference new files added to the repo.

The file is a tree of documents, starting from the root page and going to the different sections. Each page can (but not must) have its own children.

For example, let's say we want to add this page. We know that our new page will be in the _Diving Deeper/Audio_ section:

```javascript
{
    "friendlyName": "Home Page",
    "content": "landing_pages/home",
    "children": {
    /* [...] */
    "divingDeeper": {
            "friendlyName": "Diving Deeper",
            "children": {
              /* [...] */
              "audio": {
                    "friendlyName": "Audio",
                    "children": {
                        "playingSoundsMusic": { "friendlyName": "Playing Sounds and Music", "children": {}, "content": "How_To/audio/Playing_sounds_and_music" },
                        // This is the place you will add your document
                    },
                    "content": "landing_pages/features/divingDeeperAudioLandingPage"
                },
            }
    }
    /* [...] */
}
```

Just add necessary information about your new page:

```javascript
/* [...] */
"documentKeyAndUrl": {
  "friendlyName": "A friendly title to your document",
  "children": {/* if any, children will contain the rest of the documents */},
  "content": "the markdown file that correlates to this document."
},
/* [...] */
```

Notice the object's key. This will be your new page filename (without markdown extension .md):
![new content](/img/contribute/documentation/further-new-content.png)

#### Page metadata

Each page can (but not must) have a metadata section, that provides further information for this page. This is important if you want the page to be visible when being searched.
The metadata section is a YAML, added to the top of the page:

```yaml
---
title: Page title, if you want to override the title from the structure file
image: A link to an image that will be used as this page's image
description: A short description for this page
keywords: comma-separated keywords for this page.
further-reading: A list of links to add at the end of this page. Can be internal or external links
video-overview: A youtube video id to show at the beginning of this page
video-content: a list of videos (youtube or files) to show at the end of the page.
---
```

For example, this is a part of the metadata in the node_material page:

```yaml
---
title: Node Material
image: /img/pageImages/nodeMaterial.jpg
description: The Node Material is a simple, highly customizable material that you can build yourself piece by piece. Combined with the powerful node-based editor, you can easily create stunning custom GPU shaders and FX for your Babylon.js scenes.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor
further-reading:
  - title: Dedicated NME Forum Examples
    url: https://forum.babylonjs.com/t/node-materials-examples/6048
  - title: 3 Tips For Getting Started Building Procedural Node Material Shaders
    url: https://babylonjs.medium.com/procedural-node-material-shaders-3-tips-for-getting-started-4089c1832dfc
  - title: Mesh shattering with baked physics
    url: https://babylonjs.medium.com/mesh-shattering-with-baked-physics-5b3f8f381743
  - title: Fighting Self-Doubt, with Water
video-content:
  - title: Node-Based Procedural Textures
    url: https://youtu.be/qqMuuSM7GvI
  - title: Creating Procedural Node Materials Through Code
    url: https://youtu.be/GrmVObi6caQ
  - title: Node Material Post Processes
    url: https://youtu.be/QTuL5raapQQ
  - title: Node Material Editor Particles!!!!
    url: https://youtu.be/fZvZMXDoVp4
  - title: Interactive Hex Tile Series
    url: https://www.youtube.com/playlist?list=PLsaE__vWcRamMC5oJwhrSj3x3jT9TWOPB
  - title: Unraveling Advanced Anisotropic Reflections
---
```

Everything in the metadata is optional and has a different value. However, it is always better to add as much information as possible. This will help people find and use the page. And this is the goal here!
The image provided will be used when sharing this link on sites supporting open graph, such as Facebook, Medium, Twitter, and so on. The default image is the Babylon.js logo.

#### Internal links

To link to an internal document, use its path from the root without adding the domain. For example:

```markdown
[Post Processes](/features/featuresDeepDive/postProcesses/usePostProcesses)
```

### Adding examples

It is always great to provide examples in your documentation page. By using the correct markdown, you can add playgrounds and NME, and they will be added automatically to the page's side menu.
To add a playground, add the following code:

```html
<Playground id="playgroundId" title="Playground title" description="A short description" image="Optional image url" />
```

The playground ID is the 6-character id, and the version number if needed. For example: `#Y642I8#2`.
The same applies to NME examples:

```html
<nme id="nmeId" title="NME title" description="A short description" />
```

This can be either inline or in a new line and will automatically add the external and example link.
An image will be generated for each playground without an image, so don't worry about screen-capturing your playground. Please commit those images along with your document!

### Adding media (videos and images)

To add a youtube link, use the youtube markdown tag:

```html
<Youtube id="qqMuuSM7GvI" />
```

To add an image, you can use the markdown annotation:

```markdown
![Particle choice](/img/how_to/Materials/particleMenu.png)
```

but you can also use the more advanced `<img/>` tag, that has more control over formatting, size and so on. As always, everything is optional, but very nice to have:

```html
<img src="internal link to image" title="Image title" alt="Similar to title" width="300" height="200" caption="Copyright (or any other) caption that will appear under the image" />
```

### Sending pull request

A Pull Request (PR) has to be made to integrate your modifications into the documentation.
You will first pull your local modifications into your online fork, then ask for merging your fork into the main repo.
In Github Desktop, you will see all of your modifications. Sometimes a file named `babylon.d.ts` will automatically be modified, but there's no problem to PR with it.
Add an explicit summary into the required field, and click to _Commit to master_:
![pushing](/img/contribute/documentation/further-pushing.png)
Then, click the _Push origin_ button:
![push](/img/contribute/documentation/further-push.png)
And go to your online Github repo. You can use Github Desktop for that:
![github](/img/contribute/documentation/further-github.png)
For now, your fork is updated online, having your last modifications.
Click the _New pull request_ button:
![github pull](/img/contribute/documentation/further-github-pull.png)
If no conflicts, you will be able to follow the same steps as we seen above in the [easy way](/contribute/contributeToDocs/easydoc) section.
Congratulation again, you're now a documentation master!

## Good Practices

### General

- if you're not familiar with markdown, you can read this short [Github guide](https://guides.github.com/features/mastering-markdown/)
- even if you're seeing just a tiny typo, feel free to do a pull request dedicated to it
- do one commit per tasks, a pull request can take into account multiple commits if needed
  - example: if you have two pages to modify, once the first page is edited, do a commit
- tables can be a great help for readability
- avoid the use of first person
- pay attention to spelling, grammar, and punctuation
- when you're not sure about a point, ask for proof-reading

### Images

- use and store images from the documentation FTP as much as possible, read [Adding new images](/contribute/contributeToDocs/addToDocs#adding-new-images)
- be careful about image size (tip: Photoshop has a "Save for the web" export)

### Code

- when showing a block of JavaScript or TypeScript, include the language name after the code block starting ticks to ensure syntax highlighting:
  ![markdown code](/img/contribute/documentation/markdown-code.png)
- when quoting a property in a sentence, you can use single _\`_ char (<kbd>Alt</kbd> + numpad <kbd>96</kbd>)
  - example: You can set the `roughness` of a PBR material to 1.

### Links

For links to other parts of the Babylon.js documentation and API, use relative links.
For example, use `[Load Files with Assets Manager](/contribute/contributeToDocs)` rather than `[Load Files with Assets Manager](https://doc.babylonjs.com/contribute/contributeToDocs)`

## Further Reading

Any articles, URLs, documents, and links that you'd like the reader to have as a reference on the page should go into the "further reading" metadata section at the top of the page. See [Page Metadata](#page-metadata) for more detail.
