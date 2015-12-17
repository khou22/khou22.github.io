var App = React.createClass({
  render: function() {
    return (
      <div>
        Time Calculator
      </div>
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);