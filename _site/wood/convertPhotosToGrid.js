var gridData = {
    columns: 3,
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
for (var i = 0; i < flickrData.length; i++) {
    var currentAlbum = flickrData[i];
    // preloadImage(currentAlbum.image); // Preload

    var gridItem = {
        title: currentAlbum.title,
        subtitle: " ",
        description: " ",
        image: "https://" + currentAlbum.image,
        link: currentAlbum.link,
        size: "1",
        category: {
            label: " ",
            color: "rgba(0,0,0,0)"
        }
    }

    gridData.data.push(gridItem); // Add to data
}
