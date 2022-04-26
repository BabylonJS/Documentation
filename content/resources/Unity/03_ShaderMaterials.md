---
title: Shader Materials
image:
description: Creating shader materials with the Unity Toolkit.
keywords: babylon.js, exporter, unity, extension, material, shader
further-reading:
video-overview:
video-content:
---

There is a close relationship between **Materials**, **Shaders** and **Textures** within a game engine render pipeline:

- **Materials** are definitions of how a surface should be rendered, including references to textures used, tiling information, colour tints and more. The available options for a material depend on which shader the material is using.

- **Shaders** are small scripts that contain the mathematical calculations and algorithms for calculating the colour of each pixel rendered, based on the lighting input and the Material configuration.

- **Textures** are bitmap images. A Material may contain references to textures, so that the Material’s shader can use the textures while calculating the surface colour of an object. In addition to basic colour (albedo) of an obejct’s surface, textures can represent many other aspects of a material’s surface such as its reflectivity or roughness.

A material specifies one specific shader to use, and the shader used determines which options are available in the material. A shader specifies one or more textures variables that it expects to use, and the Material Inspector in Unity allows you to assign your own texture assets to these these texture variables.

For most normal rendering - by which we mean characters, scenery, environments, solid and transparent objects, hard and soft surfaces etc., the Standard Shader is usually the best choice. This is a highly customisable shader which is capable of rendering many types of surface in a highly realistic way. You may choose the **Babylon Standard Material** shader for a legacy diffuse workflow.

