var ProjectsPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Projects</h1>
        <ProjectsList data={
          [{
            name: "Wood Club",
            slug: "wood-club",
            description: "The birth and evolution of Wood Club - a club I lead at my high school"
          }]
        }/>
      </div>
    );
  }
})

var ProjectsList = React.createClass({
  getInitialState: function() {
    return {
      projects: this.props.data
    };
  },
  render: function() {
    var projectNodes = this.props.data.map(function(data) {
      console.log(data);
      return (
        <span>
          <h4 className="project-title"><a href={data.slug}>{data.name}</a></h4>
          <p className="project-description">{data.description}</p>
        </span>
      )
    })
    return (
      <div>
        <i>Ongoing projects that I write about. All wood projects can be found on my Project Portfolio, Flickr, YouTube, LinkedIn, etc.</i>
        <hr className="project-hr"/>
        {projectNodes}
      </div>
    )
  }
})

React.render(
  React.createElement(ProjectsPage, null),
  document.getElementById('content')
);
