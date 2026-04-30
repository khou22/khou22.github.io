---
title: "React Lifecycle Event: componentWillReceiveProps"
author: "Kevin Hou"
date: 2015-08-03 23:39:39
description: "An overview of one of ReactJS's useful lifecycle events: componentWillReceiveProps"
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [reactjs]
featured: false
---

<div class="my-6 p-4 border-l-4 border-orange-500 bg-orange-500/10 rounded-r-lg flex flex-col gap-2" style="background-color: rgba(218, 141, 15, 0.08); border-left: 4px solid rgb(218, 141, 15); border-radius: 0 8px 8px 0;">
  <div class="flex items-center gap-2 font-medium text-lg text-orange-500" style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: rgb(218, 141, 15);">
    <svg class="w-5 h-5 fill-current flex-shrink-0" style="width: 20px; height: 20px; fill: currentColor;" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
    <span>Deprecation Notice</span>
  </div>
  <p class="text-base leading-relaxed my-0 py-0" style="margin: 0; color: #374151;">
    As of React 16.3, <code>componentWillReceiveProps</code> has been deprecated and was subsequently removed in React 17. Modern React applications should utilize <code>getDerivedStateFromProps</code> or functional components with the <code>useEffect</code> hook instead.
  </p>
</div>

I discovered a pretty useful lifecycle event in React. I've typically only stuck to `getInitialState`, `componentWillMount`, and `Render`, but I just discovered `componentWillReceiveProps`.

This essentially gets called every time the component will receive a new or updated prop. This is really useful when you want to set a state equal to prop more than once in its lifecycle. The syntax is:

```javascript
componentWillReceiveProps(props) {
  ...
}
```

Try this out when you can! It's really useful.
