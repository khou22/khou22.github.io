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
  render: function() {
    return (
      <div>
        <p class="tcalc-instructions-text">
          Type your times below. You may input up to 3.
        </p>
        <div className="tcalc-input-div">
          <form>
            <TimeInput />
            <TimeInput />
            <TimeInput />
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
});

var TimeInput = React.createClass({
  render: function() {
    return (
      <span>
        <input type="number" className="tcalc-hour-input" />:
        <input type="number" className="tcalc-minutes-input" />
        <br />
      </span>
    );
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);