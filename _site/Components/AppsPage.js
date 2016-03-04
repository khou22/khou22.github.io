var AppsPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Apps</h1>
        <ProjectsList data={
          [{
            name: "Text Analysis",
            slug: "text-analysis",
            description: "An app to analyze the user's text for patterns, word choice, etc. It accepts text files as well as Facebook user data."
          },
          {
            name: "Stats Test Score Calculator",
            slug: "stats-test-score-calculator",
            description: "An app to automatically calculate test scores and apply a grading curve. Built for Triggs Honors Stats Classes."
          },
          {
            name: "Time Calculator",
            slug: "time-calculator",
            description: "An app that takes in an ambiguous number of times and outputs the average of those times. Made this for my friend who does crew."
          },
          {
            name: "Presidential Election Forecast 2016",
            slug: "presidential-election-forecast-2016",
            description: "Runs simulations and forecasts who will win the 2016 presidential election. Right now it only simulates who will win the Republican candidacy."
          }]
        }/>
      </div>
    );
  }
})

var ProjectsList = React.createClass({
  getInitialState: function() {
    return {
      apps: this.props.data
    };
  },
  render: function() {
    var appNodes = this.props.data.map(function(data) {
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
        <i>The web-apps I've made.</i>
        <hr className="project-hr"/>
        {appNodes}
      </div>
    )
  }
})

React.render(
  React.createElement(AppsPage, null),
  document.getElementById('content')
);
