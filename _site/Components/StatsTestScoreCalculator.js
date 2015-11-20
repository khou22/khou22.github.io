var ScoreCalculator = React.createClass({
  render: function() {
    return (
      <div>
        2015-2016 Honors Statistics
      </div>
    );
  }
})

React.render(
  React.createElement(ScoreCalculator, null),
  document.getElementById('content')
);