const searchButton = document.querySelector(".search-btn");
const clearButton = document.querySelector(".clear-btn");
const locationInput = document.querySelector("#location");
const propertyType = document.querySelector("#property-type");
const minPrice = document.querySelector("#min-price");
const maxPrice = document.querySelector("#max-price");
const propertySort = document.querySelector("#property-sort");
const favouritesContainer = document.querySelector("#favourites-container");
const modal = document.querySelector("#property-modal");
const closeModalButton = document.querySelector(".close-modal");
const savedCards = new Set();
const loanAmount = document.querySelector("#loan-amount");
const interestRate = document.querySelector("#interest-rate");
const loanYears = document.querySelector("#loan-years");
const calculateEmiButton = document.querySelector("#calculate-emi");
const emiResult = document.querySelector("#emi-result");
const inquiryForm = document.querySelector("#inquiry-form");
const inquiryStatus = document.querySelector("#inquiry-status");
const inquiriesList = document.querySelector("#inquiries-list");
const inquiryStatusFilter = document.querySelector("#inquiry-status-filter");
const totalPropertiesElement = document.querySelector("#total-properties");
const totalFavouritesElement = document.querySelector("#total-favourites");
const totalInquiriesElement = document.querySelector("#total-inquiries");
const propertyContainer = document.querySelector(".property-container");
let nextPropertySortOrder = 0;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
function filterProperties() {
    const searchValue = locationInput.value.trim().toLowerCase();
    const selectedType = propertyType.value.toLowerCase();
    const minimum = Number(minPrice.value) || 0;
    const maximum = Number(maxPrice.value) || Infinity;

    propertyContainer.querySelectorAll(".property-card").forEach(function(card) {
        const propertyLocation = card
            .querySelector(".property-info p")
            .textContent.toLowerCase();
        const price = Number(card.dataset.price);
        const locationMatches = propertyLocation.includes(searchValue);
        const typeMatches = !selectedType || card.dataset.type === selectedType;
        const minimumMatches = !minimum || price >= minimum;
        const maximumMatches = !maxPrice.value || price <= maximum;

        card.hidden = !(
            locationMatches &&
            typeMatches &&
            minimumMatches &&
            maximumMatches
        );
    });

    updatePropertyCount();
}

function updatePropertyCount() {
    const cards = Array.from(
        propertyContainer.querySelectorAll(".property-card")
    );
    const visibleCards = cards.filter(function(card) {
        return !card.hidden && card.style.display !== "none";
    });
    const countElement = document.querySelector("#property-count");

    if (countElement) {
        countElement.textContent =
            "Showing " + visibleCards.length + " of " + cards.length +
            " properties";
    }
}

function sortProperties(sortType) {
    const cards = Array.from(
        propertyContainer.querySelectorAll(".property-card")
    );

    if (cards.length === 0) {
        return;
    }

    cards.forEach(function(card) {
        if (card.dataset.sortOrder === undefined) {
            card.dataset.sortOrder = String(nextPropertySortOrder++);
        }
    });

    const getPrice = function(card) {
        return Number(card.dataset.price) || 0;
    };
    const getName = function(card) {
        return card.querySelector("h3")?.textContent.trim().toLowerCase() || "";
    };

    if (sortType === "price-low") {
        cards.sort(function(a, b) {
            return getPrice(a) - getPrice(b);
        });
    } else if (sortType === "price-high") {
        cards.sort(function(a, b) {
            return getPrice(b) - getPrice(a);
        });
    } else if (sortType === "name-az") {
        cards.sort(function(a, b) {
            return getName(a).localeCompare(getName(b));
        });
    } else if (sortType === "name-za") {
        cards.sort(function(a, b) {
            return getName(b).localeCompare(getName(a));
        });
    } else {
        cards.sort(function(a, b) {
            return Number(a.dataset.sortOrder) -
                Number(b.dataset.sortOrder);
        });
    }

    cards.forEach(function(card) {
        propertyContainer.appendChild(card);
    });
}

function renderFavourites() {
    favouritesContainer.replaceChildren();

    if (savedCards.size === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No favourite properties yet.";
        favouritesContainer.append(emptyMessage);
        return;
    }

    savedCards.forEach(function(card) {
        const favouriteCard = card.cloneNode(true);
        favouriteCard.hidden = false;
        favouriteCard.querySelector(".property-actions").remove();

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove Favourite";
        removeButton.className = "remove-favourite-btn";
        removeButton.addEventListener("click", function() {
            savedCards.delete(card);

            const originalButton = card.querySelector(".save-btn");
            const icon = originalButton.querySelector("i");
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            originalButton.setAttribute("aria-pressed", "false");

            renderFavourites();
            updateDashboard();
        });

        favouriteCard.querySelector(".property-info").append(removeButton);
        favouritesContainer.append(favouriteCard);
    });
}

