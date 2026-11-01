
const API_URL = "https://estatehub-backend-mmms.onrender.com/api/properties";

export function normalizeProperty(property) {
  return {
    ...property,
    id: property._id || property.id,
    name: property.title || property.name || "Untitled Property",
    type: property.listingType || property.type || "For Sale",
    category: property.propertyType || property.category || "House",
    beds: Number(property.bedrooms ?? property.beds ?? 0),
    baths: Number(property.bathrooms ?? property.baths ?? 0),
    area: Number(property.area ?? 0),
    image:
      property.images?.find(
        (image) => typeof image === "string" && image.trim()
      ) ||
      property.image ||
      "",
  };
}

export async function getProperties(signal) {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }

  const result = await response.json();

  const records = Array.isArray(result)
    ? result
    : result.properties || result.data || [];

  return records.map(normalizeProperty);
}

export async function getPropertyById(id, signal) {
  const response = await fetch(`${API_URL}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Property not found: ${response.status}`);
  }

  const result = await response.json();

  return normalizeProperty(result.property || result.data || result);
}

export function formatPrice(price, listingType) {
  const amount = Number(price) || 0;

  if (listingType === "For Rent") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} Lakh`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}
