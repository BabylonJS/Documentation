# Lights and Shadows
Lights are of course necessary to see the meshes and affect brightness and colour. All meshes will be lit by a light unless specifically excluded from being lit. Light will pass through all meshes and will produce shadows only when shadow generation is set on the mesh. The default number of lights allowed is four but this can be increased. 


## Types of Lights
There are four types of lights that can be used with a range of lighting properties. They are

* The Point Light - think light bulb.  
* The Directional Light - think planet lit by a distant sun.  
* The Spot Light - think of a focused beam of light.
* The Hemispheric Light - think of the ambient light.

## Color Properties
The three properties of lights that affect  are  _diffuse_ and _specular_ which apply to all four types of light and _groundColor_, which only applies to an Hemispheric Light.

1. Diffuse gives the basic color to an object;
2. Specular produces a highlight color on an object.
3. Ground Color the ambient color.

Overlapping lights will interact as you would expect with the overlap of red, green and blue producing white light.

## Intensity
Every light can be switched on or off by enabling or not and when on its intensity can be set with a value from 0 to 1. 

## Shadows
For shadows a _shadowGenerator_ object is needed. A mesh can then produce a shadow by adding it to a rendering list of the _shadowGenerator_. There is also an extension, **shadows only**,  that allows shadows on a transparent mesh.

## Normals
To begin to understand how meshes react to light you need to know about the normals of a mesh since they form part of the calculations in determining the color and illumination shown.

## Light Scattering
This post process effect can produce rays of light as scattered by the meshes it hits.

# Further Reading

## Basic - L1

[Lights 101](/babylon101/Lights)  
[Shadows 101](/babylon101/shadows)

## More Advanced - L3

[Light Scattering](/How_To/Using_the_Volumetric_LightScattering_post-process)  
[Shadows Only](/extensions/ShadowOnly)


   


