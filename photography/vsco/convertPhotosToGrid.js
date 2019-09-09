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

for (var i = 0; i < vscoData.length; i++) {
    var currentImageObj = vscoData[i];

    // Build grid item
    var gridItem = {
        image: currentImageObj.image,
        link: currentImageObj.image,
        size: "1",
    }

    gridData.data.push(gridItem); // Add to data
}

// Get images from personal database
// fetch('http://khou22.herokuapp.com/api/photos/sources')
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(myJson) {
//         for (var i = 0; i < myJson.length; i++) {
//             // Build grid item
//             var gridItem = {
//                 image: myJson[i],
//                 link: myJson[i],
//                 size: "1",
//             }
//
//             // Uncomment if want personal database photos
//             // gridData.data.unshift(gridItem);
//         }
//     });

/****** Old ******/
// // Populate grid data
// for (var i = 0; i < vscoImages.length; i++) {
//     var currentImage = vscoImages[i];
//     var rawImageLink = "http://" + currentImage.substring(0, currentImage.length);
//     rawImageLink = rawImageLink.replace("?w=600", "?w=1200"); // Higher resolution
//
//     // preloadImage(rawImageLink); // Preload
//
//     var gridItem = {
//         image: "http://" + currentImage,
//         link: rawImageLink,
//         size: "1",
//     }
//
//     gridData.data.push(gridItem); // Add to data
// }
