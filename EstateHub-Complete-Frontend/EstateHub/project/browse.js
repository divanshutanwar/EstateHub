/* EstateHub Buy/Rent browser. Uses the same Local Storage key as Sell/My Listings. */
const ESTATEHUB_STORAGE_KEY = "estateHubProperties";
const ESTATEHUB_DEMO_SEED_KEY = "estateHubDemoPropertiesSeeded";
const ESTATEHUB_SAMPLE_PROPERTIES = [
  { id: "sample-villa", title: "Luxury Modern Villa", location: "Delhi", country: "India", price: 8500000, listingType: "sale", type: "villa", beds: 5, baths: 2, area: 3560, image: "../image/house1.jpeg", images: ["../image/house1.jpeg"] },
  { id: "sample-apartment", title: "Premium Apartment", location: "Gurgaon", country: "India", price: 25000, listingType: "rent", type: "apartment", beds: 2, baths: 2, area: 1200, image: "../image/house2.jpeg", images: ["../image/house2.jpeg"] },
  { id: "sample-home", title: "Contemporary Family Home", location: "Chandigarh", country: "India", price: 6500000, listingType: "sale", type: "house", beds: 3, baths: 3, area: 1900, image: "../image/house3.jpeg", images: ["../image/house3.jpeg"] }
];
const ESTATEHUB_DEMO_PROPERTIES = [
  { id: "estatehub-demo-royal-heritage-villa", title: "Royal Heritage Palace Villa", description: "A statement Jaipur residence blending heritage-inspired arches and carved stone details with refined contemporary interiors, generous entertaining spaces and a landscaped private courtyard.", location: "Jaipur", city: "Jaipur", state: "Rajasthan", country: "India", price: 28000000, listingType: "sale", type: "villa", beds: 5, baths: 5, area: 4800, amenities: ["Private courtyard", "Swimming pool", "Modular kitchen", "Covered parking", "24-hour security"], listingStatus: "Available", owner: { name: "Aarav Rathore", agency: "Pink City Estates", email: "aarav@estatehub.example", phone: "+91 90000 10001" }, image: "../image/property-royal-heritage-villa.jpg", images: ["../image/property-royal-heritage-villa.jpg"] },
  { id: "estatehub-demo-skyline-glass-penthouse", title: "Skyline Glass Penthouse", description: "A light-filled Mumbai penthouse with floor-to-ceiling glazing, an open-plan living and dining area, a private terrace and sweeping city views from the upper floors.", location: "Mumbai", city: "Mumbai", state: "Maharashtra", country: "India", price: 45000000, listingType: "sale", type: "penthouse", beds: 4, baths: 4, area: 3400, amenities: ["Private terrace", "Sky lounge", "Concierge", "Covered parking", "High-speed elevators"], listingStatus: "Available", owner: { name: "Meera Desai", agency: "Harbourline Realty", email: "meera@estatehub.example", phone: "+91 90000 10002" }, image: "../image/property-glass-penthouse.jpg", images: ["../image/property-glass-penthouse.jpg"] },
  { id: "estatehub-demo-green-valley-farmhouse", title: "Green Valley Farmhouse", description: "A peaceful Chandigarh farmhouse set on landscaped grounds, with a bright family lounge, spacious bedrooms and outdoor areas suited to relaxed weekends and gatherings.", location: "Chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", price: 17500000, listingType: "sale", type: "farmhouse", beds: 4, baths: 4, area: 5200, amenities: ["Landscaped garden", "Outdoor dining", "Private well", "Staff quarters", "Gated access"], listingStatus: "Available", owner: { name: "Kabir Saini", agency: "Tricity Home Collective", email: "kabir@estatehub.example", phone: "+91 90000 10003" }, image: "../image/property-farmhouse.jpg", images: ["../image/property-farmhouse.jpg"] },
  { id: "estatehub-demo-modern-studio-apartment", title: "Modern Studio Apartment", description: "A thoughtfully planned Bengaluru studio with a flexible living-and-sleeping zone, efficient storage and a contemporary kitchen, ideal for a first-time buyer or city professional.", location: "Bengaluru", city: "Bengaluru", state: "Karnataka", country: "India", price: 3500000, listingType: "sale", type: "apartment", beds: 1, baths: 1, area: 680, amenities: ["Fitted kitchen", "Lift", "Power backup", "Fitness room", "Visitor parking"], listingStatus: "Available", owner: { name: "Nisha Rao", agency: "Bengaluru Living Co.", email: "nisha@estatehub.example", phone: "+91 90000 10004" }, image: "../image/property-studio-apartment.jpg", images: ["../image/property-studio-apartment.jpg"] },
  { id: "estatehub-demo-premium-commercial-office", title: "Premium Commercial Office", description: "A versatile Gurugram office suite in a well-connected business district, featuring an efficient open-plan floor plate, meeting space and professional building services.", location: "Gurugram", city: "Gurugram", state: "Haryana", country: "India", price: 9500000, listingType: "sale", type: "commercial", beds: null, baths: 2, area: 2450, amenities: ["Reception lobby", "Conference room", "Central air conditioning", "Backup power", "Visitor parking"], listingStatus: "Available", owner: { name: "Rohan Khanna", agency: "Northgate Commercial", email: "rohan@estatehub.example", phone: "+91 90000 10005" }, image: "../image/property-commercial-office.jpg", images: ["../image/property-commercial-office.jpg"] },
  { id: "estatehub-demo-riverside-holiday-cottage", title: "Riverside Holiday Cottage", description: "A welcoming Rishikesh retreat with warm timber finishes, peaceful river-side surroundings and comfortable spaces for family stays or a quiet weekend escape.", location: "Rishikesh", city: "Rishikesh", state: "Uttarakhand", country: "India", price: 6500000, listingType: "sale", type: "cottage", beds: 2, baths: 2, area: 1480, amenities: ["River-facing deck", "Wood-burning stove", "Garden", "Furnished interiors", "On-site parking"], listingStatus: "Available", owner: { name: "Tara Bisht", agency: "Ganga Valley Homes", email: "tara@estatehub.example", phone: "+91 90000 10006" }, image: "../image/property-riverside-cottage.jpg", images: ["../image/property-riverside-cottage.jpg"] },
  { id: "estatehub-demo-elegant-beachside-bungalow", title: "Elegant Beachside Bungalow", description: "A relaxed Goa bungalow with generous indoor-outdoor living, a shaded veranda and an easy-going coastal feel, positioned for memorable holidays and year-round living.", location: "Goa", city: "Goa", state: "Goa", country: "India", price: 32000000, listingType: "sale", type: "bungalow", beds: 4, baths: 4, area: 3600, amenities: ["Shaded veranda", "Private garden", "Plunge pool", "Furnished option", "Beach access"], listingStatus: "Available", owner: { name: "Devika Fernandes", agency: "Coast & Casa Realty", email: "devika@estatehub.example", phone: "+91 90000 10007" }, image: "../image/property-beach-bungalow.jpg", images: ["../image/property-beach-bungalow.jpg"] },
  { id: "estatehub-demo-affordable-family-house", title: "Affordable Family House", description: "A practical Lucknow family home with a comfortable living room, a functional kitchen and well-proportioned bedrooms, close to everyday shopping and local services.", location: "Lucknow", city: "Lucknow", state: "Uttar Pradesh", country: "India", price: 4800000, listingType: "sale", type: "independent-house", beds: 3, baths: 2, area: 1750, amenities: ["Front garden", "Two-wheeler parking", "Storage room", "Nearby schools", "Grocery access"], listingStatus: "Available", owner: { name: "Imran Siddiqui", agency: "Awadh Property Desk", email: "imran@estatehub.example", phone: "+91 90000 10008" }, image: "../image/property-family-house.jpg", images: ["../image/property-family-house.jpg"] },
  { id: "estatehub-demo-premium-residential-plot", title: "Premium Residential Plot", description: "A level, clearly defined residential plot in Mohali, ready for a custom home design and located within reach of established neighbourhood conveniences.", location: "Mohali", city: "Mohali", state: "Punjab", country: "India", price: 3200000, listingType: "sale", type: "plot", beds: null, baths: null, area: 3000, amenities: ["Residential zoning", "Road frontage", "Utility connections nearby", "Developed neighbourhood", "Clear approach road"], listingStatus: "Available", owner: { name: "Simran Gill", agency: "Mohali Land & Living", email: "simran@estatehub.example", phone: "+91 90000 10009" }, image: "../image/property-residential-plot.jpg", images: ["../image/property-residential-plot.jpg"] },
  { id: "estatehub-demo-luxury-furnished-rental-apartment", title: "Luxury Furnished Rental Apartment", description: "A move-in-ready Hyderabad apartment with tasteful furnishings, a bright open living area and convenient access to work hubs, dining and daily essentials.", location: "Hyderabad", city: "Hyderabad", state: "Telangana", country: "India", price: 28000, listingType: "rent", type: "apartment", beds: 2, baths: 2, area: 1260, amenities: ["Fully furnished", "Air conditioning", "Modular kitchen", "Gym access", "24-hour security"], listingStatus: "Available", owner: { name: "Vikram Reddy", agency: "Deccan Key Realty", email: "vikram@estatehub.example", phone: "+91 90000 10010" }, image: "../image/property-rental-apartment.jpg", images: ["../image/property-rental-apartment.jpg"] }
];

