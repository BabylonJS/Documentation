---
title: Extrusion With Sharp Corners
image: 
description: Helpful code snippet for extruding with sharp corners in Babylon.js.
keywords: babylon.js, tools, resources, utilities, mitre, extrusion, corner
further-reading:
video-overview:
video-content:
---

## Extrude Shape with Mitred Corners

Neither [CreateTube](/divingDeeper/mesh/creation/param#tube) nor [ExtrudeShape](/divingDeeper/mesh/creation/param#extruded-shapes) were designed to handle sharp corners but to perform well over smooth curves. This can be seen by the tube and extruded shapes narrowing at the corner in the following

<Playground id="#PDRDFA" title="Bend In Tube" description=""/>
<Playground id="#PDRDFA#1" title="Bend In Extruded Tube" description=""/>
<Playground id="#PDRDFA#2" title="Bend in Extruded Shape" description=""/>

Whereas they are very good for smooth curves giving a bend as you would get in a physically bent tube

<Playground id="#PDRDFA#6" title="Slow Bend In Tube" description=""/>
<Playground id="#PDRDFA#2" title="Slow Bend In Extruded Shape" description=""/>

The function `mitredExtrude` allows an extrusion path with sharp corners such as you would get by cutting and forming a mitre join.

<Playground id="#PDRDFA#4" title="Right Angle in Extruded Tube With Mitre" description=""/>
<Playground id="#PDRDFA#5" title="Right Angle in Extruded Shape" description=""/>

## Using Mitre Extrude

The function has the form

```javascript
var extrude = mitredExtrude("name", options, scene);
```

| option | value                                                                                            | default value |
| ------ | ------------------------------------------------------------------------------------------------ | ------------- |
| path   | _(Vector3[])_ array of Vector3 points forming the extrusion path                                 | **REQUIRED**  |
| shape  | _(Vector3[])_ array of Vector3 points (x, y, 0) forming the shape to be extruded in the XY plane | **REQUIRED**  |
| close  | _(boolean)_ true if the first and last points are to be joined to form a closed extrusion        | false         |

## Playground Examples

To form a mitre the bend must take place along a line that is in the plane of one of the extruded faces (ie one formed by the edges of the shape to be extruded) and that line must be perpendicular to the edges of that face. For a closed extrusion to have a proper mitre when joining the first and last point the path for the extrusion must have a series of turns that allows the bend line to meet this requirement. When the requirement is not met the final join will be twisted.

<Playground id="#376T60#2" title="Open" description=""/>
<Playground id="#376T60#3" title="Closed With Twist" description=""/>
<Playground id="#376T60#4" title="Closed Meeting Requirements" description="\"/>

## The Code

```javascript
var mitredExtrude = function (name, options, scene) {
    var shape = options.shape;
    var path = options.path;
    var closed = options.close || false;

    var nbPoints = path.length;
    var line = BABYLON.Vector3.Zero();
    var nextLine = BABYLON.Vector3.Zero();
    var axisX = BABYLON.Vector3.Zero();
    var axisY = BABYLON.Vector3.Zero();
    var axisZ = BABYLON.Vector3.Zero();
    var nextAxisX = BABYLON.Vector3.Zero();
    var nextAxisY = BABYLON.Vector3.Zero();
    var nextAxisZ = BABYLON.Vector3.Zero();
    var startPoint = BABYLON.Vector3.Zero();
    var nextStartPoint = BABYLON.Vector3.Zero();
    var bisector = BABYLON.Vector3.Zero();
    var point = BABYLON.Vector3.Zero();
    var prjctZ = 0;
    var distance = 0;
    var ray;

    var allPaths = [];

    for (var s = 0; s < shape.length; s++) {
        path[1].subtractToRef(path[0], line);
        axisZ = line.clone().normalize();
        axisX = BABYLON.Vector3.Cross(scene.activeCamera.position, axisZ).normalize();
        axisY = BABYLON.Vector3.Cross(axisZ, axisX);
        startPoint = path[0].add(axisX.scale(shape[s].x)).add(axisY.scale(shape[s].y));
        var ribbonPath = [startPoint.clone()];
        for (var p = 0; p < nbPoints - 2; p++) {
            path[p + 2].subtractToRef(path[p + 1], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = BABYLON.Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = BABYLON.Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            planeParallel = BABYLON.Vector3.Cross(nextAxisZ, axisZ);
            planeNormal = BABYLON.Vector3.Cross(planeParallel, bisector);
            plane = BABYLON.Plane.FromPositionAndNormal(path[p + 1], planeNormal);
            ray = new BABYLON.Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());

            axisX = nextAxisX.clone();
            axisY = nextAxisY.clone();
            axisZ = nextAxisZ.clone();
            startPoint = nextStartPoint.clone();
        }
        // Last Point
        if (closed) {
            path[0].subtractToRef(path[nbPoints - 1], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = BABYLON.Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = BABYLON.Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            planeParallel = BABYLON.Vector3.Cross(nextAxisZ, axisZ);
            planeNormal = BABYLON.Vector3.Cross(planeParallel, bisector);
            plane = BABYLON.Plane.FromPositionAndNormal(path[nbPoints - 1], planeNormal);
            ray = new BABYLON.Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());

            axisX = nextAxisX.clone();
            axisY = nextAxisY.clone();
            axisZ = nextAxisZ.clone();
            startPoint = nextStartPoint.clone();

            path[1].subtractToRef(path[0], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = BABYLON.Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = BABYLON.Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            planeParallel = BABYLON.Vector3.Cross(nextAxisZ, axisZ);
            planeNormal = BABYLON.Vector3.Cross(planeParallel, bisector);
            plane = BABYLON.Plane.FromPositionAndNormal(path[0], planeNormal);
            ray = new BABYLON.Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.shift();
            ribbonPath.unshift(nextStartPoint.clone());
        } else {
            planeNormal = axisZ;
            plane = BABYLON.Plane.FromPositionAndNormal(path[nbPoints - 1], planeNormal);
            ray = new BABYLON.Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());
        }
        allPaths.push(ribbonPath);
    }
    var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: allPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, closeArray: true, closePath: closed }, scene);

    return ribbon;
};
```