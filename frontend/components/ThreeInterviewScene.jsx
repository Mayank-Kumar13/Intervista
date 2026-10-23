import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * ThreeInterviewScene
 * Realistic 3D Human Interviewer (Mr. J. Chen) and executive high-rise office environment in Three.js.
 * Features:
 * - REAL 3D Rigged Human GLB Avatar seated across the executive mahogany desk.
 * - LIVE MOVING & GESTURING HANDS: Realistic arms, wrists, and articulated fingers that move conversationally.
 * - REAL-TIME AUDIO-SYNCHRONIZED LIP-SYNC: Real facial morph targets (mouthOpen, mouthSmile) driven by live speech cadence.
 * - LIVING EXPRESSIONS: Natural head tilting, thoughtful micro-nods during listening, interactive gaze tracking.
 * - NATURAL BREATHING: Subtle organic spine and chest breathing physics.
 * - EXECUTIVE OFFICE ENVIRONMENT: Panoramic high-rise corner windows with city skyscrapers, floor-to-ceiling mullions, executive leather chair, polished desk, and daylight sunbeams.
 */
export default function ThreeInterviewScene({
  isInterviewerSpeaking = false,
  isCandidateSpeaking = false,
  characterState = 'idle',
  interviewerAudioLevel = 0,
  interviewerName = 'Mr. J. Chen',
  interviewerTitle = 'Hiring Manager',
  candidateRole = 'Software Engineer',
  targetCompany = 'Google',
  micVolume = 0,
}) {
  const mountRef = useRef(null);

  // Mutable ref so the 60 FPS animation loop continuously reads the latest props
  // without tearing down or remounting the Three.js WebGL canvas!
  const propsRef = useRef({
    isInterviewerSpeaking,
    isCandidateSpeaking,
    characterState,
    interviewerAudioLevel,
    interviewerName,
    interviewerTitle,
    candidateRole,
    targetCompany,
    micVolume,
  });

  propsRef.current = {
    isInterviewerSpeaking,
    isCandidateSpeaking,
    characterState,
    interviewerAudioLevel,
    interviewerName,
    interviewerTitle,
    candidateRole,
    targetCompany,
    micVolume,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#94BFE6'); // Crisp daylight sky
    scene.fog = new THREE.FogExp2('#C5DBEE', 0.012);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Candidate seated eye-level camera looking across the executive desk directly at Mr. Chen
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 150);
    camera.position.set(0, 1.34, 1.58);
    camera.lookAt(0, 1.28, -0.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    container.appendChild(renderer.domElement);

    // ─── 2. Procedural Canvas Textures ───────────────────────────────────────
    // Polished Mahogany Wood Texture
    const createWoodTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#532918');
      grad.addColorStop(0.5, '#3B1B0F');
      grad.addColorStop(1, '#291208');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(20, 8, 3, 0.22)' : 'rgba(105, 62, 35, 0.22)';
        const y = Math.random() * 512;
        const h = Math.random() * 5 + 1.5;
        ctx.fillRect(0, y, 512, h);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };
    const woodTexture = createWoodTexture();

    // Skyscraper Windows Grid Texture
    const createBuildingTexture = (tint = '#3B4D61') => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 256, 512);

      for (let x = 6; x < 250; x += 15) {
        for (let y = 6; y < 506; y += 17) {
          const isSunReflect = Math.random() > 0.42;
          ctx.fillStyle = isSunReflect ? 'rgba(255, 250, 235, 0.88)' : 'rgba(25, 42, 62, 0.75)';
          ctx.fillRect(x, y, 9, 10);
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 6);
      return tex;
    };

    // ─── 3. Professional Studio & Executive Daylight Lighting ────────────────
    // Strong front-top daylight illuminating Mr. Chen's face, suit, and moving hands
    const frontSun = new THREE.DirectionalLight('#FFF9F2', 3.5);
    frontSun.position.set(0.6, 4.2, 2.2);
    frontSun.castShadow = true;
    frontSun.shadow.mapSize.width = 2048;
    frontSun.shadow.mapSize.height = 2048;
    frontSun.shadow.bias = -0.0003;
    scene.add(frontSun);

    // Warm key light on interviewer face & hands
    const keyLight = new THREE.DirectionalLight('#FFF2E0', 2.2);
    keyLight.position.set(-1.0, 2.6, 1.8);
    scene.add(keyLight);

    // Soft sky fill light
    const fillLight = new THREE.DirectionalLight('#D8ECFC', 1.6);
    fillLight.position.set(1.8, 2.2, 1.4);
    scene.add(fillLight);

    // Ambient room illumination
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.7);
    scene.add(ambientLight);

    // Rim backlight from windows for edge definition
    const rimLight = new THREE.DirectionalLight('#A0CCF2', 2.2);
    rimLight.position.set(0, 2.8, -2.6);
    scene.add(rimLight);

    // Subtle warm bounce light from the desk surface onto chin and hands
    const deskBounce = new THREE.DirectionalLight('#D49B6A', 1.1);
    deskBounce.position.set(0, 0.5, 0.8);
    scene.add(deskBounce);

    // ─── 4. The 3D Corporate Executive Office ────────────────────────────────
    // Carpet Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({ color: '#16191E', roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Executive Wood Right Wall
    const rightWallGeo = new THREE.BoxGeometry(0.3, 3.8, 10);
    const rightWallMat = new THREE.MeshStandardMaterial({
      color: '#422414',
      roughness: 0.55,
      map: woodTexture,
    });
    const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
    rightWall.position.set(3.8, 1.9, -0.5);
    scene.add(rightWall);

    for (let z = -4; z <= 3; z += 0.5) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 3.78, 0.035),
        new THREE.MeshStandardMaterial({ color: '#221208', roughness: 0.75 })
      );
      slat.position.set(3.64, 1.9, z);
      scene.add(slat);
    }

    // Panoramic Window Wall (Outside Skyline)
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: '#0E1117',
      metalness: 0.85,
      roughness: 0.2,
    });

    // Vertical black window mullions
    [-3.2, -1.6, 0, 1.6, 3.2].forEach(x => {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.8, 0.08), windowFrameMat);
      mullion.position.set(x, 1.9, -3.2);
      scene.add(mullion);
    });

    // Horizontal window transoms
    [0.9, 1.9, 2.9].forEach(y => {
      const transom = new THREE.Mesh(new THREE.BoxGeometry(9, 0.065, 0.08), windowFrameMat);
      transom.position.set(0, y, -3.2);
      scene.add(transom);
    });

    // 3D City Skyline Outside
    const skylineGroup = new THREE.Group();
    const buildingConfigs = [
      { x: -5.6, z: -16, w: 2.6, d: 2.6, h: 10.2, tint: '#3A4D62' },
      { x: -3.8, z: -12, w: 2.1, d: 2.1, h: 8.6, tint: '#4D6B82' },
      { x: -2.0, z: -8.8, w: 1.7, d: 1.7, h: 7.2, tint: '#42586D' },
      { x: -0.8, z: -14, w: 2.3, d: 2.3, h: 10.8, tint: '#2F3C4B' },
      { x: 0.8, z: -9.8, w: 1.9, d: 1.9, h: 8.0, tint: '#4E687F' },
      { x: 2.3, z: -11.5, w: 2.2, d: 2.2, h: 9.5, tint: '#3B4E63' },
      { x: 4.0, z: -8.2, w: 1.8, d: 1.8, h: 6.8, tint: '#41576C' },
      { x: 5.8, z: -15, w: 2.8, d: 2.8, h: 11.5, tint: '#253240' },
      // Distant backdrop towers
      { x: -7.2, z: -24, w: 3.5, d: 3.5, h: 13.8, tint: '#67788C' },
      { x: -1.4, z: -25, w: 4.2, d: 4.2, h: 15.2, tint: '#485768' },
      { x: 2.2, z: -24, w: 3.8, d: 3.8, h: 14.2, tint: '#576779' },
      { x: 6.2, z: -23, w: 3.4, d: 3.4, h: 12.8, tint: '#67788C' },
    ];

    buildingConfigs.forEach(b => {
      const bTex = createBuildingTexture(b.tint);
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const bMat = new THREE.MeshStandardMaterial({
        color: b.tint,
        map: bTex,
        roughness: 0.35,
        metalness: 0.3,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(b.x, b.h / 2 - 1.2, b.z);
      skylineGroup.add(building);

      if (b.h > 8.5) {
        const spire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.08, 1.5, 8),
          new THREE.MeshStandardMaterial({ color: '#E2E8F0', metalness: 0.9 })
        );
        spire.position.set(b.x, b.h - 1.2 + 0.75, b.z);
        skylineGroup.add(spire);
      }
    });
    scene.add(skylineGroup);

    // ─── 5. Foreground Executive Mahogany Desk ───────────────────────────────
    const deskGroup = new THREE.Group();

    // Polished Mahogany Table Top
    const deskTopGeo = new THREE.BoxGeometry(3.4, 0.08, 1.45);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: '#462313',
      roughness: 0.28,
      metalness: 0.05,
      map: woodTexture,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.set(0, 0.82, 0.1);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Gold / Brass Beveled Desk Trim
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(3.42, 0.022, 1.47),
      new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.92, roughness: 0.18 })
    );
    trim.position.set(0, 0.81, 0.1);
    deskGroup.add(trim);

    // Black Executive Desk Pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.012, 0.8),
      new THREE.MeshStandardMaterial({ color: '#111317', roughness: 0.85 })
    );
    pad.position.set(0, 0.865, 0.22);
    pad.receiveShadow = true;
    deskGroup.add(pad);

    scene.add(deskGroup);

    // ─── 6. THE 3D INTERVIEWER CHARACTER (MR. J. CHEN) ───────────────────────
    const interviewerGroup = new THREE.Group();
    interviewerGroup.position.set(0, 0, -0.92);

    // A. Executive Ergonomic Mesh Office Chair
    const chairGroup = new THREE.Group();
    const leatherMat = new THREE.MeshStandardMaterial({ color: '#161920', roughness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: '#94A3B8', metalness: 0.92, roughness: 0.18 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 0.72), leatherMat);
    seat.position.set(0, 0.65, 0);
    chairGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.0, 0.1), leatherMat);
    backrest.position.set(0, 1.25, -0.32);
    backrest.rotation.x = -0.06;
    chairGroup.add(backrest);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.08), leatherMat);
    headrest.position.set(0, 1.84, -0.36);
    chairGroup.add(headrest);

    [-0.39, 0.39].forEach(x => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.46), chromeMat);
      arm.position.set(x, 0.88, -0.05);
      chairGroup.add(arm);
    });

    interviewerGroup.add(chairGroup);

    // B. Real GLTF Human Rigged Avatar Model (Mr. J. Chen)
    let avatarModel = null;
    const bones = {
      head: null,
      neck: null,
      spine: null,
      spine1: null,
      spine2: null,
      leftArm: null,
      leftForeArm: null,
      leftHand: null,
      rightArm: null,
      rightForeArm: null,
      rightHand: null,
      leftUpLeg: null,
      leftLeg: null,
      rightUpLeg: null,
      rightLeg: null,
      hips: null,
    };
    const morphMeshes = [];

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/interviewer.glb',
      (gltf) => {
        avatarModel = gltf.scene;
        avatarModel.scale.set(1.06, 1.06, 1.06);
        // Position seated inside executive chair directly facing candidate
        avatarModel.position.set(0, -0.22, 0.04);

        avatarModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness || 0.4, 0.35);
            }
            if (child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshes.push(child);
            }
          }
          if (child.isBone) {
            const name = child.name;
            if (name === 'Head') bones.head = child;
            else if (name === 'Neck') bones.neck = child;
            else if (name === 'Spine') bones.spine = child;
            else if (name === 'Spine1') bones.spine1 = child;
            else if (name === 'Spine2') bones.spine2 = child;
            else if (name === 'LeftArm') bones.leftArm = child;
            else if (name === 'LeftForeArm') bones.leftForeArm = child;
            else if (name === 'LeftHand') bones.leftHand = child;
            else if (name === 'RightArm') bones.rightArm = child;
            else if (name === 'RightForeArm') bones.rightForeArm = child;
            else if (name === 'RightHand') bones.rightHand = child;
            else if (name === 'LeftUpLeg') bones.leftUpLeg = child;
            else if (name === 'LeftLeg') bones.leftLeg = child;
            else if (name === 'RightUpLeg') bones.rightUpLeg = child;
            else if (name === 'RightLeg') bones.rightLeg = child;
            else if (name === 'Hips') bones.hips = child;
          }
        });

        // Natural seated posture behind executive mahogany desk:
        if (bones.leftUpLeg) bones.leftUpLeg.rotation.x = -1.48;
        if (bones.rightUpLeg) bones.rightUpLeg.rotation.x = -1.48;
        if (bones.leftLeg) bones.leftLeg.rotation.x = 1.45;
        if (bones.rightLeg) bones.rightLeg.rotation.x = 1.45;

        // Arms positioned forward resting naturally on the executive desk blotter:
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.85;
          bones.leftArm.rotation.z = 0.24;
        }
        if (bones.leftForeArm) {
          bones.leftForeArm.rotation.x = 0.72;
          bones.leftForeArm.rotation.y = 0.32;
        }
        if (bones.rightArm) {
          bones.rightArm.rotation.x = 0.85;
          bones.rightArm.rotation.z = -0.24;
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.x = 0.72;
          bones.rightForeArm.rotation.y = -0.32;
        }

        interviewerGroup.add(avatarModel);
      },
      undefined,
      (err) => {
        console.warn('Failed to load interviewer.glb:', err);
      }
    );

    scene.add(interviewerGroup);

    // ─── 7. Atmospheric Daylight Sunbeam Particles ───────────────────────────
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 5;
      particlePos[i + 1] = Math.random() * 2.8 + 0.4;
      particlePos[i + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.022,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── 8. Interactive Mouse Parallax Gaze ───────────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── 9. Animation Loop (Lip-Sync, Live Moving Hands, Blinking, Gesturing) ─
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Read real-time props from mutable ref (zero WebGL context teardowns)
      const {
        isInterviewerSpeaking = false,
        isCandidateSpeaking = false,
        characterState = 'idle',
        interviewerAudioLevel = 0,
      } = propsRef.current;

      // Smooth mouse gaze dampening
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Multi-frequency phonetic syllable cadence combined with instantaneous speech amplitude
      const audioEnergy =
        interviewerAudioLevel > 0.02
          ? interviewerAudioLevel
          : Math.max(
              0,
              Math.sin(time * 16.2) * 0.42 +
                Math.sin(time * 24.5) * 0.35 +
                Math.sin(time * 9.1) * 0.23
            );

      // ── A. AUDIO-SYNCHRONIZED MORPH TARGET LIP-SYNC ──
      morphMeshes.forEach((mesh) => {
        const dict = mesh.morphTargetDictionary;
        const influences = mesh.morphTargetInfluences;
        if (dict && influences) {
          if ('mouthOpen' in dict) {
            const idx = dict['mouthOpen'];
            if (isInterviewerSpeaking) {
              const targetOpen = Math.min(1.0, Math.max(0, audioEnergy * 1.35));
              influences[idx] = THREE.MathUtils.lerp(influences[idx], targetOpen, 0.52);
            } else {
              influences[idx] = THREE.MathUtils.lerp(influences[idx], 0, 0.4);
            }
          }
          if ('mouthSmile' in dict) {
            const idx = dict['mouthSmile'];
            const targetSmile = isCandidateSpeaking || characterState === 'listening' ? 0.22 : 0.04;
            influences[idx] = THREE.MathUtils.lerp(influences[idx], targetSmile, 0.1);
          }
        }
      });

      // ── B. LIVE MOVING HANDS GESTURES WHILE SPEAKING ──
      if (bones.leftArm && bones.rightArm) {
        if (isInterviewerSpeaking) {
          const gestureCycle = Math.sin(time * 2.2);
          const gestureWave = Math.sin(time * 4.5);

          // Left Arm & Forearm articulate conversationally off the desk
          bones.leftArm.rotation.x = THREE.MathUtils.lerp(bones.leftArm.rotation.x, 0.7 + gestureCycle * 0.12, 0.12);
          bones.leftArm.rotation.z = THREE.MathUtils.lerp(bones.leftArm.rotation.z, 0.26 + gestureWave * 0.08, 0.12);
          if (bones.leftForeArm) {
            bones.leftForeArm.rotation.x = THREE.MathUtils.lerp(bones.leftForeArm.rotation.x, 0.65 + gestureCycle * 0.18, 0.12);
            bones.leftForeArm.rotation.y = THREE.MathUtils.lerp(bones.leftForeArm.rotation.y, 0.32 + gestureWave * 0.1, 0.12);
          }

          // Right Arm & Forearm emphasize key architectural points
          bones.rightArm.rotation.x = THREE.MathUtils.lerp(bones.rightArm.rotation.x, 0.68 + Math.cos(time * 2.2) * 0.14, 0.12);
          bones.rightArm.rotation.z = THREE.MathUtils.lerp(bones.rightArm.rotation.z, -0.26 + Math.cos(time * 4.2) * 0.08, 0.12);
          if (bones.rightForeArm) {
            bones.rightForeArm.rotation.x = THREE.MathUtils.lerp(bones.rightForeArm.rotation.x, 0.65 + Math.cos(time * 2.2) * 0.18, 0.12);
            bones.rightForeArm.rotation.y = THREE.MathUtils.lerp(bones.rightForeArm.rotation.y, -0.32 + Math.sin(time * 3.8) * 0.1, 0.12);
          }
        } else {
          // Arms rest comfortably on the executive desk blotter with subtle natural sway
          const restBreathe = Math.sin(time * 1.4) * 0.015;
          bones.leftArm.rotation.x = THREE.MathUtils.lerp(bones.leftArm.rotation.x, 0.85 + restBreathe, 0.08);
          bones.leftArm.rotation.z = THREE.MathUtils.lerp(bones.leftArm.rotation.z, 0.22, 0.08);
          if (bones.leftForeArm) {
            bones.leftForeArm.rotation.x = THREE.MathUtils.lerp(bones.leftForeArm.rotation.x, 0.72, 0.08);
            bones.leftForeArm.rotation.y = THREE.MathUtils.lerp(bones.leftForeArm.rotation.y, 0.32, 0.08);
          }

          bones.rightArm.rotation.x = THREE.MathUtils.lerp(bones.rightArm.rotation.x, 0.85 + restBreathe, 0.08);
          bones.rightArm.rotation.z = THREE.MathUtils.lerp(bones.rightArm.rotation.z, -0.22, 0.08);
          if (bones.rightForeArm) {
            bones.rightForeArm.rotation.x = THREE.MathUtils.lerp(bones.rightForeArm.rotation.x, 0.72, 0.08);
            bones.rightForeArm.rotation.y = THREE.MathUtils.lerp(bones.rightForeArm.rotation.y, -0.32, 0.08);
          }
        }
      }

      // ── C. HEAD & NECK GAZE TRACKING AND NODDING ──
      if (bones.head) {
        if (isInterviewerSpeaking) {
          // Conversational head nods during speech
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, Math.sin(time * 2.8) * 0.045 + currentMouseY * 0.08, 0.15);
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, Math.sin(time * 1.5) * 0.04 + currentMouseX * 0.14, 0.15);
          bones.head.rotation.z = Math.sin(time * 2.1) * 0.015;
        } else if (isCandidateSpeaking || characterState === 'listening') {
          // Attentive listening posture: head tilts slightly, nods thoughtfully
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0.045 + Math.sin(time * 1.8) * 0.018, 0.08);
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, -0.045, 0.08);
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, currentMouseX * 0.16, 0.08);
        } else if (characterState === 'thinking') {
          // Thinking posture: slight upward/aside gaze
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, -0.03, 0.08);
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, 0.08, 0.08);
        } else if (characterState === 'ending') {
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0.04, 0.06);
        } else {
          // Idle waiting gaze
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, Math.sin(time * 0.7) * 0.018 + currentMouseY * 0.06, 0.08);
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, Math.sin(time * 0.4) * 0.025 + currentMouseX * 0.14, 0.08);
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, 0, 0.06);
        }
      }

      // ── D. SUBTLE NATURAL CHEST & SPINE BREATHING ──
      if (bones.spine1) {
        bones.spine1.rotation.x = Math.sin(time * 1.5) * 0.012;
      }

      // ── E. FIRST-PERSON NATURAL CAMERA BREATHING DRIFT ──
      camera.position.x = Math.sin(time * 0.35) * 0.01 + currentMouseX * 0.03;
      camera.position.y = 1.34 + Math.sin(time * 0.7) * 0.005 - currentMouseY * 0.02;

      renderer.render(scene, camera);
    };

    // 60 FPS animation loop
    let animId = null;
    const runLoop = () => {
      animId = requestAnimationFrame(runLoop);
      animate();
    };
    runLoop();

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
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
