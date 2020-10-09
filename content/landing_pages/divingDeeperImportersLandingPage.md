# Importing Assets
The built in file type is `.babylon` and Babylon.js can load these without a plugin. All other file types require a plugin as described in this section.

Possible file types are gLTF, obj, stl

To help you with imported assets there is a manager for them.

**Note:** Since meshes you import can have a _rotationQuaternion_ set before applying a rotation set the _rotationQuaternion_ to _null