var reader = new FileReader(); //New reader
var readerOutput = "Default String"; //Declare global
var doneReading = false;
var numberOfFiles = 1;
var currentFile = 0;

var propertyOrder = ["totalWords", "totalSentences"]; //Order in which they are added
var totalWords = 0;
var totalSentences = 0;

reader.onload = function(e) { //Callback if reader is used
  rawText = reader.result; //Stores the results
  // console.log(rawText)

  if (document.getElementById('NoFormat').checked || document.getElementById('Analyze').checked) {
    readerOutput = rawText;
  }
  if (document.getElementById("FacebookMessageData").checked) {
    var frontSplit = "Kevin Hou"
    if (document.getElementById("FacebookName").value) {
      frontSplit = document.getElementById("FacebookName").value; //Get user's name
    }
    if (document.getElementById('Conversation').checked) { //If for specific users
      var otherName = "";
      if (document.getElementById('ConversationUser').value) { //If entered other user's name
        otherName = document.getElementById('ConversationUser').value;
      console.log(otherName.indexOf(','))
        if (otherName.indexOf(',') >= 0) {
          otherName = otherName.split(',');
          console.log("Detected multiple names");
        } else {
          otherName = [otherName, "3RR0R"]; //So that the otherName value will still be an array
        }
        alert(otherName[0])
        var finalRaw = "";
        for (var name = 0; name < otherName.length; name++) {
          // console.log(rawText);
          // console.log(otherName);
          // console.log(otherName[name])
          var friend = otherName[name].trim();
          // console.log(friend)
          if (rawText.indexOf("user\">" + friend)) { //If found a message with the other person
            document.getElementById('downloadlink').innerHTML = "Finding Conversations with " + friend + "...";
            console.log("Finding Conversations with", friend + "...");
            var temp = rawText.split("user\">" + friend)
            for (var i = 0; i < temp.length; i++) {
              // console.log(temp[i].indexOf("user\">" + frontSplit));
              if (temp[i].indexOf("user\">" + frontSplit)) { //Chop off extranious
                // console.log("Found user's name in the array");
                // console.log(temp[i])
                finalRaw += temp[i]; //First element in the array and add a period at the end of each message
              }
            }
            // console.log(rawText)
          } else {
            console.log("Please enter the other user's exact Facebook name");
            Alert("Please enter the other user's exact Facebook name");
          }
        }
        rawText = finalRaw; //Reset rawText to new string
        console.log("Found only messages from:", friend);
      } else {
        console.log("Please enter the other user's exact Facebook name");
        Alert("Please enter the other user's exact Facebook name");
      }
    }
    console.log("Format: Facebook Message Data")
    console.log("Name: " + frontSplit)
    var front = rawText.split("user\">" + frontSplit); //Split at the front
    // console.log(front)
    var back = [];
    var percentageDone = 0;
    document.getElementById('downloadlink').innerHTML = "Parsing Message Content...";
    console.log("Parsing Message Content...");
    for (var i = 0; i < front.length; i++) {
      percentageDone = 100 * (i/front.length);
      console.log(percentageDone);
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
    for (var i = 0; i < back.length; i++) {
      readerOutput += " " + back[i] + "."; //Add period after every new message
    }
  }
  // console.log("File Reader Complete"); //Feedback
  // console.log(readerOutput)
  // console.log(readerOutput)
  currentFile++; //Next file
  // console.log("Next file");
  doneReading = true;
}

var textFile = null,
 makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
};

var waitInterval;

