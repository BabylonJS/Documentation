---
title: Available Node Material Blocks
image-url: /img/defaultImage.png
description: The Node Material is a simple, highly customizable material that you can build yourself piece by piece. Combined with the powerful node-based editor, you can easily create stunning custom GPU shaders and FX for your Babylon.js scenes.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor
further-reading:
video-overview:
video-content:
---

Here is the default list of Node Material Blocks available to use.

## Animation
### Bones
Provides a world matrix for each vertex, based on skeletal (bone/joint) animation.
    -   Inputs:
        -   matricesIndices: Vector4
        -   matricesWeights: Vector4
        -   matricesIndicesExtra: Vector4
        -   matricesWeightsExtra: Vector4
        -   world: Matrix
    -   Outputs:
        -   output: Matrix

### MorphTargets
Provides the final positions, normals, tangents, and uvs based on morph targets in a mesh.
    -   Inputs:
        -   position: Vector3
        -   normal: Vector3
        -   tangent: Vector3
        -   uv: Vector2
    -   Outputs:
        -   positionOutput: Vector3
        -   normalOutput: Vector3
        -   tangentOutput: Vetor3
        -   uvOutput: Vector2

## Color Management
### Desaturate
Convert a color input into a grayscale representation.
    -   Inputs:
        -   color: Color3
        -   level: Float
    -   Outputs:
        -   output: Color3

### Gradient
Returns the color in the gradient represented by the target value of the input.
    -   Inputs:
        -   value: Float.
    -   Outputs:
        -   output: Color3.

### Posterize
Reduces the number of values in each channel to the number in the corresponding channel of steps.
    -   Inputs:
        -   value: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   steps: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### ReplaceColor
Outputs the replacement color if the distance between value and reference is less than distance, else outputs the value color.
    -   Inputs:
        -   value: Vector2, Vector3, Vector4, Color3, or Color4.
        -   reference: Vector2, Vector3, Vector4, Color3, or Color4.
        -   distance: Float
        -   replacement: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

Example: <NME id="#98NGSE" title="Replace Color Block Example" description="Simple Replace Color block example."/>

## Conversion
### ColorMerger
Combines float input channels into a color.

    -   Inputs:
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float
    -   Outputs:
        -   rgba: Color4
        -   rgb: Color3

### ColorSplitter
Separates color input channels into individual floats.

    -   Inputs:
        -   rgba: Color4
        -   rgb: Color3
    -   Outputs:
        -   rgb: Color3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float

### VectorMerger
Combines up to four input floats into a vector.

    -   Inputs:
        -   x: Float
        -   y: Float
        -   z: Float
        -   w: Float
    -   Outputs:
        -   xyzw: Vector4
        -   xyz: Vector3
        -   xy: Vector2

### VectorSplitter
Separates vectors input channels into individual floats.
    -   Inputs:
        -   xyzw: Vector4
        -   xyz: Vector3
        -   xy: Vector2
    -   Outputs:
        -   xyz: Vector3
        -   xy: Vector2
        -   x: Float
        -   y: Float
        -   z: Float
        -   w: Float

## Inputs
### BiPlanar
A node for reading a texture with biplanar mapping

    - Inputs:
        - position: Vector3 / Vector4
        - normal: Vector3 / Vector4
        - sharpness: Float
        - source: an ImageSource block (optional)
        - sourceY: an ImageSource block (optional)
    -   Output:
        -   rgba: Vector4
        -   rgb: Vector3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float
        -   level: Float

### Color3
A color made up of red, green, and blue channel values.

    -   Output:
        -   output: Color3

### Color4
A color made up of red, green, blue, and alpha channel values.

    -   Output:
        -   output: Color4

### DeltaTime
A float representing the time that has passed since the last frame was rendered.

    -   Output:
        -   output: Float

### Float
A floating point number representing a value with a fractional component.

    -   Output:
        -   output: Float

### FragCoord
The gl_FragCoord predefined variable (window relative coordinates (x,y,z,1/w))

    -   Output:
        -   xy: Vector2
        -   xyz: Vector3
        -   xyzw: Vector4
        -   x: Float
        -   y: Float
        -   z: Float
        -   w: Float

