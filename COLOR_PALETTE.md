# Color Palette Documentation

## Refined Color System (Option 1 - Recommended)

This palette maintains the timeless "modern monk" aesthetic while providing depth through accent variations.

### Esoteriment Theme (Cool, Contemplative)

**Primary Colors:**
- **Accent**: `#7C8A9E` - Slate blue-gray (main accent for headings, links, badges)
- **Accent Light**: `#9BA8BA` - Lighter slate (hover states, subtle highlights)
- **Accent Dark**: `#5D6B7C` - Deeper slate (emphasis, active states)

**Backgrounds:**
- **Background**: `#FAFAF9` - Warm off-white (section backgrounds)
- **Background Alt**: `#F5F4F2` - Subtle stone gray (alternating sections, callouts)

**Text:**
- **Text**: `#1F2937` - Near black (body text, headings)
- **Muted**: `#6B7280` - Medium gray (secondary text, metadata)

### Lifeward Theme (Warm, Grounded)

**Primary Colors:**
- **Accent**: `#9A7B4F` - Warm bronze (main accent for headings, links, badges)
- **Accent Light**: `#B89A6E` - Lighter bronze (hover states, subtle highlights)
- **Accent Dark**: `#7A5F3A` - Deeper bronze (emphasis, active states)

**Backgrounds:**
- **Background**: `#FFFDF8` - Warm cream (section backgrounds)
- **Background Alt**: `#FDF9F3` - Subtle ivory (alternating sections, callouts)

**Text:**
- **Text**: `#1F2937` - Near black (body text, headings)
- **Muted**: `#6B7280` - Medium gray (secondary text, metadata)

## Usage Guidelines

### When to Use Accent Colors

1. **Primary Accent** (`accent`):
   - Section labels and badges
   - Links (with hover to accentLight)
   - Border accents
   - Reading progress bar
   - Focus states

2. **Accent Light** (`accentLight`):
   - Hover states on links and interactive elements
   - Subtle highlights
   - Secondary accents

3. **Accent Dark** (`accentDark`):
   - Active states
   - Emphasis elements
   - Deep borders when needed

### When to Use Background Colors

1. **Primary Background** (`background`):
   - Main section backgrounds (Esoteriment/Lifeward pages)
   - Article content backgrounds
   - Card backgrounds

2. **Background Alt** (`backgroundAlt`):
   - Blockquotes
   - Callout boxes
   - Alternating sections
   - Subtle dividers

## Design Principles

1. **Warm Backgrounds**: All backgrounds use warm tones to reduce eye strain and create a welcoming feel
2. **Sparsely Used Accents**: Accent colors are used strategically, not overwhelming
3. **High Contrast Text**: Dark text (`#1F2937`) on light backgrounds for excellent readability
4. **Timeless Neutral Base**: Gray scale provides foundation for the themed accents
5. **Subtle Depth**: Background variations add depth without distraction

## Accessibility

- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- Focus states use accent colors for visibility
- Color is never the sole indicator of meaning
- Interactive elements have clear hover/active states

## Implementation

Colors are defined in:
- `lib/theme.ts` - TypeScript theme object
- `app/globals.css` - CSS custom properties

Components use theme colors via:
- Direct hex values for inline styles
- CSS custom properties in global styles
- Tailwind arbitrary values where needed

