// Build environment, available in templates as {{ env.environment }}.
// Replaces Jekyll's `jekyll.environment`: "production" only when ELEVENTY_ENV
// (or the legacy JEKYLL_ENV) is set to production, as `npm run build` does.
// Google Analytics and Disqus are rendered only in production.

export default {
  environment: process.env.ELEVENTY_ENV || process.env.JEKYLL_ENV || "development",
};