### ImageSource
A node for reading an embedded or linked image that can be shared across several Texture nodes.

    -   Output:
        -   Source: Can only be used as an input on a Texture block or any other block allowing an ImageSource as input

### MaterialAlpha
A float representing the alpha value of the material.
    -   Output: Float

### ReflectionTexture
Creates a reflection from the input texture.

    -   Input:
        -   position: Vector3
        -   worldPosition: Vector4
        -   worldNormal: Vector4
        -   world: Matrix
        -   cameraPosition: Vector3
        -   view: Matrix
    -   Output:
        -   rgb: Color3
        -   r: Float
        -   g: Float
        -   b: Float

### ScreenSize
The size of the screen window

    -   Output:
        -   xy: Vector2
        -   x: Float
        -   y: Float

### Texture
A node for reading a linked or embedded texture file.

    -   Inputs:
        -   uv: Vector2 (mesh.uv automatically attached).
        -   source: an ImageSource
    -   Outputs:
        -   rgba: Vector4
        -   rgb: Vector3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float
        -   level: Float

### Time
A float value that represents the time that has passed since the scene was loaded.

    -   Output:
        -   output: Float

### TriPlanar
A node for reading a texture with triplanar mapping

    - Inputs:
        - position: Vector3 / Vector4
        - normal: Vector3 / Vector4
        - sharpness: Float
        - source: an ImageSource block (optional)
        - sourceY: an ImageSource block (optional)
        - sourceZ: an ImageSource block (optional)
    -   Output:
        -   rgba: Vector4
        -   rgb: Vector3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float
        -   level: Float

### Vector2
a vector composed of X and Y channels.

    -   Output:
        -   output: Vector2

### Vector3
a vector composed of X, Y, and Z channels.

    -   Output:
        -   output: Vector3

### Vector4
a vector composed of X, Y, Z, and W channels.
    -   Output:
        -   output: Vector4

## Interpolation
### Lerp
Outputs a value that is a mix of the left and right inputs based on the target value.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4
        -   gradient: Float
    -   Output:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on left and right input types.

### NLerp
Outputs a value that is a mix of the left and right inputs based on the target's normalized value.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4
        -   gradient: Float
    -   Output:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on left and right input types.

### SmoothStep
Outputs a value based on a the input value's position on a curve between the two edge values.

    -   Inputs:
        -   value: Float
        -   edge0: Float
        -   edge1: Float
    -   Output:
        -   output: Float

### Step
Outputs 1 for any input value above the edge input, outputs 0 for any input value below the edge input.

    -   Input:
        -   value: Float
        -   edge: Float
    -   Output:
        -   output: Float

## Logical
### And
If both inputs are non-zero values the block evaluates true, otherwise it evaluates false.

    -   Inputs:
        -   a: Float
        -   b: Float
        -   true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -   Outputs:
        -   output: Float

### Equal
If both inputs are equal the block evaluates true, otherwise it evaluates false.

    -   Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### GreaterOrEqual
If input a is greater or equal to input b the block evaluates true, otherwise it evaluates false.

    -   Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### GreaterThan
If input a is greater than input b the block evaluates true, otherwise it evaluates false.

    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### LessOrEqual
If input a is less than or equal to input b the block evaluates true, otherwise it evaluates false.

    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### LessThan
If input a is less than input b the block evaluates true, otherwise it evaluates false.

    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### NotEqual
If input a not equal to input b the block evaluates true, otherwise it evaluates false.

    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### Or
If either input is a non-zero value the block evaluates true, otherwise it evaluates false.

    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

### Xor
if input a and input b are both a value of zero the block evaluates false, otherwise it evaluates true.
    
    -	Inputs:
        -	a: Float
        -	b: Float
        -	true: Float, Vector2, Vector3, Vector4, Color3, Color4
    -	Outputs:
        -	output: Float

