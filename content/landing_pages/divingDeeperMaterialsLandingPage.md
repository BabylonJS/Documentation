# Materials
Materials give your meshes color and texture. Materials can be opaque or have different degrees of transparency. One material in Babylon.js it can be used to cover as many meshes as you wish. There are a host of features available, some of which are mention below.

The degree of transparency can be set for the whole material with an _alpha_ value. When the underlying image has transparent areas then the _hasAlpha_ property can be set on the texture. An image with a transparency gradient is also catered for using the _opacityTexture_.

Transparency can  adversely affect the drawing of overlapping meshes. To help the correct rendering of transparent overlapping meshes Babylon.js provides access to the depth buffer by enabling the _DepthRenderer_ object.

Blending is the method of combining colors on screen. For example when one color is (r<sub>0</sub>, g<sub>0</sub>, b<sub>0</sub>) and another (r<sub>1</sub>, g<sub>1</sub>, b<sub>1</sub>) then the second color could just replace the first, or could be (r<sub>0</sub> + r<sub>1</sub>, g<sub>0</sub> + g<sub>1</sub>, b<sub>0</sub> + b<sub>1</sub>) or perhaps (r<sub>0</sub> - r<sub>1</sub>, g<sub>0</sub> - g<sub>1</sub>, b<sub>0</sub> - b<sub>1</sub>) or other combinations. 

Babylon.js gives a way to set the method of blending when one mesh overlaps another through the material property _alphaMode_. 

Should you wish to use a texture as tiles across a mesh or even offset your texture on a mesh, Babylon.js can do this. The material can also be displayed as a wireframe helping you to see the  underlying structure of the mesh.

Using multi-materials more than one material can be applied to a mesh. Also meshes that have distinct faces or surfaces, such as a box or cylinder, can have color or texture applied to these faces individually.

A dynamic texture allows you to have an active material that you can draw and write on. 

Sometimes you want your material to appear more textured (more 3D than smooth) in which case bump mapping and parallax mapping are available. Reflection and refraction on surfaces are also possible.

