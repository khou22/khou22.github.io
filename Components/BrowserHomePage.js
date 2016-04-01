var App = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      backgroundURL: this.randomBackground(),
      fadeTime: 2000
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
        <WelcomeBar />
        <ProfilePicture />
        <SchoolButtonGroup fadeTime={this.state.fadeTime} />
        <PersonalButtonGroup fadeTime={this.state.fadeTime} />
        <ProgrammingButtonGroup fadeTime={this.state.fadeTime} />
      </div>
    );
  }
});

var ProfilePicture = React.createClass({
  render: function() {
    return (
      <div>
        <div className="profile-picture">
        </div>
        <div className="profile-text">
          Kevin Hou
          <br />
          Lick-Wilmerding &#39;16
        </div>
      </div>
    )
  }
})

var WelcomeBar = React.createClass({
  getInitialState: function() {
    setInterval(() => {
      this.setState({
        currentTime: this.getCurrentTime()
      })
    }, 500)
    return {
      currentTime: this.getCurrentTime()
    }
  },
  getCurrentTime: function() {
    var today = new Date(); // Get current date
    var h = today.getHours();
    if (h > 12) {
      h = h % 12; // 12 hour time, not military time
    }
    var m = today.getMinutes();
    if (m < 10) {
      m = "0" + m; // Add a leading zero
    }
    var s = today.getSeconds();
    if (s < 10) {
      s = "0" + s; // Add a leading zero
    }
    var str = h + ":" + m + ":" + s; // Create string
    return str // Return the string
  },
  render: function() {
    return (
      <div className="welcome-bar glass">
        <p className="time">{this.state.currentTime}</p>
        <p className="welcome-text">
          <span className="invisible-color">|</span>
          <span id="welcome-text">Hello Kevin</span>
          <span className="actor__content--typing">|</span>
        </p>
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
  showGroup: function(state) {
    console.log("Mouse enter/exit school group");
    if (state == "show") {
      this.setState({
        showLinks: true
      })
    } else {
      setTimeout(() => {
        this.setState({ showLinks: false });
      }, this.props.fadeTime);
    }
  },
  render: function() {
    return (
      <div className="group">
        <div className="button-group school-group" onMouseEnter={this.showGroup.bind(this, "show")}
        onMouseOut={this.showGroup.bind(this, "hide")}>
          School
        </div>
        { this.state.showLinks ? (
          <span>
            <div className="button-subgroup school-group school-1">
              LWHS
            </div>
            <div className="button-subgroup school-group school-2">
              LWHS
            </div>
            <div className="button-subgroup school-group school-3">
              LWHS
            </div>
          </span>
        ) : null }
      </div>
    )
  }
})

var PersonalButtonGroup = React.createClass({
  getInitialState: function() {
    return {
      showLinks: false
    }
  },
  showGroup: function(state) {
    console.log("Mouse enter/exit personal group");
    if (state == "show") {
      this.setState({
        showLinks: true
      })
    } else {
      setTimeout(() => {
        this.setState({ showLinks: false });
      }, this.props.fadeTime);
    }
  },
  render: function() {
    return (
      <div className="group">
        <div className="button-group personal-group" onMouseEnter={this.showGroup.bind(this, "show")}
        onMouseOut={this.showGroup.bind(this, "hide")}>
          Personal
        </div>
        { this.state.showLinks ? (
          <span>
            <div className="button-subgroup personal-group personal-1">
              LWHS
            </div>
            <div className="button-subgroup personal-group personal-2">
              LWHS
            </div>
            <div className="button-subgroup personal-group personal-3">
              LWHS
            </div>
          </span>
        ) : null }
      </div>
    )
  }
})

var ProgrammingButtonGroup = React.createClass({
  getInitialState: function() {
    return {
      showLinks: false
    }
  },
  showGroup: function(state) {
    console.log("Mouse enter/exit programming group");
    if (state == "show") {
      this.setState({
        showLinks: true
      })
    } else {
      setTimeout(() => {
        this.setState({ showLinks: false });
      }, this.props.fadeTime);
    }
  },
  render: function() {
    return (
      <div className="group">
        <div className="button-group programming-group" onMouseEnter={this.showGroup.bind(this, "show")}
        onMouseOut={this.showGroup.bind(this, "hide")}>
          Programming
        </div>
        { this.state.showLinks ? (
          <span>
            <div className="button-subgroup programming-group programming-1">
              LWHS
            </div>
            <div className="button-subgroup programming-group programming-2">
              LWHS
            </div>
            <div className="button-subgroup programming-group programming-3">
              LWHS
            </div>
          </span>
        ) : null }
      </div>
    )
  }
})

var Background = React.createClass({
  render: function() {
    var backgroundStyle = { backgroundImage: 'url(' + this.props.backgroundURL + ')' };
    // var backgroundStyle = { background: 'black' };
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

// TheaterJS typing effect
var theater = theaterJS({ local: 'fr' })

theater.addActor('welcome-text', { speed: 1.1, accuracy: 0.7 });

// Environmental analysis
var currentDate = new Date();
var currentHour = currentDate.getHours();
if (currentHour > 18 || currentHour < 4) { // 6pm - 4am
  theater.addScene('welcome-text:Good evening, Kevin', 750)
} else if (currentHour < 12 && currentHour > 4) { // 4am - 12pm
  theater.addScene('welcome-text:Good morning, Kevin', 750)
} else { // 12pm - 6pm
  theater.addScene('welcome-text:Good afternoon, Kevin', 750)
}

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = monthNames[currentDate.getMonth()];
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var dateString = month + " " + day + ", " + year;

theater
  .addScene('welcome-text:Today is ' + dateString, 1500)
  .addScene('welcome-text:How can I help you today?', 1000)
  .addScene(theater.replay.bind(theater))