## Math: Standard
### Add
Adds the left and right inputs of the same type together.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Divide
Divides the left input by the right input of the same type.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Max
Outputs the largest value between the left and right inputs of the same type.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Min
Outputs the smallest value between the left and right inputs of the same type.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Mod
Outputs the value of the left input modulo the right input

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Multiply
Multiplies the left and right inputs of the same type together.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Negate
Multiplies the input by -1.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### OneMinus
Subtracts each channel of the input value from 1 (1 - input).

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Reciprocal
Quotient of 1 divided by the input.

    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Scale
Multiplies the input channels by a float factor.

    -   Inputs:
        -   Input: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   Factor: Float
    -   Output:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Sign
Returns 1 if the input is positive, 0 if input is equal to 0, or -1 if the input is negative.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Sqrt
Outputs the the square root of the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Subtract
Subtracts the right input from the left input of the same type.
    -   Inputs:
        -   left: Float, Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

## Math: Scientific
### Abs
Outputs the absolute value of the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### ArcCos
Outputs the inverse of the cosine value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### ArcSin
Outputs the inverse of the sine value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### ArcTan
Outputs the inverse of the tangent value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### ArcTan2
Outputs the inverse of the tangent value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Cos
Outputs the cosine value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### DegreesToRadians
Converts the input degrees value to radians.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Exp
Outputs the input value multiplied by itself 9 time. (Exponent of 10)

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Exp2
Outputs the input value multiplied by itself 1 time. (Exponent of 2)

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Fract
Outputs only the fractional value of a floating point number.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Log
The logarithmic value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Pow
Outputs the input value multiplied by itself the number of times equal to the power input (Exponent of power)

    -   Input:
        -   value: Float
        -   power: Float
    -   Output:
        -   output: Float

### RadiansToDegrees
Converts the input radians value to degrees.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### SawToothWave
Outputs a sawtooth pattern value between -1 and 1 based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Sin
Outputs the the sine value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### SquareWave
Outputs a stepped pattern value between -1 and 1 based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Tan
Outputs the the tangent value based on the input value.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### TriangleWave
Outputs a sawtooth pattern value between 0 and 1 based on the input value.
    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

## Math: Vector
### Cross
Outputs a vector that is perpendicular to two input vectors.

    -   Inputs:
        -   left: Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Output:
        -   output: Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on left and right input types.

### Derivative
FRAGMENT SHADER ONLY. Provides the rate of change for an input on a given axis (x,y).

    -   Inputs:
        -   input: Float, Vector2, Vector3, Vector4, Color3, or Color4.
    -   Output:
        -   dx: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on left and right input types.
        -   dy: Float, Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on left and right input types.

### Distance
Provides a distance vector based on the left and right input vectors.

    -   Inputs:
        -   left: Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Dot
Outputs the cos of the angle between two vectors.

    -   Inputs:
        -   left: Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Output:
        -   output: Float

### Fresnel
Outputs the grazing angle of the surface of the mesh, relative to a camera influenced by the bias and power inputs.

    -   Input:
        -   worldNormal: Vector4
        -   viewDirection: Vector3
        -   bias: Float
        -   power: Float
    -   Output:
        -   fresnel: Float

### Length
Outputs the length of an input vector.

    -   Inputs:
        -   left: Vector2, Vector3, Vector4, Color3, or Color4.
        -   right: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Reflect
Outputs the direction of the input vector reflected across the surface normal.

    -   Inputs:
        -   incident: Vector3
        -   normal: Vector3
    -   Outputs:
        -   output: Vector3

### Refract
Outputs a direction simulating a deflection of the input vector.

    -   Inputs:
        -   incident: Vector3
        -   normal: Vector3
        -   ior: Float
    -   Outputs:
        -   output: Vector3

### Rotate2D
Rotates UV coordinates around the W axis.

    -   Inputs:
        -   input: Vector2
        -   angle: Float
    -   Outputs:
        -   output: Vector2

### ScreenSpace
Converts a world space position into the corresponding XY screen coordinates in a range of -1 to 1.

    -	Inputs:
        -	vector: Vector3, Vector4
        -	worldViewProjection: Matrix
    -	Outputs:
        -	output: Vector2
        -	X: Float
        -	Y: Float

