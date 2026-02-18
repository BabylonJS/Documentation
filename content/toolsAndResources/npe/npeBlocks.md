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

This page is a breakdown of each block available in the Node Particle Editor. The blocks will be listed in the same order by group as they are in the tool's block list. The reason for this order is that there may be some generalities that apply to all blocks in a group and those will be listed once rather than repeating them for each block. For each block we will discuss all inputs, outputs, properties, and considerations to ensure all requirements for using a block are highlighted.

## System

The System block is unique and required for every particle system graph. It serves as the final output node that configures and manages the entire particle system.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: System block node in the graph
> 
> **Filename**: `/img/tools/npe/systemNode.jpg`
> 
> **Instructions**:
> 1. Add a System block to the graph
> 2. Capture showing the block with its input/output ports visible
> 3. Show it in a simple graph context (connected to at least one emitter)

### System Block

This is the core block that finalizes the particle system configuration. Every particle system graph must have exactly one System block, and it must be the last block in the chain. It manages particle capacity, rendering settings, blend modes, and emission rates.

#### Properties

- **blendMode** - Defines how particles blend with the scene background. Options: ONEONE (default), STANDARD, ADD, MULTIPLY, MULTIPLYADD
- **capacity** - Maximum number of particles that can exist simultaneously [default: 1000, range: 0-10000]
- **manualEmitCount** - Override the automatic particle emission count. Set to -1 to disable manual control [default: -1]
- **startDelay** - Delay in milliseconds before the particle system starts emitting [default: 0]
- **updateSpeed** - Frequency of particle updates in seconds [default: 0.0167, range: 0-0.1]
- **preWarmCycles** - Number of update cycles to run before rendering begins, useful for having particles already visible when the system starts [default: 0]
- **preWarmStepOffset** - Time step multiplier for pre-warm cycles [default: 0]
- **isBillboardBased** - Whether particles should face the camera [default: true]
- **billBoardMode** - How particles orient to camera. Options: ALL (face camera completely), Y (rotate around Y-axis only), STRETCHED (elongate based on velocity), STRETCHED_LOCAL (stretched in local space) [default: ALL]
- **isLocal** - Whether particles exist in local space (true) or world space (false) [default: false]
- **disposeOnStop** - Automatically dispose the particle system when it stops [default: false]
- **doNotStart** - Prevent the particle system from starting automatically [default: false]
- **renderingGroupId** - Rendering group ID for controlling render order [default: 0]
- **customShader** - Custom shader configuration object for advanced rendering [default: null]
- **emitter** - The mesh or position that serves as the emitter origin

#### Inputs

- **particle** (Particle) - **Required**. The particle stream from emitter and update blocks
- **emitRate** (Int) - Number of particles emitted per second [default: 10]
- **texture** (Texture) - The sprite texture applied to particles
- **translationPivot** (Vector2) - Texture pivot point for rotation [default: (0,0)]
- **textureMask** (Color4) - Color mask applied to the texture [default: (1,1,1,1)]
- **targetStopDuration** (Float) - Duration in seconds for the system to fade out when stopped [default: 0]
- **onStart** (System) - Trigger another particle system when this one starts
- **onEnd** (System) - Trigger another particle system when this one stops
- **rampGradient** (Color4) - Color ramp gradient for particle coloring

#### Outputs

- **system** (System) - The finalized ParticleSystem instance

#### Special Considerations

The System block is the final destination for all particle data. All emitter and update chains must eventually connect to this block. It dynamically calculates emission rates based on connected inputs and manages the complete lifecycle of the particle system. The block also handles sub-emitter triggers through the onStart and onEnd inputs, allowing particle systems to spawn other particle systems.

## Emitters

Emitter blocks are responsible for creating particles and setting their initial properties. Every particle system needs at least one emitter block. Emitters define the spatial distribution of particles - where they spawn and in which direction they move initially.

All emitter blocks output a Particle type that flows through the graph to update blocks and eventually to the System block.

### Create Particle Block

This block creates new particles and initializes their properties. It's typically the first block in an emission chain before shape emitters.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Create Particle block node
> 
> **Filename**: `/img/tools/npe/createParticleNode.jpg`
> 
> **Instructions**:
> 1. Add a CreateParticle block to the graph
> 2. Show the block with all input ports visible
> 3. Capture in context with at least one connected input

#### Inputs

- **emitPower** (Float) - Multiplier for emission velocity [default: 1]
- **lifeTime** (Float) - Particle lifespan in seconds [default: 1]
- **color** (Color4) - Initial particle color [default: white (1,1,1,1)]
- **colorDead** (Color4) - End-of-life particle color [default: transparent black (0,0,0,0)]
- **scale** (Vector2 or Float) - Particle scale [default: (1,1)]
- **angle** (Float) - Initial rotation angle in radians [default: 0]
- **size** (Float) - Particle size [default: 1]

#### Outputs

- **particle** (Particle) - The created particle system instance

#### Special Considerations

This block creates the underlying ParticleSystem and initializes particle properties. It manages color interpolation from the initial color to the colorDead value over the particle's lifetime. Must be used as the first block in an emission chain before shape emitters.

### Box Shape Block

