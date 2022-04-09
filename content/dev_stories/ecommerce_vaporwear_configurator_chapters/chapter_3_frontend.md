---
title: Chapter 3 - Frontend
image:
description: A Dev Story about creating an e-commerce website with a 3D viewer/configurator built into the design.
keywords: e-commerce, ecommerce, react, vaporwear, viewer, configurator
further-reading:
video-overview:
video-content:
---

Related links:
[source](https://github.com/syntheticmagus/vaporwear-react-site-deployment/),
[draft site demo](https://syntheticmagus.github.io/vaporwear-react-site-draft/),
[final site demo](https://syntheticmagus.github.io/vaporwear-react-site-deployment/)

## Introduction: Edie

Based on Allan and Barnabas from Vaporwear's statement that they wanted a, 
"custom, modern Web frontend," it hadn't taken Edie long to decide to build
their new site using React.js. In fact, while the 3D parts of the design
were of a kind and scope Edie had never encountered before, the site itself
didn't need to be complicated at all: from what she'd discussed with Diane,
the 3D parts of the site would show up as a set of files and a private NPM 
package. On the whole, it sounded pretty easy, and it would work brilliantly
with a typical React.js development workflow.

Note: Because Dev Stories are not intended to be coding tutorials, the 
following sections gloss over implementation details in order to move
at a *very* fast pace. For specific information on how any particular
feature was done, the implementation can be inspected directly in the 
code, and specific Babylon questions are always very welcome on 
[the forum](https://forum.babylonjs.com/c/questions).

## Setting Up the Site

The "website" part of the new Vaporwear website didn't seem to require
anything particularly special -- it was, if anything, a rather simple
example of a modern single-page application -- so Edie was able to 
set up a rough draft of it even before receiving the 3D components by 
pretty closely following 
[React.js's own tutorial](https://reactjs.org/tutorial/tutorial.html).

1.  ```
    npx create-react-app vaporwear-react-site
    ```
1.  Using a logo from among the files provided by Allan from Vaporwear,
    Edie created components for simple header and footer bars.
    
    ![Header component](/img/devStories/vaporwearConfigurator/chapter_frontend/01_header_js_1_24.png)
1.  Similarly, she added quick drafts of the title and "byline" 
    components, the latter of which would hold the specific text callouts
    Allan had requested.
    
    ![Bylines](/img/devStories/vaporwearConfigurator/chapter_frontend/02_bylines.png)
1.  Since she didn't yet have the 3D components and wasn't exactly sure
    what form they would take, she decided *not* to create a component for
    that yet and instead just hold its spot with a placeholder.
    
    ![App.js draft](/img/devStories/vaporwearConfigurator/chapter_frontend/03_app_js_9_24.png)
1.  With the draft site working, she could have 
    [used the `gh-pages` NPM package to have easily hosted the site on GitHub pages](https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/)
    so that people could see it running live if they read about it as part
    of some kind of documentation narrative. This was a contracted 
    project, though, so she
    [definitely didn't do that](https://syntheticmagus.github.io/vaporwear-react-site-draft/).
    
    ![GitHub Pages hosting](/img/devStories/vaporwearConfigurator/chapter_frontend/04_github_pages.png)

This, of course, was only a rough draft of the site not including any
of the 3D elements. It showcased all the major concepts and components,
but it was pretty bland; Edie herself was curious to see how much it would
liven up once she could integrate the 3D experience.

## Integrating the 3D Experience

1.  When the 3D experience was ready, it came in the form of a private
    NPM package and a handful of 3D art files. Regarding the files, Diane
    had said to, "Just put them somewhere accessible and tell the 
    `VaporwearExperience` how to find them," so Edie started by dropping
    all the files in her app's `public` folder.
    
    ![Files in public folder](/img/devStories/vaporwearConfigurator/chapter_frontend/05_files_in_public_folder.png)
1.  Next, she installed the private Vaporwear Experience NPM package...
    ```
    npm install @syntheticmagus/vaporwear-experience
    ```
1.  ...and created a component to house said experience.
    
    ![Babylon Experience component](/img/devStories/vaporwearConfigurator/chapter_frontend/06_babylon_experience.png)
1.  The heart of the Babylon Experience component, from Edie's perspective,
    would be the `HTMLCanvasElement` on which the 3D experience would 
    display. This canvas would only be interactible in "configuration" 
    mode at the bottom of the site but would be visible in the background 
    throughout the site, so Edie made its canvas full-page width and height
    with fixed positioning.
    
    ![Babylon Experience CSS](/img/devStories/vaporwearConfigurator/chapter_frontend/07_babylonExperience_css_1_7.png)
1.  With both the canvas and the 3D assets available, Edie was able to 
    create a `VaporwearExperience` and see the 3D rendering in her draft
    site for the first time.
    
    ![Babylon Experience implementation](/img/devStories/vaporwearConfigurator/chapter_frontend/08_babylonExperience_js_63_71.png)
1.  She added an event listener to handle updates to "hotspot" 
    positions...

    ![Hotspot definitions](/img/devStories/vaporwearConfigurator/chapter_frontend/09_babylonExperience_js_135_143.png)

    ![Hotspot placement](/img/devStories/vaporwearConfigurator/chapter_frontend/10_babylonExperience_js_75_89.png)
1.  ...pegged the app state to the scroll position...
    
    ![Scroll state logic](/img/devStories/vaporwearConfigurator/chapter_frontend/11_babylonExperience_js_105_128.png)
1.  ...and created custom UI to enable configuration in the configuration
    state.
    
    ![Configuration UI](/img/devStories/vaporwearConfigurator/chapter_frontend/12_babylonExperience_js_144_166.png)
1.  Other elements required tweaking to accomodate the new behavior, and
    certain visual choices evolved as the site matured. Soon, however, all
    the requested features were enabled and all the requested text had 
    been added (at least where the Vaporwear company hadn't forgotten to 
    provide it), and the final iteration of App.js was even more 
    streamlined than it had been in the draft.
    
    ![App.js final](/img/devStories/vaporwearConfigurator/chapter_frontend/13_app_js_8_20.png)
1.  And thus, at long last, the new Vaporwear e-commerce site was ready
    for deployment 
    [on the Vaporwear company's production-quality servers that definitely didn't have anything to do with GitHub Pages](https://syntheticmagus.github.io/vaporwear-react-site-deployment/).
    
    ![Final site](/img/devStories/vaporwearConfigurator/chapter_frontend/14_live_site.png)

The site was completed; the contract was over. Carlos, Diane, and Edie
all decided to keep in touch and hoped to work together again, and Allan
could not have been more thrilled with the new 3D-powered Vaporwear
website. Barnabas was happy too, although Edie got the impression that,
when he looked at the new site, 
[Barnabas did feel just a little bit sorry for the old one](./wordpress).
