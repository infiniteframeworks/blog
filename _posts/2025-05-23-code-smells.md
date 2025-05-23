---
title: Code Smells
date: 2025-05-23
layout: post
author: Jim Smits
permalink: /code-smells/
thread: https://chatgpt.com/c/682a3b6b-cb94-8004-81e4-8e9deeb307fc
description: Code smells are indicators of potential problems in the codebase.
tags:
  - software
  - software-development
  - software-lore
ai-disclaimer: Created by Jim Smits and ChatGPT
ai-generated: partially
---
**Code smells** are indicators of potential problems in the codebase. They don't always mean the code is broken or incorrect, but they often suggest **poor design**, **maintainability issues**, or areas that may lead to **bugs or [technical debt](/techincal-debt/)**. Code smells are subjective and context-sensitive, but they often signal places where refactoring could improve readability, flexibility, or performance.

![a stylized closeup of a human's nose with spiraling patterns in the skin](/assets/images/posts/code-smells.webp "AI Generated Image - Midjourney")


### Origins

The phrase was first coined by **Kent Beck** in the late 1990s during his collaboration with **Martin Fowler** on the book _Refactoring: Improving the Design of Existing Code_. The idea was simple but powerful: not all bad code is immediately broken, but some code just **feels** wrong—like it’s trying to tell you something.

> _"A code smell is a surface indication that usually corresponds to a deeper problem in the system."_  
> — _Martin Fowler_

“Smell” was chosen deliberately. It's not a diagnostic. It's a **signal**. An invitation to look deeper. A gentle warning, not a judgment.

### Three Common Code Smells

1. **Long Methods**
   A function or method that is too long, making it hard to understand.
   **Example**: a 200-line method with more than one responsibility - handling input, validation, processing and output.
2. **Duplicate Code**
   The same or very similar code exists in more than one place.
   **Example**: Validation logic that has been cut and pasted into multiple files instead of being centralized.
3. **God Object**
   A large class that does too much and knows too much about everything.
   **Example**: a `UserManager` class that handles authentication database access, email notifications, and UI rendering.

For a comprehensive list see: [https://refactoring.guru/refactoring/smells](https://refactoring.guru/refactoring/smells) and [https://blog.codinghorror.com/code-smells/](https://blog.codinghorror.com/code-smells/)