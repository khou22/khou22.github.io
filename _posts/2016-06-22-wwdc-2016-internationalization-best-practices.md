---
layout: post
title: "WWDC 2016: Internationalization Best Practices"
author: "Kevin Hou"
date: 2016-06-22 18:15:41
description: "My thoughts, notes, and main takeaways about the WWDC workshop on internationalization."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [swift, ios, xcode]
featured: "no"
---
Video (must be played in Safari): <a href="https://developer.apple.com/videos/play/wwdc2016/201/" target="_blank">https://developer.apple.com/videos/play/wwdc2016/201/</a>

<br class="post-line-break">
<h3 class="post-subheader">Formatters for Dates/Times</h3>
<ul>
  <li>Don’t use a set date format</li>
  <li>Chinese and English are opposite for example</li>
  <li>Can’t have a fixed format</li>
  <li>Use the predefined .shortStyle/.mediumStyle/etc.</li>
  <li>Works for both dates and times</li>
  <li>Automatically formats it for each language</li>
  <li>Can use a template for custom things</li>
  <li>But use .setLocalizedDateFormatFromTemplate(“mYd”)</li>
  <li>Will try and make it correct when it’s a different language</li>
  <li>https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSDateFormatter_Class/</li>
</ul>
<br class="post-line-break">
<h3 class="post-subheader">Formatters for Names:</h3>
<ul>
  <li>Show names the correct way with PersonNameComponents()</li>
  <li>Ask for the .long/.medium/.short/.abbreviated format</li>
  <li>Will support different langauges</li>
  <li>Name parsing → full name to a set of components</li>
  <li>Uses a statistical model</li>
  <li>Not parsing based on a formula</li>
  <li>Supports multiple languages</li>
</ul>

<br class="post-line-break">
<h3 class="post-subheader">Other:</h3>
<ul>
  <li>In labels, don’t clip lines — must have the entire character showing</li>
  <li>Multi-line labels, consider changing the line spacing</li>
  <li>UIFont.preferredFont(forTextStyle: UIFontTextStyleBody)</li>
  <li>Automatically adjusts line height for different languages</li>
  <li>Icons are really important</li>
  <li>Avoid using words/numbers in icons</li>
  <li>“Photos” is a good example of an icon that doesn't tie it to a specific language</li>
  <li>Not left to right or right to left</li>
  <li>Good for all languages</li>
  <li>Create dedicated artwork for right to left languages</li>
  <li>But if you just want to flip the image, you can use the existing API</li>
  <li>App Store Names</li>
  <li>Users are most likely to download apps in their language</li>
  <li>Don’t always assume users will type in English</li>
  <li>They might run OS in English, use keyboard from another language</li>
  <li>Must test this before deploying</li>
  <li>Localized Screenshots</li>
  <li>Localized content/keyboard</li>
  <li>Want to see the experience they will have in their language</li>
  <li>Custom features — examples:</li>
  <li>Support for lunar calendar</li>
  <li>Templates for non-English/non-Western cultures</li>
</ul>
<br class="post-line-break">
<h3 class="post-subheader">Types of Formatters:</h3>
<ol>
  <li>ByteCountFormatter</li>
  <li>DateFormatter</li>
  <li>DateComponentsFormatter</li>
  <li>DateIntervalFormatter</li>
  <li>NumberFormatter</li>
  <li>PersonNameComponentsFormatter</li>
  <li>MeasurementFormatter</li>
</ol>
