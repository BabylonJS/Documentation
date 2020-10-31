# RadialCloner

![idpic1](/img/extensions/clonerSystem/radialCloner.jpg "RadialCloner's from left to right: aligned, unaligned, aligned clones")

The RadialCloner distributes given meshes in a radial manner. If more than one meshes are provided, then the clones will be placed alternatively. Several parameters controls the position, angle, type and orientation of the clones. The RadialCloner returns an object with one important property: **root**. It is an invisible mesh, it's the anchor, center and parent of all generated clones. Transforming this **root** (position/scale/rotation) affects all underlying clones (childs) at once. Most of the input parameters are also available as properties and they are very suitable for animation (tweening). The given input meshes will be made inactive during construction, so after construction there will be only one of two possible mesh types: BABYLON **clones** or **instances**.  
*Note:* Input meshes can be BABYLON meshes but other Cloners as well!

## Example
Example of a RadialCloner with a count of 24 clones (12 cubes cube1/cube2) distributed aligned with a radius of 6 units in the plane XZ:

`var rc = new BABYLONX.RadialCloner([cube1, cube2], demo.scene, {count:24,radius:6});`

Transforming of all clones can be done as you would do with a single mesh:

`rc.root.scaling.y = 2;`
`rc.root.rotation.x = Math.PI / 4;`

Animation can be done via properties:

`BABYLON.Animation.CreateAndStartAnimation('radanimation', rc, 'startangle', 30, 120, 0, 90);`

## Parameters
`BABYLONX.RadialCloner( meshes, scene[, {optional parameters}])` 

Mandatory Parameter | Description 
--------------------|------------
meshes| array of meshes/cloners to be cloned, meshes will be made inactive after construction
scene|BABYLON scene

Optional Parameter | Description | Default Value
-------------------|-------------|--------------
count | the nuber of clones | 3
radius| radius in world units | 3
align| flag if clones are aligned against the middle position of the cloner |true
startangle| angle in degrees | 0
endangle| angle in degrees | 360
offset| angle in degrees| 0
useInstances| flag if clones should be technical "clones" or "instances" | true
plane | object {x,y,z} describing the cloners orientation |{ x: 1, y: 0, z: 1 }

Properties | Description 
------------|-------------
count |@see Optional Parameter
radius| @see Optional Parameter
align| @see Optional Parameter
startangle| @see Optional Parameter
endangle| @see Optional Parameter
offset| @see Optional Parameter
root| READONLY, getting an invisibe mesh representing the anchor of the cloner (root node)
effectors| READONLY, gets a list of Effectors assigned to this Cloner

Methods | Description 
------------|-------------
addEffector(effector, sensitivity)| adds an effector to this Cloner and sets the sensitivity (1=full sensitivity, 0=no sensitivity ==ignore effector)
setEnabled(flag)|set the cloner's root node to the state of the flag (true=enabled) 
