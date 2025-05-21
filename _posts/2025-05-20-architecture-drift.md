---
title: Architecture Drift
date: 2025-05-20
layout: post
author: Jim Smits
permalink: /architecture-drift/
thread: https://chatgpt.com/c/68281601-dd5c-8004-98e2-1209c360d6ea
description: Architectural drift and architectural erosion describe two processes by which  systems diverge from their architecture.
tags:
  - system-design
  - software-architecture
ai-disclaimer: Created by Jim Smits and ChatGPT
ai-generated: partially
---
First described by Dewayne E. Perry and Alexander L. Wolf in 1992, **architectural drift** and **architectural erosion** describe two processes by which  systems diverge from their architecture. 

![a blue and white line drawing of a 3D office space](/assets/images/posts/architecture-drift.jpg "AI Generated Graphic - Midjourney")

https://users.ece.utexas.edu/~perry/work/papers/swa-sen.pdf

>Architectural erosion is due to violations of the architecture. These violations often lead to an increase in problems in the system and contribute to the increasing brittleness of a system -- for example, removing load-bearing walls often leads to disastrous results. Architectural drift is due to insensitivity about the architecture. This insensitivity leads more to inadaptability than to disasters and results in a lack of coherence and clarity of form, which in turn makes it much easier to violate the architecture that has now become more obscured.

Suppose a system was designed with a clean MVC pattern, but over time:
- Business logic sneaks into views.    
- DB calls get scattered across the app.    
- Dependencies grow tangled.  
Now the system still works, but it’s no longer coherent — **it drifts**.

## Why it Happens

- **Short-term fixes** override long-term structure.    
- **New features** are added without revisiting architectural principles.    
- **Team turnover** leads to loss of architectural vision.    
- **Lack of enforcement** on coding standards or review practices.    
- **Time pressure** leads to “just make it work” code.

## Consequences

- Increased **[technical debt](/technical-debt/)**.    
- Harder to **maintain**, **test**, and **scale**.    
- Slower onboarding for new devs.    
- Reduced **alignment** with business goals or system constraints.

## How to Prevent It
- Use **architecture diagrams** and **code reviews**.    
- Enforce boundaries via **modular design** or **domain-driven development**.    
- Periodically run **architecture validation** tools or conduct **refactoring sprints**.

## Tools for Detection And Management

- https://vfunction.com/
- https://codescene.com/