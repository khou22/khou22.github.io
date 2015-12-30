/**********************************************
Dynamic HTML form created with the help of: http://www.mkyong.com/jquery/how-to-add-remove-textbox-dynamically-with-jquery/
**********************************************/

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
  getInitialState: function() {
    return {
      counter: 2
    }
  },
  submitTimes: function() {
    console.log("Submitted times");
  },
  addFields: function() {
    if(this.state.counter > 10) {
      alert("Only 10 textboxes allow");
      return false;
    }
    
    var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + this.state.counter);
    
    newTextBoxDiv.after().html('<label>Textbox #'+ this.state.counter + ' : </label>' + '<input type="text" name="textbox' + this.state.counter + '" id="textbox' + this.state.counter + '" value="" >');
    newTextBoxDiv.appendTo("#TextBoxesGroup");        
    
    this.state.counter++; //Add to counter
  },
  removeFields: function() {
    if(this.state.counter == 1) {
      alert("No more textbox to remove");
      return false;
    }
    this.state.counter--; //Remove from counter

    $("#TextBoxDiv" + this.state.counter).remove();
  },
  submitForm: function() {
    var msg = '';
    for(var i = 1; i < this.state.counter; i++){
      msg += "\n Textbox #" + i + " : " + $('#textbox' + i).val(); //Build alert string
    }
    alert(msg);
  },
  render: function() {
    return (
      <div>
        <p className="tcalc-instructions-text">
          Type your times below. You may input up to 10.
        </p>
        <div className="tcalc-input-div">
          <div id='TextBoxesGroup'>
            <div id="TextBoxDiv1">
              <label>Textbox #1 : </label><input type='textbox' id='textbox1' />
            </div>
          </div>
          <button type='button' id='addButton' onClick={this.addFields.bind(this)}>Add Button</button>
          <button type='button' id='removeButton' onClick={this.removeFields.bind(this)}>Remove Button</button>
          <button type='button' id='getButtonValue' onClick={this.submitForm.bind(this)}>Get TextBox Value</button>
        </div>
      </div>
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);