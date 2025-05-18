---
title: MX, SPF, DKIM and DMARC
date: 2025-05-16
layout: post
author: Jim Smits
permalink: /mx-spf-dkim-and-dmarc/
thread: 
tags:
  - getting-started
  - email-configuration
  - dns
description: When configuring your mail server in DNS, here are some useful terms to know.
ai-disclaimer: Created by Jim Smits, Researched with ChatGPT.
---
When configuring your mail server in DNS, here are some useful terms to know.  

## MX Records

**MX Records** (Mail Exchange) tell email systems where to deliver the mail.  There will often be multiple MX records with distinct server names and priorities - this is for redundancy.

## SPF

**SPF** (Sender Policy Framework) is a TXT record in DNS used to prevent email spoofing (a common spam and phishing tactic). SPF tells mail servers which servers are authorized to send email on the behalf of your domain.

An SPF record will look something like this:

```
"v=spf1 include:_spf.google.com ~all"
```

Follow your mail provider's instructions when adding SPF records.

## DKIM

**DKIM** (Domain Keys Identified Mail) is another value that is stored in a TXT record. It is an email authentication method that proves an email was authorized by the sending domain and that it hasn't been tampered with in transit. 


## DMARC

**DMARC** or Domain-based Message Authentication, Reporting and Conformance builds upon SPF and DKIM to protect against all email spoofing and phishing attacks.  Another TXT record - it is a set of instructions telling the receiving server how to handle messages that fail DKIM and SPF checks.

## Conclusion

Proper mail server DNS records are key to deliverability. MX records tell systems where to deliver email, while SPF, DKIM and DMARC TXT records help prevent SPAM and can help make sure your emails don't end up in the junk folder. 