function closeModal() {
    modal.style.display = "none";
}

function createPropertyId() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function renderMyProperties() {
    const myPropertiesContainer =
        document.querySelector("#my-properties-container");

    if (!myPropertiesContainer) {
        return;
    }

    myPropertiesContainer.replaceChildren();

    try {
        const properties = getSavedProperties();

        if (properties.length === 0) {
            myPropertiesContainer.textContent =
                "No properties have been added in this browser yet.";
            return;
        }

        properties.forEach(function(property) {
            const item = document.createElement("div");
            item.className = "my-property-item";
            item.dataset.propertyId = property.id;

            const image = document.createElement("img");
            image.src = property.image;
            image.alt = property.title;

            const title = document.createElement("h3");
            title.textContent = property.title;

            const price = document.createElement("p");
            price.textContent =
                "₹" + Number(property.price).toLocaleString("en-IN");

            const actions = document.createElement("div");
            actions.className = "my-property-actions";

            const editButton = document.createElement("button");
            editButton.className = "edit-property-btn";
            editButton.type = "button";
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-property-btn";
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            const imageButton = document.createElement("button");
            imageButton.className = "change-image-btn";
            imageButton.type = "button";
            imageButton.textContent = "Change Picture";

            actions.append(editButton, imageButton, deleteButton);
            item.append(image, title, price, actions);
            myPropertiesContainer.append(item);
        });
    } catch (error) {
        console.error("Unable to load saved properties.", error);
        myPropertiesContainer.textContent =
            "Unable to load saved properties.";
    }
}

const myPropertiesContainer =
    document.querySelector("#my-properties-container");
if (myPropertiesContainer) {
    myPropertiesContainer.addEventListener("click", function(event) {
        const button = event.target.closest("button");
        const item = event.target.closest(".my-property-item");

        if (!button || !item) {
            return;
        }

        const propertyId = item.dataset.propertyId;
        let properties;

        try {
            properties = getSavedProperties();
        } catch (error) {
            console.error("Unable to read saved properties.", error);
            alert("Unable to load saved properties.");
            return;
        }

        const property = properties.find(function(savedProperty) {
            return String(savedProperty.id) === propertyId;
        });

        if (!property) {
            alert("Property not found.");
            return;
        }

        if (button.classList.contains("change-image-btn")) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            fileInput.addEventListener("change", function() {
                const file = fileInput.files[0];
                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {
                    alert("Please select an image file.");
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert("Please select an image smaller than 5 MB.");
                    return;
                }

                const reader = new FileReader();

                reader.onload = function() {
                    if (typeof reader.result !== "string") {
                        alert("Could not read the selected image.");
                        return;
                    }

                    try {
                        const latestProperties = getSavedProperties();
                        const latestProperty = latestProperties.find(
                            function(savedProperty) {
                                return String(savedProperty.id) === propertyId;
                            }
                        );

                        if (!latestProperty) {
                            alert("Property not found.");
                            return;
                        }

                        latestProperty.image = reader.result;
                        localStorage.setItem(
                            "estateHubProperties",
                            JSON.stringify(latestProperties)
                        );
                    } catch (error) {
                        console.error("Unable to save the property picture.", error);
                        alert("Unable to save the new property picture.");
                        return;
                    }

                    renderMyProperties();
                    refreshMainPropertyCard(latestProperty);
                    alert("Property picture updated successfully!");
                };

                reader.onerror = function() {
                    alert("Could not read the selected image.");
                };

                reader.readAsDataURL(file);
            });

            fileInput.click();
            return;
        }

        if (button.classList.contains("edit-property-btn")) {
            const editModal = document.querySelector("#edit-property-modal");
            document.querySelector("#edit-title").value = property.title;
            document.querySelector("#edit-location").value = property.location;
            document.querySelector("#edit-country").value =
                property.country || "";
            document.querySelector("#edit-price").value = property.price;
            document.querySelector("#edit-type").value = property.type;
            document.querySelector("#edit-beds").value = property.beds;
            document.querySelector("#edit-baths").value = property.baths;
            document.querySelector("#edit-area").value = property.area;
            editModal.dataset.propertyId = propertyId;
            editModal.style.display = "flex";
            return;
        }

        if (button.classList.contains("delete-property-btn")) {
            if (!confirm("Are you sure you want to delete this property?")) {
                return;
            }

            const remainingProperties = properties.filter(function(savedProperty) {
                return String(savedProperty.id) !== propertyId;
            });

            try {
                localStorage.setItem(
                    "estateHubProperties",
                    JSON.stringify(remainingProperties)
                );
            } catch (error) {
                console.error("Unable to delete property.", error);
                alert("Unable to delete the property.");
                return;
            }

            const mainCard = propertyContainer.querySelector(
                `[data-property-id="${CSS.escape(propertyId)}"]`
            );
            if (mainCard) {
                savedCards.delete(mainCard);
                comparisonCards.delete(mainCard);
                mainCard.remove();
            }

            renderMyProperties();
            renderFavourites();
            renderComparison();
            updateEstateHubStats();
            updateDashboard();
            alert("Property deleted successfully!");
        }
    });
}

