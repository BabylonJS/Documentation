---
title: Debugging and Profiling with PIX
image:
description: Learn how to use PIX to debug and profile your Babylon.js application.
keywords: PIX, debugging, profiling, performance, GPU
further-reading:
video-overview:
video-content:
---

## Debugging and Profiling with PIX

[PIX](https://devblogs.microsoft.com/pix/) is a performance tuning and debugging tool from Microsoft for DirectX-based applications on Windows. It allows you to capture and analyze GPU workloads, inspect draw calls, profile frame timing, and debug shaders. When used with Babylon.js running on a WebGPU-enabled browser such as Chrome, PIX provides deep visibility into the rendering pipeline, helping you identify performance bottlenecks, verify that GPU resources are being used efficiently, and diagnose visual artifacts at the API level.

![Babylon.js PIX 0](/img/pix/pix-ui-0.png)

![Babylon.js PIX 1](/img/pix/pix-ui-1.png)

## Prerequisites

<Alert severity="info" title="Version Note" description="These instructions were tested with PIX 2601.15 and Chrome 145. Steps and appearance may vary slightly with different versions of PIX or Chrome."/>

Install PIX 2601.15:  
https://devblogs.microsoft.com/pix/download/

Download the WinPixEventRuntime NuGet package, unzip `winpixeventruntime.*.nupkg`, and copy the `bin\x64\*.dll` files into your `<Chrome Installation Directory>` (usually `C:\Program Files\Google\Chrome\Application\`):  
https://www.nuget.org/packages/WinPixEventRuntime

## Setting Up the Environment

Enable developer settings in the NVIDIA Control Panel:

![NVIDIA Control Panel](/img/pix/pix-nvcp-0.png)

Allow access to GPU counters:

![NVIDIA Control Panel](/img/pix/pix-nvcp-1.png)

Enable Developer Mode in Windows Settings:

![Windows Settings](/img/pix/pix-win-settings.png)

## Launching the Process

![PIX Launch Process](/img/pix/pix-launch-process.png)

**Executable Path:** `<Chrome Installation Directory>/chrome.exe`

**Working Directory:** `<Chrome Installation Directory>`

**Command Line Args:** `--incognito --disable-gpu-sandbox --disable-gpu-watchdog --disable-direct-composition --enable-dawn-features=emit_hlsl_debug_symbols,disable_symbol_renaming https://playground.babylonjs.com/?inspectorv2=true&engine=webgpu#DR9MT2#35`

<Alert severity="info" title="WebGPU Engine" description="The URL includes the query parameter engine=webgpu, which forces the Babylon.js Playground to use the WebGPU engine instead of the default WebGL. This is required for PIX to capture DirectX-level GPU activity."/>

| Chrome option used to launch | Description |
| --- | --- |
| `--incognito` | Launches Chrome in incognito mode so that extensions and cached state do not interfere with the capture. |
| `--disable-gpu-sandbox` | Disables the GPU process sandbox, allowing PIX to inject into and communicate with the GPU process. |
| `--disable-gpu-watchdog` | Prevents Chrome from killing the GPU process when a frame takes too long, which is common while PIX is capturing or single-stepping through draw calls. |
| `--disable-direct-composition` | Disables Windows DirectComposition, forcing Chrome to use a swap chain that PIX can intercept for frame capture. |
| `--enable-dawn-features=emit_hlsl_debug_symbols,disable_symbol_renaming` | Enables Dawn (Chrome's WebGPU implementation) features: **emit_hlsl_debug_symbols** includes debug information in the generated HLSL shaders, and **disable_symbol_renaming** preserves original variable and function names so they are readable in PIX's shader debugger. |

## GPU Capture

A GPU capture records a single frame of rendering activity, letting you inspect every draw call, resource binding, and pipeline state in detail. After launching Chrome through PIX, click the **GPU Capture** button (camera icon) on the PIX toolbar to capture the current frame. Once the capture completes, PIX opens an analysis view where you can step through each API call, examine textures and buffers at any point in the frame, and debug shaders directly.

![PIX GPU Capture](/img/pix/pix-gpu-capture.png)

## Timing Capture

A timing capture profiles GPU and CPU activity over a span of multiple frames, giving you a timeline view of how work is distributed. Unlike a GPU capture, a timing capture requires you to manually attach to the correct Chrome process. Launch the process as described above, then use **Attach to Process**:

![PIX Timing Capture](/img/pix/pix-timing-capture.png)

Select the Chrome process whose command line contains `--type=gpu-process`.

![PIX Timing Capture](/img/pix/pix-attach.png)

Once attached, click the **Timing Capture** button (stopwatch icon) on the PIX toolbar to begin recording, let the scene run for the desired duration, then click the button again to stop. The resulting timeline shows GPU queue utilization, command list execution, and hardware counter data, making it straightforward to identify bottlenecks such as GPU-bound passes, excessive state changes, or pipeline stalls.

![PIX Timing Capture](/img/pix/pix-start-capture.png)

## Additional Resources

This article covers how to set up PIX for use with Babylon.js and WebGPU. For a deeper understanding of PIX itself — including how to navigate captures, interpret timeline data, and debug shaders — the following resources from Microsoft are a great starting point.

Analyzing frames with GPU captures  
https://learn.microsoft.com/en-us/windows/win32/direct3dtools/pix/articles/gpu-captures/pix-gpu-captures

Timing Captures - The Timeline layout  
https://learn.microsoft.com/en-us/windows/win32/direct3dtools/pix/articles/timing-captures/layouts/pix-timing-captures-timeline-layout

Videos showing how to use the PIX on Windows tool for performance tuning and debugging DirectX 12 games  
https://www.youtube.com/playlist?list=PLeHvwXyqearWuPPxh6T03iwX-McPG5LkB
