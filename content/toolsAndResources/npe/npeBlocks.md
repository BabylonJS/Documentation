---
title: Node Particle Editor Blocks
image: 
description: Available Blocks Within Node Particle Editor
keywords: particles, effects, node, graph, blocks
further-reading:
video-overview:
video-content:
toc-levels: 2
---

## What to Expect
This page is a breakdown of each block available in the Node Particle Editor. The blocks are listed in the same order by group as they appear in the tool's block list. The reason for this order is that there may be some generalities that apply to all blocks in a group and those will be listed once rather than repeating them for each block. For each block we will discuss all inputs, outputs, properties, and considerations to ensure all requirements for using a block are highlighted.

## System Nodes
System node blocks provide the core system configuration and global values used throughout the particle graph. Every graph requires a System block, and the other blocks in this group provide time-based and positional system-level data.

<H3Image title="System" image="/img/tools/npe/systemNode.png" alt="System node"/>
This is the core block that finalizes the particle system configuration. Every particle system graph must have exactly one System block, and it must be the last block in the chain. It manages particle capacity, rendering settings, blend modes, and emission rates. All emitter and update chains must eventually connect to this block. The block also handles sub-emitter triggers through the onStart and onEnd inputs, allowing particle systems to spawn other particle systems.

#### Properties
- **blendMode** defines how particles blend with the scene background. Options are ONEONE, STANDARD, ADD, MULTIPLY, and MULTIPLYADD.
- **capacity** sets the maximum number of particles that can exist simultaneously.
- **manualEmitCount** overrides the automatic particle emission count. Set to -1 to disable manual control.
- **startDelay** sets the delay in milliseconds before the particle system starts emitting.
- **updateSpeed** sets the frequency of particle updates in seconds. A value of 0.0167 corresponds to approximately 60 updates per second.
- **preWarmCycles** sets the number of update cycles to run before rendering begins. This is useful for having particles already visible when the system starts.
- **preWarmStepOffset** sets the time step multiplier for pre-warm cycles.
- **isBillboardBased** determines whether particles should always face the camera.
- **billBoardMode** sets how particles orient to the camera. Options are ALL which faces the camera completely, Y which rotates around the Y-axis only, STRETCHED which elongates based on velocity, and STRETCHED_LOCAL which stretches in local space.
- **isLocal** determines whether particles exist in local space or world space.
- **disposeOnStop** automatically disposes the particle system when it stops.
- **doNotStart** prevents the particle system from starting automatically.
- **renderingGroupId** sets the rendering group ID for controlling render order.
- **customShader** is a custom shader configuration object for advanced rendering.
- **emitter** is the mesh or position that serves as the emitter origin.

#### Inputs
- **particle** is the particle stream from emitter and update blocks and is required for the system to function.
- **emitRate** is an integer value setting the number of particles emitted per second.
- **texture** is the sprite texture applied to particles and is required for the system to render.
- **translationPivot** is a Vector2 value setting the texture pivot point for rotation.
- **textureMask** is a Color4 value that acts as a color mask applied to the texture.
- **targetStopDuration** is a Float value setting the duration in seconds for the system to fade out when stopped.
- **onStart** accepts a System connection to trigger another particle system when this one starts.
- **onEnd** accepts a System connection to trigger another particle system when this one stops.
- **rampGradient** is a Color4 value defining a color ramp gradient for particle coloring.

#### Outputs
- **system** is the finalized particle system instance and can be connected to other system inputs or used as the final output.

<H3Image title="Time" image="/img/tools/npe/timeNode.png" alt="Time node"/>
This block provides the current system time in milliseconds. It gives access to the global elapsed time since the particle system started and is useful for creating time-based animations, oscillations, or synchronized effects. Combine with trigonometry blocks like Sin or Cos for wave patterns, or with math blocks for custom timing functions.

#### Outputs
- **output** is the current time in milliseconds as a Float value.

<H3Image title="Delta" image="/img/tools/npe/deltaNode.png" alt="Delta node"/>
This block provides the time elapsed since the last frame update. It is essential for frame-rate-independent particle behaviors and should be used to scale velocity, rotation speed, or any time-dependent calculation so that the result is consistent regardless of frame rate.

#### Outputs
- **output** is the delta time value for the current frame as a Float value.

<H3Image title="Emitter Position" image="/img/tools/npe/emitterPositionNode.png" alt="Emitter Position node"/>
This block provides the world-space position of the particle system emitter. It is useful for calculating distances from the emitter, creating effects relative to the emitter origin, or implementing custom attraction or repulsion toward the emitter. The value updates each frame if the emitter is moving.

#### Outputs
- **output** is the emitter position in world space as a Vector3 value.

<H3Image title="Camera Position" image="/img/tools/npe/cameraPositionNode.png" alt="Camera Position node"/>
This block provides the world-space position of the active camera in the scene. It is useful for view-dependent effects such as particles that react to camera distance, billboard adjustments, or depth-based fading. Combine with math blocks to calculate camera-to-particle distances.

#### Outputs
- **output** is the active camera position in world space as a Vector3 value.

## Setup
Setup blocks handle particle creation and sprite sheet configuration. Every particle system graph needs a Create Particle block as the starting point for its emission chain.

<H3Image title="Create Particle" image="/img/tools/npe/createParticleNode.png" alt="Create Particle node"/>
This block creates new particles and initializes their properties. It is the first block in an emission chain and must be placed before shape emitter blocks.

#### Inputs
- **emitPower** is a Float value that acts as a multiplier for emission velocity.
- **lifeTime** is a Float value setting the particle lifespan in seconds.
- **color** is a Color4 value setting the initial particle color.
- **colorDead** is a Color4 value setting the end-of-life particle color.
- **scale** sets the particle scale and accepts either a Vector2 for independent X and Y scaling or a Float which applies uniformly.
- **angle** is a Float value setting the initial rotation angle in radians.
- **size** is a Float value setting the particle size.

#### Outputs
- **particle** is the created particle system instance ready to be connected to a shape emitter block.

<H3Image title="Setup Sprite Sheet" image="/img/tools/npe/setupSpriteSheetNode.png" alt="Setup Sprite Sheet node"/>
This block configures sprite sheet animation for particles, enabling animated sprite effects. It is used in conjunction with a texture input on the System block where the texture should contain a sprite sheet as a grid of sprite frames. All sprite parameters are configured through the properties panel.

#### Properties
- **start** sets the starting sprite cell index for animation.
- **end** sets the ending sprite cell index for animation.
- **width** sets the width of each sprite cell in pixels.
- **height** sets the height of each sprite cell in pixels.
- **spriteCellChangeSpeed** sets the speed of sprite cell animation.
- **loop** determines whether sprite animation should loop.
- **randomStartCell** determines whether the starting cell is randomized for each particle.

#### Inputs
- **particle** is the particle system to configure sprite sheets for and is required.

#### Outputs
- **output** is the particle system with sprite sheet animation configured.

