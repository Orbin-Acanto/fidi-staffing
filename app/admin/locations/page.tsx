"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { AppSelect } from "@/component/ui/Select";

import LocationHeader from "@/component/location/LocationHeader";
import LocationSummaryPanel from "@/component/location/LocationSummaryPanel";
import LocationTableView from "@/component/location/LocationTableView";
import LocationGridView from "@/component/location/LocationGridView";
import AddEditLocationModal from "@/component/location/AddEditLocationModal";
import LocationDetailModal from "@/component/location/LocationDetailModal";
import DeleteLocationModal from "@/component/location/DeleteLocationModal";

import type {
  BackendLocation,
  CitiesResponse,
  ListLocationsResponse,
} from "@/type/location";
import {
  mapBackendLocationToUi,
  mapUiToCreateLocationPayload,
  mapUiToUpdateLocationPayload,
} from "@/type/location";

import type { SavedLocation } from "@/type";

async function apiGetJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

async function apiSendJson<T>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: any,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

function uiToSavedLocation(
  ui: ReturnType<typeof mapBackendLocationToUi>,
): SavedLocation {
  return {
    id: ui.id,
    venueName: ui.venueName || ui.locationName,
    label: ui.label,

    street: ui.street,
    city: ui.city,
    state: ui.state,
    zipCode: ui.zipCode,
    country: ui.country,

    contactPerson: ui.contactPerson,
    phoneNumber: ui.phoneNumber,
    contactEmail: ui.contactEmail,

    locationNotes: ui.locationNotes,

    isFavorite: ui.isFavorite,
    isActive: ui.isActive,

    createdAt: ui.createdAt,
    updatedAt: ui.updatedAt,

    eventsCount: ui.eventsCount,

    latitude: ui.latitude,
    longitude: ui.longitude,
    geofenceRadius: ui.geofenceRadius,

    locationName: ui.locationName,
  } as any;
}

function savedToUiLike(saved: SavedLocation) {
  const venueName = (saved as any).venueName ?? "";
  const locationName = (saved as any).locationName ?? venueName;

  return {
    id: saved.id,

    locationName,
    venueName,

    street: saved.street ?? "",
    city: saved.city ?? "",
    state: (saved as any).state ?? "",
    zipCode: (saved as any).zipCode ?? "",
    country: (saved as any).country ?? "United States",

    latitude: (saved as any).latitude ?? null,
    longitude: (saved as any).longitude ?? null,
    geofenceRadius: (saved as any).geofenceRadius ?? 100,

    contactPerson: (saved as any).contactPerson ?? "",
    phoneNumber: (saved as any).phoneNumber ?? "",
    contactEmail: (saved as any).contactEmail ?? "",

    locationNotes: (saved as any).locationNotes ?? "",

    isFavorite: !!saved.isFavorite,
    isActive: saved.isActive ?? true,

    createdAt: (saved as any).createdAt ?? "",
    updatedAt: (saved as any).updatedAt ?? "",

    eventsCount: saved.eventsCount ?? 0,

    label: (saved as any).label ?? "",
  };
}