### Transform
Transforms a input vector based on the input matrix.

    -   Inputs:
        -   vector: Vector2, Vector3, Vector4, Color3, or Color4
        -   transform: Matrix
    -   Output:
        -   output: Vector4

### Twirl
Twirls UV coordinates around the W axis

    -	Inputs:
        -	input: Vector2
        -	strength: Float
        -	center: Vector2
        -	offset: Vector2
    -	Outputs:
        -	output: Vector2
        -	X: Float
        -	Y: Float

## Matrices
### Matrix
A 4x4 table of related values.

    -   Output:
        -   output: Matrix

### MatrixBuilder
Creates a custom matrix from four Vector4 inputs.

    -	Inputs:
        -	row0: Vector4
        -	row1: Vector4
        -	row2: Vector4
        -	row3: Vector4
    -	Outputs:
        -	output: Matrix

### ProjectionMatrix
A matrix to remap points in 3D space to 2D plane relative to the screen.

    -   Output:
        -   output: Matrix

### ViewMatrix
A matrix to remap points in 3D space to 2D plane relative to the view of the scene camera.

    -   Output:
        -   output: Matrix

### ViewProjectionMatrix
A matrix to remap points in 3D space to 2D view space before remapping to 2D screen space.

    -   Output:
        -   output: Matrix

### WorldMatrix
A matrix to remap points in 3D local space to 3D world space.

    -   Output:
        -   output: Matrix

### WorldViewMatrix
A matrix to remap points in 3D local space to 3D world space, and ending in 2D camera space.

    -   Output:
        -   output: Matrix

### WorldViewProjectionMatrix
A matrix to remap points in 3D local space to 3D world space, then to 2D camera space, and ending in 2D screen space.
    -   Output:
        -   output: Matrix

## Misc
### Elbow
Passthrough block mostly used to organize your graph.
    -   Input: any type
    -   Output: any type

### ShadowMap
Compute a depth value suitable for shadow map generation
    -   Input:
        -   worldPosition: Vector4
        -   viewProjection: Matrix
        -   worldNormal: Vector3 / Vector4
    -   Output:
        -   depth: Vector3

## Mesh
### Color
Outputs the RGBA color of each vertex in the mesh.

    -   Output:
        -   output: Color4

### FrontFacing
Returns 1 if a mesh triangle faces the normal direction and 0 if it does not.

    -   Outputs:
        -   output: Float

### HeightToNormal
Convert a hight map into a normal map.
    -   Input:
        -   input: Float
        -   worldPosition: Vector3
        -   worldNormal: Vector3
        -   worldTangent: Vector3 / Vector4
    -   Output:
        -   output: Vector4
        -   xyz: Vector3

### InstanceColor
Outputs the RGBA color of each instance.

    -   Output:
        -   output: Color4

### Instances
Provides the world matrix for each instance to apply this material to all instances.

    -   Inputs:
        -   world0: Vector4
        -   world1: Vector4
        -   world2: Vector4
        -   world3: Vector4
        -   world: worldMatrix
    -   Output:
        -   output: Matrix

### MatricesIndices
A Vector4 representing the vertex to bone skinning assignments.

    -   Output:
        -   output: Vector4

### MatricesWeights
A Vector4 representing the vertex to bone skinning weights.

    -   Output:
        -   output: Vector4

### Normal
A Vector3 representing the normal of each vertex of the attached mesh.

    -   Output:
        -   output: Vector3

### NormalBlend
Outputs the result of blending two normal maps together using a per-channel screen.

    -   Input:
        -   normalMap0: Vector3
        -   normalMap1: Vector3
    -   Output:
        -   output: Vector3

### PerturbNormal
Creates high-frequency detail normal vectors based on a normal map, the world position, and world normal.

    -   Input:
        -   worldPosition: Vector4
        -   worldNormal: Vector4
        -   uv: Vector2
        -   normalMap: Color3
        -   strength: Float
    -   Output:
        -   output: Vector4

### Position
A Vector3 representing the position of each vertex of the attached mesh.

    -   Output:
        -   output: Vector3

