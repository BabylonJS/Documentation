---
title: Available Data Nodes
image:
description: A list of all the Data Nodes available in the Babylon.js Flow Graph
keywords: flow graph, interactivity
further-reading:
video-overview:
video-content:
---

# Data Nodes

## Logic

### Bitwise

#### Bitwise And

#### Bitwise Or

#### Bitwise Xor

#### Bitwise Not

#### Bitwise Left Shift

#### Bitwise Right Shift

#### Count Leading Zeros

#### Count Trailing Zeros

### Logical

#### Logic And

#### Logic Or

#### Logic Not

## Math

Most of the math operation blocks have versions for number, Vector2, Vector3, Vector4 and Matrix inputs. Following is a table which shows the available blocks for each input type:

|           Block              | Input 1 | Input 2 | Input 3 | Output  | Notes |
|            ---               |   ---   |   ---   |   ---   |   ---   |  ---  |
| Add/Subtract/Multiply/Divide | number  | number  |         | number  |       |
| Add/Subtract/Multiply/Divide | Vector2 | Vector2 |         | Vector2 |       |
| Add/Subtract/Multiply/Divide | Vector3 | Vector3 |         | Vector3 |       |
| Add/Subtract/Multiply/Divide | Vector4 | Vector4 |         | Vector4 |       |
| Add/Subtract/Multiply/Divide | Matrix  | Matrix  |         | Matrix  |       |
| Add/Subtract/Multiply/Divide | Matrix  | number  |         | Matrix  |       |
| Mod/Pow/ATan2                | number  | number  |         | number  |       |
| IsNan/IsInfinity             | number  | number  |         | boolean |       |
| Sqrt/Abs/Negate/Floor/Ceil/Round/Trunc/Exp/Log10/Log/Ln/Sin/Cos/Tan/ASin/ACos/ATan | number | number | | boolean | |
| E/PI | number | | | number | |
| Random/Min/Max | number | number | | number | |
| Equals/GreaterThan/GreaterThanOrEquals/LessThan/LessThanOrEquals | number | number | | boolean | |
| Mix | number | number | number | number | |
| Scale | Vector2 | number | | Vector2 | |
| Scale | Vector3 | number | | Vector3 | |
| Scale | Vector4 | number | | Vector4 | |
| Length | Vector2 | number | | number | |
| Length | Vector3 | number | | number | |
| Length | Vector4 | number | | number | |
| Normalize | Vector2 | number | | Vector2 | |
| Normalize | Vector3 | number | | Vector3 | |
| Normalize | Vector4 | number | | Vector4 | |
| Cross | Vector3 | Vector3 | | Vector3 | |
| Dot | Vector3 | Vector3 | | number | |
| Rotate2d | Vector2 | number | | Vector2 | |
| Rotate3d | Vector3 | Vector3 | number | Vector2 | |