const editModal = document.querySelector("#edit-property-modal");
const editForm = document.querySelector("#edit-property-form");

if (editForm && editModal) {
editForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const propertyId = editModal.dataset.propertyId;

    let properties;
    try {
        properties = getSavedProperties();
    } catch (error) {
        console.error("Unable to read saved properties.", error);
        alert("Unable to load saved properties.");
        return;
    }

    const property = properties.find(function(savedProperty) {
        return String(savedProperty.id) === propertyId;
    });

    if (!property) {
        alert("Property not found.");
        editModal.style.display = "none";
        return;
    }

    const title = document.querySelector("#edit-title").value.trim();
    const location = document.querySelector("#edit-location").value.trim();
    const country = document.querySelector("#edit-country").value.trim();
    const price = Number(document.querySelector("#edit-price").value);
    const type = document.querySelector("#edit-type").value;
    const beds = Number(document.querySelector("#edit-beds").value);
    const baths = Number(document.querySelector("#edit-baths").value);
    const area = Number(document.querySelector("#edit-area").value);

    if (
        !title ||
        !location ||
        !country ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(beds) ||
        beds < 0 ||
        !Number.isInteger(baths) ||
        baths < 0 ||
        !Number.isFinite(area) ||
        area <= 0
    ) {
        alert("Please enter valid property details.");
        return;
    }

    property.title = title;
    property.location = location;
    property.country = country;
    property.price = price;
    property.type = type;
    property.beds = beds;
    property.baths = baths;
    property.area = area;

    try {
        localStorage.setItem(
            "estateHubProperties",
            JSON.stringify(properties)
        );
    } catch (error) {
        console.error("Unable to save property changes.", error);
        alert("Unable to save property changes.");
        return;
    }

    editModal.style.display = "none";
    delete editModal.dataset.propertyId;
    renderMyProperties();
    refreshMainPropertyCard(property);
    alert("Property updated successfully!");
});

function closeEditModal() {
    editModal.style.display = "none";
    delete editModal.dataset.propertyId;
}

document.querySelector("#close-edit-modal")
    .addEventListener("click", closeEditModal);

editModal.addEventListener("click", function(event) {
    if (event.target === editModal) {
        closeEditModal();
    }
});
}

