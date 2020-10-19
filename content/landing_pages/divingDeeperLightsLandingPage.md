# Lights and Shadows
Lights are of course necessary to see the meshes and affect brightness and colour. Although lights show meshes they only produce shadows when shadow generation is set on the mesh. The default number of lights allowed is four but this can be increased. 

There are four types of lights that can be used with a range of lighting properties.

* The Point Light - think light bulb.  
* The Directional Light - think planet lit by a distant sun.  
* The Spot Light - think of a focused beam of light.
* The Hemispheric Light - think of the ambient light.

Color properties for all lights include _emissive_, _diffuse_ and _specular_.

Overlapping lights will interact as you would expect with the overlap of red, green and blue producing white light. Every light can be switched on or off and when on its intensity can be set with a value from 0 to 1. 

For shadows a _shadowGenerator_ object is needed. There is also an extension, **shadows only**,  that allows shadows on a transparent mesh.

To begin to understand how meshes react to light you need to know about the normals of a mesh since they form part of the calculations in determining the color and illumination.