## Shapes
Shape blocks define the spatial distribution of particles, controlling where they spawn and in which direction they move initially. Every particle system needs at least one shape emitter block connected after the Create Particle block. All shape blocks take a particle input and output a particle type that flows through the graph to update blocks and eventually to the System block.

<H3Image title="Box Shape" image="/img/tools/npe/boxShapeNode.png" alt="Box Shape node"/>
This emitter creates particles at random positions within a box volume with customizable directional vectors. Particles spawn at random positions within the box defined by minEmitBox and maxEmitBox, and initial velocity directions are randomized between direction1 and direction2 vectors.

#### Inputs
- **particle** is the particle system to apply the box emitter to and is required.
- **direction1** is a Vector3 value setting the minimum direction vector for randomization.
- **direction2** is a Vector3 value setting the maximum direction vector for randomization.
- **minEmitBox** is a Vector3 value setting the minimum corner of the emission box.
- **maxEmitBox** is a Vector3 value setting the maximum corner of the emission box.

#### Outputs
- **output** is the particle system with the box emitter applied.

<H3Image title="Cone Shape" image="/img/tools/npe/coneShapeNode.png" alt="Cone Shape node"/>
This emitter creates particles from a cone shape with customizable spread angle and radius range. When emitFromSpawnPointOnly is false, particles spawn along the cone surface. The directionRandomizer is automatically used unless both direction1 and direction2 inputs are connected, which override the automatic direction calculation.

#### Properties
- **emitFromSpawnPointOnly** when enabled causes particles to emit only from the cone apex instead of the cone surface.

#### Inputs
- **particle** is the particle system to apply the cone emitter to and is required.
- **radius** is a Float value setting the radius of the cone base.
- **angle** is a Float value setting the cone spread angle in radians.
- **radiusRange** is a Float value between 0 and 1 that controls the randomization factor for spawn radius.
- **heightRange** is a Float value between 0 and 1 that controls the randomization factor for spawn height along the cone.
- **directionRandomizer** is a Float value between 0 and 1 that adds randomness to the initial direction.
- **direction1** is a Vector3 value setting the custom direction range minimum.
- **direction2** is a Vector3 value setting the custom direction range maximum.

#### Outputs
- **output** is the particle system with the cone emitter applied.

<H3Image title="Sphere Shape" image="/img/tools/npe/sphereShapeNode.png" alt="Sphere Shape node"/>
This emitter creates particles from a spherical surface with optional hemispheric mode. It uses proper spherical distribution with polar coordinates to ensure even particle distribution across the sphere surface. When isHemispheric is enabled, emission is restricted to the top half of the sphere.

#### Properties
- **isHemispheric** when enabled restricts emission to the top hemisphere of the sphere.

#### Inputs
- **particle** is the particle system to apply the sphere emitter to and is required.
- **radius** is a Float value setting the sphere radius.
- **radiusRange** is a Float value between 0 and 1 that controls the randomization factor for spawn radius.
- **directionRandomizer** is a Float value between 0 and 1 that adds randomness to the initial direction.
- **direction1** is a Vector3 value setting the custom direction range minimum.
- **direction2** is a Vector3 value setting the custom direction range maximum.

#### Outputs
- **output** is the particle system with the sphere emitter applied.

<H3Image title="Point Shape" image="/img/tools/npe/pointShapeNode.png" alt="Point Shape node"/>
This is the simplest emitter block. All particles spawn at the emitter origin and the block only controls the initial direction which is randomized between direction1 and direction2.

#### Inputs
- **particle** is the particle system to apply the point emitter to and is required.
- **direction1** is a Vector3 value setting the minimum direction vector for randomization.
- **direction2** is a Vector3 value setting the maximum direction vector for randomization.

#### Outputs
- **output** is the particle system with the point emitter applied.

<H3Image title="Custom Shape" image="/img/tools/npe/customShapeNode.png" alt="Custom Shape node"/>
This emitter allows complete control over particle emission using custom user-defined generator functions. These functions must be assigned programmatically in code, not through the UI. If particleDestinationGenerator is provided without particleDirectionGenerator, particle direction is automatically calculated from the destination and lifetime.

#### Properties (Assignable Functions)
- **particlePositionGenerator** is a custom function to generate particle positions with signature `(index: number, particle: Particle | null, outPosition: Vector3) => void`.
- **particleDestinationGenerator** is a custom function to generate particle destination positions with the same signature.
- **particleDirectionGenerator** is a custom function to generate particle initial directions with the same signature.

#### Inputs
- **particle** is the particle system to apply the custom emitter to and is required.

#### Outputs
- **output** is the particle system with the custom emitter applied.

<H3Image title="Cylinder Shape" image="/img/tools/npe/cylinderShapeNode.png" alt="Cylinder Shape node"/>
This emitter creates particles from a cylinder surface with proper circular distribution. It uses a spherical distribution algorithm for circular positioning to avoid clustering. Direction is based on surface normals unless custom direction inputs are connected.

#### Inputs
- **particle** is the particle system to apply the cylinder emitter to and is required.
- **radius** is a Float value setting the cylinder radius.
- **height** is a Float value setting the cylinder height.
- **radiusRange** is a Float value between 0 and 1 that controls the randomization factor for spawn radius.
- **directionRandomizer** is a Float value between 0 and 1 that adds randomness to the initial direction.
- **direction1** is a Vector3 value setting the custom direction range minimum.
- **direction2** is a Vector3 value setting the custom direction range maximum.

#### Outputs
- **output** is the particle system with the cylinder emitter applied.

<H3Image title="Mesh Shape" image="/img/tools/npe/meshShapeNode.png" alt="Mesh Shape node"/>
This emitter creates particles from a mesh surface using random triangles with barycentric interpolation. It caches vertex positions, normals, and color data from the source mesh for efficient sampling and uses barycentric coordinates to smoothly distribute particles across triangle surfaces.

#### Properties
- **useMeshNormalsForDirection** when enabled uses vertex normals from the mesh for particle initial direction.
- **useMeshColorForColor** when enabled uses vertex colors from the mesh for particle colors.
- **serializedCachedData** when enabled includes cached mesh data in serialization for offline use.
- **worldSpace** when enabled applies the mesh world transform matrix to particle positions.

#### Inputs
- **particle** is the particle system to apply the mesh emitter to and is required.
- **direction1** is a Vector3 value setting the fallback minimum direction if not using mesh normals.
- **direction2** is a Vector3 value setting the fallback maximum direction if not using mesh normals.

#### Outputs
- **output** is the particle system with the mesh emitter applied.

## Updates
Update blocks modify particle properties during their lifetime. They are placed between emitter blocks and the System block to create dynamic particle behaviors. Update blocks execute every frame for each active particle, allowing properties like color, size, position, and rotation to change over time. Multiple update blocks can be chained together to create complex behaviors, and the order matters as blocks execute in the order they are connected.

<H3Image title="Update Direction" image="/img/tools/npe/updateDirectionNode.png" alt="Update Direction node"/>
This block overwrites the particle velocity direction during simulation. It only executes if the direction input is connected. It can be used to create wind effects, vortices, or attraction and repulsion behaviors when combined with math blocks.

