# Font Files Setup

This directory should contain the optimized font files for the website. Follow these steps to download them:

## Download Instructions

### 1. Go to Google Fonts Helper
Visit: https://gwfh.mranftl.com/fonts

### 2. Download Karla Font
1. Search for "Karla"
2. **Charsets**: Keep only "Latin" selected (removes unnecessary characters)
3. **Styles**: Select:
   - `regular` (400)
   - `700` (bold)
4. **Download**: Click "Download files" and extract to this directory
5. **Expected files**:
   - `karla-v30-latin-regular.woff2`
   - `karla-v30-latin-700.woff2`

### 3. Add the font to the css (global.css)

```css
@font-face {
  font-display: swap;
  font-family: 'Nabla';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/nabla-v17-latin-regular.woff2') format('woff2');
}
```

Inside the `@theme` directive, add:

```css
@theme inline {
  --font-body: "Nabla", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --font-heading: "Nabla", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
```

And in the `@layer base` directive add: 

```css
@layer base {
  /* Font loading optimization */
  * {
    font-synthesis: none;
    font-kerning: auto;
    font-variant-ligatures: common-ligatures contextual;
    font-feature-settings: "kern" 1;
    text-rendering: optimizeLegibility;
  }

   h1, h2, h3, h4, h5, h6 {
      @apply font-heading; /* HEADING FONT */
      /* Prevent layout shift during font loading */
      font-display: swap;
   }

  body {
    @apply font-normal font-body; /* BODY FONT */
    @apply tracking-normal;
    color: var(--text-color-primary);
    background-color: var(--background-color-primary);
    /* Prevent layout shift during font loading */
    font-display: swap;
  }


  section[id], div[id] {
    scroll-margin-top: 2rem;
    scroll-behavior: smooth;
  }

  ::selection {
    background: var(--background-color-secondary-hover);
    color: var(--text-color-contrast);
    text-shadow: 
      -1px -1px 0 rgba(0, 255, 255, 0.4),
      2px -2px 0 rgba(255, 0, 255, 0.4),
      -2px 2px 0 rgba(255, 255, 0, 0.4);
  }
}
```

## Why This Approach?

- **Faster Loading**: Self-hosted fonts load faster than CDN fonts
- **No FOUT**: Eliminates Flash of Unstyled Text with proper `font-display: swap`
- **Smaller Files**: Latin subset reduces file size by ~90% (from ~180KB to ~18KB per font)
- **Better Performance**: Preloaded critical fonts improve Core Web Vitals
- **Privacy**: No third-party requests to Google

## File Structure
```
public/fonts/
├── karla-v30-latin-regular.woff2
├── karla-v30-latin-700.woff2
├── bricolage-grotesque-v15-latin-regular.woff2
└── bricolage-grotesque-v15-latin-700.woff2
```

## Performance Optimization

The fonts are:
- **Preloaded** in the HTML head for critical above-the-fold content
- **Subsetted** to Latin characters only
- **Configured** with `font-display: swap` to prevent FOUT
- **Fallback fonts** optimized to match sizing and prevent CLS

## Testing

After adding the font files, test for:
1. No Flash of Unstyled Text (FOUT)
2. No Cumulative Layout Shift (CLS)
3. Fast font loading in Network tab
4. Proper fallback font matching

Use the Font Style Matcher (https://meowni.ca/font-style-matcher/) to fine-tune fallback fonts if you notice any layout shifts. 