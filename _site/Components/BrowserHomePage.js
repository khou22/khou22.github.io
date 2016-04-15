var App = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      backgroundURL: this.randomBackground(),
      fadeTime: 50000,
      content: [
        {
          name: "School",
          groupIcon: "../../../media/site/icons/highSchool_bw.png",
          links: [
            {
              label: "Google",
              url: "https://www.google.com",
              iconPath: "../../../media/site/icons/email_bw.png"
            },
            {
              label: "YouTube",
              url: "https://www.youtube.com",
              iconPath: "../../../media/site/icons/logos/YouTube_bw.png"
            },
            {
              label: "LWHS",
              url: "http://www.lwhs.org/page",
              iconPath: "../../../media/site/icons/highSchool_bw.png"
            },
          ]
        },
        {
          name: "Personal",
          groupIcon: "../../../media/site/icons/home_bw.png",
          links: [
            {
              label: "Gmail",
              url: "https://www.gmail.com",
              iconPath: "../../../media/site/icons/email_bw.png"
            },
            {
              label: "YouTube",
              url: "https://www.youtube.com",
              iconPath: "../../../media/site/icons/logos/YouTube_bw.png"
            },
            {
              label: "Facebook",
              url: "https://www.facebook.com/",
              iconPath: "../../../media/site/icons/logos/Facebook_bw.png"
            },
          ]
        },
        {
          name: "Programming",
          groupIcon: "../../../media/site/icons/code.png",
          links: [
            {
              label: "GitHub",
              url: "https://github.com/khou22",
              iconPath: "../../../media/site/icons/logos/Github_bw.png"
            },
            {
              label: "YouTube",
              url: "https://www.youtube.com",
              iconPath: "../../../media/site/icons/email_bw.png"
            },
            {
              label: "LWHS",
              url: "http://www.lwhs.org/page",
              iconPath: "../../../media/site/icons/email_bw.png"
            },
          ]
        }
      ]
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
        <ButtonGroup fadeTime={this.state.fadeTime} content={this.state.content[0]} index={0} />
        <ButtonGroup fadeTime={this.state.fadeTime} content={this.state.content[1]} index={1} />
        <ButtonGroup fadeTime={this.state.fadeTime} content={this.state.content[2]} index={2} />
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
    if (h == 0) { // If hour is 12 or 24
      h = "12";
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

var ButtonGroup = React.createClass({
  getInitialState: function() {
    return {
      showLinks: false,
      groupName: this.props.content.name,
      links: this.props.content.links,
    }
  },
  clickedGroup: function() {
    // console.log("Clicked", this.state.groupName, "group"); // Feedback
    for (var i = 0; i < this.state.links.length; i++) { // Cycle through all links in group
      window.open(this.state.links[i].url, '_blank'); // Open links in a new tab
    }
  },
  clickedLink: function(linkNumber) {
    console.log("Clicked link:", linkNumber); // Feedback
    window.open(this.state.links[linkNumber].url, '_blank'); // Opens in a new tab
  },
  showGroup: function(state) {
    // console.log("Mouse enter/exit ", this.state.groupName, "group"); // Feedback
    if (state == "show") {
      this.setState({
        showLinks: true
      })
    } else {
      var hideTimer = setTimeout(() => {
        this.setState({ showLinks: false });
      }, this.props.fadeTime);
    }
  },
  resetShow: function() {
    console.log("Resetting timer");
    clearTimeout(hideTimer);
    var hideTimer = setTimeout(() => {
      this.setState({ showLinks: false });
    }, this.props.fadeTime);
  },
  render: function() {
    index = this.props.index;
    var counter = -1; // Start at -1 because adding 1 immediately
    var clickedLink = this.clickedLink;
    var linkNodes = this.state.links.map(function(link) {
      counter++; // Index
      var iconStyle = { "backgroundImage": "url(" + link.iconPath + ")" }
      return (
        <div style={iconStyle}
          className={"button-subgroup group-" + index + " group-" + index + "-" + counter}
          onClick={clickedLink.bind(this, counter)} >
          <div className="icon-label">{link.label}</div>
        </div>
      )
    })
    return (
      <div className="group">
        <div className={"button-group group-" + index}
          onMouseEnter={this.showGroup.bind(this, "show")}
          onMouseOut={this.showGroup.bind(this, "hide")}
          onClick={this.clickedGroup.bind(this)} >
          <img src={this.props.content.groupIcon} className="group-icon"/>
        </div>
        { this.state.showLinks ? (
          <span onMouseOver={this.resetShow.bind(this)} >
            { linkNodes }
          </span>
        ) : null }
      </div>
    )
  }
});

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
  .addScene('welcome-text:Hover over the icons below for more...', 1000)
  .addScene(theater.replay.bind(theater))
