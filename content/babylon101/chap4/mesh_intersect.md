# Getting Started - Working With Code
## Avoiding a Car Crash
The simplest way of seeing if two meshes are in contact is to use the *intersectsMesh* method, as in

```javascript
mesh1.intersectMesh(mesh2)
```
which will be true if a box bounding mesh1 would overlap with a box bounding mesh2.

![dudebox](/img/getstarted/dudebox.png) ![carbox](/img/getstarted/carbox.png)