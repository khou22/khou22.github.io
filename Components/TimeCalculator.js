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
      counter: 2,
      minutes: [],
      seconds: []
    }
  },
  minutesToSeconds: function(minutes) {
    return (minutes * 60)
  },
  addFields: function() {
    if(this.state.counter > 10) {
      alert("Only 10 textboxes allow");
      return false;
    }
    
    var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + this.state.counter);
    
    newTextBoxDiv.after().html('<label>Time #'+ this.state.counter + ' : </label>' +
      '<input type="text" name="minutes' + this.state.counter +
      '" id="minutes' + this.state.counter + '" value="" class="tcalc-minutes-input">' +
      '<input type="text" name="seconds' + this.state.counter +
      '" id="seconds' + this.state.counter + '" value="" class="tcalc-seconds-input" >');
    newTextBoxDiv.appendTo("#TextBoxesGroup");        
    
    this.state.counter++; //Add to counter
  },
  removeFields: function() {
    if(this.state.counter == 1) { //If no more to remove
      alert("No more textbox to remove"); //Alert
      return false; //Prevent removal
    }
    this.state.counter--; //Remove from counter

    $("#TextBoxDiv" + this.state.counter).remove();
  },
  submitForm: function() {
    var msg = '';
    var minRay = [];
    var secRay = [];
    for (var i = 1; i < this.state.counter; i++){
      var min = parseInt($('#minutes' + i).val()); //Retrieve minutes value
      var sec = parseInt($('#seconds' + i).val()); //Retrieve seconds value
      minRay.push(min);
      secRay.push(sec);

      msg += "\n Time #" + i + " = " + min + ":" + sec; //Build alert string
    };

    var totalSeconds = 0;
    for (var i = 0; i < minRay.length; i++) {
      timeSeconds = this.minutesToSeconds(minRay[i]) + secRay[i];
      totalSeconds += timeSeconds;
    }
    
    //Average the times
    console.log("Total seconds:", totalSeconds);
    var average = totalSeconds/minRay.length;
    console.log("Average time:", average, "seconds")

    this.setState({
      minutes: minRay,
      seconds: secRay
    }); //Store values
    
    // alert(msg);
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
              <label>Time #1 : </label>
              <input type='textbox' name='minutes1' id='minutes1' className='tcalc-minutes-input' />
              <input type='textbox' name='seconds1' id='seconds1' className='tcalc-seconds-input' />
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