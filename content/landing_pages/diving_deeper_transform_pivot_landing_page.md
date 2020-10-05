# Transformation, Pivots and Parents
Should you wish to position, rotate or scale a mesh about a point other than its own _local origin_ then this can be done either a parent, a pivot or by coordinate transformation.

Assigning a mesh a parent changes the world frame of reference for its children. Any change in position, rotation or scale of the parent will be applied to its children. Setting the position, rotation or scale of a child will be done using its **local space** Remember that the frame of reference for the child's local space with depend on transformations made to its parent.

Depending on the method used to produce the parent child relationship any transformations made to the parent prior to assigning it  children may also be applied to the children when the parent is assigned. It usually makes sense not to rotate or move a child until after you've assigned it to the parent.

Using a pivot can be tricky and a number of methods are available. Some of these methods, but not all, may actually change the local origin of a mesh so that positioning, rotation and scaling transformations are based on the pivot as the new origin.

Coordinate transformation uses matrices directly instead of a parent or pivot to change the frame of reference.

Hopefully you will be less confused after reading the details in the following pages.