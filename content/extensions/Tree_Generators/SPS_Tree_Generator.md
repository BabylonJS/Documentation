---
title: SPS Tree Generator
image: 
<<<<<<< HEAD
description: A method of generating a tree using SPS.
keywords: welcome, babylon.js, tree, tree generator
=======
description: Learn about the sps tree generator extension.
keywords: extensions, babylon.js, tree, tree generator, sps
>>>>>>> 0a9d2fb9c99e3447ee3122c8df9d8182db9c7827
further-reading:
video-overview:
video-content:
---
<<<<<<< HEAD
=======

## SPS Tree Generator
>>>>>>> 0a9d2fb9c99e3447ee3122c8df9d8182db9c7827

![Generated Tree ](/img/extensions/trees/genTree.png)

The function createTree uses the solid particle system to generate a tree. 
A base tree is created consisting of a trunk which forks into branches, which then themselves may fork or not.
This base tree is used in two different ways. 
    1. as the trunk and parent branches for the whole tree.
    2. with leaves added as a mini-tree that is added a number of times to the base trunk and parent branches to form the whole tree.
    
  ![Base Tree to Full Tree Sequence ](/img/extensions/trees/baseToFull.png)  
  
<<<<<<< HEAD
  A demo can be found at:  PG: <Playground id="#1LXNS9#4" title="SPS Tree Generator" description="Example of a SPS Tree Generator" image=""/>
=======
  A demo can be found at: <Playground id="#1LXNS9#4" title="SPS Tree Generator Example" description="Simple example of the sps tree generator." image=""/>
>>>>>>> 0a9d2fb9c99e3447ee3122c8df9d8182db9c7827

## How to use it.

Clone or copy the file https://github.com/BabylonJS/Extensions/blob/master/TreeGenerators/SPSTreeGenerator/TreeGenerator.js

call the function

```
var tree = createTree(trunkHeight, trunkTaper, trunkSlices, trunkMaterial, boughs, forks, forkAngle, forkRatio, branches, branchAngle, bowFreq, bowHeight, leavesOnBranch, leafWHRatio, leafMaterial, scene);
```

## Parameters

trunkHeight - height of trunk of tree. The initial trunk radius is 1 unit.  
trunkTaper -  fraction of starting radius for the end radius of a branch between 0 and 1.   
trunkSlices - the number of points on the paths used for the ribbon mesh that forms the branch.  
trunk material - the material used on all branches.  
boughs - the number of times the tree will split into forked branches, 1 trunk splits into branches, 2 these branches also spilt into branches.  
forks -  the number of branches a branch can split into, 5 or more really slows the generation.  
forkAngle - the angle a forked branch makes with its parent branch measured from the direction of the branch.  
forkRatio - the ratio of the length of a branch to its parent's length, between 0 and 1.  
branches - the number of mini-trees that are randomally added to the tree.  
branchAngle - the angle the mini-tree makes with its parent branch from the direction of the branch.  
bowFreq - the number of bows (bends) in a branch. A trunk is set to have only one bow.  
bowHeight - the height of a bow from the line of direction of the branch.  
leavesOnBranch - the number of leaves to be added to one side of a branch.  
leafWHRatio - width to height ratio for a leaf between 0 and 1, closer to 0 longer leaf, closer to 1 more circular.  
leafMaterial - material used for all leaves.  
scene - BABYLON scene.  

## Examples of Results for some Parameters

![Forks and Boughs ](/img/extensions/trees/forks.png)

![Fork Angles ](/img/extensions/trees/forkAngle.png)

![Bows and Slices ](/img/extensions/trees/bows.png)

![Leaf Ratio ](/img/extensions/trees/leafRatio.png)