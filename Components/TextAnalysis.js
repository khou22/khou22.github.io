var reader = new FileReader(); //New reader
var readerOutput; //Declare global
reader.onload = function(e) { //Callback if reader is used
  readerOutput = reader.result; //Stores the results
  console.log("File Reader Complete"); //Feedback
}
var callbackTime = 1000;

var TextAnalysis = React.createClass({
  getInitialState: function() {
    return {
      textInput: "Kevin Hou"
    }
  },
  loadFile: function() {
    // console.log("Loading file"); //Feedback
    var selectedFile = document.getElementById('selectedFile').files[0]; //Find file
    // console.log(selectedFile); //Feedback
    setTimeout(this.uploadComplete.bind(this), callbackTime); //Create artificial callback to allow reader to do its work
    reader.readAsText(selectedFile); //Use the reader
    return false; //Prevent page auto-refresh
  },
  uploadComplete: function() {
    console.log(readerOutput);
    this.setState({
      textInput: readerOutput
    })
  },
  render: function() {
    return (
      <div>
        <CheckInput textInput = {this.state.textInput} />
        <form onSubmit={this.loadFile.bind(this)}>
          Select text file: <input type="file" id="selectedFile" name="text" accept=".txt" />
          <input type="submit" Value="Analyze"/>
        </form>
      </div>
    )
  }
});

var CheckInput = React.createClass({
  render: function() {
    return (
      <div>
        <p>{this.props.textInput}</p>
      </div>
    )
  }
})

var App = React.createClass({
  render: function() {
    return (
      <div>
        This app analyzes text
        <br />
        Started: October 17 2015 8:20 PST
        <hr />
        <TextAnalysis />
      </div>
    )
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);