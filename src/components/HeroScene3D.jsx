import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * AUTO-CAN hero v4 — enterprise automotive showroom.
 *  · luxury EV sedan: PBR clearcoat pearl paint, panoramic black glass,
 *    LED DRLs, matrix headlight lenses, carbon splitter & skirts, chrome
 *    beltline, multi-spoke alloys w/ orange calipers, blue underglow
 *  · true mirror floor (planar reflection) + soft contact shadow
 *  · KUKA-class industrial robot: cast-metal links, hydraulic joints,
 *    cable dressing — IK arm welding a seam with sparks + weld light
 *  · cinematic rig: blue key / orange rim / white top / HDRI env, light
 *    sweep across the paint, holographic rings, blueprint dimension lines
 * All procedural. Reduced-motion renders a single styled frame.
 */

const BLUE = 0x818cf8
const BLUE_SOFT = 0xa5b4fc
const ORANGE = 0x22d3ee
const INK = 0x04060b

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}
function glowSprite(tex, color, sx, sy, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  s.scale.set(sx, sy, 1)
  return s
}
function edgeLines(geo, color, opacity = 0.9, threshold = 12) {
  const e = new THREE.EdgesGeometry(geo, threshold)
  geo.dispose()
  return new THREE.LineSegments(e, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
}

// ---------------- car: lofted parametric body ----------------
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}
// piecewise-smooth interpolation over [x, value] control points (x descending)
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
// design curves (x from nose 2.72 to tail -2.52)
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
  for (let i = 0; i < NX; i++) {
    const x = 2.62 - (i / (NX - 1)) * (2.62 + 2.52)
    stations.push(x)
  }
  const verts = [], idx = [], cols = []
  // two-tone paint: black metallic above, white-silver band below the beltline
  const TONE_DARK = [0.028, 0.032, 0.045]
  const TONE_SILVER = [0.9, 0.93, 0.97]
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
    const w = interp(HALF_W, x) * (1 - 0.08 * smooth(2.2, 2.62, x)) // nose plan taper
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
      // gentle shoulder roll-in toward the beltline
      z *= 1 - smooth(yTop - 0.14, yTop, y) * 0.1
      // muscular haunch/arch flares at mid-body height
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
  // end caps
  const noseC = verts.length / 3
  const noseY = (archLift(2.62) + interp(TOP, 2.62)) / 2
  verts.push(2.62, noseY, 0)
  cols.push(...toneAt(noseY))
  for (let k = 0; k < NR; k++) idx.push(noseC, k, (k + 1) % NR)
  const tailC = verts.length / 3
  const li = (NX - 1) * NR
  const tailY = (archLift(-2.52) + interp(TOP, -2.52)) / 2
  verts.push(-2.52, tailY, 0)
  cols.push(...toneAt(tailY))
  for (let k = 0; k < NR; k++) idx.push(tailC, li + ((k + 1) % NR), li + k)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function buildCar(tex) {
  const car = new THREE.Group()
  const carbonRef = new THREE.MeshStandardMaterial({ color: 0x0c1220, metalness: 0.55, roughness: 0.5 })

  // two-tone metallic paint (vertex colors: black metallic + white-silver band)
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, vertexColors: true, metalness: 0.9, roughness: 0.33,
    clearcoat: 0.7, clearcoatRoughness: 0.06, envMapIntensity: 0.6,
    reflectivity: 1.0,
  })
  const bodyGeo = buildBodyGeometry()
  car.add(new THREE.Mesh(bodyGeo, paint))
  // hidden hologram wireframe revealed in X-ray scan mode
  const xrayEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(bodyGeo, 18),
    new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 })
  )
  car.add(xrayEdges)
  paint.transparent = true

  // panoramic glass — tinted but transmissive, interior silhouette visible
  const winShape = new THREE.Shape()
  winShape.moveTo(-1.8, 0.74)
  winShape.quadraticCurveTo(-1.62, 1.0, -1.15, 1.05)   // rear window + kink
  winShape.quadraticCurveTo(-0.5, 1.11, 0.1, 1.08)      // long flat roof
  winShape.quadraticCurveTo(0.62, 1.01, 1.02, 0.72)     // windshield
  winShape.lineTo(-1.8, 0.74)
  const winGeo = new THREE.ExtrudeGeometry(winShape, { depth: 1.32, bevelEnabled: false, curveSegments: 20 })
  winGeo.translate(0, 0.02, -0.66)
  {
    const pos = winGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y > 0.78) pos.setZ(i, pos.getZ(i) * (1 - smooth(0.78, 1.15, y) * 0.52))
    }
    winGeo.computeVertexNormals()
  }
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1524, metalness: 0.0, roughness: 0.06, envMapIntensity: 0.9,
    transparent: true, opacity: 0.92, clearcoat: 0.5, clearcoatRoughness: 0.04,
    reflectivity: 1.0,
  })
  car.add(new THREE.Mesh(winGeo, glassMat))
  // chrome DLO trim where glass meets body (what separates roof from paint)
  const dloMat = new THREE.MeshStandardMaterial({ color: 0xd6dde8, metalness: 1, roughness: 0.12 })
  const dloPts = (zOff) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.0, 0.745, zOff * 0.92),
    new THREE.Vector3(0.2, 0.77, zOff),
    new THREE.Vector3(-0.9, 0.775, zOff),
    new THREE.Vector3(-1.78, 0.75, zOff * 0.9),
  ])
  for (const z of [0.62, -0.62]) {
    car.add(new THREE.Mesh(new THREE.TubeGeometry(dloPts(z), 24, 0.011, 6), dloMat))
  }

  // interior silhouette: seats, dash
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1a, metalness: 0.2, roughness: 0.9 })
  for (const sx of [-0.85, -0.25]) {
    const seat = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.12, 3, 8), cabinMat)
    seat.position.set(sx, 0.7, 0.22)
    car.add(seat)
    const seat2 = seat.clone(); seat2.position.z = -0.26
    car.add(seat2)
  }
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 1.1), cabinMat)
  dash.position.set(0.48, 0.72, 0)
  car.add(dash)

  // premium side mirrors on stalks
  const mirBody = new THREE.MeshPhysicalMaterial({ color: 0xf3f6fc, metalness: 0.6, roughness: 0.2, clearcoat: 1 })
  for (const z of [0.68, -0.68]) {
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), mirBody)
    pod.scale.set(1.5, 0.7, 1.0)
    pod.position.set(0.72, 0.8, z + (z > 0 ? 0.08 : -0.08))
    car.add(pod)
  }

  // black lower rocker trim (reference sedan sill)
  for (const z of [0.76, -0.76]) {
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 0.04), carbonRef)
    sill.position.set(0.05, 0.23, z)
    car.add(sill)
  }

  // flush door handles
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xb9c4d6, metalness: 1, roughness: 0.25 })
  for (const z of [0.87, -0.87]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.024, 0.014), handleMat)
    h.position.set(0.14, 0.62, z * 0.98)
    car.add(h)
  }

  // front fascia: dark intake, carbon splitter, signature light bar
  const carbon = new THREE.MeshStandardMaterial({ color: 0x0c1220, metalness: 0.55, roughness: 0.5 })
  const intake = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 1.1), carbon)
  intake.position.set(2.5, 0.26, 0)
  car.add(intake)
  // upright illuminated grille: chrome frame + vertical slats (original design)
  const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.66), new THREE.MeshStandardMaterial({
    color: 0x11161f, metalness: 0.8, roughness: 0.3 }))
  grilleFrame.position.set(2.56, 0.42, 0)
  car.add(grilleFrame)
  const slatMat = new THREE.MeshStandardMaterial({ color: 0xcfd6e2, metalness: 1, roughness: 0.15 })
  for (let i = 0; i < 7; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.02), slatMat)
    slat.position.set(2.6, 0.42, -0.27 + i * 0.09)
    car.add(slat)
  }
  const grilleGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.02), new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xdbeafe, emissiveIntensity: 2.5, roughness: 0.3 }))
  for (const zg of [0.35, -0.35]) {
    const g = grilleGlow.clone(); g.position.set(2.6, 0.42, zg); car.add(g)
  }
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 1.5), carbon)
  splitter.position.set(2.46, 0.15, 0)
  car.add(splitter)
  const sigBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.016, 0.98),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfe2ff, emissiveIntensity: 3.6, roughness: 0.2 })
  )
  sigBar.position.set(2.6, 0.58, 0)
  car.add(sigBar)
  const emblem = glowSprite(tex, BLUE, 0.11, 0.11, 0.95)
  emblem.position.set(2.62, 0.6, 0)
  car.add(emblem)

  // crystal laser-LED headlights: chrome internals + blue projectors under a glass cover
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe7edf6, metalness: 1, roughness: 0.08 })
  const projMat = new THREE.MeshStandardMaterial({ color: 0x9cc6ff, emissive: 0x7db4ff, emissiveIntensity: 4, roughness: 0.1 })
  for (const z of [0.44, -0.44]) {
    const cluster = new THREE.Group()
    cluster.position.set(2.46, 0.54, z)
    cluster.rotation.y = z > 0 ? 0.3 : -0.3
    for (let i = 0; i < 3; i++) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.036, 0.05, 12), chromeMat)
      barrel.rotation.z = Math.PI / 2
      barrel.position.set(0.02, 0, (i - 1) * 0.075)
      cluster.add(barrel)
      const proj = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), projMat)
      proj.position.set(0.05, 0, (i - 1) * 0.075)
      cluster.add(proj)
    }
    const cover = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), new THREE.MeshPhysicalMaterial({
      color: 0xbfd8ff, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.3, envMapIntensity: 1.6,
    }))
    cover.scale.set(0.85, 0.42, 1.3)
    cover.position.x = 0.05
    cluster.add(cover)
    // sharp DRL blade above the cluster
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.012, 0.3), new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xdbeafe, emissiveIntensity: 4.4, roughness: 0.2 }))
    drl.position.set(0.03, 0.09, 0)
    drl.rotation.x = z > 0 ? -0.2 : 0.2
    cluster.add(drl)
    car.add(cluster)
  }

  // tail: full-width light bar on the ducktail + diffuser
  const tailBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.04, 1.28),
    new THREE.MeshStandardMaterial({ color: 0xff5533, emissive: 0xff2f0f, emissiveIntensity: 3, roughness: 0.3 })
  )
  tailBar.position.set(-2.5, 0.62, 0)
  car.add(tailBar)
  const tailBarRef = tailBar
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 1.34), carbon)
  diffuser.position.set(-2.42, 0.18, 0)
  car.add(diffuser)
  // integrated ducktail spoiler lip
  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 1.3), carbon)
  lip.position.set(-2.2, 0.76, 0)
  lip.rotation.z = 0.08
    car.add(lip)

  // wheels: torus tires (real sidewall), forged multi-spoke, discs, bolts, calipers
  const wheels = []
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.05, roughness: 0.95 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xaeb8c6, metalness: 1, roughness: 0.22 })
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x131b2c, metalness: 0.8, roughness: 0.35 })
  const calMat = new THREE.MeshStandardMaterial({ color: ORANGE, metalness: 0.45, roughness: 0.38 })
  for (const [x, y, z] of [[1.55, 0.28, 0.84], [1.55, 0.28, -0.84], [-1.5, 0.28, 0.84], [-1.5, 0.28, -0.84]]) {
    const wheel = new THREE.Group()
    // tire: torus (round sidewall) + tread band
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.105, 14, 36), tireMat)
    wheel.add(tire)
    const tread = new THREE.Mesh(new THREE.CylinderGeometry(0.455, 0.455, 0.15, 36), tireMat)
    tread.rotation.x = Math.PI / 2
    wheel.add(tread)
    const face = z > 0 ? 0.105 : -0.105
    // forged rim: dish + 10 twin spokes + bolts + valve
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 32), hubMat)
    dish.rotation.x = Math.PI / 2
    dish.position.z = face * 0.6
    wheel.add(dish)
    const lipRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 6, 40), new THREE.MeshStandardMaterial({ color: 0xd7dfea, metalness: 1, roughness: 0.15 }))
    lipRing.position.z = face
    wheel.add(lipRing)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), rimMat)
    hub.rotation.x = Math.PI / 2
    hub.position.z = face
    wheel.add(hub)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.29, 0.024), rimMat)
      spoke.position.set(Math.cos(a + Math.PI / 2) * 0.185, Math.sin(a + Math.PI / 2) * 0.185, face)
      spoke.rotation.z = a
      wheel.add(spoke)
    }
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.02, 6), hubMat)
      bolt.rotation.x = Math.PI / 2
      bolt.position.set(Math.cos(a) * 0.045, Math.sin(a) * 0.045, face + 0.02 * Math.sign(face))
      wheel.add(bolt)
    }
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.03, 6), rimMat)
    valve.position.set(0.3, 0.12, face)
    valve.rotation.z = 1.2
    wheel.add(valve)
    wheel.position.set(x, y, z)
    car.add(wheel)
    wheels.push(wheel)
    // brake disc + orange caliper (fixed to car)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 28),
      new THREE.MeshStandardMaterial({ color: 0x9aa5b6, metalness: 1, roughness: 0.32 }))
    disc.rotation.x = Math.PI / 2
    disc.position.set(x, y, z + face * 0.35)
    car.add(disc)
    const cal = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.15, 0.07), calMat)
    cal.position.set(x + 0.15, y + 0.1, z + face * 0.3)
    car.add(cal)
    // dark arch depth
    const archShadow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }))
    archShadow.scale.set(1.0, 1.0, 1)
    archShadow.position.set(x, y + 0.05, z * 0.72)
    car.add(archShadow)
  }

  // contact shadow + blue underglow
  const shadow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color: 0x000000, transparent: true, opacity: 0.62, depthWrite: false,
  }))
  shadow.scale.set(5.8, 1.7, 1)
  shadow.position.set(0, 0.04, 0)
  car.add(shadow)
  const under = glowSprite(tex, 0x7db4ff, 5.4, 1.3, 0.6)
  under.position.set(0, 0.09, 0)
  car.add(under)

  const headL = glowSprite(tex, 0xbcd8ff, 0.62, 0.62, 0.95); headL.position.set(2.7, 0.5, 0.46)
  const headR = glowSprite(tex, 0xbcd8ff, 0.62, 0.62, 0.95); headR.position.set(2.7, 0.5, -0.46)
  const tailG = glowSprite(tex, 0xff5533, 1.6, 0.3, 0.5); tailG.position.set(-2.6, 0.62, 0)
  car.add(headL, headR, tailG)

  // volumetric headlight beams + light pool thrown on the floor
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xe9f3ff, transparent: true, opacity: 0.26,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  })
  const beams = []
  for (const z of [0.44, -0.44]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.56, 3.0, 20, 1, true), beamMat.clone())
    beam.rotation.z = Math.PI / 2 + 0.055 // tilt the throw slightly toward the road
    beam.position.set(4.16, 0.4, z)
    beam.userData.keep = true // stay visible even when a photoreal car.glb loads
    car.add(beam)
    beams.push(beam)
  }
  const beamPool = glowSprite(tex, 0xe9f3ff, 4.8, 1.7, 0.44)
  beamPool.position.set(4.7, 0.07, 0)
  car.add(beamPool)

  return { car, wheels, under, headlights: [headL, headR], tailBarRef, paint, xrayEdges, glassMat, beams, beamPool }
}

