"use strict";

const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.resolve(__dirname, "..");
const COLORS = {
  cream: [246, 240, 228, 255],
  green: [21, 91, 69, 255],
  red: [184, 67, 63, 255],
  white: [255, 252, 246, 255],
  gold: [181, 135, 64, 255]
};

function roundedRect(x, y, left, top, right, bottom, radius) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function circle(x, y, cx, cy, radius) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function lineDistance(x, y, x1, y1, x2, y2) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = x - x1, wy = y - y1;
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(x - (x1 + t * vx), y - (y1 + t * vy));
}

function archStroke(x, y, cx, shoulderY, radius, bottom, thickness) {
  const onArc = y <= shoulderY && Math.abs(Math.hypot(x - cx, y - shoulderY) - radius) <= thickness;
  const leftLeg = lineDistance(x, y, cx - radius, shoulderY, cx - radius, bottom) <= thickness;
  const rightLeg = lineDistance(x, y, cx + radius, shoulderY, cx + radius, bottom) <= thickness;
  return onArc || leftLeg || rightLeg;
}

function colorAt(x, y, maskable) {
  let color = COLORS.cream;
  const panel = maskable || roundedRect(x, y, 0.035, 0.035, 0.965, 0.965, 0.19);
  if (!panel) return color;
  color = COLORS.green;

  const thickness = 0.014;
  const architecture =
    archStroke(x, y, 0.50, 0.47, 0.185, 0.78, thickness) ||
    archStroke(x, y, 0.205, 0.56, 0.115, 0.78, thickness) ||
    archStroke(x, y, 0.795, 0.56, 0.115, 0.78, thickness) ||
    lineDistance(x, y, 0.075, 0.78, 0.925, 0.78) <= thickness;
  if (architecture) color = COLORS.white;

  if (circle(x, y, 0.50, 0.39, 0.072)) color = COLORS.red;
  if (roundedRect(x, y, 0.375, 0.845, 0.458, 0.88, 0.008)) color = COLORS.green;
  if (roundedRect(x, y, 0.458, 0.845, 0.542, 0.88, 0.008)) color = COLORS.white;
  if (roundedRect(x, y, 0.542, 0.845, 0.625, 0.88, 0.008)) color = COLORS.red;
  return color;
}

function render(size, filename, maskable = false) {
  const png = new PNG({ width: size, height: size });
  const samples = size >= 512 ? 2 : 3;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const sum = [0, 0, 0, 0];
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const x = (px + (sx + 0.5) / samples) / size;
          const y = (py + (sy + 0.5) / samples) / size;
          const c = colorAt(x, y, maskable);
          for (let k = 0; k < 4; k++) sum[k] += c[k];
        }
      }
      const idx = (py * size + px) * 4;
      const count = samples * samples;
      for (let k = 0; k < 4; k++) png.data[idx + k] = Math.round(sum[k] / count);
    }
  }
  fs.writeFileSync(path.join(ROOT, "icons", filename), PNG.sync.write(png));
}

render(192, "icon-192.png");
render(512, "icon-512.png");
render(512, "icon-512-maskable.png", true);
render(180, "apple-touch-icon-180.png");
console.log("Ciao Italia icons generated.");
