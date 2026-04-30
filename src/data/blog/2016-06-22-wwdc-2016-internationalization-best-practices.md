---
title: "WWDC 2016: Internationalization Best Practices"
author: "Kevin Hou"
date: 2016-06-22 18:15:41
description: "My thoughts, notes, and main takeaways about the WWDC workshop on internationalization."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [swift, xcode, reflection]
featured: false
---

Video (must be played in Safari): <https://developer.apple.com/videos/play/wwdc2016/201/>

### Formatters for Dates/Times

- Don’t use a set date format
- Chinese and English are opposite for example
- Can’t have a fixed format
- Use the predefined .shortStyle/.mediumStyle/etc.
- Works for both dates and times
- Automatically formats it for each language
- Can use a template for custom things
- But use .setLocalizedDateFormatFromTemplate(“mYd”)
- Will try and make it correct when it’s a different language
- <https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSDateFormatter_Class/>

### Formatters for Names

- Show names the correct way with PersonNameComponents()
- Ask for the .long/.medium/.short/.abbreviated format
- Will support different langauges
- Name parsing → full name to a set of components
- Uses a statistical model
- Not parsing based on a formula
- Supports multiple languages

### Other

- In labels, don’t clip lines — must have the entire character showing
- Multi-line labels, consider changing the line spacing
- UIFont.preferredFont(forTextStyle: UIFontTextStyleBody)
- Automatically adjusts line height for different languages
- Icons are really important
- Avoid using words/numbers in icons
- “Photos” is a good example of an icon that doesn't tie it to a specific language
- Not left to right or right to left
- Good for all languages
- Create dedicated artwork for right to left languages
- But if you just want to flip the image, you can use the existing API
- App Store Names
- Users are most likely to download apps in their language
- Don’t always assume users will type in English
- They might run OS in English, use keyboard from another language
- Must test this before deploying
- Localized Screenshots
- Localized content/keyboard
- Want to see the experience they will have in their language
- Custom features — examples:
- Support for lunar calendar
- Templates for non-English/non-Western cultures

### Types of Formatters

1. ByteCountFormatter
2. DateFormatter
3. DateComponentsFormatter
4. DateIntervalFormatter
5. NumberFormatter
6. PersonNameComponentsFormatter
7. MeasurementFormatter
