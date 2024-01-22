---
title: Gaussian Splatting
image: 
description: Learn how use Gaussian Splatting.
keywords: diving deeper, meshes, gaussian, splatting, nerf
further-reading:
video-overview:
video-content:
---

# What is Gaussian Splatting?

Gaussian Splatting is a volume rendering method. It's useful to capture real-life data. The difference with other technics like photogrammetry is the end result consists in a point cloud with each point rendered as a semi transparent ellipsoid projected onto a billboard. Gaussian Splatting is more suitable for rendering reflective and transparent surfaces.

# Supported formats

Supported formats are :
- .PLY https://en.wikipedia.org/wiki/PLY_(file_format)
- .splat that is Javascript types serialized version of .PLY datas

# Loading a Gaussian Splatting

Instanciate a new `GaussianSplattingMesh` object. It inherits from Mesh class. Set its name and the scene it belongs to.
```javascript
var gs = new BABYLON.GaussianSplattingMesh("Halo", scene);
```

Load asynchronously the splat or PLY file.
```javascript
gs.loadFileAsync("https://raw.githubusercontent.com/CedricGuillemet/dump/master/Halo_Believe.splat").then(()=>{
        ...
    });
```

<Playground id="#RQ09P3#0" title="Simple Example of Gaussian Splatting" description="Simple example of setting a Gaussian Splatting."/>
