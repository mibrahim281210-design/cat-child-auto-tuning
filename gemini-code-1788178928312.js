// --- 1. CAR CUSTOMIZATION & COLOR SYSTEM ---
const carCustomization = {
  paintColor: 0xff0055,
  neonColor: 0x00ffff,
  spoilerAdded: false,
  originalVertices: [] // Saved for vertex repair
};

// Save original vertex positions for repair mechanics
const positionAttr = carGeo.attributes.position;
for (let i = 0; i < positionAttr.count; i++) {
  carCustomization.originalVertices.push(
    new THREE.Vector3().fromBufferAttribute(positionAttr, i)
  );
}

// Function to repaint the car body
function applyBodyPaint(hexColor) {
  carMat.color.setHex(hexColor);
  carCustomization.paintColor = hexColor;
}

// Add a Neon Underglow light attachment
const neonLight = new THREE.PointLight(carCustomization.neonColor, 2, 5);
neonLight.position.set(0, -0.4, 0);
carMesh.add(neonLight);

function setNeonColor(hexColor) {
  neonLight.color.setHex(hexColor);
  carCustomization.neonColor = hexColor;
}

// --- 2. INSTANT REPAIR MECHANIC ---
function repairVehicle() {
  const positionAttr = carGeo.attributes.position;
  
  // Reset all deformed vertices back to their original positions
  for (let i = 0; i < positionAttr.count; i++) {
    const orig = carCustomization.originalVertices[i];
    positionAttr.setXYZ(i, orig.x, orig.y, orig.z);
  }
  
  positionAttr.needsUpdate = true;
  carGeo.computeVertexNormals(); // Restore smooth reflections
}

// Bind 'R' Key for Instant Flash Repair
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    repairVehicle();
  }
});

// --- 3. SPOILER ATTACHMENT SYSTEM ---
let spoilerMesh = null;

function toggleSpoiler(enable) {
  if (enable && !spoilerMesh) {
    const spoilerGeo = new THREE.BoxGeometry(1.8, 0.1, 0.4);
    const spoilerMat = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.1, 
      metalness: 0.9 
    });
    spoilerMesh = new THREE.Mesh(spoilerGeo, spoilerMat);
    spoilerMesh.position.set(0, 0.6, 1.8); // Position on top of the trunk
    carMesh.add(spoilerMesh);
  } else if (!enable && spoilerMesh) {
    carMesh.remove(spoilerMesh);
    spoilerMesh = null;
  }
}