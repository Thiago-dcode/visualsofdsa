---

name: marketing-seo-ux
description: Marketing positioning, SEO optimization (technical + on-page + structured data), and UI/UX best practices. Use when building landing pages, optimizing for search engines (including AI search), improving user experience, designing for better conversions, fixing meta tags, adding structured data, configuring sitemaps, or any search engine optimization task.
---

# Marketing, SEO & UI/UX (visualsofdsa)

## Core Philosophy

In 2026, SEO and UX are inseparable. Optimizing for the user is the most effective way to optimize for search engines and AI models. Focus on **perceived performance**, **cognitive ease**, and **task completion**.

## Project Context

visualsofdsa is an educational tool: people search for a concept ("binary search tree insert", "quicksort animation") and land on a visualizer. Pages should answer that query in the first screen and let the visitor start the animation at once.

- **Value proposition (above the fold)**: name the structure or algorithm and what the visitor can do with it ("Watch quicksort partition step by step").
- **Titles and descriptions** come from `appMetadata` in `src/lib/metadata.ts`. Each page passes its own `title` (the suffix ` | Visualsofdsa` is added there) and a specific description. Don't reuse the default description on detail pages.
- **Keywords**: use terms learners actually search for, in headings and copy. Don't stuff the `keywords` list.
- **Sitemap**: `src/app/sitemap.ts` lists every visualizer page. Add new entity pages there, and keep its `force-dynamic` behaviour.
- **robots**: `public/robots.txt` is the source of truth. Keep it aligned with what should be crawled.

## Learning-Product UX

- **Instant value**: the visualization starts from a sensible first step. The visitor should see something move without reading.
- **Clear CTA**: "Play", "Step through", or "Try your own input", not "Submit".
- **Trust**: consistent typography, clear authorship or sources for the explanations, and an explicit note when content is simplified.
- **Friction**: avoid interstitials and popups. Don't shift the visualization when data loads (CLS).
- **Pogo-sticking**: link to the next related algorithm or structure from each page so visitors keep learning.

## UI/UX Best Practices

- **Typography**: 16px–18px base font size, 1.5–1.75 line height for readability.
- **Accessibility (a11y)**: Maintain high color contrast (WCAG AA/AAA). Ensure all interactive elements have labels and keyboard support. See `accessibility`.
- **Mobile First**: Design for touch interactions first. Buttons must be at least 44×44px.
- **Friction Reduction**: Minimize controls on the first screen. Avoid layouts that shift unexpectedly (CLS).
- **Behavioral Signals**: Minimize "pogo-sticking" by providing immediate value and clear navigation.

---

## SEO Fundamentals

Search ranking factors (approximate influence):

| Factor                            | Influence | Covered Here        |
| --------------------------------- | --------- | ------------------- |
| Content quality & relevance       | ~40%      | Partial (structure) |
| Backlinks & authority             | ~25%      | ✗                   |
| Technical SEO                     | ~15%      | ✓                   |
| Page experience (Core Web Vitals) | ~10%      | Partial             |
| On-page SEO                       | ~10%      | ✓                   |

---

## Technical SEO

### Next.js Metadata API

Use the built-in Metadata API for automatic SEO asset generation:

```tsx
// app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-site.com"),
  title: {
    default: "Your Site Name",
    template: "%s | Your Site Name",
  },
  description: "Your site description",
};
```

**Key Next.js SEO files in this project:**

