# Fireworks with Shaders
As with any code it is important to have a firm idea of what you want to achieve, what is possible to code and 
a design. 

## Requirements
The requirements are for a collection of coloured facets to burts out from a central position so that each fragment lies on the surface of an expanding sphere. 
All fragments should be equally spaced on the sphere and should change colour during the expansion, fading over time.

## First Stage Design
A sphere created in BabylonJS is made up of facets where vertices of adjoining facets share normals to ensure a smooth surface. 
Converting the sphere to a flat shaded mesh will give each facet its own set of normals which will be the mathematical normals for the plane of the facet. 
To make a facet travel outwards from the centre over time its position at any time will be _start position + normal \* function of time_

The sphere is flat shaded and the normals for the three vertices of each facet will be the same. The original position of each vertex and its normal 
are accessible to the shader as attributes passing time as a uniform will be enough. 

To obtain an initially fast expansion the slowing down a logarithmic function of time will be used.

## Second Stage Design
The colour and transparency of all the facets will be the same at the same time and so a change to each component of the colour of a vertex 
can be applied as a function of time.

## Third Stage Design
After the first coding of the shaders adjustments were made to the functions of time, manually, to obtaim a satisfactory appearance to the burst of facets.

## Shader Material Code

### Vertex Shader Main Function

```
void main(void) {
    vec3 p = position;
    vec3 j = vec3(0., -1.0, 0.);
    p = p + normal * log2(1. + time) * 25.0;
    gl_Position = worldViewProjection * vec4(p, 1.0);
}
```

### Fragment Shader Main Function

```
void main(void) {
    gl_FragColor = vec4(1. - log2(1. + time)/100., 1. * log2(1. + time), 0., 1. - log2(1. + time/2.)/log2(1. + 3.95));
}
```

### Sphere 

```javascript
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:10}, scene);
sphere.convertToFlatShadedMesh();	

sphere.material = shaderMaterial;
```

### Animation Loop

```javascript
var t = 0.;
var time = 0.;
scene.registerBeforeRender(function() {
    if(time<8) {
        sphere.material.setFloat("time", time);
        time +=0.1;
    }   
    else {
        sphere.dispose();
    }
});
```

## Fireworks

[Guide Example - Shader Material](http://babylonjsguide.github.io/examples/fireworkcode.html)  
* [Playground Example - Shader Material](https://www.babylonjs-playground.com/#1OH09K#4)