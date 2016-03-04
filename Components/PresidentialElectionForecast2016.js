var App = React.createClass({ // Main parent component
  getInitialState: function() {
    return {
      // Main object
      candidates: [
        {
          name: "Trump",
          percentage: .374,
          votes: 0
        },
        {
          name: "Rubio",
          percentage: .252,
          votes: 0
        },
        {
          name: "Cruz",
          percentage: .180,
          votes: 0
        },
        {
          name: "Kasich",
          percentage: .147,
          votes: 0
        },
        {
          name: "Lost Voters",
          percentage: .047,
          votes: 0
        },
      ],
      totalVoters: 0,
    }
  },
  onSubmit: function() {
    numVoters = 1321575; // Total number of voters we're simulating
    // Quinn and I decided to use the number of Mitt Romney voters in Minnesota 2012 as the default:
    // 1,321,575
    // http://elections.nbcnews.com/ns/politics/2012/minnesota/#.VtkAsZMrJhF

    var totalVoters = 0; // Current count of voters
    var tempArray = [0, 0, 0, 0, 0]; // Array to store values in local scope

    // Figure out the cutoff points for the random number
    var cutoffs = []; // Reset
    var sum = 0; // Reset
    for (var i = 0; i < this.state.candidates.length; i++) {
      var value = sum + this.state.candidates[i].percentage;
      sum = value; // Add to sum
      cutoffs.push(value); // Push to array
    }
    // console.log(cutoffs); // Debugging

    for (var i = 0; i < numVoters; i++) {
  		totalVoters++; // Add to total counter
  		var random = Math.random(); // Generate random number
      // console.log(random); // Feedback

      // Determine which candidate they voted for
  		if (random < cutoffs[0]) {
  			tempArray[0]++;
        // console.log("Voted for Trump");
  		} else if (random < cutoffs[1]) {
  			tempArray[1]++;
        // console.log("Voted for Rubio");
  		} else if (random < cutoffs[2]) {
  			tempArray[2]++;
        // console.log("Voted for Cruz");
  		} else if (random < cutoffs[3]) {
  			tempArray[3]++;
        // console.log("Voted for Kasich");
  		} else {
  			tempArray[4]++;
        // console.log("Lost Voter");
  		}
  	}

    // Temp object
    var tempCandidates = [];
    for (var i = 0; i < 5; i++) {
      var name = this.state.candidates[i].name;
      var percentage = this.state.candidates[i].percentage;
      var objectToPush = { // Declare object
        name: name,
        percentage: percentage,
        votes: tempArray[i]
      }
      tempCandidates.push(objectToPush); // Add to array
    }

    // Save to state
    this.setState({
      candidates: tempCandidates,
      totalVoters: totalVoters
    })
  },
  render: function() {
    return (
      <div>
        <h2>2016 Presidential Election Forecast</h2>
        <p>This is a work in progress. Started: March 3, 2016 19:30 PST</p>
        <InputField onSubmit={this.onSubmit}/>
        <Results
          candidates={this.state.candidates}
          totalVoters={this.state.totalVoters} />
      </div>
    );
  }
});

var InputField = React.createClass({ // User input
  getInitialState: function() {
    return {

    }
  },
  render: function() {
    return (
      <div>
        <button onClick={this.props.onSubmit.bind(this)}>Simulate</button>
      </div>
    );
  }
});

var Results = React.createClass({ // Show results of simulation
  render: function() {
    var totalVoters = this.props.totalVoters;
    var candidateNodes = this.props.candidates.map(function(candidate) { // Map out the object
      var name = candidate.name;
      var votes = candidate.votes;
      var percentage = Math.round(1000 * votes/totalVoters)/10; // Round to the nearest 10th
      return (
        <p>{name}: {votes} ({percentage})</p>
      )
    })
    return (
      <div>
        <h3>Results</h3>
        {candidateNodes}
      </div>
    )
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
