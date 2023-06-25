---
title: Bone Class Internals
image:
description: Learn all about how bones are internally implemented by the Bone class
keywords: diving deeper, meshes, bones, skeletons, rigging
further-reading:
video-overview:
video-content:
---

The purpose of this page is to explain how a bone is implemented in Babylon.js, and in particular which matrices are used internally to calculate the final transformation matrix of the bone.
If you want to manipulate bones manually, or simply understand how they work, this page is for you, as it's not easy at first to understand how everything works together.

Note that we won't be going back over the basics of bones, so if you don't know what a bone is, or how it works, first read the [Bones and skeletons](/features/featuresDeepDive/mesh/bonesSkeletons) page.

## Bone class generalities

The `Bone` class extends `Node` and not `TransformNode`, which may seem surprising at first glance since position/rotation/scale only exists in `TransformNode` and not in `Node`, but this is for historical reasons.

This means that `Bone` implements its own position/rotation/scale properties, and that a bone will not appear in the scene node hierarchy displayed by the inspector, since only transform nodes (and derived classes) are displayed in the hierarchy.

Bones only appear as child nodes of a skeleton, under the **Skeletons** entry in the Inspector:

![Skeletons in Inspector](/img/features/boneInternals/skeletonsInInspector.jpg)

Bones have a `length` property, which is not used directly by the class. It's mainly used by the `BoneIKController` class, which needs it for leaf bones.
The last bone in a chain is not connected to any other bone, so it's not possible to calculate its length (which is in fact the distance between the bone's position and the position of the child bone).
An ad-hoc length is therefore required for the last bone in a chain, which is why the `length` property is used.

## Linked TransformNode

Each bone can have a linked `TransformNode` (which you can retrieve with a call to `Bone.getTransformNode()`), in which case it's this node that will undergo the transformations (through animations, for example), and the transformations of this node will be copied into the bone (this copy is made in `Skeleton.prepare`).

This mode has been added to handle skeletons loaded from gltf/glb files, where the skeleton bones are in fact regular nodes in the scene node hierarchy.

It's important to understand that when a bone is linked to a transform node, modifying the translation/rotation/scaling of the bone will have no effect; instead, you need to update the linked transform node!

More information on this subject can be found in [glTF 2.0 Skinning](/features/featuresDeepDive/importers/glTF/glTFSkinning).

## Bone matrices

This is where things get complicated (or interesting)!

The `Bone` class uses 6 matrices internally to do its work. This can be confusing at first, so let's try to categorize and describe them:

|Internal property|Public access|Description|
|---|---|---|
| `_localMatrix` | `Bone.getLocalMatrix()` | This matrix is the one that stores the current local space position/rotation/scale of the bone. You can think of it as the main matrix, as it's the one that will actually move/rotate/scale the bone. However, as with the transform nodes, you won't be modifying the matrix directly, but updating the position/rotation/scale properties instead (either of the bone, or of the linked transform node if the bone is using this mode). |
| `_worldTransform` | `Bone.getWorldMatrix()` | This matrix stores the final transformation of the bone (after the bind pose has been removed, that is after `_invertedAbsoluteTransform` has been applied - see below), in world space. This is the matrix that will be used in the vertex shader to transform the vertices. |
| `_baseMatrix` | `Bone.getBaseMatrix()` or<br/>`Bone.getBindPose()`| This matrix stores the bone transformation (in local space) that corresponds to the bind pose, i.e. the bone position/rotation/scale that is the "natural" bone transformation. This transformation acts as an "identity" transformation (or "non-transformation") as it is removed from the final transformation (stored in `_localMatrix`) before being used to transform the vertices. This is normally the transformation of the bone set at creation time. |
| `_invertedAbsoluteTransform` | `Bone.getInvertedAbsoluteTransform()` | This matrix stores the inverse matrix of `_baseMatrix`, in world space. It is the matrix used to remove the bind pose transformation from the final transformation of the bone (the latter one being the transformation you get when you multiply all the local matrices `_localMatrix` of the parents of the bone). This matrix is a bit misnamed, it should be something like `_inverseBindPoseMatrix` instead. |
| `_absoluteTransform` | `Bone.getAbsoluteTransform()` | This matrix normally stores the world transformation matrix of the bone (**with** the bind pose factored in, which is the difference with `_worldTransform`) **BUT** it is also used as a temporary storage when computing `_invertedAbsoluteTransform`! |
| `_restPose` | `Bone.getRestPose()` | This matrix is a user-defined matrix and is not used by the internal workings of the `Bone` class. You can use this matrix to define a bone transformation as the "rest" pose and easily return to this transformation at any time by calling `Bone.returnToRest()` (you can also do this for an entire skeleton by calling `Skeleton.returnToRest()`). By default, the rest matrix is initialized with the base matrix, which means that calling `Bone.returnToRest()` will place the bone in the bind pose. |

This table shows that there are really only two matrices that can be described as "dynamic", the other four being described as "static":
* the **local** and **world** matrices are (or can be) updated frequently (every frame)
* all other matrices are updated only if you modify the bind pose (**base**, **absolute** and **inverse absolute** matrices) or if you modify the rest pose (**rest pose** matrix). In most cases, these matrices are never updated after a bone has been created.

Notes:
* the **world** matrix is relative to the root of the skeleton: in a final step, this matrix is multiplied by the world matrix of the mesh to which the skeleton is attached (this is done in the vertex shader).
* the **base** matrix is only used to calculate the **absolute** and **absolute inverse** matrices. Once the **absolute** and **inverse absolute** matrices have been calculated, the **base** matrix is no longer used (nor is the **absolute** matrix, as we only need the **absolute inverse** matrix).
* only the **base** and **rest pose** matrices have a setter, `Bone.setBindPose()` and `Bone.setRestPose()` respectively. When `Bone.setBindPose()` is called, the **absolute** and **inverse absolute** matrices are also recalculated.

Ultimately, as a user, you should only be concerned with the **local** matrix, but indirectly, through the position/rotation/scale properties of the `Bone` class (or the linked transformation node if the bone uses this mode).

## Details on the class implementation

If you look at the source code, you will see an additional matrix (not exposed to the end-user since it is tagged "@internal") with a getter and a setter: `_matrix`. It is not actually a new matrix, it is an alias to the `_localMatrix` property!

The implementation of the calculation for the **absolute** / **inverse absolute** matrices (in `Bone._updateDifferenceMatrix()`) assumes that all the parent bones in the hierarchy have already been processed and are up to date! So, if you are updating the bind pose for several bones yourself, you should make sure that you update them in the right order. An alternate way is to update the bind pose in any order you want and then call `Bone.computeAbsoluteTransforms()` on the root bone (`Skeleton.computeAbsoluteTransforms()` will do it for you).

The class supports both a rotation and rotationQuaternion to update the bone rotation, but internally, the rotationQuaternion is always used. This means that if you update the rotation, the rotationQuaternion will be updated accordingly, and vice versa.

 For this to work, you should make sure the bones are in the right order in the bone array of the Skeleto (i.e. the parent bones are before the child bones): `Skeleton.sortBones()` can be used to sort the bones in the right order.

## Understanding the bind pose / matrix

bind pose = transformation of the bone at creation time