var LandingPage = React.createClass({
  render: function() {
    return (
      <div className="landing-background">
        Click <a href="/blog">here</a> for my blog
        <img src="./media/blog/images/Woodcraft081015.jpg"></img>
        <img src="./media/site/images/Profile.jpg"></img>
      </div>
    );
  }
});
React.render(
  React.createElement(LandingPage, null),
  document.getElementById('content')
);