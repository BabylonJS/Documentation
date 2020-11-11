---
title: LinearCloner
image: 
description: The LinearCloner clones and distributes given meshes in a linear manner.
keywords: welcome, babylon.js, cloner system
further-reading:
video-overview:
video-content:
---

![idpic1](/img/extensions/clonerSystem/linearCloner.jpg "LinearCloner's with different transforming parameters")

The LinearCloner clones and distributes given meshes in a linear manner. If more than one mesh is provided, then the corresponding clones will be placed subsequently one after another. The LinearCloner can instantiated in two different interpolation-modes: absolute and relative. In the first mode the values of the input parameters (scale/rotation/position) can be seen as the difference from the first to the last clone, whereas in the relative mode those values are the difference from clone to clone. 
The LinearCloner returns an object with an important property: **root**. It is an invisible mesh, it's the anchor and parent of all generated clones, its position is the position of the first clone. Transforming this **root** affects all underlying clones (childs) at once but independently of the interpolation mode. Most of the input parameters are also available as properties and they are very suitable for animation (tweening). The given input meshes will be made inactive during construction, so after construction there will be only one of two possible mesh types: BABYLON **clones** or **instances**.  
*Note:* Input meshes can be BABYLON meshes but other Cloners as well!

## Example
Example of a LinearCloner with a count of 10 clones (5 x cube1, 5 x cube2) with an increment vector of {x:2,y:0,z:-1} :

`var lc = new BABYLONX.LinearCloner([cube1, cube2], demo.scene, { iModeRelative:true,count:10,P:{x:2,y:0,z:-1} });`

Transforming of all clones can be done as you would do with a single mesh:

`lc.root.scaling.y = 2;`
`lc.root.rotation.x = Math.PI / 4;`

Animation can be done via properties:

`BABYLON.Animation.CreateAndStartAnimation('ani', lc, 'offset', 30, 120, 0, 10);`

## Parameters
`BABYLONX.LinearCloner( meshes, scene[, {optional parameters}])` 

Mandatory Parameter | Description 
--------------------|------------
meshes| array of meshes/cloners to be cloned, meshes will be made inactive after construction
scene|BABYLON scene

Optional Parameter | Description | Default Value
-------------------|-------------|--------------
count | the nuber of clones | 3
offset| offset in world units in the direction of the transform position vector | 0
growth| weight factor for all transform parameters in percent/100  |1
P| transform position vector | { x: 0, y: 2, z: 0 }
S| scale transformation| { x: 1, y: 1, z: 1}
R| rotation values in degrees | { x: 0, y: 0, z: 0 }
iModeRelative| interpolation mode, | false (absolute)
useInstances| flag if clones should be technical "clones" or "instances" | true


Properties | Description 
------------|-------------
count |@see Optional Parameter
offset| @see Optional Parameter
growth| @see Optional Parameter
position| @see Optional Parameter P
scale| @see Optional Parameter S
rotation| @see Optional Parameter R
rotation3|rotation values in radians {x,y,z}
offset| @see Optional Parameter
root| READONLY, getting an invisibe mesh representing the anchor of the cloner (root node)
effectors| READONLY, gets a list of Effectors assigned to this Cloner

Methods | Description 
------------|-------------
addEffector(effector, sensitivity)| adds an effector to this Cloner and sets the sensitivity (1=full sensitivity, 0=no sensitivity ==ignore effector)
setEnabled(flag)|set the cloner's root node to the state of the flag (true=enabled) 
