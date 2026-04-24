---
title: "Restarting a CSS3 Animation with Javascript in React"
author: "Kevin Hou"
date: 2015-07-31 21:07:45
description: "Restarting a CSS3 Animation with Javascript in React"
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [javascript]
---
I've been working on animation in my project at Salesforce.com and I came across a challenge with animation. It's very easy to trigger animation using react props and states, but reseting animations are a different beast. In non-React Javascript, the solution would be:

```javascript
document.getElementById("tagID").classList.remove("animationClass")
document.getElementById("tagID").classList.add("animationClass")
```

This would essentially just remove the class and then re-add it, effectively creating a "new" animation and reseting the cycle. However, React outsmarts this and doesn't recognize the toggled class. To overcome this obstacle use a setTimeout to delay adding the class. After it has been removed for a few milliseconds, re-add it. Example:

```javascript
document.getElementById("tagID").classList.remove("animationClass")
setTimeout(function() {document.getElementById("tagID").classList.add("animationClass");}, 50);
```

This will outsmart react into thinking the animation was indeed removed. It will reset the animation before you start it again. Hope this helps!
