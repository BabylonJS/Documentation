# Getting Started - Working with Code
## Combining Meshes Using Merge Meshes
This is a straight forwarded way of combining two or more meshes.

```javascript
const combined = BABYLON.Mesh.MergeMeshes(Array_of_Meshes_to_Combine)
```
In our case this would be
```javascript
const house = BABYLON.Mesh.MergeMeshes([box, roof])
```
https://www.babylonjs-playground.com/#KBS9I5#33

![house 5](/img/getstarted/house5.png)

The first thing we note is that the whole house is covered in only one of the materials used. Fortunately this can be corrected using the multiMultiMaterial parameter of *MergeMeshes*, unfortunately this is the final parameter of a long list. The code now looks like
```javascript
const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
```
At this stage it is important to note that the second parameter being true disposes of the original meshes and the last parameter being true allows the original material to be applied separately to the parts matching the original meshes.

https://www.babylonjs-playground.com/#KBS9I5#34

![house 3](/img/getstarted/house3.png)

Before considering how to make multiple copies of our house we will first: find out the basics of [exporting]() our models; how to [import]() models made with Babylon.js or other software; and how to display your scene or models on your own website.

[Mesh Chapter](/how_to/how_to_merge_meshes) Merge Meshes.

