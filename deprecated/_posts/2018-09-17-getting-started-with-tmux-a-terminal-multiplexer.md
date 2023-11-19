---
layout: post
title: "Getting Started With TMUX: A Terminal Multiplexer"
author: "Kevin Hou"
date: 2018-09-17 10:26:07
description: "TMUX is a terminal multiplexer that allows you to have a GNU-like experience while staying entirely within your terminal client."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: configuration
tags: [terminal]
featured: "yes"
---
TMUX is a terminal multiplexer that allows you to have a GNU-like experience while staying entirely within your terminal client. It works hand in hand with VIM (or emacs) and gives you a lot of powerful tools that are typically only available to you if you use a GUI.

# Setup
``` bash
$ brew install tmux

$ tmux -V
# > tmux 2.7 when I did this
```

# Getting Started
1. Entering TMUX session: `$ tmux new` (Note: you must type `$ source activate` to use some packages, your Conda environment, etc.)
<img src="{{ "/media/blog/images/tmux/initialized.png" | prepend: site.baseurl }}" />

2. Exiting TMUX session: `$ tmux exit`. This is not the only way to return to your original terminal session. In fact, one of the strengths of TMUX is that you can run a TMUX session in the background.

## Using TMUX Commands
1. `Control + b` to enter a TMUX command. Nothing will visually change
2. After pressing `Control + b`, can type `:` to get the TMUX prompt

# Managing Sessions
After you've created a session, you can temporarily exit or `detatch` this session. To do this, press `Control + b` then `d` to detatch.

To see a list of suspended sessions, you can type `$ tmux ls`. To get back to a sesion, type `$ tmux attach-session -t <id>` (shortcut: `$ tmux a -t <id>`). You can also use `$tmux a #` to go to the most recent session.

<img src="{{ "/media/blog/images/tmux/session.png" | prepend: site.baseurl }}" />

## Switching Between Session
Once you're in a TMUX session, you can press `Control + b` and `s` to get a dialogue of the open sessions with a preview of what they look like. You can also use `Control + b` and `(`/`)` to move left/right between existing session. To get a read-only list from your main shell, you can type `$ tmux ls`.

To kill the session you're currently in, type: `Control + b` and `: kill-session`. You can also do this from your main shell: `$ tmux kill-session -t <name or id>`.

To kill all sessions, type: `$ tmux kill-server`.

## Naming
Instead of relying on ambiguous ID numbers, you can also attach names to session. To start a session using a name, type: `$ tmux new -s <name of session>`. To get back to that session, use the name of the session in place of the ID: `$tmux a -t <name of session>`.

# Panes
* Split horizontally: `Control + b` then `"`
* Split vertically: `Control + b` then `%`
* Move pane left/right: `Control + b` then `{`/`}`
* Move between panes using `Control + b` and any of the arrow keys
* Show pane numbers `Control + b` then `q`
* Switch to pane `Control + b`, `q`, then `<pane number>`
* Close pane: `Control + b` then `x`
* Resizing: `Control + b` then `:resize-p <direction> <num-cells>`. The direction is `-U`, `-D`, `-L`, or `-R` for up, down, left, and right, respectively.
* In my `.tmux.conf` file, I turned on mouse interaction so I can switch panes using my mouse clicks. You can also drag to resize panes.

# Copy Mode
One of the other strengths is that you can enter "copy mode" to copy certain parts of the terminal. To enter this mode, press `Control + b` and `[`. You can now navigate using VI bindings press `Enter` to copy. There are a number of helpful commands that you can use that can be found here: [https://tmuxcheatsheet.com](https://tmuxcheatsheet.com)


# References
* Handy [TMUX cheat sheet](https://tmuxcheatsheet.com)
