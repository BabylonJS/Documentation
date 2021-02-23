---
title: Mesh Writer
image: 
description: The Mesh Writer allows you to write 3D text, as meshes, in various fonts.
keywords: library, 3D text, font
further-reading:
video-overview:
video-content:
---

Generate letters in BABYLON meshes.

## Basic-Usage

	Writer = BABYLON.MeshWriter(scene, {scale:scale});
	text1  = new Writer( 
	                "ABC",
	                {
	                    "anchor": "center",
	                    "letter-height": 50,
	                    "color": "#1C3870",
	                    "position": {
	                        "z": 20
	                    }
	                }
	            );

PG: <Playground id="#PL752W#150" title="Mesh Writer Example 1" description=""/>

## Getting the code

Copy https://github.com/BabylonJS/Extensions/blob/master/MeshWriter/meshwriter.min.js or https://github.com/BabylonJS/Extensions/blob/master/MeshWriter/meshwriter.js and build it into your load sequence.

## If you prefer npm 

> ### npm i meshwriter

 Import in your React/Angular component:

> import { MeshWriter } from "meshwriter";

With __meshwriter__ you can use MeshWriter directly like this:

	  let Writer = MeshWriter(this.scene, { scale: .25, defaultFont: "Arial" });
	    let textMesh = new Writer("Hello World", {
	      "font-family": "Arial",
	      "letter-height": 30,
	      "letter-thickness": 12,
	      color: "#1C3870",
	      anchor: "center",
	      colors: {
		diffuse: "#F0F0F0",
		specular: "#000000",
		ambient: "#F0F0F0",
		emissive: "#ff00f0"
	      },
	      position: {
		x: 0,
		y: 10,
		z: 0
	      }
	    });


## Superconstructor - BABYLON.MeshWriter()

After MeshWriter is loaded, BABYLON.MeshWriter is defined.  It is called with one or two parameters.
- **scene** &nbsp; required
- **preferences** &nbsp; optional &nbsp; The preferences object may specify up to three values

	      FIELD                 DEFAULT
	    default-font           Helvetica
	    scale                      1
	    letter-origin         "letter-center"

The call to BABYLON.MeshWriter returns a constructor.  Call it "**Writer**".

## Constructor - new Writer()

new Writer() is called with a string and an (optional) options parameter.&nbsp; The options object conforms to normalBabylon.js structures and terminology.

	      FIELD                 DEFAULT
	    font-family             default-font
	    anchor                  left
	    letter-height           100
	    letter-thickness        1
	    color                   #808080              # hits emissive only
	    alpha                   1
	    position
	        x                   0
	        y                   0
	        z                   0
	    colors                                       # if you need to control more than just emissive
	        diffuse             #F0F0F0
	        specular            #000000
	        ambient             #F0F0F0
	        emissive            color                # from option field 'color' above


**new Writer()** builds a mesh with material that is inserted into the scene.&nbsp; This is a multi-step process with interim meshes and holes per letter.&nbsp;  These meshes are sucked into an SPS and then disposed.&nbsp; At the end, one mesh, one material and one SPS have been added to the scene.

**new Writer()** also returns a **writer** instance with useful methods.&nbsp; See below.

## Instance

Each **writer** instance has methods to allow one to retrieve theBabylon.js objects or to get/set attributes of the SPS.

	   getSPS
	   getMesh
	   getMaterial
	   color                   # sets or gets color but no change to material
	   alpha                   # sets or gets alpha but no change to material
	   setColor                # set emissive color and change color value
	   setAlpha                # change value and material
	   overrideOpac            # change material but not value
	   resetOpac               # sets material to current value
	   dispose      

## Usage Hints

If you wish to do extensive things with position, rotation or animation, retrieve the meshes and materials from the instance using the methods shown above.&nbsp; The output from **new Writer()** is an SPS with one particle for each character.

Example:
PG: <Playground id="#PL752W#151" title="Mesh Writer Example 2" description=""/>

	    const SCALE =.25 
	    const TEXT_SIZE = 35
	    const TEXT_THICKNESS =10

	    Writer = BABYLON.MeshWriter(scene, {scale:SCALE,defaultFont:"Arial"});
	    textMesh  = new Writer( 
			    "BABYLON JS",{
				"font-family":"Arial",
				anchor: "center",
				"letter-height": TEXT_SIZE,
				    "letter-thickness": TEXT_THICKNESS,
				    color: "#1C3870",
				    colors:{
				    diffuse  :"#F0F0F0",
				    specular :"#000000",
				    ambient  :"#F0F0F0",
				    emissive :"#ff00f0"   
				    },
				    position: {
					x:0,
					y:5,
					z: 70
				}
			    }
			);

	    //Text Writer create SPS with Particle for each letter
	    SPS =  textMesh.getSPS()    

	    //Update animation
	    SPS.updateParticle =  (particle)=> {
		    particle.rotation.x -= 0.06;
	    };

	    scene.registerBeforeRender( ()=> {
		SPS.setParticles();
		//sps.mesh.rotation.y = k;
	    });  


Colors:&nbsp; With most lighting, it is enough just to use the "color" field to specify the letter coloring.&nbsp; However, programmers may specify all four color types by putting a "colors" object in the options object.

Unless you have a specific need, do not specify a font.&nbsp; The default font, Helvetica, has the most extensive characters and the fewest faces; it will be the most efficient if you have a lot of text.&nbsp; Jura was added because the author likes it for numbers.