function createPropertyCard(property) {
    const card = document.createElement("div");
    card.className = "property-card";
    card.dataset.sortOrder = String(nextPropertySortOrder++);
    if (property.id) {
        card.dataset.propertyId = property.id;
    }
    card.dataset.type = property.type;
    card.dataset.price = String(property.price);

    const image = document.createElement("img");
    image.src = property.image;
    image.alt = property.title;

    const info = document.createElement("div");
    info.className = "property-info";

    const isRental = property.listingType === "rent" ||
        property.listingType === "rental" || property.forRent === true;
    const badge = document.createElement("span");
    badge.className = "property-type";
    badge.textContent = isRental ? "For Rent" : "For Sale";

    const category = document.createElement("span");
    category.className = "property-category";
    category.textContent = String(property.type || "Property")
        .replace(/-/g, " ")
        .replace(/\b\w/g, function(character) {
            return character.toUpperCase();
        });

    const heading = document.createElement("h3");
    heading.textContent = property.title;

    const location = document.createElement("p");
    const locationIcon = document.createElement("i");
    locationIcon.className = "fa-solid fa-location-dot";
    location.append(
        locationIcon,
        document.createTextNode(
            " " + [property.location, property.state, property.country]
                .filter(Boolean)
                .join(", ")
        )
    );

    const price = document.createElement("h4");
    price.textContent =
        "₹" + Number(property.price).toLocaleString("en-IN") +
        (isRental ? " / Month" : "");

    const details = document.createElement("div");
    details.className = "property-details";

    const beds = document.createElement("span");
    beds.textContent = property.beds == null
        ? "N/A"
        : property.beds + " Beds";

    const baths = document.createElement("span");
    baths.textContent = property.baths == null
        ? "N/A"
        : property.baths + " Baths";

    const area = document.createElement("span");
    area.textContent = Number(property.area).toLocaleString("en-IN") + " Sq.ft";

    details.append(beds, baths, area);

    const actions = document.createElement("div");
    actions.className = "property-actions";

    const viewButton = document.createElement("button");
    viewButton.className = "view-btn";
    viewButton.type = "button";
    viewButton.textContent = "View Details";

    const saveButton = document.createElement("button");
    saveButton.className = "save-btn";
    saveButton.type = "button";
    saveButton.setAttribute("aria-pressed", "false");

    const heart = document.createElement("i");
    heart.className = "fa-regular fa-heart";
    saveButton.append(heart);

    const compareButton = document.createElement("button");
    compareButton.className = "compare-btn";
    compareButton.type = "button";
    compareButton.textContent = "Compare";

    actions.append(viewButton, saveButton, compareButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    actions.append(deleteButton);
    info.append(badge, category, heading, location, price, details, actions);
    card.append(image, info);

    return card;
}

function refreshMainPropertyCard(property) {
    const existingCard = Array.from(
        propertyContainer.querySelectorAll(".property-card")
    ).find(function(card) {
        return card.dataset.propertyId === String(property.id);
    });

    if (existingCard) {
        const wasSaved = savedCards.has(existingCard);
        const wasCompared = comparisonCards.has(existingCard);
        const refreshedCard = createPropertyCard(property);
        refreshedCard.dataset.sortOrder = existingCard.dataset.sortOrder;

        existingCard.replaceWith(refreshedCard);

        if (wasSaved) {
            savedCards.delete(existingCard);
            savedCards.add(refreshedCard);
            const icon = refreshedCard.querySelector(".save-btn i");
            icon.classList.replace("fa-regular", "fa-solid");
            refreshedCard.querySelector(".save-btn")
                .setAttribute("aria-pressed", "true");
        }

        if (wasCompared) {
            comparisonCards.delete(existingCard);
            comparisonCards.add(refreshedCard);
            const compareButton = refreshedCard.querySelector(".compare-btn");
            compareButton.textContent = "Selected";
            compareButton.classList.add("is-selected");
        }
    }

    filterProperties();
    renderFavourites();
    renderComparison();
    updateDashboard();
}

function getSavedProperties() {
    const savedValue = localStorage.getItem("estateHubProperties");

    if (!savedValue) {
        return [];
    }

    const properties = JSON.parse(savedValue);

    if (!Array.isArray(properties)) {
        throw new Error("Saved properties must be stored as a list.");
    }

    return properties;
}

function loadSavedProperties() {
    try {
        const properties = getSavedProperties();
        let propertiesUpdated = false;

        properties.forEach(function(property) {
            if (!property.id) {
                property.id = createPropertyId();
                propertiesUpdated = true;
            }

            propertyContainer.append(createPropertyCard(property));
        });

        if (propertiesUpdated) {
            try {
                localStorage.setItem(
                    "estateHubProperties",
                    JSON.stringify(properties)
                );
            } catch (error) {
                console.error("Unable to update saved property IDs.", error);
            }
        }
    } catch (error) {
        console.error("Unable to load saved properties.", error);
    }
}

searchButton.addEventListener("click", filterProperties);

locationInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        filterProperties();
    }
});

propertyType.addEventListener("change", filterProperties);
minPrice.addEventListener("change", filterProperties);
maxPrice.addEventListener("change", filterProperties);
propertySort.addEventListener("change", function() {
    sortProperties(propertySort.value);
    updatePropertyCount();
});

clearButton.addEventListener("click", function() {
    locationInput.value = "";
    propertyType.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    propertySort.value = "default";
    sortProperties("default");
    filterProperties();
    updatePropertyCount();
});

closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
const comparisonCards = new Set();
const comparisonContainer = document.querySelector("#comparison-container");
const clearComparisonButton = document.querySelector("#clear-comparison");

propertyContainer.querySelectorAll(".save-btn").forEach(function(button) {
    button.setAttribute("aria-pressed", "false");
});