This emitter creates particles at random positions within a box volume with customizable directional vectors.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Box Shape block node
> 
> **Filename**: `/img/tools/npe/boxShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a BoxShape block to the graph
> 2. Show the block with input/output ports visible
> 3. Include parameter panel showing properties if any are exposed

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the box emitter to
- **direction1** (Vector3) - Minimum direction vector for randomization [default: (0, 1, 0)]
- **direction2** (Vector3) - Maximum direction vector for randomization [default: (0, 1, 0)]
- **minEmitBox** (Vector3) - Minimum corner of the emission box [default: (-0.5, -0.5, -0.5)]
- **maxEmitBox** (Vector3) - Maximum corner of the emission box [default: (0.5, 0.5, 0.5)]

#### Outputs

- **output** (Particle) - The particle system with box emitter applied

#### Special Considerations

Particles spawn at random positions within the box defined by minEmitBox and maxEmitBox. Initial velocity directions are randomized between direction1 and direction2 vectors. Supports both local and world space positioning and respects the emitter's world matrix.

### Cone Shape Block

This emitter creates particles from a cone shape with customizable spread angle and radius range.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Cone Shape block node
> 
> **Filename**: `/img/tools/npe/coneShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a ConeShape block to the graph
> 2. Show the block with all ports visible
> 3. Show properties panel if emitFromSpawnPointOnly property is visible

#### Properties

- **emitFromSpawnPointOnly** (Boolean) - When true, particles emit only from the cone apex instead of the cone surface [default: false]

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the cone emitter to
- **radius** (Float) - Radius of the cone base [default: 1]
- **angle** (Float) - Cone spread angle in radians [default: π (180 degrees)]
- **radiusRange** (Float) - Randomization factor for spawn radius [default: 1, range: 0-1]
- **heightRange** (Float) - Randomization factor for spawn height along cone [default: 1, range: 0-1]
- **directionRandomizer** (Float) - Adds randomness to initial direction [default: 0, range: 0-1]
- **direction1** (Vector3) - Custom direction range minimum (optional)
- **direction2** (Vector3) - Custom direction range maximum (optional)

#### Outputs

- **output** (Particle) - The particle system with cone emitter applied

#### Special Considerations

When emitFromSpawnPointOnly is false, particles spawn along the cone surface. The directionRandomizer is automatically used unless both direction1 and direction2 inputs are connected, which override the automatic direction calculation.

### Cylinder Shape Block

This emitter creates particles from a cylinder surface with proper circular distribution.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Cylinder Shape block node
> 
> **Filename**: `/img/tools/npe/cylinderShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a CylinderShape block to the graph
> 2. Capture showing the block with ports visible

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the cylinder emitter to
- **radius** (Float) - Cylinder radius [default: 1]
- **height** (Float) - Cylinder height [default: 1, min: 0]
- **radiusRange** (Float) - Randomization factor for spawn radius [default: 1, range: 0-1]
- **directionRandomizer** (Float) - Adds randomness to initial direction [default: 0, range: 0-1]
- **direction1** (Vector3) - Custom direction range minimum (optional)
- **direction2** (Vector3) - Custom direction range maximum (optional)

#### Outputs

- **output** (Particle) - The particle system with cylinder emitter applied

#### Special Considerations

Uses a proper spherical distribution algorithm for circular positioning to avoid clustering. Direction is based on surface normals unless custom direction inputs are connected.

### Sphere Shape Block

This emitter creates particles from a spherical surface with optional hemispheric mode.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Sphere Shape block node
> 
> **Filename**: `/img/tools/npe/sphereShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a SphereShape block to the graph
> 2. Show properties panel with isHemispheric option visible

#### Properties

- **isHemispheric** (Boolean) - When true, restricts emission to the top half of the sphere (Y ≥ 0) [default: false]

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the sphere emitter to
- **radius** (Float) - Sphere radius [default: 1]
- **radiusRange** (Float) - Randomization factor for spawn radius [default: 1, range: 0-1]
- **directionRandomizer** (Float) - Adds randomness to initial direction [default: 0, range: 0-1]
- **direction1** (Vector3) - Custom direction range minimum (optional)
- **direction2** (Vector3) - Custom direction range maximum (optional)

#### Outputs

- **output** (Particle) - The particle system with sphere emitter applied

#### Special Considerations

Uses proper spherical distribution with polar coordinates (theta/phi) to ensure even particle distribution across the sphere surface. When isHemispheric is enabled, the Y coordinate is forced to absolute value.

### Point Shape Block

This emitter creates particles from a single point with customizable initial direction.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Point Shape block node
> 
> **Filename**: `/img/tools/npe/pointShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a PointShape block to the graph
> 2. Capture showing the minimal block with input/output ports

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the point emitter to
- **direction1** (Vector3) - Minimum direction vector for randomization [default: (0, 1, 0)]
- **direction2** (Vector3) - Maximum direction vector for randomization [default: (0, 1, 0)]

#### Outputs

- **output** (Particle) - The particle system with point emitter applied

#### Special Considerations

This is the simplest emitter block. All particles spawn at the emitter origin (position is always at emitter's position). Only controls initial direction which is randomized between direction1 and direction2.

### Mesh Shape Block

This emitter creates particles from a mesh surface using random triangles with barycentric interpolation.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Mesh Shape block node
> 
> **Filename**: `/img/tools/npe/meshShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a MeshShape block to the graph
> 2. Show properties panel with mesh-related options visible

#### Properties

