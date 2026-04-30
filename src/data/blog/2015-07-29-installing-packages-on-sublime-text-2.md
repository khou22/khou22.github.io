---
title: "Sublime Text Setup: Package Control & Babel/JSX Highlighting"
author: "Kevin Hou"
date: 2015-07-29 10:02:30
description: "A guide to installing packages and configuring React syntax highlighting in Sublime Text."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [packageManager, reactjs]
featured: false
---
Setting up a robust development environment in Sublime Text is actually very easy. This guide covers setting up Package Control to install extra packages, installing the `SublimeHighlight` package, and adding React syntax highlighting with Babel.

## Installing Package Control

Package Control makes managing and installing extra packages in Sublime Text simple.

### Steps

1. Install Package Control by opening up Sublime's console (`View` --> `Show Console`) and paste the following:
   ```python
   import urllib2,os,hashlib; h = 'eb2297e1a458f27d836c04bb0cbaf282' + 'd0e7a3098092775ccb37ca9d6b2e4b7d'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')
   ```
   Press enter.
2. Open Package Control under `Sublime Text 2` --> `Preferences` --> `Package Control`.
3. Select **Package Control: Add Repository**.
4. Copy the GitHub repository link. For example: `https://github.com/n1k0/SublimeHighlight/tree/python3`.
5. Open Package Control again.
6. Select **Package Manager: Install Package**.
7. Select corresponding package. In my case it was **SublimeHighlight**.
8. Done! You can now use the package.

`SublimeHighlight` allows exporting or copying portions of code as a rich text format (RTF) snippet rather than plain text. You can find it [here](https://github.com/n1k0/SublimeHighlight).

---

## React Syntax Highlighting (Babel Sublime)

If you're working with the JavaScript framework React, a reliable syntax highlighter in your text editor makes development much easier.

**Babel-Sublime** is integrated with Sublime Text and provides robust syntax highlighting for ES6 and JSX code.

### Installation

You can install it easily via Package Control:

1. Open Package Control (`Cmd + Shift + P` on macOS or `Ctrl + Shift + P` on Windows/Linux).
2. Select **Package Control: Install Package**.
3. Search for `Babel` and press Enter.

You can view the project repository and usage notes at:
[https://github.com/babel/babel-sublime](https://github.com/babel/babel-sublime)

This package is highly recommended for writing React in Sublime!
