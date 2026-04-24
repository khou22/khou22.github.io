---
title: "Jekyll On El Capitan (OS X 10.11)"
author: "Kevin Hou"
date: 2015-10-09 23:53:42
description: "Fixing Jekyll on after upgrading to OS X 10.11, ie. El Capitan"
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [macos]
featured: false
---
I upgraded to OS X 10.11, officially called El Capitan, this past week and discovered a concerning bug when building my site. My terminal was unable to recognize the initiator term: "jekyll."

```bash
$: jekyll
zsh: command not found: jekyll
```

I believe this is due to a new system security setting that prohibits ruby gems from being downloaded in the traditional way. For anyone wondering how to fix this, I found the solution after poking around online:

![OSX 10.11 Jekyll](https://khou22.github.io/media/blog/images/OSX%2010.11%20Jekyll.png)

In your terminal, simply type in:
```bash
$: sudo gem install -n /usr/local/bin jekyll
```

Hope this helps! Now you can continue enjoying Jekyll while embracing the new OS X operating system.