- **useMeshNormalsForDirection** (Boolean) - Use vertex normals from the mesh for particle initial direction [default: false]
- **useMeshColorForColor** (Boolean) - Use vertex colors from the mesh for particle colors [default: false]
- **serializedCachedData** (Boolean) - Include cached mesh data in serialization for offline use [default: false]
- **worldSpace** (Boolean) - Apply mesh world transform matrix to particle positions [default: true]

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the mesh emitter to
- **direction1** (Vector3) - Fallback minimum direction if not using mesh normals
- **direction2** (Vector3) - Fallback maximum direction if not using mesh normals

#### Outputs

- **output** (Particle) - The particle system with mesh emitter applied

#### Special Considerations

Caches vertex positions, normals, and color data from the source mesh for efficient sampling. Uses barycentric coordinates to smoothly distribute particles across triangle surfaces. The cached data can be serialized for offline use. Call `cleanData()` method to remove cached mesh data when no longer needed.

### Custom Shape Block

This emitter allows complete control over particle emission using custom user-defined generator functions.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Custom Shape block node
> 
> **Filename**: `/img/tools/npe/customShapeNode.jpg`
> 
> **Instructions**:
> 1. Add a CustomShape block to the graph
> 2. Capture the block showing it's ready for custom code

#### Properties (Assignable Functions)

These properties are assigned via code, not through the UI:

- **particlePositionGenerator** - Custom function to generate particle positions
  - Signature: `(index: number, particle: Particle | null, outPosition: Vector3) => void`
- **particleDestinationGenerator** - Custom function to generate particle destination positions
  - Signature: `(index: number, particle: Particle | null, outPosition: Vector3) => void`
- **particleDirectionGenerator** - Custom function to generate particle initial directions
  - Signature: `(index: number, particle: Particle | null, outPosition: Vector3) => void`

#### Inputs

- **particle** (Particle) - **Required**. The particle system to apply the custom emitter to

#### Outputs

- **output** (Particle) - The particle system with custom emitter applied

#### Special Considerations

Provides maximum flexibility for custom emission behavior. If particleDestinationGenerator is provided without particleDirectionGenerator, particle direction is automatically calculated from the destination and lifetime. These functions must be assigned programmatically in your code.

### Setup Sprite Sheet Block

This block configures sprite sheet animation for particles, enabling animated sprite effects.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Setup Sprite Sheet block node
> 
> **Filename**: `/img/tools/npe/setupSpriteSheetNode.jpg`
> 
> **Instructions**:
> 1. Add a SetupSpriteSheet block to the graph
> 2. Show the block with visible input ports for sprite configuration

#### Inputs

- **particle** (Particle) - **Required**. The particle system to configure sprite sheets for
- **spriteCellWidth** (Int) - Width of each sprite cell in pixels
- **spriteCellHeight** (Int) - Height of each sprite cell in pixels
- **startSpriteCellID** (Int) - Starting sprite cell index for animation [default: 0]
- **endSpriteCellID** (Int) - Ending sprite cell index for animation
- **spriteCellChangeSpeed** (Float) - Speed of sprite animation (cells per second)
- **spriteCellLoop** (Boolean) - Whether sprite animation should loop [default: true]
- **spriteRandomStartCell** (Boolean) - Randomize starting cell for each particle [default: false]

#### Outputs

- **output** (Particle) - The particle system with sprite sheet configured

#### Special Considerations

Used in conjunction with a texture input on the System block. The texture should contain a sprite sheet (grid of sprite frames). Particles will animate through the sprite cells based on the change speed. Looping can be disabled for one-shot animations.

## Update Blocks

Update blocks modify particle properties during their lifetime. They are placed between emitter blocks and the System block to create dynamic particle behaviors. Update blocks execute every frame for each active particle, allowing properties like color, size, position, and rotation to change over time.

Multiple update blocks can be chained together to create complex behaviors. The order matters - blocks execute in the order they are connected.

### Update Age Block

Updates the age of particles during simulation.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Age block node
> 
> **Filename**: `/img/tools/npe/updateAgeNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateAge block to the graph
> 2. Capture showing the block with input/output ports

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **age** (Float) - **Required to activate**. New age value to set for particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

This block only executes if the age input is connected. It allows manual control over particle age, which can be used to create custom lifetime behaviors or synchronize particles with external timers.

### Update Color Block

Dynamically updates particle color during simulation, overriding the default color interpolation.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Color block node
> 
> **Filename**: `/img/tools/npe/updateColorNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateColor block to the graph
> 2. Show it connected to a gradient or other color source
> 3. Capture showing the block in context with color flow

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **color** (Color4) - **Required to activate**. New color value to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Bypasses the default color interpolation between color and colorDead set in the CreateParticle block. Useful for creating dynamic color effects based on gradients, noise, or other procedural sources. Only executes if the color input is connected.

### Update Position Block

Updates particle position during simulation, allowing complete control over particle motion.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Position block node
> 
> **Filename**: `/img/tools/npe/updatePositionNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdatePosition block to the graph
> 2. Capture showing input/output ports

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **position** (Vector3) - **Required to activate**. New position to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Directly overwrites particle position, bypassing default velocity-based movement. Only executes if the position input is connected. Can be used for completely custom particle paths or to constrain particles to specific surfaces.

### Update Size Block

Updates particle size during simulation for dynamic scaling effects.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Size block node
> 
> **Filename**: `/img/tools/npe/updateSizeNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateSize block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **size** (Float) - **Required to activate**. New size value to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Scalar size adjustment that affects particle scale uniformly. Only executes if the size input is connected. Commonly used with gradients to fade particles in/out or pulse based on lifetime.

