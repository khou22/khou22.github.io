var gridData = {
  columns: 3,
  textColor: "white",
  openNewWindow: true,
  data: []
}

// Populate grid data
for (var i = 0; i < vscoImages.length; i++) {
  var currentImage = vscoImages[i];

  var gridItem = {
    title: "",
    subtitle: "",
    description: "",
    image: "http://" + currentImage,
    link: "http://vsco.co/khou22/",
    size: "1",
    category: {
      label: "",
      color: "clear"
    }
  }

  gridData.data.push(gridItem); // Add to data
}
