# Altynai Hair Studio — V2 Implementation Plan
## Complete Redesign: Emotional, Animated, 3D-Enhanced

---

## 1. Reference Websites (Design Inspiration)

### REF 1: Il Colorista Salon (ilcolorista.salon)
**Awwwards Honorable Mention** — Italian hair atelier.
- **What we take:** Warm color palette (#f5a490 peach tones), WebGL distortion effects on images, GSAP-powered scroll transitions, elegant typography pairing (serif + sans), full-screen hero with subtle parallax. The "every woman has her color" positioning maps perfectly to Altynai's "salon-level skills from home."
- **Tech:** GSAP, WebGL, Highway.js, custom scroll.

### REF 2: Mistretta Coiffure (mistretta.ch)
**Awwwards Honorable Mention** — Swiss beauty salon.
- **What we take:** Minimal elegance meets fluid navigation; PixiJS (WebGL) image effects; fullscreen galleries; interaction design where every hover reveals something; responsive design that feels premium on mobile. The "recreate the same aesthetic experience as entering the salon" concept.
- **Tech:** Vue.js, PixiJS, GSAP, SVG animations.

### REF 3: More Nutrition (more-nutrition.de)
**Awwwards Site of the Day** (Nov 2025) — Health/wellness product page.
- **What we take:** GSAP ScrollTrigger-driven 3D product showcase; frame-by-frame Canvas animations; smooth Lenis scrolling; bold typography with animated counters; cinematic scroll experience where sections transform as you scroll. This is the energy we need for the pricing/program sections.
- **Tech:** GSAP + ScrollTrigger, 3D visuals, Canvas API, Lenis smooth scroll.

---

## 2. Design Direction

### Mood: "Luxury Feminine Expert"
- Warm, inviting, premium — not cold/tech
- Gold + rose + cream tones — feels like entering a high-end salon
- Confidence and trust — 10+ years expertise
- Clean but alive — every section breathes and moves

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| --gold | #c9a96e | Primary accent, CTAs, highlights |
| --rose | #b76e79 | Secondary accent, hover states |
| --cream | #faf5ef | Main background |
| --dark | #1a1a1a | Headlines, dark sections |
| --text | #3d3d3d | Body text |
| --text-light | #8a8a8a | Muted text, captions |
| --white | #ffffff | Cards, overlays |

### Typography
- **Display/H1:** Playfair Display (serif) — elegant, editorial
- **Body/Nav/Buttons:** Montserrat (sans-serif) — clean, modern
- **Contrast:** Large serif headlines + small sans body = luxury editorial feel

---

## 3. Animations & Dynamic Elements

### Hero Section
- **Three.js 3D Model:** Floating golden scissors that rotate slowly, react to mouse movement (parallax follow), and scale/rotate on scroll via GSAP ScrollTrigger
- **Text Animation:** Each word of the headline fades in with stagger (GSAP SplitText-style via custom split)
- **Floating Particles:** Soft golden dots drifting in the background (Three.js Points)
- **Stats Counter:** Numbers animate up (0 → 4, 0 → 5, 0 → 100+) when hero loads

### Scroll Animations (GSAP ScrollTrigger)
- **Every section title:** Characters split and stagger-fade on scroll
- **Cards:** Slide up + fade with stagger delay per card
- **Images:** Clip-path reveal (rectangle grows from center)
- **Parallax:** Background elements move at different speeds

### Hover Effects
- **Buttons:** Magnetic pull effect (button follows cursor slightly)
- **Cards:** 3D tilt on hover (CSS perspective transform)
- **Links:** Underline grows from left on hover

### Smooth Scroll
- **Lenis:** Buttery-smooth scroll throughout the page
- **GSAP ScrollTrigger:** Synchronized with Lenis for scroll-driven animations

### Custom Cursor (desktop only)
- Small dot + larger ring that follows with delay
- Changes size on hover over interactive elements
- Hidden on mobile/touch devices

---

## 4. Three.js Integration

### Hero 3D Scene
- **Canvas:** Fixed behind hero content, fades out as user scrolls past hero
- **Model:** Golden metallic scissors — slowly auto-rotating, follows mouse with damped movement
- **Lighting:** Warm ambient + directional with soft shadows
- **Particles:** ~200 small golden spheres floating gently around the model
- **Scroll behavior:** Model scales down and rotates away as user scrolls (ScrollTrigger)

### 3D Model Requirements
**PLACEHOLDER:** The current build uses a procedural golden torus knot as a stand-in.

**DOWNLOAD THESE for the final version:**
1. **Barber Scissors (Sketchfab):** https://sketchfab.com/3d-models/barbers-scissors-8b9086eed6a048f8967044fa92a65c4a
   - Download as .glb format
   - Place in project root as `scissors.glb`
   - Low-poly (6.7k triangles), animated, CC Attribution license
   
2. **Alternative — Barber Tool Set:** https://sketchfab.com/3d-models/barber-tool-fffbed22b92b49fe9cddabf928366f57
   - Includes scissors + comb + razor
   - More detailed but heavier

3. **Hair Comb (optional second model):** Search "CC0 Hair Comb" on CGTrader or Sketchfab
   - Can float alongside scissors for visual richness

---

## 5. Page Structure

| Section | Content | Animation |
|---------|---------|-----------|
| **Header** | Logo + nav links + hamburger | Fade down on load; blur bg on scroll |
| **Hero** | 3D canvas + name + tagline + stats + CTA | Text split-stagger; 3D model float; counter animation |
| **About** | Two-column: text + image reveal | Clip-path image reveal; text fade-up |
| **Program** | Animated timeline with 5 modules | Timeline draws on scroll; modules stagger in |
| **Pricing** | 4 cards with 3D tilt hover | Cards slide up + stagger; tilt on hover |
| **Author** | Photo + bio + Instagram | Photo parallax; text slide-in |
| **Gallery** | Horizontal scroll of work images | GSAP horizontal scroll pin |
| **FAQ** | Accordion with smooth height animation | Items fade in on scroll |
| **Footer** | Contact + social + copyright | Simple fade-in |

---

## 6. Technical Stack

| Library | Version | CDN | Purpose |
|---------|---------|-----|---------|
| Three.js | r162 | unpkg | 3D scene, model loading, particles |
| GSAP | 3.12 | cdnjs | All animations, ScrollTrigger |
| ScrollTrigger | 3.12 | cdnjs | Scroll-driven animations |
| Lenis | 1.1 | unpkg | Smooth scrolling |
| Google Fonts | — | googleapis | Playfair Display + Montserrat |

No build tools, no framework — pure HTML/CSS/JS for simplicity and speed.

---

## 7. Mobile Strategy

- **3D:** Simplified on mobile — fewer particles, no mouse-follow, smaller model
- **Cursor:** Hidden on touch devices
- **Animations:** Reduced motion for `prefers-reduced-motion`
- **Layout:** Single column, stacked sections, full-width cards
- **Touch:** 48px min touch targets, comfortable spacing
- **Performance:** Lazy load images, conditional 3D loading (skip on very low-end)

---

## 8. Implementation Order

1. HTML structure with all sections and semantic markup
2. CSS design system, layout, responsive, custom cursor, tilt effects
3. JS: Lenis smooth scroll + GSAP ScrollTrigger setup
4. JS: Three.js hero scene (placeholder geometry → swap with .glb later)
5. JS: Text split animations, counters, scroll reveals
6. JS: Horizontal gallery, accordion, magnetic buttons
7. Final polish: mobile testing, reduced motion, performance

---

**Status: BUILDING NOW**
