---
name: Insight Scholastic
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4e5e81'
  primary: '#031635'
  on-primary: '#ffffff'
  primary-container: '#1a2b4b'
  on-primary-container: '#8293b8'
  inverse-primary: '#b6c6ef'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#231400'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e2700'
  on-tertiary-container: '#b08d5b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#b6c6ef'
  on-primary-fixed: '#081b3a'
  on-primary-fixed-variant: '#364768'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#ffddb1'
  tertiary-fixed-dim: '#e8c08a'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#5d4217'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1200px
---

## Brand & Style

The design system is engineered for a Psychoanalytic Association's e-learning platform, emphasizing academic rigour, clinical depth, and humanistic warmth. The brand personality is **Intellectual, Trustworthy, and Serene**. It caters to mental health professionals and students who value deep focus and authoritative content.

The visual style is **Corporate / Modern** with a lean toward **Minimalist Editorial**. It utilizes generous whitespace to reduce cognitive load, allowing complex psychoanalytic concepts to breathe. The interface mimics the quiet atmosphere of a high-end clinical practice or a university library—professional, hushed, and deeply intentional.

## Colors

The palette is rooted in a **Deep Midnight Blue (#1A2B4B)**, which provides a sense of stability, depth, and institutional authority. This is balanced by a **Warm Gold (#C5A059)** accent, used sparingly to highlight path-critical actions, achievements, or premium markers, evoking a sense of "enlightenment" or scholarly value.

- **Primary:** Used for navigation, primary headings, and grounding structural elements.
- **Secondary (Accent):** Reserved for primary buttons, progress indicators, and active states.
- **Neutral:** A range of cool grays and off-whites ensure readability and content hierarchy without the harshness of pure black-on-white.
- **Feedback:** Muted, sophisticated versions of green and red are used for system alerts, maintaining the calm demeanor of the platform even during errors.

## Typography

This design system employs a **transitional serif/sans-serif pairing**. 

**Libre Caslon Text** is used for headlines and display text to establish a literary, authoritative tone reminiscent of published journals and clinical papers. 

**Inter** is the workhorse for body text and interface elements. Its high legibility and neutral character ensure that long-form reading—essential for e-learning—remains comfortable over extended periods.

For body text, a generous **line height (1.7x)** is maintained to facilitate better tracking and focus. Labels use a slightly increased letter spacing and uppercase styling to provide clear distinction from instructional copy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to ensure optimal line lengths for reading scholarly text. 

- **Desktop:** 12-column grid, 1200px max width, centered.
- **Tablet:** 8-column grid, fluid margins.
- **Mobile:** 4-column grid, 16px side margins.

The spacing rhythm is based on an **8px base unit**. Component internal padding should be generous (typically 16px or 24px) to avoid visual clutter. Vertical rhythm is critical; sections should be separated by at least 80px (10 units) on desktop to clearly define the progression of thought within the e-learning modules.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** rather than heavy shadows.

- **Base Layer:** Pure White (#FFFFFF) for the primary content area.
- **Secondary Layer:** Light Gray (#F8F9FA) for sidebars, navigation bars, or secondary information widgets.
- **Tertiary Layer:** Subtle 1px borders (#E9ECEF) are preferred over shadows to define card boundaries.

Where depth is absolutely necessary (e.g., modals or dropdowns), use **Ambient Shadows**: Very soft, large-radius blurs (24px+) with extremely low opacity (4-6%) and a slight Midnight Blue tint to maintain color harmony.

## Shapes

The shape language is **Soft (Level 1)**. 

A 4px border radius (`0.25rem`) is the standard for most interface elements like input fields and buttons. This provides a professional, "tailored" appearance that is softer than a sharp 90-degree angle but more serious than highly rounded "bubbly" designs.

Larger containers like course cards or video players may use `rounded-lg` (8px) to feel more approachable. Icons should follow a "line-art" style with consistent 2px stroke weights.

## Components

### Buttons
- **Primary:** Solid Midnight Blue background with White text. For high-importance calls to action (e.g., "Enroll Now"), use the Gold accent background with Midnight Blue text.
- **Secondary:** Transparent background with a 1px Midnight Blue border.
- **Tertiary:** Text-only with an underline on hover, used for "Cancel" or "Learn More."

### Input Fields
- Outlined style with a 1px gray border. On focus, the border shifts to Midnight Blue with a subtle 2px glow. Labels are always persistent and positioned above the field.

### Chips & Tags
- Used for "Category" or "Reading Time." Use a Light Gray background with Midnight Blue text. Rounded-pill shape for these specific elements to contrast against the structured grid.

### Cards
- White background with a subtle border. Titles in Libre Caslon Text. Cards should have clear internal padding (24px) to separate the thumbnail image from the text content.

### Feedback States
- **Success:** Subtle green background banner with dark green text.
- **Alert:** Warm gold border on a pale cream background for notifications that require attention but aren't critical errors.