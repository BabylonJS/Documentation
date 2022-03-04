---
title: Babylon.js Code/Assets/Delivery Template Repositories
image: 
description: Rapidly bootstrap new 3D experiences with the Babylon.js template repositories.
keywords: babylon.js, tools, resources, template, template repositories
further-reading:
video-overview:
video-content:
---

NOTE: This documentation and the features it describes are under active
development.

## Quick Start Guide

1. Follow the 
[Quick Start Guide for the NPM Package Code/Assets/Delivery Template repository](https://github.com/BabylonJS/npm-package-template#quick-start-guide)
to create your new code repository `your-new-repo`.
2. Follow the 
[Quick Start Guide for the Asset Host Code/Assets/Delivery Template repository](https://github.com/BabylonJS/asset-host-template#quick-start-guide)
to create your new asset host repository `your-asset-repo`.
3. Develop your experience in your two repos, adding code and business 
logic to `your-new-repo` and assets (images, 3D models, sounds, etc.) to 
`your-asset-host`. To maximize flexibility, limit your development in these 
repositories to only that which is required to create and test your 3D 
experience itself.
4. Export your 3D experience from `your-new-repo`'s `app_package` as an NPM
package in order to integrate it with the experience in which it will ship.

For a detailed example showing how to use the template repositories to 
create a real experience, see [this tutorial]() (NOTE: not a real link;
tutorial coming soon).

## The Code/Assets/Delivery Template Repository Workflow

The primary purpose of the template repositories is to suggest and bootstrap
a workflow for taking Babylon.js 3D experiences from Exploration to 
Circulation. Concretely, these repositories provide an answer to the 
question, "How do I take my idea that I explored in the Playground, or 
somewhere similar, and mature it into production software that I can ship 
in my product?" There are, of course, innumerable viable answers to this 
question. Our Template Repository Workflow simply represents a "golden path"
option that we believe will be well-suited to many common scenarios.

The primary goal of the Template Repository Workflow is to achieve
flexibility by promoting the separation of concerns. The Workflow recognizes
three primary components to a Babylon-powered experience: (1) the Babylon 
experience itself, (2) the assets used in the Babylon experience, and (3) 
the encompassing "shipping vehicle" experience of which the Babylon piece 
is one part.

- An ecommerce site might have (1) a 3D product viewing experience, (2) a 
library of 3D models of products, and (3) the ecommerce Website itself.
- An indie game studio might have (1) an individual game, (2) the assets 
for that game, and (3) the Website, PWAs, and native applications in which 
that game will be shipped.
- An in-house visualizations team might have (1) a specific 3D 
visualization, (2) proprietary datasets to be visualized, and (3) in-house 
dashboards and/or distribution mechanisms for sharing the visualization 
throughout the company.

The Workflow provides a pattern by which all three of these components can
be developed more-or-less independently -- and even interchangeably -- 
without sacrificing the efficiency of the development experience. For an 
illustration of this, let's consider a canonical example of a hypothetical
independent developer using the Babylon.js Template Repository Workflow.

### Canonical Studios: the Workflow in (Hypothetical) Action

Consider a hypothetical mid-sized 3D development house called Canonical 
Studios. This company's business is small-scale 3D experiences, including
contract work (marketing, etc.) for other companies as well as their own
independent games. Their contract work must ship in a wide variety of 
scenarios including standalone apps (native and Web) as well as 
pre-existing Websites operated by major brands. Their indie games also 
ship in a variety of circumstances, and often the same game will ship in 
more than one shipping vehicle.

Canonical Studios employs about 20 developers (spread out across 
disciplines including code, art, design, and so on) organized into four
teams: three "3D experiences" teams and one "frontend/integrations" team.
At any given time, the "3D experiences" teams may each be working on 
separate 3D experiences, largely independent of each other and independent 
of the frontend team does to deliver those experiences to customers. Thus,
at any given time, Canonical Studios may have up to four active workstreams
in flight: three under-development 3D experiences plus the integration 
work to deliver the most recently finished 3D experience to customers.

Because Canonical Studios leverages the Babylon.js Template Repository
Workflow as part of its operations, all four of these teams are able to
pursue these simultaneous workstreams highly independently thanks to the
separation of concerns. Each new 3D experience begins from the first two
steps of the Quick Start guide at the top of this page; thus, every 
individual 3D experience is its own Git repository and, eventually,
NPM package ready to be integrated in any shipping vehicle capable of 
consuming NPM packages. Asset hosting, kept isolated from experience 
development from the start, will not add bloat to either the Git repository
or the NPM package and can be solved in various ways as appropriate to the
scenario (or even in combinations of different ways at different times, 
such as simple individual hosting during development adapting to asset
bundles for shipping). Finally, once a 3D experience is ready to be 
integrated into its shipping vehicle, the frontend team merely has to 
integrate the experience's NPM package and inform that package of how to 
get the assets based on the hosting solution chosen for shipping.

So, for a contract product -- for example, let's say Canonical has been 
contracted to add a 3D bee character that animates around the homepage
of an apiary -- the first task belongs to a 3D experiences team, which
creates new repositories in which to develop the bee experience. They 
populate the NPM Package Template's `test_package` with a dummy version
of the customer's homepage, then create their experience to add the animated
bee to that, exposing a minimal contract from `app_package` to 
`test_package`. When the experience is satisfactory, it is exported as an 
NPM package and handed off, along with bee asset, to the 
integration/frontend team. The 3D experiences team can then move on to their
next product (though presumably remaining available to help if needed) as
the only thing the frontend/integration team should have to do is decide 
where on the customer's system to host the bee asset, expose the NPM 
package, then integrate it into the customer's site as they would any other
NPM package.

The same general workflow applies to shipping an indie game, but the variety
of shipping vehicles further exercises the flexibility of the approach.
Again, the 3D experiences team's final product is an experience NPM package
and a library of assets handed off to the frontend/integration team. 
However, because this experience has multiple shipping vehicles, the 
integration/frontend work is a bit more varied. For each shipping vehicle 
(Web, native hybrid app, PWA, etc.), the details of where/how assets can
be hosted/accessed may vary significantly; however, since the concerns of
asset hosting and shipping vehicle have been kept separate from the 3D
experience development from the beginning, it is possible for all shipping
vehicles to ship the *exact same 3D experience NPM package*, with only the
infrastructure surrounding the 3D experience differing from platform to 
platform.

### Disadvantages

Though the Template Repository Workflow is, we believe, well-suited to many 
common scenarios, there are certain scenarios where this pattern will do 
more harm than good. Because of the Workflow's emphasis on separation of
concerns, it is unlikely to be a good alternative when the concerns are not 
actually separate. In particular, the Workflow's primary conceit is that
the Babylon experience being developed is largely isolated from the logic 
of the shipping vehicle that contains it; this is viable as long as the
logic boundary can be condensed to a "contract" through which the shipping
vehicle and the 3D experience can communicate. In some cases, however, it 
may be desirable for the 3D experience to be intentionally tightly coupled
to the experience in which it resides, which may eventually broaden the
"contract" to the point where concerns aren't really separate, at which 
point the appearance of separating concerns may add nothing more than
inconvenience.

Another potential disadvantage of the Template Repository Workflow is that,
out of the gate, it may not facilitate the use of certain tools. The 
Babylon.js Community-driven Editor, for example, has its own conventions 
and practices which may not allow both workflows to be used effeciently
on the same project. Similarly, the Workflow's unrestrained embrace of NPM
may make it more difficult to adapt to situations where using NPM is not
an option, though certain overarching themes and patterns may still be
transferrable.