// ---------------- industrial robot (KUKA-class) ----------------
const L1 = 1.35
const L2 = 1.25

function cablesAlong(len, offX, offZ) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(offX, 0.06, offZ),
    new THREE.Vector3(offX + 0.06, len * 0.5, offZ + 0.03),
    new THREE.Vector3(offX, len - 0.06, offZ),
  ])
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 12, 0.022, 6),
    new THREE.MeshStandardMaterial({ color: 0x10141f, metalness: 0.2, roughness: 0.8 })
  )
}

function buildRobot(tex) {
  const root = new THREE.Group()
  const industrialOrange = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.5, roughness: 0.42 })
  const cast = new THREE.MeshStandardMaterial({ color: 0x1c2333, metalness: 0.75, roughness: 0.35 })
  const steel = new THREE.MeshStandardMaterial({ color: 0xaab6c8, metalness: 1, roughness: 0.3 })

  // floor plinth + slewing base
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 0.95), cast)
  plinth.position.y = 0.08
  root.add(plinth)
  const slew = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.22, 20), industrialOrange)
  slew.position.y = 0.27
  root.add(slew)
  // pedestal column
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.55, 16), industrialOrange)
  column.position.y = 0.65
  root.add(column)
  // shoulder axis housing (big hydraulic joint)
  const shoulderHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.46, 16), cast)
  shoulderHousing.rotation.x = Math.PI / 2
  shoulderHousing.position.y = 1.0
  root.add(shoulderHousing)

  // IK-driven links
  const shoulder = new THREE.Group()
  shoulder.position.set(0, 1.0, 0)
  root.add(shoulder)
  const link1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, L1, 0.22), industrialOrange)
  link1.position.y = L1 / 2
  shoulder.add(link1)
  // ribs + counterweight for the cast look
  const rib = new THREE.Mesh(new THREE.BoxGeometry(0.29, L1 * 0.55, 0.06), cast)
  rib.position.set(0, L1 * 0.45, 0.14)
  shoulder.add(rib)
  const counter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.26), cast)
  counter.position.y = -0.22
  shoulder.add(counter)
  shoulder.add(cablesAlong(L1, 0.16, 0.06))

  const elbow = new THREE.Group()
  elbow.position.y = L1
  shoulder.add(elbow)
  const elbowHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 14), cast)
  elbowHousing.rotation.x = Math.PI / 2
  elbow.add(elbowHousing)
  const link2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, L2 - 0.32, 0.16), industrialOrange)
  link2.position.y = (L2 - 0.32) / 2 + 0.05
  elbow.add(link2)
  elbow.add(cablesAlong(L2 - 0.2, 0.11, 0.05))
  // wrist + torch
  const wristHub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.2, 12), steel)
  wristHub.position.y = L2 - 0.22
  elbow.add(wristHub)
  const torch = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 12), cast)
  torch.position.y = L2 - 0.06
  elbow.add(torch)
  const spark = glowSprite(tex, 0x9be8ff, 0.34, 0.34, 1)
  spark.position.y = L2
  elbow.add(spark)
  // hydraulic cylinder between counterweight and forearm
  const hydro = new THREE.Group()
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 10), steel)
  cyl.position.y = 0.25
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), steel)
  rod.position.y = 0.62
  hydro.add(cyl, rod)
  hydro.position.set(-0.16, 0.25, 0)
  hydro.rotation.z = -0.35
  shoulder.add(hydro)
  // laser scanner emitter on the wrist
  const scanHead = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.09), cast)
  scanHead.position.y = L2 - 0.3
  elbow.add(scanHead)

  // warning ring on the plinth
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 6, 40), new THREE.MeshStandardMaterial({
    color: ORANGE, emissive: ORANGE, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.5,
  }))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.17
  root.add(ring)

  return { root, shoulder, elbow, spark }
}

