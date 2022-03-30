---
title: 3D for E-Commerce - Custom Experience
image:
description: A Dev Story about creating an e-commerce website with a 3D viewer/configurator built into the design.
keywords: e-commerce, ecommerce, react, vaporwear, viewer, configurator
further-reading:
video-overview:
video-content:
---

Related links:
[Vaporwear website demo](https://syntheticmagus.github.io/vaporwear-react-site-deployment/),
[Chapter 1: Art](./vaporwearConfigurator/art),
[Chapter 2: 3D](./vaporwearConfigurator/3d),
[Chapter 3: Frontend](./vaporwearConfigurator/frontend),
[Bonus Chapter: WordPress](./vaporwearConfigurator/wordpress)

## High Level Overview

After 
[adding simple 3D to their existing e-commerce site](./vaporwearViewer)
and seeing first-hand the resulting 
[big boost to the customer experience](https://www.zdnet.com/article/2021-is-the-year-that-3d-and-augmented-reality-for-commerce-cashes-in/), 
Allan and Barnabas -- owner and webmaster, respectively, for the Vaporwear
smartwatch company -- were excited. The company was growing, they were
looking for ways to improve and differentiate their e-commerce business,
and they knew they'd barely scratched the surface of what they could do
with 3D on the Web. Fishing for inspiration on the 
[Babylon.js forum](https://forum.babylonjs.com/c/demos),
Allan found a
[Babylon Utility](./showroomCamera) 
allowing the seamless integration of several different camera behaviors
for a "showroom" experience. Allan and Barnabas had already been discussing
a major update to their website to coincide with the launch of Vaporwear's
newest imaginary smart watch; and with all these new opportunities in 
mind, they began to ask each other, "**What might an e-commerce site
built with 3D as part of the core design look like, and how would we 
create it?**"

![Vaporwear 3D + What = E-Commerce magic?](/img/devStories/vaporwearConfigurator/question.png)

This, of course, was not a small aim, and they didn't go in with the 
expectation they'd be able to do this in the roughly one hour it had taken
the to add the Babylon Viewer their existing site. This new Vaporwear
website would be built from the ground up to be exactly what they wanted
for their business: custom 3D assets in a custom 3D experience in a
custom, modern Web frontend. Creating such a website would require 
expertise Vaporwear didn't have on permanent staff, so they decided to 
contract three freelancers to form a team to create this new website.

-   Carlos, the artist, who would create the 3D visuals.
-   Diane, the Babylon developer, who would build Carlos's visuals into a
    3D experience.
-   Edie, the frontend developer, who would take take Diane's 3D experience
    and build the final Vaporwear website around it.

![Vaporwear 3D + Blender + Babylon + React.js = E-Commerce magic!](/img/devStories/vaporwearConfigurator/answer.png)

When assembling this team, Allan and Barnabas knew that hiring the right
people was **the single most important thing they could do to ensure the
success of their project**, so they didn't try to cut corners: much better
to spend the money to do it right than to spend the money to do it again.
Furthermore, while the three team members wouldn't all need to be 
focused on the Vaporwear site simultaneously, Allan and Barnabas didn't 
make the mistake of trying to hire them piecemeal. The most important
follow-up to getting the right people was getting those people to talk 
to each other so that expectations could be aligned, handoffs agreed upon,
and -- when something inevitably required further discussion during
development -- easy and familiar communications established.

So, to kick off the project, Allan got the whole team together in a single
meeting where he and Barnabas laid out their vision for the new Vaporwear 
site.

-   The site would be structured as a single page incorporating both 
    viewing and configuration.
-   When the site loaded, the first thing the users would see would be 
    an overall view of the watch, with the logo fading in on top of it.
-   As the users scrolled through the site and were shown information
    about the watch, the 3D watch would transition to different states
    to show off the various important features: the clasp, the face,
    and the overall design.
-   When the users scrolled to the bottom of the page, buttons would
    appear and the watch rendering would seamlessly become an interactive
    configuration experience where users could change the band, face, etc.
-   If users scrolled back up through the page after configuring, the
    configuration options would remain.
-   ...and all of this should be done with no load screens.

The experts on the team pitched in with their thoughts, offering 
suggestions and discussing challenges, and pretty soon they resolved on
a design for the website: in short, they resolved on 
[this](https://syntheticmagus.github.io/vaporwear-react-site-deployment/).

With the design in place, the high-level path forward was clear. Throughout
the development process, all five of them would remain reachable (email, 
etc.) to each other to answer questions and resolve confusion, but not 
all of them would be actively working on the Vaporwear site the whole
time. The majority of Edie's work would happen once she'd received the
3D experience from Diane, and the bulk of Diane's work depended on the
3D models from Carlos. Thus, with the team assembled and the plan decided
the first chunk of real work on the new Vaporwear website was 
[the art](./vaporwearConfigurator/art).
