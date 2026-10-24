
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../services/PropertyService";

export default function PropertyCard({
  property,
  isSaved = false,
  onToggleSave,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const image =
    property.image ||
    property.images?.find((item) => typeof item === "string" && item.trim());

  const price = formatPrice(property.price, property.type);

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-stone-100">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={property.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 text-emerald-900">
            <span className="text-6xl" aria-hidden="true">⌂</span>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow">
          {property.type || "For Sale"}
        </span>

        <button
          type="button"
          onClick={() => onToggleSave?.(property.id)}
          aria-label={isSaved ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={isSaved}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow transition hover:scale-110"
        >
          <span className={isSaved ? "text-red-500" : "text-stone-500"}>
            {isSaved ? "♥" : "♡"}
          </span>
        </button>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-emerald-800">
          {property.category || "Property"}
        </p>

        <h3 className="mt-2 line-clamp-1 text-xl font-bold text-stone-900">
          {property.name || "Untitled Property"}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
          <span aria-hidden="true">⌖</span>
          <span className="line-clamp-1">
            {property.location || "Location not specified"}
          </span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-stone-100 pb-5 text-sm text-stone-600">
          <span>🛏 {property.beds ?? property.bedrooms ?? 0} Beds</span>
          <span>🛁 {property.baths ?? property.bathrooms ?? 0} Baths</span>
          <span>▱ {property.area ?? 0} sq.ft.</span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-stone-500">
              {property.type === "For Rent" ? "Monthly rent" : "Price"}
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-900">
              {price}
              {property.type === "For Rent" && (
                <span className="text-xs font-normal text-stone-500">/mo</span>
              )}
            </p>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="rounded-lg bg-emerald-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
