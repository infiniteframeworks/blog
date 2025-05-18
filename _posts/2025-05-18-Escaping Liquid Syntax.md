---
title: Escaping Liquid Syntax
date: 2025-05-18
layout: post
author: Jim Smits
permalink: /escaping-liquid-syntax/
thread: https://chatgpt.com/c/6826c40c-ebd0-8004-80a3-02894a936ff8
description: Don't be like me.
tags:
---
Don't be like me. Learn from my mistakes. Escape your [Liquid](https://shopify.github.io/liquid/).

Liquid is an open-source template language from [Shopify](https://www.shopify.com/) that is used by [Jekyll](https://jekyllrb.com/).

When posting [about how to enable tags in Jekyll on GitHub Pages](/enabling-tags-in-jekyll-on-github-pages/), I made a funny set of mistakes. First, I forgot to escape my Liquid syntax so that my code samples were rendered by Liquid. As an example, something like this:

  <pre>
  {% raw %} 
  ```
  {{ site.title }}
  ``` 
  {% endraw %} 
  </pre>

  actually renders as `{{ site.title }}`.

So then I tried to escape my Liquid like so:

<pre>
{% raw %}
```
{% raw %}
//Code with {{ Liquid }} syntax here.
```
{% endraw %}
</pre>


But the escape characters rendered in the example!

The final trick is to put your escape characters inside a `<pre>` tag _but outside_ the Markdown triple tick ` ``` `. 

This works because Markdown gets processed **after** Liquid.

This whole post has been an exercise in escaping.
