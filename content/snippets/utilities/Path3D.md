# Displays a Path3D Curve.
This snippet displays a path3D curve and for on each point its tangent, normal and binormal in red, green and blue respectively. 
The size parameter, default 0.5, sets the length for the tangents, normals and binormals.

```javascript
function showPath3D(path3d, size) {
  size = size || 0.5;
  var curve = path3d.getCurve();
  var tgts = path3d.getTangents();
  var norms = path3d.getNormals();
  var binorms = path3d.getBinormals();
  var vcTgt, vcNorm, vcBinorm;
  var line = BABYLON.Mesh.CreateLines("curve", curve, scene);
  for (var i = 0; i < curve.length; i++) {
    vcTgt = BABYLON.Mesh.CreateLines("tgt"+i, [curve[i], curve[i].add(tgts[i].scale(size))], scene);
    vcNorm = BABYLON.Mesh.CreateLines("norm"+i, [curve[i], curve[i].add(norms[i].scale(size))], scene);
    vcBinorm = BABYLON.Mesh.CreateLines("binorm"+i, [curve[i], curve[i].add(binorms[i].scale(size))], scene);
    vcTgt.color = BABYLON.Color3.Red();
    vcNorm.color = BABYLON.Color3.Green();
    vcBinorm.color = BABYLON.Color3.Blue();
  }
};
```
# Playground

* [Playground Example](https://www.babylonjs-playground.com/#2IX4FB)
