---
title: "JS Nation 2024: Can AI Turn Us Into 10x Developers?"
author: "Kevin Hou"
date: 2024-06-13 9:00:00
description: "I spoke at JS Nation 2024 in Amsterdam, Netherlands about the state of AI developer tools and how 2024 is the year every dev can level up to be a 10x engineer with Codeium."
image: "https://khou22.github.io/media/profile_pictures/js-nation-presentation-headshot.jpg"
tags: [coding]
featured: false
---

The full talk can be found on the JS Nation portal for free: [Can AI Turns Us Into 10x Developers?](https://portal.gitnation.org/contents/can-ai-turn-us-into-10x-developers).

[![JS Nation 2024 Kevin Hou lightning talk AI developer tools](https://khou22.github.io/media/profile_pictures/js-nation-presentation-headshot.jpg)](https://portal.gitnation.org/contents/can-ai-turn-us-into-10x-developers)

### Abstract

In this talk, Kevin Hou will explain how Codeium is working to unlock a 10x productivity gain for all developers. Today, Codeium's in-IDE autocomplete and chat help hundreds of thousands of developers write almost half of their committed code. Kevin will showcase the technical challenges behind building Codeium and how we've trained our own AI models to make full file edits, search across millions of lines of code, and generate code faster than any other AI tool on the market.

### Full Transcript

Hello JS Nation. Going to kick off the lightning talks with a wonderful presentation about how you can become a 10x developer using AI. My name is Kevin. I'm at Codeium, a company based in San Francisco, and we're building AI developer tools.

We all have this notion of what a 10x developer is, right? It is someone who can turn Red Bull into code and they have a mechanical keyboard that probably lights up, probably changes colour, probably annoys most people in the office, but it is almost an extension of themselves, right?

They're able to just churn and absolutely destroy code. Today, I'm going to tell you how, you know, maybe not with stuff like this, you too can become leveraged by using AI in your developer workflow. So, to add some more colour to how exactly and why 2024 is the time for the 10x developer,

I want to give you a brief history lesson. I started my career in the self-driving industry, and, back in 2018, the most powerful GPU available to mass market was only capable of doing 29 teraflops. For context, that basically means 29 trillion floating-point operations, and while we were building these models and trying to get vehicles on to the road, we were spending a lot of time on efficiency of models rather than the actual quality in order to get this sort of performance to work on a vehicle. Fast forward six years to today, and the most powerful GPUs have now 10x the amount of processing power and are able to perform 200-plus teraflops of compute. What does this actually mean in the context of software engineering?

It means that with these gains, we get the chance to trade that compute for leverage, and we're going to give you a quick demo as to how exactly this can be concretely integrated into the way that you write code.

This is my first time in this beautiful city. Honestly, I haven't spent too much time in Europe, but I've learned two quick things in my 24 hours since being here. People love beer. It's cheaper than water at the restaurant I was at last night. Two, people really like to bike everywhere, so we're going to combine these two things by building an app.

It's the Amsterdam Breathalyser. We're going to do this all armed with Codeium, an AI developer tool. So we're going to start with our JS monorepo, so fairly standard.

The thing that I want to call out is that we have packages, we have shared dependencies, think design system, think utils, and a completely empty Vita project.

We want to start by creating a landing page. Traditionally, you might have spent some time learning how to centre a title and a button on a page. What would you do? You would go to StackOverflow, try to find the exact copy of what you want. You might go to W3 schools, or you might even be in, who has played Flexbox Froggy? The classic let's get into the Flexbox game. Now, with Codeium and all these new dev tools, we're able to speed up that acceleration of learning.

We're able to automatically learn from your active files, from your repository, to actually ingest your codebase and trade that compute for analysing your dependencies, indexing your code, and summarising your files ahead of time. It's this whole idea where we are trading compute so that your work can go faster.

In this case, I'm actually telling it, I want to use Tailwind for my styling, and I also want to use my design system, so I'm telling it explicitly, let's pin my design system as I'm performing my generations. As you can see, what used to be complex Googling is now simply an English sentence.

We're able to type an English sentence, and it's able to use context from our codebase and use that additional compute to now give us exactly what we want.

The whole idea is that we are trading compute for a personal and unique experience with an AI developer tool. This can make typing a lot faster. As you can see, there's a lot of boilerplate with setting up state.

We have to make sure we're tracking the number of drinks that this person is having. It can kind of read your mind in that sense.

It can even suggest product decisions. Here our AI thinks that five drinks is an appropriate amount to drink before you can bike home. Maybe it's a skill issue on my part. It seems a little high, but who knows?

Similarly, you can use that context ingestion here instead of Googling on how modals can work, we can ask, how do I use a modal?

It will look through components that I have existing in my design system and give me the exact spec on what that means.

Finally, what this gives us in under a couple of minutes when I was doing this asynchronously, you get this kind of experience where we have now focused and built a full-fledged app by a lot of English sentences rather than a lot of typing. If you want to take away one thing from this lightning talk, it's that AI will save you more cycles. As you know, software development has always been a game of abstractions. If we think back, we went from transistors to CPUs, we went from computer instructions and assembly to JavaScript, and we've gone from document.getElementById to frameworks like React. So, AI will perform that next step function of abstraction.

Software has, of course, will still need some of the core principles, right? You're still going to need to understand your codebase, you're still going to need to know how to debug, write good documentation, generate unit tests, the list kind of goes on and on, and that's what makes us software engineers.

But AI with tools like Codeium can accelerate these flows and abstract you away from that complexity. So don't focus on the necessary but boring work, and instead focus on what is exciting and important. It's building delightful user experiences and actually solving user problems. So notice that in this analogy, the steering wheel is still there, and that's because we fundamentally believe at Codeium that developers should be assisted. You should still be in the driver's seat, and the AI is simply a companion that sits next to you. So if you want to check out what Codeium has to offer, everything I showed you there was actually free. We want to give this tool to everyone that we can. I know that the conference is kind of winding down, but for those of you that were able to come to our booth, thank you for that. And so we really want to transform the software industry by giving you more compute and giving you more leverage so that we all can become 10x engineers. Thank you.