function renderComparison() {
    comparisonContainer.replaceChildren();

    if (comparisonCards.size === 0) {
        comparisonContainer.textContent = "No properties selected for comparison.";
        return;
    }

    const table = document.createElement("table");
    const cards = Array.from(comparisonCards);

    const details = [
        ["Property", card => card.querySelector("h3").textContent],
        ["Location", card => card.querySelector(".property-info p").textContent],
        ["Price", card => card.querySelector("h4").textContent],
        ["Property Type", card => card.dataset.type],
        [
            "Bedrooms",
            card => card.querySelector(".property-details span:nth-child(1)").textContent
        ],
        [
            "Bathrooms",
            card => card.querySelector(".property-details span:nth-child(2)").textContent
        ],
        [
            "Area",
            card => card.querySelector(".property-details span:nth-child(3)").textContent
        ]
    ];

    details.forEach(function(detail) {
        const row = document.createElement("tr");
        const heading = document.createElement("th");
        heading.textContent = detail[0];
        row.append(heading);

        cards.forEach(function(card) {
            const cell = document.createElement("td");
            cell.textContent = detail[1](card);
            row.append(cell);
        });

        table.append(row);
    });

    comparisonContainer.append(table);
}

clearComparisonButton.addEventListener("click", function() {
    comparisonCards.clear();

    propertyContainer.querySelectorAll(".compare-btn").forEach(function(button) {
        button.textContent = "Compare";
        button.classList.remove("is-selected");
    });

    renderComparison();
});

propertyContainer.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const card = button.closest(".property-card");

    if (!card) {
        return;
    }

    if (button.classList.contains("delete-btn")) {
        try {
            const propertyId = card.dataset.propertyId;
            const properties = getSavedProperties();
            const property = properties.find(function(savedProperty) {
                return String(savedProperty.id) === propertyId;
            });

            if (!propertyId || !property) {
                alert("Property not found.");
                return;
            }

            const remainingProperties = properties.filter(function(savedProperty) {
                return String(savedProperty.id) !== propertyId;
            });
            localStorage.setItem(
                "estateHubProperties",
                JSON.stringify(remainingProperties)
            );
        } catch (error) {
            console.error("Unable to remove saved property.", error);
            alert("Unable to remove the property from saved listings.");
            return;
        }

        savedCards.delete(card);
        comparisonCards.delete(card);
        card.remove();
        updatePropertyCount();
        renderMyProperties();
        renderFavourites();
        renderComparison();
        updateEstateHubStats();
        updateDashboard();
        return;
    }

    if (button.classList.contains("view-btn")) {
        const image = card.querySelector("img");
        const details = card.querySelectorAll(".property-details span");
        const gallery = document.querySelector("#property-gallery");

        document.querySelector("#modal-image").src = image.src;
        document.querySelector("#modal-image").alt = image.alt;

        document.querySelector("#modal-title").textContent =
            card.querySelector("h3").textContent;
        document.querySelector("#modal-location").textContent =
            card.querySelector(".property-info p").textContent;
        document.querySelector("#modal-price").textContent =
            card.querySelector("h4").textContent;
        const propertyType = (card.dataset.type || "Not specified")
            .replace(/-/g, " ")
            .replace(/\b\w/g, function(character) {
                return character.toUpperCase();
            });
        document.querySelector("#modal-type").textContent = propertyType;
        document.querySelector("#modal-beds").textContent =
            details[0]?.textContent || "Not specified";
        document.querySelector("#modal-baths").textContent =
            details[1]?.textContent || "Not specified";
        document.querySelector("#modal-area").textContent =
            details[2]?.textContent || "Not specified";
        gallery.hidden = true;
        document.querySelector("#gallery-thumbnails").replaceChildren();
        document.querySelector("#gallery-counter").textContent = "0 / 0";

        let propertyImages = [image.src];
        const propertyId = card.dataset.propertyId;
        let propertyData = null;

        if (propertyId) {
            try {
                propertyData = getSavedProperties().find(function(item) {
                    return String(item.id) === propertyId;
                });
                if (Array.isArray(propertyData?.images)) {
                    propertyImages = propertyData.images.filter(function(src) {
                        return typeof src === "string" && src.length > 0;
                    });
                    if (!propertyImages.includes(image.src)) {
                        propertyImages.unshift(image.src);
                    }
                }
            } catch (error) {
                console.error("Unable to load property gallery images.", error);
            }
        }

        document.querySelector("#modal-description").textContent =
            propertyData?.description || "No additional description is available.";
        document.querySelector("#modal-status").textContent =
            propertyData?.listingStatus || "Available";
        const owner = propertyData?.owner;
        document.querySelector("#modal-owner").textContent = owner && owner.name
            ? owner.name + (owner.agency ? " · " + owner.agency : "")
            : "EstateHub";
        const amenitiesContainer = document.querySelector("#modal-amenities");
        amenitiesContainer.replaceChildren();
        (Array.isArray(propertyData?.amenities) ? propertyData.amenities : [])
            .forEach(function(amenity) {
                const item = document.createElement("li");
                item.textContent = amenity;
                amenitiesContainer.append(item);
            });

        document.querySelector(".view-gallery-btn").onclick = function() {
            openPropertyGallery(propertyImages);
        };

        modal.style.display = "flex";
        return;
    }

    if (button.classList.contains("save-btn")) {
        const isSaved = !savedCards.has(card);
        const icon = button.querySelector("i");

        if (isSaved) {
            savedCards.add(card);
        } else {
            savedCards.delete(card);
        }

        icon.classList.toggle("fa-solid", isSaved);
        icon.classList.toggle("fa-regular", !isSaved);
        button.setAttribute("aria-pressed", String(isSaved));
        renderFavourites();
        updateDashboard();
        return;
    }

    if (button.classList.contains("compare-btn")) {
        if (comparisonCards.has(card)) {
            comparisonCards.delete(card);
            button.textContent = "Compare";
            button.classList.remove("is-selected");
        } else if (comparisonCards.size >= 3) {
            alert("You can compare a maximum of 3 properties.");
            return;
        } else {
            comparisonCards.add(card);
            button.textContent = "Selected";
            button.classList.add("is-selected");
        }

        renderComparison();
    }
});
function calculateEMI() {
    const principal = Number(loanAmount.value);
    const annualRate = Number(interestRate.value);
    const years = Number(loanYears.value);

    if (loanAmount.value.trim() === "" ||
        interestRate.value.trim() === "" ||
        loanYears.value.trim() === "" ||
        principal <= 0 ||
        annualRate < 0 ||
        years <= 0 ||
        !Number.isFinite(principal) ||
        !Number.isFinite(annualRate) ||
        !Number.isFinite(years)) {
        emiResult.textContent = "Please enter valid loan details.";
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const emi = monthlyRate === 0
        ? principal / months
        : principal * monthlyRate *
            Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1);

    emiResult.textContent =
        "Your Monthly EMI: ₹" +
        emi.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });
}

