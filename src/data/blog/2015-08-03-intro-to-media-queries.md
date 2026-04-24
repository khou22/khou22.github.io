---
title: "Intro to Media Queries"
author: "Kevin Hou"
date: 2015-08-03 14:17:25
description: "A quick overview of media queries"
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [css, html]
featured: false
---
I just met with Brandon, from the UX Engineering department, to figure out font sizing using media queries. Media queries are essentially ways of setting thresholds within the CSS to change fonts, widths, etc. based off a given criteria.

Here's an example I used:
```css
@media (min-width: 640px) {
    font-size: 1.1rem;
};
   @media (min-width: 1024px) {
    font-size: 1.3rem;
};
```

The code above essentially takes in a criteria, in this case the width, and changes the font size accordingly. It triggers the CSS nested within the media query and applies it if the criteria is met. This block of code goes within the class like so:

```css
.className {
  ...
  @media (...) {
    ...
  }
}
```

This is very helpful when dealing with mobile, desktop, tablet, etc. users.