(function seedDemoProperties() {
  try {
    if (localStorage.getItem(ESTATEHUB_DEMO_SEED_KEY) === "true") return;

    const raw = localStorage.getItem(ESTATEHUB_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(saved)) throw new Error("Property storage is not a list.");

    const ids = new Set(saved.map(property => String(property.id || "")));
    const titles = new Set(saved.map(property => String(property.title || "").trim().toLowerCase()));
    const additions = ESTATEHUB_DEMO_PROPERTIES.filter(property => {
      const title = property.title.toLowerCase();
      if (ids.has(property.id) || titles.has(title)) return false;
      ids.add(property.id);
      titles.add(title);
      return true;
    });

    if (additions.length) {
      localStorage.setItem(ESTATEHUB_STORAGE_KEY, JSON.stringify(saved.concat(additions)));
    }
    localStorage.setItem(ESTATEHUB_DEMO_SEED_KEY, "true");
  } catch (error) {
    console.error("Unable to add EstateHub demo properties to browser storage.", error);
  }
})();

function estateHubIsRental(property) {
  return property.listingType === "rent" || property.listingType === "rental" || property.forRent === true;
}
function estateHubLoadProperties() {
  const raw = localStorage.getItem(ESTATEHUB_STORAGE_KEY);
  const saved = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(saved)) throw new Error("Property storage is not a list.");
  const ids = new Set(saved.map(p => String(p.id || "")));
  return [...ESTATEHUB_SAMPLE_PROPERTIES.filter(p => !ids.has(p.id)), ...saved];
}
function estateHubFormatPrice(property) {
  const price = Number(property.price);
  if (!Number.isFinite(price)) return "Price on request";
  return "₹" + price.toLocaleString("en-IN") + (estateHubIsRental(property) ? " / month" : "");
}
function estateHubFormatType(type) {
  return String(type || "Property").replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}
