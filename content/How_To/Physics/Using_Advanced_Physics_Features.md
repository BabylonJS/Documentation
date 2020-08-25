# How To Use Advanced Physics Features

## The Heightmap

One of the best way of interacting with a ground object is the Heightmap impostor (supported currently only with the CannonJS plugin).

A heightmap is not a mesh impostor. It is possible that objects coming from the side will not collide with it. The heightmap impostor takes the height Y value at a certain point in a mesh and sets a collision point. To understand what a heightmap impostor is, think of a regular house with a triangle roof. If we set the heightmap impostor to the house, the only part that will have collision detection is the roof. Anything below the roof will be ignored, including the walls.

On the positive side, a heightmap can collide with most other objects, as opposed to the mesh impostor which only collides against spheres. Performance is also much better with a heightmap than with a mesh impostor.

There are certain conditions in which a heightmap can be initialized:

* It must be square (x === z). The most important values are the y values in each point of the heightmap.
* It cannot contain holes or missing textures
* It is recommended that the heightmap be generated from a GroundMesh, generated from a heightmap image

To create a ground from an image-based ground mesh:

```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", 200, 200, 50, 0, 30, scene, false, function () {
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
});
```

To create a heightmap from a square ribbon:

```javascript
var exponentialPath = function (p) {
    var path = [];
    for (var i = -50; i <= 50; i++) {
        path.push(new BABYLON.Vector3(p-50, (Math.sin(p / 3) * 10 * Math.exp((i - p) / 100) + i / 3), i));
    }
    return path;
};
// let's populate arrayOfPaths with all these different paths
var arrayOfPaths = [];
for (var p = 0; p <= 100; p++) {
    arrayOfPaths[p] = exponentialPath(p);

}

var mesh = BABYLON.Mesh.CreateRibbon("ribbon", arrayOfPaths, false, false, 0, scene);
mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction:1, restitution: 0.5 });
```

A demo for both of these examples can be found here - 
* https://www.babylonjs-playground.com/#D3LQD#7
* https://www.babylonjs-playground.com/#EXL6K#9

## Mesh Impostor

A mesh impostor wraps a complex mesh with a physics body, allowing exact collision detection with the object. As opposed to the heightmap impostor, a mesh impostor has the entire mesh covered.

A mesh impostor is only available with cannon.js, and only collides against spheres.

Regarding performance - you will notice that the mesh impostor doesn't influence performance too much, until an object collides against it. Then the calculations are rather complex and can lower your FPS significantly, depending on the mesh's complexity.

A simple example of the mesh impostor can be found here - https://playground.babylonjs.com/#3B3135#1

To generate a mesh impostor, simply set the MeshImpostor type when creating the physics impostor of the mesh:

```javascript
mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0});
```

The rest will be done by Babylon and the physics engine.

A wonderful example of the abilities of the mesh impostor can be found here - https://ajna4taiga.tk/PerplexusShadowOpen/Home.html

## Motors

Certain joint types like the wheel (hinge) joint have the ability to run a motor that will move the impostor connecting to the joint in the direction set by the user.

Motors can be used to move a wheel of a car, to simulate an elevator or create a gear system. The motor is responsible to enable the circular movement of those simulations.

A simple example can be seen here - https://playground.babylonjs.com/#5W5B6W#1

Motor.enabled joints are using the `IMotorEnabledJoint` :

```javascript
interface IMotorEnabledJoint {
    physicsJoint: any; //the native physics joint object. Coming from the selected engine.
    setMotor(force?: number, maxForce?: number, motorIndex?: number): void; // provide force to the motor
    setLimit(upperLimit: number, lowerLimit?: number, motorIndex?: number): void; // set limits to the motor
}
```

Setting a motor on a hinge joint (assuming impostors are already set):

