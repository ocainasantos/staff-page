// Three.js — modelo baseado na foto da STAFF

const canvas = document.getElementById('probe-canvas');
const W = 520;
const H = 780;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
camera.position.set(0, 0, 7);

// ── MATERIAIS ────────────────────────────────────────────────────

const mBody = new THREE.MeshStandardMaterial({
  color: 0xc2bfb8,   // cinza claro quente (igual à caixa)
  metalness: 0.08,
  roughness: 0.72
});
const mLid = new THREE.MeshStandardMaterial({
  color: 0xb8b5ae,   // face frontal levemente mais escura
  metalness: 0.06,
  roughness: 0.78
});
const mSeam = new THREE.MeshStandardMaterial({
  color: 0x9a9790,
  metalness: 0.1,
  roughness: 0.85
});
const mScrew = new THREE.MeshStandardMaterial({
  color: 0x909090,
  metalness: 0.75,
  roughness: 0.25
});
const mScrewSlot = new THREE.MeshStandardMaterial({
  color: 0x505050,
  metalness: 0.5,
  roughness: 0.5
});
const mBlack = new THREE.MeshStandardMaterial({
  color: 0x1c1c1c,
  metalness: 0.25,
  roughness: 0.6
});
const mConnector = new THREE.MeshStandardMaterial({
  color: 0x252525,
  metalness: 0.5,
  roughness: 0.4
});

// ── MODELO ──────────────────────────────────────────────────────

const device = new THREE.Group();

const W3 = 1.9, H3 = 1.5, D3 = 1.6;  // largura x altura x profundidade

// — Corpo principal —
device.add(new THREE.Mesh(new THREE.BoxGeometry(W3, H3, D3), mBody));

// — Tampa frontal (face da frente, levemente protuberante) —
const lid = new THREE.Mesh(new THREE.BoxGeometry(W3 - 0.02, H3 - 0.02, 0.06), mLid);
lid.position.z = D3 / 2 + 0.01;
device.add(lid);

// — Linha de costura (seam) ao redor da tampa —
// horizontal topo
const seamTop = new THREE.Mesh(new THREE.BoxGeometry(W3 + 0.02, 0.035, 0.08), mSeam);
seamTop.position.set(0, H3 / 2 - 0.01, D3 / 2 - 0.01);
device.add(seamTop);
// horizontal base
const seamBot = new THREE.Mesh(new THREE.BoxGeometry(W3 + 0.02, 0.035, 0.08), mSeam);
seamBot.position.set(0, -(H3 / 2 - 0.01), D3 / 2 - 0.01);
device.add(seamBot);
// vertical esquerda
const seamL = new THREE.Mesh(new THREE.BoxGeometry(0.035, H3 + 0.02, 0.08), mSeam);
seamL.position.set(-(W3 / 2 - 0.01), 0, D3 / 2 - 0.01);
device.add(seamL);
// vertical direita
const seamR = new THREE.Mesh(new THREE.BoxGeometry(0.035, H3 + 0.02, 0.08), mSeam);
seamR.position.set(W3 / 2 - 0.01, 0, D3 / 2 - 0.01);
device.add(seamR);

// — 4 Parafusos nos cantos —
const px = W3 / 2 - 0.2;
const py = H3 / 2 - 0.2;
const fz = D3 / 2 + 0.04;

[[-px, py], [px, py], [-px, -py], [px, -py]].forEach(function(pos) {
  const x = pos[0], y = pos[1];

  // Cabeça do parafuso
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.06, 14), mScrew);
  head.rotation.x = Math.PI / 2;
  head.position.set(x, y, fz);
  device.add(head);

  // Cruz do parafuso (slot horizontal)
  const slotH = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.014, 0.025), mScrewSlot);
  slotH.position.set(x, y, fz + 0.04);
  device.add(slotH);

  // Cruz do parafuso (slot vertical)
  const slotV = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.09, 0.025), mScrewSlot);
  slotV.position.set(x, y, fz + 0.04);
  device.add(slotV);
});

// — Conector da antena (saindo do lado direito, parte superior) —
const conY = H3 / 2 - 0.32;
const conZ = 0.1;

const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 14), mConnector);
connector.rotation.z = Math.PI / 2;
connector.position.set(W3 / 2 + 0.07, conY, conZ);
device.add(connector);

// Rosca do conector (anel decorativo)
const thread = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 20), mConnector);
thread.rotation.y = Math.PI / 2;
thread.position.set(W3 / 2 + 0.12, conY, conZ);
device.add(thread);

// — Antena — saindo do conector, inclinada ~50° para cima
const antenaGroup = new THREE.Group();

const antLen = 1.55;

// Corpo da antena (levemente cônico)
const antCorpo = new THREE.Mesh(
  new THREE.CylinderGeometry(0.028, 0.045, antLen, 10),
  mBlack
);
antCorpo.position.y = antLen / 2;
antenaGroup.add(antCorpo);

// Ponta arredondada
const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), mBlack);
antTip.position.y = antLen;
antenaGroup.add(antTip);

// Posiciona e rotaciona o grupo da antena
antenaGroup.rotation.z = -Math.PI * 0.27;   // ~49° inclinado para cima-direita
antenaGroup.position.set(W3 / 2 + 0.18, conY, conZ);
device.add(antenaGroup);

// — Posição e ângulo inicial do device —
device.rotation.x = -0.22;  // leve inclinação para ver o topo
device.rotation.y =  0.45;  // rotação para mostrar lado da antena

scene.add(device);

// ── ILUMINAÇÃO ───────────────────────────────────────────────────

scene.add(new THREE.AmbientLight(0xffffff, 0.65));

// Luz principal (topo-frente)
const key = new THREE.DirectionalLight(0xfff8f0, 1.4);
key.position.set(3, 5, 6);
scene.add(key);

// Luz de preenchimento (esquerda)
const fill = new THREE.DirectionalLight(0xddeeff, 0.5);
fill.position.set(-5, 1, 2);
scene.add(fill);

// Luz de rim (trás-baixo)
const rim = new THREE.DirectionalLight(0xffeedd, 0.35);
rim.position.set(1, -4, -4);
scene.add(rim);

// ── ANIMAÇÃO ─────────────────────────────────────────────────────

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  try {
    var t = clock.getElapsedTime();

    // Rotação contínua lenta no Y
    device.rotation.y = 0.45 + t * 0.22;

    // Suave oscilação no X (dá a sensação de ver topo/frente)
    device.rotation.x = -0.22 + Math.sin(t * 0.35) * 0.1;

    // Flutuação suave
    device.position.y = Math.sin(t * 0.65) * 0.07;

    renderer.render(scene, camera);
  } catch(e) {
    console.warn('STAFF 3D:', e);
  }
}

animate();
