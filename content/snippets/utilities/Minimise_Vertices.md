---
title: Forcing Shared Vertices
image: 
description: Helpful code snippet for forcing mesh to share vertices in Babylon.js.
keywords: babylon.js, tools, resources, utilities, shared verts, minimize
further-reading:
video-overview:
video-content:
---

## Force Shared Vertices

This function will remove some indices and vertices from a mesh. It removes facets where two of its vertices 
share the same position and forces vertices to share normals. So it will, therefore, also change a flat shaded mesh to a smooth (for the 
want of a better word) shaded mesh. 

Sometimes the additional facets and vertices are necessary, for example to prevent seams when using textures. So use carefully. 

More information on the need for extra facets, which turn out to be lines, can be found in [Materials and Facets](/divingDeeper/materials/using/texturePerBoxFace).

**NOTE** From Babylon.js version 4.0 onwards this utility now exists as a standard method on a mesh.

```javascript
mesh.forceSharedVertices();
```
## Playground

Using the Inspector in the Playground below with the minimise vertices function applied you will see that there are 366 vertices. However you can also see how the texture has been split and it does not seam correctly. This seaming would also happen if you used an image of the earth for example.

If you comment out line 12 and so no longer apply the force shared vertices function you can use the Inspector to check that there are 435 vertices. In this case though the image is applied correctly.

<Playground id="#5ITGBA#2" title="Force Shared Vertices 1" description="Force shared vertices example."/>

## Prior to Version 4.0

Use the function below. Any examples found in the playground then used the term 'minimizeVertices' rather than 'forceSharedVertices'.

## The Function

```javascript
BABYLON.Mesh.prototype.minimizeVertices = function() {

		var _decPlaces = Math.pow(10, 8);

        var _pdata = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var _ndata = this.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        var _idata = this.getIndices();    

        var _newPdata = []; //new positions array
        var _newIdata =[]; //new indices array

        var _mapPtr =0; // new index;
        var _uniquePositions = {}; // unique vertex positions
        for(var _i=0; _i<_idata.length; _i+=3) {
            var _facet = [_idata[_i], _idata[_i + 1], _idata[_i+2]]; //facet vertex indices
            var _pstring = []; //lists facet vertex positions (x,y,z) as string "xyz""
            for(var _j = 0; _j<3; _j++) { //
                _pstring[_j] = "";
                for(var _k = 0; _k<3; _k++) {
                    //small values make 0
                    if (Math.abs(_pdata[3*_facet[_j] + _k]) < 0.0001) {
                        _pdata[3*_facet[_j] + _k] = 0;
                    }
                    _pstring[_j] += Math.round(_pdata[3*_facet[_j] + _k] * _decPlaces)/_decPlaces + "|";
                }
            }
            //check facet vertices to see that none are repeated
            // do not process any facet that has a repeated vertex, ie is a line
            if(!(_pstring[0] == _pstring[1] || _pstring[0] == _pstring[2] || _pstring[1] == _pstring[2])) {        
                //for each facet position check if already listed in uniquePositions
                // if not listed add to uniquePositions and set index pointer
                // if listed use its index in uniquePositions and new index pointer
                for(var _j = 0; _j<3; _j++) { 
                    var _ptr = _uniquePositions[_pstring[_j]];
                    if(_ptr === undefined) {
                        _uniquePositions[_pstring[_j]] = _mapPtr;
                        _ptr = _mapPtr++;
                        //not listed so add individual x, y, z coordinates to new positions array newPdata
                        //and add matching normal data to new normals array newNdata
                        for(var _k = 0; _k<3; _k++) {
                            _newPdata.push(_pdata[3*_facet[_j] + _k]);
                        }
                    }
                    // add new index pointer to new indices array newIdata
                    _newIdata.push(_ptr);
                }
            }
        }

        _newNdata =[]; //new normal data

        BABYLON.VertexData.ComputeNormals(_newPdata, _newIdata, _newNdata);

        //create new vertex data object and update
        var _vertexData = new BABYLON.VertexData();
        _vertexData.positions = _newPdata;
        _vertexData.indices = _newIdata;
        _vertexData.normals = _newNdata;

        _vertexData.applyToMesh(this);

    }	
```

## Playground

<Playground id="#1JBMJ3#18" title="Minimizing Vertices" description="Simple example of minimizing vertices."/>