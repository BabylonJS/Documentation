---
title: SPS Tree Generator
image:
description: Learn about the sps tree generator extension.
keywords: extensions, babylon.js, tree, tree generator, sps
further-reading:
video-overview:
video-content:
---

![Generated Tree ](/img/extensions/trees/genTree.webp)

The function createTree uses the solid particle system to generate a tree.
A base tree is created, consisting of a trunk that forks into branches, which may then fork again or not.
This base tree is used in two different ways: 1. as the trunk and parent branches for the whole tree, and 2. with leaves added as a mini-tree that is added multiple times to the base trunk and parent branches to form the whole tree.

![Base Tree to Full Tree Sequence ](/img/extensions/trees/baseToFull.webp)

A demo can be found at: <Playground id="#1LXNS9#4" title="SPS Tree Generator Example" description="Simple example of the sps tree generator."/>

## How to use it

Clone or copy the file https://github.com/BabylonJS/Extensions/blob/master/TreeGenerators/SPSTreeGenerator/TreeGenerator.js

Call the function.

```javascript
const tree = createTree(trunkHeight, trunkTaper, trunkSlices, trunkMaterial, boughs, forks, forkAngle, forkRatio, branches, branchAngle, bowFreq, bowHeight, leavesOnBranch, leafWHRatio, leafMaterial, scene);
```

## Parameters

trunkHeight - Height of the tree trunk. The initial trunk radius is 1 unit.  
trunkTaper - Fraction of the starting radius used for the end radius of a branch, between 0 and 1.  
trunkSlices - The number of points on the paths used for the ribbon mesh that forms the branch.  
trunk material - The material used on all branches.  
boughs - The number of times the tree will split into forked branches: 1 means the trunk splits into branches, 2 means those branches also split into branches.  
forks - The number of branches a branch can split into. A value of 5 or more really slows generation.  
forkAngle - The angle a forked branch makes with its parent branch, measured from the branch direction.  
forkRatio - The ratio of a branch's length to its parent's length, between 0 and 1.  
branches - The number of mini-trees that are randomly added to the tree.  
branchAngle - The angle the mini-tree makes with its parent branch, measured from the branch direction.  
bowFreq - The number of bows (bends) in a branch. A trunk is set to have only one bow.  
bowHeight - The height of a bow from the branch's direction line.  
leavesOnBranch - The number of leaves added to one side of a branch.  
leafWHRatio - Width-to-height ratio for a leaf, between 0 and 1. Closer to 0 means a longer leaf, and closer to 1 means a more circular one.  
leafMaterial - Material used for all leaves.  
scene - BABYLON scene.

## Examples of Results for some Parameters

![Forks and Boughs ](/img/extensions/trees/forks.webp)

![Fork Angles ](/img/extensions/trees/forkAngle.webp)

![Bows and Slices ](/img/extensions/trees/bows.webp)

![Leaf Ratio ](/img/extensions/trees/leafRatio.webp)