calculateEmiButton.addEventListener("click", calculateEMI);
function getSavedInquiries() {
    const savedValue = localStorage.getItem("estateHubInquiries");

    if (!savedValue) {
        return [];
    }

    const inquiries = JSON.parse(savedValue);

    if (!Array.isArray(inquiries)) {
        throw new Error("Saved inquiries must be stored as a list.");
    }

    return inquiries;
}

function saveInquiries(inquiries) {
    localStorage.setItem("estateHubInquiries", JSON.stringify(inquiries));
}

function renderBuyerInquiries() {
    const container = document.querySelector("#buyer-inquiries-list");

    if (!container) {
        return;
    }

    let inquiries;
    try {
        inquiries = getSavedInquiries();
    } catch (error) {
        console.error("Unable to load buyer inquiries.", error);
        container.textContent = "Unable to load saved inquiries.";
        return;
    }

    container.replaceChildren();

    if (inquiries.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No inquiries have been submitted in this browser.";
        container.append(emptyMessage);
        return;
    }

    inquiries.forEach(function(inquiry) {
        const card = document.createElement("article");
        card.className = "buyer-inquiry-card";

        const heading = document.createElement("h3");
        heading.textContent = inquiry.property || "Property inquiry";

        const message = document.createElement("p");
        const messageLabel = document.createElement("strong");
        messageLabel.textContent = "Message: ";
        message.append(messageLabel, inquiry.message || "");

        const date = document.createElement("p");
        const dateLabel = document.createElement("strong");
        dateLabel.textContent = "Date: ";
        date.append(dateLabel, inquiry.date || "Not available");

        const status = document.createElement("span");
        const statusText = inquiry.status || "Pending";
        status.className =
            "buyer-inquiry-status " + statusText.toLowerCase();
        status.textContent = statusText;

        card.append(heading, message, date, status);
        container.append(card);
    });
}

