---
title: How to Add a New Property to an Existing Account in GA4
date: 2025-05-17
layout: post
author: Jim Smits
permalink: /how-to-add-a-new-property-to-an-existing-account-in-ga4/
thread: 
description: Sometimes you don't want or need to create a whole new account in GA4 if you are wanting to track a separate but related entity in GA4. Here's how to add a new property to an existing account in GA4.
tags:
  - how-to
  - getting-started
  - analytics
ai-disclaimer: Not Created By AI
---
Sometimes you don't want or need to create a whole new account in GA4 if you are wanting to track a separate but related entity in GA4.  An example of this scenario is if you have a main site "site.com" and a subdomain with related (but separate) information such as "blog.site.com" or "docs.site.com". In cases such as these, the best bet is to add a property under the existing account for your site.

Adding a property to an existing account is easy:
1. **Go to [Google Analytics](https://analytics.google.com/)** and sign in.    
2. In the **Admin panel** (gear icon bottom left), check that you're in the right **Account**
3. In the upper left click "Create" and choose "Property"
4. Fill out **Property name**, **Reporting time zone** and **currency** (important for accurate reports)
5. Click **Next** and select the business category and size.    
6. Click **Create.**

After you click create, Google Analytics will provide a script to upload to your website. The script will look something like this:
```
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
	window.dataLayer = window.dataLayer || []; 
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date()); 
	gtag('config', 'G-XXXXXXXXXX'); </script>
</script>
```
Place the script in the top of the `head` element of all the pages you wish to track (if you have access to the source code) or use your CMS script injection interface to inject the script. Consult a reputable website partner if you need help with any of these steps.

Happy analyzing!
