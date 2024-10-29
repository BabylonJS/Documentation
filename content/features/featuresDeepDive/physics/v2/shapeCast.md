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

Shape cast regroup different features related to using Physics V2 Shapes to do queries in the Physics world.
To paraphrase it: use physics shapes to query collisions and distance to other physics shapes.
This API is specific to Havok plugin.

## Common query interface

These two properties are common to each query interface:
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
See below for result definition.

PG: <Playground id="#I6AR8X#21" title="Point Proximity" description="Find the closest shape from a point within a limit"/>

## Shape Proximity Query
Instead of a point, provide a shape. Interface becomes:

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
When a shape goes from a start position to an end position, if there is a collision, at which fraction of that movement does it happen?
> Note: Result will not be correct for intersecting shapes.

```javascript
hk.shapeCast({
    shape: shape1,
    rotation: mesh1.rotationQuaternion,
    startPosition: castStartPosition,
    endPosition: castEndPosition,
    shouldHitTriggers: false,
}, shapeLocalResult, hitWorldResult);
```
Basically, for a positioned and oriented shape, going from `startPosition` world position to `endPosition` world position, `shapeLocalResult` and `hitWorldResult`, both of `ShapeCastResult` type will have the `hasHit` property set to true.
Then, get the fraction of that move with `hitFraction` property.

PG: <Playground id="#1VT1BK#12" title="Shape Cast" description="Find the closest shape from another shape within a limit"/>

## Queries result

Result infos for these 3 queries are contained in 
- `ProximityCastResult` for proximity and shape proximity
- `ShapeCastResult` for Shape cast

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
Raycast result inherits as well from this base class.

Specific for `ProximityCastResult` consists in:

```javascript
/**
 * Gets the distance from the hit
 */
hitDistance: number;
```

Specific for `ShapeCastResult` consists in:

```javascript
/**
 * Gets the hit fraction along the casting ray
 */
hitFraction: number
```