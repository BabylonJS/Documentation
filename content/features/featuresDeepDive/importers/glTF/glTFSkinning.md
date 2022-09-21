---
title: glTF 2.0 Skinning
image: 
description: Learn about the implementation details for how skinning is implemented in Babylon.js
keywords: diving deeper, import, importing assets, asset, importing, skin, skinning, skeleton, bones, joints
further-reading:
video-overview:
video-content:
---

## Introduction
Skinning in glTF 2.0 is a bit different than how skinning typically works in Babylon.js. This document will describe a couple of important implementation details in the glTF 2.0 loader regarding skinning. All mentions of glTF below is scoped to glTF 2.0.

## Bones with Linked Nodes

The skeleton joints in glTF (a.k.a. bones in Babylon.js) point to nodes that are part of the scene hierarchy. Because these joint nodes are also normal scene nodes, they can also have child nodes that have meshes or additional hierarchies. Furthermore, nodes in the scene hierarchy can be referenced by multiple skeletons. This is different than how Babylon.js skinning works. Babylon.js separates the skeleton of the skinned mesh into a separate object. The separate skeleton holds bones which are not tied to the scene hierarchy by default. To acommodate this difference, the glTF loader in Babylon.js creates bones that are linked to the corresponding nodes in the scene via [`bone.linkTransformNode`](/typedoc/classes/babylon.bone#linktransformnode).

For example, for the [SimpleSkin model](https://playground.babylonjs.com/#SRVW8J), the first bone `joint1` is linked to the node `node1` in the scene.

![LinkedTransformNode](/img/importers/glTF/glTF_Skinning_LinkedTransformNode.jpg "Bone linked with transform node")

The transform of `joint1` will change if the transform of `node1` changes. Similarly, `joint2` is linked with `node2` and the transform of `joint2` will change if the transform of `node2` changes. If there are more bones, they will all be linked to the corresponding node in the scene.

Because of this, modifications to the transforms of bones with linked nodes will be lost since they are updated from the transform of the corresponding node every frame. Changing bone transforms with linked nodes must be performed on the linked node.

## Ignoring the Transform of the Skinned Mesh

In the [skinning section of the glTF 2.0 specification](https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#skins), it states:

> Only the joint transforms are applied to the skinned mesh; the transform of the skinned mesh node MUST be ignored.

This statement is here to prevent the transforms from being applied twice to the skinned mesh, once via the path to the skinned mesh, and another via the path to the skeleton joints (a.k.a. bones in Babylon.js).

For example, for the [CesiumMan model](https://playground.babylonjs.com/#T1IFZA), there are two parent nodes above the skinned mesh node that have non-identity transforms.

![ParentTransforms1](/img/importers/glTF/glTF_Skinning_ParentTransforms1.jpg "Skinned mesh with non-identity parent transforms 1")
![ParentTransforms2](/img/importers/glTF/glTF_Skinning_ParentTransforms2.jpg "Skinned mesh with non-identity parent transforms 2")

These nodes are parents of both the skinned mesh `Cesium_Man` and the skeleton root node `Skeleton_torso_joint1`. Having the parent transforms be applied to both will result in the parent transforms being applied twice. _For more details and discussions on this issue, see [this comment](https://github.com/KhronosGroup/glTF/pull/1195#issuecomment-364597428) from the glTF GitHub repo._

One of these parent transform branches must be ignored. The glTF specification ignores the skinned mesh branch since this matches the behavior of Unity3D. Unfortunately, this does not match what Babylon.js does. Babylon.js has a separated skeleton object and the parent transforms apply to the skinned mesh.

To satisfy this requirement from glTF, the glTF loader loads the skinned mesh without its own transform and parents the skinned mesh as a sibling of the skeleton root node. For the CesiumMan model, this is at the same location, but for other cases, it might not be in the same location in the scene hierarchy. Furthermore, the skinned mesh is allowed to have child nodes that have meshes or additional hierarchies. Thus, in additional to creating a skinned mesh, the glTF loader also creates a node that represents the glTF node with the skinned mesh, in case this node is animated or has additional child nodes.

_NOTE: Before Babylon.js 5.0, the glTF loader uses a property `overrideMesh` that on the skeleton to override the mesh used by the skeleton in order to ignore the parent transform up to the glTF root node which contained the right-hand to left-hand conversion. This method, however, caused all sort of issues that are outside the scope of this document to explain. This property has since been removed from the skeleton class._
