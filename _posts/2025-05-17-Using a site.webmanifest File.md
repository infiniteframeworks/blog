---
title: Using a site.webmanifest File
date: 2025-05-17
layout: post
author: Jim Smits
permalink: /using-a-site-webmanifest-file/
thread: 
description: A `webmanifest` file is a completely optional JSON file that gives browsers information about your site.
tags:
  - website-development
  - ux
---

A `webmanifest` file is a completely optional JSON file that gives browsers information about your site so that it can be: 
- Installed on a device like a native app
- Displayed in full-screen mode 
- Branded properly with icons, names, and colors.

It is included in your root directory and referenced in the `head` of your HTML document like so: 
```
<link rel="manifest" href="/manifest.webmanifest">
```

For reference, here is the `site.webmanifest` file for this site:

```
{

    "name": "Infinite Frameworks",
    "short_name": "IF",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0069bb",
    "icons": [
        {
            "src": "/favicons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/favicons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

Pay special attention to the display property.  It controls how the app is launched from the home screen of a mobile device.  

Here are the common values and what they do:

|Value|Behavior|
|---|---|
|`browser`|Default—opens in the browser with full UI (tabs, address bar, etc.)|
|`standalone`|Launches like an app: no address bar, no tabs—just your site in its own frame|
|`fullscreen`|Launches in true full-screen mode—no browser UI at all|
|`minimal-ui`|Like `standalone`, but keeps some minimal browser chrome (back button)|
The `webmanifest` file is a helpful way to get mobile browsers to treat your site like an app. When a user adds your site to their home screen, the manifest gives the browser some instructions to make it feel more like a native app.  While this is completely optional, it is a nice finishing touch for any website.