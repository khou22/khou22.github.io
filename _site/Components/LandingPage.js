//Landing page for my website

var images = new Array() //Declare array
function preload() { //Preload the images ahead of time so they don't lag
  for (i = 0; i < preload.arguments.length; i++) {
    images[i] = new Image()
    images[i].src = preload.arguments[i]
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex; //Arguments
  while (0 !== currentIndex) { //If still elements to shuffle
    randomIndex = Math.floor(Math.random() * currentIndex); //Pick random element
    currentIndex -= 1; //Subtract from total
    temporaryValue = array[currentIndex]; //Store
    array[currentIndex] = array[randomIndex]; //Set replacement
    array[randomIndex] = temporaryValue; //Set replacement
  }
  return array;
}

var LandingPage = React.createClass({
  getInitialState: function() {
    var shuffleBackgrounds = true;
    var backgrounds = [
      "./../media/site/images/backgrounds/Walnut_Poplar_Salad_Bowl.jpg",
      "./../media/site/images/backgrounds/Basket_Weave_Cutting_Board.jpg",
      "./../media/site/images/backgrounds/Bulbish_Sapele_Bowl.jpg",
      "./../media/site/images/backgrounds/Maple_Baseball_Bat.jpg"
    ];
    if (shuffleBackgrounds) { //If shuffle
      shuffle(backgrounds); //Shuffle backgrounds
    }
    setInterval(this.nextBackground.bind(this), 5000);
    for (var i = 0; i < backgrounds.length; i++) { //Cycle through backgrounds
      preload(backgrounds[i]); //Preload every background
    }
    return {
      backgroundURLs: backgrounds,
      currentBackground: 0 //Index in array of backgrounds
    };
  },
  nextBackground: function() {
    document.getElementById("backgroundDiv").classList.remove('background-fade');
    if (this.state.currentBackground < this.state.backgroundURLs.length - 1) { //if not the last background in array
      this.setState({
        currentBackground: this.state.currentBackground + 1 //Go to next background index
      });
    } else {
      this.setState({
        currentBackground: 0 //Reset index
      })
    }
    setTimeout(function() {document.getElementById("backgroundDiv").classList.add('background-fade');}, 25);
  },
  render: function() {
    var URL = this.state.backgroundURLs[this.state.currentBackground];
    var backgroundStyle = {
      backgroundImage: 'url(' + URL + ')',
    };
    return (
      <div>
        <div className="content-area">
          <ProfileBox />
          <ModalBox showModal={false} />
        </div>
        <div id="backgroundDiv" className="landing-background background-fade" style={backgroundStyle}></div>
      </div>
    );
  }
});

var ProfileBox = React.createClass({
  render: function() {
    return (
      <div>
        <div className="profile-name">
          Kevin Hou
        </div>
        <div className="profile-picture"></div>
        Click <a href="/blog">here</a> for my blog
      </div>
    );
  }
});

var ModalBox = React.createClass({
  render: function() {
    if (this.props.showModal) {
      return (
        <div aria-hidden="false" role="dialog" className="modal">
          <div className="modal__container">
            <div className="modal__header">
              Header
            </div>
            <div className="modal__content">
              Content
            </div>
            <div className="modal__footer">
              Footer
            </div>
          </div>
          <div className="modal-backdrop">
          </div>
        </div>
      );
    } else {
      return (
        <span></span>
      )
    }
  }
})

React.render(
  React.createElement(LandingPage, null),
  document.getElementById('content')
);