function estateHubEnsureDetailsModal() {
  if (document.querySelector("#browse-details-modal")) return;
  const modal = document.createElement("div");
  modal.id = "browse-details-modal";
  modal.className = "browse-details-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "browse-modal-title");
  modal.innerHTML = `<div class="browse-modal-panel"><button class="browse-modal-close" type="button" aria-label="Close">&times;</button><img id="browse-modal-image" alt="Property photo"><div class="browse-modal-body"><h2 id="browse-modal-title"></h2><p id="browse-modal-location"></p><h3 id="browse-modal-price"></h3><p id="browse-modal-specs"></p><p id="browse-modal-description"></p><p id="browse-modal-status"></p><p id="browse-modal-owner"></p><div><strong>Amenities</strong><ul id="browse-modal-amenities"></ul></div><div id="browse-modal-thumbnails" class="browse-modal-thumbnails"></div></div></div>`;
  document.body.append(modal);
  modal.querySelector(".browse-modal-close").addEventListener("click", () => modal.classList.remove("is-open"));
  modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("is-open"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.remove("is-open"); });
}
function estateHubShowDetails(property) {
  estateHubEnsureDetailsModal();
  const modal = document.querySelector("#browse-details-modal");
  const photos = Array.isArray(property.images) && property.images.length ? property.images : (property.image ? [property.image] : []);
  const mainImage = modal.querySelector("#browse-modal-image");
  mainImage.src = photos[0] || "";
  mainImage.hidden = !photos.length;
  modal.querySelector("#browse-modal-title").textContent = property.title || "Property";
  modal.querySelector("#browse-modal-location").textContent = [property.location, property.state, property.country].filter(Boolean).join(", ");
  modal.querySelector("#browse-modal-price").textContent = estateHubFormatPrice(property);
  const type = estateHubFormatType(property.type);
  const bedrooms = property.beds == null ? "N/A" : `${property.beds} Beds`;
  const bathrooms = property.baths == null ? "N/A" : `${property.baths} Baths`;
  modal.querySelector("#browse-modal-specs").textContent = `${type} · ${bedrooms} · ${bathrooms} · ${property.area ? Number(property.area).toLocaleString("en-IN") + " Sq.ft" : "Area not provided"}`;
  modal.querySelector("#browse-modal-description").textContent = property.description || "No additional description is available.";
  modal.querySelector("#browse-modal-status").textContent = `Status: ${property.listingStatus || "Available"}`;
  const owner = property.owner;
  modal.querySelector("#browse-modal-owner").textContent = owner && owner.name
    ? `Listed by ${owner.name}${owner.agency ? " · " + owner.agency : ""}`
    : "Listed by EstateHub";
  const amenities = modal.querySelector("#browse-modal-amenities");
  amenities.replaceChildren();
  (Array.isArray(property.amenities) ? property.amenities : []).forEach(amenity => {
    const item = document.createElement("li");
    item.textContent = amenity;
    amenities.append(item);
  });
  const thumbs = modal.querySelector("#browse-modal-thumbnails");
  thumbs.replaceChildren();
  photos.forEach(src => {
    const img = document.createElement("img"); img.src = src; img.alt = "Property thumbnail";
    img.addEventListener("click", () => { mainImage.src = src; }); thumbs.append(img);
  });
  modal.classList.add("is-open");
}
function renderBrowseProperties(kind) {
  const isRent = kind === "rent";
  const list = document.querySelector(isRent ? "#rent-property-list" : "#buy-property-list");
  const locationInput = document.querySelector(isRent ? "#rent-location" : "#buy-location");
  const typeSelect = document.querySelector(isRent ? "#rent-type" : "#buy-type");
  if (!list || !locationInput || !typeSelect) return;
  const location = locationInput.value.trim().toLowerCase();
  const type = typeSelect.value.toLowerCase();
  const minimum = Number(document.querySelector(isRent ? "#rent-min-price" : "#buy-min-price")?.value) || 0;
  const maximumInput = document.querySelector(isRent ? "#rent-max-price" : "#buy-max-price");
  const maximum = maximumInput && maximumInput.value ? Number(maximumInput.value) : Infinity;
  const sort = document.querySelector(isRent ? "#rent-sort" : "#buy-sort")?.value || "default";
  let properties;
  try { properties = estateHubLoadProperties(); }
  catch (error) { console.error("Unable to load properties", error); list.textContent = "Unable to load properties from this browser."; return; }
  const matching = properties.filter(property => {
    const place = `${property.location || ""} ${property.state || ""} ${property.country || ""}`.toLowerCase();
    const price = Number(property.price);
    return estateHubIsRental(property) === isRent &&
      place.includes(location) &&
      (!type || String(property.type || "").toLowerCase() === type) &&
      price >= minimum &&
      price <= maximum;
  });
  if (sort === "price-low") matching.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-high") matching.sort((a, b) => Number(b.price) - Number(a.price));
  list.replaceChildren();
  if (!matching.length) { const p = document.createElement("p"); p.className = "browse-empty-state"; p.textContent = isRent ? "No rental properties match your search. Try another city or property type." : "No properties for sale match your search. Try another city or property type."; list.append(p); return; }
  matching.forEach(property => {
    const card = document.createElement("article"); card.className = "browse-property-card";
    const image = document.createElement("img"); image.className = "browse-card-image"; image.src = property.image || (property.images && property.images[0]) || ""; image.alt = property.title || "Property"; image.loading = "lazy";
    if (image.src) card.append(image);
    const content = document.createElement("div"); content.className = "browse-property-info";
    const tag = document.createElement("span"); tag.className = "browse-property-tag"; tag.textContent = isRent ? "For Rent" : "For Sale";
    const category = document.createElement("span"); category.className = "browse-property-category"; category.textContent = estateHubFormatType(property.type);
    const title = document.createElement("h3"); title.textContent = property.title || "Property";
    const place = document.createElement("p"); place.textContent = [property.location, property.state, property.country].filter(Boolean).join(", ");
    const specs = document.createElement("p"); specs.className = "browse-property-specs"; specs.textContent = `${property.beds ?? "—"} Beds · ${property.baths ?? "—"} Baths · ${property.area ? Number(property.area).toLocaleString("en-IN") + " Sq.ft" : "Area N/A"}`;
    const price = document.createElement("strong"); price.className = "browse-property-price"; price.textContent = estateHubFormatPrice(property);
    const status = document.createElement("span"); status.className = "browse-property-status"; status.textContent = property.listingStatus || "Available";
    const actions = document.createElement("div"); actions.className = "browse-card-actions";
    const details = document.createElement("button"); details.type = "button"; details.textContent = "View Details"; details.addEventListener("click", () => estateHubShowDetails(property));
    const contact = document.createElement("a"); contact.href = `mailto:?subject=${encodeURIComponent("Property enquiry: " + (property.title || "EstateHub listing"))}&body=${encodeURIComponent("I am interested in " + (property.title || "this property") + " in " + (property.location || "") + ". Please contact me.")}`; contact.className = "browse-contact-link"; contact.textContent = "Enquire";
    actions.append(details, contact); content.append(tag, status, category, title, place, specs, price, actions); card.append(content); list.append(card);
  });
}
function searchBuyProperties() { renderBrowseProperties("buy"); }
function searchRentProperties() { renderBrowseProperties("rent"); }
const buyButton = document.querySelector("#buy-search-btn");
if (buyButton) { buyButton.addEventListener("click", searchBuyProperties); document.querySelector("#buy-location")?.addEventListener("keydown", e => { if (e.key === "Enter") searchBuyProperties(); }); document.querySelector("#buy-type")?.addEventListener("change", searchBuyProperties); searchBuyProperties(); }
const rentButton = document.querySelector("#rent-search-btn");
if (rentButton) { rentButton.addEventListener("click", searchRentProperties); document.querySelector("#rent-location")?.addEventListener("keydown", e => { if (e.key === "Enter") searchRentProperties(); }); document.querySelector("#rent-type")?.addEventListener("change", searchRentProperties); searchRentProperties(); }
["#buy-min-price", "#buy-max-price", "#buy-sort", "#rent-min-price", "#rent-max-price", "#rent-sort"].forEach(selector => {
  document.querySelector(selector)?.addEventListener("change", () => {
    if (buyButton && document.querySelector(selector).id.startsWith("buy-")) searchBuyProperties();
    if (rentButton && document.querySelector(selector).id.startsWith("rent-")) searchRentProperties();
  });
});
window.addEventListener("storage", event => { if (event.key === ESTATEHUB_STORAGE_KEY) { if (buyButton) searchBuyProperties(); if (rentButton) searchRentProperties(); } });
