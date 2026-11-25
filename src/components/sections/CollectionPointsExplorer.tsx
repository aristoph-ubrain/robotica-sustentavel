"use client";

import { LocateFixed, MapPin, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { CollectionPoint } from "@/lib/data/collection-points";

import type { MapPoint } from "./CollectionPointsMap";

const INITIAL_COUNT = 6;

const CollectionPointsMap = dynamic(() => import("./CollectionPointsMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder({ children }: { children?: ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center bg-fundo-suave p-5 text-center text-sm font-bold text-verde-complementar">
      {children}
    </div>
  );
}

/** Minúsculas e sem acento, para "messejana" achar "Messejana". */
const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

/** Distância em km entre dois pontos (fórmula de haversine). */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function directionsUrl(point: CollectionPoint) {
  const destination =
    point.lat !== undefined && point.lng !== undefined
      ? `${point.lat},${point.lng}`
      : `${point.address.split("·")[0]}, ${point.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

const hasCoords = (point: CollectionPoint): point is CollectionPoint & { lat: number; lng: number } =>
  point.lat !== undefined && point.lng !== undefined;

type LocationState = "idle" | "locating" | "active" | "error";

export default function CollectionPointsExplorer({
  points,
  cities,
  heading,
}: {
  points: CollectionPoint[];
  cities: string[];
  heading: ReactNode;
}) {
  const t = useTranslations("CollectionPoints");
  const format = useFormatter();
  const inputId = useId();
  const listId = useId();
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationState>("idle");
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Só carrega o Leaflet quando o mapa chega perto da tela.
  useEffect(() => {
    const element = mapWrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const term = normalize(query);

  const filtered = useMemo(() => {
    const list = points.filter((point) => {
      if (city && point.city !== city) return false;
      if (!term) return true;
      return normalize(
        [point.name, point.address, point.neighborhood, point.city].filter(Boolean).join(" "),
      ).includes(term);
    });

    if (!userPosition) return list.map((point) => ({ point, km: null as number | null }));

    return list
      .map((point) => ({ point, km: hasCoords(point) ? distanceKm(userPosition, point) : null }))
      .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
  }, [points, city, term, userPosition]);

  const mapPoints = useMemo<MapPoint[]>(
    () =>
      filtered
        .map(({ point }) => point)
        .filter(hasCoords)
        .map(({ id, name, lat, lng, isHeadquarters }) => ({ id, name, lat, lng, isHeadquarters })),
    [filtered],
  );

  const visible = term || expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const selected = points.find((point) => point.id === selectedId) ?? null;
  const missingCoords = filtered.filter(({ point }) => !hasCoords(point)).length;

  const select = useCallback((id: string) => setSelectedId(id), []);

  function selectFromList(point: CollectionPoint) {
    setSelectedId(point.id);
    if (hasCoords(point)) scrollMapIntoView();
  }

  /** No celular o mapa fica acima da lista: traz o mapa para a tela. */
  function scrollMapIntoView() {
    if (!window.matchMedia("(max-width: 63.99rem)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mapWrapperRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  function toggleLocation() {
    if (location === "active") {
      setLocation("idle");
      setUserPosition(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setLocation("error");
      return;
    }
    setLocation("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPosition({ lat: coords.latitude, lng: coords.longitude });
        setLocation("active");
        scrollMapIntoView();
      },
      () => setLocation("error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-10 shrink-0 items-center rounded-pill border-[1.5px] px-3.5 text-sm font-bold transition-colors",
      active
        ? "border-verde-escuro bg-verde-escuro text-branco"
        : "border-borda-forte bg-branco text-tinta hover:border-verde-escuro",
    );

  return (
    // Mobile first: uma coluna fluida (minmax(0,1fr)) — sem ela, a faixa de
    // cidades (overflow-x) alargava a coluna e criava rolagem horizontal.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-y-4 lg:h-[760px] lg:grid-cols-[420px_minmax(0,1fr)] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:gap-x-12">
      <div className="lg:col-start-1 lg:row-start-1">{heading}</div>

      {/* Busca, "Perto de mim" e filtro por cidade */}
      <div className="lg:col-start-1 lg:row-start-2">
        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={inputId} className="block text-sm font-bold">
            {t("searchLabel")}
          </label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-tinta-suave"
              />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-controls={listId}
                autoComplete="off"
                className="h-12 w-full rounded-campo border-[1.5px] border-tinta-suave bg-branco pr-3.5 pl-10 text-[15px] placeholder:text-tinta-suave"
              />
            </div>
            <button
              type="button"
              onClick={toggleLocation}
              aria-pressed={location === "active"}
              disabled={location === "locating"}
              className={cn(
                "inline-flex h-12 shrink-0 items-center gap-1.5 rounded-campo border-2 border-verde-escuro px-3 text-sm font-bold whitespace-nowrap transition-colors disabled:opacity-60",
                location === "active" ? "bg-verde-escuro text-branco" : "bg-branco text-verde-escuro hover:bg-fundo-suave",
              )}
            >
              <LocateFixed aria-hidden="true" className="size-[18px]" />
              {location === "locating" ? t("locating") : t("nearMe")}
            </button>
          </div>
        </form>

        <div
          role="group"
          aria-label={t("filterLabel")}
          className="-mx-gutter mt-3 flex gap-2 overflow-x-auto px-gutter pb-1 md:-mx-gutter-lg md:px-gutter-lg lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          <button type="button" aria-pressed={city === null} onClick={() => { setCity(null); setExpanded(false); }} className={chip(city === null)}>
            {t("allCities")}
          </button>
          {cities.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={city === name}
              onClick={() => { setCity(name); setExpanded(false); }}
              className={chip(city === name)}
            >
              {name}
            </button>
          ))}
        </div>

        {location === "error" && (
          <p role="alert" className="mt-2 text-sm font-bold text-tinta">
            {t("locationError")}
          </p>
        )}
      </div>

      {/* Mapa: no celular entre os filtros e a lista; no desktop, coluna da direita */}
      <div
        ref={mapWrapperRef}
        className="relative isolate -mx-gutter h-[340px] overflow-hidden border-y border-borda md:-mx-gutter-lg lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mx-0 lg:h-full lg:rounded-painel lg:border"
      >
        {showMap ? (
          <CollectionPointsMap
            points={mapPoints}
            selectedId={selectedId}
            onSelect={select}
            userPosition={userPosition}
            label={t("mapLabel", { count: mapPoints.length })}
            userLabel={t("youAreHere")}
          />
        ) : (
          <MapPlaceholder>{t("mapLoading")}</MapPlaceholder>
        )}

        <p className="pointer-events-none absolute top-2.5 left-2.5 z-[1000] rounded-lg bg-branco/90 px-2 py-1 text-[11px] font-bold text-tinta-suave lg:hidden">
          {t("mapHint")}
        </p>

        {selected && (
          <div className="absolute inset-x-2.5 bottom-7 z-[1000] flex items-center gap-2.5 rounded-botao bg-branco p-3 shadow-[0_6px_20px_rgb(18_48_26/0.22)] lg:right-auto lg:bottom-8 lg:left-5 lg:w-[380px]">
            <div className="min-w-0 flex-1">
              <p className="font-display text-base leading-tight font-semibold">{selected.name}</p>
              <p className="mt-0.5 text-xs leading-snug text-tinta-suave">
                {selected.address}
                {selected.neighborhood ? ` · ${selected.neighborhood}` : ""} · {selected.city}
              </p>
            </div>
            <a
              href={directionsUrl(selected)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-toque shrink-0 items-center rounded-campo bg-verde-escuro px-3 font-display text-sm font-semibold text-branco hover:bg-verde-complementar"
            >
              {t("directions")}
            </a>
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="lg:col-start-1 lg:row-start-3 lg:-mr-2 lg:overflow-y-auto lg:pr-2">
        <p aria-live="polite" className="text-sm text-tinta-suave">
          {t("resultsCount", { count: filtered.length })}
          {userPosition && filtered.length > 0 ? ` · ${t("sortedByDistance")}` : ""}
        </p>
        {missingCoords > 0 && (
          <p className="mt-1 text-xs text-tinta-suave">{t("missingCoords", { count: missingCoords })}</p>
        )}

        {filtered.length === 0 ? (
          <p className="mt-3 rounded-cartao bg-fundo-suave p-4 text-sm">{t("empty")}</p>
        ) : (
          <ul id={listId} className="mt-3 flex flex-col gap-2.5">
            {visible.map(({ point, km }) => {
              const active = point.id === selectedId;
              return (
                <li
                  key={point.id}
                  className={cn(
                    "flex gap-3 rounded-cartao p-3.5 transition-colors",
                    active ? "border-2 border-verde-escuro bg-fundo-suave" : "border border-borda",
                  )}
                >
                  <MapPin
                    aria-hidden="true"
                    className={cn("mt-0.5 size-[22px] shrink-0", point.isHeadquarters ? "text-verde-claro" : "text-verde-escuro")}
                    strokeWidth={2}
                  />
                  <div className="min-w-0 flex-1">
                    {hasCoords(point) ? (
                      <button
                        type="button"
                        onClick={() => selectFromList(point)}
                        aria-pressed={active}
                        className="block w-full text-left font-display text-[17px] leading-tight font-semibold hover:text-verde-escuro"
                      >
                        {point.name}
                      </button>
                    ) : (
                      <p className="font-display text-[17px] leading-tight font-semibold">{point.name}</p>
                    )}
                    <p className="mt-0.5 text-[13px] leading-snug">
                      {point.address}
                      {point.neighborhood ? ` · ${point.neighborhood}` : ""} · {point.city}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <a
                        href={directionsUrl(point)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center text-sm font-bold text-verde-escuro hover:underline"
                      >
                        {t("directions")} →
                      </a>
                      {km !== null && (
                        <span className="ml-auto text-[13px] font-bold text-verde-complementar">
                          {t("distance", { km: format.number(km, { maximumFractionDigits: 1 }) })}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!term && filtered.length > INITIAL_COUNT && (
          <Button
            variant="secundario"
            fullWidth
            className="mt-3.5"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? t("showLess") : t("showAll", { count: filtered.length })}
          </Button>
        )}
      </div>
    </div>
  );
}
