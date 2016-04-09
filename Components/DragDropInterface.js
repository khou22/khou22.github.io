var App = React.createClass({ //Main parent component
  getInitialState: function() {
    return {
      list: [
        {
          label: "x",
          color: "red",
          order: 0
        },
        {
          label: "3x",
          color: "blue",
          order: 3
        },
        {
          label: "4x",
          color: "purple",
          order: 2
        },
        {
          label: "2x",
          color: "green",
          order: 1
        },
      ]
    }
  },
  setDropIndex: function(index) { // Store index you're dropping over
    console.log("Dropping object over", index); // Feedback
  },
  setDragObject: function(index) { // Store index of what you're dropping
    console.log("Dragging object", index)
  },
  render: function() {
    var data = this.state.list;
    var maxElements = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].order > maxElements) {
        maxElements = data[i].order; // Set the size of the array
      }
    }
    maxElements += 1; // Because index starts at 0
    var sortedArray = [];
    for (var i = 0; i < maxElements; i++) { // Create empty object
      sortedArray.push({}); // Push empty object
    }
    for (var i = 0; i < data.length; i++) {
      desiredPlace = data[i].order;
      sortedArray[desiredPlace] = data[i];
    } // sortedArray now in order
    var setDropIndex = this.setDropIndex; // Must keep this outside of the mapping because of scope
    var setDragObject = this.setDragObject; // Set which object is being dragged
    var listNodes = sortedArray.map(function(listItem) {
      return (
        <ListElement data={listItem} setDropIndex={setDropIndex} setDragObject={setDragObject} />
      );
    })
    return (
      <div>
        <h2>Drag and Drop Interface</h2>
        {listNodes}
      </div>
    );
  }
});

var ListElement = React.createClass({
  onDragStart: function(ev) {
    ev.preventDefault(); // Allow dropping
    // console.log("Dragging", this.props.data.label)
    this.props.setDragObject(this.props.data.order); // Pass in the index that you're dragging
  },
  onDragOver: function(ev) { // If something is being dragged over it
    ev.preventDefault(); // Allow dropping
    // console.log("Dragging over", this.props.data.label); // Feedback
    return false
  },
  onDrop: function(ev) {
    ev.preventDefault(); // Allow dropping
    // console.log("Dropped onto element", this.props.data.label);
    this.props.setDropIndex(this.props.data.order); // Pass in the index of the object you're dropping over
  },
  render: function() {
    return (
      <div className="list-block" draggable="true"
        onDragStart={this.onDragStart.bind(this, event)}
        onDragOver={this.onDragOver.bind(this, event)}
        onDrop={this.onDrop.bind(this, event)} >
        {this.props.data.label}
      </div>
    )
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