var StrToArray = function(data) {
  // console.log(data);
  console.log("Counting unique words");
  document.getElementById('downloadlink').innerHTML = "Counting Words...";
  var strArray = [];
  var splitAt = [" ", "<", ">", "\n", "\r"]; //What constitutes a new word, includes carriage returns

  //Count sentences
  totalSentences = data.split(".").length;
  console.log(totalSentences);

  //Remove carriage returns
  data = data.replace(/(\r\n|\n|\r)/gm,' '); //Replace carriage returns with spaces, doesn't seem to work

  data = data.replace(/\./g,' '); //Replace periods with spaces
  data = data.replace(/\s{2,10}/g, ' '); //Replace instances of more than one space

  //Replace all punctuation
  data = data.replace(/[.,-\/#!$%\^&\*;:{}=\-_`"~()]/g,' '); //Replace ALL punctuation

  var array1 = data.split(splitAt[0]);
  for (var i = 0; i < array1.length; i++) {
    strArray.push(array1[i]); //First split
  }
  for (var z = 1; z < splitAt.length; z++) { //All other splits
    console.log(z/splitAt.length)
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
  // console.log(strArray.length); //Feedback - number of words
  totalWords = strArray.length;
  return(strArray); //Return array
};

var TextAnalysis = React.createClass({
  getInitialState: function() {
    return {
      wordList: [],
      wordListCount: [],
      fileName: "NA",
      fileSize: 0,
      fileType: "NA",
      fileLastModified: 0,
      fileLastModifiedDate: new Date(1998, 0, 1, 7, 10, 22, 0),
      showModal: "false",
      currentPercentage: 0,
      fleschKincaid: 0,
      readingEase: 0
    }
  },
  loadFile: function() {
    document.getElementById('downloadlink').innerHTML = "Working...";
    if (currentFile < numberOfFiles) {
      console.log("Loading file", currentFile); //Feedback
      var files = document.getElementById('selectedFile').files;
      numberOfFiles = files.length;
      var selectedFile = files[currentFile]; //Find file
      // console.log(selectedFile.size); //Feedback
      var temp = selectedFile.name;
      if (selectedFile.name.indexOf('.txt')) {
        console.log("Removing extension")
        temp = temp.replace('.txt', '');
      }
      if (selectedFile.name.indexOf('Data — ')) {
        console.log("Removing 'Data — ' prefix")
        temp = temp.replace('Data - ', '');
      }
      console.log(temp)
      this.setState({ //Save the file details
        fileName: temp,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileLastModified: selectedFile.lastModified,
        fileLastModifiedDate: selectedFile.lastModifiedDate
      });
      waitInterval = setInterval(this.uploadComplete.bind(this), 1000); //Create artificial callback to allow reader to do its work
      reader.readAsText(selectedFile); //Use the reader
    } else {
      console.log("Done loading all files")

      clearInterval(waitInterval)
      // console.log(readerOutput.length)
      if (document.getElementById('Analyze').checked == false) { //Compressing
        var strArray = StrToArray(readerOutput)
        console.log("Compressing...");
        // *******   Word usage   *******
        console.log("Starting deconstruction")
        document.getElementById('downloadlink').innerHTML = "Compressing...";
        var uniqueWords = [];
        var uniqueWordsCount = [];
        var sortedWordsCount = [];
        // console.log("Parsing", strArray);
        var percentageDone = 0;
        for (var i = 0; i < strArray.length; i++) {
          percentageDone = 100 * (i/strArray.length);
          console.log(percentageDone);
          var foundWord = false;
          for (var j = 0; j < uniqueWords.length; j++) {
            if (strArray[i] == uniqueWords[j]) { //If find match
              uniqueWordsCount[j] = uniqueWordsCount[j] + 1; //Increase count for that word
              sortedWordsCount[j] = sortedWordsCount[j] + 1;
              foundWord = true;
            }
          }
          if (!foundWord) {
            uniqueWords.push(strArray[i]); //Add to arrays
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
        document.getElementById('downloadlink').innerHTML = "Packaging...";
        console.log("Packaging...")
        percentageDone = 0;
        for (var i = sortedWordsCount.length; i >= 0; i+= -1) {
          percentageDone = 100 * ((sortedWordsCount.length - i)/sortedWordsCount.length);
          console.log(percentageDone);
          for (var j = 0; j < uniqueWordsCount.length; j++) {
            // console.log(sortedWordsCount[i], "vs", uniqueWordsCount[j])
            if (sortedWordsCount[i] == uniqueWordsCount[j]) {
              if (document.getElementById('BigData').checked) { //If doing big data
                var threshold = 10; //Default 10
                if (document.getElementById('BigDataValue').value) {
                  threshold = document.getElementById('BigDataValue').value;
                }
                if (sortedWordsCount[i] > threshold) {
                  sortedWords.push(uniqueWords[j]);
                  uniqueWordsCount.splice(j, 1);
                  uniqueWords.splice(j, 1);
                }
              } else {
                sortedWords.push(uniqueWords[j]);
                uniqueWordsCount.splice(j, 1);
                uniqueWords.splice(j, 1);
              }
            }
          }
        }

        sortedWords.reverse();
        // console.log(sortedWords, sortedWords.length); //Debugging
        // console.log("Sorted", sortedWordsCount, sortedWordsCount.length); //Debugging

        var temp = "totalWords=" + totalWords + ";";
        temp += "totalSentences=" + totalSentences + ";";
        console.log(temp)

        temp += "{[()]}";
        for (var i = 0; i < sortedWords.length; i++) {
          temp += sortedWords[i] + "|" + sortedWordsCount[i] + "~";
        }
        // console.log(temp)
        readerOutput = temp;
        // console.log(readerOutput)
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(readerOutput); //Create the download file
        link.style.display = 'block';
        document.getElementById('downloadlink').innerHTML = "Download";
        console.log("Download Ready");

      } else { //If analyzing
        document.getElementById('downloadlink').innerHTML = "Analyzing...";
        console.log("Analyzing...");
        var details = readerOutput.split("{[()]}")[0];

        //Read properties
        var properties = details.split(";");
        var propertyValues = [];
        for (var i = 0; i < properties.length - 1; i++) { //Don't count last one
          propertyValues.push(properties[i].split("=")[1]);
        }
        // console.log(propertyValues)


        var wordUsage = readerOutput.split("{[()]}")[1];
        var ray = wordUsage.split("~");
        // console.log(ray)

        var wordObj = "["; //Start JSON data structure

        ray.splice(ray.length - 1, 1); //Cut off the undefined at the end
        var a = [];
        var b = [];
        for (var i = 0; i < ray.length; i++) {
          var ray2 = ray[i].split("|");
          var temp = ray2[0];
          if (ray2[0].indexOf("039") >= 0) {
            // console.log("Found:", ray2[0]);
            temp = ray2[0].replace("&#039;", "\'"); //Replace the special characters
            temp = temp.replace("039", "\'"); //Remove apostrophe
            // console.log("Convertered to:", temp)
          };
          temp = temp.replace(/[.,-\/#!$%\^&\*;:{}=\-_`"~()]/g,' '); //Replace ALL punctuation
          temp = temp.replace(/\s{2,10}/g, ''); //Remove all instances of multiple spaces in a row
          temp = temp.replace(/\s+/g, ''); //Remove all instances of a single space
          temp = temp.trim();
          a.push(temp); //Words
          b.push(ray2[1]); //Count

          wordObj += "{\"Word\"\:\"" + temp + "\", ";
          wordObj += "\"Frequency\"\:\"" + ray2[1] + "\", ";
          wordObj += "\"Length\"\:\"" + temp.length + "\", ";
          wordObj += "\"Syllables\"\:\"" + syllableCount(temp) + "\"";
          wordObj += "}";
          if (i != ray.length - 1) { //If not the last one
            wordObj += ", ";
          }
        }
        wordObj += "]"
        // console.log(wordObj); //JSON object string

        //Count total syllables
        var totalSyllables = 0;
        for (var i = 0; i < a.length; i++) {
          var syllables = syllableCount(a[i]);
          totalSyllables += syllables * b[i]; //Add syllables to total count
        }
        propertyOrder.push("totalSyllables");
        propertyValues.push(totalSyllables);
        // console.log(propertyOrder);
        // console.log(propertyValues);

        this.setState({
          wordList: a,
          wordListCount: b
        })
        document.getElementById('downloadlink').innerHTML = "Analysis Done";

        //Property feedback
        for (var i = 0; i < propertyValues.length; i++) {
          console.log(propertyOrder[i], propertyValues[i]);
        };

        // order within array: totalWords, totalSentences, totalSyllables
        totalWords = propertyValues[0];
        totalSentences = propertyValues[1];
        totalSyllables = propertyValues[2];

        var readingEase = 206.835 - (1.015 * (totalWords/totalSentences)) - (84.6 * (totalSyllables/totalWords));
        var fleschKincaid = (.39 * (totalWords/totalSentences)) + (11.8 * (totalSyllables/totalWords)) - 15.59;
        this.setState({
          readingEase: readingEase,
          fleschKincaid: fleschKincaid
        });

        //Logic after anlaysis is done
        this.loadCommonWordsFromServer(); //Load general data from offline JSON

        //Generate an excel spreadsheet
        console.log("Added JSON data");
        JSONToCSVConvertor(wordObj, this.state.fileName, true, false);
      }

    }
    return false; //Prevent page auto-refresh
  },
  uploadComplete: function() {
    if (doneReading) {
      if (currentFile <= numberOfFiles) {
        doneReading = false;
        this.loadFile(); //Do it again
      } else {
        clearInterval(waitInterval)
        // console.log("Done with all files")
        // console.log(readerOutput.length)
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
  loadCommonWordsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.retrieveData(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, "||", status, "||", err.toString());
      }.bind(this)
    });
  },
  retrieveData: function(data) {
    this.setState({data: data});
    console.log(data)
  },
  render: function() {
    var temp = this.state.fileName.replace(/ /g,"_"); //Replace spaces
    var downloadName = "Data - " + temp + ".txt";
    return (
      <div>
        <div className="TA-file-input">
          <div className="TA-options">
            <form onSubmit={this.loadFile.bind(this)}>
              Select text file: <input type="file" id="selectedFile" name="text" accept="." multiple/>
              <input type="radio" name="Analysis Type" value="Analyze" id="Analyze"/> Analyze Compressed<br />
              <b>Compress: </b><br />
              <input type="radio" name="Analysis Type" value="NA" id="NoFormat"/> No Special Format<br />
              <input type="radio" name="Analysis Type" value="Facebook Messages" id="FacebookMessageData" /> Compress Facebook Messages<br />
              Exact Facebook Name: <input type="text" name="Facebook Name" placeholder="Kevin Hou" id="FacebookName" /> <br />
              <input type="checkbox" name="Conversation" value="Conversation" id="Conversation" size="4" /> Other User: <input type="text" name="Conversation User" placeholder="User1, User 2, etc." id="ConversationUser" /><br />
              <input type="checkbox" name="Big Data" value="Big Data" id="BigData" size="4" /> Big Data: <input type="text" name="Big Data Value" placeholder="10" id="BigDataValue" /><br />
              <button type="submit" Value="Analyze">Go</button> <CheckInput fileName={this.state.fileName}
                fileSize={this.state.fileSize}
                fileType={this.state.fileType}
                fileLastModified={this.state.fileLastModified}
                fileLastModifiedDate={this.state.fileLastModifiedDate}
                showModal={this.state.showModal}
                toggleModal={this.toggleModal}/>
            </form>
          </div>
          <div className="TA-download">
            <p>Open Console to View Progress</p><br />
            <a download={downloadName} id="downloadlink" >Ready to Receive</a>
          </div>
        </div>
        <Analysis wordList={this.state.wordList}
          wordListCount={this.state.wordListCount}
          toggleModal={this.toggleModal}
          fleschKincaid={this.state.fleschKincaid}
          readingEase={this.state.readingEase}/>
      </div>
    )
  }
});

var CheckInput = React.createClass({
  render: function() {
    if (readerOutput != "Default String") {
      return (
        <span>
          <FileInputModal showModal={this.props.showModal}
            toggleModal={this.props.toggleModal}
            fileName={this.props.fileName}
            fileSize={this.props.fileSize}
            fileType={this.props.fileType}
            fileLastModified={this.props.fileLastModified}
            fileLastModifiedDate={this.props.fileLastModifiedDate}/>
          <button onClick={this.props.toggleModal.bind(this, "fileInfo")}>Show File Data</button>
        </span>
      )
    } else {
      return (
        <span>
        </span>
      )
    }
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
  render: function() {
    var counter = 0;
    var frequency = this.props.wordListCount;
    var tableNodes = this.props.wordList.map(function(word) {
      counter++;
      return (
        <tr>
          <td className="TA-word-list">{word}</td>
          <td className="TA-word-list-count">{frequency[counter - 1]}</td>
        </tr>
      );
    });
    var readingEase = Math.round(100 * this.props.readingEase)/100;
    var gradeLevel = Math.round(100 * this.props.fleschKincaid)/100; //Two decimals
    return (
      <div>
        <div className="TA-scores-div">
          <b>Scores</b><br />
          <b>Reading Ease: {readingEase}</b><br />
          <b>Flesch-Kincaid Grade Level: {gradeLevel}</b><br />
          <br />
          Reading Ease Key:<br />
          90.0–100.0  easily understood by an average 11-year-old student<br />
          60.0–70.0 easily understood by 13- to 15-year-old students<br />
          0.0–30.0  best understood by university graduates<br />
          <br />
          Flesch-Kincaid Key:<br />
          Number corresponds to US grade level.
        </div>
        <table className="TA-word-list-table">
          {tableNodes}
        </table>
      </div>
    )
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="TA-header">Text Analysis App</h1>
        <br />
        <h4>By: Kevin Hou</h4>
        <b>Started:</b> October 17 2015 8:20 PST <br />
        <TextAnalysis url={"data.json"}
          pollInterval={2000}/>
        <hr />
        <b>Instructions:</b>
        <p>This is a two step process. First <b>compress</b> your file(s):</p>
        <ol>
          <b>Regular Text</b>
          <li>Upload the file(s) by pressing the 'Choose Files' button</li>
          <li>Select the 'No Special Format' radio button</li>
          <li>If you have a slow computer, browser, massive file, or no patience, check big data to speed up the process. A high number corresponds with a faster process but less data.</li>
          <li>Click 'Go'</li>
          <li>Wait until the compression is complete (this can take a long time) then click download</li>
        </ol>
        <ol>
          <b>Facebook Message Data</b>
          <li>Download your Facebook user data if you haven't already. <a href="https://www.facebook.com/help/131112897028467/">Need help?</a></li>
          <li>Locate the 'message.htm' file in the downloaded folder <i>(root/html/message.htm)</i></li>
          <li>Change the file type to a plain text file by renaming the file to: <i>message.txt</i></li>
          <li>Open the terminal and navigate to your message.txt directory. <a href="http://mally.stanford.edu/~sr/computing/basic-unix.html">Unix Commands</a></li>
          <li>Enter the following: <i>directory-containing-file  split -b 4m messages.txt</i><br />
            It should look like this: <i>$: directory-containing-file  split -b 4m messages.txt</i></li>
          <li>Upload the file(s) by pressing the 'Choose Files' button</li>
          <li>Select the 'Compress Facebook Messages' radio button</li>
          <li>If you want to limit the text to only certain conversations, type the user(s) seperated by commas.</li>
          <li>Check the 'Big Data' checkbox and enter at least '50' into the text field</li>
          <li>Click 'Go'</li>
          <li>Wait until the compression is complete (this can take a long time) then click download</li>
        </ol>
        *Checking "Big Data" cuts the words with frequencies under the specified number
        <br />
        <p>Now we can <b>analyze</b> our compressed data</p>
        <ol>
          <li>Refresh the page to clear the cache</li>
          <li>Find the downloaded, compressed folder in your downloads folder. It should be named: <i>Compressed_Data.txt</i></li>
          <li>Select the 'Analyze Compressed' radio button</li>
          <li>Click go and see what you uncover!</li>
        </ol>
      </div>
    )
  }
});

/*JSON to CSV Converter (found at: http://jsfiddle.net/hybrid13i/JXrwM/)*/
/* ************************************************************************************* */
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, AutomaticDownload) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    // //Set Report title in first row or line
    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "Word_Usage_Excel - ";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension


    if (AutomaticDownload) {
      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      //This part will append the anchor tag and remove it after automatic click
      //This code causes the file to automatically download
      console.log("Download the CSV file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      //This code will create a link for the user to download the data
      var downloadLink = document.getElementById('downloadlink');
      downloadLink.href = uri; //Create the download CSV file
      downloadLink.style = "visibility:hidden";
      downloadLink.download = fileName + ".csv";
      downloadLink.style.display = 'block';
      document.getElementById('downloadlink').innerHTML = "Download Spreadsheet";
    }
}
/* *************************************************************************************  */

/*Local Syllable Count Function*/
//Found here: http://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript
function syllableCount(word) {
  if (word == "null") { //If variable is undefined
    return 0;
  }
  word = word.toLowerCase(); //Downcase
  if(word.length <= 3) { return 1; } //Return 1 if fewer than 3 letters
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, ''); //word.sub!(/^y/, '')
  var final = word.match(/[aeiouy]{1,2}/g); //word.scan(/[aeiouy]{1,2}/)
  if (final != null) { //If exists
    return final.length; //Return length
  } else {
    return 0; //Otherwise return 0
  }
}

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
