var RandomNumberAssignment = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      elements: []
    }
  },
  onSubmit: function() {
    var elementInput = document.getElementById('elements').value;

    var elements = elementInput.split(',');

    var numAssignments = []; // Track what's been assigned
    for (var i = 0; i < elements.length; i++) {
      numAssignments[i] = false; // Default not used
    }

    // Clean up array and give number
    for (var i = 0; i < elements.length; i++) {
      var chosen = false;
      var number;
      while (!chosen) {
        // Random index for an array of length elements.length
        var randomNumber = Math.round(Math.random() * (elements.length - 1));

        if (!numAssignments[randomNumber]) { // If not used yet
          number = randomNumber; // Store which value
          numAssignments[randomNumber] = true; // Can't use anymore
          chosen = true; // Leave while loop
        }
      }
      elements[i] = {
        item: elements[i].trim(), // Cut off white space
        number: number + 1 // This way lowest number is 1
      }
    }

    // Update state
    this.setState({
      elements: elements
    })
  },
  render: function() {
    return (
      <div>
        <h2>Random Number Assignment</h2>
        <p>Assigns element to a random order.</p>
        <br></br>
        <h4>Elements (Seperate by commas)</h4>
        <textarea id="elements" className="rna-textarea-input"></textarea>
        <br></br>
        <button onClick={this.onSubmit.bind(this)}>Generate</button>
        <hr />
        <Results elements={this.state.elements}/>
      </div>
    );
  }
});

var Results = React.createClass({
  render: function() {
    var elementNodes = this.props.elements.map(function(element) {
      return (
        <div className="rna-element-node">
          {element.item} - {element.number}
        </div>
      )
    })
    return (
      <div className="rna-element-results">
        {elementNodes}
      </div>
    )
  }
});

React.render(
  React.createElement(RandomNumberAssignment, null),
  document.getElementById('content')
);
