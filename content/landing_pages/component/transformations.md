# Transformations
Transformations are the actions that change an object's position, rotation and scale. Although this section largely covers transformations applied to meshes some can also apply to other Babylon.js objects.

Applying transformations can seem straightforward and in many cases they are, such as changing position. Others aspects may appear easy but in practice can be difficult either in concept, execution or both. In 3D something as simple as a rotation can prove tricky, once you have rotated a mesh about x and y then its z axis may not be where you think it should be since a mesh's local frame of reference rotates with it.

Frames of reference, in 3D, are formed by an origin and three mutually perpendicular axes through the origin. When created in Babylon.js objects are placed using a frame of reference in **World Space** where there are two horizontal axes, x and z, and a vertical y axis in a left handed system.

Each mesh also has its own **Local Space**.  Meshes built within Babylon.js are created with their local space origin at the world space origin and with their local space axes x, y and z aligned with the x, y and z axes of the world space. The local origin acts as the center of transformation unless pivots or parents are added to the mesh.

Meshes created in other packages and imported may use different frames of reference.


