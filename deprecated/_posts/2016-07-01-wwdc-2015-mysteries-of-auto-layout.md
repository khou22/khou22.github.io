---
layout: post
title: "WWDC 2015: Mysteries of Auto Layout"
author: "Kevin Hou"
date: 2016-07-01 16:33:27
description: "My notes and takeaways from the WWDC talk on auto layout from 2015. I know the video is a year old, but it was a good learning resource for me."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: ios
tags: [swift, xcode]
featured: "no"
---
Mysteries of Auto Layout, Part 1: <a href="https://developer.apple.com/videos/play/wwdc2015/218" target="_blank">https://developer.apple.com/videos/play/wwdc2015/218</a>
<br class="post-line-break">

Auto Layout Definition: Constraints lead to equations that layout your views automatically

<br class="post-line-break">
<h3 class="post-subheader">Maintanable Layouts</h3>
<ul>
  <li>Stack View - new to iOS 9</li>
  <li>Arrange views linearly, vertically</li>
  <li>Manages constraints of your subviews</li>
  <li>Horizontal or vertical</li>
  <li><ul>Stack Views are basically for grouping elements together
    <li>Distribution property - can distribute across the axis</li>
    <li>Example: Fill, fill equally, fill proportionally, etc.</li>
  </ul></li>
  <li><ul>Stack View options:
    <li>Axis: Vertical/horizontal</li>
    <li>Alignment: Fill (spread itself across entire space)/leading/center/leading</li>
    <li>Spacing (spacing between elements)</li>
  </ul></li>
  <li>Can stack within Stack Views</li>
  <li>After everything is stacked within the same Stack, can add constraints so it correctly fills the superview</li>
  <li>Control drag from Stack View to superview to add new constraints that will pin it to the screen edge</li>
  <li>New options: Content hugging priority, content compression resistance priority</li>
    <li><ul>Can resist changing sizes (useful for things like tab menus, buttons, etc.)</ul></li>
  <li>Start with Stack View, use constraints as needed</li>
<ul>

<h3 class="post-subheader">Changing Constraints</h3>
<ul>
  <li>Don’t add/remove constraints</li>
  <li>Instead, activate and deactivate constraints</li>
  <li><ul>Never deactivate self.view.constraints
    <li>Weird things will happen</li>
    <li>Keep references to constraints you need, don’t just blindly deactivate all of them</li>
  </ul></li>
  <li>Can animate constraints</li>
  <ul><li>Use self.view.layoutIfNeeded</li></ul>
</ul>

<h3 class="post-subheader">Create size constraints programmably</h3>
<ul>
  <li>intrinsicContentSize = automatically makes the size constraint the same size as the content within the view</li>
  <li>Use proportions — will likely be more successful</li>
  <ul><li>Don’t use points</li></ul>
</ul>

<h3 class="post-subheader">Constraint Priorities</h3>
<ul>
  <li>Don’t set a constraint as “required”</li>
  <li>Don’t use equal priorities</li>
  <li><ul>Set priorities a little higher or lower than the defaults:
    <li>Scale from: 1-1000</li>
    <li>Low: 250</li>
    <li>High: 750</li>
  </ul></li>
  <li>This is good for localization — stretching UILabels, etc.</li>
</ul>
