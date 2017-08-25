var gridData = {
    columns: 4,
    textColor: "white",
    modal: true,
    openNewWindow: true,
    data: []
}

// Preload images for performance — also forces top images to load first
var preloadImage = function(url) {
    const img = new Image();
    img.src = url;
};

// Populate grid data
for (var i = 0; i < vscoImages.length; i++) {
    var currentImage = vscoImages[i];
    var rawImageLink = "http://" + currentImage.substring(0, currentImage.length);
    rawImageLink = rawImageLink.replace("?w=600", "?w=1200"); // Higher resolution

    preloadImage(rawImageLink); // Preload

    var gridItem = {
        image: "http://" + currentImage,
        link: rawImageLink,
        size: "1",
    }

    gridData.data.push(gridItem); // Add to data
}
