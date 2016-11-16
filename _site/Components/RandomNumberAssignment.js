var RandomNumberAssignment = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      elements: []
    }
  },
  onSubmit: function() {
    var elementInput = document.getElementById('elements').value;
  },
  render: function() {
    return (
      <div>
        <h2>Random Number Assignment</h2>
        <p>Assigns element to a random order.</p>
        <br></br>
        <input id="elements" onSubmit={this.onSubmit.bind(this)} />
        <hr />
        <Results />
      </div>
    );
  }
});

var Results = React.createClass({
  render: function() {
    return (
      <div>
      </div>
    )
  }
});

React.render(
  React.createElement(RandomNumberAssignment, null),
  document.getElementById('content')
);
