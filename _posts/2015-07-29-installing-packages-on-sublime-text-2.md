---
layout: post
title: "Installing Packages on Sublime Text 2"
author: "Kevin Hou"
date: 2015-07-29 10:02:30
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: configuration
tags: [sublime]
featured: "no"
---
It's actually very easy. I tried to install SublimeHighlight so that I could export/copy portions my code as a rich text files (RTF - Rich Text Formal) instead of plain text.
<br />

Steps:
<ol>
  <li>
    Install Package Control by opening up Sublime's consol (View --> Show Console) and paste the following:
    {% highlight javascript %}
    import urllib2,os,hashlib; h = 'eb2297e1a458f27d836c04bb0cbaf282' + 'd0e7a3098092775ccb37ca9d6b2e4b7d'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')
    {% endhighlight %}
    Press enter.
  </li>
  <li>
    Open Package Control under Sublime Text 2 --> Preferences --> Package Control
  </li>
  <li>
    Select "Package Control: Add Repository"
  </li>
  <li>
    Copy the github repository link. I used https://github.com/n1k0/SublimeHighlight/tree/python3
  </li>
  <li>
    Open Package Control again
  </li>
  <li>
    Select "Package Manager: Install Package"
  </li>
  <li>
    Select corresponding package. In my case it was "SublimeHighlight"
  </li>
  <li>
    Done! You can now use the package.
  </li>
</ol>

SublimeHighlight can be found <a href="https://github.com/n1k0/SublimeHighlight">here</a>
