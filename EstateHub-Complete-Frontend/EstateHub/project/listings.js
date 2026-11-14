const listingsContainer = document.querySelector("#my-properties-container");
const listingsStatus = document.querySelector("#listings-status");
const editSection = document.querySelector("#edit-listing-section");
const editForm = document.querySelector("#edit-listing-form");

function getProperties() {
    const savedValue = localStorage.getItem("estateHubProperties");
    const properties = savedValue ? JSON.parse(savedValue) : [];

    if (!Array.isArray(properties)) {
        throw new Error("Saved properties must be stored as a list.");
    }

    return properties;
}

function saveProperties(properties) {
    localStorage.setItem("estateHubProperties", JSON.stringify(properties));
}

function renderListings() {
    listingsContainer.replaceChildren();

    let properties;
    try {
        properties = getProperties();
    } catch (error) {
        console.error("Unable to load saved listings.", error);
        listingsStatus.textContent = "Unable to load listings from this browser.";
        return;
    }

    let propertiesChanged = false;
    properties.forEach(function(property) {
        if (!property.id) {
            property.id =
                Date.now().toString(36) + "-" +
                Math.random().toString(36).slice(2);
            propertiesChanged = true;
        }
    });
    if (propertiesChanged) {
        try {
            saveProperties(properties);
        } catch (error) {
            console.error("Unable to update saved listing IDs.", error);
            listingsStatus.textContent = "Unable to prepare saved listings.";
            return;
        }
    }

    if (properties.length === 0) {
        listingsContainer.textContent = "No listings yet. Use Sell to add a property.";
        return;
    }

    properties.forEach(function(property) {
        const card = document.createElement("article");
        card.className = "my-property-item";
        card.dataset.propertyId = property.id;

        if (property.image) {
            const image = document.createElement("img");
            image.src = property.image;
            image.alt = property.title || "Property";
            card.append(image);
        }

        const title = document.createElement("h2");
        title.textContent = property.title || "Property";

        const place = document.createElement("p");
        place.textContent = [property.location, property.state, property.country]
            .filter(Boolean)
            .join(", ");

        const status = document.createElement("span");
        status.className = "my-property-status";
        status.textContent = property.listingStatus || "Available";

        const type = document.createElement("p");
        type.className = "my-property-type";
        type.textContent = String(property.type || "Property")
            .replace(/-/g, " ")
            .replace(/\b\w/g, function(character) {
                return character.toUpperCase();
            });

        const specs = document.createElement("p");
        const bedroomText = property.beds == null ? "" : property.beds + " Beds";
        const bathroomText = property.baths == null ? "" : property.baths + " Baths";
        const areaText = property.area
            ? Number(property.area).toLocaleString("en-IN") + " Sq.ft"
            : "";
        specs.textContent = [bedroomText, bathroomText, areaText]
            .filter(Boolean)
            .join(" · ");

        const details = document.createElement("p");
        const isRent = property.listingType === "rent" ||
            property.listingType === "rental" || property.forRent === true;
        details.textContent = (isRent ? "For Rent · " : "For Sale · ") +
            "₹" + Number(property.price).toLocaleString("en-IN") +
            (isRent ? " / Month" : "");

        const actions = document.createElement("div");
        actions.className = "my-property-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-property-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";

        actions.append(editButton, deleteButton);
        card.append(title, place, status, type);
        if (specs.textContent) {
            card.append(specs);
        }
        card.append(details, actions);
        listingsContainer.append(card);
    });
}

listingsContainer.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");
    const card = event.target.closest(".my-property-item");
    if (!button || !card) {
        return;
    }

    let properties;
    try {
        properties = getProperties();
    } catch (error) {
        console.error("Unable to read saved listings.", error);
        listingsStatus.textContent = "Unable to read saved listings.";
        return;
    }

    const property = properties.find(function(item) {
        return String(item.id) === card.dataset.propertyId;
    });
    if (!property) {
        listingsStatus.textContent = "Listing not found. Refresh the page and try again.";
        renderListings();
        return;
    }

    if (button.dataset.action === "delete") {
        if (!window.confirm("Delete this property listing?")) {
            return;
        }
        try {
            saveProperties(properties.filter(function(item) {
                return String(item.id) !== card.dataset.propertyId;
            }));
        } catch (error) {
            console.error("Unable to delete listing.", error);
            listingsStatus.textContent = "Unable to delete this listing.";
            return;
        }
        renderListings();
        listingsStatus.textContent = "Listing deleted.";
        return;
    }

    editForm.dataset.propertyId = property.id;
    document.querySelector("#edit-title").value = property.title || "";
    document.querySelector("#edit-location").value = property.location || "";
    document.querySelector("#edit-country").value = property.country || "";
    document.querySelector("#edit-price").value = property.price || "";
    document.querySelector("#edit-listing-type").value =
        property.listingType === "rent" || property.listingType === "rental" ||
        property.forRent === true ? "rent" : "sale";
    document.querySelector("#edit-type").value = property.type || "house";
    document.querySelector("#edit-beds").value = property.beds ?? 0;
    document.querySelector("#edit-baths").value = property.baths ?? 0;
    document.querySelector("#edit-area").value = property.area || "";
    editSection.hidden = false;
    editSection.scrollIntoView({ behavior: "smooth" });
});

editForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const propertyId = editForm.dataset.propertyId;

    try {
        const properties = getProperties();
        const property = properties.find(function(item) {
            return String(item.id) === propertyId;
        });
        if (!property) {
            listingsStatus.textContent = "Listing not found.";
            editSection.hidden = true;
            return;
        }

        property.title = document.querySelector("#edit-title").value.trim();
        property.location =
            document.querySelector("#edit-location").value.trim();
        property.country = document.querySelector("#edit-country").value.trim();
        property.price = Number(document.querySelector("#edit-price").value);
        property.listingType =
            document.querySelector("#edit-listing-type").value;
        property.type = document.querySelector("#edit-type").value;
        property.beds = Number(document.querySelector("#edit-beds").value);
        property.baths = Number(document.querySelector("#edit-baths").value);
        property.area = Number(document.querySelector("#edit-area").value);
        saveProperties(properties);
    } catch (error) {
        console.error("Unable to save listing changes.", error);
        listingsStatus.textContent = "Unable to save listing changes.";
        return;
    }

    editSection.hidden = true;
    delete editForm.dataset.propertyId;
    renderListings();
    listingsStatus.textContent = "Listing updated.";
});

document.querySelector("#cancel-edit-listing").addEventListener("click", function() {
    editSection.hidden = true;
    delete editForm.dataset.propertyId;
});

renderListings();
