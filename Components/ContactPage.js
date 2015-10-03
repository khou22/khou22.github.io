var ContactPage = React.createClass({
  render: function() {
    console.log("Working")
    return (
      <h1>Hi</h1>
    );
  }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);