// ---------------- holo + blueprint dressing ----------------
function buildBlueprint() {
  const g = new THREE.Group()
  const mat = new THREE.LineBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.22 })
  const dim = (x1, y1, x2, y2, z) => {
    const t = 0.08
    const pts = [
      new THREE.Vector3(x1, y1 - t, z), new THREE.Vector3(x1, y1 + t, z),
      new THREE.Vector3(x1, y1, z), new THREE.Vector3(x2, y2, z),
      new THREE.Vector3(x2, y2 - t, z), new THREE.Vector3(x2, y2 + t, z),
    ]
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    g.add(new THREE.LineSegments(geo, mat))
  }
  dim(-2.6, 2.3, 2.7, 2.3, -1.4)   // overall length dim
  dim(3.15, 0.05, 3.15, 1.55, -1.2) // height dim
  return g
}

export default function HeroScene3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x04060b, 0.02)
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60)
    camera.position.set(-0.4, 2.3, 10.4)
    camera.lookAt(-0.1, 0.55, 0)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: 'high-performance' })
      if (!renderer.getContext()) throw new Error('no-webgl-context')
    } catch (err) {
      // No usable WebGL context — surface to the error boundary for the static fallback.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ac-webgl-failed'))
      }
      throw err
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.35 : 1.6))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    el.appendChild(renderer.domElement)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const glowTex = makeGlowTexture()
    const world = new THREE.Group()
    scene.add(world)

    // ---- cinematic studio rig ----
    scene.add(new THREE.HemisphereLight(0xbdd4ff, 0x0a0f1c, 0.75))
    const top = new THREE.DirectionalLight(0xffffff, 1.5)   // white top light
    top.position.set(1, 9, 2)
    scene.add(top)
    const keyBlue = new THREE.PointLight(BLUE, 36, 16)      // blue key
    keyBlue.position.set(5, 2.6, 3.5)
    world.add(keyBlue)
    const rimOrange = new THREE.PointLight(ORANGE, 28, 13)  // orange rim
    rimOrange.position.set(-4, 1.6, -2.5)
    world.add(rimOrange)
    const bounce = new THREE.PointLight(0x9fb6e8, 8, 8)     // ground bounce
    bounce.position.set(0, 0.15, 2)
    world.add(bounce)

    // volumetric-style soft glows
    const volBlue = glowSprite(glowTex, BLUE, 7, 5, 0.12); volBlue.position.set(2, 2.2, -3)
    const volOrange = glowSprite(glowTex, ORANGE, 5, 4, 0.1); volOrange.position.set(-3.4, 1.8, -2.6)
    world.add(volBlue, volOrange)
    // colored light pools on the showroom floor
    const poolBlue = glowSprite(glowTex, BLUE, 6, 2.2, 0.14); poolBlue.position.set(3.2, 0.12, 1.5)
    const poolOrange = glowSprite(glowTex, ORANGE, 4.5, 1.8, 0.12); poolOrange.position.set(-3.6, 0.12, 1.2)
    const poolCyan = glowSprite(glowTex, 0x7dd3fc, 3.5, 1.4, 0.1); poolCyan.position.set(0.5, 0.12, 2.8)
    world.add(poolBlue, poolOrange, poolCyan)

    // ---- floating diagnostic platform (the engineering island) ----
    const platShape = new THREE.Shape()
    {
      const W = 6.6, D = 4.3, R = 1.1 // half-width, half-depth, corner radius
      platShape.moveTo(-W + R, -D)
      platShape.lineTo(W - R, -D); platShape.absarc(W - R, -D + R, R, -Math.PI / 2, 0, false)
      platShape.lineTo(W, D - R); platShape.absarc(W - R, D - R, R, 0, Math.PI / 2, false)
      platShape.lineTo(-W + R, D); platShape.absarc(-W + R, D - R, R, Math.PI / 2, Math.PI, false)
      platShape.lineTo(-W, -D + R); platShape.absarc(-W + R, -D + R, R, Math.PI, Math.PI * 1.5, false)
    }
    // mirror deck (desktop) + dark glaze, clipped to the platform shape
    if (!coarse) {
      const mirror = new Reflector(new THREE.ShapeGeometry(platShape, 24), {
        clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: 0x9aa4b8,
      })
      mirror.rotation.x = -Math.PI / 2
      mirror.position.y = -0.001
      world.add(mirror)
    }
    const glaze = new THREE.Mesh(
      new THREE.ShapeGeometry(platShape, 24),
      new THREE.MeshStandardMaterial({
        color: INK, metalness: 0.7, roughness: 0.4,
        transparent: true, opacity: coarse ? 1 : 0.82, envMapIntensity: 0.5,
      })
    )
    glaze.rotation.x = -Math.PI / 2
    glaze.position.y = coarse ? 0 : 0.001
    world.add(glaze)
    // slab body with glowing rim
    const slabGeo = new THREE.ExtrudeGeometry(platShape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 24 })
    const slab = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0x090f1c, metalness: 0.55, roughness: 0.6 }))
    slab.rotation.x = Math.PI / 2
    slab.position.y = -0.005
    world.add(slab)
    const rimPts = platShape.getPoints(64).map((p) => new THREE.Vector3(p.x, 0.015, -p.y))
    rimPts.push(rimPts[0].clone())
    const rim = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(rimPts),
      new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8 })
    )
    world.add(rim)
    // island float: glow beneath the slab
    const underIsland = glowSprite(glowTex, BLUE, 12, 4.5, 0.16)
    underIsland.position.set(0, -1.3, 0)
    world.add(underIsland)
    const underIsland2 = glowSprite(glowTex, ORANGE, 6, 2.5, 0.08)
    underIsland2.position.set(-2.5, -1.6, 0)
    world.add(underIsland2)
    // deck grid
    const grid = new THREE.GridHelper(8, 12, BLUE, 0x14203a)
    grid.material.transparent = true
    grid.material.opacity = 0.16
    grid.position.y = 0.003
    world.add(grid)

    // ---- overhead sensor gantry with scanning beams ----
    const gantry = new THREE.Group()
    world.add(gantry)
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, metalness: 0.8, roughness: 0.35 })
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.7, 10), gantryMat)
    post.position.set(0.4, 1.35, -3.0)
    gantry.add(post)
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 5.2), gantryMat)
    beam.position.set(0.4, 2.72, -0.4)
    gantry.add(beam)
    const beamStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 4.8), new THREE.MeshStandardMaterial({
      color: BLUE, emissive: BLUE, emissiveIntensity: 1.6, roughness: 0.4 }))
    beamStrip.position.set(0.4, 2.66, -0.4)
    gantry.add(beamStrip)
    const scanBeams = []
    for (const bz of [-1.4, 0, 1.4]) {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.16), gantryMat)
      pod.position.set(0.4, 2.6, bz)
      gantry.add(pod)
      const beamGeo = new THREE.PlaneGeometry(0.22, 1.75)
      const b = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
        color: BLUE_SOFT, transparent: true, opacity: 0.06,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      }))
      b.position.set(0.4, 1.72, bz)
      gantry.add(b)
      scanBeams.push(b)
    }

    // (Old translucent holographic avatar removed — the real technician is
    //  now loaded from /human.glb and placed beside the car.)

    // ---- holo icon totems on the platform corners ----
    const totems = []
    for (const [tx, tz, col] of [[-4.9, 2.4, ORANGE], [5.2, -2.9, BLUE]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.05, 8), gantryMat)
      post.position.set(tx, 0.52, tz)
      world.add(post)
      const icon = glowSprite(glowTex, col, 0.5, 0.5, 0.8)
      icon.position.set(tx, 1.3, tz)
      world.add(icon)
      const haloRing = edgeLines(new THREE.TorusGeometry(0.26, 0.012, 6, 28), col, 0.6, 60)
      haloRing.position.set(tx, 1.3, tz)
      world.add(haloRing)
      totems.push({ icon, haloRing })
    }

    // ---- diagnostic trolley + cable dressing ----
    const trolley = new THREE.Group()
    const trolleyBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.34), new THREE.MeshStandardMaterial({
      color: 0x18202f, metalness: 0.7, roughness: 0.4 }))
    trolleyBody.position.y = 0.44
    trolley.add(trolleyBody)
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshStandardMaterial({
        color: i === 1 ? ORANGE : BLUE, emissive: i === 1 ? ORANGE : BLUE, emissiveIntensity: 2 }))
      dot.position.set(0.28, 0.62 - i * 0.14, 0.1)
      trolley.add(dot)
    }
    const trolleyDots = trolley.children.slice(1)
    trolley.position.set(4.2, 0, 2.45)
    world.add(trolley)
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x10141f, metalness: 0.2, roughness: 0.85 })
    const cable1 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.0, 0.3, 2.4), new THREE.Vector3(3.0, 0.06, 1.9), new THREE.Vector3(2.2, 0.04, 1.3),
    ]), 12, 0.025, 6), cableMat)
    world.add(cable1)
    const cable2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0.04, 1.2), new THREE.Vector3(-6.2, -0.3, 1.4), new THREE.Vector3(-6.5, -0.9, 1.5),
    ]), 10, 0.03, 6), cableMat)
    world.add(cable2)

    // ---- inspection-bay stage platform (diorama) ----
    const stage = new THREE.Group()
    world.add(stage)
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 0.24, 6.8),
      new THREE.MeshStandardMaterial({ color: 0x0d1424, metalness: 0.65, roughness: 0.45, envMapIntensity: 0.5 })
    )
    plinth.position.set(-0.2, -0.135, 0)
    stage.add(plinth)
    const rimMatGlow = new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.8, roughness: 0.4 })
    for (const [w2, d2, px, pz] of [[10.8, 0.05, -0.2, 3.4], [10.8, 0.05, -0.2, -3.4], [0.05, 6.8, 5.2, 0], [0.05, 6.8, -5.6, 0]]) {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(w2, 0.025, d2), rimMatGlow)
      rim.position.set(px, 0.012, pz)
      stage.add(rim)
    }
    // blueprint decals on the deck
    const bpCanvas = document.createElement('canvas')
    bpCanvas.width = 512; bpCanvas.height = 320
    {
      const c = bpCanvas.getContext('2d')
      c.strokeStyle = 'rgba(96,165,250,0.9)'
      c.lineWidth = 2
      c.strokeRect(20, 20, 180, 90)
      c.strokeRect(40, 40, 60, 30)
      c.beginPath(); c.arc(260, 70, 40, 0, Math.PI * 2); c.stroke()
      c.beginPath(); c.arc(260, 70, 22, 0, Math.PI * 2); c.stroke()
      c.beginPath(); c.moveTo(330, 30); c.lineTo(490, 30); c.lineTo(470, 110); c.lineTo(350, 110); c.closePath(); c.stroke()
      for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(30 + i * 80, 150); c.lineTo(70 + i * 80, 150); c.stroke() }
      c.strokeRect(30, 180, 440, 60)
      for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(30 + i * 55, 180); c.lineTo(30 + i * 55, 240); c.stroke() }
      c.font = '16px monospace'
      c.fillStyle = 'rgba(96,165,250,0.9)'
      c.fillText('AC-EV01 · DIGITAL TWIN BAY', 30, 285)
      c.fillText('REF 26262 / A-SPICE', 330, 285)
    }
    const bpTex = new THREE.CanvasTexture(bpCanvas)
    const bpPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.6, 4.1),
      new THREE.MeshBasicMaterial({ map: bpTex, transparent: true, opacity: 0.22, depthWrite: false })
    )
    bpPlane.rotation.x = -Math.PI / 2
    bpPlane.position.set(0.4, 0.014, 0)
    stage.add(bpPlane)
    // display totems
    for (const [tx, tz, rot] of [[4.5, 1.9, -0.5], [-4.8, -1.6, 0.6]]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.15, 10),
        new THREE.MeshStandardMaterial({ color: 0x1c2333, metalness: 0.7, roughness: 0.4 }))
      pole.position.set(tx, 0.57, tz)
      stage.add(pole)
      const totem = new THREE.Mesh(
        new THREE.PlaneGeometry(0.78, 0.5),
        new THREE.MeshBasicMaterial({ map: bpTex, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false })
      )
      totem.position.set(tx, 1.3, tz)
      totem.rotation.y = rot
      stage.add(totem)
    }

    // ---- holographic rings ----
    const ringGroup = new THREE.Group()
    ringGroup.position.set(0.3, 1.45, -2.2)
    world.add(ringGroup)
    const rBlue = edgeLines(new THREE.TorusGeometry(3.15, 0.03, 6, 64, Math.PI), BLUE, 0.45, 60)
    const rOrange = edgeLines(new THREE.TorusGeometry(3.15, 0.03, 6, 64, Math.PI), ORANGE, 0.45, 60)
    rOrange.rotation.z = Math.PI
    ringGroup.add(rBlue, rOrange)
    const ring2 = edgeLines(new THREE.TorusGeometry(2.4, 0.018, 6, 64), BLUE_SOFT, 0.22, 60)
    ring2.position.set(0.3, 1.45, -2.6)
    ring2.rotation.x = 0.35
    world.add(ring2)

    // ---- blueprint dimension lines ----
    const blueprint = buildBlueprint()
    world.add(blueprint)

    // ---- holo floor projection ring under the car ----
    const holoRing = new THREE.Group()
    holoRing.position.set(0.75, 0.012, 0)
    world.add(holoRing)
    const hr1 = edgeLines(new THREE.TorusGeometry(3.0, 0.008, 4, 80), BLUE, 0.35, 60)
    hr1.rotation.x = Math.PI / 2
    holoRing.add(hr1)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const dash = edgeLines(new THREE.BoxGeometry(0.22, 0.001, 0.02), BLUE_SOFT, 0.4)
      dash.position.set(Math.cos(a) * 2.72, 0, Math.sin(a) * 2.72)
      dash.rotation.y = -a + Math.PI / 2
      holoRing.add(dash)
    }

    // ---- floating telemetry HUD panel ----
    const hudCanvas = document.createElement('canvas')
    hudCanvas.width = 512; hudCanvas.height = 320
    {
      const c = hudCanvas.getContext('2d')
      c.fillStyle = 'rgba(13,20,40,0.72)'
      c.strokeStyle = 'rgba(96,165,250,0.9)'
      c.lineWidth = 3
      c.beginPath(); c.roundRect(6, 6, 500, 308, 22); c.fill(); c.stroke()
      c.fillStyle = 'rgba(96,165,250,1)'
      c.font = '600 30px monospace'
      c.fillText('VEHICLE TELEMETRY', 34, 58)
      c.fillStyle = 'rgba(255,138,0,0.95)'
      c.fillText('● LIVE', 380, 58)
      c.strokeStyle = 'rgba(96,165,250,0.4)'
      c.lineWidth = 2
      for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(34, 100 + i * 56); c.lineTo(478, 100 + i * 56); c.stroke() }
      c.strokeStyle = 'rgba(255,138,0,0.9)'
      c.lineWidth = 4
      c.beginPath()
      c.moveTo(34, 220)
      for (let x = 0; x <= 444; x += 20) c.lineTo(34 + x, 220 - Math.abs(Math.sin(x * 0.045)) * 90 - Math.random() * 14)
      c.stroke()
      c.fillStyle = 'rgba(96,165,250,0.85)'
      for (let i = 0; i < 6; i++) c.fillRect(40 + i * 78, 268 - (18 + (i * 37) % 34), 40, 18 + (i * 37) % 34 + 14)
    }
    const hudTex = new THREE.CanvasTexture(hudCanvas)
    const hud = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.56),
      new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, opacity: 0.92, depthWrite: false, side: THREE.DoubleSide })
    )
    hud.position.set(3.1, 2.3, -2.7)
    hud.rotation.y = -0.45
    world.add(hud)
    // billboard stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, metalness: 0.8, roughness: 0.35 })
    for (const px of [2.75, 3.85]) {
      const bpost = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.55, 8), standMat)
      bpost.position.set(px, 0.78, -2.7 - (px - 3.3) * 0.48)
      world.add(bpost)
    }

    // ---- engineering callout leader lines ----
    const calloutMat = new THREE.LineBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.55 })
    const callout1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.4, 1.18, 0), new THREE.Vector3(1.35, 2.0, -1.1), new THREE.Vector3(1.6, 2.0, -1.4),
    ]), calloutMat)
    world.add(callout1)
    const callout2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.25, 0.3, 1.0), new THREE.Vector3(3.1, 1.15, 1.0), new THREE.Vector3(3.7, 1.15, 1.0),
    ]), calloutMat)
    world.add(callout2)
    const cDot1 = glowSprite(glowTex, BLUE_SOFT, 0.12, 0.12, 0.9); cDot1.position.set(0.4, 1.18, 0)
    const cDot2 = glowSprite(glowTex, ORANGE, 0.12, 0.12, 0.9); cDot2.position.set(2.25, 0.3, 1.0)
    world.add(cDot1, cDot2)

    // ---- hologram scan ring sweeping the car ----
    const scanRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.014, 6, 60),
      new THREE.MeshBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    scanRing.rotation.y = Math.PI / 2
    scanRing.scale.y = 0.78
    scanRing.position.set(0.75, 0.72, 0)
    world.add(scanRing)

    // ---- wheel telemetry arcs (front wheel) ----
    const gauge = new THREE.Group()
    gauge.position.set(2.25, 0.28, 1.0)
    world.add(gauge)
    const ga1 = edgeLines(new THREE.TorusGeometry(0.62, 0.012, 4, 40, Math.PI * 1.2), BLUE_SOFT, 0.6, 60)
    const ga2 = edgeLines(new THREE.TorusGeometry(0.5, 0.01, 4, 40, Math.PI * 0.8), ORANGE, 0.55, 60)
    gauge.add(ga1, ga2)

    // ---- car + robot ----
    const { car, wheels, under, headlights, tailBarRef, paint, xrayEdges, glassMat, beams, beamPool } = buildCar(glowTex)
    car.position.x = 0.75
    world.add(car)

    // ---- photoreal upgrade slot ----------------------------------------
    // Drop a licensed model at public/car.glb and it automatically replaces
    // the procedural body: auto-scaled to the scene, grounded on the mirror
    // floor, centered, and lit by the full cinematic rig. The underglow,
    // contact shadow and light glows are kept.
    // Load the photoreal model straight away (no HEAD pre-flight round-trip).
    // The browser has already been told to preload /car.glb in index.html, so
    // by the time the GLTFLoader chunk arrives the bytes are usually cached.
    let loadedModel = null
    let humanModel = null, humanBaseY = 0, humanBaseRot = 0, humanBaseX = 0, humanRing = null, humanScan = null
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      new GLTFLoader().load('/car.glb', (gltf) => {
        const m = gltf.scene
        const box = new THREE.Box3().setFromObject(m)
        const size = box.getSize(new THREE.Vector3())
        // most car models are longest along X or Z — face the nose to +X
        if (size.z > size.x) m.rotation.y = -Math.PI / 2
        const box2 = new THREE.Box3().setFromObject(m)
        const size2 = box2.getSize(new THREE.Vector3())
        const scale = 5.1 / Math.max(size2.x, 0.001)
        m.scale.setScalar(scale)
        const box3 = new THREE.Box3().setFromObject(m)
        m.position.y -= box3.min.y
        m.position.x -= (box3.min.x + box3.max.x) / 2
        m.position.z -= (box3.min.z + box3.max.z) / 2
        // Realism pass: crisp studio reflections + glossy clearcoat car paint.
        m.traverse((o) => {
          if (!o.isMesh || !o.material) return
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          o.material = mats.map((mat) => {
            mat.envMapIntensity = 1.7
            // Body panels (painted/metal, not glass) get a wet clearcoat sheen.
            const isGlass = mat.transparent && mat.opacity < 0.9
            if (!isGlass && 'metalness' in mat && mat.metalness >= 0.35 && mat.clearcoat === undefined) {
              const phys = new THREE.MeshPhysicalMaterial()
              phys.copy(mat)
              phys.clearcoat = 1
              phys.clearcoatRoughness = 0.12
              phys.envMapIntensity = 1.9
              phys.roughness = Math.max(0.08, mat.roughness * 0.7)
              return phys
            }
            mat.needsUpdate = true
            return mat
          })
          o.material = Array.isArray(o.material) && o.material.length === 1 ? o.material[0] : o.material
        })
        // hide procedural body/wheels, keep sprites (shadow, glows) + tagged beams
        for (const ch of car.children) {
          if (!(ch instanceof THREE.Sprite) && !ch.userData.keep) ch.visible = false
        }
        car.add(m)
        loadedModel = m
      }, undefined, () => { /* model unavailable — keep procedural car */ })

      // Optional realistic human: drop a rigged human model at public/human.glb
      // and a technician/engineer figure appears standing beside the car —
      // auto-scaled to human height, grounded on the floor, facing the car,
      // and relit by the scene's environment so it matches the composition.
      // If the file isn't present nothing shows (no error).
      new GLTFLoader().load('/human.glb', (gltf) => {
        const h = gltf.scene
        const hb = new THREE.Box3().setFromObject(h)
        const hs = hb.getSize(new THREE.Vector3())
        h.scale.setScalar(1.82 / Math.max(hs.y, 0.001))         // ~human height
        const hb2 = new THREE.Box3().setFromObject(h)
        h.position.y -= hb2.min.y                               // feet on the floor
        h.position.x = 0.95                                     // clear of the Cyber-Security chip
        h.position.z = 3.35                                     // forward toward the viewer
        h.rotation.y = -Math.PI * 0.34                          // 3/4 toward the viewer, glancing at the car
        // Colour the technician by part name: blue coverall, safety helmet,
        // glowing cyan AR visor, cyan gloves. Textured models are left as-is.
        const skin = {
          Coverall: { color: 0x2d5aaf },   // deep engineer-blue coverall
          Head:     { color: 0xe0bd98 },   // skin
          Helmet:   { color: 0xffb43e },   // safety-orange hard hat
          Visor:    { color: 0x8ff2ff },   // cyan AR visor
          Glove:    { color: 0x5ec2ec },   // cyan gloves
          Boot:     { color: 0x33394a },   // dark boots
          Vest:     { color: 0xdff23a },   // hi-vis safety vest
        }
        const partKey = (o) => {
          const n = (o.name || '') + ' ' + ((o.material && o.material.name) || '')
          return Object.keys(skin).find((k) => n.includes(k))
        }
        h.traverse((o) => {
          if (!o.isMesh || !o.material) return
          const textured = Array.isArray(o.material) ? o.material.some((m) => m.map) : o.material.map
          if (textured) return   // photoreal model: keep authored textures
          if (o.geometry && o.geometry.attributes && o.geometry.attributes.color) {
            // model carries baked directional shading in its vertex colours →
            // renders as a properly-lit 3D character (not a flat cartoon)
            o.material = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })
          } else {
            const c = skin[partKey(o)] || skin.Coverall
            o.material = new THREE.MeshBasicMaterial({ color: c.color, toneMapped: false })
          }
        })
        // strong frontal key + fill + cyan rim so the technician is fully lit
        const hKey = new THREE.SpotLight(0xffffff, 140, 11, Math.PI / 4, 0.5, 1.0)
        hKey.position.set(h.position.x + 1.1, 3.4, h.position.z + 3.4)
        hKey.target.position.set(h.position.x, 1.05, h.position.z)
        world.add(hKey, hKey.target)
        const hFill = new THREE.PointLight(0xcfe0ff, 40, 7)
        hFill.position.set(h.position.x + 0.2, 1.7, h.position.z + 1.8)
        world.add(hFill)
        const hRim = new THREE.PointLight(0x67e8f9, 22, 4.5)
        hRim.position.set(h.position.x - 0.9, 1.85, h.position.z - 0.8)
        world.add(hRim)
        // holographic inspection tablet in front of the figure — "AI workshop" cue
        const tablet = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }))
        tablet.position.set(h.position.x + 0.3, 1.18, h.position.z + 0.4)
        tablet.rotation.set(-0.5, 0.5, -0.05)
        world.add(tablet)
        const tabletGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x67e8f9, transparent: true, opacity: 0.4, depthWrite: false }))
        tabletGlow.scale.set(0.9, 0.7, 1); tabletGlow.position.copy(tablet.position); world.add(tabletGlow)
        // soft contact shadow under the figure
        const hShadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false }))
        hShadow.scale.set(1.0, 0.46, 1); hShadow.position.set(h.position.x, 0.02, h.position.z); world.add(hShadow)
        const hRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.62, 0.014, 8, 48),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
        )
        hRing.rotation.x = Math.PI / 2
        hRing.position.set(h.position.x, 0.03, h.position.z)
        world.add(hRing)
        // scanning beam from the tablet toward the car (inspection cue)
        const scanBeam = new THREE.Mesh(
          new THREE.PlaneGeometry(2.4, 0.14),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.14, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
        )
        scanBeam.position.set(h.position.x - 1.15, 1.05, h.position.z - 0.55)
        scanBeam.rotation.set(-0.15, 0.7, 0.02)
        world.add(scanBeam)
        humanScan = scanBeam
        world.add(h)
        humanModel = h; humanBaseY = h.position.y; humanBaseRot = h.rotation.y; humanBaseX = h.position.x; humanRing = hRing
      }, undefined, () => { /* no human model provided — scene shows car + robot only */ })
    }).catch(() => {})

    const { root: robot, shoulder, elbow, spark } = buildRobot(glowTex)
    const ROBOT_POS = new THREE.Vector3(-3.05, 0, 0.4)
    robot.position.copy(ROBOT_POS)
    world.add(robot)

    // weld seam along the trunk shoulder
    const seamA = new THREE.Vector2(-1.35, 0.76)
    const seamB = new THREE.Vector2(-0.75, 0.79)
    const shoulderWorld = new THREE.Vector2(ROBOT_POS.x, 1.0)
    const weldLight = new THREE.PointLight(0xffa050, 0, 5)
    world.add(weldLight)

    // blue inspection laser fan (visible during scan mode)
    const laserGeo = new THREE.BufferGeometry()
    laserGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3))
    const laser = new THREE.Mesh(laserGeo, new THREE.MeshBasicMaterial({
      color: BLUE_SOFT, transparent: true, opacity: 0.16, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    world.add(laser)
    const laserLine = glowSprite(glowTex, BLUE_SOFT, 0.16, 0.16, 0)
    world.add(laserLine)

    // spark burst particles
    const S_COUNT = coarse ? 16 : 30
    const sPos = new Float32Array(S_COUNT * 3)
    const sVel = []
    const sLife = new Float32Array(S_COUNT)
    for (let i = 0; i < S_COUNT; i++) { sLife[i] = Math.random(); sVel.push(new THREE.Vector3()) }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const sparks = new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xffc078, size: 0.05, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    world.add(sparks)

    // light sweep across the paint
    const sweep = glowSprite(glowTex, 0xffffff, 0.7, 4.2, 0)
    sweep.position.set(-3, 1.2, 0.9)
    world.add(sweep)

    // ambient data particles
    const pCount = coarse ? 80 : 160
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 15
      pPos[i * 3 + 1] = Math.random() * 5.5
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: BLUE_SOFT, size: 0.045, transparent: true, opacity: 0.55,
    }))
    world.add(particles)

    // ---- 2-link IK ----
    const solveArm = (tx, ty) => {
      let dx = tx - shoulderWorld.x
      let dy = ty - shoulderWorld.y
      let d = Math.hypot(dx, dy)
      d = Math.min(Math.max(d, Math.abs(L1 - L2) + 0.05), L1 + L2 - 0.02)
      const baseAng = Math.atan2(dy, dx)
      const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)
      const a = Math.acos(Math.min(Math.max(cosA, -1), 1))
      const th1 = baseAng + a
      const ex = shoulderWorld.x + Math.cos(th1) * L1
      const ey = shoulderWorld.y + Math.sin(th1) * L1
      const th2 = Math.atan2(ty - ey, tx - ex)
      shoulder.rotation.z = th1 - Math.PI / 2
      elbow.rotation.z = th2 - th1
      return { x: ex + Math.cos(th2) * L2, y: ey + Math.sin(th2) * L2 }
    }

    // X-ray digital-twin mode (toggled from the page UI)
    let scanTarget = 0, scanBlend = 0
    const onScanToggle = (e) => { scanTarget = e.detail ? 1 : 0 }
    window.addEventListener('ac-xray', onScanToggle)

    // interaction — hover parallax + free 360° drag-orbit with inertia
    let targetRX = 0, targetRY = 0
    const onPointer = (e) => {
      const r = el.getBoundingClientRect()
      targetRY = ((e.clientX - r.left) / r.width - 0.5) * 0.34
      targetRX = ((e.clientY - r.top) / r.height - 0.5) * 0.15
    }
    if (!coarse && !reduced) el.addEventListener('pointermove', onPointer)

    let dragging = false
    let dragYaw = 0, dragPitch = 0
    let yawVel = 0
    let lastX = 0, lastY = 0
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y' // keep vertical page scroll on touch
    const onDown = (e) => {
      dragging = true
      yawVel = 0
      lastX = e.clientX
      lastY = e.clientY
      el.style.cursor = 'grabbing'
      el.setPointerCapture?.(e.pointerId)
    }
    const onDrag = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      dragYaw += dx * 0.008            // full, unbounded 360° yaw
      yawVel = dx * 0.008
      dragPitch = Math.min(0.4, Math.max(-0.25, dragPitch + dy * 0.003))
    }
    const onUp = (e) => {
      dragging = false
      el.style.cursor = 'grab'
      el.releasePointerCapture?.(e.pointerId)
    }
    if (!reduced) {
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onDrag)
      window.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    }
    let scrollRot = 0
    const onScroll = () => { scrollRot = window.scrollY * 0.00035 }
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let raf, running = false
    const clock = new THREE.Clock()
    let prev = 0
    const BASE_YAW = -0.38 // three-quarter front composition

    const tick = () => {
      const t = clock.getElapsedTime()
      const dt = Math.min(t - prev, 0.05)
      prev = t

      if (!dragging) {
        dragYaw += yawVel          // momentum after release
        yawVel *= 0.94
        dragPitch += (0 - dragPitch) * 0.02 // pitch eases back level
      }
      world.rotation.y += ((BASE_YAW + targetRY + scrollRot + dragYaw) - world.rotation.y) * (dragging ? 0.35 : 0.08)
      world.rotation.x += ((0.015 + targetRX + dragPitch) - world.rotation.x) * (dragging ? 0.35 : 0.06)

      // vehicle breathing
      car.position.y = Math.sin(t * 0.9) * 0.018
      under.material.opacity = 0.42 + Math.sin(t * 2) * 0.08
      const hl = 0.65 + Math.abs(Math.sin(t * 1.3)) * 0.35
      headlights[0].material.opacity = hl
      headlights[1].material.opacity = hl
      // headlight beams breathe with the lamps (brighter throw)
      beams[0].material.opacity = 0.2 + hl * 0.18
      beams[1].material.opacity = 0.2 + hl * 0.18
      beamPool.material.opacity = 0.28 + hl * 0.24
      // sequential taillight sweep
      tailBarRef.material.emissiveIntensity = 2.2 + ((t * 1.4) % 1) * 1.6

      // holo rings
      ringGroup.rotation.z = t * 0.18
      ring2.rotation.z = -t * 0.12
      holoRing.rotation.y = t * 0.15
      gauge.rotation.z = t * 0.6
      ga2.rotation.z = -t * 0.9
      scanRing.position.x = 0.75 + Math.sin(t * 0.35) * 2.3
      scanRing.material.opacity = 0.16 + Math.abs(Math.sin(t * 0.35)) * 0.18
      hud.material.opacity = 0.86 + Math.sin(t * 1.6) * 0.06
      // gantry scan beams pulse in sequence
      for (let i = 0; i < scanBeams.length; i++) {
        scanBeams[i].material.opacity = 0.02 + Math.abs(Math.sin(t * 1.2 + i * 1.1)) * 0.06
      }
      // (holographic engineer removed)
      if (humanModel) {
        // livelier idle: breathing bob + weight shift + a slow glance between car and tablet
        humanModel.position.y = humanBaseY + Math.sin(t * 1.7) * 0.022
        humanModel.rotation.y = humanBaseRot + Math.sin(t * 0.42) * 0.13 + Math.sin(t * 1.1) * 0.03
        humanModel.rotation.z = Math.sin(t * 0.85) * 0.012
        humanModel.position.x = humanBaseX + Math.sin(t * 0.42) * 0.05
      }
      if (humanRing) humanRing.rotation.z = t * 0.45
      if (humanScan) humanScan.material.opacity = 0.06 + Math.abs(Math.sin(t * 2.1)) * 0.2
      // totems pulse
      for (let i = 0; i < totems.length; i++) {
        totems[i].icon.material.opacity = 0.5 + Math.abs(Math.sin(t * 1.6 + i * 2)) * 0.5
        totems[i].haloRing.rotation.y = t * (0.6 + i * 0.3)
        totems[i].icon.position.y = 1.3 + Math.sin(t * 1.2 + i) * 0.05
      }
      // trolley status LEDs blink
      for (let i = 0; i < trolleyDots.length; i++) {
        trolleyDots[i].material.emissiveIntensity = 1 + Math.abs(Math.sin(t * 3 + i * 2.1)) * 2
      }
      cDot1.material.opacity = 0.55 + Math.abs(Math.sin(t * 2)) * 0.45
      cDot2.material.opacity = 0.55 + Math.abs(Math.sin(t * 2 + 1.5)) * 0.45
      blueprint.position.y = Math.sin(t * 0.7) * 0.03

      // light sweep: pass every ~7s
      const cyc = (t % 7) / 7
      sweep.position.x = -3.4 + cyc * 7.2
      sweep.material.opacity = Math.sin(cyc * Math.PI) * 0.16

      // robot welding along seam
      const u = (Math.sin(t * 0.65) + 1) / 2
      const tx = seamA.x + (seamB.x - seamA.x) * u
      const ty = seamA.y + (seamB.y - seamA.y) * u + car.position.y
      const tip = solveArm(tx, ty)
      // X-ray blend: paint dissolves into hologram wireframe
      scanBlend += (scanTarget - scanBlend) * 0.06
      paint.opacity = 1 - scanBlend * 0.85
      glassMat.opacity = 0.92 - scanBlend * 0.66
      xrayEdges.material.opacity = scanBlend * 0.78
      under.material.color.setHex(scanBlend > 0.5 ? 0x60a5fa : 0x7db4ff)

      // alternate: 6s welding, 6s laser inspection (laser locked on in X-ray)
      const scanMode = scanBlend > 0.5 ? true : (t % 12) >= 6
      const working = !scanMode && Math.abs(Math.cos(t * 0.65)) > 0.25
      // laser fan during scan mode
      if (scanMode) {
        const lp = laser.geometry.attributes.position.array
        lp[0] = tip.x; lp[1] = tip.y; lp[2] = 0.82
        lp[3] = tx - 0.45; lp[4] = ty - 0.28; lp[5] = 0.86
        lp[6] = tx + 0.45; lp[7] = ty - 0.2; lp[8] = 0.86
        laser.geometry.attributes.position.needsUpdate = true
        laser.material.opacity = 0.12 + Math.abs(Math.sin(t * 6)) * 0.1
        laserLine.material.opacity = 0.8
        laserLine.position.set(tx + Math.sin(t * 4) * 0.4, ty - 0.24, 0.86)
      } else {
        laser.material.opacity = 0
        laserLine.material.opacity = 0
      }
      const flick = working ? (0.5 + Math.random() * 0.5) : 0.06
      spark.material.opacity = flick
      const ssc = 0.2 + flick * 0.2
      spark.scale.set(ssc, ssc, 1)
      weldLight.position.set(tip.x, tip.y, 0.8)
      weldLight.intensity = working ? 8 + Math.random() * 20 : 0.4

      const arr2 = sparks.geometry.attributes.position.array
      for (let i = 0; i < S_COUNT; i++) {
        sLife[i] -= dt * 1.6
        if (sLife[i] <= 0 && working) {
          sLife[i] = 0.35 + Math.random() * 0.4
          arr2[i * 3] = tip.x; arr2[i * 3 + 1] = tip.y; arr2[i * 3 + 2] = 0.8
          sVel[i].set((Math.random() - 0.3) * 1.6, Math.random() * 1.8 + 0.4, (Math.random() - 0.5) * 1.2)
        } else if (sLife[i] > 0) {
          sVel[i].y -= 4.5 * dt
          arr2[i * 3] += sVel[i].x * dt
          arr2[i * 3 + 1] += sVel[i].y * dt
          arr2[i * 3 + 2] += sVel[i].z * dt
        } else {
          arr2[i * 3 + 1] = -10
        }
      }
      sparks.geometry.attributes.position.needsUpdate = true

      // ambient particles
      const arr = particles.geometry.attributes.position.array
      for (let i = 0; i < pCount; i++) {
        arr[i * 3 + 1] += 0.0035
        if (arr[i * 3 + 1] > 5.5) arr[i * 3 + 1] = 0
      }
      particles.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      if (running) raf = requestAnimationFrame(tick)
    }

    if (reduced) {
      world.rotation.y = BASE_YAW
      solveArm(seamA.x, seamA.y)
      weldLight.intensity = 6
      weldLight.position.set(seamA.x, seamA.y, 0.8)
      renderer.render(scene, camera)
    } else {
      running = true
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return
      if (entry.isIntersecting && !running) { running = true; clock.start(); prev = 0; raf = requestAnimationFrame(tick) }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
    })
    io.observe(el)
    const onVis = () => {
      if (reduced) return
      if (document.hidden && running) { running = false; cancelAnimationFrame(raf) }
      else if (!document.hidden && !running) { running = true; raf = requestAnimationFrame(tick) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      el.removeEventListener('pointermove', onPointer)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('ac-xray', onScanToggle)
      glowTex.dispose()
      hudTex.dispose()
      envTex.dispose()
      if (loadedModel) {
        loadedModel.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        })
      }
      pmrem.dispose()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
      })
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="scene3d" aria-hidden="true" />
}
