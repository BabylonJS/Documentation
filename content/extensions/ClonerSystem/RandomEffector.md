---
title: RandomEffector
image: 
description: The RandomEffector can influence all transformation properties applied to a Cloner with repeatable random values.
keywords: cloner system, RandomEffector
further-reading:
video-overview:
video-content:
---

Each Cloner can have a set of Effectors assigned. At this time of writing, there is only one Effector available, the RandomEffector.

So what does an Effector generally? It influences properties of the clones cloned by a Cloner. The RandomEffector can influence all transfomation properties (scale/rotation/position) with repeatable random values. Different random sequences can be achieved with a different **seed** value. The randomEffector can serve more than one cloner but it has only one property to control the strength of the random values. Therefore each cloner has a property **sensitivity** to accept either all or only a portion of the cloners strength. 

*Note:* the scaling transformation will be done in two different ways depending on the property **uniformScale**: if this property is set to true, only one random value will be used for all three scaling components (x,y,z) and the y/z componets of the **scale property** will be ignored. If set to false, each direction is scaled independently with an extra random value. 

## Example

In the following example a RandomEffector is created with a default seed value. After then the rotation values will be so adjusted, that the rotation random y-values are in the range 0-180, x and z are remaining unaffected. In the next step the RandomEffecor is added to the RadialCloner with a sensitivity of 1 and finally the effectors strength is set to 1.



`let rc = new BABYLONX.RadialCloner([cube1, cube2], demo.scene, { count: 24, radius: 6 });`

`let reff = new BABYLONX.RandomEffector(); //default seed value` 

`reff.rotation = { x: 0, y: 180, z: 0 }; `

`rc.addEffector(reff,1);`

`reff.strength=1;`

In this state, everything is prepared to influence the clone's y-rotation with random values in the range 0-180 degrees. With the function `reff.updateClients()` the clones will be updated. 

## Parameters
`BABYLONX.RandomEffector(seed=42)` 

Optional Parameter | Description | Default Value
-------------------|-------------|--------------
seed | the seed value for generating different sequences of random values  | 42 

Properties | Description 
------------|-------------
strength |sets the strength of the generator (range 0 to 1)
uniformScale| true => all scaling directions with one value, false independently scaling
position| sets position numbers in the range 0 to {x:number,y:number,z:number}
scale| sets  the scale numbers in the range 0 to {x:number,y:number,z:number} 
rotation| sets  the rotation numbers in the range 0 to {x:number,y:number,z:number}


Methods | Description 
------------|-------------
reset()| resets the random generator to the beginning number sequence 
random()| get the next random number
