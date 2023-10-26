---
title: Physics Collider Components
image:
description: Using colliders in the Unity Toolkit.
keywords: babylon.js, exporter, unity, collisions, collider, extension
further-reading:
video-overview:
video-content:
---

Collider components define the shape of an object for the purposes of physical collisions. A collider, which is invisible, need not be the exact same shape as the object’s mesh and in fact, a rough approximation is often more efficient and indistinguishable in gameplay.

The simplest (and least processor-intensive) colliders are the so-called primitive collider types. In 3D, these are the Box Collider, Sphere Collider and Capsule Collider. Any number of these can be added to a single object to create compound colliders.

With careful positioning and sizing, compound colliders can often approximate the shape of an object quite well while keeping a low processor overhead. Further flexibility can be gained by having additional colliders on child objects (eg, boxes can be rotated relative to the local axes of the parent object). When creating a compound collider like this, there should only be one **Physics State** component, placed on the root object in the hierarchy.

There are some cases, however, where even compound colliders are not accurate enough. In 3D, you can use Mesh Colliders to match the shape of the object’s mesh exactly.

Colliders can be added to an object component to create floors, walls and other motionless elements of a scene. These are referred to as static colliders. Colliders on an object that does have a **Physics State** are known as dynamic colliders. Static colliders can interact with dynamic colliders but since they don’t have a **Physics State**, they will not move in response to collisions.

Please refer to the [Unity Collision](https://docs.unity3d.com/Manual/CollidersOverview.html) documentation for details.

## Managed Runtime Collision Events

Example **Collision Event** script component:

```javascript
    module PROJECT {
        export class ShotController extends BABYLON.MeshComponent {
            protected start() :void {
                // Physcis collision
                this.onCollisionEvent((collider:BABYLON.AbstractMesh, tag:string) => {
                    if (tag === "Asteroid" || tag === "Enemy" || tag === "Player") {
                        const metadata: BABYLON.ObjectMetadata = this.manager.findSceneMetadata(collider);
                        if (metadata.getProperty<boolean>("destroyed", false) === false) {
                            metadata.setProperty("destroyed", true);
                            if (this.shotType === 0) {
                                // Player shot
                                if (tag === "Asteroid" || tag === "Enemy") {
                                    const points:number = 0;
                                    if (tag === "Asteroid") {
                                        points = SpaceController.AsteroidPoints;
                                        this.manager.instantiatePrefab("Asteroid_Explosion", "Asteroid_Explode_" + this.shotName, collider.position.clone(), collider.rotation.clone());
                                    } else if (tag === "Enemy") {
                                        points = SpaceController.EnemyPoints;
                                        this.manager.instantiatePrefab("Enemy_Explosion", "Enemy_Explode_" + this.shotName, collider.position.clone(), collider.rotation.clone());
                                    }

                                    // Safely destroy game objects
                                    this.manager.safeDestroy(this.mesh);
                                    this.manager.safeDestroy(collider);
                                    SpaceController.Instance.addScore(points);
                                }
                            } else if (this.shotType === 1) {
                                if (tag === "Player") {
                                    this.manager.instantiatePrefab("Player_Explosion", "Player_Explode_" + this.shotName, collider.position.clone(), collider.rotation.clone());
                                    // Safely destroy game objects
                                    this.manager.safeDestroy(this.mesh);
                                    this.manager.safeDestroy(collider);
                                    SpaceController.Instance.gameOver(false);
                                }
                            }
                        }
                    }
                });
            }
        }
    }
```
