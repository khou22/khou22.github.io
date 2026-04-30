---
title: "OS X Shortcuts and Productivity Hacks"
author: "Kevin Hou"
date: 2015-12-25 12:59:02
description: "A collection of useful OS X tricks, productivity shortcuts, display hacks, and more to help improve your workflow efficiency."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [terminal, unix, macos, css]
featured: false
---
Happy holidays everyone! Here are some useful OS X tips and tricks that I thought I would share:

## 1) Command Line Shortcut: Aliases

Aliases in a traditional desktop UI are essentially shortcuts to other directories or files in your system. In general, they're used to access objects hidden deep within your file structure or when you want a file in two separate locations and you don't want to copy it over.

Aliases in your Terminal are similar in the sense that they provide shortcuts to files, but unlike in a traditional desktop UI, the aliases can be used at any level in the file system. An alias is not a shortcut file or folder. Instead it is a command that can be typed at any point.

For example, if I access the folder 'myFolder' often, I would create an alias to basically trigger the function 'cd /Users/Kevin/Documents/myFolder.' To do this, open '~/.bash_profile' and add the following line:

```bash
alias myFolderShortcut='cd /Users/Kevin/Documents/myFolder'
```

The .bash_profile file is a customizable list of user-contributed functions, aliases, etc. In some cases, the .bash_profile is loaded automatically when the Terminal starts, but I've found that mine doesn't do this. Instead I type: `source .bash_profile` whenever I first open a Terminal session.

Now, you can type `alias myFolderShortcut` anywhere in your Terminal session and you will be directed to myFolder.

## 2) Faster Mac Dock Productivity

The Mac Dock is a great and simple way to quickly access your favorite applications without having to open your Applications folder; however, the half a second it takes to trigger the Dock reveal and then the extra second it takes for the Dock to slide into view can waste precious time. I don't like having the Dock visible on my desktop because it takes up precious screen real estate. I found [this video](https://www.youtube.com/watch?v=ZaxkqlRE-NI) on Flipboard that explains how to correctly use the Mac Dock in the fastest and most efficient way possible:

<iframe width="640" height="360" src="https://www.youtube.com/embed/ZaxkqlRE-NI" frameborder="0" allowfullscreen></iframe>

Here is a screenshot of my setup:

![Faster Mac Dock Reveal](/media/blog/images/Faster%20Mac%20Dock%20Reveal.png)

## 3) Creating and Converting Plain Text Files on the Mac

Plain text files (ext. '.txt') are fantastic ways to remove styling on text, share information between apps, etc. I realized I didn't know how to create plain text files on my Mac. I researched it and found the solution to be quite simple. The stock Text Edit application on OS X has a native function to convert text files into plain text.

In TextEdit, navigate to Format->Make Plain Text. The keyboard shortcut command is: Command + Shift + T. It works similarly when converting Plain Text to Rich Text (ext. '.rtf'). If there is existing text, the application will prompt you with a warning before it converts.

## 4) Disabling Horizontal Screen Scrolling

When dealing with oddly-sized images or elements, they can introduce an unintended horizontal scrollbar, even if there is no content hanging off-screen. If inspecting your elements doesn't track down the source, you can disable horizontal scrolling by modifying the layout tags:

Simply add this to your CSS:
```css
html, body {
  max-width: 100%;
  overflow-x: hidden;
}
```

## 5) Monitor Tricks: Custom Resolutions and Mirroring

Here are a few useful OS X enhancements for handling multi-display configurations:

- **Display Hidden Screen Resolutions:** When accessing your display settings, go to `System Preferences` -> `Displays`. By default, only a few scaling options are shown. You can open additional resolutions by holding the **Option** key while clicking on the **Scaled** option.
- **Mirror Specific Monitors:** By default, triggering screen mirroring duplicates your primary display across external outputs. To set up selective mirroring (for example, in a 3-monitor system, mirroring Display 2 to Display 3), hold down the **Option** key while dragging a monitor icon over another in your Arrangement settings.

## 6) Square Image Cropping in Mac Preview

Another macOS technique that involves the **Option** key simplifies image manipulations. In Preview, to draw an equilateral bounding box or crop a picture symmetrically, hold both the **Option** and **Shift** keys while dragging your cursor selection.

This yields two separate behaviors:
- If applying to a present crop selection, it retains aspect ratio scaling.
- If drawing a fresh marquee, it results in a perfectly-proportioned square frame.

---
Hope this helped!
