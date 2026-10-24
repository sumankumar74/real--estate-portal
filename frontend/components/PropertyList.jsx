
import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties = [],
  loading = false,
  error = "",
  savedIds = [],
  onToggleSave,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 6, 7, 8].slice(0, 3).map((item) => (
          <div
            key={item}
            className="h-96 animate-pulse rounded-2xl bg-stone-200"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-red-800">
          Unable to load properties
        </h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <p className="mt-2 text-sm text-stone-600">
          Please check that your backend server is running and try again.
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
        <div className="text-5xl text-emerald-800" aria-hidden="true">⌂</div>
        <h3 className="mt-4 text-xl font-bold text-stone-900">
          No properties found
        </h3>
        <p className="mt-2 text-stone-500">
          Try changing your search or filters to see more properties.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isSaved={savedIds.includes(property.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