- `src/app/sitemap.ts` — serves `/sitemap.xml` (already present)
- `public/robots.txt` — serves `/robots.txt` (a static file here; don't add `robots.ts` alongside it)
- `src/lib/metadata.ts` — `appMetadata()` helper for title suffix and defaults

**Metadata best practices:**

- Always set `metadataBase` for proper URL resolution
- Use `title.template` in root layout for consistent branding
- Define unique `title` and `description` for each page
- Set canonical URLs using `alternates.canonical`
- Use `generateMetadata` for dynamic routes

### Dynamic Sitemaps

```ts
// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://example.com/products",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
```

**Sitemap best practices:**

- Max 50,000 URLs or 50MB per sitemap
- Include only canonical, indexable URLs
- Update `lastModified` when content changes
- Submit to Google Search Console

### Robots.txt

Edit `public/robots.txt` directly. Point its `Sitemap:` line at the production sitemap URL, and disallow any non-public path you add later.

### Crawlability & Canonical URLs

```html
<!-- Prevent duplicate content -->
<link rel="canonical" href="https://example.com/current-page">

<!-- Meta robots -->
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow"> <!-- for private pages -->
<meta name="robots" content="max-snippet:150, max-image-preview:large">
```

### URL Structure

```
✅ https://example.com/products/blue-widget
✅ https://example.com/blog/how-to-use-widgets

❌ https://example.com/p?id=12345
❌ https://example.com/products/item/category/blue-widget-2024-sale
```

**URL guidelines:** hyphens not underscores · lowercase · under 75 characters · include target keywords · HTTPS always

### Security Headers (SEO trust signals)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

---

## On-Page SEO

### Title Tags

```html
<!-- ❌ --> <title>Page</title>
<!-- ✅ --> <title>Blue Widgets for Sale | Premium Quality | Example Store</title>
```

Guidelines: 50–60 characters · primary keyword near start · unique per page · brand name at end (except homepage)

### Meta Descriptions

```html
<!-- ✅ -->
<meta name="description" content="Shop premium blue widgets with free shipping. 30-day returns. Rated 4.9/5 by 10,000+ customers. Order today and save 20%.">
```

Guidelines: 150–160 characters · include primary keyword · compelling CTA · unique per page

### Heading Structure

```html
<!-- ✅ Proper hierarchy -->
<h1>Blue Widgets - Premium Quality</h1>
  <h2>Product Features</h2>
    <h3>Durability</h3>
    <h3>Design</h3>
  <h2>Customer Reviews</h2>
  <h2>Pricing</h2>
```

Single `<h1>` per page · logical hierarchy (don't skip levels) · include keywords naturally

### Image SEO

```html
<!-- ✅ -->
<img src="blue-widget-product-photo.webp"
     alt="Blue widget with chrome finish, side view showing control panel"
     width="800" height="600" loading="lazy">
```

Guidelines: descriptive filenames · meaningful alt text · WebP/AVIF format · lazy load below-fold images · `priority` on LCP images via `next/image`

### Internal Linking

```html
<!-- ❌ --> <a href="/products">Click here</a>
<!-- ✅ --> <a href="/products/blue-widgets">Browse our blue widget collection</a>
```

Use descriptive anchor text with keywords · use breadcrumbs for hierarchy · fix broken links promptly

---

## Structured Data (JSON-LD)

Always escape to prevent XSS: `JSON.stringify(data).replace(/</g, "\\u003c")`

Validate at [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/).

### Organization

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://twitter.com/example", "https://linkedin.com/company/example"],
  "contactPoint": { "@type": "ContactPoint", "telephone": "+1-555-123-4567", "contactType": "customer service" }
}
</script>
```

### Article

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose the Right Widget",
  "description": "Complete guide to selecting widgets for your needs.",
  "image": "https://example.com/article-image.jpg",
  "author": { "@type": "Person", "name": "Jane Smith", "url": "https://example.com/authors/jane-smith" },
  "publisher": { "@type": "Organization", "name": "Example Blog", "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" } },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
</script>
```

Set `og:type` to `"article"` · include `article:published_time`, `article:author`, `article:tags`

### Product

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Blue Widget Pro",
  "image": "https://example.com/blue-widget.jpg",
  "description": "Premium blue widget with advanced features.",
  "brand": { "@type": "Brand", "name": "WidgetCo" },
  "offers": { "@type": "Offer", "price": "49.99", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": "https://example.com/products/blue-widget" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1250" }
}
</script>
```

### FAQ

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What colors are available?", "acceptedAnswer": { "@type": "Answer", "text": "Our widgets come in blue, red, and green." } },
    { "@type": "Question", "name": "What is the warranty?", "acceptedAnswer": { "@type": "Answer", "text": "All widgets include a 2-year warranty." } }
  ]
}
</script>
```

### Breadcrumbs

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products" },
    { "@type": "ListItem", "position": 3, "name": "Blue Widgets", "item": "https://example.com/products/blue-widgets" }
  ]
}
</script>
```

---

## Mobile SEO

```html
<!-- ✅ Responsive viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

```css
/* ✅ Adequate tap target */
.mobile-friendly-link {
  padding: 12px;
  font-size: 16px;
  min-height: 48px;
  min-width: 48px;
}

/* ✅ Readable without zooming */
body {
  font-size: 16px;
  line-height: 1.5;
}
```

---

## International SEO

```html
<!-- Hreflang for multi-language sites -->
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">

<!-- Language declaration -->
<html lang="en">
```

---

## AI Search Optimization

- Use structured data (Schema.org) so Google AI Overview, ChatGPT, and Perplexity can understand your content.
- Organize content into topic clusters with pillar pages and supporting articles.
- Use semantic HTML with a logical heading hierarchy.
- Prioritize Core Web Vitals: LCP and CLS are key signals.

---

## Implementation Checklist

### Critical

- [ ] HTTPS enabled
- [ ] `robots.txt` allows crawling
- [ ] No `noindex` on important pages
- [ ] Title tags present and unique
- [ ] Single `<h1>` per page with primary keyword

### High Priority

- [ ] Meta descriptions present and compelling
- [ ] Sitemap generated and submitted
- [ ] Canonical URLs set on every page
- [ ] Open Graph and Twitter cards configured
- [ ] Mobile-responsive layout verified
- [ ] Core Web Vitals passing (LCP, CLS)

### Medium Priority

- [ ] Structured data implemented for key entities
- [ ] Internal linking strategy in place
- [ ] All images have descriptive `alt` text
- [ ] Descriptive URL slugs (no `?id=` parameters)
- [ ] Breadcrumb navigation present
- [ ] Schema markup validated

### Ongoing

- [ ] Fix crawl errors in Google Search Console
- [ ] Update sitemap when content changes
- [ ] Monitor ranking changes
- [ ] Check for broken links

---

## Tools

| Tool                      | Use                                |
| ------------------------- | ---------------------------------- |
| Google Search Console     | Monitor indexing, fix crawl issues |
| Google PageSpeed Insights | Performance + Core Web Vitals      |
| Rich Results Test         | Validate structured data           |
| Lighthouse                | Full SEO + performance audit       |
| Screaming Frog            | Crawl analysis                     |
| Facebook Sharing Debugger | Test Open Graph previews           |
| LinkedIn Post Inspector   | Test social card previews          |

---

## References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
