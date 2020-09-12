# Getting Started - Working With Code
## Avoiding a Car Crash
The simplest way of seeing if two meshes are in contact is to use the *intersectsMesh* method, as in

```javascript
mesh1.intersectMesh(mesh2)
```
which will be true if a box bounding mesh1 would overlap with a box bounding mesh2. Each mesh has a built-in bounding box which lies close to the surface of the mesh that is used in checking the intersection of the meshes. 


![dudebox](/img/getstarted/dudebox.png) ![carbox](/img/getstarted/carbox.png)

Since the character's walk and the car's journey are not phased together there will be a time when they are in the same place. However it is not possible to predict when the character, taking its long walk around the village, and the car, on its short journey, might intersect. In order to demonstrate the *intersectsMesh* method we will make the character walk backwards and forwards across the stopping place of the car.

In our case we want the character to stop moving if the car is in a "close to character" zone and the character is not. It would, after all, be dangerous for the character to stop if they are both in the danger zone. In our case because of the way the *Dude* is constructed we need to use one of its children to check intersection. Basically *Dude* is just a holder node for the head, torso, legs and arms.

https://www.babylonjs-playground.com/#KBS9I5#58

https://www.babylonjs-playground.com/#KBS9I5#57



