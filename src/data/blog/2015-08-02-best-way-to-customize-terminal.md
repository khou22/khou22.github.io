---
title: "Customizing Your Terminal"
author: "Kevin Hou"
date: 2015-08-02 21:28:50
description: "Personalize your terminal shell, customize prompts manually, or upgrade to a zsh shell with oh-my-zsh and themes."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [terminal]
featured: false
---

Personalizing your Terminal environment can improve aesthetics and boost developer productivity. From setting a concise custom prompt manually in bash files, to using full frameworks such as Zsh, making your command line unique is one of the best ways to feel at home inside the development environment.

## Changing Your Terminal Prompt

One common configuration change is adjusting the Terminal prompt text. Typically, a default prompt might look like:

```bash
Computer-Name: User-Name ~
```

If you find this layout long or distracting, you can remove specific variables. Here are the configuration steps for a traditional Bash environment:

1. Go to your root directory.
2. Locate the initialization file named `.bash_profile`. This is a hidden file, which you can find by executing `$ ls -a`. If it does not exist yet, step 3 will both initialize and create it.
3. Run: `$ nano .bash_profile`
4. Add the line: `export PS1="\h: \w "`
5. Write the file out and terminate the editor: `Control + O`, `Return`, `Control + X`.
6. Restart your Terminal emulator.

Your output should resemble:
```bash
Computer-Name: ~
```

To obtain the cleanest aesthetic showing only the current directory:
`export PS1="\W "`

Which will display simply as:
```bash
~
```

For comprehensive lists of prompt settings, refer to [this reference guide](http://www.ibm.com/developerworks/linux/library/l-tip-prompt/). You can review supplementary configurations for [modifying terminal colors](http://it.toolbox.com/blogs/lim/how-to-fix-colors-on-mac-osx-terminal-37214).

---

## Upgrading to `oh-my-zsh`

For advanced configurations, frameworks like [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) offer higher-level productivity features. It features direct status indicator badges for Git directories, autocomplete modules, file format highlights, and expanded plugin capabilities.

It works great when installed alongside alternative clients, such as [iTerm 2](https://www.iterm2.com/) for macOS users.

Install scripts can be launched via either protocol option below:

### Curl Command
```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### Wget Command
```bash
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

### Themes

Theme profiles and color templates are available for inspection on the [iTerm2 Color Schemes repository](https://github.com/mbadolato/iTerm2-Color-Schemes). Relevant settings files reside within the `./schemes/` subdirectory. You can evaluate previews of the preset collection [here](http://iterm2colorschemes.com).