Please refer to the [Unity Material](https://docs.unity3d.com/Manual/class-Material.html) documentation for details.

## Creating And Using Shader Materials

To create a new Material, use **Assets > Create > Material** from the main menu or the Project View context menu.

By default, new materials are assigned the **Standard Shader**, with all map properties empty, like this:

![Standard Shader](/img/exporters/unity/material.jpg)

Once the Material has been created, you can apply it to an object and tweak all of its properties in the Inspector. To apply it to an object, just drag it from the Project View to any object in the Scene or Hierarchy.

## Set Shader Material Properties

You can select which Shader you want any particular Material to use. Simply expand the Shader drop-down in the Inspector, and choose your new Shader. The Shader you choose will dictate the available properties to change. The properties can be colors, sliders, textures, numbers, or vectors. If you have applied the Material to an active object in the Scene, you will see your property changes applied to the object in real-time.

There are two ways to apply a Texture to a property.

- Drag it from the Project View on top of the Texture square

- Click the Select button, and choose the texture from the drop-down list that appears

## Unity Shader Technical Details

A Shader is a script which contains mathematical calculations and algorithms for how the pixels on the surface of a model should look. The standard shader performs complex and realistic lighting calculations. Other shaders may use simpler or different calculations to show different results. Within any given Shader are a number of properties which can be given values by a Material using that shader. These properties can be numbers, colours definitions or textures, which appear in the inspector when viewing a Material. Materials are then used by Renderer components attached to Game Objects, to render each Game Object’s mesh.

It is possible and often desirable to have several different Materials which may reference the same textures. These materials may also use the same or different shaders, depending on the requirements.

Below is an example of a possible set-up combination using three materials, two shaders and one texture.

![Material Diagram](/img/exporters/unity/diagram.jpg)

In the diagram we have a red car and a blue car. Both models use a separate material for the bodywork, “Red car material” and “Blue car material” respectively.

Both these bodywork materials use the same custom shader, “Carbody Shader”. A custom shader may be used because the shader adds extra features specifically for the cars, such as metallic sparkly rendering, or perhaps has a custom damage masking feature.

Each car body material has a reference to the “Car Texture”, which is a texture map containing all the details of the bodywork, without a specific paint colour.

The Carbody shader also accepts a tint colour, which is set to a different colour for the red and blue cars, giving each car a different look while using a single texture for both of them.

The car wheel models use a separate material again, but this time both cars share the same material for their wheels, as the wheels do not differ on each car. The wheel material uses the Standard Shader, and has a reference again to the Car Texture.

Notice how the car texture contains details for the bodywork and wheels - this is a texture atlas, meaning different parts of the texture image are explicitly mapped to different parts of the model.

Even though the bodywork materials are using a texture that also contains the wheel image, the wheel does not appear on the body because that part of the texture is not mapped to the bodywork geometry.

Similarly, the wheel material is using the same texture, which has bodywork detail in it. The bodywork detail does not appear on the wheel, because only the portion of the texture showing the wheel detail is mapped to the wheel geometry.

This mapping is done by the 3D artist in an external 3d application, and is called “UV mapping”.

To be more specific, a Shader defines:

The method to render an object. This includes code and mathematical calculations that may include the angles of light sources, the viewing angle, and any other relevant calculations. Shaders can also specify different methods depending on the graphics hardware of the end user.
The parameters that can be customised in the material inspector, such as texture maps, colours and numeric values.
A Material defines:

Which shader to use for rendering this material.
The specific values for the shader’s parameters - such as which texture maps, the colour and numeric values to use.
Custom Shaders are meant to be written by graphics programmers. They are created using the GLSL shader language, which is quite simple. However, getting a shader to work well on a variety graphics cards is an involved job and requires a fairly comprehensive knowledge of how graphics cards work.

## Babylon Shader Material Pipeline

## Physical Based Rendering

The **BABYLON.PBRMaterial** is the default shader material that will be used for **all** materials using **Unity Standard Shader** pipeline properties. These include the built-in Standard, Standard Roughness, Standard Specular and **any** other shader that uses **Metallic Type** properties (IE: \_Metallic).

## Diffuse Shader Materials

The **BABYLON.StandardMaterial** is used as the base shader for **all non** physical babsed rendering shaders. During exportation, the toolkit will **scrape** all materials looking for standard shader properties like **\_MainTex** and assign them to the standard diffuse shader pipeline.

## Custom Shader Materials

Custom shader materials creates a custom unity shader (.shader) program for use as the design time shader. You can change the content of the unity design time as it is only used for design time _ **WYSIWYG** _ display purposes. The actual **Shader Controller** class defines the native babylon shader material class to control the material export.

You can create a custom shader material from the **Create** menu at the top left of the Project panel or by selecting **Assets > Create > Babylon > Custom Shader Material** from the main menu.

Example library **Water Material** shader asset:

```
    Shader "Babylon/Library Materials/Water Material"
    {
        Properties {
            _WaterColor("Main Color", Color) = (0.1, 0.1, 0.6,1.0)
            _BumpMap("Normal Map", 2D) = "bump" {}
            _TagIndex("Tag Index", Int) = 0
            _WindForce("Wind Force", Float) = 6
            _WaveSpeed("Wave Speed", Float) = 1.0
            _WaveLength("Wave Length", Float) = 0.1
            _WaveHeight("Wave Height", Float) = 0.4
            _BumpHeight("Bump Height", Float) = 0.4
            _ColorBlendFactor("Blend Factor", Float) = 0.2
            _SecondBlendFactor("Second Factor", Float) = 0.2
            _WindDirectionX("Wind Direction X", Float) = 0.0
            _WindDirectionY("Wind Direction Y", Float) = 1.0
            _SecondColor("Secondary Color", Color) = (0.1, 0.1, 0.6,1.0)
            _SpecColor("Specular Color", Color) = (0.0,0.0,0.0,1.0)
            _Shininess("Specular Power", Range(0.0, 1.0)) = 0.5
            _Color("Diffuse Color", Color) = (1.0,1.0,1.0,1.0)

            [ToggleOff] _Wireframe("Show Wireframe", Int) = 0
            [ToggleOff] _BackFaceCulling("Back Face Culling", Int) = 1
            [ToggleOff] _DisableLighting("Disable Surface Lighting", Int) = 0
            _MaxSimultaneousLights("Max Simultaneous Lights", Int) = 4

            [HideInInspector] _MainTex ("Base (RGB)", 2D) = "white" {}
        }

        CGINCLUDE
        #ifdef BABYLON_INFO
            controller: "BABYLON.WaterMaterialController"
        #endif //BABYLON_INFO_END
        ENDCG

        SubShader {
            Tags { "RenderType"="Opaque" }
            LOD 300

            CGPROGRAM
            #pragma surface surf Lambert

            sampler2D _MainTex;
            sampler2D _BumpMap;
            fixed4 _WaterColor;

            struct Input {
                float2 uv_MainTex;
                float2 uv_BumpMap;
            };

            void surf (Input IN, inout SurfaceOutput o) {
                o.Albedo = _WaterColor.rgb;
                o.Alpha = _WaterColor.a;
                o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
            }
            ENDCG
        }
        FallBack "Legacy Shaders/Diffuse"
    }
```

The **CGINCLUDE** section defines that native **BABYLON.PushMaterial** shader controller sub class:

```
 CGINCLUDE #ifdef BABYLON_INFO controller: "BABYLON.WaterMaterialController" #endif //BABYLON_INFO_END ENDCG`

```

## Shader Controller Scripts

The shader controller class is used to interface between the Unity Material inspector properties and the native **BABYLON.PushMaterial** sub class properties. The controller class uses the shader properties specfied in the custom shader material (.shader) asset. It reads the properties from the material inspector properties and assigns them to the native shader material properties.

You can create a custom shader controller script from the **Create** menu at the top left of the Project panel or by selecting **Assets > Create > Babylon > Babylon TypeScript > Shader Controller** from the main menu.

Example library **Water Material** shader controller with life cycle:

```javascript
module BABYLON {
    export class WaterMaterialController extends BABYLON.WaterMaterial {
        constructor(name: string, scene: Scene, public renderTargetSize: Vector2 = new Vector2(512, 512)) {
            super(name, scene, renderTargetSize);
            this.initializeInstance();
        }

        protected start() :void {
            var meshes:BABYLON.Mesh[] = this.getScene().getMeshesByTags(this.getWaterTagLabel());
            if (meshes != null && meshes.length > 0) {
                meshes.forEach(mesh => {
                    this.addToRenderList(mesh);
                });
            }
        }

        /* Shader Material Water Tag Functions */

        private _waterTagLabel:string = "WATER_TAG_0";
        protected getWaterTagLabel():string {
            return this._waterTagLabel;
        }
        protected setWaterTagIndex(index:number) : void {
            var tagIndex = (index >= 0) ? index : 0;
            this._waterTagLabel = "WATER_TAG_" + tagIndex.toString();
        }

        /* Shader Material Factory Class Functions */

        public clone(name: string): BABYLON.WaterMaterialController {
            return BABYLON.SerializationHelper.Clone(() => new BABYLON.WaterMaterialController(name, this.getScene()), this);
        }

        public serialize(): any {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.WaterMaterialController";
            return serializationObject;
        }

        public static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.WaterMaterialController {
            var material =  BABYLON.SerializationHelper.Parse(() => new BABYLON.WaterMaterialController(source.name, scene), source, scene, rootUrl);
            var property = "_Properties";
            // Parse custom shader properties
            if (source.vectors4) {
                property = "_WaterColor";
                if (source.vectors4[property]) {
                    material.waterColor = BABYLON.Color3.FromArray(source.vectors4[property]);
                }
                property = "_SecondColor";
                if (source.vectors4[property]) {
                    material.waterColor2 = BABYLON.Color3.FromArray(source.vectors4[property]);
                }
            }
            if (source.floats) {
                var tagIndex:number = 0;
                property = "_TagIndex";
                if (source.floats[property]) {
                    tagIndex = source.floats[property];
                }
                if (tagIndex <= 0) tagIndex = 0;
                material.setWaterTagIndex(tagIndex);

                property = "_WindForce";
                if (source.floats[property]) {
                    material.windForce = source.floats[property];
                }
                property = "_WaveSpeed";
                if (source.floats[property]) {
                    material.waveSpeed = source.floats[property];
                }
                property = "_WaveLength";
                if (source.floats[property]) {
                    material.waveLength = source.floats[property];
                }
                property = "_WaveHeight";
                if (source.floats[property]) {
                    material.waveHeight = source.floats[property];
                }
                property = "_BumpHeight";
                if (source.floats[property]) {
                    material.bumpHeight = source.floats[property];
                }
                property = "_ColorBlendFactor";
                if (source.floats[property]) {
                    material.colorBlendFactor = source.floats[property];
                }
                property = "_SecondBlendFactor";
                if (source.floats[property]) {
                    material.colorBlendFactor2 = source.floats[property];
                }

                var windDirX:number = 0.0;
                var windDirY:number = 1.0;
                property = "_WindDirectionX";
                if (source.floats[property]) {
                    windDirX = source.floats[property];
                }
                property = "_WindDirectionY";
                if (source.floats[property]) {
                    windDirY = source.floats[property];
                }
                material.windDirection = new BABYLON.Vector2(windDirX, windDirY);
            }
            return material;
        }
    }
}
```
