---
title: A Quick Note About AI Generated Content
date: 2025-05-18
layout: post
author: Jim Smits
permalink: /a-quick-note-about-ai-generated-content/
thread: https://chatgpt.com/c/682a5a8d-f004-8004-b4a0-cf2a49968d75
description: It is my belief that users want transparency about content that was produced by AI.
tags:
  - ai
  - ux
  - chatGPT
ai-disclaimer: Not Created By AI
ai-generated: none
---
It is my belief that users want transparency about content that was produced by AI. To that end, I have started being transparent about when and how I use AI in my creation process.

I began by adding "AI Generated Image - Midjourney" or "AI Generated Image - ChatGPT" as the `title` attribute on `img` links. When the users hovers over the image, they can clearly see the title.

With regards to text content, it gets a little bit murky. There is a [proposal](https://github.com/whatwg/html/issues/9479) to add a meta tag to the document so that browsers can choose how to notify the users. I think this is a good idea and I have implemented it on https://blog.infiniteframeworks.com. 

However, without browser support for that meta tag, I still want to indicate if/when I use ChatGPT to help me generate content. While this may dilute the reader's trust in my works, I feel like it would be disingenuous to provide AI written articles as if they were my own. 

Truth be told, I never publish articles that were 100% written by AI. I do, however, lean on AI as an assistant. I will ask it for tone analysis, constructive criticism, three strengths/three weaknesses, and I will use it to do research about a particular concept with the caveat that I always double check facts from AI as they are often wrong. 

In order to be completely transparent about my use of AI, I have added an AI disclaimer to the [frontmatter](/frontmatter/) of my posts.

It accepts any type of text so that I can add what I think is appropriate credit when needed. Statements such as:

_Created by Jim Smits, Edited with ChatGPT_

_Created by Jim Smits, Scripts by ChatGPT_

And so on.

Then I added it to my Jekyll template so that it is clear to the user.