### Update Angle Block

Updates particle rotation angle during simulation.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Angle block node
> 
> **Filename**: `/img/tools/npe/updateAngleNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateAngle block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **angle** (Float) - **Required to activate**. New rotation angle in radians to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Controls 2D sprite rotation around the billboard axis. Only executes if the angle input is connected. Useful for spinning particles or aligning particles with their direction of motion.

### Update Direction Block

Updates particle direction/velocity during simulation.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Direction block node
> 
> **Filename**: `/img/tools/npe/updateDirectionNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateDirection block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **direction** (Vector3) - **Required to activate**. New direction vector to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Overwrites particle velocity direction. Only executes if the direction input is connected. Can be used to create wind effects, vortices, or attraction/repulsion behaviors when combined with math blocks.

### Update Scale Block

Updates particle scale with separate control over X and Y dimensions.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Scale block node
> 
> **Filename**: `/img/tools/npe/updateScaleNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateScale block to the graph
> 2. Capture showing the block with Vector2 or separate scalar inputs

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **scale** (Vector2) - **Required to activate**. New scale value (X, Y) to apply to particles

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Provides independent control over horizontal and vertical scaling, allowing particles to stretch or squash. Useful for creating motion blur effects or non-uniform particle shapes.

### Update Sprite Cell Index Block

Updates which sprite cell is displayed for particles with sprite sheet textures.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Sprite Cell Index block node
> 
> **Filename**: `/img/tools/npe/updateSpriteCellIndexNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateSpriteCellIndex block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **cellIndex** (Float) - **Required to activate**. New sprite cell index to display

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Overrides the automatic sprite animation from SetupSpriteSheet block, allowing manual control over which sprite frame is displayed. Useful for creating custom animation patterns or synchronizing sprite animation with other particle properties.

### Update Attractor Block

Applies attraction or repulsion forces to particles toward/away from a target point.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Attractor block node
> 
> **Filename**: `/img/tools/npe/updateAttractorNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateAttractor block to the graph
> 2. Show properties panel with attractor settings

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **strength** (Float) - Force strength (positive = attract, negative = repel) [default: 1]
- **position** (Vector3) - Target position for attraction/repulsion

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Creates gravitational-like effects where particles are pulled toward or pushed away from a point. Strength can be negative for repulsion. Combines with existing particle velocity rather than replacing it.

### Update Noise Block

Applies procedural noise to particle positions or velocities for organic randomness.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Noise block node
> 
> **Filename**: `/img/tools/npe/updateNoiseNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateNoise block to the graph
> 2. Show properties panel with noise parameters

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **strength** (Float) - Noise intensity [default: 1]
- **frequency** (Float) - Noise frequency/scale [default: 1]

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Uses procedural noise algorithms to add natural-looking randomness to particle motion. Higher frequency creates more chaotic movement, while higher strength increases displacement magnitude. Useful for smoke, fire, and magical effects.

### Update Flow Map Block

