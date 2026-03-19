---
title: Complex Mixed Content Test
description: Tests complex combinations of markdown features
keywords: mixed, complex, html
further-reading:
video-overview:
video-content:
---

## Lists

### Unordered Lists

- First item
- Second item with **bold**
- Third item with `code`
  - Nested item
  - Another nested item
    - Deep nested

### Ordered Lists

1. Step one
2. Step two
3. Step three
   1. Sub-step
   2. Another sub-step

## Blockquotes

> This is a simple blockquote.

> "VRM" is **a file format for handling 3D humanoid avatar** data for use in VR applications.
> It is based on glTF 2.0.

> **Note:** This is an important note with a [link](https://example.com) inside.

## HTML in Markdown

Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> to open the inspector.

Use the <code>scene.debugLayer.show()</code> method.

<br/>

## Mixed Formatting

This paragraph has **bold text**, *italic text*, ***bold italic***, ~~strikethrough~~, and `inline code` all together.

## Complex Table

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `createScene()` | `engine: Engine` | `Scene` | Creates a new scene |
| `addMesh()` | `name: string, options?: object` | `Mesh` | Adds a mesh to scene |
| `render()` | none | `void` | Renders the frame |

## Escaped Characters

Use \*asterisks\* and \[brackets\] literally.

## Line Breaks

First line with two trailing spaces  
Second line right after.

Hard break above.