```javascript
var joint1 = new BABYLON.HingeJoint({
    mainPivot: new BABYLON.Vector3(0, 0, 0), // Pivot on the main mesh
    connectedPivot: new BABYLON.Vector3(0, 0, 0), // pivot (connecting point) on the connected pivot
    mainAxis: new BABYLON.Vector3(0, 0, -1), // the hinge will turn on the Z axis
    connectedAxis: new BABYLON.Vector3(0, 0, -1) // Same as above - Z axis on the connected mesh
});
holder.physicsImpostor.addJoint(wheel.physicsImpostor, joint1); // attach holder (main) and wheel using the defined hinge joint

joint1.setMotor(3, 20); // start turning!
```

## Compounds and Babylon's parenting system

Babylon.js supports creating physics compounds. A compound is a collection of physics bodies that are connected together to create a single physics body with the joint geometry of all of the meshes connected.

To create a compound, use babylon's parenting system. A single object should be the parent of the rest of the compound shapes:

```javascript
// Create a 2-sphere compound
 var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
sphere.position.y = 10;

var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
sphere2.position.x = 2;
sphere.position.y = 1;
sphere2.parent = sphere;
```

After creating the meshes, we need to initialize the impostors. It is important to first initialize the child impostors and initialize the parent impostor at the end:

```javascript
sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 2, restitution: 0.8});
sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 2, restitution: 0.8});
```

The mass will be accumulated. So this single physics body's mass will be 4. `sphere2`'s physics impostor will be "disabled" and will be joined to `sphere`'s impostor, which is the main impostor. To apply impulses, set the liner velocity etc', use `sphere.physicsImpostor`.

https://playground.babylonjs.com/#PRHF00#6

An advanced example of compounds can be seen here - https://playground.babylonjs.com/#5W5B6W#3 . The boxes connected to the disc are connected using Babylon's parenting system.

### ignoreParent

You can disable the compound behavior of babylon by setting the ignoreParent flag when creating the impostor.
It is important to note that this will only work if your parent has no impostor attached to it. Otherwise the results can vary from weird physics calculations to missing collisions.

To create an impostor for a child mesh using the ignoreParent flag:

```javascript
sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, {ignoreParent: true, mass: 2, restitution: 0.8});
```

A simple example can be found here - https://playground.babylonjs.com/#PRHF00#4

## Substeps

It's possible to run the physics ticks at a different frequency than the framerate while keeping consistent display.
This means it's possible to display at 60 frames per seconds while updating the physics 1000 times a second.
With substeps, the physics will look like it's running at 60 frames per second but will perform smaller steps.
This is useful when the physics update needs more precision. For example, simulating a bullet against a wall or more accurate physics for a car.
The substeps can also be used to reduce the physics update. For example, doing an update every 2 frames.
In the following example, the physics is computed 10 times a second instead of 60. 

```javascript
var physicsEngine = scene.getPhysicsEngine();
physicsEngine.setSubTimeStep(100);
```

https://www.babylonjs-playground.com/#YUNAST#21

## Cloth simulation

Raanan Weber wrote an article about cloth simulation in his blog: <https://blog.raananweber.com/2016/04/03/cloth-physics-simulation-for-babylon-js/>

## Some random demos

* Cannon car demo - https://www.babylonjs-playground.com/#UGMIH#8
* Oimo car demo - https://www.babylonjs-playground.com/#SFELK#3
* Heightmap game - https://www.babylonjs-playground.com/#DLBW7#11
* Net on a sphere - https://www.babylonjs-playground.com/#1M67K8#7
* Newton's cradle - https://www.babylonjs-playground.com/#MDMVA#18

# Further Reading

## Basic - L1

[How To Use The Physics' Engines](/how_to/using_the_physics_engine)  
[How To Use Forces](/how_to/forces)  
[How to use Joints](/how_to/joints)  
[How To Use Pivots and Axes](/how_to/joint_pivots)  
[How To Create Compound Bodies](/how_to/compounds)  
[How To Create Soft Bodies](/how_to/soft_bodies)
 
## More Advanced - L3

[How To Add Your Own Physics Engine](/how_to/Adding_Your_Own_Physics_Engine_Plugin_to_Babylon.js)