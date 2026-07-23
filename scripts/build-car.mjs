/*
 * Generates public/car.glb — a two-tone luxury EV sedan.
 *   · Paint: black metallic (upper body) + white-silver band (lower body),
 *     encoded as vertex colours on a parametric lofted body.
 *   · Dark panoramic glass canopy, black rubber tyres, silver multi-spoke
 *     forged rims + brake discs, silver side mirrors.
 * Runs in plain Node (no DOM): builds THREE BufferGeometries, then packs
 * POSITION / NORMAL / COLOR_0 / indices into a single binary GLB by hand.
 *
 *   node scripts/build-car.mjs
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'car.glb')

/* ---------- parametric body (same design curves as the live scene) ---------- */
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}
function interp(ctrl, x) {
  if (x >= ctrl[0][0]) return ctrl[0][1]
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [xa, va] = ctrl[i], [xb, vb] = ctrl[i + 1]
    if (x <= xa && x >= xb) {
      const t = (xa - x) / (xa - xb)
      const ts = t * t * (3 - 2 * t)
      return va + (vb - va) * ts
    }
  }
  return ctrl[ctrl.length - 1][1]
}
const TOP = [[2.62, 0.54], [2.3, 0.6], [1.2, 0.66], [0.9, 0.7], [0.0, 0.76], [-1.0, 0.78], [-1.8, 0.76], [-2.3, 0.73], [-2.52, 0.7]]
const HALF_W = [[2.62, 0.52], [2.35, 0.72], [1.55, 0.92], [0.6, 0.9], [-0.5, 0.91], [-1.5, 0.96], [-2.3, 0.86], [-2.52, 0.64]]
const FLARE = (x) => 0.022 * Math.exp(-(((x - 1.55) / 0.55) ** 2)) + 0.032 * Math.exp(-(((x + 1.5) / 0.6) ** 2))
const archLift = (x) => {
  const f = 0.3 + Math.sqrt(Math.max(0, 0.5 ** 2 - (x - 1.55) ** 2))
  const r = 0.3 + Math.sqrt(Math.max(0, 0.52 ** 2 - (x + 1.5) ** 2))
  return Math.max(0.17, f, r)
}

function buildBodyGeometry() {
  const NX = 120, NR = 64
  const stations = []
  for (let i = 0; i < NX; i++) stations.push(2.62 - (i / (NX - 1)) * (2.62 + 2.52))
  const verts = [], idx = [], cols = []
  const TONE_DARK = [0.028, 0.032, 0.045]    // deep gloss black metallic
  const TONE_SILVER = [0.9, 0.93, 0.97]      // bright white silver
  const toneAt = (y) => {
    const s = 1 - smooth(0.5, 0.62, y) // silver body sides, black metallic above the beltline
    return [
      TONE_DARK[0] + (TONE_SILVER[0] - TONE_DARK[0]) * s,
      TONE_DARK[1] + (TONE_SILVER[1] - TONE_DARK[1]) * s,
      TONE_DARK[2] + (TONE_SILVER[2] - TONE_DARK[2]) * s,
    ]
  }
  for (let i = 0; i < NX; i++) {
    const x = stations[i]
    const yTop = interp(TOP, x)
    const y0 = archLift(x)
    const w = interp(HALF_W, x) * (1 - 0.08 * smooth(2.2, 2.62, x))
    for (let k = 0; k < NR; k++) {
      const th = -Math.PI / 2 + (k / NR) * Math.PI * 2
      const sy = Math.sin(th), cz = Math.cos(th)
      // arches are cut only near the body sides; the floor between the
      // wheels stays low so the belly doesn't lift and expose a tunnel
      const side = smooth(0.45, 0.85, Math.abs(cz))
      const yBot = 0.17 + (y0 - 0.17) * side
      const yc = (yBot + yTop) / 2
      const ry = Math.max((yTop - yBot) / 2, 0.02)
      let y = yc + ry * Math.sign(sy) * Math.abs(sy) ** 0.85
      let z = w * Math.sign(cz) * Math.abs(cz) ** 0.66
      z *= 1 - smooth(yTop - 0.14, yTop, y) * 0.1
      z *= 1 + FLARE(x) * Math.exp(-(((y - 0.5) / 0.2) ** 2))
      // sill tuck: body is widest at the shoulder and narrows toward the
      // rockers so the wheels sit flush with the fenders and stay visible
      z *= 1 - 0.16 * (1 - smooth(0.24, 0.52, y))
      verts.push(x, y, z)
      cols.push(...toneAt(y))
    }
  }
  for (let i = 0; i < NX - 1; i++) {
    for (let k = 0; k < NR; k++) {
      const a = i * NR + k
      const b = i * NR + ((k + 1) % NR)
      const c = (i + 1) * NR + k
      const d = (i + 1) * NR + ((k + 1) % NR)
      idx.push(a, b, c, b, d, c)
    }
  }
  const noseC = verts.length / 3
  const noseY = (archLift(2.62) + interp(TOP, 2.62)) / 2
  verts.push(2.62, noseY, 0); cols.push(...toneAt(noseY))
  for (let k = 0; k < NR; k++) idx.push(noseC, k, (k + 1) % NR)
  const tailC = verts.length / 3
  const li = (NX - 1) * NR
  const tailY = (archLift(-2.52) + interp(TOP, -2.52)) / 2
  verts.push(-2.52, tailY, 0); cols.push(...toneAt(tailY))
  for (let k = 0; k < NR; k++) idx.push(tailC, li + ((k + 1) % NR), li + k)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/* ---------- glass canopy ---------- */
function buildGlassGeometry() {
  const s = new THREE.Shape()
  s.moveTo(-1.8, 0.74)
  s.quadraticCurveTo(-1.62, 1.0, -1.15, 1.05)
  s.quadraticCurveTo(-0.5, 1.11, 0.1, 1.08)
  s.quadraticCurveTo(0.62, 1.01, 1.02, 0.72)
  s.lineTo(-1.8, 0.74)
  const g = new THREE.ExtrudeGeometry(s, { depth: 1.32, bevelEnabled: false, curveSegments: 20 })
  g.translate(0, 0.02, -0.66)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y > 0.78) pos.setZ(i, pos.getZ(i) * (1 - smooth(0.78, 1.15, y) * 0.52))
  }
  g.computeVertexNormals()
  g.deleteAttribute('uv')
  return g
}

