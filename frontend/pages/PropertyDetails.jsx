import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Mail,
  AlertCircle,
} from "lucide-react";
import { getPropertyById, formatPrice } from "../services/PropertyService";
import Footer from "../components/Footer";

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

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

  const title = property.title || property.name || "Property";
  const listingType = property.listingType || property.type || "For Sale";
  const propertyType = property.propertyType || property.category || "Property";
  const status = property.status || "Available";

  const isAvailable = status === "Available";
  const isSold = status === "Sold";
  const isRented = status === "Rented";

  const images = [
    ...(property.images || []),
    ...(property.image ? [property.image] : []),
  ].filter((image, index, all) => image && all.indexOf(image) === index);

  const mainImage = images[0];

  function handleContact() {
    if (status !== "Available") {
      toast.info("This property is no longer available.");
      return;
    }

    setContactOpen(true);
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
          ...enquiry,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit enquiry.");
      }

      toast.success("Your enquiry has been submitted successfully!");

      setEnquiry({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setContactOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const statusStyles = {
    Available: "bg-emerald-100 text-emerald-800",
    Sold: "bg-red-100 text-red-700",
    Rented: "bg-blue-100 text-blue-700",
  };

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
                alt={title}
                className={`h-full w-full object-cover ${
                  !isAvailable ? "grayscale-[30%]" : ""
                }`}
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
                  alt={`${title} view ${index + 2}`}
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
                {listingType}
              </span>

              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700">
                {propertyType}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  statusStyles[status] || "bg-stone-100 text-stone-700"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-stone-900 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-stone-600">
              <MapPin size={18} />
              {property.location || "Location not specified"}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
              <div>
                <p className="flex items-center gap-2 text-sm text-stone-500">
                  <BedDouble size={16} /> Bedrooms
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {property.bedrooms ?? property.beds ?? 0}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-stone-500">
                  <Bath size={16} /> Bathrooms
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {property.bathrooms ?? property.baths ?? 0}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-stone-500">
                  <Ruler size={16} /> Area
                </p>
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
                {property.description ||
                  "No description is available for this property yet."}
              </p>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              {listingType === "For Rent" ? "Monthly rent" : "Property price"}
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {formatPrice(property.price, listingType)}
              {listingType === "For Rent" && (
                <span className="text-sm font-normal text-stone-500">/mo</span>
              )}
            </p>

            <div className="mt-6 border-t border-stone-100 pt-5">
              {isAvailable ? (
                <>
                  {!contactOpen ? (
                    <>
                      <h2 className="text-lg font-bold text-stone-900">
                        Interested in this property?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Send an enquiry to the property owner and get more
                        information.
                      </p>

                      <button
                        type="button"
                        onClick={handleContact}
                        className="mt-5 w-full rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
                      >
                        Contact Owner
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-stone-900">
                          Property Enquiry
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">
                          Fill in your details and the owner can contact you.
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={enquiry.name}
                          onChange={(e) =>
                            setEnquiry({ ...enquiry, name: e.target.value })
                          }
                          placeholder="Enter your name"
                          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={enquiry.email}
                          onChange={(e) =>
                            setEnquiry({ ...enquiry, email: e.target.value })
                          }
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={15}
                          value={enquiry.phone}
                          onChange={(e) =>
                            setEnquiry({ ...enquiry, phone: e.target.value })
                          }
                          placeholder="Enter your phone number"
                          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                          Message
                        </label>
                        <textarea
                          required
                          maxLength={1000}
                          rows={4}
                          value={enquiry.message}
                          onChange={(e) =>
                            setEnquiry({ ...enquiry, message: e.target.value })
                          }
                          placeholder="I'm interested in this property..."
                          className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Submitting..." : "Submit Enquiry"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactOpen(false)}
                        disabled={submitting}
                        className="w-full rounded-lg border border-stone-300 px-5 py-2.5 font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="rounded-xl bg-stone-50 p-4">
                  <h2 className="font-bold text-stone-800">
                    {isSold ? "Property Sold" : "Property Rented"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    This property is no longer available for enquiries.
                  </p>

                  <Link
                    to="/properties"
                    className="mt-4 block text-center font-semibold text-emerald-800 hover:text-emerald-600"
                  >
                    Explore Other Properties →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
