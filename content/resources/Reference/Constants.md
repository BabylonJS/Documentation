# BabylonJS Constants


## Alpha Mode

Specifies the blending mode of a material

BABYLON.Engine.ALPHA_COMBINE  
BABYLON.Engine.ALPHA_ADD  
BABYLON.Engine.ALPHA_SUBTRACT  
BABYLON.Engine.ALPHA_MULTIPLY  
BABYLON.Engine.ALPHA_MAXIMIZED  


## Animation

Specifies the property types 

BABYLON.Animation.ANIMATIONTYPE_COLOR3  
BABYLON.Animation.ANIMATIONTYPE_FLOAT  
BABYLON.Animation.ANIMATIONTYPE_MATRIX  
BABYLON.Animation.ANIMATIONTYPE_QUATERNION  
BABYLON.Animation.ANIMATIONTYPE_VECTOR2  
BABYLON.Animation.ANIMATIONTYPE_VECTOR3  

Specifies the loop methods

BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE - Restart the animation from initial value  
BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT - Stop the animation at the final value  
BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE - Repeat the animation incrementing using key values  


## Axis

Specifies world or local axis when using rotate or tranlate for example.

BABYLON.Space.LOCAL  
BABYLON.Space.WORLD

Specifies the x, y or z axis as a unit vector

BABYLON.Axis.X  
BABYLON.Axis.Y  
BABYLON.Axis.Z

## Fog

Specifies the fog mode.

BABYLON.Scene.FOGMODE_NONE - default one, fog is deactivated.  
BABYLON.Scene.FOGMODE_EXP - the fog density is following an exponential function.  
BABYLON.Scene.FOGMODE_EXP2 - same that above but faster.  
BABYLON.Scene.FOGMODE_LINEAR - the fog density is following a linear function.  


## Side Orientation

Used if required when creating a mesh to set side orientation.

BABYLON.Mesh.FRONTSIDE,  
BABYLON.Mesh.BACKSIDE,  
BABYLON.Mesh.DOUBLESIDE,  
BABYLON.Mesh.DEFAULT which is the default value and equals FRONTSIDE currently.


## VertexBuffer Kind

Used when accessing the vertex data from the vertex buffer

BABYLON.VertexBuffer.PositionKind  
BABYLON.VertexBuffer.UVKind  
BABYLON.VertexBuffer.UV2Kind  
BABYLON.VertexBuffer.UV3Kind  
BABYLON.VertexBuffer.UV4Kind  
BABYLON.VertexBuffer.UV5Kind  
BABYLON.VertexBuffer.UV6Kind  
BABYLON.VertexBuffer.ColorKind  
BABYLON.VertexBuffer.MatricesIndicesKind  
BABYLON.VertexBuffer.MatricesIndicesExtraKind  
BABYLON.VertexBuffer.MatricesWeightsKind  
BABYLON.VertexBuffer.MatricesWeightsExtraKind  