### Tangent
A Vector3 representing the tangent of each vertex of the attached mesh.

    -   Output:
        -   output: Vector3

### TBN
Creates a TBN matrix from normal, tangent and bitangent vectors.
    -   Input:
        -   normal: Vector3
        -   tangent: Vector4
        -   world: Matrix
    -   Output:
        -   TBN: the TBN matrix
        -   row0: the first row (tangent) of the matrix
        -   row1: the second row (bitangent) of the matrix
        -   row2: the third row (normal) of the matrix

### UV
A Vector2 representing the UV coordinates of each vertex of the attached mesh.

    -   Output:
        -   output: Vector2

### WorldNormal
A Vector4 representing the normal of each vertex of the attached mesh transformed into world space.

    -   Input:
        -   vector: Vector3
        -   transform: Matrix
    -   Output:
        -   output: Vector4

### WorldPosition
A Vector4 representing the position of each vertex of the attached mesh transformed into world space.

    -   Input:
        -   vector: Vector3
        -   transform: Matrix
    -   Output:
        -   output: Vector4

### WorldTangent
A Vector4 representing the tangent of each vertex of the attached mesh transformed into world space.

    -	Inputs:
        -	vector: Vector3
        -	transform: Matrix
    -	Outputs:
        -	output: Vector4
        -	xyz: Vector3

## Noises
### Cloud
Creates a random pattern resembling clouds.

    -   Inputs:
        -   seed: Vector2 or Vector3
        -   chaos: Normalized Vector3
        -   offsetX: Float
        -   offsetY: Float
        -   offsetZ: Float
    -   Output:
        -   output: Float

### RandomNumber
Provides a random number based on an input seed.

    -   Inputs:
        -   seed: Vector2
    -   Output:
        -   output: Float

### SimplexPerlin3D
Creates a type of gradient noise with few directional artifacts.

    -   Inputs:
        -   seed: Vector3
    -   Output:
        -   output: Float

### VoronoiNoise
Creates a random pattern of cells in 2D.

    -	Inputs:
        -	seed: Vector2
        -	offset: Float
        -	density: Float
    -	Outputs:
        -	output: Float
        -	cells: Float

### WorleyNoise3D
Creates a random pattern resembling cells.

    -   Inputs:
        -   seed: Vector3
        -   jitter: Float
    -   Output:
        -   output: Vector2

## Outputs
### ClipPlanes
A node that adds clip planes support.
    -   Input:
        -   worldPosition: Vector4

### Discard
A final node that will not output a pixel below the cutoff value.

    -   Inputs:
        -   value: Float
        -   cutoff: Float

### FragDepth
A final node that sets the fragment depth.
    -   Inputs:
        -   depth: Float
        -   worldPos: Vector4
        -   viewProjection: Matrix

### FragmentOutput
A mandatory final node for outputing the color of each pixel.

    -   Inputs:
        -   rgba: Vector4
        -   rgb: Vector3
        -   a: Float

### VertexOutput
A mandatory final node for outputing the position of each vertex.
    -   Inputs:
        -   vector: Vector4

## Particle
### ParticleBlendMultiply
The "blend/multiply" module of the particle shader

    -   Inputs:
        -   color: Color4
        -   alphaTexture: Float
        -   alphaColor: Float
    -   Outputs:
        -   blendColor: Color4

### ParticleColor
The color of the particle
    -   Outputs:
        -   output: Color4
### ParticlePositionWorld
The world position of the particle
    -   Outputs:
        -   output: Vector3
### ParticleRampGradient
The "ramp gradient" module of the particle shader
    -   Inputs:
        -   color: Color4
    -   Outputs:
        -   rampColor: Color4
### ParticleTexture
The texture of the particle
    -   Inputs:
        -   uv: Vector2
    -   Outputs:
        -   rgba: Color4
        -   rgb: Color3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float
### ParticleTextureMask
The textureMask property of the particle
    -   Outputs:
        -   output: Color4
### ParticleUV
the uv coordinates of the particle
    -   Outputs:
        -   output: Vector2

