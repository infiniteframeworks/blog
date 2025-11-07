---
title: Using Zoho to Get Started with a Business Email Address
date: 2025-05-15
layout: post
author: Jim Smits
permalink: /using-zoho-to-get-started-with-a-business-email-address/
thread: 
tags:
  - business
  - business-development
  - getting-started
  - productivity
  - email-configuration
  - how-to
description: Zoho mail - getting started and first impressions.
ai-disclaimer: Created by Jim Smits, Edited with ChatGPT
ai-generated: partially
---

There's the easy way and the right way and oftentimes that Venn diagram is just two separate circles.  Add in the cheap way and now there are three separate circles.

![A Venn diagram showing three circles that don't overlap labeled, cheap, easy, and right](/assets/images/posts/qr90w3cx.webp "AI Generated - ChatGPT")

Not the case with [Zoho mail](https://www.zoho.com/mail/) - for just a dollar a month, you can have your email delivered to your business domain.[^1] They also have an app for iOS and Android, and IMAP integration which is nice for integrating with third party email clients. Setup is easy - just add DNS records (see also [DNS Explained](/dns-explained/)) and be on your merry way. 

Why do they do this for only $12? It is likely a loss-leader. Zoho is not just mail. It is a full suite of software products for small to medium businesses. Offering cheap mail is a clever way to generate buy-in to showcase their full suite of products.  After all, if you are using Zoho for mail, you may be more inclined to use other Zoho software (CRM, HR, etc.) as your organization grows.  

Zoho competes with Office 365 and Google Workspace.  Here's a quick comparison (AI generated):

| Feature                 | **Zoho**           | **Google Workspace**     | **Microsoft 365**            |
| ----------------------- | ------------------ | ------------------------ | ---------------------------- |
| Price (entry-level)     | ✅ Low              | ⚠️ Medium                | ⚠️ Medium                    |
| Email hosting           | ✅ Strong           | ✅ Strong                 | ✅ Strong                     |
| CRM & ERP Tools         | ✅ Built-in         | ❌ Add-on (e.g., HubSpot) | ⚠️ Dynamics = $$$            |
| Office apps             | ⚠️ Basic Zoho Docs | ✅ Best for collab        | ✅ Best for traditional users |
| Privacy                 | ✅ Strong           | ❌ Ads & tracking         | ⚠️ Corporate data sharing    |
| Integration ecosystem   | ⚠️ Moderate        | ✅ Extensive              | ✅ Extensive                  |
| Customization/workflows | ✅ Advanced         | ⚠️ Moderate              | ✅ Strong (Power Automate)    |

At the $12 price point, you only get one user - but you can set up groups and add your user as a member so that you can have more than one email address go to your main user's email address.

The user interface is a little bit daunting at first because of the level of configurability and the breadth of the software. However, onboarding is easy - just follow a few steps. 

1. Verify your domain by adding a TXT record in DNS.
2. Set up your main (and only) user
3. Set up groups for email addresses that you want to map to your main user (such as hello@sitename.com).
4. Add [MX, SPF and DKIM](/mx-spf-dkim-and-dmarc/) records in DNS
5. Assuming you are greenfield you can skip the Email Migration step and then go to your inbox.

At this point, you'll want to integrate your new email address into your tools of choice.  I am using the Outlook Windows client. Add the Zoho account as you would any other IMAP account. However, there is one quirk to note - you have to go to your mail settings at https://mail.zoho.com and enable IMAP. You also may need to generate an app specific password. 

Zoho is a good, cheap option to get email at your domain. All that said, no shade to using business.name@gmail.com.  In spite of the diagram above, sometimes free and easy _is_ right. There are plenty of successful business owners who use a gmail address (and probably some old-school aol addresses as well). However, there is a level of polish and professionalism with having your email hosted at your domain.

[^1]: A few free or freemium alternatives exist, but each comes with compromises (AI Generated):
	- **Gmail** – Free for personal use (you@gmail.com), but not domain-branded and shows ads. 
	- **Outlook.com** – Similar to Gmail; decent UI, but again, no domain support unless you upgrade to Microsoft 365.
	- **Proton Mail** – Privacy-focused, with a free tier, but custom domains and IMAP support require a paid plan.
	- **ImprovMX** – Free email forwarding for custom domains, but no inbox or sending—just simple forwarding.