/* ---------- wheels ---------- */
const tireGeos = []
const silverGeos = []
function place(geo, x, y, z) { const c = geo.clone(); c.translate(x, y, z); return c }

function buildWheel(x, y, z) {
  const face = z > 0 ? 0.105 : -0.105
  // tyre (black rubber)
  const tire = new THREE.TorusGeometry(0.355, 0.105, 14, 32)
  const tread = new THREE.CylinderGeometry(0.455, 0.455, 0.15, 32); tread.rotateX(Math.PI / 2)
  tireGeos.push(place(tire, x, y, z), place(tread, x, y, z))
  // forged silver rim
  const dish = new THREE.CylinderGeometry(0.34, 0.34, 0.02, 28); dish.rotateX(Math.PI / 2)
  silverGeos.push(place(dish, x, y, z + face * 0.6))
  const lipRing = new THREE.TorusGeometry(0.34, 0.012, 6, 32)
  silverGeos.push(place(lipRing, x, y, z + face))
  const hub = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 14); hub.rotateX(Math.PI / 2)
  silverGeos.push(place(hub, x, y, z + face))
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    const spoke = new THREE.BoxGeometry(0.03, 0.29, 0.024)
    spoke.rotateZ(a)
    silverGeos.push(place(spoke, x + Math.cos(a + Math.PI / 2) * 0.185, y + Math.sin(a + Math.PI / 2) * 0.185, z + face))
  }
  // brake disc (silver)
  const disc = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24); disc.rotateX(Math.PI / 2)
  silverGeos.push(place(disc, x, y, z + face * 0.35))
  // dark inner-fender liner so the arch opening isn't see-through
  const liner = new THREE.CylinderGeometry(0.44, 0.44, 0.05, 20); liner.rotateX(Math.PI / 2)
  tireGeos.push(place(liner, x, y, z - face * 2))
}
for (const [x, y, z] of [[1.55, 0.28, 0.84], [1.55, 0.28, -0.84], [-1.5, 0.28, 0.84], [-1.5, 0.28, -0.84]]) buildWheel(x, y, z)

// side mirrors (silver)
for (const z of [0.72, -0.72]) {
  const pod = new THREE.SphereGeometry(0.055, 12, 8)
  pod.scale(1.5, 0.7, 1.0)
  silverGeos.push(place(pod, 0.72, 0.8, z))
}

function clean(g) { g.deleteAttribute('uv'); if (g.attributes.color) g.deleteAttribute('color'); return g }
const tiresMerged = mergeGeometries(tireGeos.map(clean))
const silverMerged = mergeGeometries(silverGeos.map(clean))
const bodyGeo = buildBodyGeometry()
const glassGeo = buildGlassGeometry()

