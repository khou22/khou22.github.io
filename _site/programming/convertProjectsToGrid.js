var gridData = {
  columns: 4,
  textColor: "white",
  openNewWindow: true,
  data: []
}

// Populate grid data from programmingProjects object
// Prepares the gridData object
for (var i = 0; i < programmingProjects.length; i++) {
  var currentProject = programmingProjects[i];

  var projectURL = currentProject.slug.replace("{{ site.baseurl }}", "http://khou22.github.io");

  var gridItem = {
    title: currentProject.name,
    subtitle: currentProject.subtitle,
    description: currentProject.description,
    image: currentProject.image,
    link: projectURL,
    size: "2",
    category: {
      label: "Programming",
      color: "orange"
    }
  }

  gridData.data.push(gridItem); // Add to data
}
