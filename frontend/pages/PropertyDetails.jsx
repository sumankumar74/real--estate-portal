
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPropertyById, formatPrice } from "../services/PropertyService";
import Footer from "../components/Footer";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProperty() {
      try {
        setLoading(true);
        setError("");
        const data = await getPropertyById(id, controller.signal);
        setProperty(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load this property. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProperty();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20">
        <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
        <div className="mt-6 h-8 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-stone-200" />
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl font-bold text-stone-900">
          Property Not Found
        </h1>
        <p className="mt-4 text-stone-600">
          {error || "This property may have been removed."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-emerald-900 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  const images = [
    ...(property.images || []),
    ...(property.image ? [property.image] : []),
  ].filter((image, index, all) => image && all.indexOf(image) === index);

  const mainImage = images[0];

  function handleContact() {
    const email = property.owner?.email || property.ownerEmail;

    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        `Enquiry about ${property.name}`
      )}`;
      return;
    }

    setContactOpen(true);
    toast.info("Owner contact information is not available for this listing.");
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-emerald-700"
        >
          ← Back to properties
        </Link>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-72 overflow-hidden rounded-2xl bg-stone-100 sm:h-96">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 text-6xl text-emerald-900">
                ⌂
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="h-36 overflow-hidden rounded-xl bg-stone-100 sm:h-[188px]"
              >
                <img
                  src={image}
                  alt={`${property.name} view ${index + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-900">
                {property.type || "For Sale"}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700">
                {property.category || "Property"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-stone-900 sm:text-4xl">
              {property.name}
            </h1>

            <p className="mt-3 text-stone-600">
              📍 {property.location || "Location not specified"}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
              <div>
                <p className="text-sm text-stone-500">Bedrooms</p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {property.beds ?? property.bedrooms ?? 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Bathrooms</p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {property.baths ?? property.bathrooms ?? 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Area</p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {property.area ?? 0} sq.ft.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <h2 className="text-2xl font-bold text-stone-900">
                About This Property
              </h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-stone-600">
                {property.description || "No description is available for this property yet."}
              </p>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              {property.type === "For Rent" ? "Monthly rent" : "Property price"}
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {formatPrice(property.price, property.type)}
              {property.type === "For Rent" && (
                <span className="text-sm font-normal text-stone-500">/mo</span>
              )}
            </p>

            <div className="mt-6 border-t border-stone-100 pt-5">
              <h2 className="text-lg font-bold text-stone-900">
                Interested in this property?
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Contact the owner to ask about availability and arrange a visit.
              </p>

              <button
                type="button"
                onClick={handleContact}
                className="mt-5 w-full rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Contact Owner
              </button>

              {contactOpen && (
                <p className="mt-3 text-sm text-amber-800">
                  Please check the listing details or contact the site administrator for owner information.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
