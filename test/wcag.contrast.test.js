import { describe, it, expect } from 'vitest';
import { wcagContrast, parse } from 'culori';

// Hard-coded OKLCH token values from src/index.css

/**
 * Each token value is the OKLCH string exactly as declared in index.css.
 * Culori's `parse()` understands the `oklch(L C H)` syntax natively.
 */
const DARK_TOKENS = {
  bg: 'oklch(0.188 0.046 251)',
  surface: 'oklch(0.241 0.044 255)',
  'surface-raised': 'oklch(0.285 0.043 255)',
  primary: 'oklch(0.474 0.08 201.7)',
  'on-primary': 'oklch(0.985 0.005 200)',
  text: 'oklch(0.914 0.04 258)',
  muted: 'oklch(0.78 0.014 180)',
};

const LIGHT_TOKENS = {
  bg: 'oklch(0.985 0.006 200)',
  surface: 'oklch(0.96 0.01 200)',
  'surface-raised': 'oklch(0.93 0.013 200)',
  primary: 'oklch(0.540 0.09 201.7)',
  'on-primary': 'oklch(0.99 0 0)',
  text: 'oklch(0.22 0.03 254)',
  muted: 'oklch(0.5 0.02 250)',
};

// Helper: compute WCAG contrast ratio between two OKLCH strings

/**
 * Returns the WCAG 2.1 contrast ratio between two color strings.
 * culori's `wcagContrast` accepts any format it can parse, including oklch().
 *
 * @param {string} fg - foreground color string
 * @param {string} bg - background color string
 * @returns {number} contrast ratio (e.g. 4.5)
 */
function contrast(fg, bg) {
  return wcagContrast(parse(fg), parse(bg));
}

// **Validates: Requirements 20.9**

describe('Property 44: WCAG AA contrast over token pairs (Req 20.9)', () => {
  // Dark theme
  describe('dark theme', () => {
    it('text on bg meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(DARK_TOKENS.text, DARK_TOKENS.bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('text on surface meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(DARK_TOKENS.text, DARK_TOKENS.surface);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('on-primary on primary meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(DARK_TOKENS['on-primary'], DARK_TOKENS.primary);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('muted on bg meets WCAG AA large text (>= 3:1)', () => {
      const ratio = contrast(DARK_TOKENS.muted, DARK_TOKENS.bg);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });

  // Light theme
  describe('light theme', () => {
    it('text on bg meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(LIGHT_TOKENS.text, LIGHT_TOKENS.bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('text on surface meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(LIGHT_TOKENS.text, LIGHT_TOKENS.surface);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('on-primary on primary meets WCAG AA normal text (>= 4.5:1)', () => {
      const ratio = contrast(LIGHT_TOKENS['on-primary'], LIGHT_TOKENS.primary);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('muted on bg meets WCAG AA large text (>= 3:1)', () => {
      const ratio = contrast(LIGHT_TOKENS.muted, LIGHT_TOKENS.bg);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });
});

