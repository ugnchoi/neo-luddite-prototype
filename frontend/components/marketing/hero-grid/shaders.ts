// Imprint's open, nested contours, sampled on the existing fixed dot lattice.
// Gradient-noise helper retained from ripple-field/src/grid/contour.mjs (2026-10-28).
export const vertexShader = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 uSize;
uniform float uTime;
uniform float uDpr;
uniform float uMaxPointSize;
out float vAlpha;

/* Per-corner gradient in [-1, 1]^2. From https://iquilezles.org/articles/gradientnoise/ */
vec2 ambHash(vec2 x) {
  vec2 k = vec2(0.3183099, 0.3678794);
  x = x * k + k.yx;
  return -1.0 + 2.0 * fract(16.0 * k * fract(x.x * x.y * (x.x + x.y)));
}

/*
 * Gradient noise: value in .x, analytic gradient in .yz. Its derivative keeps the
 * deformed contour width consistent without additional noise evaluations.
 */
vec3 ambNoised(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);

  vec2 ga = ambHash(i);
  vec2 gb = ambHash(i + vec2(1.0, 0.0));
  vec2 gc = ambHash(i + vec2(0.0, 1.0));
  vec2 gd = ambHash(i + vec2(1.0, 1.0));

  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));

  float k1 = vb - va;
  float k2 = vc - va;
  float k3 = va - vb - vc + vd;

  return vec3(
    va + u.x * k1 + u.y * k2 + u.x * u.y * k3,
    ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd) +
      du * (u.yx * k3 + vec2(k1, k2))
  );
}

// A rounded core gives the strands their shared turns and straight runs.
// Noise gently flexes that shape; the dot anchors themselves never move.
float imprintSurface(vec2 q, float t, float worldPerPx) {
  vec2 p = q - vec2(-0.55, -0.10);
  vec2 d = abs(p) - vec2(0.42, 0.14);
  vec2 outside = max(d, 0.0);
  float distance = length(outside) + min(max(d.x, d.y), 0.0) - 0.28;
  // Skip masked points, including the core where atan(0, 0) is undefined.
  if (distance <= -0.04 || distance >= 1.17) return 0.0;
  vec2 normal = sign(p) * outside / max(length(outside), 1e-5);

  vec3 noise = ambNoised(p * 1.4 + vec2(137.0, 219.0) + vec2(0.18, -0.12) * t);
  float breath = 0.65 * t + 1.7 * p.y;
  float field = distance + 0.05 * noise.x + 0.025 * sin(breath);
  vec2 gradient = normal + 0.07 * noise.yz + vec2(0.0, 0.0425 * cos(breath));

  // A slow outward trace makes the motion visible without moving the page's grid.
  const float spacing = 0.10;
  float band = fract((field - 0.012 * t) / spacing);
  float distPx = min(band, 1.0 - band) * spacing / max(length(gradient) * worldPerPx, 1e-4);
  float line = 1.0 - smoothstep(2.5, 10.0, distPx);

  // Expose only the outer strands, with the same open corner as the public mark.
  float extent = smoothstep(-0.04, 0.02, distance) * (1.0 - smoothstep(1.0, 1.17, distance));
  float opening = smoothstep(0.24, 0.38, abs(atan(p.y, p.x) + 0.55));
  return line * extent * opening;
}

void main() {
  vec2 uv = aPosition / uSize;
  vec2 q = (aPosition - uSize * 0.5) * 2.0 / uSize.y;
  float line = imprintSurface(q, uTime, 2.0 / uSize.y);
  float quiet = smoothstep(0.18, 0.7, length((uv - vec2(0.5, 0.44)) * vec2(1.8, 1.2)));
  vAlpha = (0.12 + 0.4 * line) * mix(0.12, 1.0, quiet);
  gl_PointSize = min((1.0 + 1.8 * line) * uDpr, uMaxPointSize);
  gl_Position = vec4(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, 0.0, 1.0);
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;
uniform vec3 uInk;
in float vAlpha;
out vec4 outColor;
void main() {
  float radius = length(gl_PointCoord - 0.5);
  float edge = fwidth(radius);
  float coverage = 1.0 - smoothstep(0.5 - edge, 0.5, radius);
  outColor = vec4(uInk, vAlpha * coverage);
}
`;
