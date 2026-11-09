# Vendored minima Sass

`minima.scss` and `minima/` are copied unmodified from the
[minima](https://github.com/jekyll/minima) Jekyll theme, v2.5.2 (MIT licensed,
see `minima/LICENSE.txt`). Jekyll used to supply these from the `minima` gem;
Eleventy compiles them into `/assets/main.css` via `assets/main.scss`.

v2.5.2 is used rather than 2.5.1 (what GitHub Pages built the live site with)
because it replaces Sass `/` division with multiplication, which modern Dart
Sass requires. The compiled rules are otherwise identical.

Site-specific styles belong in `assets/custom.css`, not here.
