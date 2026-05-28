---
sessionId: session-260526-220356-9pyh
---

# Requirements

### Overview & Goals
Replace the two project link buttons on the homepage with a visually richer card-based layout. Cards provide more room for project titles (and future metadata like descriptions/thumbnails) and a more modern look compared to plain buttons.

### Scope
**In Scope**
- Convert the two project entries (`UG Capstone Project`, `Self-Hosted Forgejo Instance`) in `codedragon/index.html` from `<a><button></button></a>` to clickable card anchors.
- Add `.card-container` and `.card` styles in `codedragon/static/styles/styles.scss` and the compiled `codedragon/static/styles/styles.css`.
- Preserve existing link targets and `target="_blank"` behavior.

**Out of Scope**
- Adding new projects, images, or descriptions inside cards.
- Changing the About Me list or other page sections.
- Responsive tweaks beyond what current media queries already cover (can be a follow-up).

### Functional Requirements
- Each project is rendered as a single clickable card linking to its external URL in a new tab.
- Cards are arranged horizontally with wrapping on smaller widths, centered within `#contentBody`.
- Hover state provides a subtle visual cue (e.g., scale transform).

# Technical Design

### Current Implementation
- `codedragon/index.html` lists projects inside `#contentBody` as `<a class="button" id="formBtn">` wrapping `<button class="btnLink">`.
- Global styles live in `codedragon/static/styles/styles.scss` (source) and `styles.css` (compiled). The page uses CSS custom properties like `--bg-monochromatic`, `--text-color`.
- Layout uses flexbox throughout (`body`, `main`, `#contentBody` with `flex-direction: column`).

### Key Decisions
- **Anchor-as-card**: Use `<a class="card">` directly instead of nesting a `<button>` inside `<a>` (the current pattern is invalid HTML). Rationale: semantically correct, simpler styling, accessible.
- **Flex wrap container**: `.card-container` uses `display: flex; flex-flow: row wrap` rather than CSS grid. Rationale: matches the flex patterns used elsewhere in the stylesheet and handles 2+ cards gracefully.
- **Reuse CSS variables**: Card background/border/text colors come from existing `:root` custom properties to stay consistent with the theme.
- **Edit both `.scss` and `.css`**: There is no visible build step in the repo; the compiled `styles.css` is committed and served. Both files must stay in sync.

### Proposed Changes
1. In `codedragon/index.html`, replace the two `<a><button></button></a>` blocks under `<h3>Projects:</h3>` with a single `.card-container` wrapping two `<a class="card">` elements, each containing an `<h4>` with the project name.
2. In `codedragon/static/styles/styles.scss`, add `.card-container` and `.card` rules (with `&:hover` and nested `h4` rule).
3. Mirror the same rules in compiled form in `codedragon/static/styles/styles.css`.

### Data Models / Contracts
HTML structure per card:
```html
<div class="card-container">
  <a class="card" href="<URL>" target="_blank">
    <h4>Project Name</h4>
  </a>
</div>
```

Key SCSS additions:
```scss
.card-container { display: flex; flex-flow: row wrap; gap: 20px; justify-content: center; margin: 20px 0; }
.card {
  background: var(--bg-monochromatic);
  border: 1px solid var(--text-color);
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  color: var(--text-color);
  width: 250px;
  text-align: center;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
  h4 { margin-bottom: 0; }
}
```

### File Structure
- Modified: `codedragon/index.html`
- Modified: `codedragon/static/styles/styles.scss`
- Modified: `codedragon/static/styles/styles.css`

### Risks
- `styles.css` and `styles.scss` drifting out of sync — mitigated by updating both in the same change.
- Existing `#formBtn` id was duplicated across both links (invalid HTML); removing it during conversion eliminates that bug.
- Card width (`250px`) may overflow on very narrow viewports; current responsive media query already collapses layout — verify visually.

# Testing

### Validation Approach
Manual visual verification by opening `codedragon/index.html` in a browser (or via the configured nginx container) and inspecting the Projects section.

### Key Scenarios
- Both project cards render side-by-side on a wide viewport with consistent sizing.
- Clicking either card opens the correct external URL in a new tab.
- Hover over a card produces the scale transform.

### Edge Cases
- Narrow viewport (mobile breakpoint): cards wrap to a single column and remain readable.
- Keyboard navigation: cards are focusable as anchors and activate via Enter.

# Delivery Steps

###   Step 1: Replace project buttons with card markup in index.html
The Projects section in `codedragon/index.html` uses a `.card-container` wrapping two `.card` anchors.

- Remove the two `<a class="button" id="formBtn">…<button class="btnLink">…</button></a>` blocks under `<h3>Projects:</h3>`.
- Add a `<div class="card-container">` containing two `<a class="card" target="_blank">` elements, one per project, each with an `<h4>` for the title.
- Preserve the existing href values for UG Capstone and the Forgejo instance.

###   Step 2: Add card styles to styles.scss
`codedragon/static/styles/styles.scss` contains new `.card-container` and `.card` rules consistent with the existing theme variables.

- Add `.card-container` with flex row-wrap layout, centered with gap.
- Add `.card` with background `var(--bg-monochromatic)`, border using `var(--text-color)`, padding, rounded corners, fixed width, centered text, and `transition: transform 0.2s`.
- Nest a `&:hover { transform: scale(1.05); }` rule and an `h4 { margin-bottom: 0; }` rule inside `.card`.

###   Step 3: Mirror card styles in compiled styles.css
`codedragon/static/styles/styles.css` exposes the same card rules so the served stylesheet matches the SCSS source.

- Append equivalent flat CSS for `.card-container`, `.card`, `.card:hover`, and `.card h4` (no nesting) to `styles.css`.
- Place the rules before the `@media` responsive block to keep file ordering logical.
- Verify CSS variable names match those defined in `:root`.