## PBR (since 4.2)
### Anisotropy
The anisotropy module of the PBR material
-   Inputs:
    -   intensity: Float
    -   direction: Vector2 - note that if you read the direction from a texture, you will probably want to apply the transformation `texture.xy * 2 - 1` to get coordinates between -1 and 1!
    -   uv: Vector2
    -   worldTangent: Vector4
-   Outputs:

    -   anisotropy: can only be used as input of the `PBRMetallicRoughness` block

### ClearCoat
The clear coat module of the PBR material

    -   Inputs:
        -   intensity: Float
        -   roughness: Float
        -   indexOfRefraction: Float
        -   normalMapColor: Color3
        -   uv: Vector2
        -   tintColor: Color3
        -   tintAtDistance: Float
        -   tintThickness: Float
        -   worldTangent: Vector4
    -   Outputs:
        -   clearcoat: can only be used as input of the `PBRMetallicRoughness` block

### Iridescence
The iridescence module of the PBR material

    -   Inputs:
        -   intensity: Float
        -   indexOfRefraction: Float
        -   thickness: Float
    -   Outputs:
        -   iridescence: can only be used as input of the `PBRMetallicRoughness` block

### PBRMetallicRoughness
The PBR material implementing the metallic/roughness model

    -   Inputs:
        -   worldPosition: Vector4
        -   worldNormal: Vector4
        -   view: Matrix
        -   cameraPosition: Vector3
        -   perturbedNormal: Vector4
        -   baseColor: Color3
        -   metallic: Float
        -   roughness: Float
        -   ambientOcc: Float
        -   opacity: Float
        -   indexOfRefraction: Float
        -   ambientColor: Color3
        -   reflection: output of the `Reflection` block
        -   clearcoat: output of the `ClearCoat` block
        -   iridescence: output of the `Iridescence` block
        -   sheen: output of the `Sheen` block
        -   subsurface: output of the `SubSurface` block
        -   anisotropy: output of the `Anisotropy` block
    -   Outputs:
        -   ambientClr: Color3
        -   diffuseDir: Color3
        -   specularDir: Color3
        -   clearcoatDir: Color3
        -   sheenDir: Color3
        -   diffuseInd: Color3
        -   specularInd: Color3
        -   clearcoatInd: Color3
        -   sheenInd: Color3
        -   refraction: Color3
        -   lighting: Color3
        -   shadow: Float
        -   alpha: Float

    Notes:

    -   The `Dir` suffix in the name of the outputs means `Direct` and are components from direct lighting (spot, point light, directional, ...).
    -   The `Ind` suffix in the name of the outputs means `Indirect` and are components from indirect lighting (IBL, ...).
    -   The `lighting` output is the combination (sum) of all the other outputs (except for `shadow` and `alpha`) and is the one to use if you want to deal with the final output color. This color **is in gamma space**.
    -   All the `XXXClr`, `XXXDir` and `XXXInd` outputs are individual lighting components and can be used if you need to perform further processing with them. These components are **in linear space**.
    -   The `shadow` output is the shadow component when this material is used for shadow rendering (0 means completely in shadow from all lights and 1 means fully visible by all lights). You can use it for additional special effects (see <Playground id="#Y642I8" title="Tinted Shadows Example" description="A Playground example of tinted shadows."/> ) for tinted shadows for eg - it's for the standard material but it would work the same for PBR too) but note that you don't need to do anything with it by default to have shadows rendered correctly for your material

### Reflection
The reflection module of the PBR material
    -   Inputs:
        -   position: Vector3
        -   world: Matrix
        -   color: Color3
    -   Outputs:
        -   reflection: can only be used as input of the `PBRMetallicRoughness` block

### Refraction
The refraction module of the PBR material (used by the `SubSurface` block)

-   Inputs:
    -   intensity: Float
    -   tintAtDistance: Float
-   Outputs:
    -   refraction: can only be used as input of the `SubSurface` block

### Sheen
The sheen module of the PBR material

-   Inputs:
    -   intensity: Float
    -   color: Color3
    -   roughness: Float
