---
title: ObjectCloner
image:
description: The ObjectCloner clones and distributes given meshes to the facet position of another input-mesh which acts as a template.
keywords: cloner system, ObjectCloner
further-reading:
video-overview:
video-content:
---

![idpic1](/img/extensions/clonerSystem/objectcloner.webp "ObjectCloner")

The ObjectCloner clones and distributes the given meshes to the facet positions of another input mesh that acts as a template. If more than one mesh is provided, the corresponding clones are placed one after another in the order in which the facets of the template mesh are defined.  
The ObjectCloner returns an object with an important property: **root**. It is an invisible mesh that acts as the anchor and parent of all generated clones. Transforming this **root** affects all underlying clones (children) at once, independently of the interpolation mode. The given input meshes and the template mesh are made inactive during construction, so after construction there will be only one of two possible mesh types: BABYLON **clones** or **instances**.  
_Note:_ Input meshes can be BABYLON meshes but other Cloners as well!

## Example

Example of an ObjectCloner with a count of 10 clones (5 x cube1, 5 x cube2) and an increment vector of \{x:2,y:0,z:-1\}:

`const oc = new BABYLONX.ObjectCloner([cube1, cube2], icoSphere, demo.scene);`

Transforming all clones can be done as you would with a single mesh:

`mc.root.scaling.y = 2;`
`mc.root.rotation.x = Math.PI / 4;`

## Parameters

`BABYLONX.ObjectCloner( meshes, templatemesh, scene[, {optional parameters}])`

| Mandatory Parameter | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| meshes              | array of meshes/cloners to be cloned, meshes will be made inactive after construction |
| templatemesh        | the mesh acting as a template                                                         |
| scene               | BABYLON scene                                                                         |

| Optional Parameter | Description                                                | Default Value |
| ------------------ | ---------------------------------------------------------- | ------------- |
| useInstances       | flag if clones should be technical "clones" or "instances" | true          |

| Properties | Description                                                |
| ---------- | ---------------------------------------------------------- |
| effectors  | READONLY, gets a list of Effectors assigned to this Cloner |

| Methods                            | Description                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| addEffector(effector, sensitivity) | adds an effector to this Cloner and sets the sensitivity (1 = full sensitivity, 0 = no sensitivity, which ignores the effector) |
| setEnabled(flag)                   | sets the cloner's root node to the state of the flag (true = enabled)                                              |
