# Increasing Vertices of a Mesh

The appearance of a softbody or the effect of a shader depends on the number of facets the mesh has. Some meshes 
such as a ground or sphere can have smaller or larger numbers of facets depending on the parameters set during their 
creation. For other meshes such as a box or disc there can be no or little choice. In these circumstances it may 
be useful to have a function that can increase the facets.

When n is the number of points per side added to each side of a facet the number of facets is increased by (n + 1)<sup>2</sup>.

**NOTE** From Babylon.js version 4.0 onwards this utility now exists as a standard method on a mesh.

```javascript
mesh.increaseVertices(n);
```

# The Playground

The disc at the top left has the number of facets made when it was created. The lower right has had the facets increased.

* [Playground Example Increase Facets](https://www.babylonjs-playground.com/#5ITGBA#1)

# Prior to Version 4.0

Use the function below. Any examples found in the playground then used the term 'increaseFacets' rather than 'increaseVertices'.

## The Function

```javascript
BABYLON.Mesh.prototype.increaseFacets = function(pps) { //pps points per side        
    var _gaps = pps+1;
    var _n = _gaps + 1;
    var _fvs =[];
    for(var _i=0; _i<_n; _i++) {
        _fvs[_i] = [];
    }    
    var _A,_B;
    var _d ={x:0,y:0,z:0};
    var _u ={x:0,y:0};
    var _indices = [];
    var _vertexIndex = [];
    var _side = [];
	var _l; //holds lengths
    var _uvs = this.getVerticesData(BABYLON.VertexBuffer.UVKind);
    var _meshIndices = this.getIndices();
    var _positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);    
    var _normals =[];    

    for(var _i = 0; _i<_meshIndices.length; _i+=3) {
        _vertexIndex[0] = _meshIndices[_i];
        _vertexIndex[1] = _meshIndices[_i + 1];
        _vertexIndex[2] = _meshIndices[_i + 2];        
        for(var _j = 0; _j<3; _j++) {
            _A = _vertexIndex[_j];
            _B = _vertexIndex[(_j+1)%3];        
            if(_side[_A] === undefined  && _side[_B] ===  undefined) {            
                _side[_A] = [];
                _side[_B] = [];            
            }
            else {
                if(_side[_A] === undefined) {                    
                    _side[_A] = [];
                }
                if(_side[_B] === undefined) {                    
                    _side[_B] = [];                                
                }
            }
            if(_side[_A][_B]  === undefined  && _side[_B][_A] === undefined) {            
                _side[_A][_B] = [];
                _d.x = (_positions[3 * _B] - _positions[3 * _A])/_gaps;
                _d.y = (_positions[3 * _B + 1] - _positions[3 * _A + 1])/_gaps;
                _d.z = (_positions[3 * _B + 2] - _positions[3 * _A + 2])/_gaps;
                _u.x = (_uvs[2*_B] - _uvs[2*_A])/_gaps;
                _u.y = (_uvs[2*_B + 1] - _uvs[2*_A + 1])/_gaps;
                _side[_A][_B].push(_A);                
                for(var _k=1; _k<_gaps; _k++) {                
                    _side[_A][_B].push(_positions.length/3);                
                    _positions.push(_positions[3 * _A] + _k*_d.x, _positions[3 * _A + 1] + _k*_d.y, _positions[3 * _A + 2] + _k*_d.z);
                    _uvs.push(_uvs[2*_A] + _k*_u.x, _uvs[2*_A + 1] + _k*_u.y);
                }                
                _side[_A][_B].push(_B);
                _side[_B][_A]=[];
                _l = _side[_A][_B].length;
                for(var _a=0; _a<_l; _a++) {
                    _side[_B][_A][_a] = _side[_A][_B][_l-1-_a];
                }
            }
            else {
                if(_side[_A][_B] === undefined) {            
                    _side[_A][_B]=[];
                    _l = _side[_B][_A].length;
                    for(var _a=0; _a<_l; _a++) {
                        _side[_A][_B][_a] = _side[_B][_A][_l-1-_a];
                    }
                }
                if(_side[_B][_A] === undefined) {            
                    _side[_B][_A]=[];                
                    _l = _side[_A][_B].length;
                    for(var _a=0; _a<_l; _a++) {
                        _side[_B][_A][_a] = _side[_A][_B][_l-1-_a];
                    }
                }
            }                    
        }    
        _fvs[0][0] = _meshIndices[_i];
        _fvs[1][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][1];
        _fvs[1][1] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][1];        
        for(var _k = 2; _k<_gaps; _k++) {
            _fvs[_k][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][_k];
            _fvs[_k][_k] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][_k];        
            _d.x = (_positions[3 * _fvs[_k][_k]] - _positions[3 * _fvs[_k][0]])/_k;
            _d.y = (_positions[3 * _fvs[_k][_k] + 1] - _positions[3 * _fvs[_k][0] + 1])/_k;
            _d.z = (_positions[3 * _fvs[_k][_k] + 2] - _positions[3 * _fvs[_k][0] + 2])/_k;
            _u.x = (_uvs[2*_fvs[_k][_k]] - _uvs[2*_fvs[_k][0]])/_k;
            _u.y = (_uvs[2*_fvs[_k][_k] + 1] - _uvs[2*_fvs[_k][0] + 1])/_k;
            for(var _j = 1; _j<_k; _j++) {                
                _fvs[_k][_j] = _positions.length/3;                
                _positions.push(_positions[3 * _fvs[_k][0]] + _j*_d.x, _positions[3 * _fvs[_k][0] + 1] + _j*_d.y, _positions[3 * _fvs[_k][0] + 2] + _j*_d.z);
                _uvs.push(_uvs[2*_fvs[_k][0]] + _j*_u.x, _uvs[2*_fvs[_k][0] + 1] + _j*_u.y);
            }        
        }
        _fvs[_gaps] = _side[_meshIndices[_i + 1]][_meshIndices[_i + 2]];

        _indices.push(_fvs[0][0],_fvs[1][0],_fvs[1][1]);
        for(var _k = 1; _k<_gaps; _k++) {
            for(var _j = 0; _j<_k; _j++) {            
                _indices.push(_fvs[_k][_j],_fvs[_k+1][_j],_fvs[_k+1][_j+1]);
                _indices.push(_fvs[_k][_j],_fvs[_k+1][_j+1],_fvs[_k][_j+1]);
            }        
            _indices.push(_fvs[_k][_j],_fvs[_k+1][_j],_fvs[_k+1][_j+1]);
        }

    }                            

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = _positions;
    vertexData.indices = _indices;
    vertexData.uvs = _uvs;

    BABYLON.VertexData.ComputeNormals(_positions, _indices, _normals);
    vertexData.normals = _normals;
	
    vertexData.applyToMesh(this);

}
```

# The Playground

The disc at the top left has the number of facets made when it was created. The lower right has had the facets increased.

* [Playground Example Increase Facets](https://www.babylonjs-playground.com/#2322Y7#14)


 

