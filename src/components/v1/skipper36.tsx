"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface VoxelBuilderProps {
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  gridSize?: number;
  gridDivisions?: number;
  gridOpacity?: number;
  cubeSize?: number;
  cubeColor?: string;
  rollOverColor?: string;
  rollOverOpacity?: number;
  cameraPosition?: { x: number; y: number; z: number };
  enablePan?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  initialCubesCount?: number;
}

export const VoxelBuilder: React.FC<VoxelBuilderProps> = ({
  className = "h-full w-full",
  backgroundColor = "#FC0F49",
  textColor = "#7A200B",
  gridSize = 1000,
  gridDivisions = 20,
  gridOpacity = 0.3,
  cubeSize = 50,
  cubeColor = "#7A200B",
  rollOverColor = "#7A200B",
  rollOverOpacity = 0.1,
  cameraPosition = { x: 500, y: 500, z: 800 },
  enablePan = false,
  enableZoom = true,
  enableRotate = true,
  initialCubesCount = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isShiftDown = useRef(false);

  const config = useMemo(
    () => ({
      backgroundColor,
      textColor,
      gridSize,
      gridDivisions,
      gridOpacity,
      cubeSize,
      cubeColor,
      rollOverColor,
      rollOverOpacity,
      cameraPosition,
      enablePan,
      enableZoom,
      enableRotate,
      initialCubesCount,
    }),
    [
      backgroundColor,
      textColor,
      gridSize,
      gridDivisions,
      gridOpacity,
      cubeSize,
      cubeColor,
      rollOverColor,
      rollOverOpacity,
      cameraPosition,
      enablePan,
      enableZoom,
      enableRotate,
      initialCubesCount,
    ]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean old canvas
    const oldCanvas = container.querySelector("canvas");
    if (oldCanvas) container.removeChild(oldCanvas);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Roll-over helper mesh
    const rollOverGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const rollOverMat = new THREE.MeshBasicMaterial({
      color: rollOverColor,
      opacity: rollOverOpacity,
      transparent: true,
    });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMat);
    rollOverMesh.visible = false;
    scene.add(rollOverMesh);

    // Voxel cube reusable geometry & material
    const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const boxMat = new THREE.MeshLambertMaterial({ color: cubeColor });

    // Grid
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, textColor, textColor);
    (gridHelper.material as THREE.Material).opacity = gridOpacity;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // Raycasting plane
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planeGeo = new THREE.PlaneGeometry(gridSize, gridSize);
    planeGeo.rotateX(-Math.PI / 2);
    const plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 })
    );
    scene.add(plane);

    const objects: THREE.Object3D[] = [plane];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x606060, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const render = () => {
      renderer.render(scene, camera);
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = enablePan;
    controls.enableZoom = enableZoom;
    controls.enableRotate = enableRotate;
    controls.addEventListener("change", render);

    const onPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2) + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.face) {
          rollOverMesh.position.copy(hit.point).add(hit.face.normal);
          rollOverMesh.position
            .divideScalar(cubeSize)
            .floor()
            .multiplyScalar(cubeSize)
            .addScalar(cubeSize / 2);
          rollOverMesh.visible = true;
          render();
        }
      } else {
        rollOverMesh.visible = false;
        render();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2) + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        if (isShiftDown.current) {
          if (hit.object !== plane) {
            scene.remove(hit.object);
            objects.splice(objects.indexOf(hit.object), 1);
          }
        } else if (hit.face) {
          const voxel = new THREE.Mesh(boxGeo, boxMat);
          voxel.position.copy(hit.point).add(hit.face.normal);
          voxel.position
            .divideScalar(cubeSize)
            .floor()
            .multiplyScalar(cubeSize)
            .addScalar(cubeSize / 2);
          scene.add(voxel);
          objects.push(voxel);
        }
        render();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.keyCode === 16) isShiftDown.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.keyCode === 16) isShiftDown.current = false;
    };

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      render();
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    // Initial random cubes
    for (let i = 0; i < initialCubesCount; i++) {
      const voxel = new THREE.Mesh(boxGeo, boxMat);
      const rx = Math.floor(20 * Math.random()) - 10;
      const rz = Math.floor(20 * Math.random()) - 10;
      voxel.position.set(rx * cubeSize + cubeSize / 2, cubeSize / 2, rz * cubeSize + cubeSize / 2);
      scene.add(voxel);
      objects.push(voxel);
    }

    render();

    return () => {
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      // FIX: Clean up OrbitControls change listener before disposal
      controls.removeEventListener("change", render);
      controls.dispose();
      renderer.dispose();
      rollOverGeo.dispose();
      rollOverMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      planeGeo.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [config]);

  return <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }} />;
};

export const Skipper36: React.FC = () => {
  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-col justify-end overflow-hidden bg-[#FC0F49] text-[#7A200B]">
      <div className="absolute left-4 top-20 z-10 rounded-xl bg-white/10 px-3 py-2 font-mono text-sm text-[#7A200B] backdrop-blur-sm shadow-sm">
        <strong>Click</strong>: add cube | <strong>Shift + Click</strong>: remove cube
      </div>

      <div className="absolute top-0 h-full w-full">
        <VoxelBuilder />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-2/3 w-full bg-gradient-to-t from-[#FC0F49] via-[#FC0F49]/50 to-transparent" />

      <div className="z-10 mb-10 absolute bottom-6 flex w-full flex-col items-center justify-center gap-5 text-[#7A200B]">
        <div className="relative">
          <p className="text-center text-sm font-semibold tracking-tight">
            Click on the grid to start adding blocks to the canvas
          </p>
        </div>
      </div>
    </div>
  );
};

export const DemoSkipper36 = Skipper36;
export default Skipper36;
