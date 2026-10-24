
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());

    navigate(`/properties?${query.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-emerald-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/95 to-emerald-900/60" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28 lg:px-8">
        <div>
          <p className="mb-5 inline-block rounded-full border border-emerald-700 px-4 py-2 text-sm text-emerald-200">
            Find a place to call home
          </p>

          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Discover a Home That Fits Your <span className="text-amber-400">Life.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-emerald-100 sm:text-lg">
            Explore properties for sale and rent, compare your options, and
            find the right place for your next chapter.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Enter city, location or property name"
              className="min-w-0 flex-1 rounded-lg px-3 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-700"
            />

            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/properties?type=For Sale")}
              className="rounded-lg border border-white/30 px-5 py-3 font-medium transition hover:bg-white/10"
            >
              Explore Homes
            </button>

            <button
              onClick={() => navigate("/properties?type=For Rent")}
              className="rounded-lg border border-white/30 px-5 py-3 font-medium transition hover:bg-white/10"
            >
              Find Rentals
            </button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1100&q=85"
            alt="Modern house with a landscaped garden"
            className="h-[430px] w-full rounded-3xl object-cover shadow-2xl"
          />

          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 text-stone-900 shadow-xl">
            <p className="text-sm text-stone-500">Your next chapter starts here</p>
            <p className="mt-1 text-xl font-bold text-emerald-900">
              Find Your Dream Home
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
