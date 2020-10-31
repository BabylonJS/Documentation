# Basic Particle Properties
There are a wide range of properties to tune the behavior of the particles in the system including their lifetime, size, color, emission rates, speed, direction of travel, orientation and application of gravity.

On this page we will consider them and how to set a range of values for them. On the next we will show how these settings can be changed either over a particles lifetime or the duration of the system when it is set.


# Size
The size of the particles can be varied randomly within a given range,

```javascript
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.5;
```
Size range https://www.babylonjs-playground.com/#0K3AQ2#11

# Scale
When you want to change the particle base shape from square to rectangular scale x and y values using

```javascript
particleSystem.minScaleX = 0.1;
particleSystem.maxScaleX = 0.5;

particleSystem.minScaleY = 0.2;
particleSystem.maxScaleY = 0.4;
```

Scale range https://www.babylonjs-playground.com/#0K3AQ2#12

# Color
There are three colors that can be set for the particle system, two which are combined (or blended) during the lifetime of the particle and a third that it takes on just before the end of its lifetime. 

```javascript
particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
```

Color https://www.babylonjs-playground.com/#0K3AQ2#21

# Speed
The speed of a particle is governed by the amount of power applied to a particle when emitted. The more power the faster it goes. The emission power, and hence the speed, of the particles can be varied randomly within a given range,

```javascript
particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 3;
```
 
Power range https://www.babylonjs-playground.com/#0K3AQ2#28

# Rotation
You can define a range of angular speeds in radians per second:

```javascript
particleSystem.minAngularSpeed = 0;
particleSystem.maxAngularSpeed = Math.PI;
```

You can also define a particle's initial rotation angle with

```
particleSystem.minInitialRotation = 0;
particleSystem.maxInitialRotation = Math.PI / 2;
```

Rotating https://www.babylonjs-playground.com/#0K3AQ2#23  
Rotating with set initial angle https://www.babylonjs-playground.com/#0K3AQ2#25

# Translation Pivot

By default the center of transformation for a particle is at the middle of its plane. You are able to set it to a different point relative to its middle. To change the pivot position use

```javascript
particleSystem.translationPivot = new BABYLON.Vector2(2, 2); // across and up the containing plane
```

Rotation with translation pivot https://www.babylonjs-playground.com/#0K3AQ2#49

# Direction
Two directions can be specified. If you specify just *direction1* the particles will travel randomly in the general direction given. When both directions are given the particles will travel in a direction between the two. In practice the vectors act as giving a velocity (direction and speed) to the particles; i.e. particles with direction (10, -10, 10) travel 10 times faster than those with direction (1, -1, 1).

```javascript
particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
```

direction range https://www.babylonjs-playground.com/#0K3AQ2#31

# Gravity
A value for gravity can be applied as a vector3 in any direction. For example if negative in the Y direction the particles will slowly be pulled downwards.

```javascript
particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
```
Direction and gravity https://www.babylonjs-playground.com/#0K3AQ2#32
 
#  Emit Rate
The emit rate determines the number of particles emitted per second. The larger the number the more dense appears the emitted cloud of particles. As particles die they are recycled to be emitted again. If their lifetime is long enough and their emission rate fast enough it is possible for there to be a gap in the emission of particles. 

![emitRate](/img/how_to/Particles/12-3.png)

```javascript
particleSystem.emitRate = 1000;
```

You can stop the continuous emission of particles by setting a manual emit count.

```javascript
particleSystem.manualEmitCount = 300;
```

In this case the number of particles given by the count are emitted and there is no further emissions of particles.

Slow emit rate https://www.babylonjs-playground.com/#0K3AQ2#34  
Fast emit rate https://www.babylonjs-playground.com/#0K3AQ2#35
Emit just 10 https://www.babylonjs-playground.com/#0K3AQ2#36

# Lifetime
The time taken for particles to disappear (or die) after being emitted can be varied within a chosen range. A particle's lifetime is set as a random value between a minimum and maximum

```javascript
particleSystem.minLifeTime = 0.3;
particleSystem.maxLifeTime = 1.5;
```

Short lifetime https://www.babylonjs-playground.com/#0K3AQ2#37
Long lifetime https://www.babylonjs-playground.com/#0K3AQ2#38


# Adjustable Examples
Adjust Min & Max of EmitBox https://www.babylonjs-playground.com/#0K3AQ2#45
Adjust Emit Life Time, Rate, Power and Update Speed  https://www.babylonjs-playground.com/#0K3AQ2#46








