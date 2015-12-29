var App = React.createClass({
  render: function() {
    return (
      <div>
        Time Calculator
        <p>This is a work in progress. Started: December 16, 2015 19:15 PST</p>
        <InputField />
      </div>
    );
  }
});

var InputField = React.createClass({
  submitTimes: function() {
    console.log("Submitted times");
  },
  addFields: function() {
    
  },
  render: function() {
    return (
      <div>
        <p className="tcalc-instructions-text">
          Type your times below. You may input up to 3.
        </p>
        <div className="tcalc-input-div">
          
        </div>
      </div>
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);