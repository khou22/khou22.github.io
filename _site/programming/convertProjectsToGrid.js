var gridData = {
    columns: 4,
    textColor: "white",
    openNewWindow: true,
    data: []
}

// Preload images for performance — also forces top images to load first
var preloadImage = function(url) {
    const img = new Image();
    img.src = url;
};


// Populate grid data from programmingProjects object
// Prepares the gridData object
for (var i = 0; i < programmingProjects.length; i++) {
    var currentProject = programmingProjects[i];

    var projectURL = currentProject.slug.replace("{{ site.baseurl }}", "http://khou22.github.io");
    // preloadImage(currentProject.image); // Preload image for better UX

    var gridItem = {
        title: currentProject.name,
        subtitle: currentProject.subtitle,
        description: currentProject.description,
        image: currentProject.image,
        link: projectURL,
        size: "2",
        category: {
            label: currentProject.category,
            color: currentProject.categoryColor
        }
    }

    gridData.data.push(gridItem); // Add to data
}
