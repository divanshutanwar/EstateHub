const propertyForm = document.querySelector("#add-property-form");
const imageInput = document.querySelector("#property-images");
const statusMessage = document.querySelector("#sell-status");
const imagePreviewContainer = document.querySelector("#image-preview-container");
let previewUrls = [];

function renderImagePreviews() {
    previewUrls.forEach(function(url) {
        URL.revokeObjectURL(url);
    });
    previewUrls = [];
    imagePreviewContainer.replaceChildren();

    Array.from(imageInput.files || []).forEach(function(file) {
        if (!file.type.startsWith("image/")) {
            return;
        }

        const url = URL.createObjectURL(file);
        previewUrls.push(url);

        const preview = document.createElement("figure");
        preview.className = "image-preview-box";

        const image = document.createElement("img");
        image.className = "image-preview";
        image.src = url;
        image.alt = file.name;

        const caption = document.createElement("figcaption");
        caption.className = "image-preview-name";
        caption.textContent = file.name;

        preview.append(image, caption);
        imagePreviewContainer.append(preview);
    });
}

imageInput.addEventListener("change", renderImagePreviews);
propertyForm.addEventListener("reset", function() {
    window.setTimeout(renderImagePreviews, 0);
});

function getProperties() {
    const savedValue = localStorage.getItem("estateHubProperties");
    const properties = savedValue ? JSON.parse(savedValue) : [];

    if (!Array.isArray(properties)) {
        throw new Error("Saved properties must be stored as a list.");
    }

    return properties;
}

function readImage(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function() {
            if (typeof reader.result !== "string") {
                reject(new Error("Image reader returned an invalid result."));
                return;
            }
            resolve(reader.result);
        };
        reader.onerror = function() {
            reject(reader.error || new Error("Unable to read image file."));
        };
        reader.readAsDataURL(file);
    });
}

propertyForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    statusMessage.textContent = "";

    const files = Array.from(imageInput.files || []);
    if (files.length === 0 || files.length > 10 ||
        files.some(function(file) {
            return !file.type.startsWith("image/") ||
                file.size > 5 * 1024 * 1024;
        })) {
        statusMessage.textContent =
            "Choose 1 to 10 image files, each smaller than 5 MB.";
        return;
    }

    let images;
    try {
        images = await Promise.all(files.map(readImage));
    } catch (error) {
        console.error("Unable to read property images.", error);
        statusMessage.textContent = "Could not read the selected images.";
        return;
    }

    const price = Number(document.querySelector("#new-price").value);
    const beds = Number(document.querySelector("#new-beds").value);
    const baths = Number(document.querySelector("#new-baths").value);
    const area = Number(document.querySelector("#new-area").value);
    const property = {
        id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2),
        title: document.querySelector("#new-title").value.trim(),
        location: document.querySelector("#new-location").value.trim(),
        country: document.querySelector("#new-country").value.trim(),
        price: price,
        listingType: document.querySelector("#new-listing-type").value,
        type: document.querySelector("#new-type").value,
        beds: beds,
        baths: baths,
        area: area,
        image: images[0],
        images: images
    };

    try {
        const properties = getProperties();
        properties.push(property);
        localStorage.setItem("estateHubProperties", JSON.stringify(properties));
    } catch (error) {
        console.error("Unable to save property.", error);
        statusMessage.textContent =
            "Unable to save this listing. Try smaller images or free browser storage.";
        return;
    }

    propertyForm.reset();
    statusMessage.textContent = "Listing added. View it on the My Listings page.";
});
