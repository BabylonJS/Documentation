# Physics Engine Support

Physics engines are third party external programs that can be plugged into Babylon.js. They, depending on their features, emulate "real-life" interactions between objects, which can be meshes, solid particles from the solid particle system or some caameras. One feature of a Physics Engine is the addition of gravity to a scene.

## Physics Engines Available

There are plugins for 3 physics engines:

1. Cannon.js - a wonderful physics engine written entirely in JavaScript
2. Oimo.js - a JS port of the lightweight Oimo physics engine
3. Ammo.js - a JS post of the bullet physics engine

All need to be enabled before use.

## Impostors

Interactions between objects are achieved by imposters, simple objects that are attached to any complex objects with a scene. To allow interaction between objects, the physics engines use an impostor, which is a simpler representation of a complex object. The imposter can be assigned physical attributes such as mass, friction and a coefficient of restitution.

* [Playground Example Physics](https://www.babylonjs-playground.com/#BEFOO)

It is also possible to assign linear and angular velocities to an imposter as well as an impulse and in the case of the Cannon and Ammo Physics Engines a force.

Two imposters can be connected using joints such as a hinge or ball and socket.

Collisions between two imposters P<sub>0</sub> and P<sub>1</sub> is handled by setting a callback function on P<sub>0</sub> that determines the action when in contact with P<sub>1</sub>.

Ammo also allows the creation of soft bodies.

# Further Reading

## Basic - L1

[Using a Physics Engine](/How_To/Using_The_Physics_Engine)

## More Advanced - L3

[Add Your Own Physics Engine](/How_To/Adding_Your_Own_Physics_Engine_Plugin_to_Babylon.js)