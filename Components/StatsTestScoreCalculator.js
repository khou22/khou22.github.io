//Algorithm from: http://appass.com/calculators/statistics
//Grading curve from: https://www.desmos.com/calculator/u3e22vgeq1

var gradingCurve = function(score) {
  var t = .1;
  var n = 1.1;
  var m = 7;
  //Which equation do I use?
  var temp = Math.pow((n * (score - 30)), .5);
  var output = (m * temp) + 40;
  return output; //Return output
}

var ScoreCalculator = React.createClass({
  submitData: function() {
    //Check if all scores are within specified range
    if (document.getElementById('multipleChoice').value) { //Check multiple choice
      if (document.getElementById('multipleChoice').value > 40 || document.getElementById('multipleChoice').value < 0) {
        alert("Please keep scores within the defined domain")
        return false; //Kill
      }
    } else { //If no multiple choice
      alert("Please enter a multiple choice score");
      return false; //Kill
    }
    for (var i = 0; i < 6; i++) { //Check free response questions
      var questionNumber = i + 1;
      var objectID = "question" + questionNumber;
      if (document.getElementById(objectID).value) {
        if (document.getElementById(objectID).value > 4 || document.getElementById(objectID).value < 0) {
          alert("Please keep scores within the defined domain")
          return false; //Kill
        }
      }
    }
    //Collect question data
    var freeResponses = [];
    for (var i = 0; i < 6; i++) {
      var questionNumber = i + 1;
      var objectID = "question" + questionNumber;
      if (document.getElementById(objectID).value) {
        freeResponses.push(parseInt(document.getElementById(objectID).value)); //Add score
      } else {
        freeResponses.push(null); //Push a null
      }
    }

    //Calculate the score
    var max = 100;
    var mcRight = document.getElementById('multipleChoice').value; //Multiple choice score
    var emptyValues = 0;
    var filledValues = 0;
    var total = 0;
    for (var i = 0; i < freeResponses.length; i++) {
      if (freeResponses[i] != null) {
        filledValues++; //Add to counter
        total += freeResponses[i];
      } else { //if not filled out
        emptyValues++; //Add to counter
      }
    }
    // console.log("Filled: " + filledValues)
    // console.log("Empty: " + emptyValues)
    // console.log(total)
    var average = total/filledValues; //Average score per question
    // console.log("Average per question: " + average)

    var numberOfQuestions = 6;
    //Deduct points
    max = max - (40 - mcRight); //Subtract from total
    var pointsWrong = numberOfQuestions * (4 - average);
    max = max - (2 * pointsWrong); //Subtract number wrong
    
    var compositeScore = max;
    console.log("Commposite AP Score: " + compositeScore);
    var triggsScore = gradingCurve(compositeScore);
    console.log("Triggs Score: " + triggsScore);

    document.getElementById('score').innerHTML = triggsScore;
    document.getElementById('APScore').innerHTML = compositeScore;

    return false; //Prevent screen refresh
  },
  render: function() {
    return (
      <div>
        <h1>Test Score Convertor 2015-2016</h1>
        <h3>Mariel Triggs - Honors Stats</h3>
        <br />
        <div>
          <div className="stsc-input-div">
            <UserInput submit={this.submitData.bind(this)}/>
          </div>
          <div className="stsc-output-div">
            AP Composite Score:
            <p className="stsc-score" id="APScore">Waiting to Receive</p>
            <hr />
            Triggs Score:
            <p className="stsc-score" id="score">Waiting to Receive</p>
          </div>
        </div>
      </div>
    );
  }
});

var UserInput = React.createClass({
  render: function() {
    return (
      <div>
        <h3>Input Your Scores:</h3>
        <div className="stsc-instructions">
          <i>It's OK to leave free response scores blank if they're non-existant.</i>
        </div>
        <hr />
        <form onSubmit={this.props.submit.bind(this)}>
          Multiple Choice Right: <input type="text" placeholder="40" size="4" id="multipleChoice" /> /40
          <br />
          FRQ1 Score: <input type="text" placeholder="4" size="4" id="question1" /> /4
          <br />
          FRQ2 Score: <input type="text" placeholder="4" size="4" id="question2" /> /4
          <br />
          FRQ3 Score: <input type="text" placeholder="4" size="4" id="question3" /> /4
          <br />
          FRQ4 Score: <input type="text" placeholder="4" size="4" id="question4" /> /4
          <br />
          FRQ5 Score: <input type="text" placeholder="4" size="4" id="question5" /> /4
          <br />
          FRQ6 Score: <input type="text" placeholder="4" size="4" id="question6" /> /4
          <br />
          <button type="submit" Value="Calculate">Calculate</button>
        </form>
      </div>
    )
  }
})

React.render(
  React.createElement(ScoreCalculator, null),
  document.getElementById('content')
);