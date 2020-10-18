# Change Particles Over Time
Some properties of a particle, size or color for example, can be changed over their lifetime. Others, such as emit rate, start size or lifetime, can be changed over the duration of the particle system.

Changing relevant properties over the duration of the particle system is available from Babylon.js V3.3 onwards, provided, of course, you set the *targetStopDuration*, When the duration is set you can alter appropriate properties from the start, 0, to the end, 1, by adding a gradient method related to the property.

Whether it is over a particle lifetime or the system duration the general form to change a specific property value is  

```javascript
particleSystem.add<PROPERTY>Gradient(fraction_of_time_period_elapsed, property_value); //set a value at given time point
```
and for a range of property values

```javascript
particleSystem.add<PROPERTY>Gradient(fraction_of_time_period_elapsed, minimum_property_value, maximum_property_value); //set a range of values at given time point
```

In both cases we recommend that you add gradients for the start, 0, and end, 1, even when setting other time points between 0 and 1.

To remove a gradient you use 

```javascript
particleSystem.remove<PROPERTY>Gradient(fraction_of_time_period_elapsed);
```
There are two time periods used one for a particle lifetime and one for the system duration both running from 0, start to 1, stop.

## Change Size Over Lifetime
To change size over the lifetime of the particle use

```javascript
particleSystem.addSizeGradient(0, 0.5); //size at start of particle lifetime
particleSystem.addSizeGradient(1, 3); //size at end of particle lifetime
```

For a range of values use
```javascript
particleSystem.addSizeGradient(0, 0.5, 0.8); //size range at start of particle lifetime
particleSystem.addSizeGradient(0.4, 1, 2); //size range at 2/5 of duration of particle system
particleSystem.addSizeGradient(1.0, 3, 4); //size range at end of particle lifetime
```

To remove a size gradient you use
```javascript
particleSystem.removeSizeGradient(0.4);
```
Size increases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#18
Size increases then decreases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#19

# Change Color Over Lifetime

To change size over the lifetime of the particle use
```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0)); //color at start of particle lifetime
particleSystem.addColorGradient(1, new BABYLON.Color4(1, 1, 1, 1)); //color at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0), new BABYLON.Color4(1, 0, 1, 0)); //color range at start of particle lifetime
particleSystem.addColorGradient(0.4, new BABYLON.Color4(1, 1, 1, 0.5), new BABYLON.Color4(1, 0, 1, 0.5)); //color range at 2/5 of particle lifetime
particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(1, 0, 1, 1)); //color range at end of particle lifetime
```

To remove a color gradient you use
```javascript
 particleSystem.removeColorGradient(0.4);
 ```

color change over lifetime https://www.babylonjs-playground.com/#0K3AQ2#20
color change with ranges over lifetime https://www.babylonjs-playground.com/#0K3AQ2#22

## Change Speed Over Lifetime
To change the speed (magnitude of velocity) over the lifetime of the particle use

```javascript
particleSystem.addVelocityGradient(0, 0.5); //applied power at start of particle lifetime
particleSystem.addVelocityGradient(1, 3); //applied power at end of particle lifetime
```

For a range of values use
```javascript
particleSystem.addVelocityGradient(0, 0.5, 0.8); //applied power range at start of particle lifetime
particleSystem.addVelocityGradient(0.4, 1, 2); //applied power range at 2/5 of duration of particle system
particleSystem.addVelocityGradient(1.0, 3, 4); //applied power range at end of particle lifetime
```

To remove a velocity gradient you use
```javascript
particleSystem.removeVelocityGradient(0.4);
```

Speed increases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#29
Speed increases then decreases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#30

## Change Rotation Speed Over Lifetime
To change the rotation or angular speed over the lifetime of the particle use

```javascript
particleSystem.addAngularSpeedGradient(0, 0.5); //angular speed at start of particle lifetime
particleSystem.addAngularSpeedGradient(1, 3); //angular speed at end of particle lifetime
```

For a range of values use
```javascript
particleSystem.addAngularSpeedGradient(0, 0.5, 0.8); //angular speed range at start of particle lifetime
particleSystem.addAngularSpeedGradient(0.4, 1, 2); //angular speed range at 2/5 of duration of particle system
particleSystem.addAngularSpeedGradient(1.0, 3, 4); //angular speed range at end of particle lifetime
```

To remove a angular speed gradient you use
```javascript
particleSystem.removeAngularSpeedGradient(0.4);
```

AngularSpeed increases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#26
AngularSpeed increases then decreases over lifetime https://www.babylonjs-playground.com/#0K3AQ2#27


## Change Emit Rate Over Duration

For example as energy builds over the duration of the particle system and increases the emit rate you might use,

```javascript
particleSystem.targetStopDuration = 8

particleSystem.addEmitRateGradient(0, 10); //emit rate at start of particle system
particleSystem.addEmitRateGradient(1.0, 500); //emit rate at end of particle system
```

Setting a range of lifetimes
```javascript
particleSystem.targetStopDuration = 8

particleSystem.addEmitRateGradient(0, 10, 20); //emit rate range at start of particle sysstem
particleSystem.addEmitRateGradient(0.4, 200, 250); //emit rate range at 2/5 of duration of particle sysstem
particleSystem.addEmitRateGradient(1, 500, 600); //emit rate range at end of particle sysstem
```

remove gradient at 0.4
```javascript
particleSystem.removeEmitRateGradient(0.4);
```

Faster emit rate over duration https://www.babylonjs-playground.com/#0K3AQ2#13

Increasing and then decreasing emit rates over duration https://www.babylonjs-playground.com/#0K3AQ2#14

## Change Lifetime Over Duration

For example to shorten lifetime as energy is used up over the duration of the particle system you might use,

```javascript
particleSystem.targetStopDuration = 8

particleSystem.addLifeTimeGradient(0, 0.5); //lifetime at start of particle sysstem
particleSystem.addLifeTimeGradient(1, 0); //lifetime at end of particle system
```

Setting a range of lifetimes
```javascript
particleSystem.targetStopDuration = 8

particleSystem.addLifeTimeGradient(0, 0.5, 0.75); //lifetime range at start of particle sysstem
particleSystem.addLifeTimeGradient(0.4, 0.25, 0.5); //lifetime range at 2/5 of duration of particle sysstem
particleSystem.addLifeTimeGradient(1, 0, 0.1); //lifetime range at end of particle sysstem
```

remove gradient at 0.4
```javascript
particleSystem.removeLifeTimeGradient(0.4);
```

Shorter lifetimes over duration https://www.babylonjs-playground.com/#0K3AQ2#9

Increasing and then decreasing lifetimes over duration https://www.babylonjs-playground.com/#0K3AQ2#15

