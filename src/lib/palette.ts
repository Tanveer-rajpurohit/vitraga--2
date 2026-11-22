/**
 * Blue-only palette for WebGL/canvas shaders. CSS tokens live in globals.css;
 * GLSL cannot read CSS variables, so the same stops are mirrored here as
 * normalized RGB. Keep both in sync.
 */
export type Vec3 = readonly [number, number, number];

function hexToVec3(hex: string): Vec3 {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const BLUE_HEX = {
  50: "#f2f7ff",
  100: "#e5efff",
  200: "#cce0ff",
  300: "#a3c8ff",
  400: "#6ba5ff",
  500: "#2b7fff",
  600: "#1e6fe6",
  700: "#1859bd",
  800: "#174a99",
  900: "#163f7a",
  950: "#0e2650",
} as const;

export type BlueStop = keyof typeof BLUE_HEX;

export const BRAND_HEX = BLUE_HEX[500];
export const BRAND_HOVER_HEX = BLUE_HEX[600];

export const BLUE_VEC3 = Object.fromEntries(
  Object.entries(BLUE_HEX).map(([stop, hex]) => [stop, hexToVec3(hex)]),
) as Record<BlueStop, Vec3>;
