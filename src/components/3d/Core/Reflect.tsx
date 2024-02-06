"use client";

import * as THREE from "three";
import React, {
  forwardRef,
  useRef,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
} from "react";
import { invalidate, ThreeEvent } from "@react-three/fiber";

interface ReflectProps {
  children: React.ReactNode;
  start?: [number, number, number];
  end?: [number, number, number];
  bounce?: number;
  far?: number;
  [propName: string]: any;
}

interface RayEvent extends Partial<ThreeEvent<MouseEvent>> {
  api: ReflectApi;
  object: THREE.Object3D;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  reflect: THREE.Vector3;
  normal?: THREE.Vector3;
  intersect: THREE.Intersection;
  intersects: THREE.Intersection[];
  stopPropagation: () => void;
  sourceEvent: MouseEvent;
}

interface ReflectApi {
  number: number;
  objects: RayMesh[];
  hits: Map<string, any>;
  start: THREE.Vector3;
  end: THREE.Vector3;
  raycaster: THREE.Raycaster;
  positions: Float32Array;
  setRay: (
    start: [number, number, number],
    end: [number, number, number]
  ) => void;
  update: () => number;
}

interface RayMesh extends THREE.Object3D {
  onRayOver?: (event: RayEvent) => void;
  onRayOut?: (event: RayEvent) => void;
  onRayMove?: (event: RayEvent) => void;
  direction?: THREE.Vector3;
  reflect?: THREE.Vector3;
}

function isRayMesh(object: THREE.Object3D): object is RayMesh {
  return (
    (object as any).isMesh &&
    ((object as any).onRayOver ||
      (object as any).onRayOut ||
      (object as any).onRayMove)
  );
}

function createEvent(api: any, hit: any, intersect: any, intersects: any): any {
  return {
    api,
    object: intersect.object,
    position: intersect.point,
    direction: intersect.direction,
    reflect: intersect.reflect,
    normal: intersect.face?.normal,
    intersect,
    intersects,
    stopPropagation: () => (hit.stopped = true),
  };
}

export const Reflect = forwardRef<ReflectApi, ReflectProps>(
  (
    {
      children,
      start: _start = [0, 0, 0],
      end: _end = [0, 0, 0],
      bounce = 10,
      far = 100,
      ...props
    },
    fRef
  ) => {
    const adjustedBounce = (bounce || 1) + 1;

    const scene = useRef<THREE.Group>(null);
    const vStart = new THREE.Vector3();
    const vEnd = new THREE.Vector3();
    const vDir = new THREE.Vector3();
    const vPos = new THREE.Vector3();

    let intersect: any | undefined;
    let intersects: THREE.Intersection[] = [];

    const api: ReflectApi = useMemo(
      () => ({
        number: 0,
        objects: [],
        hits: new Map(),
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        raycaster: new THREE.Raycaster(),
        positions: new Float32Array(
          Array.from({ length: (adjustedBounce + 10) * 3 }, () => 0)
        ),
        setRay: (_start = [0, 0, 0], _end = [0, 0, 0]) => {
          api.start.set(..._start);
          api.end.set(..._end);
        },
        update: () => {
          api.number = 0;
          intersects = [];

          vStart.copy(api.start);
          vEnd.copy(api.end);
          vDir.subVectors(vEnd, vStart).normalize();
          vStart.toArray(api.positions, api.number++ * 3);

          while (true) {
            api.raycaster.set(vStart, vDir);
            intersect = api.raycaster.intersectObjects(api.objects, false)[0];
            if (api.number < adjustedBounce && intersect && intersect.face) {
              intersects.push(intersect);
              intersect.direction = vDir.clone();
              intersect.point.toArray(api.positions, api.number++ * 3);
              vDir.reflect(
                intersect.object
                  .localToWorld(intersect.face.normal)
                  .sub(intersect.object.getWorldPosition(vPos))
                  .normalize()
              );
              intersect.reflect = vDir.clone();
              vStart.copy(intersect.point);
            } else {
              vEnd
                .addVectors(vStart, vDir.multiplyScalar(far))
                .toArray(api.positions, api.number++ * 3);
              break;
            }
          }
          api.number = 1;
          api.hits.forEach((hit) => {
            if (
              !intersects.find((intersect) => intersect.object.uuid === hit.key)
            ) {
              api.hits.delete(hit.key);
              if (hit.intersect.object.onRayOut) {
                invalidate();
                hit.intersect.object.onRayOut(
                  createEvent(api, hit, hit.intersect, intersects)
                );
              }
            }
          });

          for (intersect of intersects) {
            api.number++;
            if (!api.hits.has(intersect.object.uuid)) {
              const hit = {
                key: intersect.object.uuid,
                intersect,
                stopped: false,
              };
              api.hits.set(intersect.object.uuid, hit);
              if (intersect.object.onRayOver) {
                invalidate();
                intersect.object.onRayOver(
                  createEvent(api, hit, intersect, intersects)
                );
              }
            }

            const hit = api.hits.get(intersect.object.uuid);
            if (intersect.object.onRayMove) {
              invalidate();
              intersect.object.onRayMove(
                createEvent(api, hit, intersect, intersects)
              );
            }

            if (hit.stopped) break;
            if (intersect === intersects[intersects.length - 1]) api.number++;
          }
          return Math.max(2, api.number);
        },
      }),
      [adjustedBounce, far]
    );

    useLayoutEffect(() => {
      api.setRay(_start, _end);
    }, [..._start, ..._end]);

    useImperativeHandle(fRef, () => api, [api]);

    useLayoutEffect(() => {
      if (scene.current) {
        api.objects = [];
        scene.current.traverse((object) => {
          if (isRayMesh(object)) api.objects.push(object);
        });
        scene.current.updateWorldMatrix(true, true);
      }
    }, [api, scene]);

    return (
      <group ref={scene} {...props}>
        {children}
      </group>
    );
  }
);
