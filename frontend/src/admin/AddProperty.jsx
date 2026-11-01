
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialForm = {
  title: "",
  description: "",
  location: "",
  price: "",
  listingType: "For Sale",
  propertyType: "House",
  bedrooms: "2",
  bathrooms: "2",
  area: "",
  images: [""],
  featured: false,
};

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.map((image, i) => (i === index ? value : image)),
    }));
  };

  const addImageField = () => {
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("estatehubToken") ||
      sessionStorage.getItem("estatehubToken");

    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    const price = Number(form.price);
    const area = Number(form.area);
    const bedrooms = Number(form.bedrooms);
    const bathrooms = Number(form.bathrooms);

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(area) ||
      area <= 0
    ) {
      toast.error("Enter a valid price and property area.");
      return;
    }

    const images = form.images.map((image) => image.trim()).filter(Boolean);

    if (images.some((image) => !/^https?:\/\/\S+$/i.test(image))) {
      toast.error("Please enter valid image URLs.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://estatehub-backend-mmms.onrender.com/api/properties/admin/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price,
          area,
          bedrooms,
          bathrooms,
          images,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to add property.");
      }

      toast.success("Property added successfully!");
      setForm(initialForm);
      navigate("/admin/properties");
    } catch (error) {
      toast.error(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-semibold text-stone-700";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">
          Property Management
        </p>
        <h2 className="mt-2 text-3xl font-bold text-stone-900">
          Add New Property
        </h2>
        <p className="mt-2 text-stone-500">
          Enter the property details to create a new listing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <section>
          <h3 className="text-lg font-bold text-stone-900">
            Basic Information
          </h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Property Title *
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Luxury Villa in Dehradun"
                required
                maxLength={150}
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Description *
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={inputClass}
                placeholder="Describe the property, facilities, and nearby amenities..."
                rows={4}
                required
                maxLength={5000}
              />
            </label>

            <label className={labelClass}>
              Location *
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputClass}
                placeholder="City, area or address"
                required
              />
            </label>

            <label className={labelClass}>
              Price (₹) *
              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 7500000"
                required
              />
            </label>
          </div>
        </section>

        <section className="border-t border-stone-100 pt-7">
          <h3 className="text-lg font-bold text-stone-900">
            Property Details
          </h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <label className={labelClass}>
              Listing Type *
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className={inputClass}
              >
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </label>

            <label className={labelClass}>
              Property Type *
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className={inputClass}
              >
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </label>

            <label className={labelClass}>
              Area (sq. ft.) *
              <input
                name="area"
                type="number"
                min="1"
                value={form.area}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 1800"
                required
              />
            </label>

            <label className={labelClass}>
              Bedrooms
              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Bathrooms
              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="border-t border-stone-100 pt-7">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Property Images</h3>
            <p className="mt-1 text-sm text-stone-500">
              Add direct image URLs. You can include more than one image.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {form.images.map((image, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className={inputClass.replace("mt-2 ", "")}
                  placeholder="https://example.com/property-image.jpg"
                  aria-label={`Image URL ${index + 1}`}
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addImageField}
            className="mt-4 rounded-lg border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            + Add Another Image
          </button>
        </section>

        <section className="border-t border-stone-100 pt-7">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-amber-50 p-4">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-emerald-900"
            />
            <span>
              <span className="block font-semibold text-stone-900">
                Feature this property
              </span>
              <span className="mt-1 block text-sm text-stone-600">
                Mark this listing as featured for special placement on the
                website, if your homepage supports featured listings.
              </span>
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-stone-200 px-6 py-3 font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-950 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Property..." : "Publish Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