/* ---------- GLB writer ---------- */
const FLOAT = 5126, UINT = 5125
const ARRAY_BUFFER = 34962, ELEMENT_ARRAY_BUFFER = 34963
const gltf = {
  asset: { version: '2.0', generator: 'autocan-build-car' },
  scene: 0, scenes: [{ nodes: [] }],
  nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [],
}
const chunks = []
let byteOffset = 0
function addBufferView(buf, target) {
  const view = { buffer: 0, byteOffset, byteLength: buf.length }
  if (target) view.target = target
  gltf.bufferViews.push(view)
  chunks.push(buf)
  byteOffset += buf.length
  const pad = (4 - (byteOffset % 4)) % 4
  if (pad) { chunks.push(Buffer.alloc(pad)); byteOffset += pad }
  return gltf.bufferViews.length - 1
}
function addAccessor(typed, type, componentType, count, minmax, target) {
  const buf = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength)
  const bv = addBufferView(buf, target)
  const acc = { bufferView: bv, byteOffset: 0, componentType, count, type }
  if (minmax) { acc.min = minmax.min; acc.max = minmax.max }
  gltf.accessors.push(acc)
  return gltf.accessors.length - 1
}
function posMinMax(arr) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < arr.length; i += 3) for (let j = 0; j < 3; j++) {
    min[j] = Math.min(min[j], arr[i + j]); max[j] = Math.max(max[j], arr[i + j])
  }
  return { min, max }
}
function addMaterial(name, baseColorFactor, metallicFactor, roughnessFactor, extra = {}) {
  gltf.materials.push({ name, doubleSided: true, pbrMetallicRoughness: { baseColorFactor, metallicFactor, roughnessFactor }, ...extra })
  return gltf.materials.length - 1
}
function addMesh(name, geo, material) {
  const pos = new Float32Array(geo.attributes.position.array)
  const posAcc = addAccessor(pos, 'VEC3', FLOAT, pos.length / 3, posMinMax(pos), ARRAY_BUFFER)
  const nrm = new Float32Array(geo.attributes.normal.array)
  const nrmAcc = addAccessor(nrm, 'VEC3', FLOAT, nrm.length / 3, null, ARRAY_BUFFER)
  const attributes = { POSITION: posAcc, NORMAL: nrmAcc }
  if (geo.attributes.color) {
    const col = new Float32Array(geo.attributes.color.array)
    attributes.COLOR_0 = addAccessor(col, 'VEC3', FLOAT, col.length / 3, null, ARRAY_BUFFER)
  }
  const idxSrc = geo.index ? geo.index.array : null
  let indices
  if (idxSrc) {
    const idx = new Uint32Array(idxSrc)
    indices = addAccessor(idx, 'SCALAR', UINT, idx.length, null, ELEMENT_ARRAY_BUFFER)
  }
  gltf.meshes.push({ name, primitives: [{ attributes, ...(indices != null ? { indices } : {}), material }] })
  gltf.nodes.push({ name, mesh: gltf.meshes.length - 1 })
  gltf.scenes[0].nodes.push(gltf.nodes.length - 1)
}

const matBody = addMaterial('BlackMetallicPaint', [1, 1, 1, 1], 0.95, 0.18)
const matGlass = addMaterial('Glass', [0.04, 0.08, 0.14, 1], 0.0, 0.06, { alphaMode: 'BLEND' })
const matTire = addMaterial('Tire', [0.06, 0.065, 0.075, 1], 0.05, 0.85)
const matSilver = addMaterial('SilverTrim', [0.92, 0.94, 0.98, 1], 1.0, 0.12)

addMesh('Body', bodyGeo, matBody)
addMesh('Glass', glassGeo, matGlass)
addMesh('Tires', tiresMerged, matTire)
addMesh('Silver', silverMerged, matSilver)

const binBuffer = Buffer.concat(chunks)
gltf.buffers.push({ byteLength: binBuffer.length })
let jsonBuf = Buffer.from(JSON.stringify(gltf), 'utf8')
const jsonPad = (4 - (jsonBuf.length % 4)) % 4
if (jsonPad) jsonBuf = Buffer.concat([jsonBuf, Buffer.from(' '.repeat(jsonPad))])

const header = Buffer.alloc(12)
header.writeUInt32LE(0x46546c67, 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + binBuffer.length, 8)
const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(jsonBuf.length, 0)
jsonHeader.writeUInt32LE(0x4e4f534a, 4)
const binHeader = Buffer.alloc(8)
binHeader.writeUInt32LE(binBuffer.length, 0)
binHeader.writeUInt32LE(0x004e4942, 4)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuffer]))
console.log(`car.glb written: ${(Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuffer]).length / 1024).toFixed(1)} KB`)
console.log(`  meshes: ${gltf.meshes.length}, accessors: ${gltf.accessors.length}, bin: ${(binBuffer.length / 1024).toFixed(1)} KB`)
