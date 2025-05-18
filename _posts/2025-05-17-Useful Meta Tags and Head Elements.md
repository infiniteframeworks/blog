---
title: Useful Meta Tags and Head Elements
date: 2025-05-17
layout: post
author: Jim Smits
permalink: /useful-meta-tags-and-head-elements/
thread: 
description: While this is not an exhaustive list of all meta tags[^1] and head elements, here are some that are widely used and very useful for good UX.
tags:
  - website-development
  - ux
  - getting-started
  - seo
---

While this is not an exhaustive list of all meta tags[^1] and head elements, here are some that are widely used and very useful for good UX.

## Basics
```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Infinite Frameworks</title>
```
## Icons
```
  <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
```

## SEO
```
<meta name="description" content="Infinite Frameworks builds scalable web solutions for small businesses.">
<link rel="canonical" href="https://infiniteframeworks.com">
<title>Infinite Frameworks</title>
```
## iOS Specific

```
<!-- iOS support -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Infinite Frameworks">

<!-- App icons -->
<link rel="apple-touch-icon" href="/icons/icon-192.png">
```
## Social Sharing (Open Graph)
```
<meta property="og:title" content="Infinite Frameworks">
<meta property="og:description" content="We provide more than a website — we provide a framework for success.">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="https://infiniteframeworks.com">
<meta property="og:type" content="website">
```



[^1]: Technically, the list of possible meta tags is infinite since you can put whatever you want in a meta tag, such as `<meta foo="bar">`. That said, some meta tags are recognized by the browser. For example, `<meta charset="UTF-8">` is an instruction to the browser that says "hey, this content is encoded in UTF-8". Without it the browser is left to guess the encoding of the file.  All major browsers use this tag.
