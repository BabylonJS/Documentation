# Crowds and navigation agents

![a crowd ](/img/extensions/navigation/CrowdExample.png)

Now we have a navmesh, we can create autonomous agents and make them navigate within that navmesh constraint.
The agents will find the best path to that destination while avoinding other crowd agents.
An agent is attach to a Transform. That means that you have to attach a mesh to see them but also that you can attach pretty much anything.

A demo can be found at:  https://www.babylonjs-playground.com/#X5XCVT#240

Click anywhere on the navmesh to make the agents go to that location.

# How to use it?

First thing is to create a crowd that all agents will belong to. Parameters are the maximum number of agents in the crowd, the maximum agent radius and the scene.

```
var crowd = navigationPlugin.createCrowd(10, 0.1, scene);
```

Then to create an agent and attach it to a transform, call:

```
var agentIndex = crowd.addAgent(position, agentParameters, transform);
```

And that's it! You will get a non moving agent. We now want to move it.

```
crowd.agentGoto(agentIndex, navigationPlugin.getClosestPoint(endPoint));
```
This code will get the closest position on the navmesh to endPoint. Then it asks the agent to go to that position.
Depending on your agent parameters, it will get there faster of slower.

# Agent Parameters

radius - Radius of the agent. World Unit.

height - Heigh in World Unit.

maxAcceleration - Acceleration max in World Unit per second per second

maxSpeed - Max speed in World Unit per second.

collisionQueryRange - The agent collision system will take care of others within that radius in World Unit.

pathOptimizationRange - How the path will be optimized and made more straight.

separationWeight - How hard the system will try to separate the agent. A Value of 0 means it will not try and agents might collide.

You can update any of these parameters, per agent, by calling :

```
// change speed and max speed
crowd.updateAgentParameters(agentIndex, {maxSpeed:10, maxAcceleration:200});
```

# Teleport

You can teleport an agent to any position using this call:

```
crowd.agentTeleport(agentIndex, navigationPlugin.getClosestPoint(destinationPoint));
```

Please note the navigation state is reseted when teleporting. You'll have to call ```agentGoto``` to choose a new destination.

# Agent orientation and next path target

Recastjs crowd system does not handle agent orientation. But the velocity is available and it's possible to orient the geometry toward it.
To do so, you will need to use Math.atan2 like in the following example. Please take care of the length of the velocity vector. If it's not big enough, you may encounter jittering.

```
let velocity = crowd.getAgentVelocity(agentIndex);
if (velocity.length() > 0.2)
{
    var desiredRotation = Math.atan2(velocity.x, velocity.z);
    // interpolate the rotation on Y to get a smoother orientation change
    ag.mesh.rotation.y = ag.mesh.rotation.y + (desiredRotation - ag.mesh.rotation.y) * 0.05;
}
```
In this PG  https://playground.babylonjs.com/#6AE0RP
The agent's cube is oriented by the velocity and a grey little box is placed at the position of the next path corner.