var ProjectsPage = React.createClass({
  getInitialState: function() {
    return {
      projectData: programmingProjects
    }
  },
  render: function() {
    return (
      <div className="project-page">
        <h1 className="project-header">Projects</h1>
        <ProjectsList data={ this.state.projectData }/>
      </div>
    );
  }
})

var ProjectsList = React.createClass({
  getInitialState: function() {
    return {
      projects: this.props.data,
      numPerRow: 3
    };
  },
  render: function() {
    var index = -1; // Adding one immediately
    var numPerRow = this.state.numPerRow;
    var projectNodes = this.props.data.map(function(data) {
      index++; // Advance index every cycle
      // console.log(data); // Feedback
      var temp = [data]; // Just so I can use the map function
      var newRowNodes = temp.map(function(data) {
        console.log(data.name); // debugging

        // If not in the projects folder, load complete URL
        // Replace baseurl with actual base URL
        var projectURL = data.slug.replace("{{ site.baseurl }}", "http://khou22.github.io");

        return (
          <tr>
            <h4 className="project-title"><a href={projectURL} target="_blank">{data.name}</a></h4>
            <p className="project-description">{data.description}</p>
          </tr>
        )
      });
      // console.log(index, numPerRow)
      // console.log(index % numPerRow);
      // if (index % numPerRow == 0) { // The first one in each row
      //   // Start a new row
      //   console.log("New row at", data.name)
      //   return (
      //     <tr>
      //       { newRowNodes }
      //     </tr>
      //   )
      // } else {
        // Continue on same row
        return (
          { newRowNodes }
        )
      // }
    });
    return (
      <div>
        <i>Additional projects can be found on my <a href="http://kevinhou.wix.com/projects">Project Portfolio</a>
          , <a href="https://www.flickr.com/photos/khou22/albums">Flickr</a>
          , <a href="https://youtube.com/kevinhou22">YouTube</a>
          , <a href="https://www.linkedin.com/in/kevinhou22">LinkedIn</a>, etc.
        </i>
        <hr className="project-hr"/>
        <table>
          {projectNodes}
        </table>
      </div>
    )
  }
})

React.render(
  React.createElement(ProjectsPage, null),
  document.getElementById('content')
);
