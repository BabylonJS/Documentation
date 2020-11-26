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
        },
        ...
    ]
}
```
*Note*: the **root** url is the base url used to retrieve the code for the tests that have a non empty **scriptToRun** or **sceneFolder** entry, but we won't go into more details, we are only interested in tests based on a playground.

A test is simply a playground that is run by the validation engine. The outcome of the test is the comparison between the generated image and a reference image: if it differs too much, the test is flagged as "failed".

The list of the properties you can use to define a test are:

| Name | Mandatory | Default value if omitted | Description |
|------|:---------:|:------------------------:|-------------|
| title |    x     | | the title of the test, will be displayed in the browser before the test |
| <nobr>playgroundId</nobr> |   x   | | the playground id. You can omit the leading #, it will be automatically added if missing |
| renderCount | | 1 | the number of frames to render before applying the test |
| referenceImage | | "title".png | the reference image to test the rendering with. Note that the default value is "title.png", **title** being the value of the title property! |
| threshold | | 25 | the threshold value to check each pixel with. If the (absolute) difference between any of the r/g/b component of the rendered image and the reference image is >= threshold then the number of failing pixels is incremented |
| errorRatio | | 2.5 | acceptable percentage of errors. If `num_failed_pixels * 100 / (width * height) > errorRatio`, the test is flagged as "failed" |
| excludeFromAutomaticTesting | | false | If `true`, this test won't be run on the build server. Some tests must be excluded that way because they fail on the software emulator used by the build server |
| excludedEngines | | [] | list of engines that must not run this test. Use `"webgl1"` for **WebGL 1**, `"webgl2"` for **WebGL 2** and `"webgpu"` for **WebGPU** |

### Creating new lists

The default list of visual tests is configured in the file **tests/validation/config.json** in the repo. This is the list that is used when using the default url [http://localhost:1338/tests/validation](http://localhost:1338/tests/validation).

However, other lists can be created: you simply need to create .json file(s) in the **tests/validation/** directory. For eg **tests/validation/webgpu.json**, which is a list used during the webgpu implementation.

## Running tests

The url to use to start the tests from a validation list is [http://localhost:1338/tests/validation](http://localhost:1338/tests/validation): it will run the tests from the default list (`config.json`).

The full format for this url is: http://localhost:1338/tests/validation/?list=**LIST**&engine=**ENGINE**&test=**TITLE**&fromtest=**TITLE**
* **LIST**: name of the list, without the `.json` part. If not provided, the default value is `config`
* **ENGINE**: name of the engine to run the list with. If not provided, the default value is `webgl2`. The allowed values are: `webgl1`, `webgl2` and `webgpu`
* test=**TITLE**: if provided, run only the test named **TITLE**
* fromtest=**TITLE**: if provided, run the test named **TITLE** and all the tests that follow it in the .json file

Note that the old syntax **http://localhost:1338/tests/validation/?TITLE** still works if you want to run a single test named **TITLE** from the default `config.json` list.

When running a list of tests, you will see a **Show only failed test** button in the upper right corner of the browser page: use this button to only show tests that failed. Note however that it hides the succeeded tests at the time you hit the button. If new tests succeed, you will see them. Click the button at the end of the run if you want an up to date list (or reclick it several times during the run).