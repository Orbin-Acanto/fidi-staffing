"use client";
import { useState } from "react";

import { AppSelect } from "@/component/ui/Select";
import { savedLocations } from "@/data";
import { SavedLocation } from "@/type";
import LocationHeader from "@/component/location/LocationHeader";
import LocationSummaryPanel from "@/component/location/LocationSummaryPanel";
import LocationTableView from "@/component/location/LocationTableView";
import LocationGridView from "@/component/location/LocationGridView";
import AddEditLocationModal from "@/component/location/AddEditLocationModal";
import LocationDetailModal from "@/component/location/LocationDetailModal";
import DeleteLocationModal from "@/component/location/DeleteLocationModal";

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
  const [locations, setLocations] = useState<SavedLocation[]>(savedLocations);

  const totalLocations = locations.length;
  const favoriteLocations = locations.filter((l) => l.isFavorite).length;
  const totalEvents = locations.reduce(
    (sum, l) => sum + (l.eventsCount || 0),
    0
  );
  const citiesCount = new Set(locations.map((l) => l.city)).size;

  const uniqueCities = Array.from(new Set(locations.map((l) => l.city)));

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (location.contactPerson
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false);

    const matchesFavorite =
      filterFavorite === "all" ||
      (filterFavorite === "favorite" && location.isFavorite) ||
      (filterFavorite === "regular" && !location.isFavorite);

    const matchesCity = filterCity === "all" || location.city === filterCity;

    return matchesSearch && matchesFavorite && matchesCity;
  });

  const handleToggleFavorite = (location: SavedLocation) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.id === location.id ? { ...l, isFavorite: !l.isFavorite } : l
      )
    );
  };

  const handleSaveLocation = (data: Partial<SavedLocation>) => {
    if (selectedLocation) {
      setLocations((prev) =>
        prev.map((l) => (l.id === selectedLocation.id ? { ...l, ...data } : l))
      );
    } else {
      setLocations((prev) => [
        ...prev,
        {
          ...data,
          eventsCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        } as SavedLocation,
      ]);
    }
    setShowAddEditModal(false);
    setSelectedLocation(null);
  };

  const handleDeleteLocation = () => {
    if (!selectedLocation) return;
    setLocations((prev) => prev.filter((l) => l.id !== selectedLocation.id));
    setShowDeleteModal(false);
    setSelectedLocation(null);
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
                { label: "Regular", value: "regular" },
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
      </div>

      {/* View Modes */}
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

      {/* Modals */}
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
