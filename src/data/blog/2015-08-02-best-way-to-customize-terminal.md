---
title: "Best Way to Customize Terminal"
author: "Kevin Hou"
date: 2015-08-02 21:28:50
description: "Customize your terminal shell to your liking. It'll look really cool."
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [terminal]
featured: false
---
I just did a post on customizing your Terminal look and feel using manual commands in your .bash_profile file, but I just came across a puggin called "oh-my-zsh" that makes it so much easier. I literally just installed it and my terminal came alive. It looks loads better! It recognizes github directories, color codes different file types, and does countless other things.

You can actually probably just scrap everything that I said in my previous blog post (I'm older and wiser now) and just use oh-my-zsh. I installed oh-my-zsh on [iTerm 2](https://www.iterm2.com/) — the terminal client that I use (and strongly recommend).

Oh-my-zsh is located here: [https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

To install, simply use one of the following methods and type the command:
### Curl Method
```bash
$: sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

or

### Wget Method
```bash
$: sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

## Themes
You can download terminal themes and color schemes from their [GitHub](https://github.com/mbadolato/iTerm2-Color-Schemes). The files for color presets can be imported from `./schemes/". You can browse screenshots of all the color schemes [here](http://iterm2colorschemes.com).