#### Inputs
- **particle** is the particle stream to update and is required.
- **direction** is a Vector3 value providing the new direction vector to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Position" image="/img/tools/npe/updatePositionNode.png" alt="Update Position node"/>
This block directly overwrites particle position during simulation, bypassing the default velocity-based movement. It only executes if the position input is connected and can be used for completely custom particle paths or to constrain particles to specific surfaces.

#### Inputs
- **particle** is the particle stream to update and is required.
- **position** is a Vector3 value providing the new position to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Color" image="/img/tools/npe/updateColorNode.png" alt="Update Color node"/>
This block dynamically updates particle color during simulation, bypassing the default color interpolation between color and colorDead set in the Create Particle block. It only executes if the color input is connected and is useful for creating dynamic color effects based on gradients, noise, or other procedural sources.

#### Inputs
- **particle** is the particle stream to update and is required.
- **color** is a Color4 value providing the new color to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Scale" image="/img/tools/npe/updateScaleNode.png" alt="Update Scale node"/>
This block updates particle scale with separate control over X and Y dimensions, allowing particles to stretch or squash. It is useful for creating motion blur effects or non-uniform particle shapes.

#### Inputs
- **particle** is the particle stream to update and is required.
- **scale** is a Vector2 value providing the new scale to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Size" image="/img/tools/npe/updateSizeNode.png" alt="Update Size node"/>
This block updates particle size during simulation for dynamic scaling effects. It is a scalar size adjustment that affects particle scale uniformly and is commonly used with gradients to fade particles in and out or pulse based on lifetime.

#### Inputs
- **particle** is the particle stream to update and is required.
- **size** is a Float value providing the new size to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Angle" image="/img/tools/npe/updateAngleNode.png" alt="Update Angle node"/>
This block updates particle rotation angle during simulation. It controls 2D sprite rotation around the billboard axis and is useful for spinning particles or aligning particles with their direction of motion.

#### Inputs
- **particle** is the particle stream to update and is required.
- **angle** is a Float value providing the new rotation angle in radians to apply to particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Age" image="/img/tools/npe/updateAgeNode.png" alt="Update Age node"/>
This block allows manual control over particle age. It only executes if the age input is connected and can be used to create custom lifetime behaviors or synchronize particles with external timers.

#### Inputs
- **particle** is the particle stream to update and is required.
- **age** is a Float value providing the new age value to set for particles. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Basic Color Update" image="/img/tools/npe/basicColorUpdateNode.png" alt="Basic Color Update node"/>
This block applies the default color interpolation each frame using the particle's color step value. Each frame, the block adds the particle's scaled color step to its current color and clamps alpha to a minimum of zero. This is the standard way to interpolate color from the initial color toward the dead color over the particle's lifetime. This block has no additional inputs beyond the particle stream as it uses the color step values computed from the initial color and colorDead set in the Create Particle block.

#### Inputs
- **particle** is the particle stream to update and is required.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Basic Position Update" image="/img/tools/npe/basicPositionUpdateNode.png" alt="Basic Position Update node"/>
This block applies the default position update each frame using the particle's direction and direction scale. Each frame, it updates the particle position by adding the direction vector scaled by the direction scale. This is the standard velocity-based movement for particles. This block has no additional inputs beyond the particle stream as it uses the direction values set during particle creation and any modifications from other update blocks.

#### Inputs
- **particle** is the particle stream to update and is required.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Basic Sprite Update" image="/img/tools/npe/basicSpriteUpdateNode.png" alt="Basic Sprite Update node"/>
This block applies the default sprite sheet cell index update each frame, automatically advancing through the sprite animation. It uses the sprite parameters configured in the Setup Sprite Sheet block to determine animation speed, looping, and cell boundaries. This block has no additional inputs beyond the particle stream.

#### Inputs
- **particle** is the particle stream to update and is required.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Sprite Cell Index" image="/img/tools/npe/updateSpriteCellIndexNode.png" alt="Update Sprite Cell Index node"/>
This block overrides the automatic sprite animation from the Setup Sprite Sheet block, allowing manual control over which sprite frame is displayed. It is useful for creating custom animation patterns or synchronizing sprite animation with other particle properties. Float values connected to the cellIndex input are floored to integer.

#### Inputs
- **particle** is the particle stream to update and is required.
- **cellIndex** is an integer value setting the new sprite cell index to display. This input must be connected for the block to activate.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Flow Map" image="/img/tools/npe/updateFlowMapNode.png" alt="Update Flow Map node"/>
This block applies a flow map texture to control particle movement, creating flowing or swirling patterns. It reads RGB values from the flow map texture to determine particle movement direction where Red, Green, and Blue channels encode XYZ direction. It is useful for creating water flow, wind fields, or guided particle paths.

#### Inputs
- **particle** is the particle stream to update and is required.
- **flowMap** is a texture where RGB values encode direction for particle flow.
- **strength** is a Float value controlling the flow map influence strength.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Noise" image="/img/tools/npe/updateNoiseNode.png" alt="Update Noise node"/>
This block applies procedural noise to particle velocities for organic randomness. It uses a procedural noise texture to add natural-looking randomness to particle motion by modifying particle direction. The strength is a Vector3 allowing independent control over each axis. It supports procedural textures that update each frame and is useful for smoke, fire, and magical effects.

#### Inputs
- **particle** is the particle stream to update and is required.
- **noiseTexture** is a procedural noise texture providing the noise pattern.
- **strength** is a Vector3 value controlling the noise intensity per axis.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Update Attractor" image="/img/tools/npe/updateAttractorNode.png" alt="Update Attractor node"/>
This block applies attraction or repulsion forces to particles toward or away from a target point. It uses inverse-distance-squared falloff to create gravitational-like effects where particles closer to the attractor experience stronger forces. The force is added to the existing particle velocity rather than replacing it, and the strength can be negative for repulsion.

#### Inputs
- **particle** is the particle stream to update and is required.
- **attractor** is a Vector3 value setting the target position for attraction or repulsion.
- **strength** is a Float value controlling the force strength where positive values attract and negative values repel.

#### Outputs
- **output** is the updated particle stream.

<H3Image title="Align Angle" image="/img/tools/npe/alignAngleNode.png" alt="Align Angle node"/>
This block automatically aligns particle rotation to match their direction of movement by calculating the rotation angle from the particle velocity direction in camera view space. The alignment property allows adding a constant offset to the calculated angle. It is useful for making elongated particles like sparks or streaks point in their direction of travel and works best with STRETCHED billboard mode.

#### Properties
- **alignment** is the angle offset in radians applied after the alignment calculation. The value ranges from 0 to 2π.

#### Inputs
- **particle** is the particle stream to update and is required.

#### Outputs
- **output** is the updated particle stream with aligned angles.

<H3Image title="Update Remap" image="/img/tools/npe/updateRemapNode.png" alt="Update Remap node"/>
This block controls which portion of the ramp gradient texture a particle uses for its color and alpha. It works in conjunction with the rampGradient input on the System block. The remapColor and remapAlpha inputs define the range of the ramp gradient to use for color and alpha respectively. The block only executes if at least one remap input is connected.

