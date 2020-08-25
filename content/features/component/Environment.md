# Realistic Environments

An environment is more than just basic shapes, basic textures and basic lighting in a scene. A realistic environment would have a sky, uneven terrain, shadows and perhaps water, fog and different lighting effects. Some of these effects such as adding a sky, uneven ground and fog are handled quite simply and are described in Environment 101. Others require a shader and some are post processes. Some of these are provided for in the Babylon.js engine itself others have to be loaded separately as extensions.

## Sky

This can be achieved with a _skybox_ object, a large cube that has its inner faces viewable and covered in a sky texture from six images, one per face.

## Uneven Terrain

The most straight forward way is to apply an [height map](/babylon101/Height_Map) image to the ground object. This greyscale pixels of such an image provide the values for the height of the ground.

![HeightMap5](/img/how_to/HeightMap/14-4S.png)

## Dynamic Terrain

Do you want a very large, or infinite terrain, then Babylon.js provides an extension to do this using a Dynamic Terrain.
The Dynamic Terrain is a mesh and a 3D data map of geographic positions giving planar and height coordinates. The mesh stays in place and morphs according to the current world camera position and a data map. This gives the illusion of being able to fly around the terrain.

* [Playground Example Early Prototype](https://www.babylonjs-playground.com/#21MVDH#1)

Now a fully developed extension.

* [Playground Example Around the World](https://www.babylonjs-playground.com/#FJNR5#190)

Remember to click in display area before using keys.


## Shadows
For [shadows](/babylon101/shadows) a _shadowGenerator_ object is needed. A mesh can then produce a shadow by adding it to a rendering list of the _shadowGenerator_. There is also an extension, [shadows only](/extensions/ShadowOnly),  that allows shadows on a transparent mesh.

## Fog

Though it can be a complicated procedure to form a fog effect a fairly simple method is described in [Environment 101](/babylon101/Environment#fog). The effect can be extended further by customising a shader.

## Physically Based Rendering Materials

World objects do not all absorb and reflect light in the same way. A metal sculture and a concrete one behave completely differently under the same lights. [Physically based rendering](/How_To/Physically_Based_Rendering) materials go a long way to allow you to differentiate between the different substances you might want in your project.

## Light Effects

As well as fog, shadows, reflection and reflection it is also possible to give the effects of [light scattering](/How_To/Using_the_Volumetric_LightScattering_post-process) and [lens flare](/How_To/How_to_use_Lens_Flares).

## Post Processes

Postprocesses are part of the rendering pipeline that allows you to create 2D effects on top of your scene. A postprocess is linked to a camera and can be part of a chain of postprocesses where each postprocess uses the result of the previous one as input for its own processing.

### Shaders

A shader is code written for the GPU and is what finally renders your scene. Babylon.js deals with the shader code for you, all you need to do is to set the camera, material and lighting. However should you wish to do so you can write your own shader to produce the effect you want. You can edit and try out any shader code at http://cyos.babylonjs.com/

A range of shaders including fire, water, lava and fur can be found in the materials library section of [Extensions](/extensions).


# Further Reading

## Basic - L1

[Environment 101](/babylon101/Environment)  
[Height Maps 101](/babylon101/Height_Map)   
[Shadows 101](/babylon101/shadows)  
[Lights 101](/babylon101/Lights)  
[Materials](/features/Materials)

## Mid Level - L2

[Introduction to Physically Based Rendering Materials](/How_To/Physically_Based_Rendering)  
[Skybox](/How_To/Skybox)  
[HDR environment](/How_To/Use_HDR_Environment)
[Dynamic Terrain](/extensions/Dynamic_Terrain)  
[Dynamic Terrain Examples](/extensions/DT_Examples)

## More Advanced - L3

[Master Physically Based Rendering Materials](/How_To/Physically_Based_Rendering_Master)  
[Fog using Custom Shader](/How_To/Supporting_fog_with_ShaderMaterial)  
[Shadows Only](/extensions/ShadowOnly)   
[Light Scattering](/How_To/Using_the_Volumetric_LightScattering_post-process)  
[Lens Flare](/How_To/How_to_use_Lens_Flares)  
[Reflection and Refraction](/How_To/Reflect)  
[Reflection Probes](/How_To/How_to_use_Reflection_probes)

[How to use PostProcesses](/How_To/How_to_use_PostProcesses)  
[How to use PostProcessRenderPipeline](/How_To/How_to_use_PostProcessRenderPipeline)  
[Using the SSAO rendering pipeline](/How_To/Using_the_SSAO_rendering_pipeline)  
[Using the standard rendering pipeline](/How_To/Using_Standard_Rendering_Pipeline)  
[Using the default rendering pipeline](/How_To/Using_Default_Rendering_Pipeline)  
[Using depth-of-field and other lens effects](/How_To/Using_depth-of-field_and_other_lens_effects)


[Introduction to Shaders](/resources/ShaderIntro)  
[How To Put Shader Code in Babylon.js](/How_To/Putting)  
[How To Use ShaderMaterial](/How_To/Shader_Material)  
[Example A Vertical Wave with Shader Code](/samples/Writing1)  
[Example Fireworks with Shader Code](/samples/Writing2)
