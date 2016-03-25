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
        <WeatherWidget />
      </div>
    );
  }
});

var WeatherWidget = React.createClass({
  render: function() {
    return (
      <div class="widget-div">
        I am a widget
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
