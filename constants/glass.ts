import type { ViewStyle, TextStyle } from "react-native";

export type AxisMode = "light" | "dark";
export const glassPalette = {
  light: {
    background: "#F7F7F7", backgroundEnd: "#EDEDED", text: "#171717",
    muted: "#646464", accent: "#171717", accentText: "#FFFFFF",
    surface: "rgba(255,255,255,0.38)", surfaceStrong: "rgba(255,255,255,0.58)",
    surfaceSoft: "rgba(255,255,255,0.20)", border: "rgba(255,255,255,0.65)",
    divider: "rgba(0,0,0,0.08)", shadow: "#3C3C3C",
    nav: "rgba(245,245,245,0.38)", navIcon: "#555555",
    navSelected: "rgba(255,255,255,0.72)", inputPlaceholder: "#777777",
  },
  dark: {
    background: "#080808", backgroundEnd: "#1A1A1A", text: "#F5F5F5",
    muted: "#B2B2B2", accent: "#E8E8E8", accentText: "#111111",
    surface: "rgba(100,100,100,0.16)", surfaceStrong: "rgba(100,100,100,0.28)",
    surfaceSoft: "rgba(120,120,120,0.12)", border: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.10)", shadow: "#000000",
    nav: "rgba(70,70,70,0.22)", navIcon: "#BDBDBD",
    navSelected: "rgba(255,255,255,0.16)", inputPlaceholder: "#A0A0A0",
  },
} as const;

export type GlassPalette = typeof glassPalette.light | typeof glassPalette.dark;

const imageOverlay = /overlay|gradient|image|photo|picture|shade|darkOverlay/i;
const semanticAccent = /active|selected|primary|confirm|submit|continue|nextButton|createButton|saveButton|addButton|finishButton/i;
const semanticSurface = /card|container|button|input|field|box|pill|chip|option|row|panel|modal|popup|dropdown|search|currency|segment|badge|item|tile|summary|sheet|switch|filter/i;
const semanticText = /text|title|subtitle|label|description|caption|name|value|amount|hint|info|placeholder|heading|message/i;

export function glassColor(
  property: string,
  original: string,
  styleName: string,
  palette: GlassPalette,
): string {
  const c = original.toLowerCase();
  if (property === "shadowColor") return palette.shadow;
  if (property === "borderColor" || property === "borderBottomColor" || property === "borderTopColor") {
    if (/red|blue|green|yellow|swatch|colorOption/i.test(styleName)) return original;
    return /card|panel|modal|sheet|searchContainer|Button$/i.test(styleName) ? palette.border : "transparent";
  }
  if (property === "backgroundColor") {
    if (/^container$|^screen$|^page$|^root$|^safeArea$/i.test(styleName)) return palette.background;
    if (imageOverlay.test(styleName) || /red|blue|green|yellow|colorSwatch|colorCircle|colorOption/i.test(styleName)) return original;
    if (/(?:button|submit|continue|confirm|save|finish|next)/i.test(styleName) && !/card|container|input|switch|toggle/i.test(styleName)) return palette.accent;
    if (semanticAccent.test(styleName)) return palette.accent;
    if (semanticSurface.test(styleName)) return palette.surface;
    if (c === "#ffffff" || c === "#fff" || c === "#f7f7f7" || c === "#f5f5f5" || c === "#f8f8f8" || c === "#eeeeee" || c === "#e7e7e7") return palette.surface;
    if (c === "#000000" || c === "#000" || c === "#303030" || c === "#333333") return palette.accent;
    return original;
  }
  if (property === "color") {
    if (imageOverlay.test(styleName)) return original;
    if (/(?:button|submit|continue|confirm|save|finish|next).*text/i.test(styleName)) return palette.accentText;
    if (semanticAccent.test(styleName) && /text/i.test(styleName)) return palette.accentText;
    if (/(active|selected)/i.test(styleName) && semanticText.test(styleName)) return palette.accentText;
    if (/^#(?:fff|ffffff)$/.test(c)) return palette.text;
    if (/^#(?:000|000000)$/.test(c)) return palette.text;
    if (/^#(?:8492a8|888888|999999|8b8b8b|777777|666666|687076|a7a7a7)$/.test(c)) return palette.muted;
    if (semanticText.test(styleName)) return palette.text;
    return palette.text;
  }
  return original;
}

/** Only outer glass surfaces receive a border. Nested labels, text, and image
 * wrappers must never get outlines (they caused the rectangular artifacts). */
export function glassDecoration(name: string, palette: GlassPalette): ViewStyle {
  const surface = /(?:^|[A-Z])(card|panel|modal|sheet)$/i.test(name) ||
    /^(searchContainer|profileButton|filterButton|filterButtonActive|inputContainer|optionButton|primaryButton|secondaryButton)$/i.test(name);
  if (!surface || /image|photo|picture|pressed|title|subtitle|text|info/i.test(name)) return {};
  return {
    borderWidth: 0.75,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 2,
  };
}
