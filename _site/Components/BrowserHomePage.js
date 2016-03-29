var App = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      backgroundURL: this.randomBackground()
    }
  },
  randomBackground: function() {
    var max = goodImages.length; // Array of good images from the Python Script
    var baseURL = "https://www.gstatic.com/prettyearth/assets/full/[number].jpg"; // Template URL
    var arrayIndex = Math.round(Math.random() * max); // Random number between the specified max/min
    var imageIndex = goodImages[arrayIndex];
    var finalUrl = baseURL.replace("[number]", imageIndex); // Inject image index
    console.log("Final URL:", finalUrl);

    return finalUrl; // Return the URL
  },
  newBackground: function() {
    this.setState({
      backgroundURL: this.randomBackground()
    });
  },
  render: function() {

    return (
      <div>
        <Background backgroundURL = {this.state.backgroundURL} />
        <SearchBar />
        <ProfilePicture />
        <SchoolButtonGroup />
      </div>
    );
  }
});

var ProfilePicture = React.createClass({
  render: function() {
    return (
      <div className="profile-picture">
      </div>
    )
  }
})

var SearchBar = React.createClass({
  render: function() {
    return (
      <div className="search-bar">

      </div>
    )
  }
})

var SchoolButtonGroup = React.createClass({
  getInitialState: function() {
    return {
      showLinks: false
    }
  },
  showGroup: function() {
    console.log("Mouse enter/exit school group");
    newState = !this.state.showLinks;
    this.setState({
      showLinks: newState
    })
  },
  render: function() {
    return (
      <div onMouseEnter={this.showGroup.bind(this)} onMouseOut={this.showGroup.bind(this)}>
        <div className="button-group school-group">
          School
        </div>
        <div className="button-subgroup school-group school-1">
          LWHS
        </div>
        <div className="button-subgroup school-group school-2">
          LWHS
        </div>
        <div className="button-subgroup school-group school-3">
          LWHS
        </div>
      </div>
    )
  }
})

var Background = React.createClass({
  render: function() {
    var backgroundStyle = { backgroundImage: 'url(' + this.props.backgroundURL + ')' };
    return (
      <div className="background" style={backgroundStyle}>
      </div>
    )
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
