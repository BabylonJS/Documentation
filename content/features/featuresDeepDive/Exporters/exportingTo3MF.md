# Exporting to 3MF

## What is 3MF?

3MF (3D Manufacturing Format) is an open, XML-based file format designed for additive manufacturing and 3D printing workflows. Unlike formats such as STL, 3MF is a versatile container that carries geometry, units, materials, colors, metadata, and structural relationships in a single zip-based package (OPC — Open Packaging Conventions). It is natively supported by most modern slicers, CAD tools, and manufacturing pipelines.

Because 3MF is designed to faithfully represent manufacturing intent, a Babylon.js scene may need to be prepared before exporting. For example, you may want to apply world transforms, merge or split meshes by material, assign meaningful names, set a specific unit, or strip rendering-only data that has no manufacturing meaning. The exporter works directly on the meshes you pass to it, so you remain in full control of what goes into the file.

---

## Installation and prerequisites

The serializer relies on [fflate](https://github.com/101arrowz/fflate) for zip compression. By default it loads fflate lazily from a CDN:

```typescript
// Override the CDN URL before creating any serializer instance (optional)
import { ThreeMfSerializerGlobalConfiguration } from "babylonjs-serializers";
ThreeMfSerializerGlobalConfiguration.FFLATEUrl = "https://cdn.example.com/fflate.js";
```

If fflate is already present on `globalThis.fflate` (bundled by your application), the dynamic load is skipped automatically.

---

## Basic usage

### Serialize to a memory buffer

The simplest way to export one or more meshes is `ThreeMf.SerializeToMemoryAsync`. It buffers the entire 3MF archive into a `Uint8Array` that you can then save or upload.

```typescript
import { ThreeMfSerializer, ThreeMf } from "babylonjs-serializers";

const serializer = new ThreeMfSerializer();

const buffer = await ThreeMf.SerializeToMemoryAsync(serializer, mesh1, mesh2);

if (buffer) {
    // Save as a file in the browser
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.3mf";
    a.click();
    URL.revokeObjectURL(url);
}
```

### Stream to a custom sink

For large scenes or environments where you want to avoid buffering the entire archive in memory (e.g., writing directly to a Node.js file stream), use `serializeAsync` with a sink callback:

```typescript
import { ThreeMfSerializer } from "babylonjs-serializers";
import { createWriteStream } from "fs";

const serializer = new ThreeMfSerializer({ unit: ST_Unit.millimeter });
const chunks: Uint8Array[] = [];

await serializer.serializeAsync(
    (err, chunk, final) => {
        // append chunk to your stream / buffer
        chunks.push(chunk);
    },
    mesh1,
    mesh2
);
```

---

## Serializer options

Options are passed as an object to the `ThreeMfSerializer` constructor. All fields are optional.

| Option | Type | Default | Description |
|---|---|---|---|
| `unit` | `ST_Unit` | `ST_Unit.meter` | Unit used for all coordinates in the exported file. Must match the scale of your scene. |
| `exportInstances` | `boolean` | `false` | When `true`, `InstancedMesh` objects are exported as additional build items that reference the shared geometry of their source mesh — no geometry duplication. When `false`, instances are silently ignored. |
| `metadata` | `Record<string, string>` | `undefined` | Arbitrary key/value pairs written as model-level metadata. Standard keys include `Title`, `Designer`, `Description`, `Copyright`, `LicenseTerms`, `CreationDate`, `ModificationDate`, and `Application`. |

### Units

The `ST_Unit` enum provides the full set of units supported by the 3MF specification:

```typescript
import { ST_Unit } from "babylonjs-serializers";

// Available values
ST_Unit.micron
ST_Unit.millimeter  // most common for desktop 3D printing
ST_Unit.centimeter
ST_Unit.inch
ST_Unit.foot
ST_Unit.meter       // default for ThreeMfSerializer
```

> **Important:** The unit does not rescale coordinates. It declares to the consuming application how to interpret the raw numbers in the file. Make sure the unit you choose matches the actual scale of your mesh vertices.

### Example: millimeter export with metadata

```typescript
import { ThreeMfSerializer, ST_Unit, ThreeMf } from "babylonjs-serializers";

const serializer = new ThreeMfSerializer({
    unit: ST_Unit.millimeter,
    metadata: {
        Title: "My Part",
        Designer: "Jane Doe",
        Description: "Bracket assembly for prototype v2",
        CreationDate: new Date().toISOString().slice(0, 10),
    },
});

const buffer = await ThreeMf.SerializeToMemoryAsync(serializer, bracket);
```

### Example: exporting instances

When a scene contains many copies of the same object created with `Mesh.createInstance()`, enabling `exportInstances` avoids duplicating geometry for every copy:

```typescript
const serializer = new ThreeMfSerializer({ exportInstances: true });

// sourceMesh is exported once as a resource object.
// each InstancedMesh becomes a separate build item pointing to that object.
const buffer = await ThreeMf.SerializeToMemoryAsync(serializer, sourceMesh, ...sourceMesh.instances);
```

---

## Preparing your scene for export

Because 3MF targets manufacturing workflows, some aspects of a typical Babylon.js scene may need attention before exporting:

- **Apply transforms:** The serializer uses each mesh's current world matrix. If you want a "baked" export with no runtime transform, call `mesh.bakeCurrentTransformIntoVertices()` beforehand.
- **Units and scale:** If your scene is in centimeters but the slicer expects millimeters, either rescale the meshes or choose `ST_Unit.centimeter` so the consumer can convert correctly.
- **Submeshes and materials:** Each Babylon.js `SubMesh` is exported as its own 3MF object resource. This allows downstream tools to assign per-object colors or materials. If you want a single object per mesh, merge submeshes before exporting.
- **Names:** Object names in the exported file come from `mesh.name`. Give meshes meaningful names to make the 3MF easier to work with in slicer or CAD software.
- **Non-manifold geometry:** 3MF consumers typically require watertight (manifold) geometry for printing. Validate and repair meshes as needed before export.

---

## Advanced: using the builders directly

The serializer internally uses a set of fluent builder classes. You can use these directly if you need to construct a 3MF file from raw geometry data (independent of any Babylon.js mesh):

```typescript
import {
    ThreeMfModelBuilder,
    ThreeMfMeshBuilder,
    ThreeMfMaterialBuilder,
    ThreeMfDocumentBuilder,
    ST_Unit,
} from "babylonjs-serializers";

// 1. Define a material group
const material = new ThreeMfMaterialBuilder(1)
    .withColor("Red", { r: 0.8, g: 0.1, b: 0.1 })
    .withColor("Blue", { r: 0.1, g: 0.1, b: 0.8 })
    .build();

// 2. Define a mesh resource (positions: flat x,y,z array; indices: flat i,j,k array)
const mesh = new ThreeMfMeshBuilder(2)
    .withName("Cube")
    .withData({ positions: [...], indices: [...] })
    .withMaterial(1, 0) // reference material group id=1, entry index 0
    .build();

// 3. Assemble the model
const model = new ThreeMfModelBuilder()
    .withUnit(ST_Unit.millimeter)
    .withMetaData("Title", "My Model")
    .withMaterial(material)
    .withMesh(mesh)
    .withBuild(2) // add mesh id=2 to the build list
    .build();

// 4. Wrap in an OPC document
const document = new ThreeMfDocumentBuilder()
    .withModel(model)
    .build();
```

### Builder reference

| Builder | Purpose |
|---|---|
| `ThreeMfModelBuilder` | Assembles the root 3MF model: unit, metadata, resources (meshes + materials), and build items. |
| `ThreeMfMeshBuilder` | Creates a mesh resource object from a flat positions array and a flat indices array. Accepts an optional vertex/triangle post-process handler. |
| `ThreeMfMaterialBuilder` | Creates a `basematerials` resource group. Colors are expressed as linear RGB and converted to sRGB hex automatically. |
| `ThreeMfComponentsBuilder` | Creates a composite object made of references to other resource objects with per-component transforms. |
| `ThreeMfDocumentBuilder` | Wraps a model into a full OPC document (content types + relationships + model part). |

### `ThreeMfMeshBuilder` post-process handlers

If you need to transform individual vertices or triangles during export (e.g., to remap coordinates or inject per-triangle property references), you can attach handlers:

```typescript
const mesh = new ThreeMfMeshBuilder(id)
    .withData(data)
    .withPostProcessHandlers(
        (vertex) => {
            // transform or annotate the vertex
            return vertex;
        },
        (triangle) => {
            // assign per-triangle material references
            triangle.pid = materialGroupId;
            triangle.p1 = 0;
            return triangle;
        }
    )
    .build();
```
