---
title: Playground to Production - Fruit Fallin'
image:
description: A Dev Story about how to transform Playground demos into production software.
keywords: playground, production, ionic, template workflow, android, ios
further-reading:
video-overview:
video-content:
---

Related links:
[source](https://github.com/syntheticmagus/fruit-falling-source),
[assets](https://github.com/syntheticmagus/fruit-falling-assets),
[demo](https://syntheticmagus.github.io/fruit-falling-source/).

## High Level Overview

Once upon a time, I was fiddling with an idea in the Babylon.js Playground,
and I thought, "I like this! This is fun. I'd like to make something more
of this, but I don't want it to live in the Playground
forever. **How do I take my Playground prototype and turn it into
independent production software?**"

![Playground to Web? Android? iOS?](/img/devStories/fruitFalling/question.jpg)

So I went to the Babylon.js docs site and read through an article titled,
"Playground to Production: _Fruit Fallin'_." After reading that article
(and asking any questions I had on the [forum](https://forum.babylonjs.com)),
I knew exactly what to do and about how long I could expect it take.

1. On my GitHub account, I created a new repository from the
   [Babylon.js NPM Package Template](https://github.com/BabylonJS/npm-package-template),
   moved my Playground code into that repo, and confirmed it worked. **Within
   half an hour, I had my Playground code running in my own repo.**
1. I then created a new repo from the Babylon.js
   [Asset Host Template](https://github.com/BabylonJS/asset-host-template),
   put the assets I'd been prototyping with in there, then changed the links
   in my prototype code to point to my local asset host. **Fifteen minutes
   later, my entire prototype—source code and assets—was running from my own
   repositories.**
1. Now with everything moved into dev infrastructure, I set about turning
   my prototype into real production code and assets. **I refactored and
   revised to get rid of Playground-specific practices and transform my
   repos into efficient development environments where I could add features,
   take dependencies, experiment, collaborate, and iterate throughout the
   whole development process.**
1. Once I had something I was ready to share, I wanted to host it using
   [GitHub Pages](https://pages.github.com/) so I could get feedback from
   friends and colleagues. Because the Babylon.js Template Repositories are
   set up to make this easy, **it took me five minutes, if that, to publish my
   experience to a GitHub-hosted site I could link to.**
1. Next, I uploaded my game code as an
   [NPM package](https://www.npmjs.com/) so that I could easily re-add it to
   other projects (websites, NPM apps, etc.) just by pulling down a package.
   Again, the Babylon.js Template repositories are set up to make this easy:
   **within ten minutes, I had my new NPM package.**
1. I wanted to publish my app as a mobile game and get it listed on Google
   Play and the App Store, so I decided to use
   [Ionic](https://ionicframework.com/). All I had to do was create a new
   Ionic app, add my new NPM package as a dependency, then invoke my code and
   tell it where to display in the app. **About an hour later, my code was
   built into a native app, ready to be shipped for mobile devices or as a
   PWA.**

![The Path: Playground to GitHub to NPM to Ionic](/img/devStories/fruitFalling/answer.jpg!800)

And that is how I created
[_Fruit Fallin'_](https://syntheticmagus.github.io/fruit-falling-source/),
a Babylon.js app inspired by browser games from the heyday of Flash. While
I happened to be making a simple game, this same process can be used for
more complex experiences, commercial scenarios... At a high level, the
procedure described above can be used to take any Babylon.js idea from
Playground to production using the Babylon.js Template Repositories, NPM,
and Ionic.

For a less high-level look, let's take a more step-by-step journey through
the process.

## A More Step-by-Step Journey Through the Process

### Moving Playground Code into a Development Repo

The first step toward developing production code was to move development
from [my Playground](https://playground.babylonjs.com/#G4VPXM#1) into a
dedicated repository. The Babylon.js NPM Package Template, a component
of the
[Template Repository Workflow](https://doc.babylonjs.com/toolsAndResources/templateRepositories#the-template-repository-workflow),
is designed with this in mind, particularly when migrating code from
the Babylon.js Typescript Playground, so I decided to use that.

1.  I logged into my [GitHub](https://github.com/) account.

    ![GitHub login](/img/devStories/fruitFalling/00_log_in_to_github.jpg!250)

1.  On the page for the Babylon.js
    [NPM Package Template](https://github.com/BabylonJS/npm-package-template),
    I clicked the "Use this template" button to start a new repo.

    !["Use this template" button](/img/devStories/fruitFalling/01_use_package_template.jpg!500)

1.  I picked my repo name, choose to make it public (for non-open source,
    I would have chosen private), then created the repository.

    ![Picking repo options](/img/devStories/fruitFalling/02_choose_options.jpg!500)

1.  In a [Git](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)-enabled
    terminal (in my case, Git Bash on Windows), I navigated to where
    I wanted my new repo to be and created my local clone.

    ![cd and git clone](/img/devStories/fruitFalling/03_clone.jpg!500)

1.  In an NPM-enabled terminal, I navigated into my new repo and ran

    ```
    npm install
    ```

    This installed all the NPM dependencies for all packages in my repo.

    ![PowerShell NPM install](/img/devStories/fruitFalling/04_npm_install.jpg!500)

1.  Still in the root directory in my NPM-enabled terminal, I ran

    ```
    npm run dev
    ```

    This started processes to both build and serve the repo in "watch"
    mode. After a moment, the default NPM Package Template test app
    launched in a new browser tab at http://127.0.0.1:8080, confirming I was
    on the right track.

    ![Browser default test app](/img/devStories/fruitFalling/05_default_test_app.jpg!700)

1.  I then went back to the
    [Babylon.js Typescript Playground I'd been prototyping in](https://playground.babylonjs.com/#G4VPXM#1)
    and copied all the code.

    ![Copying my Playground](/img/devStories/fruitFalling/06_sprites_orthographic_falling.jpg!500)

    Note: this "copying" process does expect the original code to be in the
    _TypeScript_ Playground. Code from a _JavaScript_ Playground will need
    to be ported to TypeScript (usually not very difficult) before continuing
    into the Template Repository Workflow. That kind of code migration isn't
    a part of this Dev Story, but it should be fairly straightforward, and
    help is always available on
    [the forum](https://forum.babylonjs.com/c/questions).

1.  In Visual Studio Code (my preferred code editor), I opened up my new
    repo's root directory, then opened the file
    `app_package/src/Playground/playground.ts` and replaced the `Playground`
    class with the one I'd copied the Web.

    ![Playground.ts](/img/devStories/fruitFalling/07_paste_playground.jpg!500)

1.  While the NPM Package Template is designed to make it as easy as
    possible to copy-paste code from the Web Playground and have it work
    immediately, sometimes a little tweaking is needed. In my case, I
    was using coroutine features that were only available in the preview
    branch, so I had to update the version of Babylon that my
    `app_package/package.json` was depending on.

    ![Playground.ts pasted in](/img/devStories/fruitFalling/08_update_babylon.jpg!500)

1.  After making that change and running

    ```
    npm update
    ```

    I was able to get my first glimpse of my code running locally.

    ![New browser Playground](/img/devStories/fruitFalling/09_playground_test_app.jpg!500)

1.  One more change required! Since my code had been hosted on the
    Playground, it was using the Playground-relative `"textures/player.png"`
    URL; however, once that code was running locally, it was unable to
    build a full URL with which to find that asset. Switching over to my
    own asset hosting was a later step, so I didn't really _need_ to
    solve this; however, since getting it working could be done by just
    switching to a
    [RawGit](https://stackoverflow.com/questions/39065921/what-do-raw-githubusercontent-com-urls-represent)
    URL for `player.png` (which still works, for the moment), I decided
    to fix it anyway.

    ![Raw sprite location](/img/devStories/fruitFalling/10_raw_sprite_location.jpg!700)

1.  After saving that change, all I had to do was save the file
    and wait for the test app in my browser to auto-refresh.

    ![It's working!](/img/devStories/fruitFalling/11_playground_test_app.jpg!500)

And, just like that, I'd moved my prototype code from the Playground to
an independent repository in which to continue development. However, I
was still pulling assets from the Internet, which would be difficult to
control and update as I continued developing my app. Time to create a
more development-friendly environment for assets too!

### Creating an Asset Host Repo

The `Sprite` I used while learning how to use sprites is the one provided
as part of Babylon's default assets. While I knew all along I wanted to
replace that, I first wanted to use it to bootstrap and test my approach
to asset hosting for development.

1.  Repeating essentially the steps from the
    [prior section](#creating-an-asset-host-repo)
    for creating a new repository from a template, I made a new asset host
    from the
    [Asset Host Template](https://github.com/BabylonJS/asset-host-template),
    cloned it down, and installed the NPM dependencies.
1.  As before, I ran

    ```
    npm run dev
    ```

    in the root directory of my new asset host repo. This started up a
    server to serve assets in my repo's `docs` folder at
    http://127.0.0.1:8181 by default.

    ![Asset server](/img/devStories/fruitFalling/12_asset_host_terminal.jpg!500)

1.  To double-check that my server was working, I opened
    http://127.0.0.1:8181/example.txt and saw the text

    ![Browser screenshot](/img/devStories/fruitFalling/13_example_txt.jpg!500)

1.  Next, I downloaded a copy of
    [player.png](https://github.com/BabylonJS/Babylon.js/tree/master/packages/tools/playground/public/textures/player.png)
    and placed it in the `docs` folder. Again, I used the browser to test
    that this worked by checking that I could see the image at
    http://127.0.0.1:8181/player.png. The dev server that comes with the
    Asset Host Template automatically serves new files dropped in the
    `docs` folder, so there was no need to restart the server.

    ![Player.png in the docs folder](/img/devStories/fruitFalling/14_assets_docs_folder.jpg!350)

1.  Going back over to Playground.ts in my source repository, all that
    remained to consume the sprite from my own asset host was to change
    the the `spriteUrl` assignment line to

    ```ts
    const spriteUrl: string = "http://127.0.0.1:8181/player.png";
    ```

    save the file, then wait for the test app to reload.

1.  Of course, once that reload happened, I realized I wouldn't be able
    to see the results because the sprite from my asset host looked
    identical to the one pulled from the Internet. To make extra sure,
    then, I changed `player.png` to `player_2.png` in my asset host,
    then cleared my brower's file cache (so it wouldn't load a cached
    version of `player.png`) and refreshed the test app. After confirming
    that the test app couldn't find `player.png`, I changed the code again
    to look for `player_2.png` and saved the file. When the app
    auto-reloaded, it had found the sprite again.

    ![Test app without and with correct sprite name](/img/devStories/fruitFalling/15_wrong_name_right_name.jpg!500)

And with that, my entire prototype, both code and assets, was running
locally from my own repos where I could iterate fast and commit often
as I moved on to...

### Developing the Experience

Coding tutorials and implementation diatribes are the stuff of dreams in
that most people who read them fall asleep almost immediately. This is not
a coding tutorial, so I won't spend much time describing the details of the
implementation of _Fruit Fallin'_. I will, however, cover a few notes that
I think were particularly important to helping me get _Fruit Fallin'_ to
work the way I wanted it.

1. I pulled apart and deleted `playground.ts` just as fast as I could.

   The Babylon.js Playground is a fantastic place to experiment, prototype,
   and repro bugs. In order to be as good at those things as it is,
   however, the Playgrund make a number of implementation decisions that
   do not translate well into production software development. Single-file
   development, kitchen-sink dependency inclusion, and the `BABYLON`
   import are prominent examples of this.

   ![The BABYLON import](/img/devStories/fruitFalling/16_babylon_import.jpg!350)

   In its initial state, the NPM Package Template repo emulates these
   patterns intentionally in `playground.ts` to make it as easy as
   possible to transition from Playground-based prototyping to repo-based
   development. The first step of that transition is to simply copy the
   Playground code into `playground.ts` as discussed above, then get that
   to a working state. Once that's done, however, I think the second step
   should always be to refactor everything in `playground.ts` into a more
   robust code structure (multiple files, types, etc.). With the code
   already in a working state, I moved functionality out into separate
   files incrementally (camera creation into a new camera type, falling
   objects into a new class, etc.), proving at every step that I hadn't
   broken my code. Then, once all the functionality had been moved out
   of `playground.ts`, I simply deleted that file and the folder
   containing it from my repo.

1. I cleaned out the unused dependencies from the NPM Package Template
   repository.

   This is another step I recommend for moving your new repo away from
   Playground practices and into production. In order to be able to
   support code copy-pasted out of the Playground, the NPM Package
   Template's `app_package` by default includes a _lot_ of dependencies,
   only a subset of which are likely to be used by any particular
   codebase. Fortunately, it's easy to get rid of the unnecessary imports
   here; all I had to do was open `app_package/package.json` and delete
   the references to any NPM packages I wasn't using--which, in this case,
   was most of them.

   ![Excess NPM package deletion](/img/devStories/fruitFalling/17_npm_package_deletion.jpg!500)

1. To make sure I was rendering under the intended circumstances, I
   customized `index.js` in the `test_package`.

   The test app included with the NPM Package Template has an extremely
   simplisitic and generic appearance: it's basically just a small
   `HTMLCanvasElement` in a blank page. Not all Web apps are designed for
   generic canvases, however, so in many cases it may be helpful to add
   features to the test app to better reflect the real environment where
   the app will be run (full-screen capability, website forms to enter
   data, etc.). In my case, _Fruit Fallin'_ was designed primarily with
   mobile touchscreens in mind, so I wanted my canvas to have an aspect
   ratio that more closely resembled what the game was ultimately supposed
   to run in.

   ![index.js in test_package](/img/devStories/fruitFalling/18_index_js_in_test_package.jpg!600)

1. I used `Scene`s as a unit of organization for my game logic.

   ![Scenes used in runtime.ts](/img/devStories/fruitFalling/19_scenes_in_runtime_ts.jpg!400)

   Most interactive apps have multiple "modes" of operation, and _Fruit
   Fallin'_ in particular has two: the game and the
   title/menu/options/credits. While there's no real rule for how best
   to separate the concerns of the different modes, I found it useful to
   have them as separate Babylon `Scene` objects. Specifically, I made new
   `Scene` subclasses with the behavior I wanted for the different "modes,"
   such as the
   [title screen](https://github.com/syntheticmagus/fruit-falling-source/blob/278fe61755d7f16b1d5f0726f1e72c670883df06/app_package/src/titleScene.ts)
   and
   [gameplay](https://github.com/syntheticmagus/fruit-falling-source/blob/278fe61755d7f16b1d5f0726f1e72c670883df06/app_package/src/gameScene.ts).
   That made it easy for me to transition between modes by simply
   disposing one kind of scene and creating a new instance of the other,
   thus keeping the logic and resources clean and separated.

1. I wrote a fixed framerate observable to simplify having
   [coroutine](https://doc.babylonjs.com/divingDeeper/events/coroutines)-driven
   animation and game logic without being vulnerable
   to framerate changes.

   Framerate-dependent logic is dangerous because you can't rely on
   framerate. If you write your sprite animations to advance with
   device framerate and you get them to look right on a 30 FPS device,
   for example, then those animations will look absurdly fast on a 60 FPS
   device. On the other hand, there are certain things in game logic
   (such as sprite animations) that fit very naturally with frame-based
   logic because they happen in discrete increments. I wanted to take
   advantage of this natural synergy, but I didn't want my logic to be
   vulnerable to variations in framerate; so, borrowing from physics
   simulation practices, my solution was to make a simple
   [fixed framerate observable](https://github.com/syntheticmagus/fruit-falling-source/blob/278fe61755d7f16b1d5f0726f1e72c670883df06/app_package/src/fixedFramerateObservable.ts)
   which drives a guaranteed number of "updates" per second. If the device
   is rendering faster than the desired framerate, this observable will
   "skip" frames until enough time has elapsed; and if the device is
   rendering slower than the desired framerate, this observable will
   "double up" on what frames it has so that the same number of "updates"
   per time are always called. This trick allowed me to write
   [logic](https://github.com/syntheticmagus/fruit-falling-source/blob/278fe61755d7f16b1d5f0726f1e72c670883df06/app_package/src/drop.ts#L89-L94)
   that was _frame_-dependent without it becoming vulnerably
   frame*rate*-dependent.

   ![Frame-dependent game logic](/img/devStories/fruitFalling/20_frame_dependent_logic.jpg!500)

   Having this ability to reliably use frame-based logic allowed me to use
   coroutines for all sorts of things, from game flow to procedural
   animation. A full overview of the use of coroutines in _Fruit Fallin'_
   is beyond the scope of this article, but perhaps the most fun example
   look at is how
   [the face animations are done entirely using coroutines](https://github.com/syntheticmagus/fruit-falling-source/blob/main/app_package/src/rainbowButton.ts#L102-L183).

1. I made the consuming app (in this repo, the test app) responsible for
   specifying the locations of all the assets used by the game.

   As discussed in the Babylon docs on the
   [Template Repository Workflow](https://doc.babylonjs.com/toolsAndResources/templateRepositories#the-template-repository-workflow),
   one of the most varied challenges in deploying Babylon experiences is
   distributing assets. It's best to keep this problem completely separate
   from actually _using_ the assets within the code, thus allowing the
   same experience code to be used in multiple situations even when assets
   are distributed differently. For this reason, my rule for myself is that
   there should never be a hard-coded asset URL anywhere in `app_package`.
   Instead, all resource locations should be passed in by the consuming
   experience, whether that be `test_package` or some production shipping
   vehicle. That way the `app_package` code can be written to "just work"
   as long as it's given the right asset locations, and all any consuming
   experience has to do to integrate it is just tell `app_package`
   the correct URLs to use.

   ![index.js asset location code](/img/devStories/fruitFalling/21_asset_location_code.jpg!500)

I should also briefly mention how I created the assets for the game.
Again, this is not an implementation overview; but for those who are
curious, here are the various tools I used to make _Fruit Fallin'_.

1.  **Art:** I drew all the backgrounds, the buttons, and all the
    animated components by hand using
    [FlipaClip](https://www.flipaclip.org/)
    on an ancient Samsung Tab A 9.7 (from 2015, I think). Frames of
    animation were batch-cropped using [FFmpeg](https://ffmpeg.org/),
    combined into spritesheets using the
    [Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/),
    and if necessary refined (fine-tuning opacity, etc.) using
    [GIMP](https://www.gimp.org/).
1.  **Music:** I made the song that plays during gameplay using
    [MPC Beats](https://www.akaipro.com/mpc-software).
1.  **Sound effects:** Almost all the sound effects I made by just
    making ridiculous noises into a microphone, then fiddling with
    the recordings in [Audacity](https://www.audacityteam.org/) to get the
    sound I wanted. The exceptions are the tones which play during the
    coutdown at the start of the game, which were generated from pitch in
    Audacity.
1.  **Other:** The few remaining elements such as text are all
    generated using
    [Babylon's built-in GUI](https://doc.babylonjs.com/divingDeeper/gui/gui).
    The only exception to this is the colors of the animated buttons, which
    are done using Babylon-generated plane geometry and an unlit PBR
    material.

### Publishing the Test App on GitHub Pages

Once I had _Fruit Fallin'_ working, I immediately wanted to share it with
some friends to get their feedback. There are many public and private
ways I could have done that, but because I didn't care about keeping the
prototype private, by far the easiest option was to use
[GitHub Pages](https://pages.github.com/), a simple GitHub-based public
hosting service that the template repositories make very easy to use.

1. GitHub Pages essentially allows you to serve static sites from certain
   designated folders in your repository, one of which is the `docs`
   folder. This is the reason that the Asset Host Template serves assets
   from the `docs` folder in the first place. Because of this, it is
   _extremely_ get get GitHub Pages to host your assets. To start, I
   pushed my changes up to my GitHub repository, then opened that repo
   in a browser.

   ![Asset Host web view](/img/devStories/fruitFalling/22_asset_host_repo.jpg!600)

1. On that repo's browser site, I opened up the Settings tab, then
   scrolled down and clicked on Pages.

   ![Settings -> Pages](/img/devStories/fruitFalling/23_settings_pages.jpg!400)

1. I chose the main branch as my source, then selected `docs` as the
   folder to serve. With that done, because my assets were already in the
   `docs` folder, I immediately had a public Web host for my assets.

   ![Assets in the browser](/img/devStories/fruitFalling/24_pages_main_docs.jpg!600)

1. Next, I wanted to make the test app change its behavior depending on
   whether it was hosted in the local dev server or on GitHub Pages.
   If it was local, I wanted it to still pull assets from my local asset
   host at 127.0.0.1:8181 so that I could keep my development workflow.
   However, if the site was on GitHub Pages, I wanted it to pull from the
   Web host. Fortunately, the test app includes a mechanism for determining
   this pretty easily; all I had to do was check the `DEV_BUILD` variable
   and change the URL prefix based on that.

   ![Checking the DEV_BUILD variable](/img/devStories/fruitFalling/25_checking_dev_variable.jpg!500)

1. The way the NPM Package Template is set up, `DEV_BUILD` will be true
   whenever running locally using

   ```
   npm run dev
   ```

   However, GitHub Pages can't (and shouldn't) run that way; instead, I needed to build my test app to a static site and put it in the `docs`
   folder. That, too, is built into the NPM Package Template; to build
   `test_package` (including its dependency `app_package`) and place the
   build output in the `docs` folder ready to deploy to GitHub Pages, I
   ran the following command from the repo's root directory.

   ```
   npm run build
   ```

1. I next ran `git status` just to confirm that the files in the `docs`
   folder really had changed.

   ![They had](/img/devStories/fruitFalling/26_npm_run_build_status.jpg!500)

1. With that done, all that was left was to commit the built site, push
   it to GitHub, then turn on GitHub pages the same way I did for the
   asset host site.

   ![GitHub Pages again](/img/devStories/fruitFalling/27_source_repo_github_pages.jpg!500)

A few seconds later, my site was live and GitHub gave me a link I could
use to share the first Web-accessible version of _Fruit Fallin'_!

### Deploying as an NPM Package

The speed and convenience of GitHub Pages was great, but it wasn't the end
goal. Once I had gotten some feedback and was ready to move forward, I
next needed to bring my `app_package` code into a real shipping vehicle.
Continuing with the
[Template Repository Workflow](https://doc.babylonjs.com/toolsAndResources/templateRepositories#the-template-repository-workflow),
I decided to upload my `app_package` as an NPM package so that it could be
easily integrated into a huge variety of different shipping solutions.

1. Since the `app_package` in the NPM Package Template is already
   structured as an NPM package, publishing it as such is as easy as
   publishing any other NPM package. Personally, I had never published
   an NPM package before, so it took me an embarassingly long time to
   figure out that I could
   [login to NPM in a terminal](https://medium.com/@bretcameron/how-to-publish-your-first-npm-package-b224296fc57b)
   by opening a terminal and typing

   ```
   npm login
   ```

2. Since I didn't need to
   [publish my NPM package privately](https://docs.npmjs.com/creating-and-publishing-private-packages),
   the only other thing I needed to do was review the `package.json` file
   in `app_package` to ensure it contained the correct information for
   my new NPM package--most importantly the package name.

   ![app_package/package.json](/img/devStories/fruitFalling/28_app_package_json.jpg!500)

3. ```
   cd app_package
   npm publish --access public
   ```

And with that, my app code was available on NPM, ready to be integrated
into whatever shipping app I chose.

### Going to Production with Ionic

Because _Fruit Fallin'_ was designed with mobile touchscreen interfaces in
mind, I decided I wanted to embed it into Android and iOS apps that could
be uploaded to app stores. After looking around, I decided to use Ionic
as my production platform because (1) it was open-source, (2) it could
very easily consume NPM packages like the one I'd just created, and (3)
it would allow me to target bot Android and iOS as well as Web and PWA
from the same shipping vehicle.

This is not an Ionic tutorial and the best way to learn about Ionic will be
to consult [their own docs](https://ionicframework.com/docs/intro/cli); but
as quick get-up-and-go, here's what I did to get Fruit Fallin' built for
Web and Android using Ionic and developing on Windows.

1. ```
   npm install -g @ionic/cli
   ```
1. After navigating to the folder where I wanted my Ionic app's code to
   live, I ran

   ```
   ionic start
   ```

1. I declined to use the App Creation Wizard, selected a React frontend,
   named my project, and chose a blank app template.

   ![Ionic options](/img/devStories/fruitFalling/29_ionic_start.jpg!600)

1. To check that everything was in order so far, I ran the following
   command to view the default Ionic Web app:

   ```
   cd fruit-fallin
   ionic serve
   ```

1. The next step was to get this default app building into an Android
   app. To do so, I chose to use Ionic's built-in integration with
   [Capacitor](https://capacitorjs.com/).

   ```
   ionic capacitor add android
   ```

1. In general, Ionic has fantastic terminal output that will give you
   great advice about how to use itself. In my case, I got a message
   saying that syncing failed because the `build` directory was missing.
   To solve this, all I had to do was build and sync manually.

   ```
   ionic build
   ionic capacitor sync android
   ```

1. My first command to add Android created a folder in my Ionic app's root
   directory called `android`. This folder is an Android Studio project.
   Ionic's CLI provides a number of different ways to try to automatically
   invoke Android Studio on this folder, but I opted not to use those. My
   general experience is that Android Studio is something of a strange
   bird, so I usually prefer to use it directly by opening that folder
   as a project in Android Studio.

   ![Opening in Android Studio](/img/devStories/fruitFalling/30_opening_android.jpg!500)

1. Using Android Studio is beyond the scope of this article, but once
   opened the project can built and run on a real or virtual device just
   like any other project.

   ![The default app on an AVD](/img/devStories/fruitFalling/31_default_ionic_avd.jpg!300)

1. With that done, it was time to change the content of the app to use
   my NPM package. In an NPM-capable terminal in the root directory, I
   added the dependency.

   ```
   npm install fruit-fallin
   ```

1. Installing the dependency brought in the _Fruit Fallin'_ code, but
   the assets need to be added a different way. I could technically have
   continued having the Ionic app pull the assets from a different
   location, but because I wanted the app to be self-contained, I instead
   just dropped my assets in a new folder in the `public/assets` directory.

   ![The new assets folder](/img/devStories/fruitFalling/32_new_assets_folder.jpg!500)

1. Now all I had to do was actually invoke the NPM dependency I'd pulled
   in and tell it where to find the assets I'd just added. I am not a
   React.js expert and this is not a React.js tutorial, but with a bit of
   help from friends and colleagues I was able to create a simple rewrite
   of `Home.tsx` that displayed a full-screen canvas and passed it as an
   argument to my _Fruit Fallin'_ initialization code.

   ```
   import { IonContent, IonPage } from '@ionic/react';
   import { Component, createRef, RefObject } from 'react';
   import { initializeBabylonApp } from 'fruit-fallin';
   import './Home.css';

   class BabylonGame extends Component {
     private _canvas: RefObject<HTMLCanvasElement>;

     constructor (props: any) {
       super(props);
       this._canvas = createRef();
     }

     public componentDidMount() {
       // Crude workaround for a loading timing issue
       setTimeout(() => {
         const babylonOptions = {
           canvas: this._canvas.current!,
           backgroundTitleUrl: "assets/game/background_title.jpg",
           backgroundGameUrl: "assets/game/background_game.jpg",
           buttonPlankUrl: "assets/game/button_plank.jpg",
           imageGameOverUrl: "assets/game/image_game_over.jpg",
           spritesheetButtonFrameUrl: "assets/game/spritesheet_button_frame.jpg",
           spritesheetFruitUrl: "assets/game/spritesheet_fruit.jpg",
           spritesheetMouthUrl: "assets/game/spritesheet_mouth.jpg",
           soundMusicUrl: "assets/game/sound_music.mp3",
           soundChompUrl: "assets/game/sound_chomp.mp3",
           soundChompYumUrl: "assets/game/sound_chomp_yum.mp3",
           soundChompYuckUrl: "assets/game/sound_chomp_yuck.mp3",
           soundCountdownUrl: "assets/game/sound_countdown.mp3",
           soundGoUrl: "assets/game/sound_go.mp3",
           soundClickUrl: "assets/game/sound_click.mp3",
         };
         initializeBabylonApp(babylonOptions);
       }, 200);
     }

     public render() {
         return <canvas id="babylonCanvas" width={window.innerWidth} height={window.innerHeight} style={{width: "100%", height: "100%"}} className="center" ref={this._canvas}></canvas>;
     }
   }

   const Home: React.FC = () => {
     return (
       <IonPage>
         <IonContent>
           <BabylonGame></BabylonGame>
         </IonContent>
       </IonPage>
     );
   };

   export default Home;
   ```

1. To test that this worked, I first tested in browser again:

   ```
   ionic serve
   ```

   ![Fruit Fallin' Ionic](/img/devStories/fruitFalling/33_ionic_fruit_fallin_browser.jpg!300)

   This would be very close to the end state if I were targeting Web or WPA
   using Ionic. However, since I wanted to go to Android, there were a few
   more steps.

1. ```
   ionic build
   ionic capacitor sync android
   ```

   The explicit build may be unnecessary, but I did it just to be sure. The
   sync then copied over the new build as well as the assets, updating
   the Android project. Note that I closed down Android Studio before doing
   this to help ensure that the Ionic CLI and Android Studio didn't
   confuse each other while accessing the same files simultaneously.

1. Finally, I once again opened the `android` folder in Android Studio,
   built the project, and deployed it to my Android virtual device.

   ![Fruit Fallin' on AVD](/img/devStories/fruitFalling/34_ionic_fruit_fallin_avd.jpg!300)

And that was it! That was all I needed. My Babylon experience could now be
deployed to Web, PWA, Android, and iOS all from the same codebase; and
moreover I now had a process to leverage the Template Repository Workflow
to bring almost any project from Playground to production along the same
path.

What should I make next?

What will _you_ make next?

![What next?](/img/devStories/fruitFalling/check_plus.png!100)

-syntheticmagus
