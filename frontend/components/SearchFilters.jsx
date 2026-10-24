
export default function SearchFilters({
  search = "",
  setSearch,
  listingType = "All",
  setListingType,
  category = "All",
  setCategory,
  priceRange = "All",
  setPriceRange,
  onReset,
}) {
  const fieldClass =
    "w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="property-search"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Search
          </label>
          <input
            id="property-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or location"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="listing-type"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Listing Type
          </label>
          <select
            id="listing-type"
            value={listingType}
            onChange={(event) => setListingType(event.target.value)}
            className={fieldClass}
          >
            <option value="All">Buy & Rent</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="property-category"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Property Type
          </label>
          <select
            id="property-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={fieldClass}
          >
            <option value="All">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price-range"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Price Range
          </label>
          <select
            id="price-range"
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
            className={fieldClass}
          >
            <option value="All">Any Price</option>
            <option value="under-5000000">Under ₹50 Lakh</option>
            <option value="5000000-10000000">₹50 Lakh – ₹1 Crore</option>
            <option value="above-10000000">Above ₹1 Crore</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
