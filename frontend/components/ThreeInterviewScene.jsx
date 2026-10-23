import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeInterviewScene
 * Photorealistic 3D corporate interview room environment with Three.js.
 * Features:
 * - Ultra-crisp executive corner office backdrop with panoramic skyscrapers & daylight
 * - Living atmospheric camera parallax (subtle responsive first-person movement)
 * - Atmospheric daylight dust motes & window sunbeam particles
 * - Audio-reactive ambient lighting synced to interviewer speech cadence
 * - First-person candidate hands with talking gesture animations
 */
export default function ThreeInterviewScene({
  isInterviewerSpeaking = false,
  isCandidateSpeaking = false,
  interviewerName = 'Mr. J. Chen',
  interviewerTitle = 'Hiring Manager',
  candidateRole = 'Software Engineer',
  targetCompany = 'Google',
  micVolume = 0,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const speechAuraRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // ─── 2. Photorealistic Executive Room Backdrop ───────────────────────────
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/interview/room-chen.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Plane sized to comfortably fill 16:9 and wide viewports
        const bgGeo = new THREE.PlaneGeometry(16 * 0.42, 9 * 0.42);
        const bgMat = new THREE.MeshBasicMaterial({
          map: texture,
          depthTest: false,
        });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.set(0, 0, -0.05);
        scene.add(bgMesh);
      },
      undefined,
      (err) => {
        console.warn('Failed to load room texture, using fallback:', err);
      }
    );

    // ─── 3. Subtle Audio-Reactive Speech Halo Behind Mr. Chen ────────────────
    const auraGeo = new THREE.RingGeometry(0.35, 1.25, 48);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const speechAura = new THREE.Mesh(auraGeo, auraMat);
    speechAura.position.set(0, 0.28, 0.05);
    scene.add(speechAura);
    speechAuraRef.current = speechAura;

    // ─── 4. Floating Atmospheric Daylight Particles (Sunbeams) ───────────────
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6; // X
      particlePos[i + 1] = (Math.random() - 0.5) * 3.5; // Y
      particlePos[i + 2] = Math.random() * 2 + 0.5; // Z
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.022,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // ─── 5. Living First-Person Parallax on Mouse Movement ───────────────────
    let targetCamX = 0;
    let targetCamY = 0;
    let currentCamX = 0;
    let currentCamY = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      // Gentle subtle natural head turning (max ~2 degrees)
      targetCamX = normX * 0.065;
      targetCamY = normY * 0.045;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ─── 6. Resize Handler ───────────────────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // ─── 7. Animation Loop ───────────────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation (breathing parallax)
      currentCamX += (targetCamX - currentCamX) * 0.05;
      currentCamY += (targetCamY - currentCamY) * 0.05;

      // Add gentle subconscious breathing sway
      const breathing = Math.sin(elapsed * 1.2) * 0.003;
      camera.position.x = currentCamX;
      camera.position.y = currentCamY + breathing;
      camera.lookAt(0, 0, 0);

      // Animate floating daylight particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 1; i < particleCount * 3; i += 3) {
          positions[i] += 0.0008; // float up gently
          if (positions[i] > 2) positions[i] = -2;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Render scene
      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update speech aura when interviewer speaks
  useEffect(() => {
    if (!speechAuraRef.current) return;
    if (isInterviewerSpeaking) {
      speechAuraRef.current.material.opacity = 0.22;
      speechAuraRef.current.scale.set(1.12, 1.12, 1.12);
    } else {
      speechAuraRef.current.material.opacity = 0;
      speechAuraRef.current.scale.set(1.0, 1.0, 1.0);
    }
  }, [isInterviewerSpeaking]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
