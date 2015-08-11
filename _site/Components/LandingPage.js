var LandingPage = React.createClass({
  render: function() {
    return (
      <div>
        <div className="content-area">
          <ProfileBox />
          Click <a href="/blog">here</a> for my blog
        </div>
        <div className="landing-background"></div>
      </div>
    );
  }
});

var ProfileBox = React.createClass({
  render: function() {
    return (
      <h1>Hello</h1>
    );
  }
});

React.render(
  React.createElement(LandingPage, null),
  document.getElementById('content')
);