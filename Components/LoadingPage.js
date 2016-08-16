// Standard landing page
var LoadingPage = React.createClass({
  getInitialState: function() {
    var loadingScreenDuration = 5000;
    var fadeOutTime = 1000;

    setTimeout(this.hideLoading.bind(this), loadingScreenDuration); // Loading page lasts for 3000 seconds
    setTimeout(this.startFade.bind(this), loadingScreenDuration - fadeOutTime); // Loading page lasts for 3000 seconds

    return {
      loadingVisible: true,
      fadeAnimation: false
    }
  },
  hideLoading: function() {
    this.setState({
      loadingVisible: false
    });
  },
  startFade: function() {
    console.log("Fading");
    this.setState({
      fadeAnimation: true
    })
  },
  render: function() {
    if (this.state.loadingVisible) { // Showing loading screen
      var fadeAnimation = this.state.fadeAnimation ? "fade-loading-screen" : "";
      console.log(fadeAnimation);
      return (
        <div className={"loading-page " + fadeAnimation}>
          <object className="logo-animation" data="./../media/site/images/animated-logo.svg" type="image/svg+xml">
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