function renderInquiries() {
    let inquiries;

    try {
        inquiries = getSavedInquiries();
    } catch (error) {
        console.error("Unable to load saved inquiries.", error);
        inquiriesList.textContent = "Unable to load saved inquiries.";
        return;
    }

    const selectedStatus = inquiryStatusFilter.value;
    const filteredInquiries = selectedStatus === "all"
        ? inquiries
        : inquiries.filter(function(inquiry) {
            return inquiry.status === selectedStatus;
        });

    inquiriesList.replaceChildren();

    if (filteredInquiries.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No inquiries found.";
        inquiriesList.append(emptyMessage);
        inquiriesList.dataset.totalCount = inquiries.length;
        updateInquirySummary(inquiries);
        updateEstateHubStats();
        updateDashboard();
        return;
    }

    filteredInquiries.forEach(function(inquiry) {
        const card = document.createElement("div");
        card.className = "inquiry-card";

        const heading = document.createElement("h3");
        heading.textContent = inquiry.property;

        const details = document.createElement("p");
        details.textContent =
            "Buyer: " + inquiry.name + " | Email: " + inquiry.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + inquiry.phone;

        const message = document.createElement("p");
        message.textContent = "Message: " + inquiry.message;

        const date = document.createElement("p");
        date.textContent = "Submitted: " +
            (inquiry.date || "Date unavailable");

        const status = document.createElement("p");
        const statusClass = inquiry.status.toLowerCase();
        status.className = "inquiry-status status-" + statusClass;
        status.textContent = inquiry.status;

        const label = document.createElement("label");
        label.textContent = "Update Status: ";

        const select = document.createElement("select");
        select.className = "inquiry-status-select";
        select.setAttribute("aria-label", "Update inquiry status");
        select.dataset.id = inquiry.id;

        ["Pending", "Contacted", "Resolved"].forEach(function(value) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            option.selected = inquiry.status === value;
            select.append(option);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete Inquiry";
        deleteButton.className = "delete-inquiry-btn";
        deleteButton.dataset.id = inquiry.id;

        card.dataset.status = inquiry.status;
        card.append(
            heading,
            details,
            phone,
            message,
            date,
            status,
            label,
            select,
            deleteButton
        );
        inquiriesList.append(card);
    });

    inquiriesList.dataset.totalCount = inquiries.length;
    updateInquirySummary(inquiries);
    updateEstateHubStats();
    updateDashboard();
}

function updateInquirySummary(inquiries) {
    document.querySelector("#summary-total").textContent = inquiries.length;
    document.querySelector("#summary-pending").textContent =
        inquiries.filter(function(item) {
            return item.status === "Pending";
        }).length;
    document.querySelector("#summary-contacted").textContent =
        inquiries.filter(function(item) {
            return item.status === "Contacted";
        }).length;
    document.querySelector("#summary-resolved").textContent =
        inquiries.filter(function(item) {
            return item.status === "Resolved";
        }).length;
}

inquiryForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newInquiry = {
        id: Date.now().toString(),
        name: document.querySelector("#buyer-name").value.trim(),
        email: document.querySelector("#buyer-email").value.trim(),
        phone: document.querySelector("#buyer-phone").value.trim(),
        property: document.querySelector("#inquiry-property").value,
        message: document.querySelector("#inquiry-message").value.trim(),
        status: "Pending",
        date: new Date().toLocaleString()
    };

    try {
        const inquiries = getSavedInquiries();
        inquiries.unshift(newInquiry);
        saveInquiries(inquiries);
    } catch (error) {
        console.error("Unable to save inquiry.", error);
        inquiryStatus.textContent = "Unable to submit inquiry. Please try again.";
        inquiryStatus.style.color = "#b91c1c";
        return;
    }

    renderInquiries();
    renderBuyerInquiries();
    inquiryStatus.textContent = "Inquiry submitted successfully!";
    inquiryStatus.style.color = "#166534";
    inquiryForm.reset();
    document.querySelector("#selected-property-info").hidden = true;
    updateDashboard();
});

inquiriesList.addEventListener("change", function(event) {
    if (!event.target.classList.contains("inquiry-status-select")) {
        return;
    }

    const inquiryId = event.target.dataset.id;

    try {
        const inquiries = getSavedInquiries();
        const inquiry = inquiries.find(function(item) {
            return item.id === inquiryId;
        });

        if (!inquiry) {
            return;
        }

        inquiry.status = event.target.value;
        saveInquiries(inquiries);
        renderInquiries();
        renderBuyerInquiries();
    } catch (error) {
        console.error("Unable to update inquiry status.", error);
        inquiryStatus.textContent =
            "Unable to update inquiry status. Please try again.";
        inquiryStatus.style.color = "#b91c1c";
    }
});

inquiriesList.addEventListener("click", function(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(".delete-inquiry-btn");

    if (!button || !window.confirm("Are you sure you want to delete this inquiry?")) {
        return;
    }

    try {
        const inquiryId = button.dataset.id;
        const inquiries = getSavedInquiries().filter(function(inquiry) {
            return inquiry.id !== inquiryId;
        });

        saveInquiries(inquiries);
        renderInquiries();
        renderBuyerInquiries();
    } catch (error) {
        console.error("Unable to delete inquiry.", error);
        inquiryStatus.textContent =
            "Unable to delete inquiry. Please try again.";
        inquiryStatus.style.color = "#b91c1c";
    }
});

inquiryStatusFilter.addEventListener("change", renderInquiries);

