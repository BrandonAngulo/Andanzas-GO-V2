import { ReactNode, useEffect, useRef, useState } from 'react';

interface SolidBrandPinProps {
  className?: string;
  fallback: ReactNode;
}

export function SolidBrandPin({ className = '', fallback }: SolidBrandPinProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let animationFrame = 0;
    let releaseResources = () => {};

    const initialize = async () => {
      const THREE = await import('three');
      if (disposed || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0.08, 8);

      const pinShape = new THREE.Shape();
      pinShape.moveTo(0, -2.28);
      pinShape.bezierCurveTo(-0.56, -1.72, -1.82, -0.65, -1.87, 0.48);
      pinShape.bezierCurveTo(-1.93, 1.7, -1.02, 2.38, 0, 2.38);
      pinShape.bezierCurveTo(1.02, 2.38, 1.93, 1.7, 1.87, 0.48);
      pinShape.bezierCurveTo(1.82, -0.65, 0.56, -1.72, 0, -2.28);

      const heartHole = new THREE.Path();
      heartHole.moveTo(0, 0.25);
      heartHole.bezierCurveTo(0.74, 0.79, 0.98, 1.08, 0.98, 1.38);
      heartHole.bezierCurveTo(0.98, 1.72, 0.55, 1.91, 0, 1.49);
      heartHole.bezierCurveTo(-0.55, 1.91, -0.98, 1.72, -0.98, 1.38);
      heartHole.bezierCurveTo(-0.98, 1.08, -0.74, 0.79, 0, 0.25);
      pinShape.holes.push(heartHole);

      const depth = 0.58;
      const geometry = new THREE.ExtrudeGeometry(pinShape, {
        depth,
        steps: 1,
        curveSegments: 56,
        bevelEnabled: true,
        bevelSegments: 7,
        bevelSize: 0.095,
        bevelThickness: 0.11,
      });
      geometry.translate(0, 0, -depth / 2);
      geometry.computeVertexNormals();

      const faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x17ad72,
        roughness: 0.2,
        metalness: 0.03,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      });
      const sideMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x087052,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.72,
        clearcoatRoughness: 0.2,
      });

      const pin = new THREE.Mesh(geometry, [faceMaterial, sideMaterial]);
      pin.rotation.x = -0.11;
      scene.add(pin);

      scene.add(new THREE.HemisphereLight(0xe9fff7, 0x063e34, 2.35));

      const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
      keyLight.position.set(-3.5, 5, 6);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x65ffd0, 2.6);
      rimLight.position.set(4, 1, -4);
      scene.add(rimLight);

      const warmLight = new THREE.PointLight(0xffc24d, 1.25, 12);
      warmLight.position.set(2.8, -2, 4);
      scene.add(warmLight);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const startedAt = performance.now();

      const resize = () => {
        const width = Math.max(canvas.clientWidth, 1);
        const height = Math.max(canvas.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const render = (time: number) => {
        if (disposed) return;
        pin.rotation.y = reducedMotion.matches ? -0.35 : ((time - startedAt) / 7000) * Math.PI * 2;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(render);
      };

      renderer.render(scene, camera);
      setReady(true);
      animationFrame = requestAnimationFrame(render);

      releaseResources = () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrame);
        geometry.dispose();
        faceMaterial.dispose();
        sideMaterial.dispose();
        renderer.dispose();
      };
    };

    void initialize();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      releaseResources();
    };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className={`absolute inset-0 transition-opacity duration-300 ${ready ? 'opacity-0' : 'opacity-100'}`}>
        {fallback}
      </div>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