#### Inputs
- **particle** is the particle stream to update and is required.
- **remapColor** is a Vector2 value defining the range to remap the color from the ramp gradient.
- **remapAlpha** is a Vector2 value defining the range to remap the alpha from the ramp gradient.

#### Outputs
- **output** is the updated particle stream.

## Inputs
Input blocks provide constant values that can be edited in the properties panel and accessed from code at runtime. They are the source of numeric values, colors, vectors, and textures that drive particle behavior. All input blocks can be named and accessed programmatically to dynamically change values at runtime.

<H3Image title="Float" image="/img/tools/npe/floatNode.png" alt="Float node"/>
This input block represents a Float value. The value can be set in the properties panel.

#### Properties
- **value** is the Float value set on the block.
- **min** provides the minimum value constraint.
- **max** provides the maximum value constraint.

#### Outputs
- **output** is the Float value set on the block.

<H3Image title="Vector2" image="/img/tools/npe/vector2Node.png" alt="Vector2 node"/>
This input block represents a Vector2 value. The value can be set in the properties panel by expanding the input fields for each component.

#### Properties
- **value** is the Vector2 value set on the block.

#### Outputs
- **output** is the Vector2 value set on the block.

<H3Image title="Vector3" image="/img/tools/npe/vector3Node.png" alt="Vector3 node"/>
This input block represents a Vector3 value. The value can be set in the properties panel by expanding the input fields for each component.

#### Properties
- **value** is the Vector3 value set on the block.

#### Outputs
- **output** is the Vector3 value set on the block.

<H3Image title="Int" image="/img/tools/npe/intNode.png" alt="Int node"/>
This input block represents an integer value. The value can be set in the properties panel.

#### Properties
- **value** is the integer value set on the block.

#### Outputs
- **output** is the integer value set on the block.

<H3Image title="Texture" image="/img/tools/npe/textureNode.png" alt="Texture node"/>
This block provides a texture that can be used as input to the System block, flow map blocks, noise blocks, or any other block requiring texture input. Textures can be loaded from URLs or selected from scene assets.

#### Properties
- **texture** is the reference to the texture asset which can be a URL or loaded texture.

#### Outputs
- **output** is the texture resource.

<H3Image title="Color4" image="/img/tools/npe/color4Node.png" alt="Color4 node"/>
This input block represents an RGBA color value. The value can be set using the color picker in the properties panel.

#### Properties
- **value** is the Color4 value set on the block.

#### Outputs
- **output** is the Color4 value set on the block.

## Contextual
Contextual blocks provide read access to per-particle properties during the update phase. They output the current value of a particle attribute and are used to build expressions that reference particle state. All contextual blocks have a single output and no inputs as they read the current particle's data at evaluation time. These blocks are essential for creating dynamic particle behaviors that respond to each particle's individual state.

<H3Image title="Position" image="/img/tools/npe/positionNode.png" alt="Position node"/>
This contextual block returns the current position of the particle as a Vector3 value.

#### Outputs
- **output** is the particle's current position as a Vector3 value.

<H3Image title="Direction" image="/img/tools/npe/directionNode.png" alt="Direction node"/>
This contextual block returns the current direction or velocity vector of the particle as a Vector3 value.

#### Outputs
- **output** is the particle's current direction vector as a Vector3 value.

<H3Image title="Direction Scale" image="/img/tools/npe/directionScaleNode.png" alt="Direction Scale node"/>
This contextual block returns the direction scale factor of the particle, which is the multiplier applied to direction when computing position updates.

#### Outputs
- **output** is the particle's direction scale as a Float value.

<H3Image title="Scaled Direction" image="/img/tools/npe/scaledDirectionNode.png" alt="Scaled Direction node"/>
This contextual block returns the direction vector already multiplied by the direction scale. This is the effective velocity used in position updates.

#### Outputs
- **output** is the particle's scaled direction vector as a Vector3 value.

<H3Image title="Color" image="/img/tools/npe/colorNode.png" alt="Color node"/>
This contextual block returns the current color of the particle.

#### Outputs
- **output** is the particle's current color as a Color4 value.

<H3Image title="Age" image="/img/tools/npe/ageNode.png" alt="Age node"/>
This contextual block returns the current age of the particle in seconds since it was created.

#### Outputs
- **output** is the particle's age in seconds as a Float value.

<H3Image title="Lifetime" image="/img/tools/npe/lifetimeNode.png" alt="Lifetime node"/>
This contextual block returns the total lifetime of the particle in seconds as set by the Create Particle block.

#### Outputs
- **output** is the particle's total lifetime in seconds as a Float value.

<H3Image title="Scale" image="/img/tools/npe/scaleNode.png" alt="Scale node"/>
This contextual block returns the current scale of the particle.

#### Outputs
- **output** is the particle's current scale as a Vector2 value.

<H3Image title="Size" image="/img/tools/npe/sizeNode.png" alt="Size node"/>
This contextual block returns the current uniform size of the particle.

#### Outputs
- **output** is the particle's current size as a Float value.

<H3Image title="Age Gradient" image="/img/tools/npe/ageGradientNode.png" alt="Age Gradient node"/>
This contextual block returns the particle's age divided by its lifetime, giving a normalized value from 0 at birth to 1 at death. This is the most commonly used contextual block for driving gradients and interpolation over a particle's life. Connect it to the gradient input of Lerp, Gradient, or Gradient Value blocks to create time-based transitions.

#### Outputs
- **output** is the particle's normalized age as a Float value in the range of 0 to 1.

<H3Image title="Angle" image="/img/tools/npe/angleNode.png" alt="Angle node"/>
This contextual block returns the current rotation angle of the particle in radians.

#### Outputs
- **output** is the particle's current rotation angle as a Float value.

<H3Image title="Initial Color" image="/img/tools/npe/initialColorNode.png" alt="Initial Color node"/>
This contextual block returns the initial color that was assigned to the particle at creation time.

#### Outputs
- **output** is the particle's initial color as a Color4 value.

<H3Image title="Color Dead" image="/img/tools/npe/colorDeadNode.png" alt="Color Dead node"/>
This contextual block returns the dead color that was assigned to the particle at creation time. This is the target color the particle will reach at the end of its lifetime.

#### Outputs
- **output** is the particle's dead color as a Color4 value.

<H3Image title="Sprite Cell End" image="/img/tools/npe/spriteCellEndNode.png" alt="Sprite Cell End node"/>
This contextual block returns the ending sprite cell index for the particle's sprite animation.

#### Outputs
- **output** is the sprite cell end index as a Float value.

<H3Image title="Sprite Cell Start" image="/img/tools/npe/spriteCellStartNode.png" alt="Sprite Cell Start node"/>
This contextual block returns the starting sprite cell index for the particle's sprite animation.

#### Outputs
- **output** is the sprite cell start index as a Float value.

