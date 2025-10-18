---
title: Creating A Favicon
date: 2025-05-17
layout: post
author: Jim Smits
permalink: /creating-a-favicon/
thread: 
tags:
  - getting-started
  - website-development
  - how-to
description: Favicons, are the little graphics that appear in your browser tabs. Creating one for your company is easy.
ai-disclaimer: Not Created By AI
ai-generated: none
---
Favicons are the little graphics that appear in your browser tabs.

Creating one for your company is easy. Here’s how to get one set up in minutes:

Go to https://favicon.io/favicon-converter/ and upload your graphic.  Make sure that the canvas size is square, or the converter will scale your graphic to make it square resulting in distortion.

Extract the files and copy them to the root of your website.[^1]  Add the following to the `head`[^2] element in your HTML.

```
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
```

While a favicon won't make or break your website, it is a nice finishing touch and is good for UX and brand identity.

[^1]: Or put them in a favicon folder in your root to keep your root a little cleaner.  Update the paths in the link elements accordingly.

[^2]: If you are unsure where to find the `head` element, you typically need access to the source code of your website. Some CMS's have an interface to inject code into the `head`. If uncertain, contact a qualified website consultant. 