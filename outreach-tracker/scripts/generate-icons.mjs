// Pure-Node PNG icon generator (no image libraries required).
// Draws a simple "ring + checkmark" glyph on a dark rounded-square background
// at each required PWA icon size and writes the PNGs to public/icons/.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const BG = [11, 15, 20, 255]; // #0b0f14
const RING = [34, 197, 94, 255]; // #22c55e
const CHECK = [230, 253, 240, 255]; // near-white green tint

function segDist(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * abx, cy = ay + t * aby;
  const dx = px - cx, dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy);
}

function cornerRadiusMask(x, y, size, r) {
  // returns true if (x,y) is inside a rounded-rect of given size/radius
  const minX = Math.min(x, size - 1 - x);
  const minY = Math.min(y, size - 1 - y);
  if (minX >= r || minY >= r) return true;
  const dx = r - minX, dy = r - minY;
  return dx * dx + dy * dy <= r * r;
}

function renderIcon(size, { rounded = true, ringScale = 1 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size * 0.5;
  const cy = size * 0.5;
  const outerR = size * 0.36 * ringScale;
  const innerR = size * 0.29 * ringScale;
  const strokeW = size * 0.045;
  const p1 = [size * 0.33, size * 0.52];
  const p2 = [size * 0.45, size * 0.64];
  const p3 = [size * 0.70, size * 0.37];
  const cornerR = rounded ? size * 0.22 : 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let color = BG;

      if (!rounded || cornerRadiusMask(x, y, size, cornerR)) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= outerR && dist >= innerR) {
          color = RING;
        } else {
          const d1 = segDist(x, y, p1[0], p1[1], p2[0], p2[1]);
          const d2 = segDist(x, y, p2[0], p2[1], p3[0], p3[1]);
          if (d1 <= strokeW / 2 || d2 <= strokeW / 2) {
            color = CHECK;
          } else {
            color = BG;
          }
        }
      } else {
        color = [0, 0, 0, 0]; // transparent corners
      }

      buf[idx] = color[0];
      buf[idx + 1] = color[1];
      buf[idx + 2] = color[2];
      buf[idx + 3] = color[3];
    }
  }
  return buf;
}

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(size, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const targets = [
  { name: 'icon-192.png', size: 192, rounded: true },
  { name: 'icon-512.png', size: 512, rounded: true },
  { name: 'favicon-32.png', size: 32, rounded: true }
];

for (const t of targets) {
  const rgba = renderIcon(t.size, { rounded: t.rounded, ringScale: t.ringScale ?? 1 });
  const png = encodePNG(t.size, rgba);
  writeFileSync(path.join(outDir, t.name), png);
  console.log(`wrote ${t.name} (${t.size}x${t.size})`);
}
