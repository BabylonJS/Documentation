---
title: RandomEffector
image:
description: The RandomEffector can influence all transformation properties applied to a Cloner with repeatable random values.
keywords: cloner system, RandomEffector
further-reading:
video-overview:
video-content:
---

Each Cloner can have a set of Effectors assigned. At the time of writing, there is only one Effector available: the RandomEffector.

So what does an Effector do in general? It influences the properties of the clones created by a Cloner. The RandomEffector can influence all transformation properties (scale/rotation/position) with repeatable random values. Different random sequences can be achieved with different **seed** values. The RandomEffector can serve more than one cloner, but it has only one property to control the strength of the random values. Therefore, each cloner has a **sensitivity** property to accept either all or only a portion of the cloner's strength.

_Note:_ The scaling transformation is done in two different ways depending on the **uniformScale** property: if this property is set to true, only one random value is used for all three scaling components (x,y,z), and the y/z components of the **scale property** are ignored. If set to false, each direction is scaled independently with an extra random value.

## Example

In the following example, a RandomEffector is created with the default seed value. The rotation values are then adjusted so that the random y rotation values are in the range 0-180, while x and z remain unaffected. In the next step, the RandomEffector is added to the RadialCloner with a sensitivity of 1, and finally the effector's strength is set to 1.

```javascript
let rc = new BABYLONX.RadialCloner([cube1, cube2], demo.scene, { count: 24, radius: 6 });

let reff = new BABYLONX.RandomEffector(); //default seed value

reff.rotation = { x: 0, y: 180, z: 0 };

rc.addEffector(reff, 1);

reff.strength = 1;
```

At this point, everything is prepared to influence the clone's y-rotation with random values in the range 0-180 degrees. With the function `reff.updateClients()`, the clones are updated.

## Parameters

`BABYLONX.RandomEffector(seed=42)`

| Optional Parameter | Description                                                        | Default Value |
| ------------------ | ------------------------------------------------------------------ | ------------- |
| seed               | the seed value for generating different sequences of random values | 42            |

| Properties   | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| strength     | sets the strength of the generator (range 0 to 1)                          |
| uniformScale | true => all scaling directions with one value, false independently scaling |
| position     | sets position numbers in the range 0 to \{x:number,y:number,z:number\}     |
| scale        | sets the scale numbers in the range 0 to \{x:number,y:number,z:number\}    |
| rotation     | sets the rotation numbers in the range 0 to \{x:number,y:number,z:numbe\r} |

| Methods  | Description                                                  |
| -------- | ------------------------------------------------------------ |
| reset()  | resets the random generator to the beginning number sequence |
| random() | get the next random number                                   |
