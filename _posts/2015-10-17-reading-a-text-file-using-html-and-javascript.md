---
layout: post
title: "Reading a Text File Using HTML and Javascript"
author: "Kevin Hou"
date: 2015-10-17 20:55:04
description: "Uploading a text file and sorting it into a string"
category: Programming
tags: [html, javascript]
featured: "no"
---
I just started working on a project that will analyze the user's text and look for patterns, word usage, etc. My first hurdle was creating a system in which the user can upload a text file and have the server read it as a string.

After a lot of piecing together research online, I think I've found the answer.

Start with a simple HTML form input. This form will accept a tag and, when submitted, will run the function "loadFile." I am using ReactJS so I had to bind the function to the parent.

<br />

{% highlight html %}
<form onSubmit={this.loadFile.bind(this)}>
  Select text file: <input type="file" id="selectedFile" name="text" accept=".txt" />
  <input type="submit" />
</form>
{% endhighlight %}

<i>React requires closing slashes on the inputs because it only recognizes "complete" tags.</i>

<br />

Now here's where the fun happens:

{% highlight javascript %}
loadFile: function() {
  console.log("Loading file"); //Feedback
  var selectedFile = document.getElementById('selectedFile').files[0]; //Identifying the selected file using the id of the form tag
  console.log(selectedFile); //Feedback to make sure the file is loaded correctly
  var reader = new FileReader(); //Create a document reader (built into HTML5)
  reader.onload = function(e) { //Declare the asyncronous callback for when a file is loaded into the reader
    var text = reader.result; //The contents of the text file
    console.log(text); //Spits back the contents of the text file
  }
  reader.readAsText(selectedFile); //Calls the reader to read our selected text file
  //The reader goes to its "onload" function and executes that code
  return false; //Prevents the page from auto-refreshing
}
{% endhighlight %}

<br />

That's it! It was so satisfying once it worked. Hope this helps!

<br />

Main Sources:
<a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText">https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText</a>
<a href="http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api">http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api</a>
<a href="http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=imWj_l2wfU6">http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=imWj_l2wfU6</a>
<a href="http://www.w3schools.com/tags/att_input_type.asp">http://www.w3schools.com/tags/att_input_type.asp</a>