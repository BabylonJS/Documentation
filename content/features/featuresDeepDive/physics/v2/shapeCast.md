---
title: Shape cast
image:
description: A guide on shape casting with the Physics V2 API
keywords: diving deeper, physics, shape casting
further-reading:
video-overview:
video-content:
---

# Shape cast

Shape casting groups different features related to using Physics V2 shapes to make queries in the physics world.
In short, use physics shapes to query collisions and distances to other physics shapes.
This API is specific to the Havok plugin.

## Common query interface

These two properties are common to all query interfaces:
```javascript
/**
 * Should trigger collisions be considered in the query?
 */
shouldHitTriggers: boolean;
/**
 * Should the query ignore the body that is passed in?
 */
ignoreBody?: PhysicsBody;
```

## Point Proximity Query

Query the closest shape within a `maxDistance` radius.

```javascript
export interface IPhysicsPointProximityQuery {
/**
* The position of the query
*/
position: Vector3;
/**
* Maximum distance to check for collisions. Can be set to 0 to check for overlaps.
*/
maxDistance: number;
/**
* Collision filter for the query.
*/
collisionFilter: IRaycastQuery;
}
```

Use this interface to do the query:

```javascript
var hk = new BABYLON.HavokPlugin();
hk.pointProximity(
    {
        position: ballPos,
        maxDistance: 0.1
    },
    result
);
```
See below for the result definition.

PG: <Playground id="#I6AR8X#21" title="Point Proximity" description="Find the closest shape from a point within a limit"/>

## Shape Proximity Query
Instead of a point, provide a shape. The interface becomes:

```javascript
hk.shapeProximity(
    {
        shape: shape1,
        position: mesh1.absolutePosition,
        rotation: mesh1.absoluteRotationQuaternion,
        maxDistance: 10
    },
    shapeLocalResult,
    hitWorldResult
);
```
Two results are returned: the first one is local to the shape. The second is in world space.

PG: <Playground id="#1VT1BK#11" title="Shape Proximity" description="Find the closest shape from another shape within a limit"/>

## Shape Cast query
When a shape moves from a start position to an end position, this query tells you at what fraction of that movement a collision occurs.
> Note: The result will not be correct for intersecting shapes.

```javascript
hk.shapeCast({
    shape: shape1,
    rotation: mesh1.rotationQuaternion,
    startPosition: castStartPosition,
    endPosition: castEndPosition,
    shouldHitTriggers: false,
}, shapeLocalResult, hitWorldResult);
```
For a positioned and oriented shape moving from `startPosition` to `endPosition`, `shapeLocalResult` and `hitWorldResult`—both of type `ShapeCastResult`—will have the `hasHit` property set to `true` when a collision occurs.
Then, get the fraction of that movement with the `hitFraction` property.

PG: <Playground id="#1VT1BK#12" title="Shape Cast" description="Find the closest shape from another shape within a limit"/>

## Queries result

Result information for these three queries is contained in:
- `ProximityCastResult` for proximity and shape proximity
- `ShapeCastResult` for shape cast

```javascript
export class CastingResult {
    /**
     * The Physics body that the query hit.
     */
    public body?: PhysicsBody;
    /**
     * The body Index in case the Physics body is using instances
     */
    public bodyIndex?: number;

    /**
     * The shape hit by the query.
     */
    public shape?: PhysicsShape;
    ...
```
Raycast results also inherit from this base class.

The `ProximityCastResult`-specific property is:

```javascript
/**
 * Gets the distance from the hit
 */
hitDistance: number;
```

The `ShapeCastResult`-specific property is:

```javascript
/**
 * Gets the hit fraction along the casting ray
 */
hitFraction: number
```