var App = React.createClass({
  render: function() {
    return (
      <div>
        Time Calculator
        <p>This is a work in progress. Started: December 16, 2015 19:15 PST</p>
      </div>
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);