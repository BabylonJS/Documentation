---
title: Node Material Particle Shaders
image-url: /img/defaultImage.png
description: Learn how to create Particle Shaders using the Node Material.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor, particle, shader
further-reading:
video-overview:
video-content:
---

## Creating Particle shaders

Starting with Babylon.js v4.2, you can now create particle shaders (to be used with a particle system) with the node material editor.

You need simply to change the mode to _Particle_:

![Particle choice](/img/how_to/Materials/particleMenu.png)

Some blocks are made unavailable in this mode (they are hidden from the block list), as they have no meaning: the mesh, post process and animation blocks.

Also, in this mode, you can't create a vertex shader, only a fragment shader: the vertex shader is fixed and not updatable.

Note that everything is driven by the parameters of the particle system instance. For eg, if the current particle system displayed in the preview area does not use "ramp gradients", the `ParticleRampGradient` block does nothing (it does not add ramp gradients to the shader), it's just a pass-through. Same thing for the `ParticleBlendMultiply` block. The exception is the `ParticleTexture` block, and only in the preview area of the node editor: if you provide a texture for this block it will be used as the particle texture in the preview area, else the texture defined in the current particle system will be used. In any case, when using the material in a live program, the texture will always be the one defined by the `ParticleSystem.particleTexture` property.

The materials you create in the **Particle** mode can also be used for GPU particle systems, save for these restrictions:

-   GPU particle systems don't support ramp gradients, so the `RampGradientBlock` won't do anything (you can still use it in your material, it will simply do nothing)
-   GPU particle systems don't support the `textureMask` property, so you should not use the `ParticleTextureMask` block in your materials targeted for GPU particle systems, else display artifacts will appear

When you have created your particle shader in the NME, you can link the material to a particle system instance by calling the `NodeMaterial.createEffectForParticles` method:

```javascript
nodeMaterial.createEffectForParticles(particleSystem);
```

PG: <Playground id="#J9J6CG#1" title="NME Particle Shaders Example" description="Playground example of using the Node Material Editor to create Particle Shaders." image="/img/playgroundsAndNMEs/PGNMEParticleShader.jpg" isMain={true} category="Node Material"/>

The full fragment shader used by default by the particle system can be recreated in the NME: <NME id="#X3PJMQ#1" title="NME Full Default Fragment Shader" description="Node Material Editor setup of the default fragment shader for particle systems." image="/img/playgroundsAndNMEs/NMEdefaultParticleFragmentShader.jpg"/>

As explained above, if you want to use this material for GPU particle systems, you should remove the use of the `ParticleTextureMask` block: <NME id="#X3PJMQ#2" title="NME Full Default Fragment Shader GPU Version" description="Node Material Editor setup of the default fragment shader for particle systems on the GPU." image="/img/playgroundsAndNMEs/NMEdefaultParticleFragmentShaderGPU.jpg"/>