<H3Image title="Sprite Cell Index" image="/img/tools/npe/spriteCellIndexNode.png" alt="Sprite Cell Index node"/>
This contextual block returns the current sprite cell index being displayed for the particle.

#### Outputs
- **output** is the current sprite cell index as a Float value.

<H3Image title="Initial Direction" image="/img/tools/npe/initialDirectionNode.png" alt="Initial Direction node"/>
This contextual block returns the initial direction vector that was assigned to the particle at creation time.

#### Outputs
- **output** is the particle's initial direction as a Vector3 value.

<H3Image title="Color Step" image="/img/tools/npe/colorStepNode.png" alt="Color Step node"/>
This contextual block returns the color step value which is the per-frame color change that is applied by the Basic Color Update block. The color step is computed from the difference between the initial color and dead color divided by the particle's lifetime.

#### Outputs
- **output** is the particle's color step as a Color4 value.

<H3Image title="Scaled Color Step" image="/img/tools/npe/scaledColorStepNode.png" alt="Scaled Color Step node"/>
This contextual block returns the color step value already scaled by the system's update speed.

#### Outputs
- **output** is the particle's scaled color step as a Color4 value.

## Math: Standard
These blocks are simple mathematical operations like add, subtract, min, max, or round. The blocks in this section are some of the most used blocks in any particle graph. They are very straightforward, but many of the blocks in this set support multiple types including Float, Int, Vector2, Vector3, and Color4 and operate component-wise on vectors and colors.

<H3Image title="Add" image="/img/tools/npe/addNode.png" alt="Add node"/>
This is a simple math block which adds two inputs together. This block can support Float, Int, Vector2, Vector3, and Color4 types, though the block cannot add mixed types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the first value to be used in the operation.
- **right** is connected to a block providing the second value to be used in the operation.

#### Outputs
- **output** is the sum of the left and right inputs and matches type with the values connected to left and right.

<H3Image title="Divide" image="/img/tools/npe/divideNode.png" alt="Divide node"/>
This is a simple math block which divides the left input by the right input. This block can support Float, Int, Vector2, Vector3, and Color4 types, though the block cannot divide mixed types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the dividend.
- **right** is connected to a block providing the divisor.

#### Outputs
- **output** is the quotient of the left input divided by the right input and matches type with the values connected to left and right.

<H3Image title="Max" image="/img/tools/npe/maxNode.png" alt="Max node"/>
This is a simple math block which returns the larger value between the left input and the right input. This block can support Float, Int, Vector2, Vector3, and Color4 types, though the block cannot evaluate mixed types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the first value to be used in the evaluation.
- **right** is connected to a block providing the second value to be used in the evaluation.

#### Outputs
- **output** is the larger value between the left input and the right input and matches type with the values connected to left and right.

<H3Image title="Min" image="/img/tools/npe/minNode.png" alt="Min node"/>
This is a simple math block which returns the smaller value between the left input and the right input. This block can support Float, Int, Vector2, Vector3, and Color4 types, though the block cannot evaluate mixed types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the first value to be used in the evaluation.
- **right** is connected to a block providing the second value to be used in the evaluation.

#### Outputs
- **output** is the smaller value between the left input and the right input and matches type with the values connected to left and right.

<H3Image title="Multiply" image="/img/tools/npe/multiplyNode.png" alt="Multiply node"/>
This is a simple math block which multiplies the left input and the right input. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise on vectors. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the first value to be used in the operation.
- **right** is connected to a block providing the second value to be used in the operation.

#### Outputs
- **output** is the product of the left input multiplied by the right input and matches type with the values connected to left and right.

<H3Image title="Subtract" image="/img/tools/npe/subtractNode.png" alt="Subtract node"/>
This is a simple math block which subtracts the right input from the left input. This block can support Float, Int, Vector2, Vector3, and Color4 types, though the block cannot subtract mixed types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the value to subtract from.
- **right** is connected to a block providing the value to subtract.

#### Outputs
- **output** is the difference of the right input subtracted from the left input and matches type with the values connected to left and right.

<H3Image title="Modulo" image="/img/tools/npe/moduloNode.png" alt="Modulo node"/>
This is a simple math block which returns the remainder of the division of the left input by the right input. This block only supports Float and Int types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the dividend.
- **right** is connected to a block providing the divisor.

#### Outputs
- **output** is the remainder of the left input divided by the right input and matches type with the values connected to left and right.

<H3Image title="Pow" image="/img/tools/npe/powNode.png" alt="Pow node"/>
This is a simple math block which raises the left input to the power of the right input. This block only supports Float and Int types. The type of the block first connected to an input determines the type for the block output.

#### Inputs
- **left** is connected to a block providing the base value.
- **right** is connected to a block providing the exponent.

#### Outputs
- **output** is the result of the left input raised to the power of the right input and matches type with the values connected to left and right.

<H3Image title="Negate" image="/img/tools/npe/negateNode.png" alt="Negate node"/>
This is a simple function which changes the sign of the input by multiplying it by -1. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be negated.

#### Outputs
- **output** is the negated value from the input and matches type with the value connected to input.

<H3Image title="One Minus" image="/img/tools/npe/oneMinusNode.png" alt="One Minus node"/>
This is a shortcut function which subtracts the input value from 1. When this function is applied to a value in the range of 0 to 1 the result will be an inversion of the input on that scale. This is useful for inverting normalized values such as converting an age gradient that goes from 0 to 1 into one that goes from 1 to 0 for fade-out effects. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the transformed value from the input and matches type with the value connected to input.

<H3Image title="Reciprocal" image="/img/tools/npe/reciprocalNode.png" alt="Reciprocal node"/>
This is a shortcut function which divides 1 by the input value. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the transformed value from the input and matches type with the value connected to input.

<H3Image title="Sign" image="/img/tools/npe/signNode.png" alt="Sign node"/>
This is a simple function to return whether an input is positive, negative, or exactly zero. If the input is negative this block will return a value of -1. If the input is exactly zero, the block will return a value of 0. If the value is positive the block will return a value of 1. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** returns -1 for a negative value in input, 0 for a value of zero in input, and 1 for a positive value in input.

<H3Image title="Sqrt" image="/img/tools/npe/sqrtNode.png" alt="Sqrt node"/>
This is a simple function to return the principal square root of a nonnegative value connected to the input port. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the principal square root of the input value in a type that matches the input value type.

<H3Image title="Round" image="/img/tools/npe/roundNode.png" alt="Round node"/>
This is a simple function which transforms the input to the nearest whole number. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the rounded value from the input and matches type with the value connected to input.

<H3Image title="Floor" image="/img/tools/npe/floorNode.png" alt="Floor node"/>
This is a simple function which transforms the input to the largest whole number that is less than or equal to the input. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the transformed value from the input and matches type with the value connected to input.

<H3Image title="Ceiling" image="/img/tools/npe/ceilingNode.png" alt="Ceiling node"/>
This is a simple function which transforms the input to the smallest whole number that is greater than or equal to the input. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the transformed value from the input and matches type with the value connected to input.

