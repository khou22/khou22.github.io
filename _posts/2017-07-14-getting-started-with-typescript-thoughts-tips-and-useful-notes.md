---
layout: post
title: "Getting Started with Typescript: Thoughts, Tips, and Useful Notes"
author: "Kevin Hou"
date: 2017-07-14 17:40:33
description: "A short introduction into TypeScript as well as a reflection on my thoughts and opinions about it."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [javascript, es6, expressServer, backendServer]
featured: "no"
---
I started using TypeScript for my next project at Moat and I have to say I really love it. I’ve always been a fan of type safe language — largely for the compile-time debugging, code completion, and readability — which is why I’m such a huge fan of Swift. TypeScript has given me the structure and safety that I’ve found with Java and Swift, and has reinvigorated my love for web development. I’ve always considered web development to be somewhat of the “wild west” — not too much standardization and with no checks and balances to minimize errors.

<h3 class="post-subheader">Benefits</h3>
Using TypeScript has eliminated a whole category of bugs that would be present in traditional Javascript. I’m using `atom-typescript (v11.0.6)` which includes a live linter that checks my code on “compile” rather than during runtime. Because of this, my development time (after I got the hang of some syntax complications) was significantly increased. I no longer had unexpected types, undefined variables, and missing properties on objects. TypeScript can track the type of variables to ensure that functions always receive their specified inputs, variables don’t change types unless explicitly allowed, and code doesn’t attempt to access object attributes that aren’t actually there (also helps with spelling mistakes).

It has huge benefits with scalability because of the code clarity and readability. Deciphering poorly written code is a nightmare, but if it had type safety, using the interfaces alone would provide a good map of what’s going on. Furthermore, you wouldn’t have to spend ten minutes to trace the shape of the return object on a function. Team members could better understand the input and output of your code making compartmentalization and modulation a lot easier and more natural.

<h3 class="post-subheader">Drawbacks</h3>
One of the major drawbacks to TypeScript is efficiency. For small scale projects without many complicated objects and nested types, TypeScript might slow your development time down. TypeScript excels in complicated projects where you or a team member must use a complicated object with doubly nested arrays, objects, and dictionaries. This is where knowing exactly what variables you will have at your hands is a lifesaver.

TypeScript can also be annoying when the type you expect to receive either doesn’t or varies. Even though you can “turn off” type safety by either not declaring a type or using `any` as the type, it’s still annoying when the linter complains about something that isn’t really within your control.

I’m sure I’ll find many more annoyances after I’ve gotten deeper into it. After all, I’ve only been using it for about a day so I’m probably naive and buying into the initial hype. Regardless, I’m having fun with TypeScript and opinions are better than no opinions.

<h3 class="post-subheader">Interfaces</h3>
I recognized TypeScript’s true power when I was setting up interfaces. Interfaces are like kind of like Structures in Swift without the variable declaration. They do not contain variables or values. Instead, they essentially map out an object’s shape. For example, I’ve been playing around with GitHub’s API for a project and here are two of my interfaces:
{% highlight javascript %}
// Declare shape of repository
interface GitHubRepository {
    name: string;
    id: number;
}

interface GitHubFile {
    type: string;
    encoding: string;
    name: string;
    path: string;
    content: string;
    someFunction: { (parameter1: string ): number }; // someFunction(parameter1: 'Hello')
}
{% endhighlight %}

You can also merge and extend interfaces like so:
{% highlight javascript %}
import * as express from 'express';

// Adds onto the original interface from 'Express'
interface Request extends express.Request {
	session {
		username: string;
	}
}
{% endhighlight %}

Now, I can use GitHubFile or GitHubRepository as a type just like I would with any other variable type. I have the added benefit of code completion now. When I type a variable name of type GitHubFile and press period, a list of properties and their expected type shows up. It enables IDE’s to be much smarter about their suggestions to the point where it’s honestly approaching Xcode level.
<img src="./../../../../media/blog/images/TypeScript-Intro/atom_code_completion_typescript.png" class="iPhone-screenshots-large">

<h3 class="post-subheader">Basic Syntaxes</h3>
<b>Arrays:</b>
{% highlight javascript %}
const numbers: Array<number> = Math.random();
{% endhighlight %}

<b>Functions:</b>
{% highlight javascript %}
const getReadme = (name: string) : Promise<GitHubFile> => { … }
{% endhighlight %}

<b>Casting:</b>
{% highlight javascript %}
const random: any = Math.random();
const value: number = random as number;
{% endhighlight %}

<b>Defining Generics:</b>
{% highlight javascript %}
// A promise function that declares a GitHubFile as the promise response
Promise<GitHubFile>
{% endhighlight %}


<h3 class="post-subheader">Final Thoughts</h3>
Overall, I’ve been very satisfied with TypeScript so far. The combination of code completion, reduced debugging time, and clean structure has made for a hugely satisfying development process. I’m thinking about refactoring my NodeJS Heroku server to TypeScript just so I can keep using it. Hope this post was helpful and I highly recommend you give TypeScript a shot!