export default function LocationListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFavorite, setFilterFavorite] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<SavedLocation | null>(null);

  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const uniqueCities = useMemo(() => {
    if (cities.length) return cities;
    return Array.from(new Set(locations.map((l) => l.city).filter(Boolean)));
  }, [cities, locations]);

  async function fetchCities() {
    try {
      const data = await apiGetJson<CitiesResponse>("/api/locations/cities/");
      setCities(data.cities || []);
    } catch (e: any) {
      setCities([]);
    }
  }

  async function fetchLocations(nextPage?: number) {
    const p = nextPage ?? page;

    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("page_size", String(pageSize));

    const trimmed = searchTerm.trim();
    if (trimmed) params.set("search", trimmed);

    if (filterCity !== "all") params.set("city", filterCity);

    if (filterFavorite === "favorite") params.set("is_favorite", "true");

    setIsLoading(true);
    try {
      const data = await apiGetJson<ListLocationsResponse>(
        `/api/locations/list/?${params.toString()}`,
      );

      const results = (data.results || []) as BackendLocation[];
      const mapped = results.map((b) =>
        uiToSavedLocation(mapBackendLocationToUi(b)),
      );

      setLocations(mapped);
      setTotalCount(data.count ?? mapped.length);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load locations");
      setLocations([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterCity, filterFavorite]);

  useEffect(() => {
    fetchLocations(1);
  }, [searchTerm, filterCity, filterFavorite]);

  useEffect(() => {
    fetchLocations(page);
  }, [page]);

  const totalLocations = totalCount || locations.length;
  const favoriteLocations = locations.filter((l) => l.isFavorite).length;
  const totalEvents = locations.reduce(
    (sum, l) => sum + (l.eventsCount || 0),
    0,
  );
  const citiesCount = uniqueCities.length;

  const filteredLocations = locations;

  const handleToggleFavorite = async (location: SavedLocation) => {
    try {
      await apiSendJson(
        `/api/locations/${location.id}/toggle-favorite/`,
        "POST",
      );

      setLocations((prev) =>
        prev.map((l) =>
          l.id === location.id ? { ...l, isFavorite: !l.isFavorite } : l,
        ),
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to update favorite");
    }
  };

  const handleSaveLocation = async (data: Partial<SavedLocation>) => {
    try {
      const merged = selectedLocation
        ? { ...selectedLocation, ...data }
        : (data as SavedLocation);
      const uiLike = savedToUiLike(merged);

      if (selectedLocation) {
        const payload = mapUiToUpdateLocationPayload(uiLike as any);
        await apiSendJson(
          `/api/locations/${selectedLocation.id}/update/`,
          "PATCH",
          payload,
        );
        toast.success("Location updated");
      } else {
        const payload = mapUiToCreateLocationPayload(uiLike as any);
        await apiSendJson(`/api/locations/create/`, "POST", payload);
        toast.success("Location created");
      }

      setShowAddEditModal(false);
      setSelectedLocation(null);
      await fetchLocations(1);
      await fetchCities();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save location");
    }
  };

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;

    try {
      await apiSendJson(
        `/api/locations/${selectedLocation.id}/delete/`,
        "DELETE",
      );
      toast.success("Location deleted");
      setShowDeleteModal(false);
      setSelectedLocation(null);
      await fetchLocations(1);
      await fetchCities();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete location");
    }
  };

  return (
    <div className="space-y-6">
      <LocationHeader
        onAddLocation={() => {
          setSelectedLocation(null);
          setShowAddEditModal(true);
        }}
      />

      <LocationSummaryPanel
        totalLocations={totalLocations}
        favoriteLocations={favoriteLocations}
        totalEvents={totalEvents}
        citiesCount={citiesCount}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-primary font-semibold text-gray-900">
            All Locations
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Search Locations
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by venue, address, or contact..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <AppSelect
              label="Status"
              value={filterFavorite}
              onValueChange={(value) => setFilterFavorite(value)}
              options={[
                { label: "All Locations", value: "all" },
                { label: "Favorites", value: "favorite" },
              ]}
            />
          </div>

          <div>
            <AppSelect
              label="City"
              value={filterCity}
              onValueChange={(value) => setFilterCity(value)}
              options={[
                { label: "All Cities", value: "all" },
                ...uniqueCities.map((city) => ({
                  label: city,
                  value: city,
                })),
              ]}
            />
          </div>
        </div>

        {totalCount > pageSize ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-secondary text-gray-600">
              Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= Math.ceil(totalCount / pageSize)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {viewMode === "list" ? (
        <LocationTableView
          filteredLocations={filteredLocations}
          onOpenDetail={(location) => {
            setSelectedLocation(location);
            setShowDetailModal(true);
          }}
          onOpenDelete={(location) => {
            setSelectedLocation(location);
            setShowDeleteModal(true);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <LocationGridView
          filteredLocations={filteredLocations}
          onOpenDetail={(location) => {
            setSelectedLocation(location);
            setShowDetailModal(true);
          }}
          onOpenDelete={(location) => {
            setSelectedLocation(location);
            setShowDeleteModal(true);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showDetailModal && selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLocation(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            setShowAddEditModal(true);
          }}
        />
      )}

      {showAddEditModal && (
        <AddEditLocationModal
          location={selectedLocation}
          onClose={() => {
            setShowAddEditModal(false);
            setSelectedLocation(null);
          }}
          onSave={handleSaveLocation}
        />
      )}

      {showDeleteModal && selectedLocation && (
        <DeleteLocationModal
          location={selectedLocation}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedLocation(null);
          }}
          onConfirm={handleDeleteLocation}
        />
      )}
    </div>
  );
}
