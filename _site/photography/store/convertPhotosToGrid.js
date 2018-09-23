var gridData = {
    columns: 4,
    textColor: "white",
    modal: true,
    openNewWindow: false,
    data: []
}

// Preload images for performance — also forces top images to load first
var preloadImage = function(url) {
    const img = new Image();
    img.src = url;
};

for (var i = 0; i < storeImages.length; i++) {
    let imageObj = storeImages[i]

    // Build grid item
    var gridItem = {
        image: imageObj.url,
        caption: imageObj.name,
        link: "#",
        size: "1",
    }

    gridData.data.push(gridItem); // Add to data
}
