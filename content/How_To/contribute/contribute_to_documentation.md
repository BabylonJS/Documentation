---
title: Contribute To The Documentation
image: 
description: Learn how to contribute to the Babylon.js Documentation.
keywords: welcome, babylon.js, diving deeper, contribution, contribute, open-source, oss, Documentation, docs, develope
further-reading:
    - title: Improve API Documentation
      url: /divingDeeper/developWithBjs/contributeToAPI
    - title: Mastering Markdown
      url: https://guides.github.com/features/mastering-markdown/
video-overview:
video-content:
---

Since the engine is constantly evolving, you may notice some gaps in the documentation. You're going to know how to fix that!

## The easy way

Requirements: you just need a [Github](https://github.com) account.

To update an existing page, just head to https://github.com/BabylonJS/Documentation/tree/master/content

This folder is the root of all static content used by the site itself.

Then pick a page you want to update and select the edit button:

![quick edit](/img/contribute/documentation/easy-edit.png)

You can now [use markdown](https://guides.github.com/features/mastering-markdown/) to edit the documentation page.

Once done, try to quickly explain what your modification is for, and click on the _Propose file change_ button:

![propose file change](/img/contribute/documentation/easy-submit.png)

For now, your modification isn't yet in the main files. You have to ask to BabylonJS core team to validate and merge your work.

Press _Create pull request_ button:

![sending pull](/img/contribute/documentation/easy-pull.png)

If needed, modify your comment, and press again _Create pull request_ button:

![commenting pull](/img/contribute/documentation/easy-pull2.png)

Congratulations, your modifications are now waiting to be validated and merged into the official documentation!

![pull now waiting](/img/contribute/documentation/easy-pull-waiting.png)

Do not hesitate to read [Good Practice](/divingDeeper/developWithBjs/contributeToDocs#good-practices) section.

## Deeper Changes

Sometimes, quick edits like above are not sufficient. Indeed, you might want to run the documentation locally on your computer before pushing online, just to be sure nothing is broken.

Requirements:

- a [Github](https://github.com) account
- [git](https://www.git-scm.com/downloads)
- [Github Desktop](https://desktop.github.com/) (optional, but makes local git repositories easier to use)
- [node.js](https://nodejs.org/en/)

## Forking

Start by going to the main BabylonJS [Documentation](https://github.com/BabylonJS/Documentation) repository and clicking on the _Fork_ button:

![fork](/img/contribute/documentation/further-fork-creation.png)

This will make a copy of the repository, but on your account.

Click on _Clone or download_ button, and _Open in Desktop_:

![open locally](/img/contribute/documentation/further-open-desktop.png)

Github Desktop will be opened and ask you where you want to save your fork.

When the files are downloaded, open a command in this repo. It can be done quickly using Github Desktop menu:

![powershell](/img/contribute/documentation/further-powershell.png)

(_you may have_ Open in Command _rather than_ Open in PowerShell _, that's not a big deal_)

You need 'npm', 'grunt' and 'grunt-cli' installed in the directory and you may need to update these from time to time.

Just write `npm install`, press enter and wait the operation to be done.

You may also need to install grunt globally. If so, use `npm install -g grunt-cli`.

This fork operation has to be done only once. You're now able to run locally the documentation by following the next section.

## Running and editing the doc locally

** We currently support Node 10 and down. Local build will fail with node 12 and up **

In the powershell window at the root of the documentation repo, send a:

`npm run build`

command and wait. Should the build not occur try `npm install`, or updating `npm`, `grunt`, and `grunt-cli`.

When it's done, use:

`npm run serve`

This will launch the local documentation website on http://localhost:8080

Open the project using your favorite code editor. This can be done also from Github Desktop:

![visual studio](/img/contribute/documentation/further-visual-studio.png)

(_you may have_ Open in Atom _rather than_ Open in Visual Studio _, that's not a big deal_)

You can finally starting to update the markdown files!

![visual studio](/img/contribute/documentation/further-editing.png)

## Adding new images

In case you have to create new illustrations, you need to send them on the Github repo into a specific folder: [`Documentation/public/html/img/`](https://github.com/BabylonJS/Documentation/tree/master/public/html/img).

So on your local fork, go to this `img` folder. You can see there are already a lot of folders, so try to use existing folders to put your new images if possible.

Let says you just create a new page, linked on `https://doc.babylonjs.com/how_to/my_very_great_page`.

Here, you can create a `my_very_great_page` folder into the `/img/how_to/` one, and put `my-wonderful-image.jpg` into it.

Then, on your markdown page, use this link pattern:

```
![quick description (for accessibility)](/img/how_to/my_very_great_page/my-wonderful-image.jpg)
```

Of course, try to keep image size as low as you can (while keeping a good visual quality).

## Adding new pages

Now that everything is working well, you may want to add new content. To do so, please open `/data/statics.json`.

This file is a catalog where you can reference new files added to the repo.

For example, let's say we want to add this page. We know that our new page will be in the _Contribute_ section:

```javascript
"How_To": [
    /* [...] */
    {
        "title": "Contribute",
        "name": "contribute",
        "desc": "Suporting and Developing the Framework",
        "files": [
            {
                "title": "Start Contributing to Babylon.js",
                "filename": "how_to_start"
            },
            {
                "title": "Follow Approved Naming Conventions",
                "filename": "Approved_Naming_Conventions"
            },
            /* [...] */
        ]
    }
    /* [...] */
]
```

Just add necessary information about your new page:

```javascript
/* [...] */
{
    "title": "Start Contributing to Babylon.js",
    "filename": "how_to_start"
},
{
    "title": "Improve Documentation",
    "filename": "contribute_to_documentation"
},
{
    "title": "Follow Approved Naming Conventions",
    "filename": "Approved_Naming_Conventions"
},
/* [...] */
```

Notice the filename field. This will be your new page filename (without markdown extension .md):

![new content](/img/contribute/documentation/further-new-content.png)

## Sending pull request

A Pull Request (PR) has to be made to integrate your modifications into the documentation.

You will first pull your local modifications into your online fork, then ask for merging your fork into the main repo.

In Github Desktop, you will see all of your modifications. Sometimes a file named `babylon.d.ts` will automatically be modified, but there's no problem to PR with it.

Add an explicit summary into the required field, and click to _Commit to master_:

![pushing](/img/contribute/documentation/further-pushing.png)

Then, click on _Push origin_ button:

![push](/img/contribute/documentation/further-push.png)

And go to your online github repo. You can use Github Desktop for that:

![github](/img/contribute/documentation/further-github.png)

For now, your fork is updated online, having your last modifications.

Click on _New pull request_ button:

![github pull](/img/contribute/documentation/further-github-pull.png)

If no conflicts, you will be able to follow the same steps as we seen above in the [easy way](/divingDeeper/developWithBjs/contributeToDocs#the-easy-way) section.

Congratulation again, you're now a documentation master!

## Good Practices

### General

- if you're not familiar with markdown, you can read this short [Github guide](https://guides.github.com/features/mastering-markdown/)
- even if you're seeing just a tiny typo, feel free to do a pull request dedicated to it
- do one commit per tasks, a pull request can take into account multiple commits if needed
  - example: if you have two pages to modify, once the first page is edited, do a commit
- tables can be a great help for readability
- avoid the use of first person
- pay attention to spelling, grammar and punctuation
- when you're not sure about a point, ask for proof-reading

### Images

- use and store images from the documentation FTP as much as possible, read [Adding new images](/divingDeeper/developWithBjs/contributeToDocs#adding-new-images)
- be careful about image size (tip: Photoshop has a "Save for the web" export)

### Code

- when showing a JavaScript block of code, inform Markdown that it's JavaScript to ensure syntax highlighting:

![markdown code](/img/contribute/documentation/markdown-code.png)

- when quoting a property in a sentence, you can use single _\`_ char (Alt + numpad 96)
  - example: You can set the `roughness` of a PBR material to 1.

### Links

- use lowercases on your url
  - example: `/how_to/` in place of `/How_To/`
- use relative links
  - example: `[Load Files with Assets Manager](/how_to/how_to_use_assetsmanager)` instead of `[Load Files with Assets Manager](https://doc.babylonjs.com/how_to/how_to_use_assetsmanager)`

## Further Reading

Any articles, urls, docs, links that you'd like the reader to have as reference for a doc page, should go into the further reading section of the metadata at the top of each page.