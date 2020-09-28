# Getting Started - Working With Code
## Sky
We can simulate the appearance of a sky by applying six suitable images to the insides of a large box. Each image should have a common name  followed by one of _px, _nx, _py, _ny, _pz or _nz, these indicate which face the image is for; the positive (p) or negative (n) x, y or z axis. For example skybox_px.jpg, skybox_nx.jpg, skybox_py.jpg, skybox_ny.jpg, skybox_pz.jpg, skybox_nz.jpg. These are applied to the box as a *cubeTexture*. The first parameter of a *cubeTexture* is the url to the skybox and only the common name is added.  


![Skybox](/img/how_to/skybox.png)

Copy the code below and link to you own skybox.
```javascript
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("url path/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;
```
In our developing world we will also add a restriction to the camera so that it cannot display anything below ground level.

```javascript
camera.upperBetaLimit = Math.PI / 2.2;
```
https://www.babylonjs-playground.com/#KBS9I5#88

Next environmental improvement is to grow some trees.
