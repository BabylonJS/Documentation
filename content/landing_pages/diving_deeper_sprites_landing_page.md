# Sprites
Sprites are 2D images and always face the camera. They can used to display animated characters, and particles, and to simulate 3D complex objects like trees.  

For animation individual sprite images are collected together in a single file called a spritesheet.

* A uniform spritesheet is one where all the sprites are exactly the same size and arranged in order in the file. When you read the term spritesheet in the documentation you can usually assume that it is referring to a uniform spritesheet. A uniform spritesheet is overseen by a *Sprite Manager*.
* A packed spritesheet is one where the sprites can be of different sizes and often packed in such a way as to minimize the overall size of the file. Usually the full term of _packed spritesheet_ will be used for such a spritesheet. A packed spritesheet is overseen by a *Sprite Packed Manager*. * available from BJS version 4.1*

For sprites the use of one of these managers is mandatory, even for one sprite. They optimize GPU resources by grouping in one place multiple instances of a sprite. 

Also available, for any grid like implementation (in a 2d or 2.5d game level for instance) that require thousands of sprites to be animated and rendered, is a special system called a *Sprite Map*, *available from BJS version 4.1*