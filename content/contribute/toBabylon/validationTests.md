---
title: Validation tests
image:
description: Learn about the visual validation tests and how to run/setup them
keywords: babylon.js, diving deeper, contribution, contribute, open-source, validation, tests
further-reading:
video-overview:
video-content:
---

## Introduction

NOTE: This page requires revision. If you have any questions, please ask in the [forum](https://forum.babylonjs.com/).

Validation tests are visual tests that check that the rendering of a selection of playgrounds / demos are not broken by some of your changes.

You should normally simply run them as part of the standard build, or manually by browsing [http://localhost:1338/tests/validation](http://localhost:1338/tests/validation).

Should you need more in-depth knowledge of the process, this page is for you! Note however that we won't cover everything related to the visual tests but only the most relevant points.

## Validation test lists

A validation test list is a list of visual tests that should be run to guarantee some level of conformance from the code of the repo.

### List format

A validation test list is described in a JSON formatted file, each test being an entry of the **tests** array:

```json
{
  "root": "https://cdn.babylonjs.com",
  "tests": [
    {
      "title": "Procedural texture with NME",
      "playgroundId": "#8S19ZC#3",
      "renderCount": 2,
      "referenceImage": "procedural_nme.png",
      "threshold": 25,
      "errorRatio": 2.5,
      "excludeFromAutomaticTesting": true,
      "excludedEngines": ["webgpu"]
    }
    // ...
  ]
}
```

_Note_: the **root** url is the base url used to retrieve the code for the tests that have a non empty **scriptToRun** or **sceneFolder** entry, but we won't go into more details, we are only interested in tests based on a playground.

A test is simply a playground that is run by the validation engine. The outcome of the test is the comparison between the generated image and a reference image: if it differs too much, the test is flagged as "failed".

The list of the properties you can use to define a test are:

| Name                        | Mandatory | Default value if omitted | Description                                                                                                                                                                                                                  |
| --------------------------- | :-------: | :----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title                       |     x     |                          | the title of the test, will be displayed in the browser before the test                                                                                                                                                      |
| <nobr>playgroundId</nobr>   |     x     |                          | the playground id. You can omit the leading #, it will be automatically added if missing                                                                                                                                     |
| renderCount                 |           |            1             | the number of frames to render before applying the test                                                                                                                                                                      |
| referenceImage              |           |       "title".png        | the reference image to test the rendering with. Note that the default value is "title.png", **title** being the value of the title property!                                                                                 |
| threshold                   |           |            25            | the threshold value to check each pixel with. If the (absolute) difference between any of the r/g/b component of the rendered image and the reference image is >= threshold then the number of failing pixels is incremented |
| errorRatio                  |           |           2.5            | acceptable percentage of errors. If `num_failed_pixels * 100 / (width * height) > errorRatio`, the test is flagged as "failed"                                                                                               |
| excludeFromAutomaticTesting |           |          false           | If `true`, this test won't be run on the build server. Some tests must be excluded that way because they fail on the software emulator used by the build server                                                              |
| excludedEngines             |           |            []            | list of engines that must not run this test. Use `"webgl1"` for **WebGL 1**, `"webgl2"` for **WebGL 2** and `"webgpu"` for **WebGPU**                                                                                        |

### Creating new lists

The default list of visual tests is configured in the file **tests/validation/config.json** in the repo. This is the list that is used when using the default url [http://localhost:1338/tests/validation](http://localhost:1338/tests/validation).

However, other lists can be created: you simply need to create .json file(s) in the **tests/validation/** directory. For eg **tests/validation/webgpu.json**, which is a list used during the webgpu implementation.

The reference pictures used by the validation tests of the list must be located in a directory named after the list itself. So, if you have created a list `mylist.json`, you should create a directory `mylist/` under `tests/validation/ReferenceImages/` and put the reference pictures there.

## Running tests

The url to use to start the tests from a validation list is [http://localhost:1338/tests/validation](http://localhost:1338/tests/validation): it will run the tests from the default list (`config.json`).

The full format for this url is:

http://localhost:1338/tests/validation/?list=**LIST**&engine=**ENGINE**&test=**TITLE**&fromtest=**TITLE**&useReverseDepthBuffer=**[0|1]**&useNonCompatibilityMode=**[0|1]**&checkresourcecreation=**[0|1]**

- **LIST**: name of the list, without the `.json` part. If not provided, the default value is `config`
- **ENGINE**: name of the engine to run the list with. If not provided, the default value is `webgl2`. The allowed values are: `webgl1`, `webgl2` and `webgpu`
- test=**TITLE**: if provided, run only the test named **TITLE**
- fromtest=**TITLE**: if provided, run the test named **TITLE** and all the tests that follow it in the .json file
- useReverseDepthBuffer=**[0|1]**: if provided and set to `1`, all the tests will be run with `engine.useReverseDepthBuffer = true`
- useNonCompatibilityMode=**[0|1]**: if provided and set to `1`, all the tests will be run with `engine.compatibilityMode = false` (no effect in WebGL)
- checkresourcecreation=**[0|1]**: see explanations below

Note that the old syntax **http://localhost:1338/tests/validation/?TITLE** still works if you want to run a single test named **TITLE** from the default `config.json` list.

When running a list of tests, you will see a **Show only failed test** button in the upper right corner of the browser page: use this button to only show tests that failed. Note however that it hides the succeeded tests at the time you hit the button. If new tests succeed, you will see them. Click the button at the end of the run if you want an up to date list (or reclick it several times during the run).

## Check Resource Creation - WebGPU only

When adding `checkresourcecreation=1` to the test url, three specific checks are performed for each validation test (WebGPU only):

1. that the `engine.countersLastFrame.numEnableEffects` counter value is 0 for the last frame displayed
1. that the number of bind groups created during the last frame is 0 (`BABYLON.WebGPUCacheBindGroups.NumBindGroupsCreatedLastFrame`)
1. that there's no bundle created during the last frame (when in **non compatibility mode**) - `engine.countersLastFrame.numBundleCreationNonCompatMode` counter value is 0

When at least one of these checks is false an error is logged in the browser console.

Regarding _1/_ it's a bug to call `engine.enableEffect` with an `Effect` instead of a `DrawWrapper` in WebGPU so you should fix the problem if a test fails because of that.

Regarding _2/_ and _3/_, those are not errors per see, but when a rendering has been stabilized (there's no creation of new objects, effects, etc. each frame) you should not experience creation of new bind groups (they should be retrieved from the cache) and when in **non compatibility mode** (`engine.compatibilityMode = false`) no bundles should be created but reused instead. However, it's still possible to have _2/_ or _3/_ greater than zero for some validation tests. In that case, you should check if it's expected given the code of the PG or if it could be a problem on `Babylon.js` implementation side.

In order to reach a _stabilized state_ for a PG, the `renderCount` value is set to 50 for all PGs before running them (and the check is performed for the very last frame displayed). That means that the picture comparison would fail for a number of tests, so this comparison is disabled when in `checkresourcecreation=1` mode: if a validation test fails (you get a red cross icon for it instead of a green tick) it means at least one of the 3 checks described above failed (look at the console log for details).

As `engine.countersLastFrame.numBundleCreationNonCompatMode` has meaning on the **non compatibility mode** only, you will always want to also add `useNonCompatibilityMode=1` in the url when setting `checkresourcecreation=1` to check the creation of bundles.
