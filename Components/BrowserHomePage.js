var App = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      backgroundURL: this.randomBackground()
    }
  },
  randomBackground: function() {
    var min = 1253; // Lowest image index: 1253
    var max = 2199; // Highest image index: 2199
    var baseURL = "https://www.gstatic.com/prettyearth/assets/full/[number].jpg"; // Template URL
    var imageIndex = Math.round(Math.random() * (max - min) + min); // Random number between the specified max/min
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
    var backgroundStyle = { backgroundImage: 'url(' + this.state.backgroundURL + ')' };
    return (
      <div>
        <div className="background" style={backgroundStyle}>
          <button onClick={this.newBackground}>New Google Earth Image</button>
        </div>
      </div>
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
