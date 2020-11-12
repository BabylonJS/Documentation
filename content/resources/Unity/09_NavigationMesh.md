---
title: Navigation Mesh
image: 
description: The Unity Toolkit  navigation mesh approximates the walkable surfaces of the level.
keywords: babylon.js, exporter, unity, extension, navigation, navigation mesh 
further-reading:
video-overview:
video-content:
---

The process of creating a navigation mesh from the level geometry is called **NavMesh Baking**. The process collects the **Render Meshes** and **Terrains** of all game objects which are marked as Navigation Static, and then processes them to create a navigation mesh that approximates the walkable surfaces of the level. Please refer to [Unity Navigation](https://docs.unity3d.com/Manual/nav-Overview.html) documentation on navigation.

In Unity, navigation mesh generation is handled from the * **Navigation** * window (Menu: **Window > Navigation**).

Building a navigation mesh for your scene can be done in 4 quick steps. Please refer to the [Unity Navigation Mesh](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html) documentation for details.


## Babylon Navigation Mesh

The [Babylon Navigation Mesh](https://github.com/wanadev/babylon-navigation-mesh) extension is a path finder for AI agents. It uses the **A Star** and **Funnel** algorithms to calculate a path on the exported baked navigation mesh and is packaged as a toolkit plugin.


## Managed Runtime Support

The toolkit scene manager provides easy to use helper functions for client side navigation:

    declare module BABYLON {
        class SceneManager {
            
            /** Gets the native babylon mesh navigation tool */
            getNavigationTool(): Navigation;

            /** Gets the current navigation zone */
            getNavigationZone(): string;

            /** Finds a navigation path and returns a array of navigation positions */
            findNavigationPath(origin: BABYLON.Vector3, destination: BABYLON.Vector3): BABYLON.Vector3[];
            
            /** Gets true if the scene has a navigation mesh */
            hasNavigationMesh(): boolean;
            
            /** Returns the current scene's navigation mesh */
            getNavigationMesh(): BABYLON.AbstractMesh;
            
            /** Builds the current scene's navigation nodes */
            buildNavigationMesh(mesh: BABYLON.AbstractMesh): any;
            
            /** Returns a picked navigation point */
            getNavigationPoint(position: BABYLON.Vector3, raise?: number, length?: number): BABYLON.Vector3;
            
            /** Moves the specified navigation again along a path of positions */
            moveNavigationAgent(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void;
            
            /** Returns an array of navigation agents */
            getNavigationAgents(): BABYLON.Mesh[];
            
            /** Returns the specfied navigation agent info */
            getNavigationAgentInfo(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent;
            
            /** Returns the current scene's navigation area table */
            getNavigationAreaTable(): BABYLON.INavigationArea[];
            
            /** Returns the current scene's navigation area indexes */
            getNavigationAreaIndexes(): number[];
            
            /** Returns the current scene's navigation area names */
            getNavigationAreaName(index: number): string;
            
            /** Returns the current scene's navigation area cost */
            getNavigationAreaCost(index: number): number;
        }
    }

Example **Navigation Mesh** script component:

    module PROJECT {
        export class NavMeshComponent extends BABYLON.MeshComponent {
            private navmesh:BABYLON.AbstractMesh = null;
            public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
                super(owner, scene, tick, propertyBag);
            }
            protected start() :void {
                this.navmesh = this.manager.getNavigationMesh();
                if (this.navmesh) {
                    var minimoi = BABYLON.Mesh.CreateBox("MiniMoi", 0.5, this.scene);
                    minimoi.material = new BABYLON.StandardMaterial("MoiMaterial", this.scene);
                    (<BABYLON.StandardMaterial>minimoi.material).diffuseColor = new BABYLON.Color3(1., 0., 0);
                    minimoi.position = new BABYLON.Vector3(0, 0.25, 0);

                    // Setup point and click demo navigation
                    var canvas = document.getElementById("cvs");
                    canvas.addEventListener('click', (evt)=> {
                        var pickingInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => { return (mesh === this.navmesh); });
                        if (pickingInfo.hit) {
                            var navpoint = pickingInfo.pickedPoint;
                            var path = this.manager.findNavigationPath(minimoi.position, navpoint);
                            if (path != null) {
                                this.manager.moveNavigationAgent(minimoi, path, 5.0);
                            }
                        }
                    });
                }
            }
        }
    }

.