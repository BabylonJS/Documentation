---
title: Tags
image:
description: Learn all about tags in Babylon.js.
keywords: babylon.js, diving deeper, tags
further-reading:
video-overview:
video-content:
---

## Concepts

A tag? You may already have heard or read this word before. Let's look at some generic concepts.

### Tags are used:

- as an index term assigned to a piece of information
- to pass parameters to subroutines
- as components of the HTML markup language
- as labels for specific revisions of a project
- as unique identifiers in URI
- as links to other Facebook pages
  ...

(from [Wikipedia](http://en.wikipedia.org/wiki/Tag))

### Tags on forums / Categories

If you spend some time on forums (let's pick one randomly: [forum](https://forum.babylonjs.com);)), you may have noticed that tags are attached to topics (and sometimes to posts).
The author can write words (tags) to briefly describe the topic without having to write a grammatically correct sentence. It's essentially a list of words you might say during a brainstorming session after reading the post.

Thus, if you need information about, let's say, meshes, you can search for topics containing the word "mesh". But you could also search for topics tagged with "mesh". The word might never appear in the topic itself (or it might appear only in the title), but the author can still add it as a tag to categorize the topic.
Tags can be used to categorize/group things.

### CSS classes

OK...? What's the link with tags? Why are we about to talk about CSS classes?

Because CSS classes are useful, and Tags in Babylon.js can, in principle, be considered similar to CSS classes. So let's talk about them.

CSS stands for Cascading Style Sheets. It's used to define how to display HTML elements.

CSS classes are added to HTML elements (by writing them directly in the HTML code or by adding them via JavaScript) as a value of the `class` attribute of the corresponding HTML elements.

HTML elements can have several CSS classes in their `class` attribute, and the same CSS class can be used on different HTML elements. CSS classes, just like tags on forums, can then be used to categorize HTML elements. Thus, the same style (background, font, color...) can easily be applied to a group of HTML elements identified by a CSS class (or a list of CSS classes).

_Style for all HTML elements on the page with the "center" class (to find elements with a specific class, write a period character followed by the name of the class)_

```css
.center
{
    text-align: center;
    color: red;
}
```

Thanks to JavaScript, you can even retrieve all these elements and then do further JavaScript operations on them (jQuery plugins largely use CSS classes).

```javascript
const elements = document.getElementsByClassName(".center");
```

The above directive would gather a collection of all HTML elements that use the .center class.

Here we are! **Tags in Babylon.js can be used to categorize/group elements, and helper functions are provided to retrieve/gather tagged elements.**

## Integration to babylon.js

Tags were integrated into Babylon.js on April 7, 2014. [Pull request](https://github.com/BabylonJS/Babylon.js/pull/170#event-109351015)

### Pure javascript

The concept was expanded to allow tags to be added to any JavaScript object (not necessarily only objects created by Babylon.js). The `Tag` class that was added to Babylon.js contains all the necessary code for this generic concept ([TypeScript code](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Misc/tags.ts)) and internally uses the `AndOrNotEvaluator` class ([TypeScript code](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Misc/andOrNotEvaluator.ts)).

The use of tags for a JavaScript object can be enabled or disabled like this (JavaScript code):

```javascript
const myJSObj = {};
// enable tags for myJSObj
BABYLON.Tags.EnableFor(myJSObj);

// disable tags for myJSObj
BABYLON.Tags.DisableFor(myJSObj);
```

`EnableFor` adds functions to the JavaScript object in order to:

- test if it has tags `hasTags`
- add tags to it `addTags`
- remove tags from it `removesTags`
- test if it matches a tags query `matchesTagsQuery` (see below)

Those functions are proxies of static methods of `Tags` (`HasTags`, `AddTagsTo`, `RemoveTagsFrom` and `MatchesQuery`).

`Tags` also contains `GetTags`, which retrieves the array of tags for the JavaScript object.

Remark: `Tags.AddTagsTo` enables tags for the object if needed.

```javascript
const myJSObj1 = {};
// enable tags for myJSObj1
BABYLON.Tags.EnableFor(myJSObj); // => addTags is available on myJSObj1
// add tags to myJSObj1
myJSObj1.addTags("tag1 tag2"); // same as BABYLON.Tags.AddTagsTo(myJSObj1, "tag1 tag2"),

const myJSObj2 = {};
// add tags to myJSObj2 without having to enable tags for it first
BABYLON.Tags.AddTagsTo(myJSObj2, "tag1 tag2"); // addTags couldn't be used on myJSObj2 since tags were not previously enabled for myJSObj2
```

Tags query:

`Tags.MatchesQuery` (and `matchesTagsQuery` if tags are enabled for the JavaScript object) accepts a list of valid tags (see "Rules to respect"), including parentheses and boolean operators such as `(tag1 && (tag2 || tag4 || !tag5)) || !(!tag1) && !!!tag5`. The tags query is evaluated using `AndOrNotEvaluator`.

Full example:

```javascript
const myJSObj1 = {};
BABYLON.Tags.AddTagsTo(myJSObj1, "tag1 tag2");

const myJSObj2 = {};
BABYLON.Tags.AddTagsTo(myJSObj2, "tag3 tag4 tag5");

const myJSObj3 = {};
BABYLON.Tags.EnableFor(myJSObj3);

const myJSObj4 = {};

myJSObj4.hasTags(); // TypeError: undefined is not a function
BABYLON.Tags.HasTags(myJSObj4); // false

myJSObj3.hasTags(); // false
BABYLON.Tags.HasTags(myJSObj3); // false

myJSObj2.hasTags(); // true
myJSObj1.hasTags(); // true

myJSObj1.matchesTagsQuery("tag1"); // true
myJSObj1.matchesTagsQuery("tag2"); // true
myJSObj1.matchesTagsQuery("tag1 || tag2"); // true
myJSObj1.matchesTagsQuery("tag1 && tag2"); // true
myJSObj1.matchesTagsQuery("tag3"); // false
myJSObj1.matchesTagsQuery("!tag3"); // true
myJSObj1.matchesTagsQuery("tag1 && tag3"); // false
myJSObj1.matchesTagsQuery("tag1 || tag3"); // true
myJSObj1.matchesTagsQuery("tag1 && !tag3"); // true

myJSObj1.removeTags("tag1");

myJSObj1.matchesTagsQuery("tag1 && !tag3"); // false

myJSObj2.removeTags("tag4 tag3 tag5");

myJSObj2.hasTags(); // false

BABYLON.Tags.DisableFor(myJSObj2);

myJSObj2.hasTags(); // TypeError: undefined is not a function

myJSObj3.matchesTagsQuery(""); // false
myJSObj3.matchesTagsQuery(); // true

myJSObj4.matchesTagsQuery(""); // TypeError: undefined is not a function
myJSObj4.matchesTagsQuery(); // TypeError: undefined is not a function

BABYLON.Tags.MatchesQuery(myJSObj4, ""); // false
BABYLON.Tags.MatchesQuery(myJSObj4, undefined); // true
BABYLON.Tags.MatchesQuery(myJSObj4); // true
```

### Rules to respect

- the tags "true" and "false" are reserved and cannot be used as tags.
- a tag cannot start with "||", "&&", or '!'
- a tag cannot contain whitespaces

### Use in babylon.js

Since meshes are JavaScript objects, you can add tags to them and retrieve them according to a tags query.

```javascript
const meshes = myScene.getMeshesByTags("tag1 && (tag2 || tag4 || !tag5)) || !(!tag1) && !!!tag5");
```

All tags added to meshes, cameras, lights, and so on are saved to the scene files (see [.babylon file format](/setup/support/.babylonFileFormat)) and reloaded from them.

## What to do with them?

It's up to you!

You can use them to retrieve all the meshes that should be lit by the light "light1":

```javascript
const meshesToLightByLight1 = myScene.getMeshesByTags("mustBeLightedByLight1");
```

Or make green ghosts appear whenever you want:

```javascript
const ghosts = myScene.getMeshesByTags("ghost && green");

for (let index = 0; index < ghosts.length; index++) {
  ghosts[index].isVisible = true;
}
```
