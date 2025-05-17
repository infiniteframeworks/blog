---
title: Creating a PowerShell Build Script
date: 2025-05-13
layout: post
permalink: /creating-a-powershell-build-script/
author: Jim Smits
---
What do you do when a CMS is overkill for your needs?  You create a lightweight build script. 

While spinning up the website for [Infinite Frameworks](https://infiniteframeworks.com) I found myself needing to create a light weight templated build script so that  I can modify things like the `head` element, the header, and footer of the site.

Because I wanted something native to Windows, I decided to use PowerShell.  The first part was getting the structure right[^1]:
```
\---root
	|   build.ps1
	|   index.html
	+---pages
	|   +---about
	|   |       index.html
	|   |
	|   +---contact
	|   |       index.html
	|   |
	|   \---services
	|           index.html
	|
	\---src
	    |   index.html
	    |
	    +---includes
	    |       footer.html
	    |       head.html
	    |       header.html
	    |
	    \---pages
	        +---about
	        |       index.html
	        |
	        +---contact
	        |       index.html
	        |
	        \---services
	                index.html
```

The thing to note here is that the `src` directory contains templates that are a mirror of what gets written out to root.  The includes directory contains partial HTML snippets that get piped into placeholders in the templates. This allows me to modify the footer and header (and the `head` element) in one place rather than maintaining n+1 files individually which would be a maintenance nightmare.

For the placeholders, I went double mustaches `{% raw %}{{foo}}{% endraw %}` inside of an HTML comment (so there would be no warnings in my code editor) like so, `<!-- {% raw %}{{head}}{% endraw %} -->`, `<!-- {% raw %}{{header}}{% endraw %} -->` and so on.

Once I sorted out the structure, it was on to the build script itself:
```
$srcDir = "$PSScriptRoot/src"
$includesDir = "$srcDir/includes"
$srcPagesDir = "$srcDir/pages"
$outputRoot = "."
$outputPagesDir = "pages"  

# Load all includes into a hashtable
$includes = @{}
Get-ChildItem -Path $includesDir -Filter *.html | ForEach-Object {
    $key = $_.BaseName  # 'head.html' -> 'head'
    $includes[$key] = Get-Content $_.FullName -Raw
}  

# Helper function to inject includes and write file
function Build-Page($inputPath, $outputPath) {
    if (!(Test-Path $inputPath)) {
        Write-Warning "Input file not found: $inputPath"
        return
    }  

    $html = Get-Content $inputPath -Raw
    if ($null -eq $html -or $html.Trim().Length -eq 0) {
        Write-Warning "Input file is empty or could not be read: $inputPath"
        return
    }  

    foreach ($key in $includes.Keys) {
        $pattern = "<!--\s*\{\{\s*$key\s*\}\}\s*-->"
        $replacement = $includes[$key]  

        if ($html -notmatch $pattern) {
            Write-Warning "No {% raw %}{{$key}}{% endraw %} token found in $inputPath"
            continue
        }
  
        if ($null -eq $replacement) {
            Write-Warning "Include '$key' is null. Skipping replacement."
            continue
        }
  
        $html = [System.Text.RegularExpressions.Regex]::Replace(
            $html,
            $pattern,
            { param($m) $replacement },
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
    }  

    $outputFolder = Split-Path $outputPath -Parent
    if (!(Test-Path $outputFolder)) {
        New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
    } 

    $html | Set-Content $outputPath
    Write-Host "Built: $outputPath"
}

# Process root index.html
Build-Page "$srcDir/index.html" "$outputRoot/index.html"  

# Recursively process src/pages/**/index.html into pages/**/index.html
Get-ChildItem -Path $srcPagesDir -Recurse -Filter "index.html" | ForEach-Object {
    $relativePath = $_.FullName.Substring($srcPagesDir.Length + 1)
    $outputPath = Join-Path $outputPagesDir $relativePath
    Build-Page $_.FullName $outputPath
}
```

And there it is, a straightforward way to template a website using PowerShell.  It isn't the most robust software in the world, but it is an elegant, lightweight way to make maintaining a basic website much, much easier.


[^1]: As a part of this process I discovered a new to me terminal command `tree` which outputs the tree structure of the current directory. Pass it some flags -  `/A` for ASCII and `/F` to include file names and it really shines. Super helpful.
