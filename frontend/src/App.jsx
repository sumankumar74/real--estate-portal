
import { useState } from "react";

const properties = [
  {
    id: 1,
    name: "The Glasshouse Residence",
    location: "Rajpur Road, Dehradun",
    price: 18500000,
    type: "For Sale",
    category: "Villa",
    beds: 4,
    baths: 4,
    area: 3200,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    featured: true,
  },
  {
    id: 2,
    name: "The Urban Collection",
    location: "Golf Course Road, Gurugram",
    price: 45000,
    type: "For Rent",
    category: "Apartment",
    beds: 3,
    baths: 2,
    area: 1850,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 3,
    name: "Whispering Pines Estate",
    location: "Mussoorie Road, Dehradun",
    price: 24500000,
    type: "For Sale",
    category: "Villa",
    beds: 5,
    baths: 5,
    area: 4100,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85",
    featured: true,
  },
  {
    id: 4,
    name: "The Minimalist Residence",
    location: "Vasant Kunj, New Delhi",
    price: 12500000,
    type: "For Sale",
    category: "Apartment",
    beds: 3,
    baths: 2,
    area: 1600,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 5,
    name: "Hillside Living",
    location: "Tapovan, Rishikesh",
    price: 28000,
    type: "For Rent",
    category: "Villa",
    beds: 3,
    baths: 3,
    area: 2100,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 6,
    name: "The Courtyard House",
    location: "Clement Town, Dehradun",
    price: 11200000,
    type: "For Sale",
    category: "House",
    beds: 4,
    baths: 3,
    area: 2600,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
];

const categories = [
  { name: "Apartments", count: "City living", icon: "▦" },
  { name: "Independent Houses", count: "Room to grow", icon: "⌂" },
  { name: "Luxury Villas", count: "Exceptional living", icon: "◇" },
  { name: "Rental Homes", count: "Move in with ease", icon: "↗" },
];

function formatPrice(price, type) {
  if (type === "For Rent") {
    return `₹${price.toLocaleString("en-IN")}`;
  }

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} Cr`;
  }

  return `₹${(price / 100000).toFixed(0)} Lakh`;
}

function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5">
      <div className="relative h-60 overflow-hidden sm:h-64">
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

        <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-2 text-xs font-semibold text-stone-800">
          {property.type}
        </span>

        {property.featured && (
          <span className="absolute bottom-4 left-4 rounded-md bg-emerald-800 px-3 py-2 text-xs font-semibold text-white">
            Featured property
          </span>
        )}

        <button
          onClick={() => setSaved(!saved)}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition ${
            saved ? "text-rose-600" : "text-stone-700 hover:text-rose-600"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
          {property.category}
        </p>

        <h3 className="mt-2 text-lg font-semibold tracking-tight text-stone-900">
          {property.name}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
          <span className="text-emerald-800">⌖</span>
          {property.location}
        </p>

        <div className="mt-5 flex items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight text-emerald-900">
            {formatPrice(property.price, property.type)}
          </p>
          {property.type === "For Rent" && (
            <span className="text-xs text-stone-500">/ month</span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600 sm:text-sm">
          <span>{property.beds} Bedrooms</span>
          <span>{property.baths} Bathrooms</span>
          <span>{property.area.toLocaleString("en-IN")} sq.ft.</span>
        </div>

        <button
          onClick={() =>
            window.alert(
              "Property details and owner contact will be connected to the backend in the next step."
            )
          }
          className="mt-5 flex w-full items-center justify-between rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-800 transition hover:border-emerald-800 hover:bg-emerald-900 hover:text-white"
        >
          Explore property <span>↗</span>
        </button>
      </div>
    </article>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("All");
  const [category, setCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      `${property.name} ${property.location} ${property.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      listingType === "All" || property.type === listingType;

    const matchesCategory =
      category === "All" || property.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800">
      <div className="hidden bg-emerald-950 text-emerald-50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs tracking-wide lg:px-8">
          <p>Thoughtfully selected properties. Better ways to find home.</p>
          <p>Buy · Rent · Discover</p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="text-2xl font-bold tracking-tight text-emerald-950">
            estate<span className="font-light text-emerald-700">hub</span>
            <span className="text-emerald-700">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a href="#home" className="text-emerald-800">Home</a>
            <a href="#properties" className="transition hover:text-emerald-700">Buy a home</a>
            <a href="#properties" onClick={() => setListingType("For Rent")} className="transition hover:text-emerald-700">Rent a home</a>
            <a href="#collections" className="transition hover:text-emerald-700">Collections</a>
            <a href="#about" className="transition hover:text-emerald-700">About</a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => window.alert("Login and registration will be connected to the backend next.")}
              className="px-4 py-2.5 text-sm font-semibold transition hover:text-emerald-800"
            >
              Sign in
            </button>
            <button
              onClick={() => window.alert("Owner property submission will be available after backend integration.")}
              className="rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              List your property +
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="rounded-lg border border-stone-300 px-3 py-2 text-xl lg:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-stone-200 bg-[#faf9f6] px-5 py-4 lg:hidden">
            {[
              ["Home", "#home"],
              ["Buy a home", "#properties"],
              ["Rent a home", "#properties"],
              ["Collections", "#collections"],
              ["About", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => {
                  if (label === "Rent a home") setListingType("For Rent");
                  setMenuOpen(false);
                }}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-emerald-50"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => window.alert("Login will be connected in the authentication step.")}
              className="mt-2 rounded-lg bg-emerald-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Sign in / Register
            </button>
          </div>
        )}
      </header>

      <main id="home">
        <section className="relative overflow-hidden bg-[#eae8df]">
          <div className="mx-auto grid max-w-7xl lg:min-h-[590px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                A more considered way to find home
              </p>

              <h1 className="mt-6 max-w-xl text-5xl font-medium leading-[1.08] tracking-[-0.045em] text-stone-900 sm:text-6xl xl:text-7xl">
                Space to live.
                <br />
                Room to <span className="font-serif italic text-emerald-800">belong.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-stone-600">
                From city apartments to quiet hillside homes, discover a place
                that feels right for your next chapter.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#properties"
                  className="rounded-lg bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Discover properties ↗
                </a>
                <a
                  href="#collections"
                  className="rounded-lg border border-stone-400 px-6 py-3.5 text-sm font-semibold text-stone-800 transition hover:bg-white/60"
                >
                  Explore collections
                </a>
              </div>

              <div className="mt-12 grid max-w-md grid-cols-3 border-t border-stone-300 pt-6">
                <div className="pr-2">
                  <p className="text-xl font-semibold text-stone-900">Buy</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Find your own place</p>
                </div>
                <div className="border-l border-stone-300 px-4">
                  <p className="text-xl font-semibold text-stone-900">Rent</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Find your next stay</p>
                </div>
                <div className="border-l border-stone-300 pl-4">
                  <p className="text-xl font-semibold text-stone-900">Connect</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Talk to property owners</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[440px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90"
                alt="Contemporary home with warm natural finishes"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

              <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
                <div className="max-w-xs text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">Made for living</p>
                  <p className="mt-2 text-2xl font-medium sm:text-3xl">Architecture with a feeling.</p>
                </div>
                <a
                  href="#properties"
                  aria-label="Discover featured properties"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl text-emerald-950 transition hover:bg-emerald-100"
                >
                  ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 pt-6 sm:px-8 lg:-mt-9 lg:px-8 lg:pt-0">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-900/5 sm:p-7">
            <div className="mb-5 flex flex-wrap gap-2">
              {["All", "For Sale", "For Rent"].map((type) => (
                <button
                  key={type}
                  onClick={() => setListingType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    listingType === type
                      ? "bg-emerald-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {type === "All" ? "All properties" : type}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="grid gap-4 md:grid-cols-[1.5fr_1fr_auto] md:items-end"
            >
              <div>
                <label htmlFor="propertySearch" className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Location or keyword
                </label>
                <input
                  id="propertySearch"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try Dehradun, apartment, villa..."
                  className="w-full rounded-lg border border-stone-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="propertyCategory" className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Property style
                </label>
                <select
                  id="propertyCategory"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none focus:border-emerald-700"
                >
                  <option value="All">All property types</option>
                  <option value="Villa">Villas</option>
                  <option value="Apartment">Apartments</option>
                  <option value="House">Independent houses</option>
                </select>
              </div>

              <button className="rounded-lg bg-emerald-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Search properties ↗
              </button>
            </form>
          </div>
        </section>

        <section id="collections" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                Find your kind of place
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                Explore by lifestyle
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-stone-500">
              Different spaces for different plans, from your first apartment
              to a home with room for everyone.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  const nextCategory =
                    item.name === "Apartments"
                      ? "Apartment"
                      : item.name === "Independent Houses"
                        ? "House"
                        : item.name === "Luxury Villas"
                          ? "Villa"
                          : "All";

                  setCategory(nextCategory);
                  if (item.name === "Rental Homes") setListingType("For Rent");
                  document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-emerald-700 hover:bg-emerald-50/60 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9eee6] text-2xl text-emerald-900 transition group-hover:bg-emerald-900 group-hover:text-white">
                  {item.icon}
                </span>
                <h3 className="mt-5 text-sm font-semibold text-stone-900 sm:text-base">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-stone-500">{item.count}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="properties" className="border-y border-stone-200/80 bg-[#f1f0e9]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                  The property edit
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                  Homes worth discovering.
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Explore selected properties across Uttarakhand and Delhi NCR.
                </p>
              </div>

              <p className="text-sm font-medium text-stone-600">
                {filteredProperties.length} listings
              </p>
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-16 text-center">
                <h3 className="text-xl font-semibold text-stone-900">
                  No matching properties
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  Try a different location or property type.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setListingType("All");
                    setCategory("All");
                  }}
                  className="mt-5 rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Reset search
                </button>
              </div>
            )}

            <p className="mt-7 text-xs leading-5 text-stone-500">
              Demonstration listings for the current frontend preview. Prices
              and property details must be verified before being used as real listings.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative min-h-[330px] overflow-hidden rounded-2xl sm:min-h-[430px]">
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
              alt="Warm contemporary residential interior"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="lg:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
              More than a listing
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl">
              Your next chapter deserves the right address.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-stone-600">
              Save the homes you love, compare your options and connect with
              property owners. EstateHub is being built to make every step of
              your property search simpler.
            </p>

            <div className="mt-8 space-y-4">
              {[
                ["01", "Search with purpose", "Narrow down homes by location and property type."],
                ["02", "Keep your favourites", "Collect properties you want to revisit."],
                ["03", "Connect with owners", "Make enquiries about the homes you love."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4 border-b border-stone-200 pb-4">
                  <span className="pt-1 text-xs font-bold tracking-wider text-emerald-800">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl bg-emerald-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                Ready for your next move?
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-medium leading-tight sm:text-4xl">
                The place you have in mind might be closer than you think.
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-100/80">
                Start exploring homes and discover new possibilities.
              </p>
            </div>
            <a
              href="#properties"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-lg bg-[#e6e8d9] px-6 py-3.5 text-sm font-semibold text-emerald-950 transition hover:bg-white lg:self-center"
            >
              Browse properties <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer id="about" className="bg-[#171e19] text-stone-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <a href="#home" className="text-2xl font-bold tracking-tight text-white">
              estate<span className="font-light text-emerald-400">hub</span>.
            </a>
            <p className="mt-4 max-w-sm text-sm leading-7 text-stone-400">
              A considered way to discover properties, save your favourites
              and connect with owners.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Explore</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-400">
              <a href="#properties" className="hover:text-white">Buy property</a>
              <a href="#properties" onClick={() => setListingType("For Rent")} className="hover:text-white">Rent property</a>
              <a href="#collections" className="hover:text-white">Property collections</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">EstateHub</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-400">
              <a href="#about" className="hover:text-white">About us</a>
              <a href="#properties" className="hover:text-white">Browse listings</a>
              <button
                onClick={() => window.alert("Contact and owner enquiries will be connected in a later step.")}
                className="self-start hover:text-white"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-stone-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
            <p>Designed for better property discovery.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
