---
title: Setting Up A New GA4 Account
date: 2025-05-17
layout: post
author: Jim Smits
permalink: /setting-up-a-new-ga4-account/
thread: 
description: Google Analytics 4 is the de facto standard for data collection and analytics for websites large and small. Here is a quick article to help you get started.
tags:
  - business
  - business-development
  - analytics
  - getting-started
  - how-to
ai-disclaimer: Not Created By AI
ai-generated: none
---
Google Analytics 4 is the de facto standard for data collection and analytics for websites large and small. 

Installation is a snap (if you have access to source code or a way to inject scripts into the `head` element of a webpage).

1. Go to the [Create and Account](https://analytics.google.com/analytics/web/?authuser=0#/provision/create) page and enter an account name. Agree to terms and enter an account name. 
2. Give the property a name - typically the name of the website for which you wish to track. Choose the time zone and currency.
3. Fill in some details about the type of business you are running. (Industry Category and Business Size).
4. Choose from some objectives: Generate Leads, Drive Sales, Understand Traffic, View User Engagement and Retention, and Other
5. Click create.

The last step after create is to add the analytics tracking script to the page or pages you are interested in tracking.  Typically you want to install the script on every page of your site. If you control the source of your website, just paste the script inside of the head tag. If you are using a website provider such as Squarespace, you may have a way to inject the script into the front end using some of the advanced tools.  Contact a reputable web developer if you are uncertain about how to complete this last step.  You will need to provide the script to them. It will look something like this:
```
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXX');
</script>
```
That's it! Happy analyzing!