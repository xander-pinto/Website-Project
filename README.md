# Tommy's Tunes redesign

A full ground-up redesign of Tommy's Tunes, a Long Island DJ entertainment company founded in 1985. Replaced a dated Wix build with a mobile-first, SEO-first static site the owner can edit weekly without a CMS.

**Live site:** [marvelous-caramel-719672.netlify.app](https://marvelous-caramel-719672.netlify.app)

*Custom domain (tommystunes.com) repoints once the client migrates DNS off Wix.*

## The problem

The original site was a Wix build from another era. Eleven-item navigation, "over 30 years" copy that quietly aged itself, no responsive layout, a spammy footer, and a 2012 visual identity. The company is the longest-running DJ entertainment business on Long Island. The site was actively understating that.

## What I built

Static HTML, CSS, and JavaScript. No frontend framework. One lightweight Node.js build step for SEO. Deployed on Netlify. Forms backed by Netlify Forms, no custom backend.

Two constraints drove every architecture decision:

1. **The owner edits content weekly and isn't technical.** That ruled out a CMS (login friction), a JS framework (build complexity), and anything that puts editing behind tooling. He opens a JS data file, changes a line, commits. The site updates.
2. **The site needed to rank on Google for Long Island event queries.** Original client-rendered detail pages looked empty to crawlers. The fix was a static site generator that bakes the right title, meta description, and content into the HTML at build time, before JS ever runs.

## Results

Since launch the site pulls roughly 950 sessions a month and drives three to four inbound booking leads a day, up from about one a day on the old Wix build. Same business, same market, no ad spend added. The difference is a site that ranks for Long Island event queries and actually converts the traffic it earns.

## Stack

| Layer | Tool |
|---|---|
| Markup | HTML5, semantic, with `LocalBusiness` JSON-LD on every page |
| Styles | CSS3, custom properties for the palette, mobile-first media queries |
| Scripts | Vanilla JavaScript, ES6+, no framework |
| Build | Custom Node.js generator at [scripts/generate.js](scripts/generate.js) |
| Hosting | Netlify, free tier |
| Forms | Netlify Forms with built-in honeypot |
| Type | Fraunces (display) + Inter (body), from Google Fonts |

## Architecture highlights

**Data-first.** Every dynamic record (40+ team members, 5 service categories, 6 package tiers, 250+ reviews, upcoming showcases) lives in a plain JavaScript data file under [js/data/](js/data/). One source of truth, edited in place.

**Static site generator.** [scripts/generate.js](scripts/generate.js) reads the data files and emits per-slug HTML for team members, services, packages, reviews, and five SEO-targeted event-type landing pages. Netlify runs it on every push. The owner edits one file; the right HTML appears at the right URLs.

**Three-act page rhythm.** Every page opens dark and cinematic, drops into a light content section, and closes dark again with a CTA. Pattern enforced in CSS so any new page inherits it automatically.

**One persistent CTA, three touchpoints.** "Check your date" sits in the nav, opens a modal on every page, and closes every page as a final CTA. Three taps to convert, no spam.

**Shared components without a framework.** Nav, footer, and modal live in [components/](components/) and load via `fetch()`. Edit one file, every page updates.

**Voice rules enforced by a custom linter.** Tommy's Tunes has a tight editorial voice (sentence case, no em dashes, no banned words like "elevate" or "next level," forty-plus years not "over 30 years"). I built a project-specific Claude Code skill at [.claude/skills/check-voice/](.claude/skills/check-voice/) that greps the codebase for violations before commit.

**Automated multi-viewport audit.** Ran the full site through Playwright on iPhone and desktop viewports as part of the launch checklist. Caught a silent title-overwrite bug where client-side JS was clobbering the SEO-optimized titles baked at build time on five landing pages, the exact thing the build step exists to prevent.

## Local development

Static site. Open `index.html` in a browser, or run `netlify dev` for the full preview with redirects.

For detail pages and SEO landing pages, run the generator first:

```bash
node scripts/generate.js
```

Netlify runs this automatically on every deploy.

## Tools I used to build it

- [Claude Code](https://www.anthropic.com/claude-code) for pair-programming, file edits, repo audits
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) for automated multi-viewport UI audits
- [Netlify CLI](https://docs.netlify.com/cli/) for local builds
- Git + GitHub

## License

[MIT](LICENSE)
