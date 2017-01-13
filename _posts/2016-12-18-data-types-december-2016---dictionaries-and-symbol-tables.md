---
layout: post
title: "Data Types December 2016: Dictionaries and Symbol Tables"
author: "Kevin Hou"
date: 2016-12-18 14:57:26
description: "An overview of dictionaries/symbol tables and how they are useful."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [ios, swift]
featured: "no"
---
Recently, I’ve been learning a lot about different data structures to use in programs. Many of the common, most applicable, include linked lists, stacks, queues, double linked lists, and symbol tables. In this post I will give a brief overview of symbol tables, also known as dictionaries or hash maps, and provide some instances where symbol tables can greatly improve the quality of your code. When implemented correctly, this simple data type can improve efficiency, code readability, and run time.
<br class="post-line-break">
<h3 class="post-subheader">What are dictionaries and symbol tables?</h3>
In a nutshell, a dictionary is a data type where a key and a value are matched. In order to access a value, you provide a key. To store a value, you map a key to a value. To cycle through all values in the array, you again must use keys. The easiest analogy for understanding how a dictionary works is to use just that: a dictionary.
<br class="post-line-break">
<br />
At it’s most basic form, a dictionary is a database of words that are assigned a definition. To find the meaning of a word, you must first look up the word. The word and its definition serve as the key and its value, respectively. In code, the value can be any data type. In some languages (i.e. Java), the data type is immutable and consistent across all values. In other languages (i.e. Javascript), the data type can vary from key to key and from word to word.
<br class="post-line-break">
<br />
In both cases described above, both the key and the value can take on any data type. For example, the analogy of a dictionary describes Strings mapped to Strings; however, that’s not always the case. For example, the best data structure for storing birthdays, is a String (the person’s name) mapped to a date type (the person’s birthday). For a frequency table of letters, the letter can be either a character, integer, or String and its values take on the form of integers.
<br />
<h3 class="post-subheader">Example Syntaxes</h3>
<b>Javascript:</b><br />
{% highlight javascript %}
var dictionary = []; // Create an empty array
dictionary.push({ // Add an value to the dictionary
    key:    "keyName",
    value:  "the value"
});
{% endhighlight %}
<br />
<b>Swift:</b><br />
{% highlight swift %}
let dictionary = [ // New dictionary
  "keyName"       : "the value",
  "keyName"       : "the value"
]
dictionary.append("keyName" : "the value") // Add new item to dictionary
{% endhighlight %}
<br class="post-line-break">
<b>Java:</b><br />

<br />
<b>Python:</b><br />

<br class="post-line-break">
<h3 class="post-subheader">General Use Cases and Benefits</h3>
I’ve found more and more use cases in the past couple of weeks for dictionaries. It’s often very useful when you have to store a potentially uncapped number of items that aren’t easily mapped to an index of an array. Unlike searching for items within traditional arrays which take linear time, dictionary calls are of constant time.
<br class="post-line-break">
Sometimes, items either simply cannot be matched to an integer index or prove too complicated to map to an ordered list of integers. Instead, it can be much easier to call values based off of their keys.
<br class="post-line-break">
<h3 class="post-subheader">Examples</h3>
Here are a variety of instances where they can used:
<ol>
  <li>Retrieving data that doesn’t have an order</li>
  <li>Storing data that is faster with a reference key instead of an index</li>
  <li>Matching two different data types - connecting a enum value to an object type</li>
  <li>Pairing opposites so that you can use one to reference the other (“[“ matches to “]”)</li>
</ol>
