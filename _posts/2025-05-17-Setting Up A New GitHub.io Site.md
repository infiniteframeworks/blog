---
title: Setting Up A New GitHub.io Site
date: 2025-05-17
layout: post
author: Jim Smits
permalink: 
thread: 
description: GitHub Pages, also known as github.io is a great way to host a basic (static) website on for free. Here's a quick article about how to get started.
tags:
  - website-development
  - github-pages
  - how-to
  - getting-started
ai-disclaimer: Created by Jim Smits, Edited with ChatGPT.
---
GitHub Pages, also known as github.io, is a great way to host a basic (static) website **for free.**

It supports https and custom domains out of the box at no charge. 

GitHub Pages is a great option for informational websites that do not need a database backend, such as:

- Portfolio sites
- Company landing pages
- Product marketing pages
- Documentation sites
- and even blogs (with a static site generator such as Jekyll).

Here is a quick getting started guide that comes from my experience bringing Infinite Frameworks to life.  This article assumes you have some basic knowledge of git.

1. Create a new GitHub account with a user name that matches your domain name.
2. Create a new repository named (your-domain-name).github.io.
	1. Optional - choose a .gitignore template. For example, if you are going to use Jekyll, then choose the template for Jekyll.  If you will be building the site from vanilla JS, HTML and CSS, you don't need a template.
	2. Optional - choose a license for your repository, or choose none. For most static sites, no license is needed.
3. Clone your new repository to your local machine.
4. Create a file named CNAME (with no extension), and enter your domain name in that file including the TLD (e.g. .com), and commit the file.
5. Add an index.html file. Boilerplate content is fine.  Something like [Hello World](/hello-world/).  If you are the forward-thinking type, then go ahead and stub in styles.css and index.js
6. Configure DNS with your DNS provider.
	1. For an apex domain (no subdomain) add A records that point to the following IP addresses: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
	2. For sites with subdomains (such as www), add a CNAME record pointing to (your-domain-name).github.io.
7. Wait for a few minutes for DNS to propagate and then go to your **new free website**. This really may take a few minutes, so be patient.  Refresh until it loads.
8. Bonus step! Go to Settings/Pages in your GitHub repo and check "enforce HTTPS" for extra security.

And that's it!  You now have a free static site (with a custom domain) hosted on GitHub pages.  Now for the fun part - add meaningful content to your site.  Happy coding.