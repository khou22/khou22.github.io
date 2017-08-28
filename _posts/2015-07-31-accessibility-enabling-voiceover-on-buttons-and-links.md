---
layout: post
title: "Accessibility: Enabling Voiceover on Buttons and Links"
author: "Kevin Hou"
date: 2015-07-31 21:13:47
description: "Adding accessibility features to your website to allow for a wider audience."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [html]
featured: "no"
---
Today, I discovered accessibility and assistive technology. It's really an intriguing topic and is something I've never really thought about. I think it's important in this day and age to be cognicant of who owns what technology and who has access to what. I did a paper earlier this year on the digital divide, but I took the lense of age, gender, location, etc..not of ableness. My web app is almost ready to be packaged and shipped so it's time to start putting on the finishing touches. One of these is enabling voiceover.
<br />
<br />
<b>Assistive Text</b>
<br />
I'm sure a lot of people have tabbed through webpages before. It's great for forms, but it can be a huge pain tabbing through a web app. In order to make things more accessible, Salesforce.com has a premade class called "assistive-text" that hides the enclosing text within the tag, but still allows it to be voiced over.
<br />
<br />
I have an '\<a>' tag in my web app, and because it was an image, the voiceover function on the Mac couldn't read a label. To solve this, I added this right above the image inside of the parent div:
{% highlight html %}
<span className="assistive-text">Close</span>
{% endhighlight %}

Like I said earlier, the class keeps the text "Close" hidden from the UI. However, if you were to tab over to the image, the voiceover would speak "Close". It's a very useful tool to make your website more accessible to those visually impaired. To use voiceover, use the keyboard shortcut: Command + F5.

<b>Tab Index</b>
Another trick for accessibility is prioritizing the tab order. To change the order in which users tab through actionable items, add the property: tabIndex. The starting value is 0. For example to tab through these two things out of order, but starting with the second one, you would do:
{% highlight html %}
<button tabIndex=1>Button 1</button>
<button tabIndex=0>Button 2</button>
{% endhighlight %}

If you pressed tab, you would first highlight button 2 and then button 1.



I hope whoever reads this really takes this to heart and learns to appreciate something so remarkable as vision or health. It's important that we move forward as a society allowing the greatest number of people to effectively use technology. I am considering posting my paper of the digital divide since it's really a remarkable topic.
