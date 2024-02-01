---
title: "Comparison Operators: '==' vs. '==='"
author: "Kevin Hou"
date: 2015-09-08 21:41:46
description: "For the longest time, I didn't realize that '===' was a comparison operator in Javascript. I just recently learned what the difference between them was."
tags: [web]
---

For the longest time, I didn't realize that '===' was a comparison operator in Javascript. I just recently learned what the difference between them was. The double equal signs tell the comparison statement to convert the two values into the same type before comparing them. The triple equal signs do not convert the values before coimparing. If the two values do not share the same type, it will simply return false. For example:

```javascript
var num = 1;
var str = "1";
if (str == num) // Will return true
if (str === num) // Will return false
```

This is a super short post, but I figured I should write it down since it was interesting and something I should remember.
