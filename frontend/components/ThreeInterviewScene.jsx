import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeInterviewScene
 * Realistic WebGL 3D corporate interview room built with Three.js.
 * Features:
 * - 3D Human Avatar (Mr. J. Chen) with organic head geometry, skin shading, natural eyes
 * - ARTICULATED REAL-TIME TALKING JAW / MOUTH that actively moves with speech cadence
 * - Eye blinking & attentive listening head gestures
 * - Polished mahogany executive desk with brass nameplate ("MR. J. CHEN - HIRING MANAGER")
 * - Desk props: Acrylic resume stand, digital notes tablet, notepad & pen, candidate hands
 * - Bright daylight floor-to-ceiling office windows with full 3D panoramic city skyline
 * Zero external image dependencies.
 */
export default function ThreeInterviewScene({
  isInterviewerSpeaking = false,
  isCandidateSpeaking = false,
  interviewerName = 'Mr. J. Chen',
  interviewerTitle = 'Hiring Manager',
  candidateRole = 'Software Engineer',
  targetCompany = 'Google',
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#98C5EB'); // Bright daytime sky
    scene.fog = new THREE.FogExp2('#D2E4F4', 0.014); // Soft atmospheric horizon haze

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 200);
    // Candidate's first-person seated perspective looking across the desk
    camera.position.set(0, 1.35, 1.68);
    camera.lookAt(0, 1.29, -0.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // ─── 2. Procedural Canvas Textures ───────────────────────────────────────
    // A. Executive Polished Wood Texture
    const createWoodTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#5A321E');
      grad.addColorStop(0.5, '#422414');
      grad.addColorStop(1, '#341A0D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Fine grain streaks
      for (let i = 0; i < 350; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(25, 10, 4, 0.22)' : 'rgba(110, 68, 40, 0.25)';
        const y = Math.random() * 512;
        const h = Math.random() * 6 + 1.5;
        ctx.fillRect(0, y, 512, h);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };
    const woodTexture = createWoodTexture();

    // B. Desk Nameplate: "MR. J. CHEN - HIRING MANAGER"
    const createNameplateTexture = (name, title) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 128;
      const ctx = c.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 512, 128);
      grad.addColorStop(0, '#B8860B');
      grad.addColorStop(0.3, '#FFD700');
      grad.addColorStop(0.6, '#F5DEB3');
      grad.addColorStop(1, '#996515');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 128);

      ctx.strokeStyle = '#4A3500';
      ctx.lineWidth = 5;
      ctx.strokeRect(6, 6, 500, 116);

      ctx.fillStyle = '#161003';
      ctx.textAlign = 'center';
      ctx.font = 'bold 38px "Segoe UI", Inter, sans-serif';
      ctx.fillText(name.toUpperCase(), 256, 54);
      ctx.font = '600 24px "Segoe UI", Inter, sans-serif';
      ctx.fillStyle = '#3A2703';
      ctx.fillText(title.toUpperCase(), 256, 95);

      return new THREE.CanvasTexture(c);
    };
    const nameplateTex = createNameplateTexture(interviewerName, interviewerTitle);

    // C. Candidate Resume Sheet Texture
    const createResumeTexture = (role, company) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 724;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 724);

      // Photo placeholder
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(60, 60, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('CANDIDATE RESUME', 110, 55);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(`${role} · Target: ${company}`, 110, 82);

      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(30, 110);
      ctx.lineTo(482, 110);
      ctx.stroke();

      for (let y = 140; y < 690; y += 26) {
        ctx.fillStyle = y % 78 === 0 ? '#1E293B' : '#94A3B8';
        const lineLen = y % 78 === 0 ? 190 : Math.floor(Math.random() * 220 + 210);
        ctx.fillRect(32, y, lineLen, y % 78 === 0 ? 9 : 5);
      }
      return new THREE.CanvasTexture(c);
    };
    const resumeTex = createResumeTexture(candidateRole, targetCompany);

    // D. Skyscraper Windows Grid Texture
    const createBuildingTexture = (tint = '#3B4D61') => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 256, 512);

      for (let x = 6; x < 250; x += 15) {
        for (let y = 6; y < 506; y += 17) {
          const isSunReflect = Math.random() > 0.45;
          ctx.fillStyle = isSunReflect ? 'rgba(255, 250, 230, 0.85)' : 'rgba(30, 48, 70, 0.7)';
          ctx.fillRect(x, y, 9, 10);
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 6);
      return tex;
    };

    // ─── 3. Natural Cinematic Daylight Lighting ──────────────────────────────
    // Bright front-top daylight illuminating the room, desk, and interviewer
    const frontSun = new THREE.DirectionalLight('#FFF9F2', 3.4);
    frontSun.position.set(0.8, 4.5, 2.5);
    frontSun.castShadow = true;
    frontSun.shadow.mapSize.width = 2048;
    frontSun.shadow.mapSize.height = 2048;
    frontSun.shadow.bias = -0.0004;
    scene.add(frontSun);

    // Warm key light on interviewer face & hands
    const keyLight = new THREE.DirectionalLight('#FFF4E6', 2.0);
    keyLight.position.set(-1.2, 2.8, 1.8);
    scene.add(keyLight);

    // Soft cool fill light
    const fillLight = new THREE.DirectionalLight('#E0EEFF', 1.5);
    fillLight.position.set(2.0, 2.0, 1.5);
    scene.add(fillLight);

    // Ambient office illumination
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.8);
    scene.add(ambientLight);

    // Rim backlight from windows
    const rimLight = new THREE.DirectionalLight('#B0D4F5', 1.8);
    rimLight.position.set(0, 2.5, -2.8);
    scene.add(rimLight);

    // ─── 4. The 3D Corporate Office Environment ──────────────────────────────
    // A. Room Floor (Luxury Charcoal Carpet)
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({ color: '#181B20', roughness: 0.92 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // B. Ceiling
    const ceilGeo = new THREE.PlaneGeometry(16, 16);
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#2C3038', roughness: 0.8 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 3.6;
    scene.add(ceil);

    // C. Right Wall (Warm Architectural Wood Slats)
    const rightWallGeo = new THREE.BoxGeometry(0.3, 3.6, 10);
    const rightWallMat = new THREE.MeshStandardMaterial({
      color: '#462C1C',
      roughness: 0.55,
      map: woodTexture,
    });
    const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
    rightWall.position.set(3.8, 1.8, -0.5);
    scene.add(rightWall);

    for (let z = -4; z <= 3; z += 0.45) {
      const slatGeo = new THREE.BoxGeometry(0.05, 3.58, 0.035);
      const slatMat = new THREE.MeshStandardMaterial({ color: '#24140B', roughness: 0.75 });
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(3.64, 1.8, z);
      scene.add(slat);
    }

    // D. Left Wall Pillar & Potted Office Plant
    const pillarGeo = new THREE.BoxGeometry(0.8, 3.6, 0.8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#272B33', roughness: 0.65 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(-3.2, 1.8, -1.2);
    scene.add(pillar);

    // Ceramic Planter
    const potGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.58, 24);
    const potMat = new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.25 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(-2.8, 0.29, -0.7);
    pot.castShadow = true;
    scene.add(pot);

    // Plant Leaves
    const plantGroup = new THREE.Group();
    plantGroup.position.set(-2.8, 0.58, -0.7);
    const leafMat = new THREE.MeshStandardMaterial({ color: '#1B6A35', roughness: 0.45 });
    for (let i = 0; i < 11; i++) {
      const leafGeo = new THREE.ConeGeometry(0.12, 0.65, 5);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / 11) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.13, 0.26, Math.sin(angle) * 0.13);
      leaf.rotation.z = Math.cos(angle) * 0.45;
      leaf.rotation.x = Math.sin(angle) * 0.45;
      plantGroup.add(leaf);
    }
    scene.add(plantGroup);

    // E. Massive Floor-to-Ceiling Office Window Grid
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: '#12151B',
      metalness: 0.85,
      roughness: 0.25,
    });
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#B6D3E8',
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5,
    });

    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.6), windowGlassMat);
    glassPane.position.set(0, 1.8, -3.2);
    scene.add(glassPane);

    // Vertical black window mullions
    [-3.2, -1.6, 0, 1.6, 3.2].forEach(x => {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.6, 0.08), windowFrameMat);
      mullion.position.set(x, 1.8, -3.18);
      scene.add(mullion);
    });

    // Horizontal window transoms
    [0.9, 1.8, 2.7].forEach(y => {
      const transom = new THREE.Mesh(new THREE.BoxGeometry(9, 0.06, 0.08), windowFrameMat);
      transom.position.set(0, y, -3.18);
      scene.add(transom);
    });

    // ─── 5. 3D Panoramic Procedural City Skyline (Outside Windows) ───────────
    const skylineGroup = new THREE.Group();
    const buildingConfigs = [
      { x: -5.5, z: -16, w: 2.4, d: 2.4, h: 9.8, tint: '#3A4D62' },
      { x: -3.8, z: -12, w: 2.0, d: 2.0, h: 8.4, tint: '#4D6B82' },
      { x: -2.2, z: -8.5, w: 1.6, d: 1.6, h: 6.9, tint: '#42586D' },
      { x: -1.0, z: -14, w: 2.2, d: 2.2, h: 10.4, tint: '#2F3C4B' },
      { x: 0.6, z: -9.5, w: 1.8, d: 1.8, h: 7.8, tint: '#4E687F' },
      { x: 2.2, z: -11, w: 2.1, d: 2.1, h: 9.2, tint: '#3B4E63' },
      { x: 3.9, z: -8.0, w: 1.7, d: 1.7, h: 6.6, tint: '#41576C' },
      { x: 5.6, z: -15, w: 2.6, d: 2.6, h: 11.2, tint: '#253240' },
      // Distant backdrop skyline
      { x: -7.0, z: -24, w: 3.5, d: 3.5, h: 13.5, tint: '#67788C' },
      { x: -4.5, z: -22, w: 3.0, d: 3.0, h: 11.8, tint: '#576779' },
      { x: -1.5, z: -26, w: 4.0, d: 4.0, h: 15.0, tint: '#485768' },
      { x: 2.0, z: -25, w: 3.8, d: 3.8, h: 14.0, tint: '#576779' },
      { x: 6.0, z: -23, w: 3.2, d: 3.2, h: 12.5, tint: '#67788C' },
    ];

    buildingConfigs.forEach(b => {
      const bTex = createBuildingTexture(b.tint);
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const bMat = new THREE.MeshStandardMaterial({
        color: b.tint,
        map: bTex,
        roughness: 0.35,
        metalness: 0.35,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(b.x, b.h / 2 - 1.0, b.z);
      skylineGroup.add(building);

      if (b.h > 8.5) {
        const spire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.08, 1.4, 8),
          new THREE.MeshStandardMaterial({ color: '#E2E8F0', metalness: 0.9 })
        );
        spire.position.set(b.x, b.h - 1.0 + 0.7, b.z);
        skylineGroup.add(spire);
      }
    });
    scene.add(skylineGroup);

    // ─── 6. Foreground Executive Wooden Desk & Props ───────────────────────────
    const deskGroup = new THREE.Group();

    // Desktop
    const deskTopGeo = new THREE.BoxGeometry(3.3, 0.08, 1.45);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: '#4B2816',
      roughness: 0.3,
      metalness: 0.04,
      map: woodTexture,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.set(0, 0.82, 0.1);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Brass Bevel Edge Trim
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(3.32, 0.02, 1.47),
      new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.9, roughness: 0.2 })
    );
    trim.position.set(0, 0.81, 0.1);
    deskGroup.add(trim);

    // Desk Legs
    const legMat = new THREE.MeshStandardMaterial({ color: '#27150B', roughness: 0.7 });
    [-1.4, 1.4].forEach(x => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.82, 1.15), legMat);
      leg.position.set(x, 0.41, 0.1);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Modesty Panel
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.65, 0.05), legMat);
    panel.position.set(0, 0.5, -0.38);
    deskGroup.add(panel);

    // Black Executive Leather Desk Blotter / Pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.01, 0.78),
      new THREE.MeshStandardMaterial({ color: '#121418', roughness: 0.82 })
    );
    pad.position.set(0, 0.865, 0.22);
    pad.receiveShadow = true;
    deskGroup.add(pad);

    // Desk Prop 1: Brass & Wood Nameplate: "MR. J. CHEN - HIRING MANAGER"
    const nameplateBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.065, 0.08),
      new THREE.MeshStandardMaterial({ color: '#221206', roughness: 0.5 })
    );
    const nameplateFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.06),
      new THREE.MeshStandardMaterial({ map: nameplateTex, roughness: 0.25, metalness: 0.85 })
    );
    nameplateFace.position.set(0, 0, 0.042);
    nameplateBase.add(nameplateFace);
    nameplateBase.position.set(0.68, 0.89, -0.15);
    nameplateBase.rotation.y = -0.18;
    nameplateBase.castShadow = true;
    deskGroup.add(nameplateBase);

    // Desk Prop 2: Acrylic Standing Resume Display with Candidate Resume
    const acrylicStand = new THREE.Group();
    const acrylicBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.02, 0.12),
      new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.45, roughness: 0.1, color: '#F1F5F9' })
    );
    const resumeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.44),
      new THREE.MeshStandardMaterial({ map: resumeTex, roughness: 0.6 })
    );
    resumeMesh.position.set(0, 0.23, 0);
    resumeMesh.rotation.x = -0.12;
    acrylicStand.add(acrylicBase);
    acrylicStand.add(resumeMesh);
    acrylicStand.position.set(-0.75, 0.87, -0.05);
    acrylicStand.rotation.y = 0.22;
    deskGroup.add(acrylicStand);

    // Desk Prop 3: Digital Notes Tablet on Desk
    const tabletBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.012, 0.36),
      new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.8, roughness: 0.2 })
    );
    const tabletScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.23, 0.33),
      new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.15 })
    );
    tabletScreen.rotation.x = -Math.PI / 2;
    tabletScreen.position.y = 0.007;
    tabletBase.add(tabletScreen);
    tabletBase.position.set(-0.05, 0.87, 0.25);
    tabletBase.rotation.y = -0.05;
    deskGroup.add(tabletBase);

    // Desk Prop 4: Notepad & Pen
    const padSheet = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.01, 0.26),
      new THREE.MeshStandardMaterial({ color: '#FEF08A', roughness: 0.7 })
    );
    padSheet.position.set(0.32, 0.87, 0.26);
    padSheet.rotation.y = 0.08;
    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: '#0F172A', metalness: 0.9, roughness: 0.2 })
    );
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.25;
    pen.position.set(0.45, 0.875, 0.28);
    deskGroup.add(padSheet);
    deskGroup.add(pen);

    scene.add(deskGroup);

    // ─── 7. THE 3D PROCEDURAL INTERVIEWER AVATAR (MR. J. CHEN) ───────────────
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0, -0.92);

    // A. Executive Ergonomic Mesh Office Chair
    const chairGroup = new THREE.Group();
    const leatherMat = new THREE.MeshStandardMaterial({ color: '#191C22', roughness: 0.55 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: '#94A3B8', metalness: 0.9, roughness: 0.2 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.12, 0.7), leatherMat);
    seat.position.set(0, 0.65, 0);
    chairGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.96, 0.1), leatherMat);
    backrest.position.set(0, 1.25, -0.32);
    backrest.rotation.x = -0.06;
    chairGroup.add(backrest);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.08), leatherMat);
    headrest.position.set(0, 1.82, -0.36);
    chairGroup.add(headrest);

    [-0.38, 0.38].forEach(x => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.44), chromeMat);
      arm.position.set(x, 0.88, -0.05);
      chairGroup.add(arm);
    });

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 16), chromeMat);
    pedestal.position.set(0, 0.32, 0);
    chairGroup.add(pedestal);

    avatarGroup.add(chairGroup);

    // B. Human Torso & Tailored Executive Suit
    const humanGroup = new THREE.Group();

    // Natural skin material with soft subsurface clearcoat
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: '#E8A782',
      roughness: 0.44,
      metalness: 0.02,
      clearcoat: 0.12,
      clearcoatRoughness: 0.25,
    });
    const suitMat = new THREE.MeshStandardMaterial({
      color: '#343F52', // Modern executive slate-navy tailored suit
      roughness: 0.65,
    });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF', // Crisp white shirt
      roughness: 0.35,
    });

    // Torso Chest (Suit Jacket)
    const chestGeo = new THREE.CylinderGeometry(0.37, 0.32, 0.64, 20);
    const chest = new THREE.Mesh(chestGeo, suitMat);
    chest.position.set(0, 1.05, -0.15);
    chest.castShadow = true;
    humanGroup.add(chest);

    // White Shirt V-Placket
    const shirtV = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.06), shirtMat);
    shirtV.position.set(0, 1.18, -0.02);
    humanGroup.add(shirtV);

    // Open White Collar Tabs
    [-0.07, 0.07].forEach((x, idx) => {
      const tab = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.02), shirtMat);
      tab.position.set(x, 1.35, 0.02);
      tab.rotation.z = idx === 0 ? 0.35 : -0.35;
      humanGroup.add(tab);
    });

    // Suit Lapels
    [-0.14, 0.14].forEach((x, idx) => {
      const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.04), suitMat);
      lapel.position.set(x, 1.15, 0.01);
      lapel.rotation.z = idx === 0 ? -0.22 : 0.22;
      humanGroup.add(lapel);
    });

    // Arms resting forward on the desk
    [-0.32, 0.32].forEach((x, idx) => {
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 16), suitMat);
      upperArm.position.set(x, 1.05, -0.06);
      upperArm.rotation.x = 0.55;
      upperArm.rotation.z = idx === 0 ? 0.15 : -0.15;
      humanGroup.add(upperArm);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.44, 16), suitMat);
      forearm.position.set(idx === 0 ? -0.22 : 0.22, 0.88, 0.15);
      forearm.rotation.x = Math.PI / 2.3;
      forearm.rotation.y = idx === 0 ? 0.4 : -0.4;
      humanGroup.add(forearm);
    });

    // Hands resting clasped together on desk
    const handsGroup = new THREE.Group();
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.055, 0.14), skinMat);
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.055, 0.14), skinMat);
    leftHand.position.set(-0.06, 0.88, 0.28);
    rightHand.position.set(0.06, 0.88, 0.28);
    leftHand.rotation.y = 0.35;
    rightHand.rotation.y = -0.35;
    handsGroup.add(leftHand);
    handsGroup.add(rightHand);
    humanGroup.add(handsGroup);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.18, 20), skinMat);
    neck.position.set(0, 1.38, -0.1);
    humanGroup.add(neck);

    // ─── D. HEAD, BLINKING EYES & ARTICULATED TALKING MOUTH ─────────────────
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.48, -0.08);

    // Cranium & Upper Face (smooth high-segment geometry)
    const craniumGeo = new THREE.SphereGeometry(0.2, 32, 28);
    craniumGeo.scale(0.92, 1.18, 0.98);
    const cranium = new THREE.Mesh(craniumGeo, skinMat);
    cranium.position.set(0, 0.08, 0);
    cranium.castShadow = true;
    headPivot.add(cranium);

    // Sleek Asian Executive Parted Hair (volume, parting & sideburns)
    const hairMat = new THREE.MeshStandardMaterial({
      color: '#131418',
      roughness: 0.75,
      metalness: 0.1,
    });
    const hairTopGeo = new THREE.SphereGeometry(0.208, 28, 20);
    hairTopGeo.scale(0.96, 1.08, 1.02);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.14, -0.02);
    headPivot.add(hairTop);

    // Side part fringe sweep
    const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.13), hairMat);
    fringe.position.set(-0.02, 0.23, 0.12);
    fringe.rotation.z = -0.14;
    headPivot.add(fringe);

    // Ears
    [-0.19, 0.19].forEach((x, idx) => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.085, 0.05), skinMat);
      ear.position.set(x, 0.07, -0.02);
      ear.rotation.y = idx === 0 ? 0.25 : -0.25;
      headPivot.add(ear);
    });

    // Refined Nose Bridge & Tip
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 12), skinMat);
    nose.position.set(0, 0.06, 0.19);
    nose.rotation.x = -0.15;
    headPivot.add(nose);

    // Eyebrows
    const browMat = new THREE.MeshStandardMaterial({ color: '#16171B', roughness: 0.9 });
    const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.018, 0.025), browMat);
    const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.018, 0.025), browMat);
    leftBrow.position.set(-0.072, 0.128, 0.174);
    rightBrow.position.set(0.072, 0.128, 0.174);
    leftBrow.rotation.z = 0.08;
    rightBrow.rotation.z = -0.08;
    headPivot.add(leftBrow);
    headPivot.add(rightBrow);

    // Almond-Shaped Eyes with Pupils & Specular Highlights
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.15 });
    const irisMat = new THREE.MeshStandardMaterial({ color: '#2B1A12', roughness: 0.2 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: '#050508' });

    const leftEyeGroup = new THREE.Group();
    const rightEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.068, 0.076, 0.168);
    rightEyeGroup.position.set(0.068, 0.076, 0.168);

    [leftEyeGroup, rightEyeGroup].forEach(eyeGrp => {
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.025, 20, 16), eyeWhiteMat);
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.014, 18), irisMat);
      iris.position.z = 0.024;
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.007, 14), pupilMat);
      pupil.position.z = 0.025;

      eyeGrp.add(eyeball);
      eyeGrp.add(iris);
      eyeGrp.add(pupil);
      headPivot.add(eyeGrp);
    });

    // Eyelids (Blinking Animation)
    const lidMat = new THREE.MeshStandardMaterial({ color: '#C88D6A', roughness: 0.6 });
    const leftLid = new THREE.Mesh(new THREE.SphereGeometry(0.027, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
    const rightLid = new THREE.Mesh(new THREE.SphereGeometry(0.027, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
    leftLid.position.set(-0.068, 0.079, 0.168);
    rightLid.position.set(0.068, 0.079, 0.168);
    leftLid.rotation.x = -Math.PI / 1.7; // open
    rightLid.rotation.x = -Math.PI / 1.7;
    headPivot.add(leftLid);
    headPivot.add(rightLid);

    // Upper Lip & Upper Teeth
    const lipMat = new THREE.MeshStandardMaterial({ color: '#9E584F', roughness: 0.65 });
    const teethMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2 });

    const upperLip = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.085, 16), lipMat);
    upperLip.rotation.z = Math.PI / 2;
    upperLip.position.set(0, -0.038, 0.178);
    headPivot.add(upperLip);

    const upperTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.016, 0.02), teethMat);
    upperTeeth.position.set(0, -0.046, 0.165);
    headPivot.add(upperTeeth);

    // ─── ARTICULATED REAL-TIME TALKING JAW HINGE ─────────────────────────────
    // Hinged lower jaw attached at the temporomandibular joint
    const jawHinge = new THREE.Group();
    jawHinge.position.set(0, -0.025, 0.04);

    // Tapered Organic Chin & Lower Jaw
    const chinGeo = new THREE.CylinderGeometry(0.11, 0.075, 0.14, 20);
    chinGeo.scale(1.1, 1.0, 1.15);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.06, 0.1);
    jawHinge.add(chin);

    // Lower Lip
    const lowerLip = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.082, 16), lipMat);
    lowerLip.rotation.z = Math.PI / 2;
    lowerLip.position.set(0, -0.038, 0.155);
    jawHinge.add(lowerLip);

    // Lower Teeth Row
    const lowerTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.016, 0.02), teethMat);
    lowerTeeth.position.set(0, -0.028, 0.142);
    jawHinge.add(lowerTeeth);

    // Dark Oral Cavity Interior
    const oralCavity = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.038, 0.04),
      new THREE.MeshBasicMaterial({ color: '#2E0B0E' })
    );
    oralCavity.position.set(0, -0.025, 0.125);
    jawHinge.add(oralCavity);

    headPivot.add(jawHinge);
    humanGroup.add(headPivot);
    avatarGroup.add(humanGroup);
    scene.add(avatarGroup);

    // ─── 8. Candidate First-Person Hands on Desk ─────────────────────────────
    const candidateHandsGroup = new THREE.Group();
    const candidateHandMat = new THREE.MeshStandardMaterial({ color: '#D49C78', roughness: 0.6 });

    const leftCandHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.055, 0.18), candidateHandMat);
    leftCandHand.position.set(-0.35, 0.88, 0.82);
    leftCandHand.rotation.set(-0.15, 0.35, 0.1);
    candidateHandsGroup.add(leftCandHand);

    const rightCandHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.055, 0.18), candidateHandMat);
    rightCandHand.position.set(0.35, 0.88, 0.82);
    rightCandHand.rotation.set(-0.15, -0.35, -0.1);
    candidateHandsGroup.add(rightCandHand);

    scene.add(candidateHandsGroup);

    // ─── 9. Animation Loop (Lip-Sync, Blinking, Gesturing, Idle) ──────────────
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkTime = 3.5;
    let reqId = null;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // ── A. TALKING LIP-SYNC / JAW ANIMATION ──
      if (isInterviewerSpeaking) {
        // Multi-frequency phonetic syllable wave to simulate natural speech cadence
        const speechWave =
          Math.sin(time * 16.5) * 0.45 +
          Math.sin(time * 24.2) * 0.32 +
          Math.sin(time * 8.4) * 0.23;

        // Jaw opens and closes between 0 and 0.24 radians
        const targetJawAngle = Math.max(0, speechWave) * 0.24;
        jawHinge.rotation.x = THREE.MathUtils.lerp(jawHinge.rotation.x, targetJawAngle, 0.45);

        // Conversational head nods during speech
        headPivot.rotation.x = Math.sin(time * 2.8) * 0.04 + 0.01;
        headPivot.rotation.y = Math.sin(time * 1.6) * 0.035;

        // Eyebrows slight expressive lift
        leftBrow.position.y = 0.128 + Math.sin(time * 4) * 0.006;
        rightBrow.position.y = 0.128 + Math.sin(time * 4) * 0.006;
      } else {
        // Closed mouth when silent
        jawHinge.rotation.x = THREE.MathUtils.lerp(jawHinge.rotation.x, 0, 0.25);
        leftBrow.position.y = THREE.MathUtils.lerp(leftBrow.position.y, 0.128, 0.1);
        rightBrow.position.y = THREE.MathUtils.lerp(rightBrow.position.y, 0.128, 0.1);

        // Attentive listening posture when candidate is speaking
        if (isCandidateSpeaking) {
          headPivot.rotation.x = THREE.MathUtils.lerp(headPivot.rotation.x, 0.04, 0.08);
          headPivot.rotation.z = THREE.MathUtils.lerp(headPivot.rotation.z, -0.035, 0.08);
          headPivot.rotation.y = THREE.MathUtils.lerp(headPivot.rotation.y, 0, 0.08);
        } else {
          // Subtle idle head movement
          headPivot.rotation.x = Math.sin(time * 0.8) * 0.015;
          headPivot.rotation.y = Math.sin(time * 0.5) * 0.02;
          headPivot.rotation.z = THREE.MathUtils.lerp(headPivot.rotation.z, 0, 0.05);
        }
      }

      // ── B. EYE BLINKING ANIMATION ──
      blinkTimer += delta;
      if (blinkTimer > nextBlinkTime) {
        // Close eyelid
        leftLid.rotation.x = -Math.PI / 3.2;
        rightLid.rotation.x = -Math.PI / 3.2;

        if (blinkTimer > nextBlinkTime + 0.14) {
          // Open eyelid back up
          leftLid.rotation.x = -Math.PI / 1.7;
          rightLid.rotation.x = -Math.PI / 1.7;
          blinkTimer = 0;
          nextBlinkTime = 2.8 + Math.random() * 3.5;
        }
      }

      // ── C. SUBTLE IDLE BREATHING ──
      const breathe = Math.sin(time * 1.6) * 0.006;
      chest.position.y = 1.05 + breathe;
      headPivot.position.y = 1.48 + breathe * 0.8;

      // ── D. CANDIDATE FIRST-PERSON SUBTLE HAND BREATHING ──
      candidateHandsGroup.position.y = Math.sin(time * 1.4) * 0.003;

      // ── E. FIRST-PERSON NATURAL CAMERA BREATHING DRIFT ──
      camera.position.x = Math.sin(time * 0.4) * 0.012;
      camera.position.y = 1.35 + Math.sin(time * 0.8) * 0.006;

      renderer.render(scene, camera);
    };

    animate();

    // ─── 10. Responsive Resize Handler ───────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ─── 11. Cleanup & Teardown ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInterviewerSpeaking, isCandidateSpeaking, interviewerName, interviewerTitle, candidateRole, targetCompany]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
}
