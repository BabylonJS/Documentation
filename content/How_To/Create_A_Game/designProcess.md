# Summary
This is just a little bonus content if you're curious as to how I went about designing the game assets and what resources I used!

# References
Before I began any of the art asset creation, I used Pinterest to collect all of the resources I'd need. I had a bunch of different boards and made sure to save anything I thought could give me inspiration.

I made some really rough sketches of how I wanted the character and environment to look. The environment was the most vague as I wasn't sure in the beginning how I wanted the feel of the game to be. I went back in with more detail for the character reference to help with modeling.

![characterDesigns](/img/how_to/create-a-game/characterDesigns.jpeg)
![characterRef](/img/how_to/create-a-game/characterref.jpeg)

This is also where I started thinking about what color palette I wanted to use. Similar to the pixel-art games I usually make, I wanted to use a limited color palette to keep it consistent and bring everything together. Colors aren't usually my strength, so I just try to keep a set of colors I think work well together and go from there. This is where looking for color palettes on pinterest is really helpful.

# 3D Modeling with Blender
# Character
This area was the most new to me, so I spent a lot of time learning through studying youtube tutorial and speed modeling videos. The most challening part of this would have been the character modeling + rigging process. I modeled and rigged it several times until I was satisfied with the final outcome.

The first time was to get a player model done for animation and movement testing. The main problem I had was with clipping.
- When animated, the mesh had a lot of clipping since I made the body and clothes separately. The weight painting was a difficult process to try and minimize clipping as much as possible.
- This model also uses emissive materials rather than PBR (which means it would be self-lit), so in the final version I changed these to PBR since we needed the scene to be dark and lit by the lanterns and player's light only.

![firstModel](/img/how_to/create-a-game/firstModel.png)

The second one, I had troubles with the animations after rigging, so I decided to restart the whole process since my model must have been messed up somewhere. I referenced a ton of different rigging videos. Here are some of the videos were particularly helpful:
- [Royal Skies LLC Blender 2.8 Speed Tutorials](https://www.youtube.com/watch?v=f6vgICNCVxQ&list=PLZpDYt0cyiuu-sxJKbuYh8OjtgmXNacCV)

The third one is the one that's in the game right now! In order to fix the clipping problem I had with the other models, I joined all of the separate meshes. This made coloring the model really difficult, and I had to go back and clean up the areas where they were joined to make sure there weren't too many extra vertices. The weight painting process took a while, but at this point I was starting to get familiar with the process.

![finalModel](/img/how_to/create-a-game/finalPlayerModel.png)

These are some of the tutorials I watched for the animation process:
- [3D Animation Hub's Jump Animation](https://www.youtube.com/watch?v=VvTEovuTCgA)
- [Jayanam's Basic Running Cycle Tutorial](https://www.youtube.com/watch?v=0PkBq9NW7K8)

# Environment

Here are some of the youtubers I watched for inspiration on 3D Modeling environments!
- [Grant Abbitt](https://www.youtube.com/user/mediagabbitt)
- [Polygon Runway](https://www.youtube.com/channel/UCGSJevmBuDyxjLLOBNaYMGA)
- [MortMort's Gradient Texturing](https://www.youtube.com/watch?v=uOyiZaioX1U&list=PLR3Ra9cf8aV23C2oBB3aFLla6ABAPYiDk&index=5)

# 2D Art
I initially started out planning on using pixel art for all of the 2D assets, but I recently got this app called Procreate, so I wanted to try and see what I could do with it.

For the pixelart ui elements in the game, I used Aseprite with my wacom intuos drawing tablet, and for all of the other 2D art I used Procreate on my ipad air.

Both of these programs are amazing and have a bunch of different features that are really helpful. Both of these support animation, but aseprite can export your animation as a spritesheet, which was really helpful when bringing into babylon. Procreate can't create spritesheets so I had to bring them into piskelapp as a gif and then export as a spritesheet.

Procreate is really awesome to use, but I found that I had a lot of limitations when making the animations since I was limited to 25 layers which means I can only have a maximum of 25 frames if all of the lineart + coloring for each frame was done on one layer. Ultimately, I could only get to a max of about 12 frames for 1 animation. I use a lot of layers to keep things separate in case I need to change or move them later, especially since I had a few different elements that were going to be animated.

Both of these are paid programs, however there are free alteratives for each that I have used before:
- Pixel art
    - [Piskelapp](https://www.piskelapp.com/)
- Digital art
    - [Autodesk Sketchbook](https://www.sketchbook.com/)
    - [Krita](https://krita.org/en/)

# Resources
This is the pixel font I used for the dialogue. I always use this one for 2D games!  
Pixel font: [m5x7](https://managore.itch.io/m5x7) by Daniel Linssen

# Sounds
I wasn't able to get into sound development, but I have a list of different resources that include some free sound resources as well as some sites that let you experiment with music!
 - [Opengameart](https://opengameart.org/)
 - [Freesound](https://freesound.org/)
 - [Earslap](https://earslap.com/)
 - [BFXR](https://www.bfxr.net/)

If you're curious as to what songs and sound effects I used in the game:
 - Start/credits song: [copycat by syncopika](https://opengameart.org/content/copycat)
 - Game: [Christmas Synths](https://opengameart.org/content/happy-synths-loop-with-slight-christmas-feeling)
 - Pause: [Snowland Town by Matthew Pablo](https://opengameart.org/content/snowland-town)
 - Lose: [Eye of the Storm](https://opengameart.org/content/eye-of-the-storm)
 - SFX:
    - [Jump2 by LloydEvans09](https://freesound.org/people/LloydEvans09/sounds/187024/)
    - [Run/Walk](https://maysama.itch.io/free-footsteps-sound-effects)
    - [Fireworks](https://opengameart.org/content/25-cc0-bang-firework-sfx)
    - [Dash](https://freesound.org/people/potentjello/sounds/194081/)
    - [200 SFX](https://kronbits.itch.io/freesfx)
    - [Sound Pack](https://opengameart.org/content/level-up-power-up-coin-get-13-sounds)
    - [Selection](https://opengameart.org/content/8bit-menu-select)

# Further Reading
**Back to:** [Introduction](/how_to/page1)