<H3Image title="Float To Int" image="/img/tools/npe/floatToIntNode.png" alt="Float To Int node"/>
This block converts a floating-point value to an integer using a configurable operation. The operation property controls how the decimal portion is handled. It is useful for sprite cell indices or discrete parameter values.

#### Properties
- **operation** sets the conversion method and can be set to Round, Ceil, Floor, or Truncate.

#### Inputs
- **input** is connected to a block providing a Float value to be converted.

#### Outputs
- **output** is the converted integer value.

<H3Image title="Dot" image="/img/tools/npe/dotNode.png" alt="Dot node"/>
This block computes the dot product of two Vector3 inputs, returning a scalar value. The dot product returns the cosine of the angle between two vectors when those vectors are normalized. It is useful for angle calculations, projection, and determining how parallel two vectors are.

#### Inputs
- **left** is connected to a block providing the first Vector3 value.
- **right** is connected to a block providing the second Vector3 value.

#### Outputs
- **output** is the dot product of the two vectors as a Float value.

<H3Image title="Distance" image="/img/tools/npe/distanceNode.png" alt="Distance node"/>
This block computes the Euclidean distance between two Vector3 positions. It is useful for proximity checks, distance-based fading, or triggering behaviors when particles are within a certain range of a target.

#### Inputs
- **left** is connected to a block providing the first Vector3 position.
- **right** is connected to a block providing the second Vector3 position.

#### Outputs
- **output** is the distance between the two positions as a Float value.

<H3Image title="Clamp" image="/img/tools/npe/clampNode.png" alt="Clamp node"/>
This is a simple function which limits the input value to the range set by the minimum and maximum inputs. If the input is below the minimum, it is clamped to the minimum value. If it is over the maximum value, it is clamped to the maximum value. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the value input determines the type for the block output.

#### Inputs
- **value** is connected to a block providing the value to be clamped.
- **min** is a Float value setting the minimum allowed value.
- **max** is a Float value setting the maximum allowed value.

#### Outputs
- **output** is the clamped value from the input and matches type with the value connected to the value input.

## Math: Scientific
These blocks are a collection of more complex mathematical functions, mostly trigonometric. They are all very straightforward blocks with one input and one output. All blocks in this set can support Float, Int, Vector2, Vector3, and Color4 types and operate component-wise.

<H3Image title="Abs" image="/img/tools/npe/absNode.png" alt="Abs node"/>
This is a simple function to return the absolute value of the input, which is always a positive value. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the absolute value of the input value in a type that matches the input value type.

<H3Image title="ArcCos" image="/img/tools/npe/arcCosNode.png" alt="ArcCos node"/>
This function returns the inverse cosine of the input value. The input should be in the range of -1 to 1 and the result is in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the inverse cosine of the input value in a type that matches the input value type.

<H3Image title="ArcSin" image="/img/tools/npe/arcSinNode.png" alt="ArcSin node"/>
This function returns the inverse sine of the input value. The input should be in the range of -1 to 1 and the result is in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the inverse sine of the input value in a type that matches the input value type.

<H3Image title="ArcTan" image="/img/tools/npe/arcTanNode.png" alt="ArcTan node"/>
This function returns the inverse tangent of the input value with the result in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the inverse tangent of the input value in a type that matches the input value type.

<H3Image title="Cos" image="/img/tools/npe/cosNode.png" alt="Cos node"/>
This function returns the cosine of the input angle in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing an angle in radians to be used in the function.

#### Outputs
- **output** is the cosine of the input value in a type that matches the input value type.

<H3Image title="Exp" image="/img/tools/npe/expNode.png" alt="Exp node"/>
This function returns e raised to the power of the input value. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used as the exponent.

#### Outputs
- **output** is e raised to the power of the input value in a type that matches the input value type.

<H3Image title="Exp2" image="/img/tools/npe/exp2Node.png" alt="Exp2 node"/>
This function returns 2 raised to the power of the input value. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used as the exponent.

#### Outputs
- **output** is 2 raised to the power of the input value in a type that matches the input value type.

<H3Image title="Log" image="/img/tools/npe/logNode.png" alt="Log node"/>
This function returns the natural logarithm of the input value. The input must be positive. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the natural logarithm of the input value in a type that matches the input value type.

<H3Image title="Sin" image="/img/tools/npe/sinNode.png" alt="Sin node"/>
This function returns the sine of the input angle in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing an angle in radians to be used in the function.

#### Outputs
- **output** is the sine of the input value in a type that matches the input value type.

<H3Image title="Tan" image="/img/tools/npe/tanNode.png" alt="Tan node"/>
This function returns the tangent of the input angle in radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing an angle in radians to be used in the function.

#### Outputs
- **output** is the tangent of the input value in a type that matches the input value type.

<H3Image title="To Degrees" image="/img/tools/npe/toDegreesNode.png" alt="To Degrees node"/>
This function converts a value from radians to degrees. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing an angle in radians to be converted.

#### Outputs
- **output** is the angle converted to degrees in a type that matches the input value type.

<H3Image title="To Radians" image="/img/tools/npe/toRadiansNode.png" alt="To Radians node"/>
This function converts a value from degrees to radians. This block can support Float, Int, Vector2, Vector3, and Color4 types. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing an angle in degrees to be converted.

#### Outputs
- **output** is the angle converted to radians in a type that matches the input value type.

<H3Image title="Fract" image="/img/tools/npe/fractNode.png" alt="Fract node"/>
This function returns only the fractional part of a floating-point number. For a value of 3.7 the result would be 0.7. This is useful for creating repeating patterns, wrapping values, or extracting the decimal portion for oscillation effects. This block can support Float, Int, Vector2, Vector3, and Color4 types and operates component-wise. The type for the block connected to the input determines the type for the block output.

#### Inputs
- **input** is connected to a block providing a value to be used in the function.

#### Outputs
- **output** is the fractional part of the input value in a type that matches the input value type.

<H3Image title="Vector Length" image="/img/tools/npe/vectorLengthNode.png" alt="Vector Length node"/>
This block calculates the length or magnitude of a vector. It computes the Euclidean distance from the origin and is useful for speed calculations such as finding the length of a direction vector, distance checks, or normalizing vectors when combined with division.

#### Inputs
- **input** is connected to a block providing a Vector2 or Vector3 value to measure.

#### Outputs
- **output** is the length of the input vector as a Float value.

## Logical
Logical blocks are used to branch a particle graph by performing a test between two Float values. If the test between the two values meets the condition set by the block, a value of true is returned and the block connected to the ifTrue port is passed to the output. Otherwise, the block connected to the ifFalse port is passed to the output. There are common properties that are shared by all logical blocks as follows.

- **ifTrue and ifFalse** ports on each logical block do not need to be connected to anything for the block to function. If a block is connected to ifTrue or ifFalse, that value will be passed when the appropriate condition is met. If nothing is connected to ifTrue or ifFalse, the block will output 1.0 and 0.0 respectively. This allows for successive logical tests by testing if the previous logical test was true or false without the need to wire Float blocks for ifTrue and ifFalse in the graph.

