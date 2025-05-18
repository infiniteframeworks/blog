---
title: DNS Explained
date: 2025-05-15
layout: post
author: Jim Smits
permalink: /dns-explained/
thread: 
tags:
  - getting-started
description: DNS (Domain Name System) is the phonebook of the internet. It is the system that maps names (like infiniteframeworks.com) to IP addresses.
---
DNS (Domain Name System) is the phonebook of the internet. It is the system that maps names (like infiniteframeworks.com) to IP addresses.

Simplified, the flow is as follows:
1. User enters a URL in a browser (example.com)
2. Browser asks DNS server "What's the IP for example.com?"
3. DNS replies with the IP address.
4. Browser connects to the IP and loads the site.

There are various types of records that a DNS server can serve.

Common ones include:
- A Records - for mapping domains to IPs
- CNAME Records - allows aliasing one domain to another
- MX Records - Mail server address for the domain
- TXT Records - used for various identification purposes

In reality, there is more complexity at play including caches, the root name servers ( . ), TLD name servers (.com, etc.), TTLs and more.  For the purposes of most small business owners, a cursory understanding of DNS is adequate. Configuring DNS need not be intimidating, however, mistakes can happen which can have unintended side effects and may take your site offline.  When in doubt, contact a reputable website consultant to make sure everything is in order.