import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AgentNetwork – Award-Winning 3D Multi-Agent Topology Canvas
 * Features:
 *   - Luminous obsidian core with double Fresnel rings and refractive inner sphere
 *   - 6 orbiting satellite nodes mapped to the 6 Koggent specialized agents
 *   - Live synaptic photon streams traveling dynamically between nodes and core
 *   - Bidirectional interactivity: highlights 3D node when card is hovered
 *   - Raycaster pointer tracking & smooth camera parallax
 *   - High-performance, mobile-optimized DPR, and prefers-reduced-motion safe
 */
export default function AgentNetwork({
  className = "",
  activeAgentId = null,
  onHoverAgent = () => {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Keep a ref of activeAgentId so the Three.js rAF loop has access to latest without recreating scene
  const activeAgentRef = useRef(activeAgentId);
  useEffect(() => {
    activeAgentRef.current = activeAgentId;
  }, [activeAgentId]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      return;
    }

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.2);

    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 4.5, 25);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.2, 25);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Core: Obsidian High-Gloss Sphere
    const coreGeo = new THREE.SphereGeometry(0.36, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      metalness: 0.9,
      roughness: 0.12,
      emissive: 0x312e81,
      emissiveIntensity: 0.75,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Core Inner Glow Halo 1
    const halo1Geo = new THREE.RingGeometry(0.44, 0.56, 64);
    const halo1Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const halo1 = new THREE.Mesh(halo1Geo, halo1Mat);
    halo1.rotation.x = Math.PI / 2.3;
    group.add(halo1);

    // Core Halo 2 (Tilted Cyan Ring)
    const halo2Geo = new THREE.RingGeometry(0.60, 0.70, 64);
    const halo2Mat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
    halo2.rotation.x = -Math.PI / 2.8;
    halo2.rotation.y = 0.35;
    group.add(halo2);

    // 2. Orbital Guideline Rings
    const createOrbitRing = (rx, ry, tiltX, tiltZ, color, opacity) => {
      const curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      const ring = new THREE.LineLoop(geo, mat);
      ring.rotation.x = tiltX;
      ring.rotation.z = tiltZ;
      return ring;
    };

    const ring1 = createOrbitRing(2.2, 1.55, Math.PI / 3.2, 0.25, 0x818cf8, 0.3);
    const ring2 = createOrbitRing(1.7, 1.2, -Math.PI / 3.6, -0.2, 0x38bdf8, 0.25);
    const ring3 = createOrbitRing(2.5, 1.75, Math.PI / 4, -0.4, 0xa78bfa, 0.2);
    group.add(ring1);
    group.add(ring2);
    group.add(ring3);

    // 3. Stardust Particle Field (Depth Layers)
    const particleCount = isMobile ? 60 : 150;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 1.1 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      particlePositions[i] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i + 1] = r * Math.sin(phi);
      particlePositions[i + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.038,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // 4. The 6 Specialist Satellite Nodes
    const AGENTS_METADATA = [
      { id: "chat",   rx: 2.2,  ry: 1.55, tiltX: Math.PI / 3.2,  tiltZ: 0.25, speed: 0.20, color: 0x6366f1 },
      { id: "coding", rx: 1.7,  ry: 1.2,  tiltX: -Math.PI / 3.6, tiltZ: -0.2, speed: 0.26, color: 0x8b5cf6 },
      { id: "pdf",    rx: 2.4,  ry: 1.65, tiltX: Math.PI / 3.2,  tiltZ: 0.25, speed: 0.16, color: 0xf43f5e },
      { id: "vision", rx: 1.85, ry: 1.3,  tiltX: -Math.PI / 3.6, tiltZ: -0.2, speed: 0.24, color: 0x06b6d4 },
      { id: "search", rx: 2.1,  ry: 1.5,  tiltX: Math.PI / 4,    tiltZ: -0.4, speed: 0.22, color: 0x10b981 },
      { id: "ppt",    rx: 1.95, ry: 1.35, tiltX: Math.PI / 3.2,  tiltZ: 0.25, speed: 0.19, color: 0xf59e0b },
    ];

    const nodes = [];
    const lines = [];
    const photonPackets = [];

    const nodeGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const photonGeo = new THREE.SphereGeometry(0.04, 16, 16);

    AGENTS_METADATA.forEach((meta, i) => {
      const baseAngle = (i / AGENTS_METADATA.length) * Math.PI * 2 + 0.35;

      // Node mesh
      const nodeMat = new THREE.MeshStandardMaterial({
        color: meta.color,
        emissive: meta.color,
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.userData = {
        id: meta.id,
        baseAngle,
        rx: meta.rx,
        ry: meta.ry,
        tiltX: meta.tiltX,
        tiltZ: meta.tiltZ,
        speed: meta.speed,
        color: meta.color,
      };
      group.add(nodeMesh);
      nodes.push(nodeMesh);

      // Synaptic link line to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: meta.color,
        transparent: true,
        opacity: 0.4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
      lines.push({ line, node: nodeMesh, phase: i * 1.05 });

      // Luminous Photon Packet traveling along the synaptic link
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      group.add(photon);
      photonPackets.push({ photon, node: nodeMesh, offset: i * 0.33 });
    });

    // 5. Parallax & Pointer Tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e) => {
      if (isMobile) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = normX * 0.28;
      targetRotX = normY * 0.20;

      // Raycast test to see if user is hovering over 3D satellite
      pointer.x = normX;
      pointer.y = -normY;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(nodes);
      if (intersects.length > 0) {
        const hoveredId = intersects[0].object.userData.id;
        onHoverAgent(hoveredId);
      }
    };

    const handlePointerLeave = () => {
      targetRotY = 0;
      targetRotX = 0;
      onHoverAgent(null);
    };

    const parentEl = containerRef.current || canvas.parentElement;
    if (parentEl && !isMobile) {
      parentEl.addEventListener("pointermove", handlePointerMove, { passive: true });
      parentEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    // Resize Observer
    const resize = () => {
      const w = canvas.parentElement?.clientWidth || 600;
      const h = canvas.parentElement?.clientHeight || 600;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // Node positioning function
    const calculateNodePos = (data, time) => {
      const angle = data.baseAngle + time * data.speed;
      const localX = Math.cos(angle) * data.rx;
      const localY = Math.sin(angle) * data.ry;

      const cosX = Math.cos(data.tiltX);
      const sinX = Math.sin(data.tiltX);
      const cosZ = Math.cos(data.tiltZ);
      const sinZ = Math.sin(data.tiltZ);

      const zRotX = localX * cosZ - localY * sinZ;
      const zRotY = localX * sinZ + localY * cosZ;

      return {
        x: zRotX,
        y: zRotY * cosX,
        z: -zRotY * sinX,
      };
    };

    // Animation Loop
    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        t += 0.007;

        // Core pulsating respiration
        const coreScale = 1 + Math.sin(t * 2.2) * 0.05;
        core.scale.setScalar(coreScale);

        halo1.rotation.z = t * 0.12;
        halo2.rotation.z = -t * 0.14;
        particles.rotation.y = t * 0.04;

        const currentActive = activeAgentRef.current;

        // Satellite nodes & Synaptic Lines
        nodes.forEach((node, i) => {
          const pos = calculateNodePos(node.userData, t);
          node.position.set(pos.x, pos.y, pos.z);

          const isNodeActive = currentActive === node.userData.id;
          const targetScale = isNodeActive ? 1.6 : 1.0;
          node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

          if (isNodeActive) {
            node.material.emissiveIntensity = 1.4;
          } else {
            node.material.emissiveIntensity = 0.8;
          }

          // Update Synaptic Ray
          const { line, phase } = lines[i];
          const positions = new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]);
          line.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          line.geometry.attributes.position.needsUpdate = true;

          const baseOpacity = isNodeActive ? 0.8 : 0.35;
          line.material.opacity = baseOpacity + Math.sin(t * 2.5 + phase) * 0.15;

          // Animate Synaptic Photon Packet moving along the ray
          const packetData = photonPackets[i];
          const travelProgress = (Math.sin(t * 2.0 + packetData.offset) + 1) / 2; // 0 to 1
          packetData.photon.position.set(
            pos.x * travelProgress,
            pos.y * travelProgress,
            pos.z * travelProgress
          );
          packetData.photon.scale.setScalar(isNodeActive ? 1.5 : 1.0);
        });

        // Parallax Damped Lerp
        currentRotY += (targetRotY - currentRotY) * 0.06;
        currentRotX += (targetRotX - currentRotX) * 0.06;

        group.rotation.y = Math.sin(t * 0.16) * 0.08 + currentRotY;
        group.rotation.x = currentRotX;
      } else {
        nodes.forEach((node, i) => {
          const pos = calculateNodePos(node.userData, 0);
          node.position.set(pos.x, pos.y, pos.z);
          const { line } = lines[i];
          const positions = new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]);
          line.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          line.geometry.attributes.position.needsUpdate = true;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (parentEl && !isMobile) {
        parentEl.removeEventListener("pointermove", handlePointerMove);
        parentEl.removeEventListener("pointerleave", handlePointerLeave);
      }
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [onHoverAgent]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        aria-label="3D Multi-Agent Intelligence Topology Canvas"
      />
    </div>
  );
}
