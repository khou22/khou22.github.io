var reader = new FileReader(); //New reader
var readerOutput = "Default String"; //Declare global
var doneReading = false;
var numberOfFiles = 1;
var currentFile = 0;
reader.onload = function(e) { //Callback if reader is used
  rawText = reader.result; //Stores the results
  if (document.getElementById("FacebookMessageData").checked) {
    var frontSplit = document.getElementById("FacebookName").value;
    console.log("Format: Facebook Message Data")
    var front = rawText.split(frontSplit); //Split at the front
    // console.log(front)
    var back = [];
    for (var i = 0; i < front.length; i++) {
      var temp = front[i].split("</p>");
      // console.log(temp[0])
      var final = temp[0];
      if (temp[0].indexOf("<p>")) {
        if (temp[0].split("<p>")[1]) { //If it exists
          final = temp[0].split("<p>")[1];
        } else {
          final = "3RR0R";
        }
      } else {
        final = "3RR0R";
      }
      // console.log(final); //Split again and get the last bit (the message)
      if (final != "3RR0R") { //If not an error
        back.push(final);
      }
    }
    readerOutput = "";
    for (var i = 0; i < back.length; i++) {
      readerOutput += " " + back[i];
    }
  }
  console.log("File Reader Complete"); //Feedback
  // console.log(readerOutput)
  // console.log(readerOutput)
  currentFile++; //Next file
  console.log("Next file");
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
    if (currentFile < numberOfFiles) {
      console.log("Loading file", currentFile); //Feedback
      var files = document.getElementById('selectedFile').files;
      numberOfFiles = files.length;
      var selectedFile = files[currentFile]; //Find file
      // console.log(selectedFile.size); //Feedback
      this.setState({ //Save the file details
        fileName: this.state.fileName + ", " + selectedFile.name,
        fileSize: this.state.fileSize + ", " + selectedFile.size,
        fileType: this.state.fileType + ", " + selectedFile.type,
        fileLastModified: this.state.fileLastModified + ", " + selectedFile.lastModified,
        fileLastModifiedDate: this.state.fileLastModifiedDate + ", " + selectedFile.lastModifiedDate
      });
      waitInterval = setInterval(this.uploadComplete.bind(this), 1000); //Create artificial callback to allow reader to do its work
      reader.readAsText(selectedFile); //Use the reader
    } else {
      console.log("Done with all files")
    }
    return false; //Prevent page auto-refresh
  },
  uploadComplete: function() {
    if (doneReading) {
      if (currentFile <= numberOfFiles) {
        doneReading = false;
        console.log("Setting state");
        this.setState({
          textInput: this.state.textInput + " " + readerOutput
        })
        console.log(readerOutput.length);
        console.log("Set state")
        this.loadFile(); //Do it again
      } else {
        clearInterval(waitInterval)
        console.log("Done with all files")
      }
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
            Select text file: <input type="file" id="selectedFile" name="text" accept="." multiple/>
            Exact Facebook Name: <input type="text" name="Facebook Name" value="Kevin Hou" id="FacebookName" /> <br />
            <input type="radio" name="Analysis Type" value="NA" /> No Special Format<br />
            <input type="radio" name="Analysis Type" value="Facebook Messages" id="FacebookMessageData" /> Facebook Messages<br />
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
          <td className="TA-word-list">{word}</td>
          <td className="TA-word-list-count">{sortedWordsCount[counter-1]}</td>
        </tr>
      )
    })
    
    return (
      <div>
        <table className="TA-word-list-table">
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
        <b>Started:</b> October 17 2015 8:20 PST <br />
        <b>Instructions:</b> If you are uploading Facebook message data, find the file, change the file type to .txt, then use unix to split the file into smaller chunks:
        <br />
        $directory-containing-file  split -b 4m messages.txt
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