-   Outputs:
    -   sheen: can only be used as input of the `PBRMetallicRoughness` block

### SubSurface
The sub surface module of the PBR material

-   Inputs:
    -   thickness: Float
    -   tintColor: Color3
    -   translucencyIntensity: Float
    -   translucencyDiffusionDist: Color3
    -   refraction: output of the `Refraction` block
-   Outputs:
    -   subsurface: can only be used as input of the `PBRMetallicRoughness` block

## PostProcess
### CurrentScreen
The current screen (texture) used to render the post process

    -   Inputs:
        -   uv: Vector2
    -   Outputs:
        -   rgba: Color4
        -   rgb: Color3
        -   r: Float
        -   g: Float
        -   b: Float
        -   a: Float

### ScreenPosition
The 2D clip coordinates (values between -1 and 1 for both x and y)
    -   Outputs:
        -   output: Vector2

## Range
### Clamp
Outputs values above the maximum or below minimum as maximum or minimum values respectively.

    -   Input:
        -   input: Float
    -   Output:
        -   input: Float

### Normalize
Remaps the length of a vector or color to 1.

    -   Inputs:
        -   input: Vector2, Vector3, Vector4, Color3, or Color4.
    -   Outputs:
        -   output: Vector2, Vector3, Vector4, Color3, or Color4. Output varies based on input types.

### Remap
Remaps input value between sourceMin and sourceMax to a new range between targetMin and targetMax.
    -   Inputs:
        -   input: Float, Vector2, Vector3, Vector4, Color3, Color4.
        -   sourceMin: Float
        -   sourceMax: Float
        -   targetMin: Float
        -   targetMax: Float
    -   Outputs:
        -   output: Float, Vector2, Vector3, Vector4, Color3, Color4. Output varies based on input type.

## Round
### Ceiling
Outputs fractional values as the next higher whole number.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Floor
Outputs fractional values as the next lower whole number.

    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

### Round
Outputs fractional values rounded to the nearest whole number.
    -   Input:
        -   input: Float
    -   Output:
        -   output: Float

## Scene Attributes
### CameraPosition
Outputs a Vector3 position of the active scene camera.

    -   Output:
        -   output: Vector3

### CameraParameters
Outputs a Vector4 containing parameters associated with the camera (x: -1 for webGL and 1 for webGPU, y: minZ, z: maxZ, w: 1 / maxZ).
    
        -   Output:
            -   output: Vector4

### Fog
Applies fog to the scene with an increasing opacity based on distance from the camera.

    -   Input:
        -   worldPosition: Vector4
        -   view: viewMatrix (Matrix)
        -   input: Vector3
        -   fogColor: Color3
    -   Output:
        -   output: Color3

### FogColor
The system value for fog color pulled from the scene.

    -   Output:
        -   output: Color3

### ImageProcessing
Provides access to all of the Babylon image processing properties. Input is expected in Gamma color space. [Post Processes](/features/featuresDeepDive/postProcesses/usePostProcesses)

    -   Input:
        -   color: Color3 / Color4
    -   Output:
        -   output: Color4
        -   rgb: Color3

### Light
Outputs diffuse and specular contributions from one or more scene lights.

    -   Input:
        -   worldPosition: Vector4
        -   worldNormal: Vector4
        -   cameraPosition: Vector3
        -   glossiness: Float
        -   glossPower: Float
        -   diffuseColor: Color3
        -   specularColor: Color3
    -   Output:
        -   diffuseOutput: Color3
        -   specularOutput: Color3

### LightInformation
Provides the direction, color and intensity of a selected light based on its world position.

    -   Input:
        -   worldPosition: Vector4
    -   Output:
        -   direction: Vector3
        -   color: Color3
        -   intensity: Float

### SceneDepth
The scene depth buffer.
    -   Input:
        -   uv: Vector2 / Vector3 / Vector4
    -   Output:
        -   depth: Float

### ViewDirection
Outputs the direction vector of where the camera is aimed.
    -   Input:
        -   worldPosition: Vector4
        -   cameraPosition: Vector3
    -   Output:
        -   output: Vector3