<H3Image title="Equal" image="/img/tools/npe/equalNode.png" alt="Equal node"/>
This logical block tests if the Float value in the left port and the right port are both equal to one another within the epsilon tolerance. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Properties
- **epsilon** is a Float value that provides tolerance for the floating-point comparison.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Not Equal" image="/img/tools/npe/notEqualNode.png" alt="Not Equal node"/>
This logical block tests if the Float value in the left port and the right port are not equal to one another outside the epsilon tolerance. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Properties
- **epsilon** is a Float value that provides tolerance for the floating-point comparison.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Less Than" image="/img/tools/npe/lessThanNode.png" alt="Less Than node"/>
This logical block tests if the Float value in the left port is less than the Float value in the right port. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Less Or Equal" image="/img/tools/npe/lessOrEqualNode.png" alt="Less Or Equal node"/>
This logical block tests if the Float value in the left port is less than or equal to the Float value in the right port. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Greater Than" image="/img/tools/npe/greaterThanNode.png" alt="Greater Than node"/>
This logical block tests if the Float value in the left port is greater than the Float value in the right port. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Greater Or Equal" image="/img/tools/npe/greaterOrEqualNode.png" alt="Greater Or Equal node"/>
This logical block tests if the Float value in the left port is greater than or equal to the Float value in the right port. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Xor" image="/img/tools/npe/xorNode.png" alt="Xor node"/>
This logical block tests if exactly one of the left port or the right port contains a Float value not equal to 0.0, but not both. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="Or" image="/img/tools/npe/orNode.png" alt="Or node"/>
This logical block tests if either the left port or the right port contain a Float value not equal to 0.0. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

<H3Image title="And" image="/img/tools/npe/andNode.png" alt="And node"/>
This logical block tests if the Float value in the left port and the right port are both not equal to 0.0. If the test returns true, the value of ifTrue is passed otherwise the value of ifFalse is passed.

#### Inputs
- **left** is connected to a block providing a Float value to be used in the test.
- **right** can be connected to a block providing a Float value to be used in the test.
- **ifTrue** can be connected to any data type but needs to be the same data type as connected to ifFalse and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifTrue is 1.0.
- **ifFalse** can be connected to any data type but needs to be the same data type as connected to ifTrue and will determine the data type for the output port on this block. If nothing is connected, the value assumed by ifFalse is 0.0.

#### Outputs
- **output** is the value attached to ifTrue if the test returns true or the value attached to ifFalse if the test returns false. If one or both ports for ifTrue and ifFalse are not connected, the output passes 1.0 if the test returns true and 0.0 if the test returns false.

## Interpolation
Interpolation blocks derive a value based on an input value range or an input value limit. They are essential for creating time-based particle effects and smooth transitions.

<H3Image title="Lerp" image="/img/tools/npe/lerpNode.png" alt="Lerp node"/>
This block will derive a value between the two input values based on the gradient value. It works with Float, Vector2, Vector3, and Color4 types.

#### Inputs
- **left** is a value that can be of any supported type and will be returned if the value for gradient is set to 0.
- **right** is a value that can be of any supported type and will be returned if the value for gradient is set to 1.
- **gradient** is a value of type float which determines the output value between the left and right inputs. A value passed to the gradient input that is not in the range of 0 to 1 will allow the value returned to fall outside the range of the left input to the right input.

#### Outputs
- **output** is the value that will match the type of the left and right input values and is a value derived from the range of the left input to the right input at the position of the gradient.

<H3Image title="Gradient Value" image="/img/tools/npe/gradientValueNode.png" alt="Gradient Value node"/>
This block defines a single value entry in a gradient. It is used as input to the Gradient block to define value stops at specific positions along the gradient. This block does not function alone and must be connected to a Gradient block's value inputs.

#### Properties
- **reference** sets the position of this value in the gradient on a scale of 0 to 1.

#### Inputs
- **value** is the value at this gradient position and can be of type Float, Vector2, Vector3, or Color4.

#### Outputs
- **output** is the gradient entry which converts to the appropriate gradient type for connection to a Gradient block.

<H3Image title="Gradient" image="/img/tools/npe/gradientNode.png" alt="Gradient node"/>
This block interpolates between multiple Gradient Value entries based on an input gradient position. Connect the Age Gradient contextual block to the gradient input for lifetime-based transitions. The block dynamically adds new value inputs as Gradient Value blocks are connected.

#### Inputs
- **gradient** is a Float value that determines where in the gradient to sample. A value of 0 samples the beginning and a value of 1 samples the end.
- **value0**, **value1**, and so on are gradient value entries from Gradient Value blocks. New inputs are dynamically added as Gradient Value blocks are connected.

#### Outputs
- **output** is the interpolated value at the sampled position and matches the type of the connected gradient value entries.

<H3Image title="NLerp" image="/img/tools/npe/nlerpNode.png" alt="NLerp node"/>
This block will derive a normalized value between the two input values based on the gradient value. It performs linear interpolation and then normalizes the result. This is more efficient than spherical interpolation for direction vectors when approximate results are acceptable.

#### Inputs
- **left** is a value that can be of any supported type and will be returned if the value for gradient is set to 0.
- **right** is a value that can be of any supported type and will be returned if the value for gradient is set to 1.
- **gradient** is a value of type float which determines the output value between the left and right inputs.

#### Outputs
- **output** is the value that will match the type of the left and right input values and is a normalized value derived from the range of the left input to the right input at the position of the gradient.

<H3Image title="Smooth Step" image="/img/tools/npe/smoothStepNode.png" alt="Smooth Step node"/>
This block will return a gradient value between 0 and 1 depending on how the input value compares with edge0 and edge1. It uses the formula 3x² - 2x³ for smooth transitions which produces a more natural-looking result than linear interpolation for fades and transitions.

#### Inputs
- **value** is a value that can be of any input type which will be evaluated against edge0 and edge1.
- **edge0** is a value of Float type and sets the threshold for the lower limit of the transition.
- **edge1** is a value of Float type and sets the threshold for the upper limit of the transition.

#### Outputs
- **output** is a value between 0 and 1 that matches the input type. If the input value is less than edge0, the output value will be 0. If the input value is between edge0 and edge1, the output will be a smooth interpolation. If the input value is greater than or equal to edge1, the output value will be 1.

<H3Image title="Step" image="/img/tools/npe/stepNode.png" alt="Step node"/>
This block will return a value of 0 or 1 depending on if the input value is less than or greater than the value connected to edge. It creates hard transitions without interpolation and is useful for binary decisions, triggers, or creating discrete states in particle behavior.

#### Inputs
- **value** is a value that can be of any input type which will be evaluated with the value connected to edge.
- **edge** is a value of Float type and sets the threshold for the comparison with the input value.

#### Outputs
- **output** is a value of either 0 if the value input is less than the edge input or 1 if the value input is equal to or greater than the edge input.

## Misc
Miscellaneous utility blocks for type conversion, randomization, debugging, graph organization, and special effects.

