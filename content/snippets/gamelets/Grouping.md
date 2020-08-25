# Creating Shapes from Groups of Particles

In order to form complex shapes from particles we need to place sets of particles together and for them to react as one entity.

## Placing Particles in a Shape

A shape is made from a set of particles when every particle in the set touches at least one other particle and no particle overlaps another. The placing of particles could be done by design to fit a given pattern and individual particles set to these positions manually. At this stage of development the positions within a shape will be set randomly by code.

In the following each particle is a sphere of radius r.

One quick way to form a random shape from a set of n particles is to fix the position, s<sub>0</sub>, of the first particle, p<sub>0</sub>, and then for any subsequent particle p<sub>i</sub>, set its position s<sub>i</sub> to be s<sub>i-1</sub> + 2ru, where u is a unit vector chosen from i, j, k, -i, -j, k and i, j and k are the unit vectors in the direction of the axes x, y and z respectively.

* [Playground Example - Form One Shape](https://www.babylonjs-playground.com/#22IYEF#1)

The above method can lead to two or more particles occupying the same space. To avoid this the potential position for each particle needs to be checked. You can see that there are not always five particles forming the group in the above Playground.

Each particle will have a unique position relative to the first particle. By storing a key based on their offsets the existance of such a key can be used to prohibit the placing of a particle at that offset. The following Playground uses this method to distribute the particles with a shape.

* [Playground Example - Form One Shape with No Shared Spaces](https://www.babylonjs-playground.com/#22IYEF#2)

## Multiple Shapes

So far we have grouped all the particles into one shape. Now we form the particles into a number of shapes.

* [Playground Example - Multiple Shapes](https://www.babylonjs-playground.com/#22IYEF#3)

The next step is to be able to move and rotate each shape as an entity. Moving a shape is straight forward, just re-position each particle within the shape by the same amount. To rotate a shape will require a point and an axis to rotate around and an angle of rotation. It is not possible to use setPivotMatrix for particles so a custom built function is required. For a given position this function will calculate the new position after rotation of an angle about an axis through a pivot point.

```javascript
BABYLON.Vector3.prototype.rotateAboutAxisThroughPoint = function(axis, point, angle)	 {
	var _p = new BABYLON.Quaternion(this.x - point.x, this.y - point.y, this.z - point.z, 0);  //change _p for quaternion multiplication
	var q = BABYLON.Quaternion.RotationAxis(axis,angle);  //form quaternion rotation		
	var qinv = BABYLON.Quaternion.Inverse(q);	
	var _pdash = q.multiply(_p).multiply(qinv);	
	return new BABYLON.Vector3(_pdash.x + point.x, _pdash.y + point.y, _pdash.z + point.z); //change to Vector 3 for new position vector;
}
```

For movement each shape will be given a random velocity. For rotation we will calculate the centre of mass, CoM, as the pivot point and set a random axis and angular speed. This data is stored with the first particle within each shape.

Since the only way to change particle attributes is the updateParticle function this function will need to determine which shape a particle belongs to. For this array of shape numbers [5, 4, 3] shape 0 consists of particles 0 to 4, shape 1 consists of particles 5 to 8 and shape 3 consists of particles 9 to 11. By forming the cumulative numbers of particles 0, 5, 9, 12 we can check the index, particle.idx, of a particle to see if it is the last of a shape and only update a shape when it is.

```javascript
SPS.updateParticle = function(particle) {	
	if(particle.idx == cumulativeShapes[particle.shape + 1] - 1) {
		updateShape(particle.shape, spheresPerShapeNbs[particle.shape]);
	}
};
```

* [Playground Example - Moving and Rotating Shapes](https://www.babylonjs-playground.com/#22IYEF#5)

The next step is to consider what happens when two or more shapes collide.