Applies a flow map texture to control particle movement, creating flowing or swirling patterns.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Flow Map block node
> 
> **Filename**: `/img/tools/npe/updateFlowMapNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateFlowMap block to the graph
> 2. Show with texture input connected

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **flowMap** (Texture) - Flow map texture where RGB values encode direction
- **strength** (Float) - Flow map influence strength [default: 1]

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Reads RGB values from the flow map texture to determine particle movement direction. Red and Green channels typically encode XY direction, Blue can encode Z direction or strength. Useful for creating water flow, wind fields, or guided particle paths.

### Update Remap Block

Remaps particle properties from one value range to another, useful for normalizing or scaling values.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Update Remap block node
> 
> **Filename**: `/img/tools/npe/updateRemapNode.jpg`
> 
> **Instructions**:
> 1. Add an UpdateRemap block to the graph
> 2. Show properties panel with input/output ranges

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **input** (Float) - Value to remap
- **inputMin** (Float) - Input range minimum [default: 0]
- **inputMax** (Float) - Input range maximum [default: 1]
- **outputMin** (Float) - Output range minimum [default: 0]
- **outputMax** (Float) - Output range maximum [default: 1]

#### Outputs

- **output** (Float) - Remapped value

#### Special Considerations

Linear interpolation from input range to output range. Commonly used to convert normalized values (0-1) to specific ranges needed by other blocks, or to invert ranges. Can be chained with other update blocks for complex value transformations.

### Basic Color Update Block

Simplified color update with basic interpolation support.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Basic Color Update block node
> 
> **Filename**: `/img/tools/npe/basicColorUpdateNode.jpg`
> 
> **Instructions**:
> 1. Add a BasicColorUpdate block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **color** (Color4) - Target color value

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Simpler alternative to UpdateColor block for basic color changes. Provides straightforward color assignment without complex logic.

### Basic Position Update Block

Simplified position update for basic motion control.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Basic Position Update block node
> 
> **Filename**: `/img/tools/npe/basicPositionUpdateNode.jpg`
> 
> **Instructions**:
> 1. Add a BasicPositionUpdate block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **position** (Vector3) - Target position value

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Simpler alternative to UpdatePosition block for basic position changes without complex calculations.

### Basic Sprite Update Block

Simplified sprite animation control.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Basic Sprite Update block node
> 
> **Filename**: `/img/tools/npe/basicSpriteUpdateNode.jpg`
> 
> **Instructions**:
> 1. Add a BasicSpriteUpdate block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update
- **cellIndex** (Float) - Sprite cell index

#### Outputs

- **output** (Particle) - The updated particle stream

#### Special Considerations

Simplified sprite cell control for basic sprite sheet animation without complex timing logic.

### Align Angle Block

Automatically aligns particle rotation to match their direction of movement.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Align Angle block node
> 
> **Filename**: `/img/tools/npe/alignAngleNode.jpg`
> 
> **Instructions**:
> 1. Add an AlignAngle block to the graph
> 2. Capture showing the block

#### Inputs

- **particle** (Particle) - **Required**. The particle stream to update

#### Outputs

- **output** (Particle) - The updated particle stream with aligned angles

#### Special Considerations

Calculates rotation angle from particle velocity direction. Useful for making elongated particles (sparks, streaks) point in their direction of travel. Works best with STRETCHED billboard mode.

## Input Blocks

Input blocks provide constant values or contextual data to other blocks in the graph. They are the source of numeric values, colors, vectors, and textures that drive particle behavior.

### Input Block

Provides constant or variable input values that can be accessed from code.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Input block node showing different types (Float, Vector3, Color)
> 
> **Filename**: `/img/tools/npe/inputNode.jpg`
> 
> **Instructions**:
> 1. Add several Input blocks of different types (Float, Vector3, Color4)
> 2. Capture showing the variety of input types available
> 3. Show properties panel with value editor

#### Properties

- **type** - Data type of the input (Float, Int, Vector2, Vector3, Vector4, Color3, Color4, Matrix)
- **value** - The constant value (editable in properties panel)
- **min/max** - Optional range constraints for numeric types
- **isBoolean** - Whether a numeric input represents a boolean value

#### Outputs

- **output** - The value in the specified type

#### Special Considerations

Input blocks can be named and accessed from code to dynamically change values at runtime. Essential for creating configurable particle systems where parameters can be adjusted programmatically.

## Math and Utility Blocks

Math blocks perform calculations and transformations on values flowing through the graph. They enable complex particle behaviors through combinations of operations.

### Clamp Block

Constrains a value to a specified range.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Clamp block node
> 
> **Filename**: `/img/tools/npe/clampNode.jpg`
> 
> **Instructions**:
> 1. Add a Clamp block to the graph
> 2. Capture showing input ports for value, min, and max

#### Inputs

- **value** (Float or Vector) - Value to clamp
- **min** (Float or Vector) - Minimum allowed value [default: 0]
- **max** (Float or Vector) - Maximum allowed value [default: 1]

#### Outputs

- **output** - Clamped value (same type as input)

#### Special Considerations

Supports both scalar and vector clamping. Vector clamp operates component-wise. Useful for preventing values from exceeding safe ranges or normalizing data.

### Lerp Block

Linear interpolation between two values based on a gradient factor.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Lerp block node
> 
> **Filename**: `/img/tools/npe/lerpNode.jpg`
> 
> **Instructions**:
> 1. Add a Lerp block to the graph
> 2. Show with connections demonstrating interpolation between two values

#### Inputs

- **left** (Float, Vector, or Color) - Start value
- **right** (Float, Vector, or Color) - End value
- **gradient** (Float) - Interpolation factor [0 = left, 1 = right]

#### Outputs

- **output** - Interpolated value (same type as inputs)

#### Special Considerations

Works with multiple types including Float, Vector3, Vector4, Color3, and Color4. At gradient = 0, outputs left value; at gradient = 1, outputs right value. Values between 0 and 1 blend proportionally.

### NLerp Block

Normalized linear interpolation, useful for vectors and quaternions.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: NLerp block node
> 
> **Filename**: `/img/tools/npe/nlerpNode.jpg`
> 
> **Instructions**:
> 1. Add an NLerp block to the graph
> 2. Capture showing the block

#### Inputs

- **left** (Vector) - Start vector
- **right** (Vector) - End vector
- **gradient** (Float) - Interpolation factor [0-1]

#### Outputs

- **output** - Normalized interpolated vector

#### Special Considerations

Performs linear interpolation and then normalizes the result. More efficient than spherical interpolation for vectors when approximate results are acceptable. Commonly used for direction vectors.

### Math Block

Performs basic arithmetic operations on vectors.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Math block node
> 
> **Filename**: `/img/tools/npe/mathNode.jpg`
> 
> **Instructions**:
> 1. Add a Math block to the graph
> 2. Show properties panel with operation selection (Add, Subtract, Multiply, Divide, etc.)

#### Properties

- **operation** - Mathematical operation: Add, Subtract, Multiply, Divide, Scale, Min, Max, etc.

#### Inputs

- **left** (Vector) - First operand
- **right** (Vector) - Second operand

#### Outputs

- **output** (Vector) - Result of the operation

#### Special Considerations

Supports vector arithmetic operations. Useful for combining forces, scaling values, or creating complex motion patterns through math.

### Number Math Block

Performs arithmetic operations on scalar numeric values.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Number Math block node
> 
> **Filename**: `/img/tools/npe/numberMathNode.jpg`
> 
> **Instructions**:
> 1. Add a NumberMath block to the graph
> 2. Show properties panel with operation selection

#### Properties

- **operation** - Mathematical operation: Add, Subtract, Multiply, Divide, Pow, Min, Max, Mod, etc.

#### Inputs

- **left** (Float) - First operand
- **right** (Float) - Second operand

#### Outputs

- **output** (Float) - Result of the operation

#### Special Considerations

Scalar version of the Math block. Essential for value manipulation, combining parameters, and creating custom formulas.

### Random Block

Generates random values within a specified range.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Random block node
> 
> **Filename**: `/img/tools/npe/randomNode.jpg`
> 
> **Instructions**:
> 1. Add a Random block to the graph
> 2. Show properties panel with min/max range inputs

#### Inputs

- **min** (Float or Vector) - Minimum random value [default: 0]
- **max** (Float or Vector) - Maximum random value [default: 1]

#### Outputs

- **output** - Random value between min and max (same type as inputs)

#### Special Considerations

Generates a new random value each time it's evaluated. Supports both scalar and vector randomization. Vector randomization operates component-wise. Essential for creating variation in particle systems.

### Gradient Block

Samples a color gradient based on an input value.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Gradient block node
> 
> **Filename**: `/img/tools/npe/gradientNode.jpg`
> 
> **Instructions**:
> 1. Add a Gradient block to the graph
> 2. Show properties panel with gradient editor
> 3. Demonstrate a multi-stop gradient

#### Properties

- **gradient** - Color gradient definition with multiple color stops

#### Inputs

- **gradient** (Float) - Position in gradient to sample [0-1]

#### Outputs

- **output** (Color4) - Sampled color from gradient

#### Special Considerations

Gradient editor allows multiple color stops with adjustable positions. Colors are interpolated smoothly between stops. Commonly used with particle age/lifetime for color fade effects.

### Gradient Value Block

Samples a numeric gradient curve based on an input value.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Gradient Value block node
> 
> **Filename**: `/img/tools/npe/gradientValueNode.jpg`
> 
> **Instructions**:
> 1. Add a GradientValue block to the graph
> 2. Show properties panel with curve editor

#### Properties

- **gradient** - Value gradient curve with multiple value stops

#### Inputs

- **gradient** (Float) - Position in gradient to sample [0-1]

#### Outputs

- **output** (Float) - Sampled value from gradient

#### Special Considerations

Similar to Gradient block but outputs numeric values instead of colors. Useful for creating custom animation curves for size, speed, or other numeric properties over particle lifetime.

### Smooth Step Block

Performs smooth Hermite interpolation between two values.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Smooth Step block node
> 
> **Filename**: `/img/tools/npe/smoothStepNode.jpg`
> 
> **Instructions**:
> 1. Add a SmoothStep block to the graph
> 2. Capture showing input ports

#### Inputs

- **value** (Float) - Input value to interpolate
- **edge0** (Float) - Lower edge of transition [default: 0]
- **edge1** (Float) - Upper edge of transition [default: 1]

#### Outputs

- **output** (Float) - Smoothly interpolated value [0-1]

#### Special Considerations

Creates smooth S-curve transitions between 0 and 1 as value moves from edge0 to edge1. More natural-looking than linear interpolation for fades and transitions. Values outside edges are clamped to 0 or 1.

### Step Block

Generates a step function that outputs 0 or 1 based on a threshold.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Step block node
> 
> **Filename**: `/img/tools/npe/stepNode.jpg`
> 
> **Instructions**:
> 1. Add a Step block to the graph
> 2. Capture showing input ports

#### Inputs

- **value** (Float) - Value to test against edge
- **edge** (Float) - Threshold value [default: 0.5]

#### Outputs

- **output** (Float) - 0 if value < edge, 1 if value >= edge

#### Special Considerations

Creates hard transitions without interpolation. Useful for binary decisions, triggers, or creating discrete states in particle behavior.

### Fresnel Block

Calculates Fresnel effect based on view angle, useful for rim lighting or edge glow effects.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Fresnel block node
> 
> **Filename**: `/img/tools/npe/fresnelNode.jpg`
> 
> **Instructions**:
> 1. Add a Fresnel block to the graph
> 2. Show properties with bias, power, and intensity parameters

#### Properties

- **bias** - Fresnel bias value [default: 0]
- **power** - Fresnel power/falloff [default: 1]

#### Inputs

- **bias** (Float) - Fresnel bias (optional override)
- **power** (Float) - Fresnel power (optional override)

#### Outputs

- **output** (Float) - Fresnel value [0-1]

#### Special Considerations

Calculates how much a surface faces the camera. Higher values at edges, lower values when facing camera directly. Useful for rim lighting effects, edge glow, or transparency based on viewing angle.

### Converter Block

Converts between different vector and color types.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Converter block node
> 
> **Filename**: `/img/tools/npe/converterNode.jpg`
> 
> **Instructions**:
> 1. Add a Converter block to the graph
> 2. Show properties panel with conversion type selection

#### Properties

- **conversionType** - Type of conversion to perform (e.g., Vector3 to Color3, Color4 to Vector4, etc.)

#### Inputs

- **input** - Value to convert (type varies based on conversion)

#### Outputs

- **output** - Converted value (type varies based on conversion)

#### Special Considerations

Enables mixing vector math and color operations. Common conversions include Vector3 ↔ Color3, Vector4 ↔ Color4. Component mapping is typically X→R, Y→G, Z→B, W→A.

### Float To Int Block

Converts floating-point values to integers.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Float To Int block node
> 
> **Filename**: `/img/tools/npe/floatToIntNode.jpg`
> 
> **Instructions**:
> 1. Add a FloatToInt block to the graph
> 2. Capture showing the simple conversion block

#### Inputs

- **input** (Float) - Float value to convert

#### Outputs

- **output** (Int) - Integer value (truncated)

#### Special Considerations

Truncates decimal portion. Use with Math blocks for rounding behaviors (add 0.5 before conversion for round-to-nearest). Useful for sprite cell indices or discrete parameter values.

### Trigonometry Block

Performs trigonometric operations (sin, cos, tan, etc.).

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Trigonometry block node
> 
> **Filename**: `/img/tools/npe/trigonometryNode.jpg`
> 
> **Instructions**:
> 1. Add a Trigonometry block to the graph
> 2. Show properties panel with operation selection (Sin, Cos, Tan, Asin, Acos, Atan, etc.)

#### Properties

- **operation** - Trigonometric function: Sin, Cos, Tan, Asin, Acos, Atan, Abs, Sqrt, Floor, Ceiling, Fract, etc.

#### Inputs

- **input** (Float) - Input angle (in radians for trig functions) or value (for other operations)

#### Outputs

- **output** (Float) - Result of the trigonometric or mathematical operation

#### Special Considerations

Angles are in radians. Includes both trigonometric and other mathematical functions like absolute value, square root, floor, ceiling, and fractional part. Useful for creating wave patterns, circular motion, or oscillations.

### Vector Length Block

Calculates the length (magnitude) of a vector.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Vector Length block node
> 
> **Filename**: `/img/tools/npe/vectorLengthNode.jpg`
> 
> **Instructions**:
> 1. Add a VectorLength block to the graph
> 2. Capture showing the block

#### Inputs

- **input** (Vector) - Vector to measure

#### Outputs

- **output** (Float) - Length/magnitude of the vector

#### Special Considerations

Calculates the Euclidean distance from origin. Useful for speed calculations, distance checks, or normalizing combined with division. Works with Vector2, Vector3, and Vector4.

### Vector Math Block

Performs vector-specific operations like dot product, cross product, and normalize.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Vector Math block node
> 
> **Filename**: `/img/tools/npe/vectorMathNode.jpg`
> 
> **Instructions**:
> 1. Add a VectorMath block to the graph
> 2. Show properties panel with operation selection

#### Properties

- **operation** - Vector operation: Dot, Cross, Normalize, Length, Distance, Reflect, etc.

#### Inputs

- **left** (Vector) - First vector operand
- **right** (Vector) - Second vector operand (for operations requiring two inputs)

#### Outputs

- **output** - Result (type varies: Float for dot/length/distance, Vector for others)

#### Special Considerations

Essential for advanced vector calculations. Dot product useful for angle calculations. Cross product creates perpendicular vectors. Normalize creates unit vectors. Distance calculates separation between points.

### Source Texture Block

Provides a texture that can be used as input to other blocks.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Source Texture block node
> 
> **Filename**: `/img/tools/npe/sourceTextureNode.jpg`
> 
> **Instructions**:
> 1. Add a SourceTexture block to the graph
> 2. Show properties panel with texture selection/URL input
> 3. Capture showing the texture preview if available

#### Properties

- **texture** - Reference to the texture asset (URL or loaded texture)

#### Outputs

- **output** (Texture) - The texture resource

#### Special Considerations

Used to provide textures for the System block, FlowMap blocks, or any other block requiring texture input. Textures can be loaded from URLs or selected from scene assets.

### Local Variable Block

Stores and reuses a value to avoid redundant calculations and improve graph readability.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Local Variable block node
> 
> **Filename**: `/img/tools/npe/localVariableNode.jpg`
> 
> **Instructions**:
> 1. Add a LocalVariable block to the graph
> 2. Show it being used to split one output to multiple inputs
> 3. Capture showing the organizational benefit

#### Inputs

- **input** - Value to store (any type)

#### Outputs

- **output** - The stored value (same type as input)

#### Special Considerations

Acts like a variable in code - stores a value that can be used multiple times. Useful for organizing complex graphs, avoiding duplicate calculations, and improving performance when the same computed value is needed in multiple places.

### Debug Block

Outputs debug information to the console for troubleshooting.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Debug block node
> 
> **Filename**: `/img/tools/npe/debugNode.jpg`
> 
> **Instructions**:
> 1. Add a Debug block to the graph
> 2. Connect it to a value stream
> 3. Show the console output if possible

#### Inputs

- **input** - Value to debug (any type)

#### Outputs

- **output** - Pass-through of input value (same type)

#### Special Considerations

Logs the input value to the console without affecting the particle system. The value passes through unchanged, allowing debug blocks to be inserted anywhere in the flow for inspection. Useful for verifying calculations and tracking down issues in complex graphs.

### Elbow Block

Organizational block that helps route wires for better graph readability. No functional impact.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Elbow block node
> 
> **Filename**: `/img/tools/npe/elbowBlockNode.jpg`
> 
> **Instructions**:
> 1. Create a graph with crossing wires
> 2. Add Elbow blocks to organize the wires
> 3. Show before/after comparison of wire organization

#### Inputs

- **input** - Value to pass through (any type)

#### Outputs

- **output** - Same value as input (same type)

#### Special Considerations

Purely organizational - has no effect on particle behavior. Simply passes values through while allowing wires to be bent and routed for clarity. Can be quickly added to wires by option/alt-clicking on a wire.

## Condition Blocks

Condition blocks enable branching logic in particle systems, allowing different behaviors based on conditional tests.

### Particle Condition Block

Evaluates a condition and outputs different values based on the result.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Particle Condition block node
> 
> **Filename**: `/img/tools/npe/particleConditionNode.jpg`
> 
> **Instructions**:
> 1. Add a ParticleCondition block to the graph
> 2. Show properties panel with condition type selection (Equal, NotEqual, GreaterThan, etc.)
> 3. Show with true/false branches connected

#### Properties

- **conditionType** - Type of comparison: Equal, NotEqual, LessThan, LessOrEqual, GreaterThan, GreaterOrEqual, Xor, Or, And

#### Inputs

- **a** (Float) - First comparison value
- **b** (Float) - Second comparison value
- **true** - Value output when condition is true (any type)
- **false** - Value output when condition is false (same type as true)

#### Outputs

- **output** - Either the true or false value based on condition result

#### Special Considerations

Enables conditional logic in particle systems. The true and false inputs must be the same type. The output type matches the true/false input type. Useful for creating particles that behave differently based on age, position, or other properties.

## Trigger Blocks

Trigger blocks enable sub-emitter functionality and particle spawning based on events.

### Particle Trigger Block

Triggers actions or sub-emitters based on particle events like death or collision.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Particle Trigger block node
> 
> **Filename**: `/img/tools/npe/particleTriggerNode.jpg`
> 
> **Instructions**:
> 1. Add a ParticleTrigger block to the graph
> 2. Show properties panel with trigger event selection
> 3. Show connected to both particle stream and trigger output

#### Properties

- **triggerType** - Event that causes trigger: OnDeath, OnBirth, EveryFrame, etc.

#### Inputs

- **particle** (Particle) - The particle stream to monitor

#### Outputs

- **output** (Particle) - Pass-through of input particles
- **trigger** - Trigger signal when event occurs

#### Special Considerations

Enables sub-emitters - new particle systems spawned based on particle events. Common use: spawn explosion particles when a projectile particle dies. The trigger output connects to another CreateParticle or System block's trigger input.

## Teleport Blocks

Teleport blocks allow non-linear flow in the graph, creating jump points for wire organization and reusable sub-graphs.

### Particle Teleport Out Block

Creates an exit point that teleports data to a corresponding Teleport In block.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Particle Teleport Out block node
> 
> **Filename**: `/img/tools/npe/particleTeleportOutNode.jpg`
> 
> **Instructions**:
> 1. Add a ParticleTeleportOut block to the graph
> 2. Show properties panel with teleport name/ID
> 3. Capture showing it as an organizational tool

#### Properties

- **name** - Identifier for this teleport point (must match a Teleport In block)

#### Inputs

- **input** - Value to teleport (any type)

#### Outputs

None - value appears at matching Teleport In block

#### Special Considerations

Reduces wire clutter by allowing data to "jump" across the graph. Must have a matching Teleport In block with the same name. Useful for organizing complex graphs or creating reusable sub-graphs. The data type is preserved through the teleport.

### Particle Teleport In Block

Receives data from a corresponding Teleport Out block.

> **[SCREENSHOT PLACEHOLDER]**
> 
> **What to capture**: Particle Teleport In block node
> 
> **Filename**: `/img/tools/npe/particleTeleportInNode.jpg`
> 
> **Instructions**:
> 1. Add a ParticleTeleportIn block to the graph
> 2. Show properties panel with teleport name/ID matching a Teleport Out
> 3. Show the pair working together to jump across the graph

#### Properties

- **name** - Identifier that matches a Teleport Out block

#### Inputs

None - receives value from matching Teleport Out block

#### Outputs

- **output** - Value received from matching Teleport Out (same type as teleported value)

#### Special Considerations

Must have a matching Teleport Out block with the same name. The output type matches the input type of the corresponding Teleport Out. Multiple Teleport In blocks can receive from the same Teleport Out, effectively duplicating the data stream.

---

## Tips for Using Blocks Effectively

1. **Start Simple** - Begin with a CreateParticle → Emitter → System flow, then add complexity
2. **Use Frames** - Group related blocks in frames for organization, especially complex update chains
3. **Test Incrementally** - Add blocks one at a time and check the preview to understand each effect
4. **Leverage Gradients** - Use Gradient and GradientValue blocks with particle age for smooth transitions
5. **Combine Updates** - Chain multiple update blocks for complex behaviors (e.g., Color → Size → Position)
6. **Debug Often** - Use Debug blocks to verify values are in expected ranges
7. **Optimize with Teleports** - Use Teleport blocks to reduce wire clutter in complex graphs
8. **Save Custom Frames** - Export useful block combinations as custom frames for reuse
9. **Name Everything** - Give blocks meaningful names for easier debugging and code access
10. **Check Console** - Always monitor the console for errors about missing connections or invalid values
