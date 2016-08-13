// Standard landing page
var LoadingPage = React.createClass({
  render: function() {
    return (
      <div className="loading-page">
        <object data="./../media/site/images/Pendulum.svg" type="image/svg+xml">
          Your browser doesn't support SVG
        </object>
      </div>
    );
  }
});

React.render(
  React.createElement(LoadingPage, null),
  document.getElementById('loadingPage')
);