function updateDashboard() {
    totalPropertiesElement.textContent =
        propertyContainer.querySelectorAll(".property-card").length;
    totalFavouritesElement.textContent = savedCards.size;
    totalInquiriesElement.textContent =
        inquiriesList.dataset.totalCount ||
        inquiriesList.querySelectorAll(".inquiry-card").length;
}

function updateEstateHubStats() {
    const totalProperties = document.querySelector("#stat-total-properties");
    const totalInquiries = document.querySelector("#stat-total-inquiries");
    const pendingInquiries = document.querySelector("#stat-pending-inquiries");
    const resolvedInquiries = document.querySelector("#stat-resolved-inquiries");

    if (!totalProperties || !totalInquiries ||
        !pendingInquiries || !resolvedInquiries) {
        return;
    }

    let inquiries;
    try {
        inquiries = getSavedInquiries();
    } catch (error) {
        console.error("Unable to update EstateHub statistics.", error);
        return;
    }

    totalProperties.textContent =
        document.querySelectorAll(".property-card").length;
    totalInquiries.textContent = inquiries.length;
    pendingInquiries.textContent = inquiries.filter(function(inquiry) {
        return inquiry.status === "Pending";
    }).length;
    resolvedInquiries.textContent = inquiries.filter(function(inquiry) {
        return inquiry.status === "Resolved";
    }).length;
}

window.updateEstateHubStats = updateEstateHubStats;

propertyContainer.querySelectorAll(".property-card").forEach(function(card) {
    card.dataset.sortOrder = String(nextPropertySortOrder++);
});
loadSavedProperties();
renderMyProperties();
renderInquiries();
renderBuyerInquiries();
updatePropertyCount();
updateDashboard();
updateEstateHubStats();

window.renderMyProperties = renderMyProperties;
window.renderBuyerInquiries = renderBuyerInquiries;

function showGalleryImage(index) {
    if (currentGalleryImages.length === 0) {
        return;
    }

    currentGalleryIndex =
        (index + currentGalleryImages.length) % currentGalleryImages.length;

    const mainImage = document.querySelector("#gallery-main-image");
    mainImage.src = currentGalleryImages[currentGalleryIndex];
    mainImage.alt = "Property photo " + (currentGalleryIndex + 1);
    document.querySelector("#gallery-counter").textContent =
        (currentGalleryIndex + 1) + " / " + currentGalleryImages.length;

    document.querySelectorAll(".gallery-thumbnail").forEach(
        function(thumbnail, thumbnailIndex) {
            thumbnail.classList.toggle(
                "active",
                thumbnailIndex === currentGalleryIndex
            );
        }
    );
}

function openPropertyGallery(images) {
    if (!Array.isArray(images) || images.length === 0) {
        window.alert("No additional property photos are available.");
        return;
    }

    currentGalleryImages = images.filter(function(src) {
        return typeof src === "string" && src.length > 0;
    });

    if (currentGalleryImages.length === 0) {
        window.alert("No additional property photos are available.");
        return;
    }

    const gallery = document.querySelector("#property-gallery");
    const thumbnailContainer = document.querySelector("#gallery-thumbnails");
    thumbnailContainer.replaceChildren();

    currentGalleryImages.forEach(function(src, index) {
        const thumbnail = document.createElement("img");
        thumbnail.src = src;
        thumbnail.className = "gallery-thumbnail";
        thumbnail.alt = "Property photo " + (index + 1);
        thumbnail.addEventListener("click", function() {
            showGalleryImage(index);
        });
        thumbnailContainer.append(thumbnail);
    });

    gallery.hidden = false;
    showGalleryImage(0);
}

document.addEventListener("click", function(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    if (!event.target.closest("#contact-realtor-btn")) {
        return;
    }

    const propertyTitle =
        document.querySelector("#modal-title").textContent.trim();
    const propertyLocation =
        document.querySelector("#modal-location").textContent.trim();
    const propertySelect = document.querySelector("#inquiry-property");

    let option = Array.from(propertySelect.options).find(function(item) {
        return item.value === propertyTitle;
    });

    if (!option) {
        option = document.createElement("option");
        option.value = propertyTitle;
        option.textContent = propertyTitle;
        propertySelect.append(option);
    }

    propertySelect.value = propertyTitle;
    document.querySelector("#selected-property-info").hidden = false;
    document.querySelector("#inquiry-property-name").textContent = propertyTitle;
    document.querySelector("#inquiry-property-location").textContent =
        propertyLocation;
    modal.style.display = "none";
    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

document.querySelector("#gallery-next").addEventListener("click", function() {
    showGalleryImage(currentGalleryIndex + 1);
});

document.querySelector("#gallery-prev").addEventListener("click", function() {
    showGalleryImage(currentGalleryIndex - 1);
});