<H3Image title="Converter" image="/img/tools/npe/converterNode.png" alt="Converter node"/>
This block decomposes and recomposes values between Color4, Vector3, Vector2, and individual Float components. It enables bidirectional conversion allowing extraction of individual components from vectors and colors as well as constructing them from individual values. Input values take priority from higher-dimensional inputs so a connected Color4 will populate all component outputs.

#### Inputs
- **color** is a Color4 value to decompose.
- **xyz** is a Vector3 value to decompose.
- **xy** is a Vector2 value to decompose.
- **zw** is a Vector2 value mapped to z and w components.
- **x** is a Float value for the X or R component.
- **y** is a Float value for the Y or G component.
- **z** is a Float value for the Z or B component.
- **w** is a Float value for the W or A component.

#### Outputs
- **color** is the recomposed Color4 from components.
- **xyz** is the recomposed Vector3 from components.
- **xy** is X and Y as a Vector2.
- **zw** is Z and W as a Vector2.
- **x** is the X or R component as a float.
- **y** is the Y or G component as a float.
- **z** is the Z or B component as a float.
- **w** is the W or A component as a float.

<H3Image title="Random" image="/img/tools/npe/randomNode.png" alt="Random node"/>
This block generates random values within a specified range. It supports Float, Vector2, Vector3, and Color4 types with component-wise randomization. The lockMode property controls when random values are regenerated which is important for controlling consistency of randomization across particles and frames.

#### Properties
- **lockMode** controls when random values are regenerated. The options are None which generates a new value every evaluation, PerParticle which caches a value per particle, PerSystem which uses the same value for all particles in one update, and OncePerParticle which generates a value once at particle birth that never changes.

#### Inputs
- **min** is connected to a block providing the minimum random value.
- **max** is connected to a block providing the maximum random value.

#### Outputs
- **output** is a random value between min and max and matches type with the values connected to min and max.

<H3Image title="Debug" image="/img/tools/npe/debugNode.png" alt="Debug node"/>
This block outputs debug information to the console for troubleshooting. The value passes through unchanged, allowing debug blocks to be inserted anywhere in the flow for inspection without affecting particle behavior.

#### Properties
- **stackSize** sets the number of recent values to keep in the debug log.

#### Inputs
- **input** is connected to any block whose value needs to be inspected.

#### Outputs
- **output** is the pass-through of the input value in the same type.

<H3Image title="Elbow" image="/img/tools/npe/elbowNode.png" alt="Elbow node"/>
This is a purely organizational block that helps route wires for better graph readability. It has no functional impact on particle behavior and simply passes values through while allowing wires to be bent and routed for clarity. It can be quickly added to wires by option or alt-clicking on a wire.

#### Inputs
- **input** is connected to any block whose wire needs to be routed.

#### Outputs
- **output** is the same value as the input in the same type.

<H3Image title="Teleport In" image="/img/tools/npe/teleportInNode.png" alt="Teleport In node"/>
This block creates an entry point that sends data to one or more corresponding Teleport Out blocks without a visible wire. It reduces wire clutter by allowing data to jump across the graph without visible connections. A single Teleport In can feed multiple Teleport Out blocks, effectively duplicating the data stream. The data type is preserved through the teleport.

#### Inputs
- **input** is connected to any block whose value should be teleported.

#### Outputs
None. The value appears at linked Teleport Out blocks.

<H3Image title="Teleport Out" image="/img/tools/npe/teleportOutNode.png" alt="Teleport Out node"/>
This block receives data from a corresponding Teleport In block. It must be linked to a Teleport In block which can be selected from the properties panel. The output type matches the input type of the corresponding Teleport In block.

#### Inputs
None. The value is received from the linked Teleport In block.

#### Outputs
- **output** is the value received from the linked Teleport In block and matches the type of the teleported value.

<H3Image title="Local Variable" image="/img/tools/npe/localVariableNode.png" alt="Local Variable node"/>
This block stores and reuses a value to avoid redundant calculations and improve graph readability. It acts like a variable in code by storing a snapshot of the value that can be reused multiple times without recalculating. It is useful for organizing complex graphs, avoiding duplicate calculations, and improving performance when the same computed value is needed in multiple places.

#### Properties
- **scope** determines when the stored value is captured. The options are Particle which captures the value per particle and Loop which captures the value once per system update loop.

#### Inputs
- **input** is connected to any block whose value should be stored.

#### Outputs
- **output** is the stored value in the same type as the input.

<H3Image title="Fresnel" image="/img/tools/npe/fresnelNode.png" alt="Fresnel node"/>
This block computes the Fresnel term using the Schlick approximation based on view and normal vectors. It returns higher values at glancing angles and lower values when the surface faces the camera directly using a base reflectance of 0.04 for dielectric materials. It guards against zero-length input vectors and is useful for rim lighting effects, edge glow, or view-angle-based transparency.

#### Inputs
- **view** is a Vector3 value providing the view direction vector and is required.
- **normal** is a Vector3 value providing the surface normal vector and is required.

#### Outputs
- **output** is the Fresnel value as a Float between 0 and 1.

## Triggers
Trigger blocks enable sub-emitter functionality, allowing particle systems to spawn other particle systems based on conditions.

<H3Image title="Trigger" image="/img/tools/npe/triggerNode.png" alt="Trigger node"/>
This block triggers a sub-emitter particle system when a condition is met during particle updates. When the condition input evaluates to a non-zero value, the block spawns a clone of the connected system at the current particle's position. The limit property prevents excessive sub-emitter spawning and the delay property rate-limits trigger activations. Sub-emitters are automatically disposed when the parent system is disposed. Connect a separate System block with its own particle graph to the system input to define the sub-emitter behavior.

#### Properties
- **limit** sets the maximum number of simultaneously active sub-emitter instances. A value of 0 means unlimited.
- **delay** sets the minimum delay in milliseconds between trigger activations.

#### Inputs
- **input** is the particle stream to monitor and is required.
- **condition** is a Float value that triggers the sub-emitter when it is non-zero.
- **system** is the particle system to spawn when triggered and is required.

#### Outputs
- **output** is the pass-through of the input particle stream.


## Tips for Using Blocks Effectively

1. **Start Simple** — Begin with a Create Particle, Shape, and System flow then add complexity.
2. **Use Frames** — Group related blocks in frames for organization, especially complex update chains.
3. **Test Incrementally** — Add blocks one at a time and check the preview to understand each effect.
4. **Leverage Gradients** — Use Gradient and Gradient Value blocks with the Age Gradient contextual block for smooth lifetime transitions.
5. **Combine Updates** — Chain multiple update blocks for complex behaviors such as Color then Size then Position.
6. **Debug Often** — Use Debug blocks to verify values are in expected ranges.
7. **Optimize with Teleports** — Use Teleport In and Out blocks to reduce wire clutter in complex graphs.
8. **Save Custom Frames** — Export useful block combinations as custom frames for reuse.
9. **Name Everything** — Give blocks meaningful names for easier debugging and code access.
10. **Check Console** — Always monitor the console for errors about missing connections or invalid values.
