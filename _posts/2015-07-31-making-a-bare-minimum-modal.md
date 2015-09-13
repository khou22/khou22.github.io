---
layout: post
title: "Making a Bare Minimum Modal"
author: "Kevin Hou"
date: 2015-07-31 11:05:17
description: ""
category: Programming
tags: [html, css]
featured: "no"
---
Here is the code for a bare minimum popup modal:
 
HTML:
{% highlight html %}
<div aria-hidden="false" role="dialog" className="modal">
  <div className="modal__container">
    <div className="modal__header">
          Header
     </div>
     <div className="modal__content">
          Content
     </div>
     <div className="modal__footer">
          Footer
     </div>
   </div>
   <div className="modal-backdrop">
   </div>
</div>
{% endhighlight %}
 
CSS:
{% highlight css %}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9001;
  &__container {
    position: relative;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    margin: auto;
    padding: 3rem;
    border-radius: .25rem;
    width: 50%;
    max-width: 40rem;
    min-width: 20rem;
    height: 100%;
  }
  &__header {
    flex-shrink: 0;
    border: 1px solid black;
  }
  &__content {
    padding-top: 2rem;
    padding: 1rem;
    overflow: hidden;
    overflow-y: auto;
    border: 1px solid black;
  }
  &__footer {
    border-top: 2px solid grey;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
    padding: .75rem;
    text-align: right;
    border: 1px solid black;
  }
  &-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9000;
    visibility: visible;
    opacity: 1;
  }
}
{% endhighlight %}
