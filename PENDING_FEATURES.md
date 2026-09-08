# Pending Features

Tracks functionality described in `Webpage SEC.docx` that goes beyond a content update — i.e. things that need new pages, a backend/CMS, or third-party integrations rather than just copy changes. Content on existing pages (Home, Who We Are, What We Do, How We Operate, Contact) was brought in line with the spec on 2026-09-08; everything below is still outstanding.

## 1. Regional Hub pages

**Spec:** Dedicated page per hub — Americas, Asia, India, MENA, SSA — each with:
- List of countries included in that hub
- Regional video
- Regional calendar (events scoped to that region)
- Regional staff (contacts/team for that hub)
- Contact Us (region-specific)
- Company logos (marked "??" in the spec — confirm with stakeholder whether this means partner/sponsor logos or something else)

**Current state:** Home page has a static 5-card preview grid (`#regional-hubs` in `src/pages/index.astro`) with just a name and one-line description per hub, linking nowhere.

**Needed:**
- 5 new route pages (e.g. `/regional-hubs/americas`, etc.) or one dynamic `[hub].astro` route
- Content model per hub (countries, staff bios/photos, video embed, logos)
- Depends on #2 (Events Calendar) for the "regional calendar" piece and #6 (CMS) for staff/content editing

## 2. Upcoming Events (Calendar)

**Spec:** Full events calendar with:
- Public filters: Region / Type / Track / Month / Year
- Admin-only entry form with fields: Type (dropdown: Fundamentals Course / Community Event), Track (multiselect: Feed Mill, Poultry, Swine, Aquaculture, Dairy, Food & Beverage), Title, Start date, End date, Region (multiselect: Americas, Asia, China, India, MENA, SSA)

**Current state:** Home page "Upcoming Events" section (`src/pages/index.astro`) shows 3 hardcoded events with no filtering and a "View All Events" link that goes nowhere (`#all-events`).

**Needed:**
- Events data model + storage (see #6 — this needs a backend/CMS, not static JSON, since it's admin-editable)
- `/events` (or similar) page with filter UI
- Admin UI for CRUD on events
- Cross-link from Regional Hub pages (region-scoped view)

## 3. Global Presence — interactive map

**Spec:** Map where countries can be selected/highlighted, each region shown in a distinct color and labeled.

**Current state:** Static 5-card grid on the home page, no map.

**Needed:**
- Map library decision (e.g. an SVG world map + a lightweight library, or something like react-simple-maps)
- Country → region color mapping (the 5 hubs)
- Click/hover interaction, labeling

## 4. Testimonials admin ("What Our Members Say")

**Spec:** Admin-manageable space to post quotes, with fields: Quote, Author.

**Current state:** 3 testimonials hardcoded in `src/components/Statistics.jsx` / `translations.json`, not editable without a code change. (Note: current UI also shows a "role" per testimonial, which isn't in the spec's field list — fine to keep as a nice-to-have, or drop if the admin tool should only expose Quote + Author.)

**Needed:** Depends on #6 (CMS) — a testimonials collection with create/edit/delete, surfaced via API to the existing carousel component.

## 5. Contact form — real submission + region-based routing

**Spec:** Form fields First Name, Last Name, Email, Country, Message; Region is auto-filled from Country (hidden from the user) and determines which inbox the message routes to.

**Current state:** `src/pages/contact.astro` has the correct fields and the Country → Region auto-fill already works client-side (derived from the country `<optgroup>`), but submission just shows a client-side "Thank You" message — nothing is actually sent anywhere.

**Needed:**
- A form-submission endpoint (e.g. a serverless function, or a form service like Netlify Forms/Formspree given this site deploys to Netlify)
- A Region → destination-email mapping used server-side to route the message

## 6. Admin / CMS backend

Several items above (#1 staff/content, #2 events, #4 testimonials) all assume an admin interface that doesn't exist yet. This is the main architectural gap: the site is currently 100% static (Astro + static JSON translations), with no database, auth, or admin UI.

**Needed (decision required):** either a headless CMS (e.g. Sanity, Contentful, or a self-hosted option) wired into the Astro build, or a small custom admin app + database. This is the prerequisite for #1, #2, and #4.

## 7. Login / Register

**Current state:** Header has a "Login / Register" button (`src/components/Header.astro`) linking to `#login` — no auth system behind it. Not mentioned explicitly in the spec doc, but present in the current site and worth confirming: is member login in scope, and for what (viewing personalized content, regional community access per the "SEC Journey" step 2 "Community Onboarding")?

## 8. Newsletter signup

**Current state:** Footer has an email input + "Subscribe" button (`src/components/Footer.astro`) with no backend — submitting does nothing. Not in the spec doc; confirm whether it should be wired to an email provider (Mailchimp, etc.) or removed.

## 9. Full multilingual parity

**Current state:** English and Spanish have full content coverage across all pages. Portuguese, Chinese, and Arabic have full coverage for the shared/home-page sections (header, hero, what-we-offer, statistics, footer, regional hubs, contact) but fall back to English on the About SEC sub-pages (Who We Are, What We Do, How We Operate), since those sections were never translated for pt/zh/ar even before this update.

**Needed:** Decide which languages need full parity, then translate the ~50 additional keys per language for those three About SEC pages.

---

*Not tracked here: minor polish items like the video placeholder on Who We Are (needs an actual video file/embed once produced) and real photography to replace the stock Unsplash hero images.*
