"use client";

import "leaflet/dist/leaflet.css";

import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";

type Leaflet = typeof import("leaflet");

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isHeadquarters: boolean;
};

type CollectionPointsMapProps = {
  points: MapPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userPosition: { lat: number; lng: number } | null;
  label: string;
  userLabel: string;
};

const FORTALEZA: [number, number] = [-3.7319, -38.5267];

/** Raio da região metropolitana (Paracuru fica a ~80 km). */
const NEARBY_KM = 150;

/** Distância aproximada em km (haversine). */
function distanceKm([lat1, lng1]: [number, number], { lat: lat2, lng: lng2 }: { lat: number; lng: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const h =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function pinIcon(L: Leaflet, kind: "normal" | "sede" | "ativo") {
  const size = kind === "ativo" ? 34 : kind === "sede" ? 30 : 26;
  const className = kind === "normal" ? "pino" : `pino pino--${kind}`;
  return L.divIcon({
    className: "",
    html: `<span class="${className}"></span>`,
    iconSize: [size, size],
    // A ponta do pino (canto inferior girado) fica no ponto exato.
    iconAnchor: [size / 2, size + 2],
  });
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Mapa Leaflet + OpenStreetMap. Carregado só no cliente (next/dynamic, ssr:false)
 * e só quando a seção chega perto da tela.
 */
export default function CollectionPointsMap({
  points,
  selectedId,
  onSelect,
  userPosition,
  label,
  userLabel,
}: CollectionPointsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<Leaflet | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const userMarkerRef = useRef<Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Cria o mapa uma vez.
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    import("leaflet").then((module) => {
      const L = ((module as { default?: Leaflet }).default ?? module) as Leaflet;
      if (cancelled || !containerRef.current) return;

      const touch = window.matchMedia("(pointer: coarse)").matches;
      const map = L.map(containerRef.current, {
        center: FORTALEZA,
        zoom: 12,
        // A rolagem da página nunca fica "presa" no mapa.
        scrollWheelZoom: false,
        // No celular, um dedo rola a página; dois dedos aproximam e movem o mapa.
        dragging: !touch,
        touchZoom: true,
        // Zoom no canto direito: o esquerdo fica com a dica "Use dois dedos".
        zoomControl: false,
      });
      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      leafletRef.current = L;
      mapRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
      userMarkerRef.current = null;
    };
  }, []);

  // Marcadores: recria quando a lista filtrada muda e enquadra todos.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    const markers = markersRef.current;
    markers.forEach((marker) => marker.remove());
    markers.clear();

    for (const point of points) {
      const marker = L.marker([point.lat, point.lng], {
        icon: pinIcon(L, point.isHeadquarters ? "sede" : "normal"),
        title: point.name,
        alt: point.name,
        keyboard: true,
        riseOnHover: true,
      })
        .on("click", () => onSelectRef.current(point.id))
        .addTo(map);
      markers.set(point.id, marker);
    }

    // Enquadra a região de Fortaleza; pontos distantes (ex.: Olmix, em SP)
    // só entram no enquadramento quando são os únicos do filtro.
    const nearby = points.filter((p) => distanceKm(FORTALEZA, p) <= NEARBY_KM);
    const framed = nearby.length > 0 ? nearby : points;

    if (framed.length > 0) {
      const compact = window.matchMedia("(max-width: 47.99rem)").matches;
      map.fitBounds(L.latLngBounds(framed.map((p) => [p.lat, p.lng] as [number, number])), {
        padding: compact ? [24, 24] : [40, 40],
        maxZoom: 14,
        animate: !prefersReducedMotion(),
      });
    }
  }, [ready, points]);

  // Destaque do ponto selecionado.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    markersRef.current.forEach((marker, id) => {
      const point = points.find((p) => p.id === id);
      const active = id === selectedId;
      marker.setIcon(pinIcon(L, active ? "ativo" : point?.isHeadquarters ? "sede" : "normal"));
      marker.setZIndexOffset(active ? 1000 : 0);
    });

    const selected = selectedId ? markersRef.current.get(selectedId) : undefined;
    if (selected) {
      map.setView(selected.getLatLng(), Math.max(map.getZoom(), 14), {
        animate: !prefersReducedMotion(),
      });
    }
  }, [ready, selectedId, points]);

  // Posição do visitante ("Perto de mim").
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    if (!userPosition) return;

    userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
      icon: L.divIcon({
        className: "",
        html: '<span class="voce-aqui"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
      title: userLabel,
      alt: userLabel,
      keyboard: false,
      interactive: false,
    }).addTo(map);
  }, [ready, userPosition, userLabel]);

  return <div ref={containerRef} role="region" aria-label={label} className="size-full" />;
}
