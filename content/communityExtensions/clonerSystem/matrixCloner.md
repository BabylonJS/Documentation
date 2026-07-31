---
title: MatrixCloner
image:
description: The MatrixCloner clones and distributes given meshes in 3D space.
keywords: cloner system, matrixcloner
further-reading:
video-overview:
video-content:
---

![idpic1](/img/extensions/clonerSystem/matrixcloner.webp "MatrixCloner")

The MatrixCloner clones and distributes the given meshes in 3D space. If more than one mesh is provided, the corresponding clones are placed one after another, starting in the x direction and then continuing in the y and z directions.  
The MatrixCloner returns an object with an important property: **root**. It is an invisible mesh that acts as the anchor and parent of all generated clones, and its position is the center position of all generated clones. Transforming this **root** affects all underlying clones (children) at once. The given input meshes are made inactive during construction, so after construction there will be only one of two possible mesh types: BABYLON **clones** or **instances**.  
_Note:_ Input meshes can be BABYLON meshes but other Cloners as well!

## Example

Example of a MatrixCloner with a count of 10 clones (5 x cube1, 5 x cube2) and an increment vector of \{x:2,y:0,z:-1\}:

`const mc = new BABYLONX.MatrixCloner([cube1, cube2], demo.scene, { mcount: { x: 5, y: 5, z: 5 } });`

Transforming all clones can be done as you would with a single mesh:

`mc.root.scaling.y = 2;`
`mc.root.rotation.x = Math.PI / 4;`

## Parameters

`BABYLONX.MatrixCloner( meshes, scene[, {optional parameters}])`

| Mandatory Parameter | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| meshes              | array of meshes/cloners to be cloned, meshes will be made inactive after construction |
| scene               | BABYLON scene                                                                         |

| Optional Parameter | Description                                                | Default Value          |
| ------------------ | ---------------------------------------------------------- | ---------------------- |
| mcount             | the number of clones in the x, y, and z directions         | \{ x: 3, y: 3, z: 3 \} |
| size               | distance from one clone to another in the x, y, and z directions | \{ x: 2, y: 2, z: 2 \} |
| useInstances       | flag if clones should be technical "clones" or "instances" | true                   |

| Properties | Description                                                |
| ---------- | ---------------------------------------------------------- |
| count      | READONLY, total number of clones after initialization      |
| size       | @see Optional Parameter                                    |
| mcount     | @see Optional Parameter                                    |
| effectors  | READONLY, gets a list of Effectors assigned to this Cloner |

| Methods                            | Description                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| addEffector(effector, sensitivity) | adds an effector to this Cloner and sets the sensitivity (1 = full sensitivity, 0 = no sensitivity, which ignores the effector) |
| setEnabled(flag)                   | sets the cloner's root node to the state of the flag (true = enabled)                                              |
