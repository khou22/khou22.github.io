---
title: "CSS Quick Reference: Media Queries, Backgrounds, and Filters"
author: "Kevin Hou"
date: 2015-08-03 14:17:25
description: "A combined reference for essential CSS techniques: media queries, background images, and CSS3 filters."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [css, html, reactjs]
featured: false
---

A collection of short CSS snippets covering fundamental styling rules, from responsive typography adjustments to visual effects.

## Media Queries

I just met with Brandon from the UX Engineering department to figure out font sizing using media queries. Media queries are essentially ways of setting thresholds within the CSS to change fonts, widths, etc., based on a given criteria.

Here's an example:

```css
@media (min-width: 640px) {
    font-size: 1.1rem;
}

@media (min-width: 1024px) {
    font-size: 1.3rem;
}
```

The code above takes in a criteria—in this case, the width—and changes the font size accordingly. It triggers the CSS nested within the media query and applies it if the criteria is met. This block of code can be written within the class selector in preprocessors like SASS/SCSS, or natively in modern CSS:

```css
.className {
  /* ... styles ... */

  @media (min-width: 640px) {
    /* ... nested media overrides ... */
  }
}
```

This is extremely helpful when managing consistent designs across mobile, desktop, and tablet users.

---

## Setting a Background Image

Here is how you set a background image to cover the entire screen using HTML and CSS. The image will adjust based on the size of your browser window.

### HTML

```html
<div class="background"></div>
```

### CSS

```css
.background {
    height: 100%;
    background-image: url("imageURL");
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: 50% 0%;
    position: relative;
    top: 0rem;
    bottom: 0rem;
    margin-top: 0rem;
}
```

The `background-size` property is unique in that the values used here are often either `contain` or `cover`. 

* **Cover** will fill the entire div, scaling and zooming the content to ensure zero empty space.
* **Contain** will fit the image to either the width or height, whichever is the limiting agent, filling remaining space with the container background color.

---

## CSS Filters and Glass Effects

When creating custom web designs without external layout frameworks, doing custom CSS from scratch offers complete control over element presentation. For example, a sheet of glass look with semi-transparent background elements and borders can be created with modern CSS rules:

```css
.glass {
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid;
  border-bottom-color: #ccc;
  border-bottom-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
```

This setup can easily be customized by changing the values of the background-color, border-color, etc. For example, if your text is white, you can change it to have a darker tint of gray:

```css
background-color: rgba(100, 100, 100, 0.2);
```

### Image Filters

Another useful feature of CSS3 is image filters (similar to filters you'd find in photography or photo editing apps).

Here's an example of a grayscale filter combined with a blur:

```css
.filtered-image {
  -webkit-filter: grayscale(0.5) blur(10px);
  filter: grayscale(0.5) blur(10px);
}
```

Or as an inline style using ReactJS:

```javascript
const backgroundBlur = {
  WebkitFilter: 'grayscale(0.5) blur(7px)',
  filter: 'grayscale(0.5) blur(7px)'
};
```

Hope this helps.
