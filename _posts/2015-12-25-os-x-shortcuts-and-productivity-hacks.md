---
layout: post
title: "OS X Shortcuts and Productivity Hacks"
author: "Kevin Hou"
date: 2015-12-25 12:59:02
description: "A few useful OS X tricks that will help speed up your efficiency."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: configuration
tags: [unix, osx]
featured: "no"
---
Happy holidays everyone! Here are some useful OS X tips and tricks that I thought I would share:
<br><br>
<h2>1) Command Line Shortcut: Aliases</h2>
Aliases in a traditional desktop UI are essentially shortcuts to other directories or files in your system. In general, they're used to access objects hidden deep within your file structure or when you want a file in two seperate locations and you don't want to copy it over.
<br><br>
Aliases in your Terminal are similar in the sense that they provide shortcuts to files, but unlike in a traditional desktop UI, the aliases can be used at any level in the file system. An alias is not a shortcut file or folder. Instead it is a command that can be typed at any point.
<br><br>
For example, if I access the folder 'myFolder' often, I would create an alias to basically trigger the function 'cd /Users/Kevin/Documents/myFolder.' To do this, open '~/.bash_profile' and add the following line:
{% highlight bash %}
alias myFolderShortcut='cd /Users/Kevin/Documents/myFolder'
{% endhighlight %}
<br>
The .bash_profile file is a customizable list of user-contributed functions, aliases, etc. In some cases, the .bash_profile is loaded automatically when the Terminal starts, but I've found that mine doesn't do this. Instead I type: {% highlight bash %}source .bash_profile{% endhighlight %} whenever I first open a Terminal session.
<br><br>
Now, you can type {% highlight bash %}alias myFolderShortcut{% endhighlight %} anywhere in your Terminal session and you will be directed to myFolder.
<br><br>
<h2>2) Faster Mac Dock Productivity</h2>
The Mac Dock is a great and simple way to quickly access your favorite applications without having to open your Applications folder; however, the half a second it takes to trigger the Dock reveal and then the extra second it takes for the Dock to slide into view can waste precious time. I don't like having the Dock visible on my desktop because it takes up previous screen real estate. I found <a href="https://www.youtube.com/watch?v=ZaxkqlRE-NI">this video</a> on Flipboard that explains how to "correclty" use the Mac Dock in the fastest and most efficient way possible:
<iframe width="640" height="360" src="https://www.youtube.com/embed/ZaxkqlRE-NI" frameborder="0" allowfullscreen></iframe>
<br>
Here is a screenshot of my setup:
<img src="./../../../../media/blog/images/Faster Mac Dock Reveal.png" />
<br><br>

<h2>3) Creating and Converting Plain Text Files on the Mac</h2>
Plain text files (ext. '.txt') are fantastic ways to remove styling on text, share information between apps, etc. I realized I didn't know how to create plain text files on my Mac. I researched it and found the solution to be quite simple. The stock Text Edit application on OS X has a native function to convert text files into plain text.
<br><br>
In TextEdit, navigate to Format->Make Plain Text. The keyboard shortcut command is: Command + Shift + T. It works similarly when converting Plain Text to Rich Text (ext. '.rtf'). If there is existing text, the application will prompt you with a warning before it converts.
<hr>
Hope this helped!
