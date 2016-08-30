---
layout: post
title: "Best Way to Customize Terminal"
author: "Kevin Hou"
date: 2015-08-02 21:28:50
description: "Customize your terminal shell to your liking. It'll look really cool."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [unix]
featured: "no"
---
I just did a post on customizing your Terminal look and feel using manual commands in your .bash_profile file, but I just came across a puggin called "oh-my-zsh" that makes it so much easier. I literally just installed it and my terminal came alive. It looks loads better! It recognizes github directories, color codes different file types, and does countless other things.
<br />
<br />
You can actually probably just scrap everything that I said in my previous blog post and just use oh-my-zsh. I installed oh-my-zsh on <a href="https://www.iterm2.com/">iTerm 2</a> — the terminal client that I use (and strongly recommend).
<br />
<br />
Oh-my-zsh is located here: <a href="https://github.com/robbyrussell/oh-my-zsh">https://github.com/robbyrussell/oh-my-zsh</a>
<br />
<br />
To install, simply use one of the following methods and type the command:
<b>Curl Method</b>
{% highlight bash %}
$: sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
{% endhighlight %}

or

<b>Wget Method</b>
{% highlight bash %}
$: sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
{% endhighlight %}
