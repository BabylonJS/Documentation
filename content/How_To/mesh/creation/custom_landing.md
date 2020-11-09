---
title: Create Custom Meshes
image: 
description: Learn how to create custom meshes in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, custom meshes
further-reading:
video-overview:
video-content:
---

## Custom Meshes

Of course there will be times that the created meshes already available in Babylon.js do not serve your needs. In this case you can develop your own meshes from vertex data. Vertex data requires a list of vertices and indices to show how the vertices are formed into triangular facets to build the mesh. For lighting, material and texture you will need to provide vertex normals, colors and uv values. When the existing meshes partially meet your needs you can obtain their vertex data and update it, provided you create the mesh with the update option set to true in the first place.