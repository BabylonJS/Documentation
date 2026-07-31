---
title: RadialCloner
image:
description: The RadialCloner distributes given meshes in a radial manner.
keywords: cloner system, RadialCloner
further-reading:
video-overview:
video-content:
---

![idpic1](/img/extensions/clonerSystem/radialCloner.webp "RadialCloner's from left to right: aligned, unaligned, aligned clones")

The RadialCloner distributes the given meshes in a radial manner. If more than one mesh is provided, the clones are placed alternately. Several parameters control the position, angle, type, and orientation of the clones. The RadialCloner returns an object with one important property: **root**. It is an invisible mesh that acts as the anchor, center, and parent of all generated clones. Transforming this **root** (position/scale/rotation) affects all underlying clones (children) at once. Most of the input parameters are also available as properties and are very suitable for animation (tweening). The given input meshes are made inactive during construction, so after construction there will be only one of two possible mesh types: BABYLON **clones** or **instances**.  
_Note:_ Input meshes can be BABYLON meshes but other Cloners as well!

## Example

Example of a RadialCloner with a count of 24 clones (12 cubes cube1/cube2), distributed with alignment enabled and a radius of 6 units in the XZ plane:

`const rc = new BABYLONX.RadialCloner([cube1, cube2], demo.scene, {count:24,radius:6});`

Transforming all clones can be done as you would with a single mesh:

`rc.root.scaling.y = 2;`
`rc.root.rotation.x = Math.PI / 4;`

Animation can be done via properties:

`BABYLON.Animation.CreateAndStartAnimation('radanimation', rc, 'startangle', 30, 120, 0, 90);`

## Parameters

`BABYLONX.RadialCloner( meshes, scene[, {optional parameters}])`

| Mandatory Parameter | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| meshes              | array of meshes/cloners to be cloned, meshes will be made inactive after construction |
| scene               | BABYLON scene                                                                         |

| Optional Parameter | Description                                                          | Default Value          |
| ------------------ | -------------------------------------------------------------------- | ---------------------- |
| count              | the number of clones                                                 | 3                      |
| radius             | radius in world units                                                | 3                      |
| align              | flag if clones are aligned against the middle position of the cloner | true                   |
| startangle         | angle in degrees                                                     | 0                      |
| endangle           | angle in degrees                                                     | 360                    |
| offset             | angle in degrees                                                     | 0                      |
| useInstances       | flag if clones should be technical "clones" or "instances"           | true                   |
| plane              | object \{x,y,z\} describing the cloner's orientation                 | \{ x: 1, y: 0, z: 1 \} |

| Properties | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| count      | @see Optional Parameter                                                              |
| radius     | @see Optional Parameter                                                              |
| align      | @see Optional Parameter                                                              |
| startangle | @see Optional Parameter                                                              |
| endangle   | @see Optional Parameter                                                              |
| offset     | @see Optional Parameter                                                              |
| root       | READONLY, gets an invisible mesh representing the anchor of the cloner (root node) |
| effectors  | READONLY, gets a list of Effectors assigned to this Cloner                           |

| Methods                            | Description                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| addEffector(effector, sensitivity) | adds an effector to this Cloner and sets the sensitivity (1 = full sensitivity, 0 = no sensitivity, which ignores the effector) |
| setEnabled(flag)                   | sets the cloner's root node to the state of the flag (true = enabled)                                              |
