var httpGetAsync = function(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

var HerokuAPITest = React.createClass({
	getInitialState: function() {
		return {
			random: 1
		}
	},
  clickedButton: function() {
    console.log("Calling Heroku API...");
    var url = "https://khou22.herokuapp.com/test/3";
    // var url = "http://localhost:5000/test/2";

    httpGetAsync(url, function(response) {
      console.log(response);
    })
  },
	render: function() {
		return (
			<div>
				<h1>Heroku API Test</h1>
        <button onClick={this.clickedButton}>Test</button>
			</div>
		);
	}
})

React.render(
	React.createElement(HerokuAPITest, null),
	document.getElementById('content')
);
