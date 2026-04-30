---
title: "WWDC 2015: Mysteries of Auto Layout"
author: "Kevin Hou"
date: 2016-07-01 16:33:27
description: "My notes and takeaways from the WWDC talk on auto layout from 2015. I know the video is a year old, but it was a good learning resource for me."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [swift, xcode]
featured: false
---
Mysteries of Auto Layout, Part 1: [https://developer.apple.com/videos/play/wwdc2015/218](https://developer.apple.com/videos/play/wwdc2015/218)

Auto Layout Definition: Constraints lead to equations that layout your views automatically

### Maintainable Layouts
- Stack View - new to iOS 9
- Arrange views linearly, vertically
- Manages constraints of your subviews
- Horizontal or vertical
- Stack Views are basically for grouping elements together
  - Distribution property - can distribute across the axis
  - Example: Fill, fill equally, fill proportionally, etc.
- Stack View options:
  - Axis: Vertical/horizontal
  - Alignment: Fill (spread itself across entire space)/leading/center/leading
  - Spacing (spacing between elements)
- Can stack within Stack Views
- After everything is stacked within the same Stack, can add constraints so it correctly fills the superview
- Control drag from Stack View to superview to add new constraints that will pin it to the screen edge
- New options: Content hugging priority, content compression resistance priority
  - Can resist changing sizes (useful for things like tab menus, buttons, etc.)
- Start with Stack View, use constraints as needed

### Changing Constraints
- Don’t add/remove constraints
- Instead, activate and deactivate constraints
- Never deactivate self.view.constraints
  - Weird things will happen
  - Keep references to constraints you need, don’t just blindly deactivate all of them
- Can animate constraints
  - Use self.view.layoutIfNeeded

### Create size constraints programmably
- intrinsicContentSize = automatically makes the size constraint the same size as the content within the view
- Use proportions — will likely be more successful
  - Don’t use points

### Constraint Priorities
- Don’t set a constraint as “required”
- Don’t use equal priorities
- Set priorities a little higher or lower than the defaults:
  - Scale from: 1-1000
  - Low: 250
  - High: 750
- This is good for localization — stretching UILabels, etc.
