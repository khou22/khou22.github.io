// Standard landing page
var LoadingPage = React.createClass({
  getInitialState: function() {
    var loadingScreenDuration = 5500;
    var fadeOutTime = 1000;

    setTimeout(this.hideLoading.bind(this), loadingScreenDuration); // Loading page lasts for x seconds
    setTimeout(this.startFade.bind(this), loadingScreenDuration - fadeOutTime); // Loading page lasts for x - 1 seconds
    setTimeout(this.startLogoAnimation.bind(this), 1600); // Logo animation triggered
    setTimeout(this.startLogoPositionChange.bind(this), 4000); // Logo position change triggered

    return {
      loadingVisible: true,
      fadeAnimation: false,
      logoAnimation: false,
      logoPositionChange: false
    }
  },
  hideLoading: function() {
    this.setState({
      loadingVisible: false
    });
  },
  startFade: function() {
    // console.log("Fading");
    this.setState({
      fadeAnimation: true
    })
  },
  startLogoAnimation: function() {
    this.setState({
      logoAnimation: true
    })
  },
  startLogoPositionChange: function() {
    this.setState({
      logoPositionChange: true
    })
  },
  render: function() {
    if (this.state.loadingVisible) { // Showing loading screen
      var fadeAnimation = this.state.fadeAnimation ? "fade-loading-screen" : "";

      // Toggle between static first frame and animated logo
      var animatedLogoSource = this.state.logoAnimation ? "./../media/site/images/animated-logo.svg" : "./../media/site/images/animated-logo-frame-1.svg";
      var logoPositionChange = this.state.logoPositionChange ? "logo-position-change-animation" : ""
      return (
        <div className={"loading-page " + fadeAnimation}>
          <object id="logoSVG" className={"logo-animation " + logoPositionChange} data={animatedLogoSource} type="image/svg+xml">
            Your browser does not support SVG
          </object>
          <object className="pendulum-animation" data="./../media/site/images/Pendulum.svg" type="image/svg+xml">
            Your browser does not support SVG
          </object>
        </div>
      );
    } else { // Not showing loading screen
      return (
        <span></span>
      )
    }
  }
});

React.render(
  React.createElement(LoadingPage, null),
  document.getElementById('loadingPage')
);
