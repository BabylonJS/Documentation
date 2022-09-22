---
title: Bonus Chapter - WordPress
image:
description: A Dev Story about creating an e-commerce website with a 3D viewer/configurator built into the design.
keywords: e-commerce, ecommerce, vaporwear, viewer, configurator, wordpress
further-reading:
video-overview:
video-content:
---

Related links:
[WordPress plugin source](https://github.com/syntheticmagus/wp-vaporwear-experience),
[WordPress site source](https://github.com/syntheticmagus/vaporwear-original-asset-host/tree/main/wp_sites_sources/vaporwear_configurator),
[demo](https://syntheticmagus.github.io/vaporwear-original-asset-host/vaporwear_wp_with_configurator.mp4)

Note about the demo: For most Dev Stories, we try to make the actual usable
product from the Dev Story available for readers to explore directly.
However, the website in this Dev Story was built using WordPress, which
is complicated (and sometimes costly) to host, so unfortunately we weren't
able to keep it live indefinitely. Instead, the `demo` link
above will direct you to videos showing the site in action, while the
`source` link goes to a zipped file containing the raw files of the
WordPress site.

## Introduction: Barnabas

Barnabas was a sentimental fellow, and he wasn't ashamed of it: he _did_
feel a little sorry for the old WordPress-based Vaporwear site now that the
new React.js site's 3D experience was _so_ much more sophisticated.
More practically, however, he also knew that the process of switching sites
would take a little time, so even after the "completion" of the new site
the old one would still be live for at least another month or two. With
that in mind, Barnabas approached Allan with an idea: what if they could
take the same 3D experience which had been developed for the new React.js
site and incorporate it into their old WordPress site as well? "Go for it,"
Allan told him, so Barnabas set off to figure out how to integrate the new
custom 3D experience into the old WordPress site.

## Using an NPM Package in WordPress

Diane had built the new Vaporwear 3D experience into an NPM package,
which made it very easy to add into most modern Web workflows.
Using an NPM package in WordPress, however, is a bit tricky: WordPress
was not designed to work with modern Web workflows and, being PHP-based,
isn't naturally well-suited to being used with JavaScript development
practices. After poking around for a good way to get NPM-based
functionality into a WordPress site, Barnabas found a
[WordPress NPM Bridge Template](https://github.com/syntheticmagus/wp-npm-bridge-template)
which offered an easy way to take NPM-powered JavaScript code and
bundle it into a custom
[WordPress plugin](https://en.wikipedia.org/wiki/WordPress#Plugins).

1.  First, Barnabas created a new repository from the
    [WordPress NPM Bridge Template](https://github.com/syntheticmagus/wp-npm-bridge-template)
    using the same approach
    [described in a Dev Story for starting Babylon's Template Repository Workflow](/fruitFalling#a-more-step-by-step-journey-through-the-process).

    ![WordPress NPM Bridge Template](/img/devStories/vaporwearConfigurator/chapter_wordpress/01_use_this_template.png)

1.  Barnabas's plan was to create a plugin that would let him use a
    custom
    [shortcode](https://wordpress.com/support/shortcodes/)
    to insert the new Vaporwear 3D experience. His new repo made from
    the template showed an example of how to do that; to get started, he
    had to modify the
    [plugin PHP file](https://github.com/syntheticmagus/wp-npm-bridge-template/blob/9f8810bb8f6357d9af1c3d5bc6ae326bd26b7419/wp/wp-npm-bridge-template/wp-npm-bridge-template.php)
    to remove the defaults.

    ![Hello World WordPress Plugin](/img/devStories/vaporwearConfigurator/chapter_wordpress/02_hello_world_php.png)

1.  Since he'd changed the names of basically everything, he needed to
    modify the package.json file, too.

    ![Modified package.json](/img/devStories/vaporwearConfigurator/chapter_wordpress/03_package_json.png)

1.  This simple version wasn't really doing anything meaningful, but he
    did want to check that it was working. Thus, he built what he had
    so far...

    ```
    npm run build
    ```

    ...added it to the old Vaporwear WordPress site...

    ![Add plugin](/img/devStories/vaporwearConfigurator/chapter_wordpress/04_add_plugins.png)

    ...and tried using the new `vaporwear-experience` shortcode.

    ![Shortcode](/img/devStories/vaporwearConfigurator/chapter_wordpress/05_shortcode.png)

And it worked!

![Hello, world!](/img/devStories/vaporwearConfigurator/chapter_wordpress/06_hello_world.png)

Now for the real thing.

## Creating the VaporwearExperience WordPress Plugin

1.  In the root directory of the plugin repository, Barnabas added Diane's
    3D Vaporwear experience NPM package.

    ![npm install](/img/devStories/vaporwearConfigurator/chapter_wordpress/07_npm_install.png)

1.  Next, he replaced his "Hello, world!" code in his PHP file with a
    call to a custom function.

    ![Modified plugin PHP file](/img/devStories/vaporwearConfigurator/chapter_wordpress/08_vaporwear_php.png)

1.  Finally, he defined the custom function he'd called from the PHP
    file in index.js. He based his implementation on Edie's integration
    of the same NPM package into the new Vaporwear site, though of course
    he didn't use React.js to make the UI. He also didn't want to use the
    "matchmoving" states in the experience as the WordPress site's design
    didn't really have a place for them, so he just skipped right to the
    configuration state.

    ![Custom function definition](/img/devStories/vaporwearConfigurator/chapter_wordpress/09_index_js_16_40.png)

1.  For simplicity, he reused the asset host he'd made from his original
    [Babylon Viewer integration](/vaporwearViewer) to host the rest of
    the assets.

    ![Asset host URL](/img/devStories/vaporwearConfigurator/chapter_wordpress/10_index_js_14.png)

1.  Then he built the plugin...
    ```
    npm run build
    ```
1.  ...uninstalled the old version and replaced it with the new...

    ![Uninstall old plugin](/img/devStories/vaporwearConfigurator/chapter_wordpress/11_uninstall.png)
    ![Install new plugin](/img/devStories/vaporwearConfigurator/chapter_wordpress/12_adding_the_plugin.png)

1.  ...and _voila_.

    ![Configurator in WordPress](/img/devStories/vaporwearConfigurator/chapter_wordpress/13_configurator_in_wordpress.png)

And that, at last, concludes the story of the new and improved Vaporwear
e-commerce experience built from the ground up with 3D in mind. Not only
had Allan and Barnabas been able to create a brand new site with a 3D
viewer/configurator as a flagship feature, but they'd even been able to
take that same configurator and use it in another site as well. Barnabas
was happy -- the new site was being adopted, and even the old site had
been significantly improved -- and he sent a short
[screen capture](https://syntheticmagus.github.io/vaporwear-original-asset-host/vaporwear_wp_with_configurator.mp4)
of the new WordPress functionality over to Allan. Allan didn't see it
immediately, though; he was on the
[forum](https://forum.babylonjs.com/c/demos/)
again, checking out community demos and wondering if there was even more
that 3D could do for his e-commerce business.

-syntheticmagus
