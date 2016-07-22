---
layout: post
title: "Changing Your Terminal Prompt"
author: "Kevin Hou"
date: 2015-08-02 21:24:49
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [unix]
featured: "no"
---
I just learned how to customize my Terminal shell to my liking. My latest customization was to change the Terminal prompt. Typically, my prompt looked like:
 
Computer-Name: User-Name ~
 
This was just too long and cluttered my screen far too much. I set about to change this. Here are the steps to remove your user name:
 
1. Go to your route directory
2. Find the customizer file named ".bash_profile". This is a hidden file so it can only be seen by using "$ ls -a". If it is not there, do not worry, step 3 will both open and create it.
3. Type: "$ nano .bash_profile"
4. Type: "export PS1="\h: \w "
5. Now type: control + O, return, control + x
6. Restart your terminal
 
Your prompt should now look like:
Computer-Name: ~
 
For the cleanest look, use:
"export PS1="\W "
 
It will render:
~ 
 
 
For a complete list of customizations, see this link:
http://www.ibm.com/developerworks/linux/library/l-tip-prompt/
 
Here's a way of changing colors in your terminal:
http://it.toolbox.com/blogs/lim/how-to-fix-colors-on-mac-osx-terminal-37214