var reader = new FileReader(); //New reader
var readerOutput = "Default String"; //Declare global
var doneReading = false;
reader.onload = function(e) { //Callback if reader is used
  readerOutput = reader.result; //Stores the results
  console.log("File Reader Complete"); //Feedback
  doneReading = true;
}

var waitInterval;

var StrToArray = function(data) {
  // console.log(data);
  var strArray = [];
  var splitAt = [" ", "-", "<", ">"]; //What constitutes a new word
  var array1 = data.split(splitAt[0]);
  for (var i = 0; i < array1.length; i++) {
    strArray.push(array1[i]); //First split
  }
  for (var z = 1; z < splitAt.length; z++) { //All other splits
    for (var i = 0; i < strArray.length; i++) {
      if (strArray[i].indexOf(splitAt[z])) {
        var array = strArray[i].split(splitAt[z]);
        for (var j = 0; j < array.length; j++) {
          strArray.push(array[j]);
        }
        strArray.splice(i, 1); //Remove element
      }
    }
  }
  // console.log(strArray); //Feedback
  return(strArray); //Return array
};

var TextAnalysis = React.createClass({
  getInitialState: function() {
    return {
      textInput: "Five Five Four Three Four Five Five Too Too Three Two Four Three Five One Four Two",
      fileName: "NA",
      fileSize: 0,
      fileType: "NA",
      fileLastModified: 0,
      fileLastModifiedDate: new Date(1998, 0, 1, 7, 10, 22, 0),
      showModal: "false"
    }
  },
  loadFile: function() {
    // console.log("Loading file"); //Feedback
    var selectedFile = document.getElementById('selectedFile').files[0]; //Find file
    console.log(selectedFile.size); //Feedback
    this.setState({ //Save the file details
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      fileLastModified: selectedFile.lastModified,
      fileLastModifiedDate: selectedFile.lastModifiedDate
    });
    waitInterval = setInterval(this.uploadComplete.bind(this), 1000); //Create artificial callback to allow reader to do its work
    reader.readAsText(selectedFile); //Use the reader
    return false; //Prevent page auto-refresh
  },
  uploadComplete: function() {
    if (doneReading) {
      clearInterval(waitInterval)
      console.log(readerOutput.length);
      console.log("Setting state");
      this.setState({
        textInput: readerOutput
      })
      console.log("Set state")
    }
  },
  toggleModal: function(input) {
    console.log("Switching to", input)
    this.setState({
      showModal: input
    });
    return false; //Prevent page auto-refresh
  },
  render: function() {
    return (
      <div>
        <div className="TA-file-input">
          <form onSubmit={this.loadFile.bind(this)}>
            Select text file: <input type="file" id="selectedFile" name="text" accept=".txt" />
            <input type="submit" Value="Analyze"/>
          </form>
        </div>
        <CheckInput textInput={this.state.textInput}
          fileName={this.state.fileName}
          fileSize={this.state.fileSize}
          fileType={this.state.fileType}
          fileLastModified={this.state.fileLastModified}
          fileLastModifiedDate={this.state.fileLastModifiedDate}
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}/>
        <Analysis data={this.state.textInput}
          toggleModal={this.toggleModal}/>
      </div>
    )
  }
});

var CheckInput = React.createClass({
  render: function() {
    return (
      <div>
        <FileInputModal showModal={this.props.showModal}
          textInput={this.props.textInput}
          toggleModal={this.props.toggleModal}
          fileName={this.props.fileName}
          fileSize={this.props.fileSize}
          fileType={this.props.fileType}
          fileLastModified={this.props.fileLastModified}
          fileLastModifiedDate={this.props.fileLastModifiedDate}/>
        <button onClick={this.props.toggleModal.bind(this, "fileInfo")}>Show File Data</button>
      </div>
    )
  }
});

var FileInputModal = React.createClass({
  render: function() {
    if (this.props.showModal == "fileInfo") {
      return (
        <div aria-hidden="false" role="dialog" className="TA-modal">
          <div className="TA-modal-backdrop">
             </div>
          <div className="TA-modal__container">
            <div className="TA-modal__header">
              <h2>File Upload Information</h2>
            </div>
            <div className="TA-modal__content">
              <h3>File Information:</h3>
              <p>Name: <i>{this.props.fileName}</i></p>
              <p>Size: <i>{this.props.fileSize}</i></p>
              <p>Type: <i>{this.props.fileType}</i></p>
              <p>Last Modified: <i>{this.props.fileLastModified}</i></p>
              <p>Date Last Modified: <i>{this.props.fileLastModifiedDate.toString()}</i></p>
              Text:
              <p>{this.props.textInput}</p>
            </div>
            <div className="TA-modal__footer">
              <button onClick={this.props.toggleModal.bind(this, "false")}>Close</button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <span>
        </span>
      )
    }
  }
})

var Analysis = React.createClass({
  getInitialState: function() {
    var data = this.props.data;
    var strArray = StrToArray(data); //Run function
    return {
      str: this.props.data,
      strArray: strArray,
      uniqueWords: [],
      uniqueWordsCount: []
    }
  },
  componentWillReceiveProps: function(props) { //Repeat the breakdown every time text is changed
    var data = props.data;
    var strArray = StrToArray(data); //Run function
    this.setState({
      str: props.data,
      strArray: strArray
    });
  },
  render: function() {
    
    // *******   Word usage   *******
    var uniqueWords = [];
    var uniqueWordsCount = [];
    var sortedWordsCount = [];
    // console.log("Parsing", this.state.strArray);
    for (var i = 0; i < this.state.strArray.length; i++) {
      var foundWord = false;
      for (var j = 0; j < uniqueWords.length; j++) {
        if (this.state.strArray[i] == uniqueWords[j]) { //If find match
          uniqueWordsCount[j] = uniqueWordsCount[j] + 1; //Increase count for that word
          sortedWordsCount[j] = sortedWordsCount[j] + 1;
          foundWord = true;
        }
      }
      if (!foundWord) {
        uniqueWords.push(this.state.strArray[i]); //Add to arrays
        uniqueWordsCount.push(1);
        sortedWordsCount.push(1);
      }
    }
    // console.log(uniqueWords); //Feedback
    // console.log(uniqueWordsCount); //Feedback

    var sortedWords = [];
    sortedWordsCount.sort(function(a, b){return b-a}); //Sort down
    // console.log("Not sorted", uniqueWordsCount);
    // console.log("Sorted", sortedWordsCount);

    var indexes = [];
    for (var i = sortedWordsCount.length; i >= 0; i+= -1) {
      for (var j = 0; j < uniqueWordsCount.length; j++) {
        // console.log(sortedWordsCount[i], "vs", uniqueWordsCount[j])
        if (sortedWordsCount[i] == uniqueWordsCount[j]) {
          sortedWords.push(uniqueWords[j]);
          uniqueWordsCount.splice(j, 1);
          uniqueWords.splice(j, 1);
        }
      }
    }

    sortedWords.reverse();
    // console.log(sortedWords.reverse());
    // console.log("Sorted", sortedWordsCount);

    var counter = 0;
    var wordUsageTable = sortedWords.map(function(word) {
      counter++; //Must be before the return
      return (
        <tr>
          <td>{word}</td>
          <td>{sortedWordsCount[counter-1]}</td>
        </tr>
      )
    })
    
    return (
      <div>
        <table>
          {wordUsageTable}
        </table>
      </div>
    )
  }
})

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Text Analysis App</h1>
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