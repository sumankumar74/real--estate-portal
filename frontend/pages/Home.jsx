
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Hero from "../components/Hero";
import SearchFilters from "../components/SearchFilters";
import PropertyList from "../components/PropertyList";
import Footer from "../components/Footer";
import { getProperties } from "../services/PropertyService";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [listingType, setListingType] = useState(searchParams.get("type") || "All");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("estatehub-favourites") || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProperties() {
      try {
        setLoading(true);
        setError("");
        const data = await getProperties(controller.signal);
        setProperties(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not connect to the property server.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProperties();
    return () => controller.abort();
  }, []);

  function toggleSave(id) {
    setSavedIds((current) => {
      const updated = current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id];

      localStorage.setItem("estatehub-favourites", JSON.stringify(updated));
      toast.success(
        current.includes(id) ? "Removed from favourites" : "Added to favourites"
      );

      return updated;
    });
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const text = `${property.name} ${property.location} ${property.description || ""}`.toLowerCase();

      const matchesSearch = text.includes(search.trim().toLowerCase());
      const matchesType = listingType === "All" || property.type === listingType;
      const matchesCategory = category === "All" || property.category === category;
      const price = Number(property.price) || 0;

      let matchesPrice = true;

      if (priceRange === "under-5000000") matchesPrice = price < 5000000;
      if (priceRange === "5000000-10000000") {
        matchesPrice = price >= 5000000 && price <= 10000000;
      }
      if (priceRange === "above-10000000") matchesPrice = price > 10000000;

      return matchesSearch && matchesType && matchesCategory && matchesPrice;
    });
  }, [properties, search, listingType, category, priceRange]);

  function resetFilters() {
    setSearch("");
    setListingType("All");
    setCategory("All");
    setPriceRange("All");
  }

  return (
    <>
      <Hero />

      <section id="properties" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">
            Find your place
          </p>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Explore Properties
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">
            Browse available homes, apartments, villas, and other properties.
          </p>
        </div>

        <SearchFilters
          search={search}
          setSearch={setSearch}
          listingType={listingType}
          setListingType={setListingType}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onReset={resetFilters}
        />

        <div className="mb-6 mt-8 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-stone-900">
            Available Properties
          </h3>
          <span className="text-sm text-stone-500">
            {filteredProperties.length} found
          </span>
        </div>

        <PropertyList
          properties={filteredProperties}
          loading={loading}
          error={error}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
      </section>

      <section id="about" className="bg-stone-100 px-5 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">
              About EstateHub
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-900">
              A simpler way to find your next home.
            </h2>
          </div>
          <p className="text-base leading-7 text-stone-600">
            EstateHub brings property listings together in one place. Search
            by location, compare prices, save your favourite properties, and
            explore details before contacting an owner.
          </p>
        </div>
      </section>

      <section className="bg-emerald-900 px-5 py-14 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to find your next home?</h2>
        <p className="mx-auto mt-3 max-w-xl text-emerald-100">
          Start exploring properties and discover a place that feels right for you.
        </p>
        <button
          type="button"
          onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-6 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-300"
        >
          Browse Properties
        </button>
      </section>

      <Footer />
    </>
  );
}
