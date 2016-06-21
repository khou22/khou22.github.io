---
layout: post
title: "Internationalizing Your iOS App in XCode 7"
author: "Kevin Hou"
date: 2016-06-20 18:16:44
description: ""
category:
tags: []
featured: "no"
---
# Localization in Swift XCode 7.3.1
*** This is a blog post in progress ***
# Prepare XCode Project
Go to the project page → Localizations → Add a new language and select all the resources
Sometimes the storyboards aren’t all localized. If that’s the case, you must manually localize storyboards. To do this, on the info panel on the right, can press localize and add the languages you want.

# Prepping Code
This is for hard coded strings in the code
You can wrap them in: NSLocalizedString(String, comment: String)

# Adding in translations
To Export:
Delete Localizable.strings in parent so that there's no duplicate
Change the .xliff file (found it useful to use a simple IDE like Atom or Sublime to quickly change text. I added in 'French: ' at the beginning of every translation so that I would know when the app recognizes a NSLocalizedString type)

# To Import:
Import the .xliff file
Add the newly created Localizable.strings file (in the parent) to the build phases (Target --> Build Phases --> Copy Bundle Resources --> Add) — http://fullscreensoftware.blogspot.co.il/2011/09/xcode-4-and-localizablestrings-issue.html
Build and run

# To add other languages:
Localize the “Localizable.strings” file and replace the content with the translations for that specific language

# *** For Line Breaks ***
Typically denoted by a “\n” in the code
It doesn't format correctly in the .xliff file
When you import it back into the project, it won’t recognize your translation. Instead, modify the Localizable.strings file directly. Syntax as such:
“{Original…}\n{Original…}”=“French: {Original…}\n{Original…}”
You must add in the “\n”s because Swift exports the “\n”s as actual line breaks, but doesn’t convert the line breaks back into “\n”s on import

Solution:
Change ‘\n’ to another placeholder like ‘[[n’
Before it is injected into the frontend, replace all instances of ‘[[n’ to ‘\n’
