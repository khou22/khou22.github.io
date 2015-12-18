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
  render: function() {
    return (
      <div className="tcalc-input-div">
        <form>
          <TimeInput />
        </form>
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
      </span>
    );
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);