# Joints

A joint in a physics engine is a constraining feature between two bodies. This area has the largest differences between the physics engine both in the joints available and the names used. Not all native joints are available in some plugins.

Playgrounds are available to check out the coding. In the playgrounds the physics' engine used can be changed by selecting which ones to comment out.

See [How to Use The Physics' Engines](/how_to/using_the_physics_engine) for an overall view of setting up and using the three plugins.

## Physical Joint Types

| Number | Joint                                                   | Name            | Notes                                                                           |
| ------ | ------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| 1      | ![Hinge](/img/how_to/physics/hinge.jpg)                 | Hinge           | Single Axis Rotation                                                            |
| 2      | ![Ball and Socket](/img/how_to/physics/ballnsocket.jpg) | Ball and Socket | Multi Axis Rotation                                                             |
| 3      | ![Cone Twist](/img/how_to/physics/conetwist.jpg)        | Cone Twist      | Unrestricted rotation (Twist) on One Axis, Limited Rotation (in Cone) On Others |
| 4      | ![Wheel](/img/how_to/physics/wheel.jpg)                 | Wheel           | Two Axes Rotation                                                               |
| 5      | ![Slider](/img/how_to/physics/slider.jpg)               | Slider          | Single Axis Translation and Rotation                                            |
| 6      | ![Prismatic](/img/how_to/physics/prismatic.jpg)         | Prismatic       | Single Axis Translation Only                                                    |
| 7      | ![Distance](/img/how_to/physics/distance.jpg)           | Distance        | Set Bodies a Fixed Distance Apart                                               |
| 8      | ![Locked](/img/how_to/physics/locked.jpg)               | Locked          | Bodies Act As One Body                                                          |

## Native Joints for Each Physics Engine

The relationship between native joints and physical joints

**_Cannon.js_**

| Cannon Joint           | Physical Joint    |
| ---------------------- | ----------------- |
| HingeConstraint        | 1 Hinge           |
| PointToPointConstraint | 2 Ball and Socket |
| DistanceConstraint     | 7 Distance        |
| Spring                 | Not Shown         |
| LockConstraint         | 8 Locked          |

**_Oimo.js_**

| Oimo Joint         | Physical Joint    |
| ------------------ | ----------------- |
| HingeJoint         | 1 Hinge           |
| BallAndSocketJoint | 2 Ball and Socket |
| WheelJoint         | 4 Wheel           |
| SliderJoint        | 5 Slider          |
| PrismaticJoint     | 6 Prismatic       |
| DistanceJoint      | 7 Distance        |

**_Ammo.js_**

| Ammo Joint            | Physical Joint    |
| --------------------- | ----------------- |
| HingeConstraint       | 1 Hinge           |
| Point2PointConstraint | 2 Ball and Socket |
| ConeTwistConstraint   | 3 Cone Twist      |
| SliderConstraint      | 5 Slider          |
| FixedConstraint       | 8 Locked(?)       |

## Babylon.js Joints

The following table lists those joints within Babylon.js and where available their equivalence to each other and their link to the native joints

| Babylon.js Joint   | Cannon Joint           | Oimo Joint         | Ammo Joint                                   | Helper Class     |
| ------------------ | ---------------------- | ------------------ | -------------------------------------------- | ---------------- |
| HingeJoint         | HingeConstraint        | HingJoint          | HingeConstraint                              | Yes              |
| BallAndSocketJoint | PointToPointConstraint | BallAndSocketJoint | Point2PointConstraint                        | no               |
| WheelJoint         | ----                   | WheelJoint         | Point2PointConstraint                        | Hinge2Joint Only |
| SliderJoint        | ----                   | SliderJoint        | ----                                         | No               |
| PrismaticJoint     | ----                   | PrismaticJoint     | ----                                         | No               |
| DistanceJoint      | DistanceConstraint     | DistanceJoint      | Point2PointConstraint with Added Constraints | Yes              |
| LockJoint          | LockConstraint         | ----               | ----                                         | No               |
| SpringJoint        | Spring                 | ----               | ----                                         | No               |

The method to form a joint and connect one body (main) to a second body (connected) is

```javascript
var joint = new BABYLON.PhysicsJoint(
  BABYLON.PhysicsJoint.TYPE_OF_JOINT,
  jointData
);

mainImpostor.addJoint(connectedImpostor, joint);
```

where the `jointData` object contains the properties for the joint.

### Hinge Joint

For a hinge the only component of any force that produces movement is one perpendicular to the axis of the hinge. It is possible however that a large impulse in another direction can produce a reaction between the two bodies that does produce an impulse component in the perpendicular direction.

The `jointData` object for a hinge contains the following properties

- mainAxis: Vector3; the axis for the main body.
- connectedAxis: Vector3; the axis for the connected body, usually the same as the main axis.
- mainPivot: Vector3; the pivot point for the main body.
- connectedPivot: vector3; the pivot point for the connected body, the negative of the connected body's position.

A hinge joint can also be created with a helper class

```javascript
var joint1 = new BABYLON.HingeJoint(jointData);
```

**_PhysicsJoint Playground_**

- [Playground Example - Hinge as Sphere - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#32)

**_Helper Class Playground_**

- [Playground Example - Hinge as Sphere - Box and Sphere Imposters](https://www.babylonjs-playground.com/#F15U0G#55)

Since a hinge gives movement about only one axis it would seem to make sense to replace the representation of the hinge with a cylinder. Doing this, reshaping the box and keeping the sphere mesh imposter as a sphere does produce changes.

In this case, for all the physics' engines whatever the direction of impulse set it is applied in a direction perpendicular to the hinge axis.

**_PhysicsJoint Playground_**

- [Playground Example - Hinge as Cylinder - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#33)

**_Helper Class Playground_**

- [Playground Example - Hinge as Cylinder - Box and Sphere Imposters](https://www.babylonjs-playground.com/#F15U0G#56)

You can, of course, use a cylinder impostor for the cylinder mesh

**_PhysicsJoint Playground_**

- [Playground Example - Hinge as Cylinder - Box and Cylinder Imposters](https://www.babylonjs-playground.com/#RHBQY9#13)

**_Helper Class Playground_**

- [Playground Example - Hinge as Cylinder - Box and Cylinder Imposters](https://www.babylonjs-playground.com/#RHBQY9#14)

### Ball And Socket Joint

For a ball and socket joint a force can produce rotation about all three axes.

The positioning of the connected body is determined by the connected pivot. The `jointData` object for a ball and socket contains the following properties

- mainPivot: Vector3; the pivot point for the main body.
- connectedPivot: vector3; the pivot point for the connected body, the negative of the connected body's position.

**_PhysicsJoint Playground_**

- [Playground Example - Ball and Socket - Box and Sphere Imposters](https://www.babylonjs-playground.com/#RHBQY9#15)

### Wheel Joint

For a wheel the a force produces rotation about two axes.

The `jointData` object for a hinge contains the following properties

- mainAxis: Vector3; the first axis.
- connectedAxis: Vector3; the second axis.
- mainPivot: Vector3; the pivot point for the main body.
- connectedPivot: vector3; the pivot point for the connected body, the negative of the connected body's position.

**Note** In the `Oimo.js` playgrounds changing the contact point of the force will not produce a spin around the axis perpendicular to the sphere's surface.

**_PhysicsJoint Playground_**

- [Playground Example Oimo.js - Wheel - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#7)

The `PhysicsJoint` called `Hinge2Joint` can be used as an alternative. Note however that there is no helper call `WheelJoint` and the helper must be

```javascript
var joint1 = new BABYLON.Hinge2Joint(jointData);
```

When this helper class is used with `Ammo.js` it forms a `BallAndSocketJoint` not a `WheelJoint`. So a change of contact point can produce a spin around the axis perpendicular to the sphere's surface when using `Ammo.js`.

**_Helper Class Playgrounds_**

- [Playground Example Oimo.js - Hinge2 - Box and Sphere Imposters](https://www.babylonjs-playground.com/#F15U0G#26)
- [Playground Example Ammo.js - Hinge2 - Box and Sphere Imposters](https://www.babylonjs-playground.com/#F15U0G#64)

### Slider Joint

Currently `Oimo.js` only. Any component of force in the direction of the slider axis will move the body along this axis. Any component of force perpendicular to the slider axis will rotate the body around the axis.

The `jointData` object for a slider contains the following properties

- mainAxis:Vector3, slider and rotational axis
- collision: Boolean, true if the main and connected bodies react at collision.

**_PhysicsJoint Playgrounds_**

- [Playground Example Oimo.js - Slider - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#17)

### Prismatic Joint

Currently `Oimo.js` only. Only the component of force in the direction of the axis will move the body and the movement will be a translation only along this axis.

The `jointData` object for a slider contains the following properties

- mainAxis:Vector3, prismatic axis
- collision: Boolean, true if the main and connected bodies react at collision.

**_PhysicsJoint Playgrounds_**

- [Playground Example Oimo.js - Prismatic Joint - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#18)

### Distance Joint

The `jointData` object for a distance joint contains the following properties

- maxDistance: number.

**_PhysicsJoint Playgrounds_**

- [Playground Example - Distance - Box and Sphere Imposters](https://www.babylonjs-playground.com/#UFVU18#34)

**_Helper Class Playgrounds_**

- [Playground Example - Distance - Box and Sphere Imposters](https://www.babylonjs-playground.com/#F15U0G#57)

### LockJoint

`Cannon.js` only. The two connected bodies act as one body.

**_PhysicsJoint Playgrounds_**

- [Playground Example Cannon.js - Lock Joint - Both Box Imposters](https://www.babylonjs-playground.com/#UFVU18#19)

### Spring

`Cannon,js` Only. The `jointData` object for a spring contains the following properties

- length: number.
- stiffness: number.
- damping: number.

**_PhysicsJoint Playgrounds_**

- [Playground Example Cannon.js - Spring Joint - Both Box Imposters](https://www.babylonjs-playground.com/#UFVU18#36)

# Motors

A motor requires a target speed (angular velocity) and the maximum force (torque) that can be applied by the motor. It is possible to set a torque that is insufficient for it to reach the target speed. Depending on the shape and mass of the body the torque has to overcome the moment of inertia of the body. A too low value for the torque will make the body struggle and stutter to reach the target speed. Even attempting to simulate a virtual motor in zero gravity with no friction and a zero mass for the axel joint turning a cylinder can make determining an appropriate value for the torque difficult. Since moment of inertia, which determines torque, also depends on the volume of the body it is a good idea to keep linear dimensions around 10 or less though it is probably worth experimenting to get obtain what you need. Adding gravity, friction and further bodies, that the motored body has to move, makes it even more difficult. Sometimes in your project all you will want is for the motor to turn. This can be achieved by just setting the target speed (the motor will be over torqued by default), as in

```javascript
joint.setMotor(speed);
```

At other times it will be important to set a value for the torque that limits the motor operation, you can do this with

```javascript
joint.setMotor(speed, force);
```

The table below shows the joints that a motor can be added to.

| Babylon.js Joint                 | Cannon Motor | Oimo Motor | Ammo Motor |
| -------------------------------- | ------------ | ---------- | ---------- |
| BABYLON.PhysicsJoint.HingeJoint  | Yes          | Yes        | Yes        |
| BABYLON.PhysicsJoint.WheelJoint  | No           | Yes        | No         |
| BABYLON.PhysicsJoint.Hinge2Joint | No           | Yes        | No         |
| BABYLON.PhysicsJoint.SliderJoint | No           | Yes        | No         |

To add a motor to one of these joints simply replace `PhysicsJoint` with `MotorEnabledJoint` and set the motor on the joint.

```javascript
var joint = new BABYLON.PhysicsJoint(
  BABYLON.PhysicsJoint.TYPE_OF_JOINT,
  jointData
);

mainImpostor.addJoint(connectedImpostor, joint);
```

becomes

```javascript
var joint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.TYPE_OF_JOINT, jointData);

mainImpostor.addJoint(connectedImpostor, joint);

joint.setMotor(target speed, maximum torque)
```

The helper classes for `HingeJoint` and `Hinge2Joint` are already motorised and only `setMotor` is needed.

## Playground Examples

### Hinge Motor Speed Only

**_MotorEnabledJoint Playground_**

- [Playground Example - Hinge Motor](https://www.babylonjs-playground.com/#UFVU18#35)

**_Helper Class Playground_**

- [Playground Example - Hinge Motor](https://www.babylonjs-playground.com/#F15U0G#58)

### Hinge Motor Speed and Torque (Force)

Different engines use differing scales for the torque and a little trial and error is often necessary to determine the required effect.

- For Cannon.js try starting with torque values between 1/100 to 1/10 of the total mass value;
- For Ammo.js try starting with torque values between 1/100 and 1/10 of total mass value;
- For Oimo.js try starting with torque values about 1 to 10 times the total mass value.

In the hinge motor playgrounds below there are two wheels you can try out different torque values for each wheel to see how they vary. Note that they are in zero gravity, with zero friction and the axel has zero mass. In other situations torque values may need a larger factor than those given above.

**_MotorEnabledJoint Playground_**

- [Playground Example - Hinge Motor](https://www.babylonjs-playground.com/#WWNQ10#19)

**_Helper Class Playground_**

- [Playground Example - Hinge Motor](https://www.babylonjs-playground.com/#WWNQ10#20)

### Wheel (Hinge2) Motor

**_MotorEnabledJoint Playgrounds_**

- [Playground Example Oimo.js - Wheel Z Axis](https://www.babylonjs-playground.com/#UFVU18#28)
- [Playground Example Oimo.js - Wheel Y Axis](https://www.babylonjs-playground.com/#UFVU18#29)
- [Playground Example Oimo.js - Wheel X Axis](https://www.babylonjs-playground.com/#UFVU18#30)

### Slider Motor

The motor rotates the body around the slider axis.

**_MotorEnabledJoint Playground_**

- [Playground Example Oimo.js - Slider X axis](https://www.babylonjs-playground.com/#UFVU18#31)

# Further Reading

## Basic - L1

[How To Use The Physics' Engines](/how_to/using_the_physics_engine)  
[How To Use Forces](/how_to/forces)  
[How To Use Pivots and Axes](/how_to/joint_pivots)  
[How To Create Compound Bodies](/how_to/compounds)  
[How To Create Soft Bodies](/how_to/soft_bodies)

## Mid Level - L2

[How To Use Advanced Features](/how_to/Using_Advanced_Physics_Features)

## More Advanced - L3

[How To Add Your Own Physics Engine](/how_to/Adding_Your_Own_Physics_Engine_Plugin_to_Babylon.js)
