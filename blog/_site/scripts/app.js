var App = React.createClass({
  render: function() {
    return (
      <h1>Hello world</h1>
    )
  }
}

React.render(
  React.createElement(App, null)
  document.getElementById('content')
);